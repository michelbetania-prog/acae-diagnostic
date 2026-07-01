import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sazón Local RD",
  description: "Marketplace asequible para comercios gastronómicos pequeños en República Dominicana"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-50 text-slate-950 antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
