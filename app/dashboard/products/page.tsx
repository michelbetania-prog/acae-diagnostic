import { Badge } from "@/components/ui/Badge";
import { DashboardShell } from "@/components/ui/Shell";
import { Icon } from "@/components/ui/Icon";

export default function ProductsPage() {
  return (
    <DashboardShell eyebrow="Catálogo" title="Productos diseñados para vender.">
      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        <form className="card-premium h-fit p-6">
          <h2 className="text-2xl font-black text-ink">Nuevo producto</h2>
          <div className="mt-6 space-y-4">
            <input className="input" placeholder="Nombre" />
            <textarea className="input min-h-28" placeholder="Descripción" />
            <input className="input" type="number" placeholder="Precio RD$" />
            <input className="input" placeholder="Categoría" />
            <input className="input" type="file" />
            <label className="flex items-center gap-3 font-bold text-slate-700"><input type="checkbox" defaultChecked className="h-5 w-5" /> Activo</label>
          </div>
          <button type="button" className="btn-coral mt-6 w-full"><Icon name="plus" className="h-4 w-4" />Guardar producto</button>
        </form>
        <section className="card-premium p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-ink">Listado</h2>
            <Badge tone="brand">Estado vacío</Badge>
          </div>
          <div className="mt-8 rounded-[2rem] border border-dashed border-slate-200 p-10 text-center">
            <Icon name="catalog" className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-4 text-xl font-black text-ink">Conecta Supabase para listar productos reales.</h3>
            <p className="mt-2 text-slate-500">El diseño ya contempla carga, estado vacío, activación y edición.</p>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
