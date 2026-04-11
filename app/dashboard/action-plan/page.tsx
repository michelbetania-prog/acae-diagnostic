"use client";

import { useEffect, useMemo, useState } from "react";
import {
  DiagnosticResult,
  JourneySession,
  completeJourneyStep,
  getGrowthState,
  getJourneyProgress,
  getJourneySessions,
  getLatestDiagnostic
} from "@/lib/growthSystem";

function badgeStyles(status: JourneySession["status"]) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700";
  if (status === "active") return "bg-brand-100 text-brand-700";
  return "bg-slate-200 text-slate-600";
}

function badgeLabel(status: JourneySession["status"]) {
  if (status === "completed") return "Completada";
  if (status === "active") return "Activa";
  return "Bloqueada";
}

export default function DashboardActionPlanPage() {
  const [latest, setLatest] = useState<DiagnosticResult | null>(null);
  const [sessions, setSessions] = useState<JourneySession[]>([]);
  const [stepFeedback, setStepFeedback] = useState("");
  const [sessionFeedback, setSessionFeedback] = useState("");

  useEffect(() => {
    const last = getLatestDiagnostic(getGrowthState());
    setLatest(last);
    if (last) setSessions(getJourneySessions(last));
  }, []);

  const progress = useMemo(() => getJourneyProgress(sessions), [sessions]);

  const completeStep = (sessionId: string, stepId: string) => {
    if (!latest) return;
    const result = completeJourneyStep(latest.id, sessionId, stepId);
    setSessions(result.sessions);
    setStepFeedback(result.stepFeedback);
    if (result.sessionFeedback) setSessionFeedback(result.sessionFeedback);
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Recorrido de Ejecución ACAE</h1>
        <p className="mt-2 text-slate-700">
          Sistema progresivo por sesiones: una etapa activa a la vez, desbloqueo automático y feedback estratégico.
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Progreso total</span>
            <span>
              {progress.completedSteps}/{progress.totalSteps} pasos
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${progress.percent}%` }} />
          </div>
        </div>
      </header>

      {!latest ? (
        <p className="mt-6 text-slate-600">Completa un diagnóstico para activar tu recorrido estratégico.</p>
      ) : (
        <section className="mt-6 space-y-5">
          {sessions.map((session, index) => (
            <article
              key={session.id}
              className={`rounded-2xl border p-5 shadow-soft ${
                session.status === "locked" ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Etapa {index + 1}</p>
                  <h2 className="text-xl font-semibold text-slate-900">{session.title}</h2>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles(session.status)}`}>
                  {badgeLabel(session.status)}
                </span>
              </div>

              <p className="mt-2 text-slate-700">
                <span className="font-semibold">Objetivo:</span> {session.objective}
              </p>

              <div className="mt-4 space-y-3">
                {session.steps.map((step) => (
                  <div key={step.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="font-medium text-slate-900">{step.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{step.example}</p>

                    <button
                      type="button"
                      disabled={session.status !== "active" || step.status === "completed"}
                      onClick={() => completeStep(session.id, step.id)}
                      className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {step.status === "completed" ? "Paso completado" : "Marcar paso como completado"}
                    </button>
                  </div>
                ))}
              </div>
            </article>
          ))}

          {(stepFeedback || sessionFeedback) && (
            <aside className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-800">Feedback del sistema</h3>
              {stepFeedback ? <p className="mt-2 text-emerald-900">• {stepFeedback}</p> : null}
              {sessionFeedback ? <p className="mt-1 text-emerald-900">• {sessionFeedback}</p> : null}
            </aside>
          )}
        </section>
      )}
    </main>
  );
}
