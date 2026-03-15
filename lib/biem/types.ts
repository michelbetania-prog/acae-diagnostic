export type BIEMQuestionType = "multiple_choice" | "numeric" | "boolean";

export type QuestionnaireCategory =
  | "market_problem_validation"
  | "value_proposition_differentiation"
  | "customer_acquisition_system"
  | "revenue_structure"
  | "digitalization_scalability";

export type ScoreDimension =
  | "strategy"
  | "value_proposition"
  | "customer_acquisition"
  | "revenue_structure"
  | "digitalization"
  | "scalability";

export type BIEMQuestion = {
  id: string;
  question: string;
  type: BIEMQuestionType;
  weight: number;
  category: QuestionnaireCategory;
  scale?: {
    min: number;
    max: number;
  };
  contributesTo?: ScoreDimension[];
};

export type BIEMAnswer = string | number | boolean;
export type BIEMAnswers = Record<string, BIEMAnswer>;

export type BIEMDimensionScores = Record<ScoreDimension, number>;

export type BusinessStage = "idea" | "validation" | "early_growth" | "scaling" | "established";

export type BIEMScoreResult = {
  overall_score: number;
  dimension_scores: BIEMDimensionScores;
};

export type DetectedProblem = {
  id: string;
  problem: string;
  cause: string;
  severity: "low" | "medium" | "high";
  related_dimension: ScoreDimension;
  trigger_rule: string;
};

export type StrategicRoute = {
  id: string;
  title: string;
  description: string;
  complexity_level: "low" | "medium" | "high";
  related_business_dimension: ScoreDimension;
};

export type SolutionCategory =
  | "Market Validation"
  | "Positioning"
  | "Customer Acquisition"
  | "Digital Transformation"
  | "Offer Structure"
  | "Monetization"
  | "Growth Systems"
  | "Optimization"
  | "Innovation";

export type Solution = {
  id: string;
  title: string;
  description: string;
  category: SolutionCategory;
  applicable_problem: string;
  complexity_level: "low" | "medium" | "high";
  maturity_stage: BusinessStage;
};

export type BIEMDiagnosticReport = {
  business_score: number;
  dimension_analysis: Record<ScoreDimension, { score: number; interpretation: string }>;
  problems_detected: DetectedProblem[];
  opportunities: string[];
  recommended_routes: StrategicRoute[];
};

export type AIAnalysisPayload = {
  business_stage: BusinessStage;
  user_responses: BIEMAnswers;
  calculated_scores: BIEMScoreResult;
  detected_problems: DetectedProblem[];
  recommended_routes: StrategicRoute[];
  metadata: {
    generated_at: string;
    engine_version: string;
    format: "biem_ai_payload_v1";
  };
};

export type BIEMDiagnosticOutput = {
  report: BIEMDiagnosticReport;
  ai_payload: AIAnalysisPayload;
  solutions_catalog_matches: Solution[];
};
