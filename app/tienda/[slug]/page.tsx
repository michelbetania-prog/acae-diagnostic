import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { WhatsAppCart } from "@/components/store/WhatsAppCart";
import { getBusinessBySlug, getProductsForBusiness } from "@/lib/data/queries";

export default async function StorePage({ params }: { params: { slug: string } }) {
  const business = await getBusinessBySlug(params.slug);
  if (!business) notFound();

  const products = await getProductsForBusiness(business.id);
  const featured = products.filter((product) => product.is_featured).slice(0, 3);

  return (
    <main className="bg-[#fbfaf7]">
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 soft-grid opacity-20" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-coral/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
            <div>
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white text-ink shadow-xl shadow-slate-950/20">
                <Icon name="store" className="h-11 w-11" />
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Badge tone={business.is_open ? "success" : "neutral"}>{business.is_open ? "Abierto ahora" : "Cerrado"}</Badge>
                <span className="flex items-center gap-1 text-sm font-bold text-white/75"><Icon name="star" className="h-4 w-4 text-coral" /> {business.rating?.toFixed(1)} · {business.review_count} opiniones</span>
              </div>
              <h1 className="mt-5 max-w-4xl text-5xl font-black tracking-[-0.05em] md:text-7xl">{business.name}</h1>
              <p className="mt-6 max-w-2xl text-xl leading-9 text-white/72">{business.description}</p>
              <div className="mt-8 grid gap-4 text-sm font-bold text-white/75 sm:grid-cols-3">
                <span className="flex items-center gap-2"><Icon name="clock" className="h-5 w-5 text-coral" /> {business.hours}</span>
                <span className="flex items-center gap-2"><Icon name="location" className="h-5 w-5 text-coral" /> {business.address ?? business.zone}</span>
                <span className="flex items-center gap-2"><Icon name="truck" className="h-5 w-5 text-coral" /> {business.estimated_time}</span>
              </div>
            </div>
            <div className="card-premium bg-white/95 p-6 text-ink">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Contacto directo</p>
              <h2 className="mt-3 text-2xl font-black">Ordena con el comercio</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">No somos delivery. Este negocio coordina contigo su entrega propia o retiro.</p>
              <a className="btn-primary mt-5 w-full" href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noreferrer">
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-10 grid gap-5 md:grid-cols-3">
          {featured.map((product) => (
            <article key={product.id} className="card-premium p-5">
              <Badge tone="warning">Destacado</Badge>
              <h3 className="mt-4 text-xl font-black text-ink">{product.name}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
              <p className="mt-4 text-lg font-black text-petrol">RD${product.price.toFixed(2)}</p>
            </article>
          ))}
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge tone="brand">Menú digital</Badge>
            <h2 className="mt-4 text-4xl font-black tracking-tight text-ink">Productos y promociones</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral">Promociones</Badge>
            <Badge tone="neutral">Favoritos</Badge>
            <Badge tone="neutral">Opiniones próximamente</Badge>
          </div>
        </div>

        <WhatsAppCart business={business} products={products} />
      </section>
    </main>
  );
}
