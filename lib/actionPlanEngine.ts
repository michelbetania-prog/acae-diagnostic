import { ACAE_MATRIX, BusinessDimension, MatrixLevel } from "@/lib/acaeMatrix";
import { ActionPlanAdvanced, ActionPlanBase, DiagnosticDimensionScores } from "@/lib/types";

function scoreToLevel(score: number): MatrixLevel {
  if (score <= 3) return 1;
  if (score <= 6) return 2;
  if (score <= 9) return 3;
  if (score <= 12) return 4;
  return 5;
}

function getDimensionLevels(result: DiagnosticDimensionScores): Record<BusinessDimension, MatrixLevel> {
  return {
    attraction: scoreToLevel(result.attractionScore),
    conversion: scoreToLevel(result.conversionScore),
    automation: scoreToLevel(result.automationScore),
    scale: scoreToLevel(result.scaleScore)
  };
}

function getDimensionScores(result: DiagnosticDimensionScores): Record<BusinessDimension, number> {
  return {
    attraction: result.attractionScore,
    conversion: result.conversionScore,
    automation: result.automationScore,
    scale: result.scaleScore
  };
}

function getPriorities(result: DiagnosticDimensionScores): BusinessDimension[] {
  const levels = getDimensionLevels(result);
  const scores = getDimensionScores(result);

  return (Object.keys(levels) as BusinessDimension[]).sort((a, b) => {
    if (levels[a] === levels[b]) return scores[a] - scores[b];
    return levels[a] - levels[b];
  });
}

export function calculateBusinessStage(result: DiagnosticDimensionScores): ActionPlanBase["businessStage"] {
  const levels = Object.values(getDimensionLevels(result));
  const avg = levels.reduce((acc, level) => acc + level, 0) / levels.length;

  if (avg < 1.8) return "IDEA";
  if (avg < 2.6) return "VALIDATION";
  if (avg < 3.4) return "GROWTH";
  if (avg < 4.4) return "SYSTEMIZATION";
  return "SCALE";
}

export function getStrategicFocus(result: DiagnosticDimensionScores): string {
  const priorities = getPriorities(result);
  const primary = priorities[0];
  const level = getDimensionLevels(result)[primary];
  return ACAE_MATRIX[primary][level].focus;
}

export function generateTasksFromDiagnostic(result: DiagnosticDimensionScores): ActionPlanBase["tasks"] {
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

export function generateActionPlan(result: DiagnosticDimensionScores): ActionPlanBase {
  return {
    priorities: getPriorities(result),
    tasks: generateTasksFromDiagnostic(result),
    strategicFocus: getStrategicFocus(result),
    businessStage: calculateBusinessStage(result)
  };
}

export function generateAdvancedActionPlan(result: DiagnosticDimensionScores): ActionPlanAdvanced {
  const base = generateActionPlan(result);
  const waves = [
    { name: "Wave 1", tasks: base.tasks.slice(0, 3) },
    { name: "Wave 2", tasks: base.tasks.slice(3) }
  ];
  return {
    ...base,
    waves,
    criticalPath: base.tasks.slice(0, 3).map((task) => task.title),
    warnings: base.priorities.length ? [] : ["No priorities detected"],
    estimatedWeeks: Math.max(base.tasks.length * 2, 2)
  };
}
