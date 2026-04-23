export type PatternCode =
  | "DESALINEACION"
  | "PROPUESTA_INEXISTENTE"
  | "CANAL_INCORRECTO"
  | "CUELLO_DE_BOTELLA_HUMANO"
  | "FUGA_DE_CLIENTES"
  | "MODELO_INVIABLE"
  | "SIN_PATRON_CRITICO";

export type Severity = "alto" | "medio" | "bajo";

export type BrainQuestion = {
  id: string;
  text: string;
  pattern: Exclude<PatternCode, "SIN_PATRON_CRITICO">;
};

export type BrainState = {
  respuestas: Record<string, number>;
  notas: Record<string, string>;
  askedQuestionIds: string[];
};

const QUESTIONS: BrainQuestion[] = [
  { id: "p1-q1", pattern: "DESALINEACION", text: "¿Quién es tu cliente ideal hoy?" },
  { id: "p1-q2", pattern: "DESALINEACION", text: "¿Dónde está digital o físicamente ese cliente?" },
  { id: "p1-q3", pattern: "DESALINEACION", text: "¿Tu precio es accesible o requiere mucha justificación?" },
  { id: "p1-q4", pattern: "DESALINEACION", text: "¿Has vendido antes? ¿A quién específicamente?" },

  { id: "p2-q1", pattern: "PROPUESTA_INEXISTENTE", text: "¿Por qué un cliente debería elegirte a ti?" },
  { id: "p2-q2", pattern: "PROPUESTA_INEXISTENTE", text: "¿Qué te hace diferente en tu mercado?" },
  { id: "p2-q3", pattern: "PROPUESTA_INEXISTENTE", text: "Explica tu negocio en una sola oración." },
  { id: "p2-q4", pattern: "PROPUESTA_INEXISTENTE", text: "¿Qué dicen tus clientes cuando te recomiendan?" },

  { id: "p3-q1", pattern: "CANAL_INCORRECTO", text: "¿Cómo conseguiste tus últimos 3 clientes?" },
  { id: "p3-q2", pattern: "CANAL_INCORRECTO", text: "¿Estás invirtiendo en redes? ¿Qué resultado real obtuviste?" },
  { id: "p3-q3", pattern: "CANAL_INCORRECTO", text: "¿Tus clientes te buscan o tú los buscas activamente?" },
  { id: "p3-q4", pattern: "CANAL_INCORRECTO", text: "¿Qué porcentaje llega por recomendación?" },

  { id: "p4-q1", pattern: "CUELLO_DE_BOTELLA_HUMANO", text: "¿Trabajas solo o tienes equipo operativo?" },
  { id: "p4-q2", pattern: "CUELLO_DE_BOTELLA_HUMANO", text: "¿Qué pasa si no trabajas una semana?" },
  { id: "p4-q3", pattern: "CUELLO_DE_BOTELLA_HUMANO", text: "¿Qué tareas has delegado realmente?" },
  { id: "p4-q4", pattern: "CUELLO_DE_BOTELLA_HUMANO", text: "¿Sabes algo que deberías cambiar y aún no ejecutas?" },

  { id: "p5-q1", pattern: "FUGA_DE_CLIENTES", text: "¿Tus clientes vuelven a comprar?" },
  { id: "p5-q2", pattern: "FUGA_DE_CLIENTES", text: "¿Tienes base de datos y seguimiento postventa?" },
  { id: "p5-q3", pattern: "FUGA_DE_CLIENTES", text: "¿Qué pasa después de la compra durante 30 días?" },
  { id: "p5-q4", pattern: "FUGA_DE_CLIENTES", text: "¿Cuánto inviertes en adquirir vs retener clientes?" },

  { id: "p6-q1", pattern: "MODELO_INVIABLE", text: "¿Cómo funciona tu modelo de ingresos exactamente?" },
  { id: "p6-q2", pattern: "MODELO_INVIABLE", text: "¿Quién más gana dinero dentro del modelo?" },
  { id: "p6-q3", pattern: "MODELO_INVIABLE", text: "¿Tu ingreso depende de reclutar personas?" },
  { id: "p6-q4", pattern: "MODELO_INVIABLE", text: "¿Podrías sostener el negocio sin reclutar?" }
];

