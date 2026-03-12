"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { PriorityTasksCard } from "@/components/PriorityTasksCard";
import { RadarChart } from "@/components/RadarChart";
import { ScoreCard } from "@/components/ScoreCard";
import { StrategicFocusCard } from "@/components/StrategicFocusCard";
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
  nightIndigo: "#1B003F",
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

  const topPriorityTasks = useMemo(
    () => tasks.filter((task) => task.status === "pending").slice(0, 3),
    [tasks]
  );

  const nextDiagnosticValue = diagnosticPermission.allowed
    ? "Disponible"
    : diagnosticPermission.nextDate?.toLocaleDateString("es-ES") ?? "Sin fecha";

  return (
    <main className="min-h-[calc(100vh-64px)] bg-white">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 md:grid-cols-[260px_1fr] md:p-6">
        <aside className="rounded-2xl p-4 shadow-soft" style={{ backgroundColor: COLOR.nightIndigo }}>
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
          <header className="rounded-2xl p-6 shadow-soft" style={{ backgroundColor: COLOR.nightIndigo }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-white md:text-3xl">ACAE Growth System</h1>
              <Link
                href="/results"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition"
                style={{ backgroundColor: COLOR.burntOrange }}
              >
                Ver reporte completo
              </Link>
            </div>
          </header>

          <section className="grid gap-6 md:grid-cols-2">
            <ScoreCard percentage={growthPercent} scores={radarScores} />
            <RadarChart scores={radarScores} />
          </section>

          <StrategicFocusCard
            dimension={latest?.weakestDimension ?? "Pendiente de diagnóstico"}
            insight={latest?.strategicFocus ?? "Completa tu diagnóstico para recibir una recomendación estratégica."}
          />

          <PriorityTasksCard items={topPriorityTasks} />

          <section>
            <h2 className="mb-3 text-lg font-semibold text-[#1B003F]">PROGRESO</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Progreso de tareas"
                value={`${taskProgress}%`}
                subtitle="Tareas completadas sobre total"
              />
              <MetricCard
                title="Tareas activas"
                value={activeTasks}
                subtitle="Pendientes del plan actual"
              />
              <MetricCard
                title="Próximo diagnóstico"
                value={nextDiagnosticValue}
                subtitle={`Restantes en plan: ${diagnosticPermission.remaining}`}
              />
              <MetricCard
                title="Sesiones estratégicas"
                value={sessions}
                subtitle="Disponibles según tu plan"
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
