type Props = {
  progress: number;
  completed: number;
  total: number;
};

export function ProgressBar({ progress, completed, total }: Props) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
        <span>Progreso</span>
        <span>
          {completed}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded bg-slate-200">
        <div className="h-full rounded bg-brand-600 transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