const VAGUE_WORDS = ["calidad", "servicio", "normal", "no sé", "más o menos", "de todo"];

export function createInitialBrainState(): BrainState {
  return { respuestas: {}, notas: {}, askedQuestionIds: [] };
}

export function getDiagnosticStepOutline(): Array<{ id: string; label: string }> {
  return QUESTIONS.map((q) => ({ id: q.id, label: q.text }));
}

export function getBrainProgress(state: BrainState): { asked: number; total: number } {
  return { asked: state.askedQuestionIds.length, total: QUESTIONS.length };
}

export function getNextQuestion(state: BrainState): BrainQuestion | null {
  return QUESTIONS.find((q) => !state.askedQuestionIds.includes(q.id)) ?? null;
}

export function validateResponse(score: number, note: string): { valid: boolean; reason?: string } {
  const cleaned = note.trim().toLowerCase();
  if (cleaned.length < 10) return { valid: false, reason: "Necesito una respuesta concreta y específica." };
  if (VAGUE_WORDS.some((word) => cleaned.includes(word))) {
    return { valid: false, reason: "Respuesta vaga detectada. Sé más específico para seguir." };
  }
  if (score < 1 || score > 5) return { valid: false, reason: "Puntaje inválido." };
  return { valid: true };
}

export function registerAnswer(state: BrainState, question: BrainQuestion, value: number, note?: string): BrainState {
  return {
    ...state,
    respuestas: { ...state.respuestas, [question.id]: value },
    notas: { ...state.notas, [question.id]: note ?? "" },
    askedQuestionIds: state.askedQuestionIds.includes(question.id)
      ? state.askedQuestionIds
      : [...state.askedQuestionIds, question.id]
  };
}

function scorePattern(state: BrainState, pattern: Exclude<PatternCode, "SIN_PATRON_CRITICO">): number {
  const patternQuestions = QUESTIONS.filter((q) => q.pattern === pattern);
  return patternQuestions.reduce((acc, q) => {
    const score = state.respuestas[q.id] ?? 3;
    return acc + (6 - score);
  }, 0);
}

function noteIncludes(state: BrainState, pattern: Exclude<PatternCode, "SIN_PATRON_CRITICO">, terms: string[]): boolean {
  return QUESTIONS.filter((q) => q.pattern === pattern).some((q) => {
    const note = (state.notas[q.id] ?? "").toLowerCase();
    return terms.some((term) => note.includes(term));
  });
}

export function detectPattern(state: BrainState): PatternCode {
  if (noteIncludes(state, "MODELO_INVIABLE", ["reclut", "piram", "multinivel"])) return "MODELO_INVIABLE";

  const candidates: Array<{ code: Exclude<PatternCode, "SIN_PATRON_CRITICO">; score: number }> = [
    { code: "DESALINEACION", score: scorePattern(state, "DESALINEACION") },
    { code: "PROPUESTA_INEXISTENTE", score: scorePattern(state, "PROPUESTA_INEXISTENTE") },
    { code: "CANAL_INCORRECTO", score: scorePattern(state, "CANAL_INCORRECTO") },
    { code: "CUELLO_DE_BOTELLA_HUMANO", score: scorePattern(state, "CUELLO_DE_BOTELLA_HUMANO") },
    { code: "FUGA_DE_CLIENTES", score: scorePattern(state, "FUGA_DE_CLIENTES") },
    { code: "MODELO_INVIABLE", score: scorePattern(state, "MODELO_INVIABLE") }
  ];

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].score >= 10 ? candidates[0].code : "SIN_PATRON_CRITICO";
}

