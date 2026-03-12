"use client";

import { useEffect, useState } from "react";
import { PlanType, getGrowthState, updatePlan } from "@/lib/growthSystem";

export default function AccountPage() {
  const [plan, setPlan] = useState<PlanType>("free");

  useEffect(() => {
    setPlan(getGrowthState().plan);
  }, []);

  const handlePlan = (nextPlan: PlanType) => {
    setPlan(nextPlan);
    updatePlan(nextPlan);
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Cuenta</h1>
      <p className="mt-2 text-slate-600">Selecciona el plan para controlar tus diagnósticos permitidos.</p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-soft">
        <label htmlFor="plan" className="mb-2 block text-sm font-medium text-slate-700">Plan actual</label>
        <select
          id="plan"
          value={plan}
          onChange={(e) => handlePlan(e.target.value as PlanType)}
          className="rounded-md border border-slate-300 px-3 py-2"
        >
          <option value="free">FREE (1 diagnóstico)</option>
          <option value="standard">STANDARD (3 diagnósticos)</option>
          <option value="pro">PRO (4 diagnósticos)</option>
        </select>
      </section>
    </main>
  );
}
