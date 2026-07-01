import Link from "next/link";
export function Navbar() {
  return <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur"><nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link href="/" className="text-xl font-black text-emerald-700">Sazón Local RD</Link><div className="flex items-center gap-2 text-sm font-semibold"><Link className="rounded-xl px-3 py-2 hover:bg-slate-100" href="/dashboard">Panel comercio</Link><Link className="rounded-xl px-3 py-2 hover:bg-slate-100" href="/admin">Admin</Link><Link className="btn-primary !px-4 !py-2" href="/register">Registrar comercio</Link></div></nav></header>;
}
