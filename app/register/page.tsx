import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";

const benefits = ["Tu tienda online", "Catálogo digital", "Pedidos por WhatsApp", "Sin contratos", "Control de horarios"];

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div>
          <Badge tone="brand">Comienza gratis</Badge>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-ink">Crea una tienda que venda por ti.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">En minutos tendrás una presencia digital para compartir tu menú, recibir pedidos directos y mantener el control de tu operación.</p>
          <div className="mt-8 rounded-[2rem] bg-ink p-7 text-white">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Lo que obtienes</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3 font-bold text-white/85"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-coral text-xs text-white">✓</span>{benefit}</div>
              ))}
            </div>
          </div>
        </div>
        <form className="card-premium p-6 md:p-8">
          <h2 className="text-3xl font-black text-ink">Registra tu comercio</h2>
          <div className="mt-6 space-y-4">
            <input className="input" placeholder="Nombre del comercio" />
            <input className="input" type="email" placeholder="Correo" />
            <input className="input" type="password" placeholder="Contraseña" />
            <input className="input" placeholder="WhatsApp" />
            <input className="input" placeholder="Zona" />
          </div>
          <button className="btn-coral mt-6 w-full" type="button"><Icon name="spark" className="h-4 w-4" />Crear tienda</button>
          <p className="mt-4 text-center text-sm text-slate-500">Sin tarjeta. Sin contratos. Listo para conectar Supabase Auth.</p>
        </form>
      </section>
    </main>
  );
}
