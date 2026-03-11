export type BusinessDimension = "attraction" | "conversion" | "automation" | "scale";

export type DiagnosticResult = {
  attraction: number;
  conversion: number;
  automation: number;
  scale: number;
  total: number;
};

export type BusinessStage = "IDEA" | "VALIDATION" | "GROWTH" | "SYSTEMIZATION" | "SCALE";

export type Task = {
  title: string;
  description: string;
  dimension: BusinessDimension;
};

export type MatrixLevelData = {
  typicalProblems: string[];
  strategicFocus: string;
  suggestedTasks: Task[];
};

export type ActionPlan = {
  businessStage: BusinessStage;
  priorities: BusinessDimension[];
  strategicFocus: string;
  tasks: Task[];
};

export const ACAE_MATRIX: Record<BusinessDimension, Record<1 | 2 | 3 | 4 | 5, MatrixLevelData>> = {
  attraction: {
    1: {
      typicalProblems: ["No hay flujo constante de prospectos", "Baja visibilidad en mercado"],
      strategicFocus: "Diseñar un sistema mínimo de captación.",
      suggestedTasks: [
        { title: "Definir oferta de entrada", description: "Crear una oferta clara para captar leads.", dimension: "attraction" },
        { title: "Canal principal", description: "Elegir un canal de adquisición y publicarlo semanalmente.", dimension: "attraction" }
      ]
    },
    2: {
      typicalProblems: ["Captación irregular", "Sin métricas de atracción"],
      strategicFocus: "Estandarizar atracción y medir demanda.",
      suggestedTasks: [
        { title: "Calendario de contenidos", description: "Publicar contenido de valor 3 veces por semana.", dimension: "attraction" },
        { title: "Tracking de leads", description: "Registrar leads semanales por fuente.", dimension: "attraction" }
      ]
    },
    3: {
      typicalProblems: ["Canales no diversificados"],
      strategicFocus: "Optimizar canales con mejor costo por lead.",
      suggestedTasks: [
        { title: "A/B de mensajes", description: "Probar dos propuestas de mensaje en campañas.", dimension: "attraction" }
      ]
    },
    4: {
      typicalProblems: ["Saturación de audiencias"],
      strategicFocus: "Escalar adquisición con segmentación avanzada.",
      suggestedTasks: [
        { title: "Expansión de canal", description: "Abrir un segundo canal con presupuesto controlado.", dimension: "attraction" }
      ]
    },
    5: {
      typicalProblems: ["Riesgo de dependencia de marca personal"],
      strategicFocus: "Construir marca escalable y sostenible.",
      suggestedTasks: [
        { title: "Playbook de adquisición", description: "Documentar estrategia para replicar por equipo.", dimension: "attraction" }
      ]
    }
  },
  conversion: {
    1: {
      typicalProblems: ["No existe proceso comercial", "Baja tasa de cierre"],
      strategicFocus: "Diseñar embudo comercial básico.",
      suggestedTasks: [
        { title: "Mapa de embudo", description: "Definir etapas desde lead hasta cierre.", dimension: "conversion" },
        { title: "Script comercial", description: "Crear guion para llamadas de diagnóstico.", dimension: "conversion" }
      ]
    },
    2: {
      typicalProblems: ["Seguimiento inconsistente"],
      strategicFocus: "Estandarizar seguimiento y calificación.",
      suggestedTasks: [
        { title: "Regla de seguimiento", description: "Aplicar secuencia de 5 contactos por lead.", dimension: "conversion" }
      ]
    },
    3: {
      typicalProblems: ["Objeciones repetitivas"],
      strategicFocus: "Aumentar conversión con propuesta clara.",
      suggestedTasks: [
        { title: "Biblioteca de objeciones", description: "Documentar respuestas a objeciones clave.", dimension: "conversion" }
      ]
    },
    4: {
      typicalProblems: ["Cuellos de botella del equipo"],
      strategicFocus: "Optimizar velocidad de cierre.",
      suggestedTasks: [
        { title: "SLA comercial", description: "Definir tiempos de respuesta máximos por etapa.", dimension: "conversion" }
      ]
    },
    5: {
      typicalProblems: ["Dependencia de closers específicos"],
      strategicFocus: "Escalar conversión con sistema replicable.",
      suggestedTasks: [
        { title: "Academia interna", description: "Entrenar equipo en proceso de venta estandarizado.", dimension: "conversion" }
      ]
    }
  },
  automation: {
    1: {
      typicalProblems: ["Operación manual", "Falta de autoridad de marca"],
      strategicFocus: "Crear activos y automatizaciones mínimas.",
      suggestedTasks: [
        { title: "Activos de autoridad", description: "Publicar casos de éxito y testimonios.", dimension: "automation" },
        { title: "Automatización inicial", description: "Automatizar captación y seguimiento básico.", dimension: "automation" }
      ]
    },
    2: {
      typicalProblems: ["Procesos dispersos"],
      strategicFocus: "Centralizar procesos clave.",
      suggestedTasks: [
        { title: "Estandarizar SOP", description: "Crear SOP para marketing y ventas.", dimension: "automation" }
      ]
    },
    3: {
      typicalProblems: ["Automatización parcial"],
      strategicFocus: "Conectar herramientas y datos.",
      suggestedTasks: [
        { title: "Integración CRM", description: "Unificar datos de leads y clientes.", dimension: "automation" }
      ]
    },
    4: {
      typicalProblems: ["Falta de observabilidad"],
      strategicFocus: "Optimizar sistemas con alertas y KPIs.",
      suggestedTasks: [
        { title: "Panel operativo", description: "Crear panel semanal con métricas críticas.", dimension: "automation" }
      ]
    },
    5: {
      typicalProblems: ["Complejidad operativa"],
      strategicFocus: "Mantener eficiencia al escalar.",
      suggestedTasks: [
        { title: "Auditoría trimestral", description: "Revisar procesos automatizados para reducir fricción.", dimension: "automation" }
      ]
    }
  },
  scale: {
    1: {
      typicalProblems: ["Dependencia total del fundador"],
      strategicFocus: "Establecer estructura mínima de crecimiento.",
      suggestedTasks: [
        { title: "Mapa de roles", description: "Definir funciones críticas para delegar.", dimension: "scale" }
      ]
    },
    2: {
      typicalProblems: ["Capacidad limitada"],
      strategicFocus: "Aumentar capacidad operativa.",
      suggestedTasks: [
        { title: "Plan de capacidad", description: "Definir límites y recursos por etapa.", dimension: "scale" }
      ]
    },
    3: {
      typicalProblems: ["Crecimiento inestable"],
      strategicFocus: "Crear ritmo estable de ejecución.",
      suggestedTasks: [
        { title: "Ritual de performance", description: "Reunión semanal de revisión de métricas.", dimension: "scale" }
      ]
    },
    4: {
      typicalProblems: ["Escala con fricción"],
      strategicFocus: "Escalar sin perder calidad.",
      suggestedTasks: [
        { title: "Control de calidad", description: "Definir checklist de calidad por entrega.", dimension: "scale" }
      ]
    },
    5: {
      typicalProblems: ["Riesgo de estancamiento"],
      strategicFocus: "Expandir en nuevos mercados.",
      suggestedTasks: [
        { title: "Roadmap de expansión", description: "Diseñar plan semestral de expansión.", dimension: "scale" }
      ]
    }
  }
};

