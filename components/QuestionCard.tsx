import { Question } from "@/lib/questions";

type Props = {
  question: Question;
  value?: number;
  onSelect: (questionId: number, value: number) => void;
};

const dimensionLabel: Record<Question["dimension"], string> = {
  atraccion: "Atracción",
  conversion: "Conversión",
  autoridad: "Autoridad",
  escalabilidad: "Escalabilidad"
};

export function QuestionCard({ question, value, onSelect }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm uppercase tracking-wide text-slate-500">{dimensionLabel[question.dimension]}</p>
      <h2 className="mt-1 text-lg font-medium text-slate-900">
        {question.id}. {question.text}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onSelect(question.id, score)}
            className={`h-10 w-10 rounded-full border text-sm font-semibold transition ${
              value === score
                ? "border-brand-700 bg-brand-600 text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-brand-600"
            }`}
          >
            {score}
          </button>
        ))}
      </div>
    </article>
  );
}
