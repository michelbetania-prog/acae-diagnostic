import { ACAEScore } from "@/lib/calculateACAE";

type Props = {
  percentage: number;
  scores: ACAEScore;
};

const COLOR = {
  nightIndigo: "#1B003F",
  twilightPurple: "#4B0082",
  midnightBlue: "#191970"
};

export function ScoreCard({ percentage, scores }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <p className="text-sm font-medium" style={{ color: COLOR.midnightBlue }}>ACAE SCORE</p>
      <p className="mt-2 text-5xl font-bold" style={{ color: COLOR.nightIndigo }}>{percentage}%</p>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: COLOR.twilightPurple }}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
          Atracción: {scores.atraccion}/15
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
          Conversión: {scores.conversion}/15
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
          Automatización: {scores.autoridad}/15
        </div>
        <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
          Escala: {scores.escalabilidad}/15
        </div>
      </div>
    </article>
  );
}
