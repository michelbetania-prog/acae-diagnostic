import { questions } from "@/lib/questions";

export type ACAEScore = {
  atraccion: number;
  conversion: number;
  autoridad: number;
  escalabilidad: number;
  total: number;
};

export function calculateACAE(answers: Record<number, number>): ACAEScore {
  const score: ACAEScore = {
    atraccion: 0,
    conversion: 0,
    autoridad: 0,
    escalabilidad: 0,
    total: 0
  };

  questions.forEach((question) => {
    const value = answers[question.id] ?? 0;
    score[question.dimension] += value;
    score.total += value;
  });

  return score;
}
