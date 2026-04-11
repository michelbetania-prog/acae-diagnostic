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
  const [openStepId, setOpenStepId] = useState<string | null>(null);
  const [animatedStepId, setAnimatedStepId] = useState<string | null>(null);

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
    if (result.sessionFeedback) {
      setSessionFeedback(`Ya puedes avanzar al siguiente nivel. ${result.sessionFeedback}`);
    } else {
      setSessionFeedback("Ya tienes base para vender; continúa con el siguiente paso lógico.");
    }
    setAnimatedStepId(stepId);
    setTimeout(() => setAnimatedStepId(null), 600);
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 shadow-soft">
        <h1 className="text-3xl font-bold text-slate-900">Recorrido de Ejecución ACAE</h1>
        <p className="mt-2 text-slate-700">
          Experiencia guiada, interactiva y progresiva: ejecuta un paso a la vez con claridad de objetivo, método y continuidad.
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Progreso total</span>
            <span>
              {progress.completedSteps}/{progress.totalSteps} pasos
            </span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-600 transition-all duration-500" style={{ width: `${progress.percent}%` }} />
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
                <span className="font-semibold">Objetivo de sesión:</span> {session.objective}
              </p>

              <div className="mt-4 space-y-3">
                {session.steps.map((step, stepIndex) => {
                  const prev = session.steps[stepIndex - 1];
                  const dependencyReady = stepIndex === 0 || prev?.status === "completed";
                  const isOpen = openStepId === step.id;
                  const isAnimated = animatedStepId === step.id;

                  return (
                    <div
                      key={step.id}
                      className={`rounded-xl border p-4 transition-all ${
                        step.status === "completed"
                          ? "border-emerald-200 bg-emerald-50"
                          : dependencyReady
                            ? "border-slate-200 bg-white"
                            : "border-slate-200 bg-slate-50"
                      } ${isAnimated ? "scale-[1.01]" : "scale-100"}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">{step.title}</p>
                          <p className="text-xs text-slate-500">
                            Estado: {step.status === "completed" ? "Completado" : dependencyReady ? "Activo" : "Bloqueado"}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOpenStepId(isOpen ? null : step.id)}
                          className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          {isOpen ? "Ocultar detalle" : "Ver detalle"}
                        </button>
                      </div>

                      {isOpen && (
                        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
                          <p>
                            <span className="font-semibold">Objetivo:</span> {step.objective}
                          </p>
                          <div>
                            <p className="font-semibold">Cómo hacerlo paso a paso:</p>
                            <ol className="mt-1 list-decimal space-y-1 pl-5">
                              {step.instructions.map((instruction) => (
                                <li key={instruction}>{instruction}</li>
                              ))}
                            </ol>
                          </div>
                          <p>
                            <span className="font-semibold">Ejemplo real:</span> {step.example}
                          </p>
                          <p>
                            <span className="font-semibold">Error común:</span> {step.warning}
                          </p>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          disabled={session.status !== "active" || step.status === "completed" || !dependencyReady}
                          onClick={() => completeStep(session.id, step.id)}
                          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          {step.status === "completed" ? "Paso completado" : "Completar paso"}
                        </button>
                        {!dependencyReady && <span className="text-xs text-amber-700">Completa el paso anterior para continuar.</span>}
                      </div>
                    </div>
                  );
                })}
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
