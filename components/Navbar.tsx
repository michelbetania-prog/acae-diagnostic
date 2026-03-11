import Link from "next/link";
import { Container } from "@/components/Container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          ACAE Diagnostic
        </Link>
        <Link href="/diagnostic" className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white">
          Iniciar
        </Link>
      </Container>
    </header>
  );
}
