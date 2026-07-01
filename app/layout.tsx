import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sazón Local RD | Plataforma de comercio gastronómico",
  description: "Sistema moderno para que comercios gastronómicos vendan directo, controlen su catálogo y reciban pedidos por WhatsApp."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
