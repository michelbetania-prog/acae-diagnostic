"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { questions } from "@/lib/questions";
import {
  PlanType,
  canRunDiagnostic,
  getGrowthState,
  getPlanLimit,
  runDiagnostic,
  updatePlan
} from "@/lib/growthSystem";

export default function DiagnosticPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [plan, setPlan] = useState<PlanType>("free");
  const [limitText, setLimitText] = useState(1);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const state = getGrowthState();
    setPlan(state.plan);
    setLimitText(getPlanLimit(state.plan));
    const permission = canRunDiagnostic(state);
    if (!permission.allowed) {
      const next = permission.nextDate ? permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`Límite alcanzado o en espera. Próximo diagnóstico disponible: ${next}`);
    }
  }, []);

  const completed = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((completed / questions.length) * 100);

  const handleSelect = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handlePlanChange = (value: PlanType) => {
    setPlan(value);
    const state = updatePlan(value);
    setLimitText(getPlanLimit(state.plan));
    const permission = canRunDiagnostic(state);
    if (!permission.allowed) {
      const next = permission.nextDate ? permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`No disponible por ahora. Próximo diagnóstico: ${next}`);
      return;
    }
    setMessage("");
  };

  const handleSubmit = () => {
    if (completed !== questions.length) return;
    const result = runDiagnostic(answers);
    if (!result.created) {
      const next = result.permission.nextDate ? result.permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`No puedes ejecutar otro diagnóstico todavía. Próxima fecha: ${next}`);
      return;
    }
    router.push("/results");
  };

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-900">Diagnóstico ACAE</h1>
          <p className="text-slate-600">Responde cada pregunta en una escala de 1 (bajo) a 5 (alto).</p>
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <label className="text-sm font-medium text-slate-700" htmlFor="plan">Plan:</label>
            <select
              id="plan"
              value={plan}
              onChange={(e) => handlePlanChange(e.target.value as PlanType)}
              className="rounded-md border border-slate-300 px-3 py-1 text-sm"
            >
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="pro">Pro</option>
            </select>
            <span className="text-sm text-slate-600">Diagnósticos totales permitidos: {limitText}</span>
          </div>
          {message ? <p className="text-sm font-medium text-amber-700">{message}</p> : null}
        </header>

        <ProgressBar progress={progress} completed={completed} total={questions.length} />

        <section className="space-y-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={answers[question.id]}
              onSelect={handleSelect}
            />
          ))}
        </section>

        <button
          onClick={handleSubmit}
          disabled={completed !== questions.length}
          className="rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition enabled:hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          Ver resultados
        </button>
      </Container>
    </main>
  );
}
