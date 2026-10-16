/**
 * LabInstructions — Renders a structured step/section block with a title and body text.
 * Use multiple instances to walk a student through multi-step content.
 */
export default function LabInstructions({ step, title, children }) {
  return (
    <section className="mb-6">
      {(step || title) && (
        <div className="flex items-center gap-3 mb-3">
          {step && (
            <span className="w-6 h-6 rounded-full bg-white/[0.06] border border-white/28 text-accent text-xs font-bold flex items-center justify-center shrink-0">
              {step}
            </span>
          )}
          {title && (
            <h3 className="text-sm font-semibold text-fg uppercase tracking-wide">{title}</h3>
          )}
        </div>
      )}
      <div className="text-sm text-fg leading-relaxed space-y-3 ml-9">{children}</div>
    </section>
  );
}