export function getStrategicDiagnosis(state: BrainState): {
  patron: PatternCode;
  problema: string;
  gravedad: Severity;
  accion: string;
} {
  const patron = detectPattern(state);

  if (patron === "DESALINEACION") {
    return {
      patron,
      problema: "Tu cliente objetivo y tu oferta no están alineados; vendes con fricción y baja conversión.",
      gravedad: "alto",
      accion: "Define un segmento único con ingreso, problema urgente y canal real; reescribe oferta para ese segmento y valida 5 ventas antes de escalar."
    };
  }

  if (patron === "PROPUESTA_INEXISTENTE") {
    return {
      patron,
      problema: "Tu propuesta no comunica diferencia real; el cliente no percibe por qué elegirte.",
      gravedad: "alto",
      accion: "Crea una promesa concreta en formato: resultado + plazo + evidencia; prueba 3 versiones en llamadas y conserva la que cierre más."
    };
  }

  if (patron === "CANAL_INCORRECTO") {
    return {
      patron,
      problema: "Estás usando canales que no corresponden al tipo de compra de tu cliente.",
      gravedad: "medio",
      accion: "Detén inversión en redes de baja intención y mueve el esfuerzo a referidos estructurados, alianzas y prospección directa con script."
    };
  }

  if (patron === "CUELLO_DE_BOTELLA_HUMANO") {
    return {
      patron,
      problema: "El negocio depende de ti para operar y crecer; no es escalable así.",
      gravedad: "alto",
      accion: "Documenta 3 procesos críticos (captación, venta, seguimiento), asigna responsable y revisa semanalmente cumplimiento con checklist mínimo."
    };
  }

  if (patron === "FUGA_DE_CLIENTES") {
    return {
      patron,
      problema: "Vendes pero no retienes; pierdes margen por depender de adquisición constante.",
      gravedad: "medio",
      accion: "Implementa secuencia postventa de 30 días (mensaje día 1, valor día 7, oferta día 21) y mide recompra por cohorte."
    };
  }

  if (patron === "MODELO_INVIABLE") {
    return {
      patron,
      problema: "El modelo depende de reclutar personas y no de entregar valor sostenible al cliente final.",
      gravedad: "alto",
      accion: "Suspende expansión hasta rediseñar ingresos basados en producto/servicio real; valida que puedas sostener ventas sin reclutamiento."
    };
  }

  return {
    patron,
    problema: "No se detectó un patrón crítico dominante con la evidencia actual.",
    gravedad: "bajo",
    accion: "Enfócate en medir embudo completo por 2 semanas para identificar el cuello de botella principal con datos." 
  };
}

export function buildSystemReply(state: BrainState): string {
  const diagnosis = getStrategicDiagnosis(state);
  return `Patrón interno detectado: ${diagnosis.patron}. Problema: ${diagnosis.problema}`;
}

export function canGenerateStrategicOutput(state: BrainState): { allowed: boolean; reason?: string } {
  const progress = getBrainProgress(state);
  if (progress.asked < QUESTIONS.length) {
    return { allowed: false, reason: "Debes completar todas las preguntas para un diagnóstico preciso." };
  }
  return { allowed: true };
}

export function mapBrainToAcaeAnswers(state: BrainState): Record<number, number> {
  const pattern = detectPattern(state);

  if (pattern === "CANAL_INCORRECTO") {
    return { 1: 2, 2: 2, 3: 2, 4: 4, 5: 4, 6: 3, 7: 3, 8: 3, 9: 3, 10: 3, 11: 3, 12: 3 };
  }

  if (pattern === "CUELLO_DE_BOTELLA_HUMANO") {
    return { 1: 3, 2: 3, 3: 3, 4: 3, 5: 3, 6: 3, 7: 2, 8: 2, 9: 2, 10: 1, 11: 1, 12: 1 };
  }

  if (pattern === "FUGA_DE_CLIENTES") {
    return { 1: 3, 2: 3, 3: 3, 4: 2, 5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 2, 11: 2, 12: 2 };
  }

  return { 1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2, 9: 2, 10: 2, 11: 2, 12: 2 };
}
