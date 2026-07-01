import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { getProductsForBusiness, getPublicBusinesses } from "@/lib/data/queries";

export default async function AdminPage() {
  const businesses = await getPublicBusinesses();
  const productCounts = await Promise.all(businesses.map(async (business) => ({ id: business.id, count: (await getProductsForBusiness(business.id)).length })));
  const totalProducts = productCounts.reduce((sum, item) => sum + item.count, 0);
  const activeBusinesses = businesses.filter((business) => business.is_active).length;

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Admin</p>
            <h1 className="mt-2 text-5xl font-black tracking-tight text-ink">Operación de la plataforma</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Supervisa comercios, productos y señales de crecimiento desde una consola preparada para escalar.</p>
          </div>
          <button className="btn-primary">Exportar reporte</button>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {[
            ["Total comercios", businesses.length, "store"],
            ["Comercios activos", activeBusinesses, "chart"],
            ["Productos", totalProducts, "catalog"],
            ["Pedidos", 128, "bag"]
          ].map(([label, value, icon]) => (
            <article key={label} className="card-premium p-6">
              <Icon name={icon as "store" | "chart" | "catalog" | "bag"} className="h-6 w-6 text-coral" />
              <p className="mt-5 text-sm font-bold text-slate-500">{label}</p>
              <h2 className="mt-2 text-3xl font-black text-ink">{value}</h2>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="card-premium p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-ink">Crecimiento</h2>
              <Badge tone="brand">Próximamente analytics</Badge>
            </div>
            <div className="mt-8 h-72 rounded-3xl bg-[linear-gradient(135deg,#eef7f5,#fff4ef)] p-6">
              <div className="h-full rounded-[1.5rem] border border-white/80 bg-white/50 p-5">
                <div className="skeleton h-4 w-32" />
                <div className="mt-8 grid h-44 grid-cols-5 items-end gap-3">
                  {[40, 65, 52, 80, 92].map((height, index) => <div key={index} className="rounded-t-2xl bg-petrol/80" style={{ height: `${height}%` }} />)}
                </div>
              </div>
            </div>
          </section>

          <section className="card-premium overflow-hidden p-0">
            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-black text-ink">Comercios registrados</h2>
                <p className="text-sm text-slate-500">Filtros por zona, categoría y estado preparados.</p>
              </div>
              <input className="input max-w-xs" placeholder="Buscar comercio" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-400">
                  <tr><th className="px-6 py-4">Comercio</th><th>Zona</th><th>Estado</th><th>Productos</th><th>Acción</th></tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr className="border-t border-slate-100" key={business.id}>
                      <td className="px-6 py-5 font-black text-ink">{business.name}</td>
                      <td className="font-bold text-slate-500">{business.zone}</td>
                      <td><Badge tone={business.is_open ? "success" : "neutral"}>{business.is_open ? "Abierto" : "Cerrado"}</Badge></td>
                      <td className="font-bold text-slate-500">{productCounts.find((item) => item.id === business.id)?.count ?? 0}</td>
                      <td><button className="font-black text-petrol">Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
