"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RadarChart } from "@/components/RadarChart";
import { ResultSummary } from "@/components/ResultSummary";
import { ACAEScore } from "@/lib/calculateACAE";
import { DiagnosticResult, PlanType, getGrowthState, getLatestDiagnostic, updatePlan } from "@/lib/growthSystem";

type DynamicContext = {
  flow: "VALIDACION" | "CONVERSION" | "ESCALA" | "CAOS" | "flujoOferta" | "flujoSeguimiento" | "flujoConversion" | "flujoEscala";
  context: "idea" | "operando" | "creciendo" | "EXPLORACION" | "RIESGO_OFERTA" | "RIESGO_SEGUIMIENTO" | "RIESGO_CONVERSION" | "RIESGO_ESCALA";
  realtime: {
    mainProblem: string;
    impact: string;
    rootCause: string;
    consequence: string;
  };
};

type StrategicReport = {
  headline: string;
  problema: string;
  impacto: string;
  causa: string;
  consecuencia: string;
  estrategia: string[];
  ejecucion: string[];
};

type AiAction = {
  accion: string;
  por_que: string;
  como_hacerlo: string[];
  resultado_esperado: string;
};

type AiDiagnostic = {
  diagnostico: string;
  problemas_criticos: string[];
  oportunidades: string[];
  acciones: AiAction[];
  estructuras_internas?: Array<{
    recomendacion: string;
    cuando_aplicar: string;
    version_simple: string;
  }>;
};

function buildStrategicReport(scores: ACAEScore, dynamic: DynamicContext | null): StrategicReport {
  const total = scores.total;

  if (dynamic) {
    return {
      headline: `Flujo ${dynamic.flow}: diagnóstico estratégico completado para contexto ${dynamic.context}.`,
      problema: dynamic.realtime.mainProblem,
      impacto: dynamic.realtime.impact,
      causa: dynamic.realtime.rootCause,
      consecuencia: dynamic.realtime.consequence,
      estrategia: [
        "Definir foco estratégico único por 30 días y criterio de éxito semanal.",
        "Priorizar una palanca crítica del flujo seleccionado para eliminar fricción principal.",
        "Diseñar tablero de control con 3 métricas de decisión para sostener ritmo."
      ],
      ejecucion: [
        "Semana 1: implementar cambios de alto impacto y baja complejidad.",
        "Semana 2: validar mejoras con revisión comercial y ajuste de hipótesis.",
        "Semana 3-4: escalar solo lo que demuestra tracción y rentabilidad."
      ]
    };
  }

  if (total <= 30) {
    return {
      headline: "Tu negocio necesita ordenar su sistema comercial antes de escalar.",
      problema: "Baja previsibilidad de resultados.",
      impacto: "Ingresos variables y decisiones reactivas.",
      causa: "No existe un proceso unificado de adquisición y conversión.",
      consecuencia: "Crecimiento intermitente y desgaste operativo.",
      estrategia: [
        "Construir una propuesta de valor concreta por segmento.",
        "Estandarizar secuencia de seguimiento comercial.",
        "Instalar revisión semanal de métricas base."
      ],
      ejecucion: [
        "Diseñar guion de ventas y objeciones clave.",
        "Implementar CRM mínimo para trazabilidad.",
        "Definir KPI por etapa del embudo."
      ]
    };
  }

  return {
    headline: "Tienes base para crecer: el siguiente reto es escalar sin perder control.",
    problema: "Cuello de botella en escalabilidad operativa.",
    impacto: "Mayor volumen sin sistema puede reducir margen y calidad.",
    causa: "Procesos críticos no completamente automatizados ni delegables.",
    consecuencia: "Límite de crecimiento por dependencia del equipo fundador.",
    estrategia: [
      "Priorizar automatización de procesos comerciales repetitivos.",
      "Diversificar canales con criterios claros de rentabilidad.",
      "Fortalecer gobierno de decisiones con indicadores semanales."
    ],
    ejecucion: [
      "Establecer roadmap 30-60-90 de escalamiento.",
      "Asignar responsables por KPI de canal.",
      "Activar ritual ejecutivo semanal para decisiones rápidas."
    ]
  };
}

