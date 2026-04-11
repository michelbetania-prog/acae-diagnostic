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
};

export type BrainState = {
  escenario: BrainScenario;
  problemaDetectado: ProblemaDetectado;
  respuestas: Record<string, number>;
  askedQuestionIds: string[];
  criticalFocus: SubFlow | null;
  conversationNotes: string[];
};

const QUESTION_BANK: Record<SubFlow, BrainQuestion[]> = {
  flujoOferta: [
    {
      id: "oferta-1",
      flow: "flujoOferta",
      text: "¿Qué tan claro es el resultado concreto que promete tu oferta?",
      dimension: "autoridad"
    },
    {
      id: "oferta-2",
      flow: "flujoOferta",
      text: "¿Tu cliente ideal entiende por qué elegirte en menos de 30 segundos?",
      dimension: "atraccion"
    },
    {
      id: "oferta-3",
      flow: "flujoOferta",
      text: "¿Tienes evidencia de que el mercado está dispuesto a pagar hoy?",
      dimension: "conversion"
    }
  ],
  flujoSeguimiento: [
    {
      id: "seguimiento-1",
      flow: "flujoSeguimiento",
      text: "¿Tus leads reciben seguimiento dentro de 24 horas?",
      dimension: "conversion"
    },
    {
      id: "seguimiento-2",
      flow: "flujoSeguimiento",
      text: "¿Tienes una secuencia definida para dar seguimiento sin improvisar?",
      dimension: "escalabilidad"
    },
    {
      id: "seguimiento-3",
      flow: "flujoSeguimiento",
      text: "¿Mides cuántos leads se pierden por falta de seguimiento?",
      dimension: "conversion"
    }
  ],
  flujoConversion: [
    {
      id: "conversion-1",
      flow: "flujoConversion",
      text: "¿Tu proceso comercial convierte de forma predecible cada semana?",
      dimension: "conversion"
    },
    {
      id: "conversion-2",
      flow: "flujoConversion",
      text: "¿Tu equipo domina objeciones clave antes del cierre?",
      dimension: "autoridad"
    },
    {
      id: "conversion-3",
      flow: "flujoConversion",
      text: "¿Conoces tu tasa de cierre por canal y segmento?",
      dimension: "escalabilidad"
    }
  ],
  flujoEscala: [
    {
      id: "escala-1",
      flow: "flujoEscala",
      text: "¿El negocio puede crecer sin aumentar tu carga operativa directa?",
      dimension: "escalabilidad"
    },
    {
      id: "escala-2",
      flow: "flujoEscala",
      text: "¿Tienes procesos comerciales documentados y delegables?",
      dimension: "escalabilidad"
    },
    {
      id: "escala-3",
      flow: "flujoEscala",
      text: "¿Tu adquisición está diversificada en más de un canal rentable?",
      dimension: "atraccion"
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
    conversationNotes: []
  };
}

function inferCriticalFlow(questionId: string): SubFlow {
  if (questionId.startsWith("oferta")) return "flujoOferta";
  if (questionId.startsWith("seguimiento")) return "flujoSeguimiento";
  if (questionId.startsWith("conversion")) return "flujoConversion";
  return "flujoEscala";
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

export function registerAnswer(state: BrainState, question: BrainQuestion, value: number, note?: string): BrainState {
  const next: BrainState = {
    ...state,
    respuestas: { ...state.respuestas, [question.id]: value },
    askedQuestionIds: state.askedQuestionIds.includes(question.id)
      ? state.askedQuestionIds
      : [...state.askedQuestionIds, question.id],
    conversationNotes: note ? [...state.conversationNotes, note] : state.conversationNotes
  };

  if (value <= 2) {
    const critical = inferCriticalFlow(question.id);
    next.criticalFocus = critical;
    next.problemaDetectado = mapProblem(critical);
    next.escenario = mapScenario(critical);
  }

  return next;
}

function pickUnaskedQuestion(state: BrainState, flow: SubFlow): BrainQuestion | null {
  const pending = QUESTION_BANK[flow].find((question) => !state.askedQuestionIds.includes(question.id));
  return pending ?? null;
}

export function getNextQuestion(state: BrainState): BrainQuestion | null {
  if (state.criticalFocus) {
    const criticalQuestion = pickUnaskedQuestion(state, state.criticalFocus);
    if (criticalQuestion) return criticalQuestion;
  }

  const weaknessByFlow = FLOW_ORDER.map((flow) => {
    const values = QUESTION_BANK[flow]
      .map((question) => state.respuestas[question.id])
      .filter((value): value is number => typeof value === "number");

    const avg = values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0;
    return { flow, avg };
  }).sort((a, b) => a.avg - b.avg);

  for (const item of weaknessByFlow) {
    const pending = pickUnaskedQuestion(state, item.flow);
    if (pending) return pending;
  }

  return null;
}

export function buildSystemReply(state: BrainState): string {
  if (state.problemaDetectado === "Sin problema crítico") {
    return "Estoy analizando tu contexto. Aún no detecto un bloqueo crítico, sigamos afinando.";
  }

  const note = state.conversationNotes.length
    ? ` Tomo en cuenta lo que mencionaste: "${state.conversationNotes[state.conversationNotes.length - 1]}".`
    : "";

  return `Detecté foco crítico en ${state.problemaDetectado.toLowerCase()}. Ajusto las siguientes preguntas para profundizar en ese punto.${note}`;
}

export function mapBrainToAcaeAnswers(state: BrainState): Record<number, number> {
  const defaultValue = 3;
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
  return {
    asked: state.askedQuestionIds.length,
    total: FLOW_ORDER.reduce((acc, flow) => acc + QUESTION_BANK[flow].length, 0)
  };
}
