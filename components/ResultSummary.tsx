import { ACAEScore } from "@/lib/calculateACAE";

type Props = {
  scores: ACAEScore;
};

export function ResultSummary({ scores }: Props) {
  const items = [
    { label: "Atracción", value: scores.atraccion },
    { label: "Conversión", value: scores.conversion },
    { label: "Autoridad", value: scores.autoridad },
    { label: "Escalabilidad", value: scores.escalabilidad }
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Resumen de puntajes</h2>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between text-slate-700">
            <span>{item.label}</span>
            <strong>{item.value} / 15</strong>
          </li>
        ))}
      </ul>
      <div className="mt-5 rounded-lg bg-slate-100 p-4 text-slate-800">
        <span className="font-medium">Puntaje total:</span> <strong>{scores.total} / 60</strong>
      </div>
    </section>
  );
}
