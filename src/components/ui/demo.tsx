import { RippleGrid } from "@/components/ui/ripple-grid";
import { Link } from "react-router-dom";

export default function DemoOne() {
  return (
    <div className="relative min-h-screen bg-page text-fg flex flex-col">
      {/* Top Banner Navigation */}
      <div className="p-4 border-b border-white/12 bg-surface/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-raised hover:bg-raised text-xs font-semibold text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <span className="font-semibold text-sm hidden sm:inline text-fg">
            Ripple Grid Interactive Demo
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>Click any cell to trigger ripple waves</span>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="flex-1 flex justify-center items-center overflow-auto p-4 sm:p-8">
        <RippleGrid
          size={20}
          cellSize={40}
          cellColor="#101012"
          borderColor="rgba(255,255,255,0.12)"
          filledCellColor="#27272a"
          pulseColor="#ffffff"
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
