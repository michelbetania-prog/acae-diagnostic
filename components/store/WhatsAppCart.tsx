"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { Business, Product } from "@/lib/types";

type CartItem = Product & { quantity: number };

export function WhatsAppCart({ business, products }: { business: Business; products: Product[] }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const categories = Array.from(new Set(products.map((product) => product.category?.name ?? "Menú")));

  const add = (product: Product) => {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id);
      if (existing) return items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const change = (id: string, delta: number) => {
    setCart((items) => items.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)).filter((item) => item.quantity > 0));
  };

  const whatsappHref = useMemo(() => {
    const lines = [
      `Pedido para ${business.name}`,
      "",
      ...cart.map((item) => `- ${item.quantity} x ${item.name}: RD$${(item.price * item.quantity).toFixed(2)}`),
      "",
      `Total: RD$${total.toFixed(2)}`,
      `Cliente: ${name || "Pendiente"}`,
      `Entrega/retiro: ${address || "Pendiente"}`,
      `Nota: ${note || "N/A"}`
    ];

    return `https://wa.me/${business.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(lines.join("\n"))}`;
  }, [business.name, business.whatsapp, cart, total, name, address, note]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <section className="space-y-10">
        {categories.map((category) => (
          <div key={category}>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="text-2xl font-black text-ink">{category}</h3>
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {products.filter((product) => (product.category?.name ?? "Menú") === category).map((product) => (
                <article key={product.id} className="card-premium group grid gap-5 p-4 transition duration-300 hover:-translate-y-1 hover:shadow-premium sm:grid-cols-[128px_1fr]">
                  <div className="flex h-32 items-center justify-center rounded-3xl bg-[linear-gradient(135deg,#eff8f6,#fff2ed)] text-petrol">
                    <Icon name="bag" className="h-10 w-10" />
                  </div>
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="text-lg font-black text-ink">{product.name}</h4>
                      {product.is_featured && <Badge tone="warning">Top</Badge>}
                    </div>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <strong className="text-lg text-petrol">RD${product.price.toFixed(2)}</strong>
                      <button className="btn-primary !px-4 !py-2 text-sm" onClick={() => add(product)}>
                        Agregar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>

      <aside className="card-premium h-fit p-6 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-coral">Pedido</p>
            <h3 className="mt-2 text-2xl font-black text-ink">Carrito</h3>
          </div>
          <Badge tone="brand">{cart.length} ítems</Badge>
        </div>

        <div className="mt-6 space-y-3">
          {cart.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 p-6 text-center">
              <Icon name="bag" className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-500">Agrega productos para crear el mensaje.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-3" key={item.id}>
                <div>
                  <p className="text-sm font-black text-ink">{item.name}</p>
                  <p className="text-xs font-bold text-slate-500">RD${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => change(item.id, -1)} className="h-8 w-8 rounded-full border border-slate-200 bg-white font-black">-</button>
                  <span className="w-5 text-center text-sm font-black">{item.quantity}</span>
                  <button onClick={() => change(item.id, 1)} className="h-8 w-8 rounded-full border border-slate-200 bg-white font-black">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="my-6 border-t border-slate-200 pt-5 text-2xl font-black text-ink">RD${total.toFixed(2)}</div>
        <div className="space-y-3">
          <input className="input" placeholder="Nombre del cliente" value={name} onChange={(event) => setName(event.target.value)} />
          <input className="input" placeholder="Dirección o indicar retiro" value={address} onChange={(event) => setAddress(event.target.value)} />
          <textarea className="input min-h-24" placeholder="Nota adicional" value={note} onChange={(event) => setNote(event.target.value)} />
        </div>
        <a className="btn-coral mt-5 w-full" href={whatsappHref} target="_blank" rel="noreferrer">
          Pedir por WhatsApp
        </a>
      </aside>
    </div>
  );
}
