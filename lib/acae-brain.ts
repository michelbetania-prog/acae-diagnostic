export type SubFlow = "flujoOferta" | "flujoSeguimiento" | "flujoConversion" | "flujoEscala";

export type BrainScenario = "EXPLORACION" | "RIESGO_OFERTA" | "RIESGO_SEGUIMIENTO" | "RIESGO_CONVERSION" | "RIESGO_ESCALA";

export type ProblemaDetectado =
  | "Sin problema crítico"
  | "Oferta poco clara"
  | "Seguimiento inconsistente"
  | "Conversión bloqueada"
  | "Escalabilidad frágil";

export type BrainQuestion = {
  id: string;
  flow: SubFlow;
  text: string;
  dimension: "atraccion" | "conversion" | "autoridad" | "escalabilidad";
  level: "base" | "causa";
};

export type BrainState = {
  escenario: BrainScenario;
  problemaDetectado: ProblemaDetectado;
  respuestas: Record<string, number>;
  askedQuestionIds: string[];
  criticalFocus: SubFlow | null;
  conversationNotes: string[];
  blocked: boolean;
  blockedReason: string | null;
  clarityScore: number;
  rootCauseConfirmed: boolean;
};

const QUESTION_BANK: Record<SubFlow, BrainQuestion[]> = {
  flujoOferta: [
    {
      id: "oferta-1",
      flow: "flujoOferta",
      text: "¿Qué tan claro es el resultado concreto que promete tu oferta?",
      dimension: "autoridad",
      level: "base"
    },
    {
      id: "oferta-2",
      flow: "flujoOferta",
      text: "¿Tu cliente ideal entiende por qué elegirte en menos de 30 segundos?",
      dimension: "atraccion",
      level: "base"
    },
    {
      id: "oferta-3",
      flow: "flujoOferta",
      text: "¿Tienes evidencia de que el mercado está dispuesto a pagar hoy?",
      dimension: "conversion",
      level: "base"
    },
    {
      id: "oferta-causa-1",
      flow: "flujoOferta",
      text: "¿La causa real es mensaje confuso, nicho incorrecto o promesa débil?",
      dimension: "autoridad",
      level: "causa"
    }
  ],
  flujoSeguimiento: [
    {
      id: "seguimiento-1",
      flow: "flujoSeguimiento",
      text: "¿Tus leads reciben seguimiento dentro de 24 horas?",
      dimension: "conversion",
      level: "base"
    },
    {
      id: "seguimiento-2",
      flow: "flujoSeguimiento",
      text: "¿Tienes una secuencia definida para dar seguimiento sin improvisar?",
      dimension: "escalabilidad",
      level: "base"
    },
    {
      id: "seguimiento-3",
      flow: "flujoSeguimiento",
      text: "¿Mides cuántos leads se pierden por falta de seguimiento?",
      dimension: "conversion",
      level: "base"
    },
    {
      id: "seguimiento-causa-1",
      flow: "flujoSeguimiento",
      text: "¿La causa real es falta de proceso, disciplina comercial o responsable claro?",
      dimension: "conversion",
      level: "causa"
    }
  ],
  flujoConversion: [
    {
      id: "conversion-1",
      flow: "flujoConversion",
      text: "¿Tu proceso comercial convierte de forma predecible cada semana?",
      dimension: "conversion",
      level: "base"
    },
    {
      id: "conversion-2",
      flow: "flujoConversion",
      text: "¿Tu equipo domina objeciones clave antes del cierre?",
      dimension: "autoridad",
      level: "base"
    },
    {
      id: "conversion-3",
      flow: "flujoConversion",
      text: "¿Conoces tu tasa de cierre por canal y segmento?",
      dimension: "escalabilidad",
      level: "base"
    },
    {
      id: "conversion-causa-1",
      flow: "flujoConversion",
      text: "¿La causa real del bajo cierre está en oferta, proceso o calificación de leads?",
      dimension: "conversion",
      level: "causa"
    }
  ],
  flujoEscala: [
    {
      id: "escala-1",
      flow: "flujoEscala",
      text: "¿El negocio puede crecer sin aumentar tu carga operativa directa?",
      dimension: "escalabilidad",
      level: "base"
    },
    {
      id: "escala-2",
      flow: "flujoEscala",
      text: "¿Tienes procesos comerciales documentados y delegables?",
      dimension: "escalabilidad",
      level: "base"
    },
    {
      id: "escala-3",
      flow: "flujoEscala",
      text: "¿Tu adquisición está diversificada en más de un canal rentable?",
      dimension: "atraccion",
      level: "base"
    },
    {
      id: "escala-causa-1",
      flow: "flujoEscala",
      text: "¿La causa real del freno es dependencia del fundador, baja automatización o márgenes débiles?",
      dimension: "escalabilidad",
      level: "causa"
    }
  ]
};

