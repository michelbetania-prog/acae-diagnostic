import { ACAEScore } from "@/lib/calculateACAE";
import { getRecommendations } from "@/lib/recommendations";

type Props = {
  scores: ACAEScore;
};

export function RecommendationBox({ scores }: Props) {
  const recommendations = getRecommendations(scores);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Recomendaciones estratégicas</h2>
      <p className="mt-2 text-slate-600">Enfócate primero en: {recommendations.dimension}.</p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
        {recommendations.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
