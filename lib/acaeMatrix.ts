export type BusinessDimension = "attraction" | "conversion" | "automation" | "scale";

export type MatrixLevel = 1 | 2 | 3 | 4 | 5;

export type MatrixNode = {
  focus: string;
  tasks: string[];
};

export const ACAE_MATRIX: Record<BusinessDimension, Record<MatrixLevel, MatrixNode>> = {
  attraction: {
    1: {
      focus: "Definir mercado y propuesta de valor",
      tasks: [
        "Definir cliente ideal",
        "Definir propuesta de valor",
        "Identificar problema principal del cliente"
      ]
    },
    2: {
      focus: "Crear presencia inicial",
      tasks: [
        "Abrir canal principal de adquisición",
        "Crear perfiles en redes o canal principal",
        "Publicar contenido inicial"
      ]
    },
    3: {
      focus: "Optimizar generación de leads",
      tasks: [
        "Crear lead magnet",
        "Crear landing de captura",
        "Medir tráfico y conversiones"
      ]
    },
    4: {
      focus: "Construir sistema de adquisición",
      tasks: [
        "Crear funnel de captación",
        "Optimizar tráfico",
        "Implementar campañas de adquisición"
      ]
    },
    5: {
      focus: "Escalar adquisición",
      tasks: [
        "Automatizar generación de leads",
        "Expandir canales de adquisición",
        "Optimizar CAC"
      ]
    }
  },
  conversion: {
    1: {
      focus: "Validar oferta",
      tasks: [
        "Definir oferta principal",
        "Realizar primeras ventas",
        "Validar propuesta con clientes"
      ]
    },
    2: {
      focus: "Estructurar proceso de ventas",
      tasks: [
        "Crear guion de ventas",
        "Definir proceso comercial",
        "Registrar leads manualmente"
      ]
    },
    3: {
      focus: "Optimizar conversión",
      tasks: [
        "Crear landing de ventas",
        "Mejorar propuesta comercial",
        "Medir tasa de conversión"
      ]
    },
    4: {
      focus: "Construir sistema de ventas",
      tasks: [
        "Implementar CRM",
        "Automatizar seguimiento de leads",
        "Optimizar pipeline"
      ]
    },
    5: {
      focus: "Escalar ventas",
      tasks: [
        "Optimizar proceso comercial",
        "Delegar ventas",
        "Escalar conversiones"
      ]
    }
  },
  automation: {
    1: {
      focus: "Identificar procesos repetitivos",
      tasks: ["Mapear procesos operativos", "Documentar tareas repetitivas"]
    },
    2: {
      focus: "Implementar herramientas básicas",
      tasks: ["Usar herramientas de gestión", "Centralizar información"]
    },
    3: {
      focus: "Automatizar procesos clave",
      tasks: ["Automatizar seguimiento de clientes", "Automatizar marketing básico"]
    },
    4: {
      focus: "Optimizar operaciones",
      tasks: ["Automatizar procesos internos", "Optimizar flujo de trabajo"]
    },
    5: {
      focus: "Sistema empresarial automatizado",
      tasks: ["Automatizar procesos estratégicos", "Reducir dependencia operativa"]
    }
  },
  scale: {
    1: {
      focus: "Estabilizar operaciones",
      tasks: ["Estabilizar flujo de clientes", "Definir métricas básicas"]
    },
    2: {
      focus: "Estandarizar procesos",
      tasks: ["Documentar procesos", "Definir roles"]
    },
    3: {
      focus: "Preparar crecimiento",
      tasks: ["Optimizar estructura operativa", "Establecer KPIs"]
    },
    4: {
      focus: "Expandir capacidad",
      tasks: ["Delegar operaciones", "Expandir equipo"]
    },
    5: {
      focus: "Escalar negocio",
      tasks: ["Expandir mercado", "Escalar sistema de adquisición"]
    }
  }
};
