import { buildAIAnalysisPayload } from "@/lib/biem/aiPreparationLayer";
import { detectBusinessProblems } from "@/lib/biem/problemDetectionEngine";
import { biemQuestionnaire } from "@/lib/biem/questionnaire";
import { buildDiagnosticReport } from "@/lib/biem/reportEngine";
import { calculateBIEMScores, inferBusinessStage } from "@/lib/biem/scoringEngine";
import { getSolutionsForProblems, solutionKnowledgeBase } from "@/lib/biem/solutionKnowledgeBase";
import { recommendStrategicRoutes } from "@/lib/biem/strategicRouteEngine";
import { BIEMAnswers, BIEMDiagnosticOutput } from "@/lib/biem/types";

export function runBIEMDiagnostic(answers: BIEMAnswers): BIEMDiagnosticOutput {
  const score = calculateBIEMScores(answers);
  const businessStage = inferBusinessStage(score.overall_score);
  const problems = detectBusinessProblems(answers, score);
  const routes = recommendStrategicRoutes(problems);
  const report = buildDiagnosticReport(score, problems, routes);
  const aiPayload = buildAIAnalysisPayload({
    responses: answers,
    score,
    problems,
    routes,
    businessStage
  });

  return {
    report,
    ai_payload: aiPayload,
    solutions_catalog_matches: getSolutionsForProblems(problems.map((problem) => problem.problem))
  };
}

export { biemQuestionnaire, solutionKnowledgeBase };
