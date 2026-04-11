"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RadarChart } from "@/components/RadarChart";
import { ResultSummary } from "@/components/ResultSummary";
import { ACAEScore } from "@/lib/calculateACAE";
import { PlanType, getGrowthState, getLatestDiagnostic, updatePlan } from "@/lib/growthSystem";

type StrategicReport = {
  headline: string;
  diagnosticoPrincipal: string;
  problemaDetectado: string;
  causaRaiz: string;
  estrategiaRecomendada: string;
  planAccion: string[];
  proInsights: string[];
};

function buildStrategicReport(scores: ACAEScore): StrategicReport {
  const dimensions = [
    { key: "Atracción", value: scores.atraccion },
    { key: "Conversión", value: scores.conversion },
    { key: "Autoridad", value: scores.autoridad },
    { key: "Escalabilidad", value: scores.escalabilidad }
  ];

  const weakest = [...dimensions].sort((a, b) => a.value - b.value)[0];
  const total = scores.total;

  if (total <= 20) {
    return {
      headline: "Tu negocio tiene potencial, pero hoy no está capturando demanda de forma predecible.",
      diagnosticoPrincipal: "Operación frágil con baja tracción comercial.",
      problemaDetectado: "No existe un sistema consistente para atraer y convertir oportunidades.",
      causaRaiz: "Falta de enfoque en una oferta clara y un proceso comercial repetible.",
      estrategiaRecomendada: "Priorizar validación rápida de oferta + embudo mínimo de captación y cierre.",
      planAccion: [
        "Definir una propuesta de valor en una frase con resultado medible.",
        "Publicar una oferta principal con llamado a acción único.",
        "Implementar guion de venta breve para detectar objeciones.",
        "Medir semanalmente leads, reuniones y cierres para ajustar foco."
      ],
      proInsights: [
        "Secuencia de 14 días para generar primeras ventas sin depender de improvisación.",
        "Framework de objeciones para elevar cierres en llamadas iniciales.",
        "Plantilla de tablero de KPIs para controlar avance comercial semanal."
      ]
    };
  }

  if (total <= 35) {
    return {
      headline: "Ya generas movimiento, pero el crecimiento todavía no es controlable.",
      diagnosticoPrincipal: "Negocio inconsistente con cuellos de botella en ejecución.",
      problemaDetectado: `La dimensión más débil es ${weakest.key.toLowerCase()}, frenando resultados estables.`,
      causaRaiz: "Decisiones tácticas sin sistema operativo comercial unificado.",
      estrategiaRecomendada: "Estandarizar adquisición y seguimiento para estabilizar ingresos.",
      planAccion: [
        "Elegir 1 canal principal y definir objetivo semanal por etapa del embudo.",
        "Crear rutina de seguimiento a prospectos con tiempos y mensajes definidos.",
        "Optimizar pitch comercial orientado a problema, impacto y siguiente paso.",
        "Bloquear revisión estratégica semanal con métricas de conversión."
      ],
      proInsights: [
        "Mapa de priorización 80/20 para cortar acciones de bajo retorno.",
        "Sistema de scoring de leads para enfocar tiempo en oportunidades de mayor valor.",
        "Plan de ejecución 30-60-90 días para mejorar previsibilidad de ingresos."
      ]
    };
  }

  if (total <= 50) {
    return {
      headline: "Tienes una base sólida; ahora el objetivo es convertir estructura en crecimiento acelerado.",
      diagnosticoPrincipal: "Negocio estructurado con oportunidad clara de expansión.",
      problemaDetectado: "El sistema actual funciona, pero no escala al ritmo del potencial.",
      causaRaiz: "Procesos parcialmente documentados y decisiones aún muy dependientes del fundador.",
      estrategiaRecomendada: "Fortalecer automatización y delegación para liberar capacidad de crecimiento.",
      planAccion: [
        "Documentar los 3 procesos comerciales críticos con responsables y tiempos.",
        "Automatizar seguimiento de leads y reportes semanales de desempeño.",
        "Definir oferta de mayor ticket o mayor recurrencia para elevar margen.",
        "Planificar expansión de canal secundario con meta trimestral concreta."
      ],
      proInsights: [
        "Arquitectura de escalamiento comercial para reducir dependencia operativa.",
        "Modelo de unit economics simplificado para decidir inversión en adquisición.",
        "Playbook de delegación para líderes de venta/operación."
      ]
    };
  }

  return {
    headline: "Estás en posición de escalar con ventaja si proteges foco y disciplina estratégica.",
    diagnosticoPrincipal: "Negocio escalable con fundamentos competitivos.",
    problemaDetectado: "El reto ya no es iniciar: es sostener crecimiento rentable sin perder control.",
    causaRaiz: "Riesgo de dispersión por expansión sin priorización estratégica rigurosa.",
    estrategiaRecomendada: "Consolidar sistema de decisiones y ejecutar expansión por fases.",
    planAccion: [
      "Definir objetivo trimestral único de crecimiento y criterio de prioridad.",
      "Crear tablero ejecutivo con CAC, conversión y margen por canal.",
      "Activar plan de expansión en 2 fases con hitos y supuestos medibles.",
      "Instalar ritual de dirección semanal para decisiones basadas en datos."
    ],
    proInsights: [
      "Blueprint de expansión rentable por canal y segmento.",
      "Matriz de riesgos de escalamiento con gatillos de decisión.",
      "Modelo de gobierno comercial para sostener crecimiento sin caos operativo."
    ]
  };
}

