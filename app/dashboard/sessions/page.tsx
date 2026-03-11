"use client";

import { useEffect, useState } from "react";
import { getGrowthState, getSessionsAvailable } from "@/lib/growthSystem";

export default function DashboardSessionsPage() {
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    const state = getGrowthState();
    setSessions(getSessionsAvailable(state.plan));
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Sesiones</h1>
      <p className="mt-2 text-slate-600">Sesiones estratégicas disponibles con la consultora.</p>
      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">Disponibles este ciclo</p>
        <p className="mt-2 text-3xl font-bold text-slate-900">{sessions}</p>
      </article>
    </main>
  );
}
