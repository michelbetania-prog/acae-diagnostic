"use client";

import { useEffect, useState } from "react";
import { ActionTask, getAllTasks, getGrowthState, toggleTask } from "@/lib/growthSystem";

export default function DashboardTasksPage() {
  const [tasks, setTasks] = useState<ActionTask[]>([]);

  useEffect(() => {
    setTasks(getAllTasks(getGrowthState()));
  }, []);

  const handleToggle = (task: ActionTask, checked: boolean) => {
    const updated = toggleTask(task.id, checked);
    setTasks(getAllTasks(updated));
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-3xl font-bold text-slate-900">Tareas</h1>
      <p className="mt-2 text-slate-600">Lista de tareas generadas por el diagnóstico ACAE.</p>

      <div className="mt-6 space-y-3">
        {tasks.length === 0 ? (
          <p className="text-slate-600">Aún no hay tareas. Completa un diagnóstico primero.</p>
        ) : (
          tasks.map((task) => (
            <article key={task.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{task.title}</h2>
                  <p className="text-sm text-slate-600">{task.description}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Dimensión: {task.dimension} · Due date: {new Date(task.due_date).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={task.status === "completed"}
                    onChange={(e) => handleToggle(task, e.target.checked)}
                  />
                  {task.status === "completed" ? "Completada" : "Pendiente"}
                </label>
              </div>
            </article>
          ))
        )}
      </div>
    </main>
  );
}
