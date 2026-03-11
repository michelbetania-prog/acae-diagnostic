"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

  return (
    <main className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto grid w-full max-w-7xl gap-6 p-4 md:grid-cols-[240px_1fr] md:p-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">ACAE Platform</p>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  item.label === "Dashboard"
                    ? "bg-brand-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <section className="space-y-6">
          <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">Dashboard Principal</h1>
            <p className="mt-2 text-slate-600">Plan actual: {state.plan.toUpperCase()}.</p>
          </header>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Growth Score ACAE</p>
                <p className="text-4xl font-bold text-slate-900">{growthPercent}%</p>
              </div>
              <Link href="/results" className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
                Ver reporte completo
              </Link>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${growthPercent}%` }} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Atracción: {latest?.score.atraccion ?? 0}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Conversión: {latest?.score.conversion ?? 0}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Autoridad: {latest?.score.autoridad ?? 0}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Escalabilidad: {latest?.score.escalabilidad ?? 0}/15</div>
            </div>
          </article>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Progreso de tareas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{taskProgress}%</p>
              <p className="mt-1 text-sm text-slate-600">Tareas completadas sobre total</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Tareas activas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{activeTasks}</p>
              <p className="mt-1 text-sm text-slate-600">Pendientes del plan actual</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Próximo diagnóstico</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {diagnosticPermission.allowed
                  ? "Disponible"
                  : diagnosticPermission.nextDate?.toLocaleDateString("es-ES") ?? "Sin fecha"}
              </p>
              <p className="mt-1 text-sm text-slate-600">Restantes en plan: {diagnosticPermission.remaining}</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Sesiones estratégicas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{sessions}</p>
              <p className="mt-1 text-sm text-slate-600">Disponibles según tu plan</p>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
