import { diagnosticQuestions } from "@/lib/conversation-engine";
import { Answers, DiagnosticDimension, PotentialLevel, ScoreResult, Stage } from "@/lib/biem-insight/types";

const dimensions: DiagnosticDimension[] = [
  "idea_clarity",
  "market_validation",
  "strategic_focus",
  "decision_making_mindset",
  "execution_capacity"
];

function normalizeTo100(rawAverage: number): number {
  return Math.round(((rawAverage - 1) / 3) * 100);
}

function classifyStage(totalScore: number): Stage {
  if (totalScore < 35) return "IDEA";
  if (totalScore < 55) return "PROJECT";
  if (totalScore < 75) return "OPERATING_BUSINESS";
  return "GROWTH_BUSINESS";
}

function classifyPotential(totalScore: number): PotentialLevel {
  if (totalScore < 40) return "Early stage potential";
  if (totalScore < 70) return "Moderate potential";
  return "High potential";
}

export function calculateScore(answers: Answers): ScoreResult {
  const accum: Record<DiagnosticDimension, { total: number; count: number }> = {
    idea_clarity: { total: 0, count: 0 },
    market_validation: { total: 0, count: 0 },
    strategic_focus: { total: 0, count: 0 },
    decision_making_mindset: { total: 0, count: 0 },
    execution_capacity: { total: 0, count: 0 }
  };

  diagnosticQuestions.forEach((q) => {
    const option = q.options.find((op) => op.id === answers[q.id]);
    if (!option) return;
    accum[q.dimension].total += option.score;
    accum[q.dimension].count += 1;
  });

  const dimensionScores = dimensions.reduce((result, dimension) => {
    const dimensionData = accum[dimension];
    const avg = dimensionData.count === 0 ? 1 : dimensionData.total / dimensionData.count;
    result[dimension] = normalizeTo100(avg);
    return result;
  }, {} as Record<DiagnosticDimension, number>);

  const totalScore = Math.round(
    dimensions.reduce((sum, dimension) => sum + dimensionScores[dimension], 0) / dimensions.length
  );

  return {
    dimensionScores,
    totalScore,
    stage: classifyStage(totalScore),
    potentialLevel: classifyPotential(totalScore)
  };
}
