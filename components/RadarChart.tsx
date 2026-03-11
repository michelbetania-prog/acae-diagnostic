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
    { dimension: "Autoridad", value: scores.autoridad },
    { dimension: "Escalabilidad", value: scores.escalabilidad }
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-slate-900">Mapa ACAE</h2>
      <div className="mt-4 h-[280px] w-full">
        <ResponsiveContainer>
          <RechartRadar data={data} outerRadius={95}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" />
            <PolarRadiusAxis angle={30} domain={[0, 15]} tickCount={6} />
            <Tooltip />
            <Radar dataKey="value" stroke="#275df6" fill="#275df6" fillOpacity={0.35} />
          </RechartRadar>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
