import Link from "next/link";
import { Badge } from "@/components/ui/Badge";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbfaf7] px-4 py-12">
      <form className="card-premium w-full max-w-md p-8">
        <Badge tone="brand">Bienvenido</Badge>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-ink">Entra a tu panel</h1>
        <p className="mt-3 text-slate-600">Gestiona pedidos, productos y la tienda de tu comercio.</p>
        <div className="mt-7 space-y-4">
          <input className="input" type="email" placeholder="Correo" />
          <input className="input" type="password" placeholder="Contraseña" />
        </div>
        <button className="btn-primary mt-6 w-full" type="button">Entrar</button>
        <p className="mt-5 text-center text-sm text-slate-500">¿No tienes cuenta? <Link href="/register" className="font-black text-petrol">Comienza gratis</Link></p>
      </form>
    </main>
  );
}
