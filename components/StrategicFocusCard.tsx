type Props = {
  dimension: string;
  insight: string;
};

export function StrategicFocusCard({ dimension, insight }: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#1B003F]">FOCO ESTRATÉGICO</h2>
      <p className="mt-2 text-sm text-[#191970]">
        Dimensión prioritaria: <strong>{dimension}</strong>
      </p>
      <p className="mt-1 text-sm text-[#191970]">Insight estratégico: {insight}</p>
    </section>
  );
}
