import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const items = [
  { href: "/dashboard", label: "Resumen", icon: "chart" as const },
  { href: "/dashboard/products", label: "Productos", icon: "catalog" as const },
  { href: "/dashboard/settings", label: "Tienda", icon: "store" as const },
  { href: "/", label: "Marketplace", icon: "external" as const }
];

export function DashboardShell({ children, title, eyebrow }: { children: React.ReactNode; title: string; eyebrow: string }) {
  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="card-premium h-fit p-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-ink px-4 py-5 text-white">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">Panel</p>
            <h2 className="mt-2 text-xl font-black">Control comercial</h2>
          </div>
          <nav className="mt-4 space-y-1">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-white hover:text-ink hover:shadow-sm">
                <Icon name={item.icon} className="h-4 w-4 text-slate-400 transition group-hover:text-coral" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">{eyebrow}</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-ink md:text-5xl">{title}</h1>
          <div className="mt-8">{children}</div>
        </section>
      </div>
    </main>
  );
}
