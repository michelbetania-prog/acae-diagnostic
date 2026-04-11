export type FrameId = 1 | 2 | 3 | 4 | 5 | 6;
export type FlowType = "VALIDACION" | "CONVERSION" | "ESCALA" | "CAOS";
export type BusinessContext = "idea" | "operando" | "creciendo";
export type DiagnosticDimension = "atraccion" | "conversion" | "autoridad" | "escalabilidad";

export type FlowQuestion = {
  id: string;
  text: string;
  dimension: DiagnosticDimension;
};

export const FRAME_TITLES: Record<FrameId, string> = {
  1: "Frame 1 · Contexto",
  2: "Frame 2 · Diagnóstico adaptativo",
  3: "Frame 3 · Detección en tiempo real",
  4: "Frame 4 · Diagnóstico final",
  5: "Frame 5 · Estrategia",
  6: "Frame 6 · Ejecución"
};

export const FLOW_QUESTIONS: Record<FlowType, FlowQuestion[]> = {
  VALIDACION: [
    {
      id: "val-1",
      text: "¿Tienes evidencia real de que tu cliente quiere pagar por tu solución?",
      dimension: "atraccion"
    },
    {
      id: "val-2",
      text: "¿Tu propuesta comunica claramente resultado, plazo y diferenciador?",
      dimension: "conversion"
    },
    {
      id: "val-3",
      text: "¿Realizas conversaciones semanales con potenciales clientes para validar hipótesis?",
      dimension: "autoridad"
    }
  ],
  CONVERSION: [
    {
      id: "conv-1",
      text: "¿Tu equipo sigue un proceso comercial definido de principio a cierre?",
      dimension: "conversion"
    },
    {
      id: "conv-2",
      text: "¿Mides tasa de cierre por canal y ajustas decisiones con esa métrica?",
      dimension: "escalabilidad"
    },
    {
      id: "conv-3",
      text: "¿Tu propuesta reduce objeciones antes de la llamada de venta?",
      dimension: "autoridad"
    }
  ],
  ESCALA: [
    {
      id: "esc-1",
      text: "¿Tu operación puede crecer sin duplicar el esfuerzo del fundador?",
      dimension: "escalabilidad"
    },
    {
      id: "esc-2",
      text: "¿Tienes automatizaciones activas en captación, seguimiento y reporting?",
      dimension: "escalabilidad"
    },
    {
      id: "esc-3",
      text: "¿Existe un segundo canal de adquisición ya validado?",
      dimension: "atraccion"
    }
  ],
  CAOS: [
    {
      id: "caos-1",
      text: "¿Las decisiones críticas dependen totalmente del fundador?",
      dimension: "escalabilidad"
    },
    {
      id: "caos-2",
      text: "¿Tu flujo comercial cambia cada semana sin proceso estable?",
      dimension: "conversion"
    },
    {
      id: "caos-3",
      text: "¿Tu equipo ejecuta sin prioridades estratégicas semanales claras?",
      dimension: "atraccion"
    }
  ]
};

export type RealtimeScore = {
  scores: Record<DiagnosticDimension, number>;
  mainProblem: string;
  feedback: string;
  impact: string;
  rootCause: string;
  consequence: string;
};

function baseFeedback(problemDimension: DiagnosticDimension): Pick<RealtimeScore, "mainProblem" | "feedback" | "impact" | "rootCause" | "consequence"> {
  if (problemDimension === "atraccion") {
    return {
      mainProblem: "Falta de tracción predecible",
      feedback: "Tu sistema no está generando flujo constante de oportunidades.",
      impact: "Pipeline inestable y baja visibilidad de ingresos futuros.",
      rootCause: "Canales de adquisición no priorizados ni optimizados.",
      consequence: "Crecimiento intermitente y dependencia de acciones aisladas."
    };
  }

  if (problemDimension === "conversion") {
    return {
      mainProblem: "Conversión débil",
      feedback: "Existe interés, pero no se transforma en ventas al ritmo esperado.",
      impact: "Fuga de oportunidades y mayor costo por venta cerrada.",
      rootCause: "Proceso comercial sin estandarización ni manejo de objeciones.",
      consequence: "Ingresos impredecibles y presión operativa mensual."
    };
  }

  if (problemDimension === "autoridad") {
    return {
      mainProblem: "Autoridad de mercado insuficiente",
      feedback: "El cliente aún no percibe suficiente confianza antes de comprar.",
      impact: "Ciclos de venta más largos y menor tasa de cierre.",
      rootCause: "Mensaje de posicionamiento poco contundente y baja prueba social.",
      consequence: "Mayor esfuerzo comercial para cada cierre."
    };
  }

  return {
    mainProblem: "Bloqueo de escalabilidad",
    feedback: "El crecimiento depende demasiado de intervención manual.",
    impact: "Capacidad limitada para absorber más clientes sin desgaste.",
    rootCause: "Procesos críticos no sistematizados ni delegables.",
    consequence: "Techo operativo que frena expansión rentable."
  };
}

export function evaluateRealtime(flow: FlowType, answers: Record<string, number>): RealtimeScore {
  const questions = FLOW_QUESTIONS[flow];
  const scores: Record<DiagnosticDimension, number> = {
    atraccion: 0,
    conversion: 0,
    autoridad: 0,
    escalabilidad: 0
  };

  questions.forEach((question) => {
    const value = answers[question.id] ?? 0;
    const weaknessValue = 6 - value;
    scores[question.dimension] += weaknessValue;
  });

  const ordered = (Object.entries(scores) as Array<[DiagnosticDimension, number]>).sort((a, b) => b[1] - a[1]);
  const weakestDimension = ordered[0][0];
  const base = baseFeedback(weakestDimension);

  return {
    scores,
    ...base
  };
}

export function mapDynamicAnswersToAcae(answers: Record<string, number>, flow: FlowType): Record<number, number> {
  const questions = FLOW_QUESTIONS[flow];

  const totals: Record<DiagnosticDimension, { sum: number; count: number }> = {
    atraccion: { sum: 0, count: 0 },
    conversion: { sum: 0, count: 0 },
    autoridad: { sum: 0, count: 0 },
    escalabilidad: { sum: 0, count: 0 }
  };

  questions.forEach((question) => {
    const value = answers[question.id] ?? 3;
    totals[question.dimension].sum += value;
    totals[question.dimension].count += 1;
  });

  const avg = (dimension: DiagnosticDimension) => {
    const bucket = totals[dimension];
    if (!bucket.count) return 3;
    return Math.max(1, Math.min(5, Math.round(bucket.sum / bucket.count)));
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
