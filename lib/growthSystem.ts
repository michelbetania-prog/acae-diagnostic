import { ACAEScore, calculateACAE } from "@/lib/calculateACAE";
import {
  ActionPlan,
  BusinessDimension,
  BusinessStage,
  DiagnosticResult as MatrixDiagnosticResult,
  generateActionPlan
} from "@/lib/acaeMatrix";

export type PlanType = "free" | "standard" | "pro";
export type TaskStatus = "pending" | "completed";

export type ActionTask = {
  id: string;
  title: string;
  description: string;
  dimension: string;
  status: TaskStatus;
  due_date: string;
};

export type DiagnosticResult = {
  id: string;
  createdAt: string;
  answers: Record<number, number>;
  score: ACAEScore;
  weakestDimension: string;
  plan: string[];
  tasks: ActionTask[];
  businessStage: BusinessStage;
  priorities: BusinessDimension[];
  strategicFocus: string;
};

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

const dimensionLabels: Record<BusinessDimension, string> = {
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

function scoreToMatrixResult(score: ACAEScore): MatrixDiagnosticResult {
  return {
    attraction: score.atraccion,
    conversion: score.conversion,
    automation: score.autoridad,
    scale: score.escalabilidad,
    total: score.total
  };
}

function createTasksFromPlan(plan: ActionPlan): ActionTask[] {
  return plan.tasks.map((item, idx) => ({
    id: `task-${Date.now()}-${idx}`,
    title: item.title,
    description: item.description,
    dimension: dimensionLabels[item.dimension],
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

  const score = calculateACAE(answers);
  const matrixResult = scoreToMatrixResult(score);
  const actionPlan = generateActionPlan(matrixResult);
  const tasks = createTasksFromPlan(actionPlan);

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
  const tasks = getAllTasks(state);
  if (!tasks.length) return 0;
  const completed = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}

export function getLatestDiagnostic(state: GrowthState): DiagnosticResult | null {
  return state.diagnostics.length ? state.diagnostics[state.diagnostics.length - 1] : null;
}

export function getSessionsAvailable(plan: PlanType) {
  return sessionsByPlan[plan];
}

export function getProgressComparison(state: GrowthState) {
  if (state.diagnostics.length < 2) return null;
  const first = state.diagnostics[0].score;
  const latest = state.diagnostics[state.diagnostics.length - 1].score;

  return {
    firstTotal: first.total,
    latestTotal: latest.total,
    deltaTotal: latest.total - first.total,
    dimensions: {
      atraccion: latest.atraccion - first.atraccion,
      conversion: latest.conversion - first.conversion,
      autoridad: latest.autoridad - first.autoridad,
      escalabilidad: latest.escalabilidad - first.escalabilidad
    }
  };
}
