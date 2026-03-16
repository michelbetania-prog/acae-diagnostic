import { biemQuestionnaire } from "@/lib/biem/questionnaire";
import { BIEMAnswer, BIEMAnswers, BIEMDimensionScores, BIEMQuestion, BIEMScoreResult, ScoreDimension } from "@/lib/biem/types";

const DIMENSIONS: ScoreDimension[] = [
  "strategy",
  "value_proposition",
  "customer_acquisition",
  "revenue_structure",
  "digitalization",
  "scalability"
];

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeAnswer(question: BIEMQuestion, raw: BIEMAnswer | undefined): number {
  if (question.type === "boolean") {
    return raw === true ? 100 : 0;
  }

  if (typeof raw !== "number" || Number.isNaN(raw)) {
    return 0;
  }

  if (question.type === "multiple_choice") {
    const bounded = clamp(raw, 1, 5);
    const baseScore = ((bounded - 1) / 4) * 100;
    return question.id === "Q27" ? 100 - baseScore : baseScore;
  }

  if (question.type === "numeric" && question.scale) {
    const bounded = clamp(raw, question.scale.min, question.scale.max);
    return ((bounded - question.scale.min) / (question.scale.max - question.scale.min || 1)) * 100;
  }

  return 0;
}

export function calculateBIEMScores(answers: BIEMAnswers): BIEMScoreResult {
  const weightedScores: Record<ScoreDimension, number> = {
    strategy: 0,
    value_proposition: 0,
    customer_acquisition: 0,
    revenue_structure: 0,
    digitalization: 0,
    scalability: 0
  };

  const weightedTotals: Record<ScoreDimension, number> = {
    strategy: 0,
    value_proposition: 0,
    customer_acquisition: 0,
    revenue_structure: 0,
    digitalization: 0,
    scalability: 0
  };

  biemQuestionnaire.forEach((question) => {
    const score = normalizeAnswer(question, answers[question.id]);
    const impactedDimensions = question.contributesTo ?? [];

    impactedDimensions.forEach((dimension) => {
      weightedScores[dimension] += score * question.weight;
      weightedTotals[dimension] += question.weight;
    });
  });

  const dimensionScores = DIMENSIONS.reduce((acc, dimension) => {
    const rawScore = weightedTotals[dimension] === 0 ? 0 : weightedScores[dimension] / weightedTotals[dimension];
    acc[dimension] = Math.round(clamp(rawScore));
    return acc;
  }, {} as BIEMDimensionScores);

  const overall = Math.round(
    (dimensionScores.strategy +
      dimensionScores.value_proposition +
      dimensionScores.customer_acquisition +
      dimensionScores.revenue_structure +
      dimensionScores.digitalization +
      dimensionScores.scalability) /
      DIMENSIONS.length
  );

  return {
    overall_score: overall,
    dimension_scores: dimensionScores
  };
}

export function inferBusinessStage(overallScore: number): "idea" | "validation" | "early_growth" | "scaling" | "established" {
  if (overallScore < 30) return "idea";
  if (overallScore < 45) return "validation";
  if (overallScore < 65) return "early_growth";
  if (overallScore < 80) return "scaling";
  return "established";
}
