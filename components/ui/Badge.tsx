import { ReactNode } from "react";

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "brand" | "success" | "warning" }) {
  const tones = {
    neutral: "border-slate-200 bg-white text-slate-700",
    brand: "border-[#d9ede8] bg-[#f0faf7] text-[#0b5f56]",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700"
  };

  return <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tones[tone]}`}>{children}</span>;
}
