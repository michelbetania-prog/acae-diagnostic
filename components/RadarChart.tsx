"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartRadar,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import { ACAEScore } from "@/lib/calculateACAE";

type Props = {
  scores: ACAEScore;
};

export function RadarChart({ scores }: Props) {
  const data = [
    { dimension: "Atracción", value: scores.atraccion },
    { dimension: "Conversión", value: scores.conversion },
    { dimension: "Automatización", value: scores.autoridad },
    { dimension: "Escala", value: scores.escalabilidad }
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#1B003F]">Mapa ACAE</h2>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer>
          <RechartRadar data={data} outerRadius={95}>
            <PolarGrid stroke="#d9dbe7" />
            <PolarAngleAxis dataKey="dimension" tick={{ fill: "#191970", fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 15]} tickCount={6} tick={{ fill: "#191970" }} />
            <Tooltip />
            <Radar dataKey="value" stroke="#4B0082" fill="#4B0082" fillOpacity={0.35} />
          </RechartRadar>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
