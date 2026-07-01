import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { DashboardShell } from "@/components/ui/Shell";
import { Icon } from "@/components/ui/Icon";

const kpis = [
  { label: "Pedidos del día", value: "18", helper: "+24% vs. ayer", icon: "bag" as const },
  { label: "Productos activos", value: "42", helper: "3 destacados", icon: "catalog" as const },
  { label: "Ingresos estimados", value: "RD$12.4k", helper: "Pedidos por WhatsApp", icon: "chart" as const },
  { label: "Estado del negocio", value: "Abierto", helper: "Cierra a las 9:00 PM", icon: "clock" as const }
];

const actions = [
  { label: "Agregar producto", href: "/dashboard/products", icon: "plus" as const },
  { label: "Editar tienda", href: "/dashboard/settings", icon: "settings" as const },
  { label: "Compartir QR", href: "/dashboard", icon: "qr" as const },
  { label: "Ver tienda", href: "/tienda/atelier-criollo", icon: "external" as const }
];

export default function DashboardPage() {
  return (
    <DashboardShell eyebrow="Buenos días" title="Tu negocio, en control.">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="card-premium p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mist text-petrol"><Icon name={kpi.icon} className="h-5 w-5" /></div>
              <Badge tone={kpi.value === "Abierto" ? "success" : "neutral"}>{kpi.helper}</Badge>
            </div>
            <p className="mt-6 text-sm font-bold text-slate-500">{kpi.label}</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-ink">{kpi.value}</h2>
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[1fr_360px]">
        <section className="card-premium p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Rendimiento</p>
              <h2 className="mt-2 text-2xl font-black text-ink">Pedidos de la semana</h2>
            </div>
            <Badge tone="brand">Gráfico preparado</Badge>
          </div>
          <div className="mt-8 flex h-72 items-end gap-3 rounded-3xl bg-[#f8faf9] p-6">
            {[42, 58, 36, 72, 64, 88, 76].map((height, index) => (
              <div key={index} className="flex flex-1 flex-col items-center gap-3">
                <div className="w-full rounded-t-2xl bg-gradient-to-t from-petrol to-coral transition hover:opacity-80" style={{ height: `${height}%` }} />
                <span className="text-xs font-bold text-slate-400">{["L", "M", "M", "J", "V", "S", "D"][index]}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-5">
          <div className="card-premium p-6">
            <h2 className="text-2xl font-black text-ink">Acciones rápidas</h2>
            <div className="mt-5 grid gap-3">
              {actions.map((action) => (
                <Link key={action.label} href={action.href} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white px-4 py-3 font-bold text-slate-700 transition hover:-translate-y-0.5 hover:border-petrol/20 hover:shadow-soft">
                  <span className="flex items-center gap-3"><Icon name={action.icon} className="h-4 w-4 text-coral" /> {action.label}</span>
                  <Icon name="external" className="h-4 w-4 text-slate-300" />
                </Link>
              ))}
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-ink p-6 text-white shadow-premium">
            <Icon name="qr" className="h-8 w-8 text-coral" />
            <h3 className="mt-4 text-xl font-black">Convierte tu mostrador en un canal digital.</h3>
            <p className="mt-3 text-sm leading-7 text-white/65">Imprime tu QR y dirige clientes al menú actualizado de tu comercio.</p>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
