import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-[#fbfaf7]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink text-white shadow-lg shadow-slate-900/10">
            <Icon name="spark" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-lg font-black leading-5 tracking-tight text-ink">Sazón Local</span>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Commerce OS</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-bold text-slate-600 md:flex">
          <Link href="/#beneficios" className="transition hover:text-ink">Beneficios</Link>
          <Link href="/#comercios" className="transition hover:text-ink">Comercios</Link>
          <Link href="/dashboard" className="transition hover:text-ink">Panel</Link>
          <Link href="/admin" className="transition hover:text-ink">Admin</Link>
        </div>

        <div className="flex items-center gap-2">
          <Link className="hidden rounded-2xl px-4 py-2 text-sm font-black text-slate-600 transition hover:bg-white hover:text-ink sm:inline-flex" href="/login">
            Entrar
          </Link>
          <Link className="btn-primary !px-4 !py-2 text-sm" href="/register">
            Comenzar gratis
          </Link>
        </div>
      </nav>
    </header>
  );
}
