"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RadarChart } from "@/components/RadarChart";
import {
  GrowthState,
  canRunDiagnostic,
  getAllTasks,
  getDefaultGrowthState,
  getGrowthState,
  getLatestDiagnostic,
  getSessionsAvailable,
  getTaskProgress
} from "@/lib/growthSystem";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Diagnóstico", href: "/diagnostic" },
  { label: "Plan de Acción", href: "/dashboard/action-plan" },
  { label: "Tareas", href: "/dashboard/tasks" },
  { label: "Progreso", href: "/dashboard/progress" },
  { label: "Sesiones", href: "/dashboard/sessions" },
  { label: "Cuenta", href: "/account" }
];

const COLOR = {
  white: "#FFFFFF",
  nightIndigo: "#1B003F",
  twilightPurple: "#4B0082",
  midnightBlue: "#191970",
  burntOrange: "#C46A2D"
};

export default function DashboardPage() {
  const [state, setState] = useState<GrowthState>(getDefaultGrowthState());

  useEffect(() => {
    setState(getGrowthState());
  }, []);

  const latest = getLatestDiagnostic(state);
  const growthPercent = latest ? Math.round((latest.score.total / 60) * 100) : 0;
  const tasks = getAllTasks(state);
  const taskProgress = getTaskProgress(state);
  const activeTasks = tasks.filter((task) => task.status === "pending").length;
  const diagnosticPermission = canRunDiagnostic(state);
  const sessions = getSessionsAvailable(state.plan);

  const radarScores = latest?.score ?? {
    atraccion: 0,
    conversion: 0,
    autoridad: 0,
    escalabilidad: 0,
    total: 0
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
        <aside
          className="rounded-2xl p-4 shadow-soft"
          style={{ backgroundColor: COLOR.nightIndigo }}
        >
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-white/70">BIEM DIGITAL</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  item.label === "Dashboard"
                    ? "bg-white text-[#1B003F]"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <header
            className="rounded-2xl p-6 shadow-soft"
            style={{ backgroundColor: COLOR.nightIndigo }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">ACAE Growth System</h1>
                <p className="mt-2 text-white/80">Panel estratégico BIEM DIGITAL · Plan actual: {state.plan.toUpperCase()}</p>
              </div>
              <Link
                href="/results"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                style={{ backgroundColor: COLOR.burntOrange }}
              >
                Ver reporte completo
              </Link>
            </div>
          </header>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <p className="text-sm font-medium" style={{ color: COLOR.midnightBlue }}>ACAE SCORE</p>
              <p className="mt-2 text-5xl font-bold" style={{ color: COLOR.nightIndigo }}>{growthPercent}%</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${growthPercent}%`, backgroundColor: COLOR.twilightPurple }}
                />
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
                  Atracción: {radarScores.atraccion}/15
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
                  Conversión: {radarScores.conversion}/15
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
                  Automatización: {radarScores.autoridad}/15
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm" style={{ color: COLOR.midnightBlue }}>
                  Escala: {radarScores.escalabilidad}/15
                </div>
              </div>
            </article>

            <RadarChart scores={radarScores} />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold" style={{ color: COLOR.nightIndigo }}>FOCO ESTRATÉGICO</h2>
            <p className="mt-2 text-sm" style={{ color: COLOR.midnightBlue }}>
              Dimensión prioritaria: <strong>{latest?.weakestDimension ?? "Pendiente de diagnóstico"}</strong>
            </p>
            <p className="mt-1 text-sm" style={{ color: COLOR.midnightBlue }}>
              Insight principal: {latest?.strategicFocus ?? "Completa tu diagnóstico para recibir una recomendación estratégica."}
            </p>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm" style={{ color: COLOR.midnightBlue }}>Progreso de tareas</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: COLOR.nightIndigo }}>{taskProgress}%</p>
              <p className="mt-1 text-sm text-slate-500">Tareas completadas sobre total</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm" style={{ color: COLOR.midnightBlue }}>Tareas activas</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: COLOR.nightIndigo }}>{activeTasks}</p>
              <p className="mt-1 text-sm text-slate-500">Pendientes del plan actual</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm" style={{ color: COLOR.midnightBlue }}>Próximo diagnóstico</p>
              <p className="mt-2 text-xl font-bold" style={{ color: COLOR.nightIndigo }}>
                {diagnosticPermission.allowed
                  ? "Disponible"
                  : diagnosticPermission.nextDate?.toLocaleDateString("es-ES") ?? "Sin fecha"}
              </p>
              <p className="mt-1 text-sm text-slate-500">Restantes en plan: {diagnosticPermission.remaining}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm" style={{ color: COLOR.midnightBlue }}>Sesiones estratégicas</p>
              <p className="mt-2 text-2xl font-bold" style={{ color: COLOR.nightIndigo }}>{sessions}</p>
              <p className="mt-1 text-sm text-slate-500">Disponibles según tu plan</p>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
