"use client";

import { useEffect, useState } from "react";
import { GrowthState, getDefaultGrowthState, getGrowthState, getProgressComparison } from "@/lib/growthSystem";

export default function DashboardProgressPage() {
  const [state, setState] = useState<GrowthState>(getDefaultGrowthState());

  useEffect(() => {
    setState(getGrowthState());
  }, []);

  const comparison = getProgressComparison(state);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Progreso</h1>
      <p className="mt-2 text-slate-600">Evolución del negocio según nuevos diagnósticos.</p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        {!comparison ? (
          <p className="text-slate-600">Necesitas al menos 2 diagnósticos para comparar progreso.</p>
        ) : (
          <div className="space-y-2 text-slate-700">
            <p><strong>Primer score:</strong> {comparison.firstTotal}/60</p>
            <p><strong>Último score:</strong> {comparison.latestTotal}/60</p>
            <p><strong>Variación total:</strong> {comparison.deltaTotal > 0 ? `+${comparison.deltaTotal}` : comparison.deltaTotal}</p>
          </div>
        )}
      </section>
    </main>
  );
}
