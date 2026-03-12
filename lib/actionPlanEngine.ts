import { ACAE_MATRIX, BusinessDimension, MatrixLevel } from "@/lib/acaeMatrix";
import { DiagnosticResult } from "@/lib/diagnosticEngine";

export type BusinessStage = "IDEA" | "VALIDATION" | "GROWTH" | "SYSTEMIZATION" | "SCALE";

export type GeneratedTask = {
  title: string;
  dimension: BusinessDimension;
};

export type ActionPlan = {
  priorities: BusinessDimension[];
  tasks: GeneratedTask[];
  strategicFocus: string;
  businessStage: BusinessStage;
};

function scoreToLevel(score: number): MatrixLevel {
  if (score <= 3) return 1;
  if (score <= 6) return 2;
  if (score <= 9) return 3;
  if (score <= 12) return 4;
  return 5;
}

function getDimensionLevels(result: DiagnosticResult): Record<BusinessDimension, MatrixLevel> {
  return {
    attraction: scoreToLevel(result.attractionScore),
    conversion: scoreToLevel(result.conversionScore),
    automation: scoreToLevel(result.automationScore),
    scale: scoreToLevel(result.scaleScore)
  };
}

function getDimensionScores(result: DiagnosticResult): Record<BusinessDimension, number> {
  return {
    attraction: result.attractionScore,
    conversion: result.conversionScore,
    automation: result.automationScore,
    scale: result.scaleScore
  };
}

function getPriorities(result: DiagnosticResult): BusinessDimension[] {
  const levels = getDimensionLevels(result);
  const scores = getDimensionScores(result);

  return (Object.keys(levels) as BusinessDimension[]).sort((a, b) => {
    if (levels[a] === levels[b]) return scores[a] - scores[b];
    return levels[a] - levels[b];
  });
}

export function calculateBusinessStage(result: DiagnosticResult): BusinessStage {
  const levels = Object.values(getDimensionLevels(result));
  const avg = levels.reduce((acc, level) => acc + level, 0) / levels.length;

  if (avg < 1.8) return "IDEA";
  if (avg < 2.6) return "VALIDATION";
  if (avg < 3.4) return "GROWTH";
  if (avg < 4.4) return "SYSTEMIZATION";
  return "SCALE";
}

export function getStrategicFocus(result: DiagnosticResult): string {
  const priorities = getPriorities(result);
  const primary = priorities[0];
  const level = getDimensionLevels(result)[primary];
  return ACAE_MATRIX[primary][level].focus;
}

export function generateTasksFromDiagnostic(result: DiagnosticResult): GeneratedTask[] {
  const priorities = getPriorities(result).slice(0, 2);
  const levels = getDimensionLevels(result);

  return priorities.flatMap((dimension) => {
    const level = levels[dimension];
    return ACAE_MATRIX[dimension][level].tasks.map((task) => ({
      title: task,
      dimension
    }));
  });
}

export function generateActionPlan(result: DiagnosticResult): ActionPlan {
  return {
    priorities: getPriorities(result),
    tasks: generateTasksFromDiagnostic(result),
    strategicFocus: getStrategicFocus(result),
    businessStage: calculateBusinessStage(result)
  };
}
