import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { getCategories, getPublicBusinesses } from "@/lib/data/queries";

const benefits = [
  { title: "Tu tienda online", text: "Una presencia digital propia para vender sin depender de una app de delivery.", icon: "store" as const },
  { title: "Pedidos por WhatsApp", text: "Tus clientes compran y tú cierras la venta en el canal que ya usas.", icon: "message" as const },
  { title: "Sin comisiones abusivas", text: "Más margen para el comercio y una relación directa con cada cliente.", icon: "chart" as const },
  { title: "Catálogo digital", text: "Productos, categorías, precios, fotos y disponibilidad siempre actualizados.", icon: "catalog" as const },
  { title: "Control de horarios", text: "Abre, cierra y comunica tiempos reales sin fricción operativa.", icon: "clock" as const },
  { title: "QR para compartir", text: "Convierte mesas, empaques e historias de Instagram en puntos de venta.", icon: "qr" as const }
];

const palettes = [
  "Azul petróleo · Coral · Blanco",
  "Oliva elegante · Crema · Gris oscuro",
  "Azul profundo · Naranja cálido · Blanco"
];

export default async function Marketplace({ searchParams }: { searchParams: { zone?: string; category?: string; open?: string } }) {
  const [businesses, categories] = await Promise.all([getPublicBusinesses(searchParams), getCategories()]);
  const zones = Array.from(new Set(businesses.map((business) => business.zone)));

  return (
    <main className="overflow-hidden">
      <section className="relative bg-[#fbfaf7]">
        <div className="absolute inset-x-0 top-0 h-[680px] bg-[radial-gradient(circle_at_top_left,rgba(255,107,74,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(15,76,92,0.16),transparent_34%)]" />
        <div className="section-shell relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Badge tone="brand">Commerce OS para negocios gastronómicos</Badge>
            <h1 className="mt-8 max-w-4xl text-5xl font-black tracking-[-0.06em] text-ink md:text-7xl">
              Tus clientes. Tus pedidos. Tus ganancias.
            </h1>
            <p className="mt-7 max-w-2xl text-xl leading-9 text-slate-600">
              Una plataforma para que restaurantes y emprendedores reciban pedidos directamente, controlen su catálogo y crezcan sin depender de plataformas con altas comisiones.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/register" className="btn-primary">Comenzar gratis</Link>
              <Link href="#comercios" className="btn-secondary">Ver comercios</Link>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-sm">
              <div><strong className="block text-2xl text-ink">0%</strong><span className="text-slate-500">comisión por pedido</span></div>
              <div><strong className="block text-2xl text-ink">24/7</strong><span className="text-slate-500">catálogo activo</span></div>
              <div><strong className="block text-2xl text-ink">QR</strong><span className="text-slate-500">listo para vender</span></div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-32 w-32 rounded-full bg-coral/20 blur-3xl" />
            <div className="card-premium relative p-4 shadow-premium">
              <div className="rounded-[1.4rem] bg-ink p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">Dashboard</p>
                    <h3 className="mt-2 text-2xl font-black">Atelier Criollo</h3>
                  </div>
                  <Badge tone="success">Abierto</Badge>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {["Pedidos", "Ingresos", "Productos"].map((item, index) => (
                    <div key={item} className="rounded-2xl bg-white/10 p-4">
                      <p className="text-xs text-white/55">{item}</p>
                      <p className="mt-2 text-xl font-black">{[18, "RD$ 12.4k", 42][index]}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-100 p-5">
                  <Icon name="catalog" className="h-6 w-6 text-coral" />
                  <h4 className="mt-4 font-black text-ink">Catálogo inteligente</h4>
                  <div className="mt-4 space-y-2">
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-2/3" />
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-100 p-5">
                  <Icon name="message" className="h-6 w-6 text-petrol" />
                  <h4 className="mt-4 font-black text-ink">Pedidos directos</h4>
                  <div className="mt-4 rounded-2xl bg-mist p-3 text-sm font-bold text-petrol">Nuevo pedido listo para confirmar</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="beneficios" className="section-shell">
        <div className="max-w-2xl">
          <Badge tone="neutral">Diseñado para vender más</Badge>
          <h2 className="mt-5 text-4xl font-black tracking-tight text-ink md:text-5xl">Todo lo que un comercio pequeño necesita para operar como una marca digital.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <article key={benefit.title} className="card-premium group p-6 transition duration-300 hover:-translate-y-1 hover:shadow-premium">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mist text-petrol transition group-hover:bg-ink group-hover:text-white">
                <Icon name={benefit.icon} className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-black text-ink">{benefit.title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{benefit.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-ink py-16 text-white md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-coral">Identidad visual</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Premium, local y preparado para escalar.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {palettes.map((palette) => (
              <div key={palette} className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm font-bold text-white/80">{palette}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="comercios" className="section-shell">
        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <Badge tone="brand">Marketplace</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-ink md:text-5xl">Comercios con operación propia.</h2>
            <p className="mt-4 max-w-2xl text-lg text-slate-600">Explora negocios locales que controlan su menú, horarios, entrega y relación con el cliente.</p>
          </div>
          <form className="grid gap-3 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-sm sm:grid-cols-4">
            <select name="zone" className="input" defaultValue={searchParams.zone ?? ""}>
              <option value="">Todas las zonas</option>
              {zones.map((zone) => <option key={zone}>{zone}</option>)}
            </select>
            <select name="category" className="input" defaultValue={searchParams.category ?? ""}>
              <option value="">Categoría</option>
              {categories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
            <select name="open" className="input" defaultValue={searchParams.open ?? ""}>
              <option value="">Estado</option>
              <option value="true">Abiertos</option>
            </select>
            <button className="btn-primary">Filtrar</button>
          </form>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {businesses.map((business) => (
            <article key={business.id} className="card-premium group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-premium">
              <div className="h-36 bg-[linear-gradient(135deg,#e8f5f2,#fff2ed)] p-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-ink shadow-lg shadow-slate-900/10">
                  <Icon name="store" className="h-9 w-9" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge tone={business.is_open ? "success" : "neutral"}>{business.is_open ? "Abierto" : "Cerrado"}</Badge>
                  <span className="flex items-center gap-1 text-sm font-bold text-slate-500"><Icon name="star" className="h-4 w-4 text-coral" /> {business.rating?.toFixed(1)} ({business.review_count})</span>
                </div>
                <h3 className="mt-4 text-2xl font-black text-ink">{business.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-14 text-sm leading-7 text-slate-600">{business.description}</p>
                <div className="mt-5 grid gap-3 text-sm font-bold text-slate-600">
                  <span className="flex items-center gap-2"><Icon name="catalog" className="h-4 w-4 text-petrol" /> {business.category}</span>
                  <span className="flex items-center gap-2"><Icon name="location" className="h-4 w-4 text-petrol" /> {business.zone}</span>
                  <span className="flex items-center gap-2"><Icon name="clock" className="h-4 w-4 text-petrol" /> {business.estimated_time}</span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {business.delivery_available && <Badge tone="neutral">Entrega propia</Badge>}
                  {business.pickup_available && <Badge tone="neutral">Retiro disponible</Badge>}
                </div>
                <Link href={`/tienda/${business.slug}`} className="btn-secondary mt-6 w-full group-hover:border-ink">Ver menú</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
