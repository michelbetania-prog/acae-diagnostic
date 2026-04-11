"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RadarChart } from "@/components/RadarChart";
import { ResultSummary } from "@/components/ResultSummary";
import { ACAEScore } from "@/lib/calculateACAE";
import { PlanType, getGrowthState, getLatestDiagnostic, updatePlan } from "@/lib/growthSystem";

type DynamicContext = {
  flow: "VALIDACION" | "CONVERSION" | "ESCALA" | "CAOS";
  context: "idea" | "operando" | "creciendo";
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
  const [plan, setPlan] = useState<PlanType>("free");
  const [dynamicContext, setDynamicContext] = useState<DynamicContext | null>(null);

  useEffect(() => {
    const state = getGrowthState();
    const latest = getLatestDiagnostic(state);
    setScores(latest?.score ?? null);
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
      </Container>
    </main>
  );
}
