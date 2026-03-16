import { BIEMDiagnosticReport, BIEMScoreResult, DetectedProblem, StrategicRoute } from "@/lib/biem/types";

function interpretScore(score: number): string {
  if (score < 35) return "Critical structural weakness. Immediate intervention required.";
  if (score < 55) return "Fragile area with material growth constraints.";
  if (score < 75) return "Stable but still improvable for stronger scale readiness.";
  return "Healthy and strategically robust dimension.";
}

export function buildDiagnosticReport(
  score: BIEMScoreResult,
  problems: DetectedProblem[],
  routes: StrategicRoute[]
): BIEMDiagnosticReport {
  const opportunities = routes.map((route) => `${route.title}: ${route.description}`);

  return {
    business_score: score.overall_score,
    dimension_analysis: {
      strategy: { score: score.dimension_scores.strategy, interpretation: interpretScore(score.dimension_scores.strategy) },
      value_proposition: {
        score: score.dimension_scores.value_proposition,
        interpretation: interpretScore(score.dimension_scores.value_proposition)
      },
      customer_acquisition: {
        score: score.dimension_scores.customer_acquisition,
        interpretation: interpretScore(score.dimension_scores.customer_acquisition)
      },
      revenue_structure: {
        score: score.dimension_scores.revenue_structure,
        interpretation: interpretScore(score.dimension_scores.revenue_structure)
      },
      digitalization: {
        score: score.dimension_scores.digitalization,
        interpretation: interpretScore(score.dimension_scores.digitalization)
      },
      scalability: { score: score.dimension_scores.scalability, interpretation: interpretScore(score.dimension_scores.scalability) }
    },
    problems_detected: problems,
    opportunities,
    recommended_routes: routes
  };
}
