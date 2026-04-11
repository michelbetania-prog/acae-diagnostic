"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { PlanType, canRunDiagnostic, getGrowthState, runDiagnostic } from "@/lib/growthSystem";
import {
  BusinessContext,
  FLOW_QUESTIONS,
  FRAME_TITLES,
  FrameId,
  FlowType,
  evaluateRealtime,
  mapDynamicAnswersToAcae
} from "@/lib/dynamicDiagnostic";

const FLOW_OPTIONS: Array<{ value: FlowType; title: string; description: string }> = [
  {
    value: "VALIDACION",
    title: "VALIDACIÓN",
    description: "Ideal para clarificar oferta y confirmar demanda real antes de escalar."
  },
  {
    value: "CONVERSION",
    title: "CONVERSIÓN",
    description: "Optimiza proceso comercial para cerrar más ventas con el mismo tráfico."
  },
  {
    value: "ESCALA",
    title: "ESCALA",
    description: "Diseñado para negocios que necesitan crecer sin colapsar operación."
  },
  {
    value: "CAOS",
    title: "CAOS",
    description: "Para cuando hay movimiento, pero falta foco y control estratégico."
  }
];

export default function DiagnosticPage() {
  const router = useRouter();
  const [frame, setFrame] = useState(1);
  const [flow, setFlow] = useState<FlowType>("VALIDACION");
  const [context, setContext] = useState<BusinessContext>("idea");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string>("");
  const [plan, setPlan] = useState<PlanType>("free");

  useEffect(() => {
    const state = getGrowthState();
    setPlan(state.plan);
    const permission = canRunDiagnostic(state);
    if (!permission.allowed) {
      const next = permission.nextDate ? permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`Por política de uso, el próximo diagnóstico se habilita: ${next}`);
    }
  }, []);

  const selectedQuestions = FLOW_QUESTIONS[flow];
  const completed = selectedQuestions.filter((question) => typeof answers[question.id] === "number").length;
  const realtime = useMemo(() => evaluateRealtime(flow, answers), [flow, answers]);

  const nextFrame = () => setFrame((prev) => Math.min(prev + 1, 6));
  const prevFrame = () => setFrame((prev) => Math.max(prev - 1, 1));

  const handleSelect = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinish = () => {
    if (completed !== selectedQuestions.length) {
      setMessage("Responde todas las preguntas del flujo para completar tu diagnóstico.");
      return;
    }

    const acaeAnswers = mapDynamicAnswersToAcae(answers, flow);
    const result = runDiagnostic(acaeAnswers);
    if (!result.created) {
      const next = result.permission.nextDate ? result.permission.nextDate.toLocaleDateString("es-ES") : "-";
      setMessage(`No puedes ejecutar otro diagnóstico todavía. Próxima fecha: ${next}`);
      return;
    }

    localStorage.setItem(
      "acae_dynamic_context",
      JSON.stringify({
        flow,
        context,
        realtime
      })
    );

    router.push("/results");
  };

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-6">
        <header className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-700">Wizard estratégico ACAE</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{FRAME_TITLES[frame as FrameId]}</h1>
          <p className="mt-2 text-slate-700">
            Experiencia guiada para diagnosticar como estratega real, detectar bloqueos y recomendar ruta de acción.
          </p>
          <p className="mt-2 text-sm text-slate-600">Paso {frame} de 6</p>
        </header>

        {frame === 1 && (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Define tu contexto y flujo prioritario</h2>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Contexto actual</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "idea", label: "Idea" },
                  { value: "operando", label: "Operando" },
                  { value: "creciendo", label: "Creciendo" }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setContext(option.value as BusinessContext)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                      context === option.value
                        ? "border-brand-600 bg-brand-600 text-white"
                        : "border-slate-300 bg-white text-slate-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {FLOW_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFlow(option.value)}
                  className={`rounded-xl border p-4 text-left transition ${
                    flow === option.value ? "border-brand-600 bg-brand-50" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{option.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{option.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {frame === 2 && (
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Preguntas adaptativas del flujo {flow}</h2>
            <p className="text-slate-600">Califica cada afirmación de 1 (muy bajo) a 5 (muy alto).</p>
            <div className="space-y-4">
              {selectedQuestions.map((question) => (
                <article key={question.id} className="rounded-lg border border-slate-200 p-4">
                  <p className="font-medium text-slate-800">{question.text}</p>
                  <div className="mt-3 flex gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleSelect(question.id, value)}
                        className={`h-9 w-9 rounded-full border text-sm font-semibold ${
                          answers[question.id] === value
                            ? "border-brand-600 bg-brand-600 text-white"
                            : "border-slate-300 bg-white text-slate-700"
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {frame === 3 && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Detección en tiempo real</h2>
            <p className="mt-2 text-slate-700">{realtime.feedback}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Problema principal</p>
                <p className="mt-1 text-slate-700">{realtime.mainProblem}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Impacto actual</p>
                <p className="mt-1 text-slate-700">{realtime.impact}</p>
              </div>
            </div>
          </section>
        )}

        {frame === 4 && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Diagnóstico final</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <article className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Problema</h3>
                <p className="mt-2 text-slate-800">{realtime.mainProblem}</p>
              </article>
              <article className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Impacto</h3>
                <p className="mt-2 text-slate-800">{realtime.impact}</p>
              </article>
              <article className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Causa</h3>
                <p className="mt-2 text-slate-800">{realtime.rootCause}</p>
              </article>
              <article className="rounded-lg border border-slate-200 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Consecuencia</h3>
                <p className="mt-2 text-slate-800">{realtime.consequence}</p>
              </article>
            </div>
          </section>
        )}

        {frame === 5 && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Estrategia recomendada</h2>
            <p className="mt-2 text-slate-700">
              {plan === "pro"
                ? "Activa una estrategia de 90 días con foco único por semana, sistema de seguimiento comercial y revisión de métricas críticas."
                : "En plan FREE solo ves diagnóstico. Activa PRO para desbloquear estrategia detallada."}
            </p>
          </section>
        )}

        {frame === 6 && (
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Ejecución guiada</h2>
            <p className="mt-2 text-slate-700">
              {plan === "pro"
                ? "Obtendrás secuencia táctica semanal, responsables, métricas objetivo y alertas de desviación."
                : "La ejecución completa está disponible en PRO. En FREE puedes cerrar tu diagnóstico y revisar el resultado."}
            </p>
          </section>
        )}

        {message ? <p className="text-sm font-medium text-amber-700">{message}</p> : null}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={prevFrame}
            disabled={frame === 1}
            className="rounded-lg border border-slate-300 px-5 py-2 font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          {frame < 6 ? (
            <button
              type="button"
              onClick={nextFrame}
              className="rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Siguiente
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="rounded-lg bg-brand-600 px-5 py-2 font-semibold text-white hover:bg-brand-700"
            >
              Generar diagnóstico final
            </button>
          )}
        </div>
      </Container>
    </main>
  );
}
