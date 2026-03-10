import { ACAEScore } from "@/lib/calculateACAE";

type RecommendationResult = {
  dimension: string;
  items: string[];
};

const byDimension: Record<Exclude<keyof ACAEScore, "total">, RecommendationResult> = {
  atraccion: {
    dimension: "Atracción",
    items: [
      "Mejorar sistema de generación de prospectos",
      "Crear estrategia de contenido",
      "Desarrollar un embudo de captación"
    ]
  },
  conversion: {
    dimension: "Conversión",
    items: [
      "Optimizar proceso de ventas",
      "Clarificar propuesta de valor",
      "Mejorar calificación de prospectos"
    ]
  },
  autoridad: {
    dimension: "Autoridad",
    items: [
      "Desarrollar contenido de autoridad",
      "Fortalecer posicionamiento de marca",
      "Aumentar señales de credibilidad"
    ]
  },
  escalabilidad: {
    dimension: "Escalabilidad",
    items: [
      "Crear sistemas operativos",
      "Implementar automatización",
      "Reducir dependencia del fundador"
    ]
  }
};

export function getRecommendations(scores: ACAEScore): RecommendationResult {
  const entries: Array<[Exclude<keyof ACAEScore, "total">, number]> = [
    ["atraccion", scores.atraccion],
    ["conversion", scores.conversion],
    ["autoridad", scores.autoridad],
    ["escalabilidad", scores.escalabilidad]
  ];

  entries.sort((a, b) => a[1] - b[1]);
  return byDimension[entries[0][0]];
}
