/**
 * LabProgressIndicator — Step-based progress bar shown at the top of each lab.
 */
export default function LabProgressIndicator({ total, current }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="px-4 sm:px-6 py-2 flex items-center gap-3">
      <div className="flex-1 h-1 bg-raised rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
      <span className="text-xs text-muted shrink-0 tabular-nums">
        Step {current} of {total}
      </span>
    </div>
  );
}
