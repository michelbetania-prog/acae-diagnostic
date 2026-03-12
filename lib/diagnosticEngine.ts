import { diagnosticQuestions } from "@/lib/diagnosticQuestions";
import { DiagnosticDimensionScores } from "@/lib/types";

function normalizeAnswer(value: number | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;
  if (value < 1) return 1;
  if (value > 5) return 5;
  return Math.round(value);
}

export function calculateDimensionScores(answers: Record<number, number>): DiagnosticDimensionScores {
  const base: DiagnosticDimensionScores = {
    attractionScore: 0,
    conversionScore: 0,
    automationScore: 0,
    scaleScore: 0
  };

  diagnosticQuestions.forEach((question) => {
    const value = normalizeAnswer(answers[question.id]);

    if (question.dimension === "attraction") base.attractionScore += value;
    if (question.dimension === "conversion") base.conversionScore += value;
    if (question.dimension === "automation") base.automationScore += value;
    if (question.dimension === "scale") base.scaleScore += value;
  });

  return base;
}

export function processDiagnosticAnswers(answers: Record<number, number>): DiagnosticDimensionScores {
  return calculateDimensionScores(answers);
}
