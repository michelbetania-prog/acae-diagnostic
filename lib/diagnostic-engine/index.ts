import { Answers, DiagnosticOutput } from "@/lib/biem-insight/types";
import { calculateScore } from "@/lib/scoring-engine";

function stageInterpretation(stage: DiagnosticOutput["stage"]): string {
  if (stage === "IDEA") return "Your business is in conceptual formation and requires validation before aggressive execution.";
  if (stage === "PROJECT") return "Your business shows early structural development, with potential that still needs strategic consolidation.";
  if (stage === "OPERATING_BUSINESS") return "Your business is operating with traction but still has structural gaps that can limit predictable growth.";
  return "Your business already shows growth foundations, and now strategic refinement can accelerate scale.";
}

export function runDiagnosticEngine(answers: Answers): { report: DiagnosticOutput; interpretation: string } {
  const score = calculateScore(answers);

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (score.dimensionScores.idea_clarity >= 65) strengths.push("Clear entrepreneurial motivation and business intent");
  else challenges.push("Unclear value proposition and problem framing");

  if (score.dimensionScores.market_validation >= 65) strengths.push("Evidence of market demand and customer understanding");
  else challenges.push("Weak market validation and limited demand evidence");

  if (score.dimensionScores.strategic_focus >= 65) strengths.push("Strategic focus with defined priorities");
  else challenges.push("Lack of strategic focus and channel consistency");

  if (score.dimensionScores.decision_making_mindset < 60) {
    challenges.push("Founder decision paralysis or inconsistent decision framework");
  }

  if (score.dimensionScores.execution_capacity < 60) {
    challenges.push("Operational chaos and low execution discipline");
  } else {
    strengths.push("Execution discipline with practical momentum");
  }

  const recommendation =
    score.dimensionScores.market_validation < 60
      ? "Your immediate strategic priority is validating market demand with sharper customer evidence, then building a predictable acquisition system."
      : "Your next strategic priority is tightening your acquisition system and decision cadence so growth becomes repeatable and less founder-dependent.";

  return {
    interpretation: stageInterpretation(score.stage),
    report: {
      stage: score.stage,
      strengths: strengths.slice(0, 3),
      challenges: challenges.slice(0, 3),
      recommendation,
      potential_level: score.potentialLevel
    }
  };
}