function scoreToLevel(score: number): 1 | 2 | 3 | 4 | 5 {
  if (score <= 3) return 1;
  if (score <= 6) return 2;
  if (score <= 9) return 3;
  if (score <= 12) return 4;
  return 5;
}

function getDimensionLevels(result: DiagnosticResult) {
  return {
    attraction: scoreToLevel(result.attraction),
    conversion: scoreToLevel(result.conversion),
    automation: scoreToLevel(result.automation),
    scale: scoreToLevel(result.scale)
  } as const;
}

export function calculateBusinessStage(result: DiagnosticResult): BusinessStage {
  const levels = Object.values(getDimensionLevels(result));
  const avg = levels.reduce((acc, v) => acc + v, 0) / levels.length;

  if (avg < 1.8) return "IDEA";
  if (avg < 2.6) return "VALIDATION";
  if (avg < 3.4) return "GROWTH";
  if (avg < 4.4) return "SYSTEMIZATION";
  return "SCALE";
}

export function getStrategicFocus(result: DiagnosticResult): string {
  const priorities = generatePriorities(result);
  const primary = priorities[0];
  const level = getDimensionLevels(result)[primary];
  return ACAE_MATRIX[primary][level].strategicFocus;
}

function generatePriorities(result: DiagnosticResult): BusinessDimension[] {
  const levels = getDimensionLevels(result);
  return (Object.keys(levels) as BusinessDimension[]).sort((a, b) => levels[a] - levels[b]);
}

export function generateTasksFromDiagnostic(result: DiagnosticResult): Task[] {
  const priorities = generatePriorities(result).slice(0, 2);

  return priorities.flatMap((dimension) => {
    const level = getDimensionLevels(result)[dimension];
    return ACAE_MATRIX[dimension][level].suggestedTasks;
  });
}

export function generateActionPlan(result: DiagnosticResult): ActionPlan {
  const priorities = generatePriorities(result);

  return {
    businessStage: calculateBusinessStage(result),
    priorities,
    strategicFocus: getStrategicFocus(result),
    tasks: generateTasksFromDiagnostic(result)
  };
}
