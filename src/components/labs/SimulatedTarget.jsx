/**
 * SimulatedTarget — Container for the interactive challenge area.
 * Clearly labels the area as a "Simulated Training Environment" to prevent confusion with real systems.
 */
import { Monitor } from "lucide-react";

export default function SimulatedTarget({ label = "Simulated Training Environment", children }) {
  return (
    <div className="rounded-xl border border-[#30363d] bg-[#010409] overflow-hidden mb-6">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#21262d] bg-[#0d1117]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f85149]/70" />
          <span className="w-3 h-3 rounded-full bg-[#e3b341]/70" />
          <span className="w-3 h-3 rounded-full bg-[#3fb950]/70" />
        </div>
        <div className="flex-1 flex items-center justify-center gap-1.5">
          <Monitor className="w-3.5 h-3.5 text-[#8b949e]" />
          <span className="text-xs text-[#8b949e] font-mono">{label}</span>
        </div>
        {/* Security disclaimer */}
        <span className="text-[10px] text-[#6e7681] hidden sm:inline">
          ⚠ Fictional system — no real data
        </span>
      </div>
      {/* Challenge content */}
      <div className="p-4 sm:p-6">{children}</div>
    </div>
  );
}