const FLOW_ORDER: SubFlow[] = ["flujoOferta", "flujoSeguimiento", "flujoConversion", "flujoEscala"];

export function createInitialBrainState(): BrainState {
  return {
    escenario: "EXPLORACION",
    problemaDetectado: "Sin problema crítico",
    respuestas: {},
    askedQuestionIds: [],
    criticalFocus: null,
    conversationNotes: [],
    blocked: false,
    blockedReason: null,
    clarityScore: 0,
    rootCauseConfirmed: false
  };
}

function mapProblem(flow: SubFlow): ProblemaDetectado {
  if (flow === "flujoOferta") return "Oferta poco clara";
  if (flow === "flujoSeguimiento") return "Seguimiento inconsistente";
  if (flow === "flujoConversion") return "Conversión bloqueada";
  return "Escalabilidad frágil";
}

function mapScenario(flow: SubFlow): BrainScenario {
  if (flow === "flujoOferta") return "RIESGO_OFERTA";
  if (flow === "flujoSeguimiento") return "RIESGO_SEGUIMIENTO";
  if (flow === "flujoConversion") return "RIESGO_CONVERSION";
  return "RIESGO_ESCALA";
}

export function validateResponse(score: number, note: string): { valid: boolean; reason?: string } {
  const trimmed = note.trim();
  if (score <= 3 && trimmed.length < 12) {
    return {
      valid: false,
      reason: "Respuesta vaga: explica con más detalle qué está pasando en tu negocio."
    };
  }

  const vaguePatterns = ["no sé", "tal vez", "más o menos", "normal", "todo bien"];
  if (trimmed && vaguePatterns.some((pattern) => trimmed.toLowerCase().includes(pattern))) {
    return {
      valid: false,
      reason: "Detecté ambigüedad. Necesito una respuesta concreta para seguir."
    };
  }

  return { valid: true };
}

function countCriticalByFlow(state: BrainState): Record<SubFlow, number> {
  const counter: Record<SubFlow, number> = {
    flujoOferta: 0,
    flujoSeguimiento: 0,
    flujoConversion: 0,
    flujoEscala: 0
  };

  FLOW_ORDER.forEach((flow) => {
    QUESTION_BANK[flow].forEach((question) => {
      const value = state.respuestas[question.id];
      if (typeof value === "number" && value <= 2) counter[flow] += 1;
    });
  });

  return counter;
}

export function registerAnswer(state: BrainState, question: BrainQuestion, value: number, note?: string): BrainState {
  const next: BrainState = {
    ...state,
    respuestas: { ...state.respuestas, [question.id]: value },
    askedQuestionIds: state.askedQuestionIds.includes(question.id)
      ? state.askedQuestionIds
      : [...state.askedQuestionIds, question.id],
    conversationNotes: note ? [...state.conversationNotes, note] : state.conversationNotes,
    blocked: false,
    blockedReason: null
  };

  if (question.id.startsWith("oferta") && question.level === "base") {
    const currentClarity = next.clarityScore + value;
    next.clarityScore = currentClarity;
  }

  const repeatedCritical = countCriticalByFlow(next);
  const dominantFlow = FLOW_ORDER.sort((a, b) => repeatedCritical[b] - repeatedCritical[a])[0];

  if (repeatedCritical[dominantFlow] >= 2) {
    next.criticalFocus = dominantFlow;
    next.problemaDetectado = mapProblem(dominantFlow);
    next.escenario = mapScenario(dominantFlow);
  }

  if (question.level === "causa" && value <= 3) {
    next.rootCauseConfirmed = true;
  }

  return next;
}

