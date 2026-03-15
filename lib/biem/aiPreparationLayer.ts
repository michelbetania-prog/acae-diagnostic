import { AIAnalysisPayload, BIEMAnswers, BIEMScoreResult, BusinessStage, DetectedProblem, StrategicRoute } from "@/lib/biem/types";

export function buildAIAnalysisPayload(params: {
  responses: BIEMAnswers;
  score: BIEMScoreResult;
  problems: DetectedProblem[];
  routes: StrategicRoute[];
  businessStage: BusinessStage;
}): AIAnalysisPayload {
  return {
    business_stage: params.businessStage,
    user_responses: params.responses,
    calculated_scores: params.score,
    detected_problems: params.problems,
    recommended_routes: params.routes,
    metadata: {
      generated_at: new Date().toISOString(),
      engine_version: "1.0.0",
      format: "biem_ai_payload_v1"
    }
  };
}