export default function ResultsPage() {
  const [scores, setScores] = useState<ACAEScore | null>(null);
  const [plan, setPlan] = useState<PlanType>("free");
  const [showUpgrade, setShowUpgrade] = useState(false);

  useEffect(() => {
    const state = getGrowthState();
    const latest = getLatestDiagnostic(state);
    setScores(latest?.score ?? null);
    setPlan(state.plan);
  }, []);

  const report = useMemo(() => (scores ? buildStrategicReport(scores) : null), [scores]);
  const isPro = plan === "pro";

  const handleMockUpgrade = () => {
    const next = updatePlan("pro");
    setPlan(next.plan);
    setShowUpgrade(false);
  };

  if (!scores || !report) {
    return (
      <main className="py-14">
        <Container className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-soft">
          <h1 className="text-2xl font-semibold text-slate-900">No hay resultados disponibles</h1>
          <p className="mt-2 text-slate-600">Primero completa el diagnóstico para obtener tu reporte.</p>
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
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Resultado estratégico ACAE</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">{report.headline}</h1>
          <p className="mt-2 text-slate-700">
            {isPro
              ? "Modo PRO activo: estás viendo un diagnóstico accionable de nivel ejecutivo."
              : "Plan básico activo: aquí tienes una visión clara para decidir tu siguiente movimiento."}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <ResultSummary scores={scores} />
          <RadarChart scores={scores} />
        </div>

        <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-soft md:grid-cols-2">
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Diagnóstico principal</h2>
            <p className="mt-2 text-slate-700">{report.diagnosticoPrincipal}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Problema detectado</h2>
            <p className="mt-2 text-slate-700">{report.problemaDetectado}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Causa raíz</h2>
            <p className="mt-2 text-slate-700">{report.causaRaiz}</p>
          </article>
          <article>
            <h2 className="text-lg font-semibold text-slate-900">Estrategia recomendada</h2>
            <p className="mt-2 text-slate-700">{report.estrategiaRecomendada}</p>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-slate-900">Plan de acción en pasos</h2>
          <ol className="mt-4 space-y-3">
            {report.planAccion.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3 text-slate-700">
                <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-brand-200 bg-brand-50/60 p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Mejorar resultado</h2>
              <p className="mt-1 text-slate-700">
                {isPro
                  ? "Tu reporte PRO ya está activo con recomendaciones más profundas para ejecución."
                  : "Desbloquea el plan completo para obtener prioridades avanzadas, profundidad estratégica y ruta de implementación."}
              </p>
            </div>
            {!isPro && (
              <button
                type="button"
                onClick={() => setShowUpgrade((current) => !current)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700"
              >
                Obtener plan completo
              </button>
            )}
          </div>

          {(isPro || showUpgrade) && (
            <div className="mt-5 rounded-xl border border-brand-200 bg-white p-5">
              <h3 className="text-lg font-semibold text-slate-900">Contenido PRO</h3>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
                {report.proInsights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>

              {!isPro && (
                <div className="mt-5 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">Punto de pago (mock)</p>
                  <p className="text-sm text-slate-700">
                    Preparado para Stripe o pasarela local. Este flujo simula la activación del plan PRO dentro del sistema.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleMockUpgrade}
                      className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      Pagar con Stripe (mock)
                    </button>
                    <button
                      type="button"
                      onClick={handleMockUpgrade}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100"
                    >
                      Pago local (mock)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}
