"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { RadarChart } from "@/components/RadarChart";
import { RecommendationBox } from "@/components/RecommendationBox";
import { ResultSummary } from "@/components/ResultSummary";
import { calculateACAE } from "@/lib/calculateACAE";

function getInterpretation(total: number) {
  if (total <= 20) return "Negocio invisible";
  if (total <= 35) return "Negocio inconsistente";
  if (total <= 50) return "Negocio estructurado";
  return "Negocio escalable";
}

export default function ResultsPage() {
  const [parsed, setParsed] = useState<Record<number, number> | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("acae_answers");
    if (!raw) return;

    try {
      const data = JSON.parse(raw) as Record<string, number>;
      const normalized = Object.entries(data).reduce<Record<number, number>>((acc, [k, v]) => {
        acc[Number(k)] = Number(v);
        return acc;
      }, {});
      setParsed(normalized);
    } catch {
      setParsed(null);
    }
  }, []);

  if (!parsed) {
    return (
      <main className="py-14">
        <Container className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-semibold text-slate-900">No hay resultados disponibles</h1>
          <p className="mt-2 text-slate-600">Primero completa el diagnóstico para obtener tu reporte.</p>
          <Link href="/diagnostic" className="mt-5 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-white">
            Ir al diagnóstico
          </Link>
        </Container>
      </main>
    );
  }

  const scores = calculateACAE(parsed);
  const interpretation = getInterpretation(scores.total);

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Resultado Estratégico ACAE</h1>
          <p className="mt-2 text-slate-600">Interpretación general: {interpretation}</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ResultSummary scores={scores} />
          <RadarChart scores={scores} />
        </div>

        <RecommendationBox scores={scores} />
      </Container>
    </main>
  );
}
