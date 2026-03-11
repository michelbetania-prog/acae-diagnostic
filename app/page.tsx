import Link from "next/link";
import { Container } from "@/components/Container";

const dimensions = [
  { title: "Atracción", description: "Cómo tu negocio genera nuevas oportunidades." },
  { title: "Conversión", description: "Qué tan efectivo eres convirtiendo prospectos en clientes." },
  { title: "Autoridad", description: "El nivel de credibilidad y posicionamiento de tu marca." },
  { title: "Escalabilidad", description: "Qué tan preparado está tu negocio para crecer." }
];

export default function LandingPage() {
  return (
    <main className="py-10 md:py-16">
      <Container className="space-y-16">
        <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-brand-700 p-10 text-white shadow-soft md:p-14">
          <p className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1 text-sm">Método ACAE</p>
          <h1 className="max-w-2xl text-3xl font-bold leading-tight md:text-5xl">Diagnóstico Estratégico ACAE</h1>
          <p className="mt-5 max-w-2xl text-base text-slate-100 md:text-lg">Descubre qué está bloqueando el crecimiento de tu negocio.</p>
          <Link href="/diagnostic" className="mt-8 inline-flex rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100">Comenzar Diagnóstico</Link>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Las 4 dimensiones del método</h2>
          <div className="grid gap-5 md:grid-cols-2">
            {dimensions.map((item) => (
              <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-soft md:p-10">
          <p className="mx-auto max-w-2xl text-lg text-slate-700">Realiza este diagnóstico de 5 minutos y descubre el verdadero cuello de botella de tu negocio.</p>
          <Link href="/diagnostic" className="mt-6 inline-flex rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white transition hover:bg-brand-700">Iniciar Diagnóstico</Link>
        </section>
      </Container>
    </main>
  );
}
