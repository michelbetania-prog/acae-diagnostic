import { ACAEScore, calculateACAE } from "@/lib/calculateACAE";
import { ActionPlanBase, DiagnosticRecord, Task, TaskStatus } from "@/lib/types";
import { generateActionPlan } from "@/lib/actionPlanEngine";
import { processDiagnosticAnswers } from "@/lib/diagnosticEngine";
import { calculateBusinessProgress, getTaskProgress as getTaskProgressFromEngine } from "@/lib/progressEngine";

/**
 * -----------------------------------------------------------------------------
 * ACAE GROWTH SYSTEM - STRATEGIC BRAIN
 * -----------------------------------------------------------------------------
 * Este archivo mantiene compatibilidad con la lógica actual del dashboard,
 * y además incorpora un motor estratégico modular para análisis automático
 * de negocios basado en input estructurado.
 * -----------------------------------------------------------------------------
 */

// ============================================
// SECCIÓN 1: Tipos del motor estratégico nuevo
// ============================================

export interface StrategicInput {
  trafficSources: string[];
  monthlyLeads: number;
  conversionRate: number; // porcentaje (0-100)
  hasCRM: boolean;
  hasSalesScript: boolean;
  teamSize: number;
  monthlyRevenue: number;
  mainChannel: string;
  founderRole: string;
  marketingConsistency: number; // escala 0-10
}

export interface ACAEStrategicScore {
  attraction: number; // 0-15
  conversion: number; // 0-15
  automation: number; // 0-15
  scale: number; // 0-15
  total: number; // 0-60
}

export interface FounderTypeResult {
  type: string;
  description: string;
  riskLevel: "bajo" | "medio" | "alto";
}

export interface StrategicPlan {
  priorities: string[];
  actions: string[];
}

export interface StrategicAnalysisResult {
  score: ACAEStrategicScore;
  founderType: FounderTypeResult;
  problems: string[];
  plan: StrategicPlan;
}

export type StrategicScenario =
  | "SIN_VENTAS"
  | "TRAFICO_SIN_CONVERSION"
  | "VENTAS_INCONSISTENTES"
  | "DEPENDENCIA_REFERIDOS"
  | "MUCHA_AUDIENCIA_POCA_VENTA"
  | "ESCALAR";

export interface ScenarioInput {
  ventas: number;
  trafico: number;
  conversion: number;
  ventas_irregulares: boolean;
  origen: string;
  seguidores: number;
}

// ============================================
// SECCIÓN 2: Funciones del motor estratégico
// ============================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function addPoints(current: number, points: number): number {
  return clamp(current + points, 0, 15);
}

/**
 * Detecta el escenario comercial actual para orientar la prioridad estratégica.
 */
export function detectarEscenario(input: ScenarioInput): StrategicScenario {
  if (input.ventas === 0) return "SIN_VENTAS";

  if (input.trafico > 1000 && input.conversion < 1) {
    return "TRAFICO_SIN_CONVERSION";
  }

  if (input.ventas_irregulares) return "VENTAS_INCONSISTENTES";

  if (input.origen === "referidos") return "DEPENDENCIA_REFERIDOS";

  if (input.seguidores > 10000 && input.ventas < 10) {
    return "MUCHA_AUDIENCIA_POCA_VENTA";
  }

  return "ESCALAR";
}

/**
 * PASO 1
 * Calcula score ACAE (0-15 por dimensión)
 */
export function calculateACAEScore(input: StrategicInput): ACAEStrategicScore {
  let attraction = 0;
  let conversion = 0;
  let automation = 0;
  let scale = 0;

  // A - Atracción
  if (input.trafficSources.length > 3) attraction = addPoints(attraction, 6);
  else if (input.trafficSources.length >= 2) attraction = addPoints(attraction, 4);
  else if (input.trafficSources.length >= 1) attraction = addPoints(attraction, 2);

  if (input.monthlyLeads >= 200) attraction = addPoints(attraction, 5);
  else if (input.monthlyLeads >= 80) attraction = addPoints(attraction, 3);
  else if (input.monthlyLeads > 0) attraction = addPoints(attraction, 1);

  attraction = addPoints(attraction, Math.round(clamp(input.marketingConsistency, 0, 10) * 0.4));

  // C - Conversión
  if (input.conversionRate > 10) conversion = addPoints(conversion, 8);
  else if (input.conversionRate > 5) conversion = addPoints(conversion, 6);
  else if (input.conversionRate > 2) conversion = addPoints(conversion, 4);
  else if (input.conversionRate > 0) conversion = addPoints(conversion, 2);

  if (input.hasSalesScript) conversion = addPoints(conversion, 4);
  if (input.monthlyLeads > 0 && input.mainChannel.trim().length > 0) conversion = addPoints(conversion, 2);

  // A - Automatización
  if (input.hasCRM) automation = addPoints(automation, 7);
  if (input.hasSalesScript) automation = addPoints(automation, 3);
  if (input.marketingConsistency >= 7) automation = addPoints(automation, 3);
  if (input.monthlyLeads >= 100) automation = addPoints(automation, 2);

  // E - Escala
  if (input.teamSize > 10) scale = addPoints(scale, 7);
  else if (input.teamSize > 3) scale = addPoints(scale, 5);
  else if (input.teamSize > 1) scale = addPoints(scale, 3);
  else scale = addPoints(scale, 1);

  if (input.monthlyRevenue >= 50000) scale = addPoints(scale, 5);
  else if (input.monthlyRevenue >= 15000) scale = addPoints(scale, 3);
  else if (input.monthlyRevenue > 0) scale = addPoints(scale, 1);

  if (input.hasCRM && input.trafficSources.length >= 2) scale = addPoints(scale, 3);

  const total = attraction + conversion + automation + scale;

  return { attraction, conversion, automation, scale, total };
}

