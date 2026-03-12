import { ACAEScore } from "@/lib/calculateACAE";
import { BusinessDimension } from "@/lib/acaeMatrix";

export type TaskStatus = "pending" | "completed";

export type Task = {
  id: string;
  title: string;
  description: string;
  dimension: string;
  status: TaskStatus;
  due_date: string;
};

export type DiagnosticDimensionScores = {
  attractionScore: number;
  conversionScore: number;
  automationScore: number;
  scaleScore: number;
};

export type BusinessStage = "IDEA" | "VALIDATION" | "GROWTH" | "SYSTEMIZATION" | "SCALE";

export type ActionPlanTask = {
  title: string;
  dimension: BusinessDimension;
};

export type ActionPlanBase = {
  priorities: BusinessDimension[];
  tasks: ActionPlanTask[];
  strategicFocus: string;
  businessStage: BusinessStage;
};

export type ActionPlanAdvanced = ActionPlanBase & {
  waves: Array<{ name: string; tasks: ActionPlanTask[] }>;
  criticalPath: string[];
  warnings: string[];
  estimatedWeeks: number;
};

export type DiagnosticRecord = {
  id: string;
  createdAt: string;
  answers: Record<number, number>;
  score: ACAEScore;
  weakestDimension: string;
  plan: string[];
  tasks: Task[];
  businessStage: BusinessStage;
  priorities: BusinessDimension[];
  strategicFocus: string;
};