export default function ResultsPage() {
  const [scores, setScores] = useState<ACAEScore | null>(null);
  const [latestDiagnostic, setLatestDiagnostic] = useState<DiagnosticResult | null>(null);
  const [plan, setPlan] = useState<PlanType>("free");
  const [dynamicContext, setDynamicContext] = useState<DynamicContext | null>(null);
  const [aiDiagnostic, setAiDiagnostic] = useState<AiDiagnostic | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    const state = getGrowthState();
    const latest = getLatestDiagnostic(state);
    setScores(latest?.score ?? null);
    setLatestDiagnostic(latest);
    setPlan(state.plan);

    const raw = localStorage.getItem("acae_dynamic_context");
    if (raw) {
      try {
        setDynamicContext(JSON.parse(raw) as DynamicContext);
      } catch {
        setDynamicContext(null);
      }
    }
  }, []);

  useEffect(() => {
    const fetchAiDiagnostic = async () => {
      if (!latestDiagnostic || !scores) return;
      setAiLoading(true);
      setAiError(null);

      const response = await fetch("/api/openai/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: latestDiagnostic.answers,
          score: latestDiagnostic.score,
          context: dynamicContext ?? {}
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string; detail?: string };
        setAiError(payload.error ?? "No se pudo generar diagnóstico IA.");
        setAiLoading(false);
        return;
      }

      const payload = (await response.json()) as AiDiagnostic;
      setAiDiagnostic(payload);
      setAiLoading(false);
    };

    fetchAiDiagnostic();
  }, [latestDiagnostic, scores, dynamicContext]);

  const report = useMemo(() => (scores ? buildStrategicReport(scores, dynamicContext) : null), [scores, dynamicContext]);
  const isPro = plan === "pro";

  if (!scores || !report) {
    return (
      <main className="py-14">
        <Container className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-semibold text-slate-900">No hay resultados disponibles</h1>
          <p className="mt-2 text-slate-600">Completa el wizard para obtener tu diagnóstico.</p>
          <Link href="/diagnostic" className="mt-5 inline-flex rounded-lg bg-brand-600 px-5 py-3 text-white">
            Ir al diagnóstico
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="py-10 md:py-14">
      <Container className="space-y-8">
        <header className="rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Diagnóstico final ACAE</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{report.headline}</h1>
          <p className="mt-2 text-slate-700">
            {isPro
              ? "Modo PRO: estrategia y ejecución desbloqueadas."
              : "Modo FREE: ves diagnóstico principal. Desbloquea PRO para plan completo."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ResultSummary scores={scores} />
          <RadarChart scores={scores} />
        </div>

        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2">
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Problema</h2>
            <p className="mt-2 text-slate-700">{report.problema}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Impacto</h2>
            <p className="mt-2 text-slate-700">{report.impacto}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Causa</h2>
            <p className="mt-2 text-slate-700">{report.causa}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Consecuencia</h2>
            <p className="mt-2 text-slate-700">{report.consecuencia}</p>
          </article>
        </section>

        {!isPro ? (
          <section className="rounded-xl border border-brand-200 bg-brand-50 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-slate-900">Desbloquea estrategia + ejecución</h2>
            <p className="mt-2 text-slate-700">
              Con PRO accedes a plan estratégico de implementación, prioridades por fase y guía de ejecución semanal.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  const next = updatePlan("pro");
                  setPlan(next.plan);
                }}
                className="rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
              >
                Obtener plan completo
              </button>
              <button
                type="button"
                onClick={() => {
                  const next = updatePlan("pro");
                  setPlan(next.plan);
                }}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 hover:bg-slate-100"
              >
                Pagar con Stripe o pago local (mock)
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Estrategia</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                {report.estrategia.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-slate-900">Ejecución</h2>
              <ol className="mt-3 space-y-2 text-slate-700">
                {report.ejecucion.map((step, idx) => (
                  <li key={step} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Diagnóstico estratégico con IA</h2>
          {aiLoading && <p className="mt-2 text-slate-600">Generando análisis profundo...</p>}
          {aiError && <p className="mt-2 text-amber-700">{aiError}</p>}

          {aiDiagnostic && (
            <div className="mt-4 space-y-5">
              <article>
                <h3 className="font-semibold text-slate-900">Diagnóstico</h3>
                <p className="mt-1 text-slate-700">{aiDiagnostic.diagnostico}</p>
              </article>

              <article>
                <h3 className="font-semibold text-slate-900">Problemas críticos</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  {aiDiagnostic.problemas_criticos.map((problem) => (
                    <li key={problem}>{problem}</li>
                  ))}
                </ul>
              </article>

              <article>
                <h3 className="font-semibold text-slate-900">Oportunidades</h3>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  {aiDiagnostic.oportunidades.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>

              <article>
                <h3 className="font-semibold text-slate-900">Acciones paso a paso</h3>
                <div className="mt-2 space-y-3">
                  {aiDiagnostic.acciones.map((action) => (
                    <div key={action.accion} className="rounded-lg border border-brand-100 bg-brand-50 p-4">
                      <p className="font-semibold text-slate-900">Acción: {action.accion}</p>
                      <p className="mt-1 text-sm text-slate-700"><span className="font-semibold">Por qué:</span> {action.por_que}</p>
                      <p className="mt-2 text-sm font-semibold text-slate-800">Cómo hacerlo:</p>
                      <ol className="mt-1 list-decimal space-y-1 pl-5 text-sm text-slate-700">
                        {action.como_hacerlo.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      <p className="mt-2 text-sm text-slate-700"><span className="font-semibold">Resultado esperado:</span> {action.resultado_esperado}</p>
                    </div>
                  ))}
                </div>
              </article>

              {aiDiagnostic.estructuras_internas && aiDiagnostic.estructuras_internas.length > 0 && (
                <article>
                  <h3 className="font-semibold text-slate-900">Recomendaciones de estructura interna</h3>
                  <div className="mt-2 space-y-2">
                    {aiDiagnostic.estructuras_internas.map((item) => (
                      <div key={item.recomendacion} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                        <p className="font-semibold text-slate-900">{item.recomendacion}</p>
                        <p className="text-slate-700"><span className="font-semibold">Cuándo aplicarlo:</span> {item.cuando_aplicar}</p>
                        <p className="text-slate-700"><span className="font-semibold">Versión simple:</span> {item.version_simple}</p>
                      </div>
                    ))}
                  </div>
                </article>
              )}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
