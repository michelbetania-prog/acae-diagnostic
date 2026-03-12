"use client";

import { useEffect, useState } from "react";
import { DiagnosticResult, getGrowthState, getLatestDiagnostic } from "@/lib/growthSystem";

export default function DashboardActionPlanPage() {
  const [latest, setLatest] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    setLatest(getLatestDiagnostic(getGrowthState()));
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Plan de Acción</h1>
      {!latest ? (
        <p className="mt-2 text-slate-600">Completa un diagnóstico para generar tu plan de acción estratégico.</p>
      ) : (
        <>
          <p className="mt-2 text-slate-600">Dimensión crítica detectada: {latest.weakestDimension}.</p>
          <div className="mt-6 space-y-3">
            {latest.plan.map((item) => (
              <article key={item} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
                <h2 className="text-lg font-semibold text-slate-900">{item}</h2>
                <p className="text-sm text-slate-600">Recomendación prioritaria para mejorar tu crecimiento.</p>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