/**
 * PASO 2
 * Detecta problemas estratégicos con base en score.
 */
export function detectBusinessProblems(score: ACAEStrategicScore): string[] {
  const problems: string[] = [];

  if (score.attraction < 5) problems.push("Baja visibilidad");
  if (score.conversion < 5) problems.push("Problema de conversión");
  if (score.automation < 5) problems.push("Dependencia del fundador");
  if (score.scale < 5) problems.push("Negocio no escalable");

  if (score.attraction >= 8 && score.conversion < 5) {
    problems.push("Tráfico sin monetización efectiva");
  }

  if (score.total < 20) {
    problems.push("Modelo de negocio en etapa frágil");
  }

  return [...new Set(problems)];
}

/**
 * PASO 3
 * Detecta tipo de emprendedor (mínimo 12 tipos).
 */
export function detectFounderType(input: StrategicInput, score?: ACAEStrategicScore): FounderTypeResult {
  const s = score ?? calculateACAEScore(input);

  const isSolo = input.teamSize <= 1;
  const lowValidation = input.monthlyLeads < 40;
  const lowConversion = input.conversionRate < 3;
  const lowAutomation = !input.hasCRM;
  const lowFocus = input.marketingConsistency < 4;
  const highRevenue = input.monthlyRevenue >= 15000;

  if (s.attraction >= 8 && s.conversion < 5 && lowFocus) {
    return {
      type: "Visionario caótico",
      description: "Genera movimiento, pero sin foco estratégico ni sistema de conversión estable.",
      riskLevel: "alto"
    };
  }

  if (input.founderRole.toLowerCase().includes("tech") && isSolo && lowAutomation) {
    return {
      type: "Técnico saturado",
      description: "Alta carga operativa técnica, baja capacidad comercial y de sistematización.",
      riskLevel: "alto"
    };
  }

  if (input.marketingConsistency < 3 && input.trafficSources.length <= 1) {
    return {
      type: "Emprendedor improvisado",
      description: "Toma decisiones reactivas sin un sistema claro de adquisición y ejecución.",
      riskLevel: "alto"
    };
  }

  if (s.conversion >= 9 && s.attraction <= 6) {
    return {
      type: "Vendedor natural",
      description: "Convierte bien cuando tiene oportunidades, pero depende de flujo irregular de leads.",
      riskLevel: "medio"
    };
  }

  if (s.attraction >= 7 && lowConversion) {
    return {
      type: "Creativo bloqueado",
      description: "Tiene ideas y visibilidad, pero su oferta y conversión no están estructuradas.",
      riskLevel: "medio"
    };
  }

  if (isSolo && highRevenue && lowAutomation) {
    return {
      type: "Operador atrapado",
      description: "El negocio funciona, pero depende excesivamente del fundador para operar.",
      riskLevel: "alto"
    };
  }

  if (isSolo && input.monthlyRevenue > 0 && s.scale >= 6 && s.scale < 10) {
    return {
      type: "Freelancer escalando",
      description: "Ya vende, pero aún necesita procesos para pasar de autoempleo a negocio escalable.",
      riskLevel: "medio"
    };
  }

  if (s.total >= 42 && input.teamSize >= 4 && input.hasCRM) {
    return {
      type: "Empresario estructurado",
      description: "Cuenta con base comercial y operativa sólida para escalar con control.",
      riskLevel: "bajo"
    };
  }

  if (lowValidation && input.monthlyRevenue <= 0 && input.trafficSources.length > 2) {
    return {
      type: "Innovador sin mercado",
      description: "Tiene propuesta interesante, pero sin señal de demanda validada.",
      riskLevel: "alto"
    };
  }

  if (input.mainChannel.toLowerCase().includes("instagram") && input.trafficSources.length === 1) {
    return {
      type: "Marca personal dependiente",
      description: "El crecimiento depende de un único canal/persona, con riesgo de estancamiento.",
      riskLevel: "medio"
    };
  }

  if (input.founderRole.toLowerCase().includes("consult") && !input.hasCRM) {
    return {
      type: "Experto sin sistema",
      description: "Alto conocimiento técnico, pero sin estructura comercial reproducible.",
      riskLevel: "medio"
    };
  }

  if (isSolo && input.hasSalesScript === false && s.scale < 7) {
    return {
      type: "Negocio artesanal",
      description: "Oferta manual y personalizada con baja estandarización para crecer.",
      riskLevel: "medio"
    };
  }

  return {
    type: "Emprendedor en transición",
    description: "El negocio muestra señales mixtas; requiere foco para consolidar su siguiente etapa.",
    riskLevel: "medio"
  };
}

