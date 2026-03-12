import { ACAEScore, calculateACAE } from "@/lib/calculateACAE";
import { ActionPlanBase, DiagnosticRecord, Task, TaskStatus } from "@/lib/types";
import { generateActionPlan } from "@/lib/actionPlanEngine";
import { processDiagnosticAnswers } from "@/lib/diagnosticEngine";
import { calculateBusinessProgress, getTaskProgress as getTaskProgressFromEngine } from "@/lib/progressEngine";

export type PlanType = "free" | "standard" | "pro";
export type ActionTask = Task;
export type DiagnosticResult = DiagnosticRecord;

export type GrowthState = {
  plan: PlanType;
  diagnostics: DiagnosticResult[];
};

const STORAGE_KEY = "acae_growth_system";
const DELAY_DAYS = 7;

const planLimits: Record<PlanType, number> = {
  free: 1,
  standard: 3,
  pro: 4
};

const sessionsByPlan: Record<PlanType, number> = {
  free: 0,
  standard: 1,
  pro: 2
};

const dimensionLabels: Record<ActionPlanBase["priorities"][number], string> = {
  attraction: "Atracción",
  conversion: "Conversión",
  automation: "Automatización",
  scale: "Escala"
};

function plusDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function createTasksFromActionPlan(actionPlan: ActionPlanBase): ActionTask[] {
  return actionPlan.tasks.map((task, idx) => ({
    id: `task-${Date.now()}-${idx}`,
    title: task.title,
    description: `Ejecutar acción de ${dimensionLabels[task.dimension].toLowerCase()} para mejorar el negocio.`,
    dimension: dimensionLabels[task.dimension],
    status: "pending",
    due_date: plusDays((idx + 1) * 7)
  }));
}

export function getDefaultGrowthState(): GrowthState {
  return {
    plan: "free",
    diagnostics: []
  };
}

export function getGrowthState(): GrowthState {
  if (typeof window === "undefined") return getDefaultGrowthState();
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return getDefaultGrowthState();

  try {
    return JSON.parse(raw) as GrowthState;
  } catch {
    return getDefaultGrowthState();
  }
}

export function saveGrowthState(state: GrowthState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function updatePlan(plan: PlanType) {
  const state = getGrowthState();
  const next = { ...state, plan };
  saveGrowthState(next);
  return next;
}

export function getPlanLimit(plan: PlanType) {
  return planLimits[plan];
}

export function getNextAvailableDate(state: GrowthState): Date | null {
  if (!state.diagnostics.length) return null;
  const last = new Date(state.diagnostics[state.diagnostics.length - 1].createdAt);
  const next = new Date(last);
  next.setDate(last.getDate() + DELAY_DAYS);
  return next;
}

export function canRunDiagnostic(state: GrowthState) {
  const countLimit = state.diagnostics.length < planLimits[state.plan];
  const next = getNextAvailableDate(state);
  const delayReady = !next || new Date() >= next;
  return {
    allowed: countLimit && delayReady,
    remaining: Math.max(planLimits[state.plan] - state.diagnostics.length, 0),
    nextDate: next
  };
}

export function runDiagnostic(answers: Record<number, number>) {
  const state = getGrowthState();
  const permission = canRunDiagnostic(state);
  if (!permission.allowed) {
    return { state, created: null, permission };
  }

  const score: ACAEScore = calculateACAE(answers);
  const matrixInput = processDiagnosticAnswers(answers);
  const actionPlan = generateActionPlan(matrixInput);
  const tasks = createTasksFromActionPlan(actionPlan);

  const created: DiagnosticResult = {
    id: `diag-${Date.now()}`,
    createdAt: new Date().toISOString(),
    answers,
    score,
    weakestDimension: dimensionLabels[actionPlan.priorities[0]],
    plan: actionPlan.tasks.map((task) => task.title),
    tasks,
    businessStage: actionPlan.businessStage,
    priorities: actionPlan.priorities,
    strategicFocus: actionPlan.strategicFocus
  };

  const next: GrowthState = {
    ...state,
    diagnostics: [...state.diagnostics, created]
  };

  saveGrowthState(next);
  localStorage.setItem("acae_answers", JSON.stringify(answers));
  return { state: next, created, permission: canRunDiagnostic(next) };
}

export function getAllTasks(state: GrowthState): ActionTask[] {
  return state.diagnostics.flatMap((d) => d.tasks);
}

export function toggleTask(taskId: string, done: boolean) {
  const state = getGrowthState();
  const diagnostics = state.diagnostics.map((diag) => ({
    ...diag,
    tasks: diag.tasks.map((task) =>
      task.id === taskId
        ? { ...task, status: (done ? "completed" : "pending") as TaskStatus }
        : task
    )
  }));

  const next: GrowthState = { ...state, diagnostics };
  saveGrowthState(next);
  return next;
}

export function getTaskProgress(state: GrowthState) {
  return getTaskProgressFromEngine(getAllTasks(state));
}

export function getLatestDiagnostic(state: GrowthState): DiagnosticResult | null {
  return state.diagnostics.length ? state.diagnostics[state.diagnostics.length - 1] : null;
}

export function getSessionsAvailable(plan: PlanType) {
  return sessionsByPlan[plan];
}

export function getProgressComparison(state: GrowthState) {
  if (state.diagnostics.length < 2) return null;

  const progression = calculateBusinessProgress(state.diagnostics);
  const first = state.diagnostics[0].score;
  const latest = state.diagnostics[state.diagnostics.length - 1].score;

  return {
    firstTotal: progression.firstTotal,
    latestTotal: progression.latestTotal,
    deltaTotal: progression.deltaTotal,
    dimensions: {
      atraccion: latest.atraccion - first.atraccion,
      conversion: latest.conversion - first.conversion,
      autoridad: latest.autoridad - first.autoridad,
      escalabilidad: latest.escalabilidad - first.escalabilidad
    }
  };
}
