import { ACAEScore } from "@/lib/calculateACAE";

export type ProgressTask = {
  status: "pending" | "completed";
};

export type ProgressDiagnostic = {
  score: ACAEScore;
};

export function getTaskProgress(tasks: ProgressTask[]): number {
  if (!tasks.length) return 0;
  const completed = tasks.filter((task) => task.status === "completed").length;
  return Math.round((completed / tasks.length) * 100);
}

export function calculateBusinessProgress(diagnostics: ProgressDiagnostic[]) {
  if (diagnostics.length < 2) {
    return {
      firstTotal: diagnostics[0]?.score.total ?? 0,
      latestTotal: diagnostics[0]?.score.total ?? 0,
      deltaTotal: 0
    };
  }

  const first = diagnostics[0].score;
  const latest = diagnostics[diagnostics.length - 1].score;

  return {
    firstTotal: first.total,
    latestTotal: latest.total,
    deltaTotal: latest.total - first.total
  };
}
