"use client";

import Link from "next/link";

export default function DashboardTasksPage() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Tareas clásicas desactivadas</h1>
      <p className="mt-2 text-slate-600">
        El plan ACAE ahora funciona como un journey progresivo por sesiones (no checklist simple).
      </p>

      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-900">Nuevo formato recomendado</h2>
        <p className="mt-2 text-slate-700">
          Ve a <strong>Plan de Acción</strong> para ejecutar etapas activas, desbloquear siguientes sesiones y recibir feedback por paso.
        </p>
        <Link href="/dashboard/action-plan" className="mt-4 inline-flex rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white">
          Ir al recorrido de sesiones
        </Link>
      </article>
    </main>
  );
}
