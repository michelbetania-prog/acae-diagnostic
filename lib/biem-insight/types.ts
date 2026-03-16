export type DiagnosticDimension =
  | "idea_clarity"
  | "market_validation"
  | "strategic_focus"
  | "decision_making_mindset"
  | "execution_capacity";

export type Stage = "IDEA" | "PROJECT" | "OPERATING_BUSINESS" | "GROWTH_BUSINESS";
export type PotentialLevel = "High potential" | "Moderate potential" | "Early stage potential";

export type Option = {
  id: string;
  label: string;
  score: number;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  mentorIntro: string;
  dimension: DiagnosticDimension;
  options: Option[];
};

export type Answers = Record<string, string>;

export type Lead = {
  name: string;
  email: string;
  businessType?: string;
};

export type ScoreResult = {
  dimensionScores: Record<DiagnosticDimension, number>;
  totalScore: number;
  stage: Stage;
  potentialLevel: PotentialLevel;
};

export type DiagnosticOutput = {
  stage: Stage;
  strengths: string[];
  challenges: string[];
  recommendation: string;
  potential_level: PotentialLevel;
};

export type FullReport = DiagnosticOutput & {
  lead: Lead;
  answers: Answers;
  score: ScoreResult;
  conversationSummary: string;
};
