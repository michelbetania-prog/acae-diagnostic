type Props = {
  title: string;
  value: string | number;
  subtitle: string;
};

export function MetricCard({ title, value, subtitle }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm text-[#191970]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[#1B003F]">{value}</p>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </article>
  );
}
