import Link from "next/link";
import { calculateACAE } from "@/lib/calculateACAE";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Diagnóstico", href: "/diagnostic" },
  { label: "Plan de Acción", href: "#" },
  { label: "Tareas", href: "#" },
  { label: "Progreso", href: "#" },
  { label: "Sesiones", href: "#" },
  { label: "Cuenta", href: "#" }
];

const sampleAnswers: Record<number, number> = {
  1: 4,
  2: 3,
  3: 4,
  4: 3,
  5: 4,
  6: 3,
  7: 4,
  8: 4,
  9: 3,
  10: 3,
  11: 2,
  12: 3
};

export default function HomePage() {
  const score = calculateACAE(sampleAnswers);
  const growthPercent = Math.round((score.total / 60) * 100);

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
            <p className="mt-2 text-slate-600">Resumen ejecutivo de tu desempeño estratégico con el método ACAE.</p>
          </header>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-slate-500">Growth Score ACAE</p>
                <p className="text-4xl font-bold text-slate-900">{growthPercent}%</p>
              </div>
              <Link
                href="/results"
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Ver reporte completo
              </Link>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-brand-600" style={{ width: `${growthPercent}%` }} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Atracción: {score.atraccion}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Conversión: {score.conversion}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Autoridad: {score.autoridad}/15</div>
              <div className="rounded-lg bg-slate-100 p-3 text-sm text-slate-700">Escalabilidad: {score.escalabilidad}/15</div>
            </div>
          </article>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Progreso de tareas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">72%</p>
              <p className="mt-1 text-sm text-slate-600">9 de 12 tareas completadas</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Tareas activas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">3</p>
              <p className="mt-1 text-sm text-slate-600">2 de prioridad alta</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Próximo diagnóstico</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">5 días</p>
              <p className="mt-1 text-sm text-slate-600">Disponible el lunes</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <p className="text-sm text-slate-500">Sesiones estratégicas</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">2</p>
              <p className="mt-1 text-sm text-slate-600">Disponibles este mes</p>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
