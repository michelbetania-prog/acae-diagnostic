"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { questions } from "@/lib/questions";

export default function DiagnosticPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const completed = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = Math.round((completed / questions.length) * 100);

  const handleSelect = (id: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (completed !== questions.length) return;

    localStorage.setItem("acae_answers", JSON.stringify(answers));
    router.push("/results");
  };

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Diagnóstico ACAE</h1>
          <p className="mt-2 text-slate-600">Responde cada pregunta en una escala de 1 (bajo) a 5 (alto).</p>
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
