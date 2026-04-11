"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { canRunDiagnostic, getGrowthState, runDiagnostic } from "@/lib/growthSystem";
import {
  BrainQuestion,
  BrainState,
  buildSystemReply,
  canGenerateStrategicOutput,
  createInitialBrainState,
  getBrainProgress,
  getNextQuestion,
  mapBrainToAcaeAnswers,
  registerAnswer,
  validateResponse
} from "@/lib/acae-brain";

type ChatMessage = {
  id: string;
  role: "system" | "user";
  text: string;
};

export default function DiagnosticPage() {
  const router = useRouter();
  const [brain, setBrain] = useState<BrainState>(createInitialBrainState());
  const [currentQuestion, setCurrentQuestion] = useState<BrainQuestion | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [userNote, setUserNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const state = getGrowthState();
    const permission = canRunDiagnostic(state);
    if (!permission.allowed) {
      const next = permission.nextDate ? permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`Próximo diagnóstico disponible: ${next}`);
    }

    const first = getNextQuestion(createInitialBrainState());
    setCurrentQuestion(first);
    if (first) {
      setMessages([
        {
          id: "welcome",
          role: "system",
          text: "Soy ACAE Brain. Voy a diagnosticar tu negocio conversando contigo, no con un formulario fijo."
        },
        {
          id: first.id,
          role: "system",
          text: first.text
        }
      ]);
    }
  }, []);

  const progress = useMemo(() => {
    const data = getBrainProgress(brain);
    return Math.round((data.asked / data.total) * 100);
  }, [brain]);

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

    const userMessageParts = [`Puntaje: ${selectedScore}/5`];
    if (note) userMessageParts.push(`Nota: ${note}`);

    const nextMessages: ChatMessage[] = [
      ...messages,
      {
        id: `user-${currentQuestion.id}-${Date.now()}`,
        role: "user",
        text: userMessageParts.join(" · ")
      },
      {
        id: `system-feedback-${Date.now()}`,
        role: "system",
        text: systemReply
      }
    ];

    if (nextQuestion) {
      nextMessages.push({
        id: `system-q-${nextQuestion.id}-${Date.now()}`,
        role: "system",
        text: nextQuestion.text
      });
    } else {
      nextMessages.push({
        id: `system-end-${Date.now()}`,
        role: "system",
        text: "Tengo suficiente contexto estratégico. Ya puedo generar tu diagnóstico final."
      });
    }

    setMessages(nextMessages);
    setBrain(nextBrain);
    setCurrentQuestion(nextQuestion);
    setSelectedScore(null);
    setUserNote("");
    setMessage("");
  };

  const finishDiagnostic = () => {
    const outputGate = canGenerateStrategicOutput(brain);
    if (!outputGate.allowed) {
      setMessage(outputGate.reason ?? "Falta validar información crítica.");
      return;
    }

    const acaeAnswers = mapBrainToAcaeAnswers(brain);
    const result = runDiagnostic(acaeAnswers);
    if (!result.created) {
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
      <Container className="space-y-6">
        <header className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">ACAE Brain</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">Diagnóstico conversacional dinámico</h1>
          <p className="mt-2 text-slate-700">
            Te haré preguntas adaptativas según lo que respondas. Si detecto un bloqueo crítico, enfocaré la conversación ahí.
          </p>
          <p className="mt-2 text-sm text-slate-600">Progreso estratégico: {progress}%</p>
        </header>

        <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
          {messages.map((item) => (
            <div
              key={item.id}
              className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm ${
                item.role === "system" ? "bg-slate-100 text-slate-800" : "ml-auto bg-brand-600 text-white"
              }`}
            >
              {item.text}
            </div>
          ))}
        </section>

        {currentQuestion ? (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-900">Tu respuesta</h2>
            <p className="mt-1 text-sm text-slate-600">Responde rápido (1 a 5) y agrega contexto si quieres.</p>

            <div className="mt-4 flex gap-2">
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
              placeholder="Ejemplo: dependo de referidos y no tengo seguimiento automático"
              className="mt-4 min-h-24 w-full rounded-lg border border-slate-300 p-3 text-sm text-slate-800"
            />

            <button
              type="button"
              onClick={submitCurrentAnswer}
              disabled={selectedScore === null}
              className="mt-4 rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              Enviar respuesta
            </button>
          </section>
        ) : (
          <section className="rounded-xl border border-brand-200 bg-brand-50 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Diagnóstico listo para generar</h2>
            <p className="mt-2 text-slate-700">
              Resumen detectado: <strong>{brain.problemaDetectado}</strong>. Ahora te mostraré tu resultado estratégico.
            </p>
            <button
              type="button"
              onClick={finishDiagnostic}
              className="mt-4 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
            >
              Ver diagnóstico final
            </button>
          </section>
        )}

        {message ? <p className="text-sm font-medium text-amber-700">{message}</p> : null}
      </Container>
    </main>
  );
}