/**
 * PASO 4
 * Genera plan estratégico basado en problemas detectados.
 */
export function generateStrategicPlan(problems: string[]): StrategicPlan {
  const priorities: string[] = [];
  const actions: string[] = [];

  const hasProblem = (problemName: string) => problems.includes(problemName);

  if (hasProblem("Baja visibilidad")) {
    priorities.push("Definir nicho y posicionamiento de atracción");
    actions.push("Definir ICP y dolor principal", "Diseñar estrategia de contenido semanal", "Implementar sistema de tráfico multicanal");
  }

  if (hasProblem("Problema de conversión") || hasProblem("Tráfico sin monetización efectiva")) {
    priorities.push("Crear oferta clara y sistema comercial");
    actions.push("Rediseñar propuesta de valor", "Crear landing page orientada a conversión", "Implementar script de ventas con objeciones");
  }

  if (hasProblem("Dependencia del fundador")) {
    priorities.push("Sistematizar operación y automatizar procesos");
    actions.push("Implementar CRM básico", "Automatizar seguimiento de leads", "Definir SOPs y delegación por etapas");
  }

  if (hasProblem("Negocio no escalable")) {
    priorities.push("Diseñar estructura de escala");
    actions.push("Definir roles críticos y métricas por área", "Crear tablero semanal de KPIs", "Estandarizar delivery para crecer sin colapso");
  }

  if (hasProblem("Modelo de negocio en etapa frágil")) {
    priorities.push("Validar modelo de negocio y viabilidad mínima");
    actions.push("Realizar entrevistas de validación", "Testear oferta mínima pagada", "Priorizar un canal principal por 90 días");
  }

  if (!priorities.length) {
    priorities.push("Optimizar sistema integral de crecimiento");
    actions.push("Aumentar ticket promedio", "Diversificar canales de adquisición", "Fortalecer automatización comercial");
  }

  return {
    priorities: [...new Set(priorities)],
    actions: [...new Set(actions)]
  };
}

/**
 * PASO 5
 * Función principal que orquesta todo el análisis estratégico.
 */
export function runStrategicAnalysis(input: StrategicInput): StrategicAnalysisResult {
  const score = calculateACAEScore(input);
  const problems = detectBusinessProblems(score);
  const founderType = detectFounderType(input, score);
  const plan = generateStrategicPlan(problems);

  return {
    score,
    founderType,
    problems,
    plan
  };
}

// ==================================================
// SECCIÓN 3: Compatibilidad con dashboard actual (UI)
// ==================================================

export type PlanType = "free" | "standard" | "pro";
export type ActionTask = Task;
export type DiagnosticResult = DiagnosticRecord;

export type GrowthState = {
  plan: PlanType;
  diagnostics: DiagnosticResult[];
};

export type SessionStepStatus = "pending" | "completed";
export type SessionStatus = "locked" | "active" | "completed";

export type SessionStep = {
  id: string;
  title: string;
  objective: string;
  instructions: string[];
  example: string;
  warning: string;
  feedback: string;
  status: SessionStepStatus;
};

export type JourneySession = {
  id: string;
  title: string;
  objective: string;
  status: SessionStatus;
  completionFeedback: string;
  steps: SessionStep[];
};

const STORAGE_KEY = "acae_growth_system";
const JOURNEY_KEY = "acae_growth_journey";
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

