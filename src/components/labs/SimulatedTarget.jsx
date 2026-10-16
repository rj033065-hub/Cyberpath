/**
 * SimulatedTarget — Container for the interactive challenge area.
 * Clearly labels the area as a "Simulated Training Environment" to prevent confusion with real systems.
 */
import { Monitor } from "lucide-react";

export default function SimulatedTarget({ label = "Simulated Training Environment", children }) {
  return (
    <div className="rounded-xl border border-white/12 bg-page overflow-hidden mb-6">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/12 bg-page">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-danger/70" />
          <span className="w-3 h-3 rounded-full bg-white/45" />
          <span className="w-3 h-3 rounded-full bg-white/70" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs text-muted font-mono">{label}</span>
        </div>
        {/* Security disclaimer */}
        <span className="text-[10px] text-faint hidden sm:inline">
          ⚠ Fictional system — no real data
        </span>
      </div>
      {/* Challenge content */}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
