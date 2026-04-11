"use client";

import { useEffect, useMemo, useState } from "react";
import { JourneySession, getGrowthState, getJourneyProgress, getJourneySessions, getLatestDiagnostic } from "@/lib/growthSystem";

export default function DashboardSessionsPage() {
  const [sessions, setSessions] = useState<JourneySession[]>([]);

  useEffect(() => {
    const latest = getLatestDiagnostic(getGrowthState());
    if (!latest) return;
    setSessions(getJourneySessions(latest));
  }, []);

  const progress = useMemo(() => getJourneyProgress(sessions), [sessions]);

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Sesiones progresivas</h1>
      <p className="mt-2 text-slate-600">Estado de tu journey estratégico (bloqueado, activo, completado).</p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm text-slate-500">Progreso del recorrido</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{progress.percent}%</p>
        <p className="text-sm text-slate-600">
          {progress.completedSteps} de {progress.totalSteps} pasos completados
        </p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {sessions.map((session) => (
          <article key={session.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
            <h2 className="font-semibold text-slate-900">{session.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{session.objective}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Estado: {session.status}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
