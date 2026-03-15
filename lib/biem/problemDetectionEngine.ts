import { BIEMAnswers, BIEMScoreResult, DetectedProblem } from "@/lib/biem/types";

export function detectBusinessProblems(answers: BIEMAnswers, score: BIEMScoreResult): DetectedProblem[] {
  const problems: DetectedProblem[] = [];

  const acquisitionChannels = Number(answers.Q13 ?? 0);
  if (acquisitionChannels <= 1) {
    problems.push({
      id: "P01",
      problem: "Customer acquisition dependency",
      cause: "The business relies on a single acquisition channel.",
      severity: "high",
      related_dimension: "customer_acquisition",
      trigger_rule: "IF Q13 <= 1"
    });
  }

  const differentiation = Number(answers.Q09 ?? 0);
  if (differentiation <= 2) {
    problems.push({
      id: "P02",
      problem: "Weak value proposition",
      cause: "Differentiation versus alternatives is low.",
      severity: "high",
      related_dimension: "value_proposition",
      trigger_rule: "IF Q09 <= 2"
    });
  }

  const revenueDiversity = Number(answers.Q19 ?? 0);
  if (revenueDiversity <= 2) {
    problems.push({
      id: "P03",
      problem: "Revenue concentration risk",
      cause: "The revenue model depends on a narrow set of income sources.",
      severity: "medium",
      related_dimension: "revenue_structure",
      trigger_rule: "IF Q19 <= 2"
    });
  }

  if (answers.Q26 === false || score.dimension_scores.digitalization < 45) {
    problems.push({
      id: "P04",
      problem: "Low operational automation",
      cause: "Lack of automated workflows limits efficiency and scale.",
      severity: "medium",
      related_dimension: "digitalization",
      trigger_rule: "IF Q26 = false OR digitalization < 45"
    });
  }

  if (score.dimension_scores.strategy < 40) {
    problems.push({
      id: "P05",
      problem: "Insufficient market validation",
      cause: "Strategy score indicates weak market evidence and prioritization.",
      severity: "high",
      related_dimension: "strategy",
      trigger_rule: "IF strategy score < 40"
    });
  }

  if (answers.Q20 === false && score.dimension_scores.scalability < 50) {
    problems.push({
      id: "P06",
      problem: "Scalability friction",
      cause: "Non-recurring revenue and low scalability readiness limit sustainable growth.",
      severity: "medium",
      related_dimension: "scalability",
      trigger_rule: "IF Q20 = false AND scalability < 50"
    });
  }

  return problems;
}
