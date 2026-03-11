import Link from "next/link";
import { Container } from "@/components/Container";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Diagnóstico", href: "/diagnostic" },
  { label: "Plan de Acción", href: "/dashboard/action-plan" },
  { label: "Tareas", href: "/dashboard/tasks" },
  { label: "Progreso", href: "/dashboard/progress" },
  { label: "Sesiones", href: "/dashboard/sessions" },
  { label: "Cuenta", href: "/account" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          ACAE Diagnostic
        </Link>
        <nav className="hidden items-center gap-4 lg:flex">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className="text-sm font-medium text-slate-700 hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