function createJourneyTemplate(diagnostic: DiagnosticResult): JourneySession[] {
  const baseSteps = diagnostic.plan.slice(0, 3);
  const fallbackSteps = [
    "Definir una prioridad estratégica semanal",
    "Implementar rutina comercial con revisión diaria",
    "Medir resultados y ajustar la ejecución"
  ];
  const steps = (baseSteps.length ? baseSteps : fallbackSteps).slice(0, 3);

  const createSteps = (sessionId: string, sessionName: string) =>
    steps.map((step, idx) => ({
      id: `${sessionId}-step-${idx + 1}`,
      title: step,
      objective: `Completar "${step}" para consolidar la etapa ${idx + 1} del sistema comercial.`,
      instructions: [
        "Define responsable y fecha límite del paso.",
        "Ejecuta una versión mínima en menos de 48 horas.",
        "Mide resultado y documenta ajuste para repetir."
      ],
      example: `Ejemplo real: en ${sessionName}, convierte "${step}" en una acción concreta con responsable y fecha.`,
      warning: "Error común: ejecutar sin métricas de validación ni seguimiento semanal.",
      feedback: `Buen avance: este paso fortalece la ${diagnostic.weakestDimension.toLowerCase()} y reduce fricción operativa.`,
      status: "pending" as SessionStepStatus
    }));

  return [
    {
      id: "session-1",
      title: "Etapa 1 · Alinear enfoque",
      objective: "Concentrar al negocio en la prioridad crítica para evitar dispersión.",
      status: "active",
      completionFeedback: "Sesión completada: ya tienes claridad estratégica para ejecutar con enfoque.",
      steps: createSteps("session-1", "Etapa 1")
    },
    {
      id: "session-2",
      title: "Etapa 2 · Ejecutar sistema",
      objective: "Convertir la estrategia en un sistema de ejecución repetible.",
      status: "locked",
      completionFeedback: "Sesión completada: tu ejecución ahora es más consistente y medible.",
      steps: createSteps("session-2", "Etapa 2")
    },
    {
      id: "session-3",
      title: "Etapa 3 · Escalar controladamente",
      objective: "Escalar resultados sin perder margen, foco ni control operativo.",
      status: "locked",
      completionFeedback: "Sesión completada: estás listo para escalar con disciplina de crecimiento.",
      steps: createSteps("session-3", "Etapa 3")
    }
  ];
}

type JourneyStore = Record<string, JourneySession[]>;

function readJourneyStore(): JourneyStore {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(JOURNEY_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as JourneyStore;
  } catch {
    return {};
  }
}

function saveJourneyStore(store: JourneyStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(JOURNEY_KEY, JSON.stringify(store));
}

export function getJourneySessions(diagnostic: DiagnosticResult): JourneySession[] {
  const store = readJourneyStore();
  const existing = store[diagnostic.id];
  if (existing?.length) return existing;

  const initial = createJourneyTemplate(diagnostic);
  const nextStore: JourneyStore = { ...store, [diagnostic.id]: initial };
  saveJourneyStore(nextStore);
  return initial;
}

function allStepsCompleted(session: JourneySession): boolean {
  return session.steps.every((step) => step.status === "completed");
}

export function completeJourneyStep(
  diagnosticId: string,
  sessionId: string,
  stepId: string
): { sessions: JourneySession[]; stepFeedback: string; sessionFeedback: string | null } {
  const store = readJourneyStore();
  const sessions = store[diagnosticId] ?? [];
  let stepFeedback = "Paso actualizado.";
  let sessionFeedback: string | null = null;

  const updated = sessions.map((session) => {
    if (session.id !== sessionId) return session;
    if (session.status === "locked") return session;

    const steps = session.steps.map((step) => {
      if (step.id !== stepId) return step;
      stepFeedback = step.feedback;
      return { ...step, status: "completed" as SessionStepStatus };
    });

    const nextSession = { ...session, steps };
    if (allStepsCompleted(nextSession)) {
      sessionFeedback = nextSession.completionFeedback;
      return { ...nextSession, status: "completed" as SessionStatus };
    }
    return nextSession;
  });

  const unlocked = updated.map((session, idx) => {
    if (session.status !== "locked") return session;
    const prev = updated[idx - 1];
    if (idx === 0 || prev?.status === "completed") {
      return { ...session, status: "active" as SessionStatus };
    }
    return session;
  });

  const normalized = unlocked.map((session, idx) => {
    if (session.status === "active") {
      const hasEarlierActive = unlocked.slice(0, idx).some((item) => item.status === "active");
      if (hasEarlierActive) return { ...session, status: "locked" as SessionStatus };
    }
    return session;
  });

  saveJourneyStore({ ...store, [diagnosticId]: normalized });
  return { sessions: normalized, stepFeedback, sessionFeedback };
}

export function getJourneyProgress(sessions: JourneySession[]) {
  const totalSteps = sessions.reduce((acc, session) => acc + session.steps.length, 0);
  const completedSteps = sessions.reduce(
    (acc, session) => acc + session.steps.filter((step) => step.status === "completed").length,
    0
  );

  return {
    totalSteps,
    completedSteps,
    percent: totalSteps ? Math.round((completedSteps / totalSteps) * 100) : 0
  };
}
