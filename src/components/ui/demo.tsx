import { RippleGrid } from "@/components/ui/ripple-grid";
import { Link } from "react-router-dom";

export default function DemoOne() {
  return (
    <div className="relative min-h-screen bg-[#090d14] text-[#f0f6fc] flex flex-col">
      {/* Top Banner Navigation */}
      <div className="p-4 border-b border-[#21262d] bg-[#111722]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-xs font-semibold text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="font-semibold text-sm hidden sm:inline text-[#f0f6fc]">
            Ripple Grid Interactive Demo
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#8b98a8]">
          <span className="w-2 h-2 rounded-full bg-[#58a6ff] animate-ping" />
          <span>Click any cell to trigger ripple waves</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 flex justify-center items-center overflow-auto p-4 sm:p-8">
        <RippleGrid
          size={20}
          cellSize={40}
          cellColor="#111722"
          borderColor="#212b38"
          pulseColor="#58a6ff"
          pulseScale={1.15}
          pulseDuration={300}
          rippleDelay={90}
          className="min-h-full"
          filledCells={[
            { row: 4, col: 4 },
            { row: 4, col: 15 },
            { row: 9, col: 9 },
            { row: 10, col: 10 },
            { row: 15, col: 4 },
            { row: 15, col: 15 },
          ]}
        />
      </div>
    </div>
  );
}
