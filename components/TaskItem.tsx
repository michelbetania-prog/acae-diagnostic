type Priority = "Alta" | "Media" | "Baja";

type Props = {
  title: string;
  priority: Priority;
  checked?: boolean;
};

const priorityStyle: Record<Priority, string> = {
  Alta: "bg-red-50 text-red-700 border-red-200",
  Media: "bg-amber-50 text-amber-700 border-amber-200",
  Baja: "bg-slate-100 text-slate-700 border-slate-200"
};

export function TaskItem({ title, priority, checked = false }: Props) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={checked} readOnly className="h-4 w-4 accent-[#4B0082]" />
        <span className="text-sm font-medium text-[#191970]">{title}</span>
      </div>
      <span className={`rounded-full border px-2 py-1 text-xs font-semibold ${priorityStyle[priority]}`}>
        {priority}
      </span>
    </label>
  );
}
