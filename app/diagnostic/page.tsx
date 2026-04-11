"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { canRunDiagnostic, getGrowthState, isBuilderMode, runDiagnostic } from "@/lib/growthSystem";
import {
  BrainQuestion,
  BrainState,
  buildSystemReply,
  canGenerateStrategicOutput,
  createInitialBrainState,
  getBrainProgress,
  getDiagnosticStepOutline,
  getNextQuestion,
  mapBrainToAcaeAnswers,
  registerAnswer,
  validateResponse
} from "@/lib/acae-brain";

export default function DiagnosticPage() {
  const router = useRouter();
  const [brain, setBrain] = useState<BrainState>(createInitialBrainState());
  const [currentQuestion, setCurrentQuestion] = useState<BrainQuestion | null>(null);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [userNote, setUserNote] = useState("");
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState("Inicia respondiendo con claridad para activar diagnóstico estratégico.");
  const [builderMode, setBuilderMode] = useState(false);

  useEffect(() => {
    const state = getGrowthState();
    const isBuilder = isBuilderMode(state);
    setBuilderMode(isBuilder);

    if (!isBuilder) {
      const permission = canRunDiagnostic(state);
      if (!permission.allowed) {
        const next = permission.nextDate ? permission.nextDate.toLocaleDateString("es-ES") : "-";
        setMessage(`Próximo diagnóstico disponible: ${next}`);
      }
    }

    const first = getNextQuestion(createInitialBrainState());
    setCurrentQuestion(first);
  }, []);

  const progress = useMemo(() => getBrainProgress(brain), [brain]);
  const percent = progress.total ? Math.round((progress.asked / progress.total) * 100) : 0;
  const stepOutline = useMemo(() => getDiagnosticStepOutline(), []);

  const getStepStatus = (stepId: string) => {
    if (brain.askedQuestionIds.includes(stepId)) return "completed";
    if (currentQuestion?.id === stepId) return "active";
    return "pending";
  };

  const submitCurrentAnswer = () => {
    if (!currentQuestion || selectedScore === null) return;

    const note = userNote.trim();
    const quality = validateResponse(selectedScore, note);
    if (!quality.valid) {
      setMessage(quality.reason ?? "Respuesta inválida.");
      return;
    }

    const nextBrain = registerAnswer(brain, currentQuestion, selectedScore, note || undefined);
    const systemReply = buildSystemReply(nextBrain);
    const nextQuestion = getNextQuestion(nextBrain);

    setBrain(nextBrain);
    setCurrentQuestion(nextQuestion);
    setSelectedScore(null);
    setUserNote("");
    setFeedback(systemReply);
    setMessage("");
  };

  const skipStep = () => {
    if (!builderMode || !currentQuestion) return;
    const nextBrain = registerAnswer(brain, currentQuestion, 3, "Paso saltado en modo prueba");
    setBrain(nextBrain);
    setCurrentQuestion(getNextQuestion(nextBrain));
    setFeedback("Paso saltado en Modo Prueba.");
  };

  const resetDiagnostic = () => {
    if (!builderMode) return;
    const initial = createInitialBrainState();
    setBrain(initial);
    setCurrentQuestion(getNextQuestion(initial));
    setSelectedScore(null);
    setUserNote("");
    setMessage("");
    setFeedback("Diagnóstico reiniciado en Modo Prueba.");
  };

  const finishDiagnostic = () => {
    const outputGate = canGenerateStrategicOutput(brain);
    if (!outputGate.allowed) {
      setMessage(outputGate.reason ?? "Falta validar información crítica.");
      return;
    }

    const acaeAnswers = mapBrainToAcaeAnswers(brain);
    const result = runDiagnostic(acaeAnswers);
    if (!result.created && !builderMode) {
      const next = result.permission.nextDate ? result.permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`No puedes ejecutar otro diagnóstico todavía. Próxima fecha: ${next}`);
      return;
    }

    localStorage.setItem(
      "acae_dynamic_context",
      JSON.stringify({
        flow: brain.criticalFocus ?? "flujoOferta",
        context: brain.escenario,
        realtime: {
          mainProblem: brain.problemaDetectado,
          impact: "Impacto detectado sobre consistencia de crecimiento y ventas.",
          rootCause: "Causa estimada en base a tus respuestas conversacionales.",
          consequence: "Si no se corrige, el negocio seguirá creciendo con fricción estructural."
        }
      })
    );

    router.push("/results");
  };

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-100 bg-white p-5 shadow-soft">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Onboarding Diagnóstico ACAE</h1>
            <p className="text-sm text-slate-600">Experiencia guiada: una pregunta a la vez, feedback inmediato y validación estricta.</p>
          </div>
          {builderMode && <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Modo Prueba</span>}
        </header>

        <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div>
              <p className="text-sm font-semibold text-slate-900">Progreso</p>
              <div className="mt-2 h-2 rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${percent}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-600">{progress.asked}/{progress.total} pasos</p>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {stepOutline.map((step, index) => {
                const status = getStepStatus(step.id);
                return (
                  <div
                    key={step.id}
                    className={`rounded-lg border p-3 text-xs ${
                      status === "completed"
                        ? "border-emerald-200 bg-emerald-50"
                        : status === "active"
                          ? "border-brand-700 bg-brand-50"
                          : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <p className="font-semibold text-slate-700">Paso {index + 1}</p>
                    <p className="mt-1 text-slate-600">{step.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg bg-lavender-100 p-3 text-sm text-slate-700">
              <p className="font-semibold text-brand-700">Diagnóstico en tiempo real</p>
              <p className="mt-1">Problema principal: {brain.problemaDetectado}</p>
              <p>Escenario: {brain.escenario}</p>
              <p>Claridad base: {brain.clarityScore}</p>
            </div>
          </aside>

          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            {currentQuestion ? (
              <>
                <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Pregunta actual</p>
                <h2 className="text-2xl font-semibold text-slate-900">{currentQuestion.text}</h2>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setSelectedScore(score)}
                      className={`h-10 w-10 rounded-full border font-semibold ${
                        selectedScore === score
                          ? "border-brand-600 bg-brand-600 text-white"
                          : "border-slate-300 bg-white text-slate-700"
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>

                <textarea
                  value={userNote}
                  onChange={(event) => setUserNote(event.target.value)}
                  placeholder="Describe contexto específico para evitar respuestas vagas"
                  className="min-h-28 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800"
                />

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={submitCurrentAnswer}
                    disabled={selectedScore === null}
                    className="rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    Guardar y continuar
                  </button>
                  {builderMode && (
                    <>
                      <button type="button" onClick={skipStep} className="rounded-lg border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700">
                        Saltar paso
                      </button>
                      <button type="button" onClick={resetDiagnostic} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                        Reiniciar diagnóstico
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-slate-900">Diagnóstico listo</h2>
                <p className="text-slate-700">Validación completada. Ya puedes generar tu resultado estratégico.</p>
                <button type="button" onClick={finishDiagnostic} className="rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700">
                  Ver diagnóstico final
                </button>
                {builderMode && (
                  <button type="button" onClick={resetDiagnostic} className="ml-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">
                    Reiniciar diagnóstico
                  </button>
                )}
              </>
            )}

            <div className="rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm text-slate-700">
              <p className="font-semibold text-brand-700">Feedback inmediato</p>
              <p className="mt-1">{feedback}</p>
            </div>

            {message && !builderMode ? <p className="text-sm font-medium text-amber-700">{message}</p> : null}
          </section>
        </section>
      </Container>
    </main>
  );
}
