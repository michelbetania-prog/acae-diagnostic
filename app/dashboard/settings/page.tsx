import { DashboardShell } from "@/components/ui/Shell";

export default function SettingsPage() {
  return (
    <DashboardShell eyebrow="Tienda" title="Ajusta la presencia digital de tu comercio.">
      <form className="card-premium max-w-4xl p-6 md:p-8">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="label">Nombre<input className="input mt-2" placeholder="Mi restaurante" /></label>
          <label className="label">Logo<input className="input mt-2" type="file" /></label>
          <label className="label md:col-span-2">Descripción<textarea className="input mt-2 min-h-28" /></label>
          <label className="label">Zona<input className="input mt-2" /></label>
          <label className="label">WhatsApp<input className="input mt-2" /></label>
          <label className="label md:col-span-2">Horarios<input className="input mt-2" /></label>
        </div>
        <label className="mt-6 flex items-center gap-3 font-bold text-slate-700"><input type="checkbox" className="h-5 w-5" /> Abierto ahora</label>
        <button className="btn-primary mt-6" type="button">Guardar cambios</button>
      </form>
    </DashboardShell>
  );
}
