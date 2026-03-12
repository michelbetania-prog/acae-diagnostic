import { TaskItem } from "@/components/TaskItem";

type Item = {
  id: string;
  title: string;
  status: "pending" | "completed";
};

type Props = {
  items: Item[];
};

export function PriorityTasksCard({ items }: Props) {
  const priorities: Array<"Alta" | "Media" | "Baja"> = ["Alta", "Media", "Baja"];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#1B003F]">ACCIONES PRIORITARIAS</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-slate-500">Completa un diagnóstico para generar acciones prioritarias.</p>
        ) : (
          items.slice(0, 3).map((item, idx) => (
            <TaskItem
              key={item.id}
              title={item.title}
              priority={priorities[idx] ?? "Baja"}
              checked={item.status === "completed"}
            />
          ))
        )}
      </div>
    </section>
  );
}