function pickQuestion(state: BrainState, flow: SubFlow, level: "base" | "causa"): BrainQuestion | null {
  return (
    QUESTION_BANK[flow].find((question) => question.level === level && !state.askedQuestionIds.includes(question.id)) ?? null
  );
}

export function getNextQuestion(state: BrainState): BrainQuestion | null {
  if (state.criticalFocus) {
    const causeQuestion = pickQuestion(state, state.criticalFocus, "causa");
    if (causeQuestion) return causeQuestion;
  }

  for (const flow of FLOW_ORDER) {
    const pending = pickQuestion(state, flow, "base");
    if (pending) return pending;
  }

  return null;
}

export function buildSystemReply(state: BrainState): string {
  if (state.blocked && state.blockedReason) {
    return `No puedo avanzar todavía: ${state.blockedReason}`;
  }

  if (state.problemaDetectado === "Sin problema crítico") {
    return "Seguimos afinando diagnóstico. Necesito precisión para evitar recomendaciones superficiales.";
  }

  if (state.rootCauseConfirmed) {
    return `Confirmé causa raíz en ${state.problemaDetectado.toLowerCase()}. Ahora sí podemos diseñar ejecución accionable.`;
  }

  return `Detecté patrón repetido en ${state.problemaDetectado.toLowerCase()}. Voy a profundizar en causa real, no en síntomas.`;
}

export function canGenerateStrategicOutput(state: BrainState): { allowed: boolean; reason?: string } {
  if (state.clarityScore < 8) {
    return {
      allowed: false,
      reason: "Bloqueado: no hay claridad suficiente de idea/oferta. Debes definir mejor la base estratégica."
    };
  }

  if (!state.rootCauseConfirmed && state.problemaDetectado !== "Sin problema crítico") {
    return {
      allowed: false,
      reason: "Bloqueado: aún no está confirmada la causa raíz."
    };
  }

  return { allowed: true };
}

export function mapBrainToAcaeAnswers(state: BrainState): Record<number, number> {
  const defaultValue = 2;
  const scoreByDimension = {
    atraccion: [] as number[],
    conversion: [] as number[],
    autoridad: [] as number[],
    escalabilidad: [] as number[]
  };

  FLOW_ORDER.forEach((flow) => {
    QUESTION_BANK[flow].forEach((question) => {
      const value = state.respuestas[question.id];
      if (typeof value === "number") {
        scoreByDimension[question.dimension].push(value);
      }
    });
  });

  const avg = (dimension: keyof typeof scoreByDimension) => {
    const values = scoreByDimension[dimension];
    if (!values.length) return defaultValue;
    return Math.max(1, Math.min(5, Math.round(values.reduce((acc, value) => acc + value, 0) / values.length)));
  };

  return {
    1: avg("atraccion"),
    2: avg("atraccion"),
    3: avg("atraccion"),
    4: avg("conversion"),
    5: avg("conversion"),
    6: avg("conversion"),
    7: avg("autoridad"),
    8: avg("autoridad"),
    9: avg("autoridad"),
    10: avg("escalabilidad"),
    11: avg("escalabilidad"),
    12: avg("escalabilidad")
  };
}

export function getBrainProgress(state: BrainState): { asked: number; total: number } {
  const total = FLOW_ORDER.reduce((acc, flow) => acc + QUESTION_BANK[flow].length, 0);
  return {
    asked: state.askedQuestionIds.length,
    total
  };
}
