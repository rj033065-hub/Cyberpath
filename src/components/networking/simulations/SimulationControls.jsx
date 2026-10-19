import { Play, Pause, RotateCcw, SkipForward, FastForward, Gauge, Eye } from "lucide-react";

export default function SimulationControls({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onReset,
  currentStep,
  totalSteps,
  speed = 1,
  onChangeSpeed,
  stepLabel = "",
  reducedMotion = false,
  onToggleReducedMotion,
  canStep = true,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-surface/90 border border-white/12 rounded-xl backdrop-blur-md">
      {/* Playback actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onTogglePlay}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isPlaying
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
              : "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
          }`}
          aria-label={isPlaying ? "Pause simulation" : "Play simulation"}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Play</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onStepForward}
          disabled={isPlaying || !canStep}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed border border-white/12 text-xs font-medium text-fg transition-colors"
          aria-label="Next step"
          title="Advance to next step"
        >
          <SkipForward className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Next Step</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 border border-white/12 text-xs font-medium text-muted hover:text-fg transition-colors"
          aria-label="Reset simulation"
          title="Reset to beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Step Progress & Current Caption */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1.5 font-mono text-muted">
          <span className="text-cyan-400 font-semibold">{currentStep + 1}</span>
          <span>/</span>
          <span>{totalSteps}</span>
        </div>
        {stepLabel && (
          <span className="text-xs text-zinc-300 max-w-[200px] sm:max-w-[280px] md:max-w-md truncate font-medium">
            {stepLabel}
          </span>
        )}
      </div>

      {/* Speed & Accessibility Options */}
      <div className="flex items-center gap-2">
        {onChangeSpeed && (
          <div className="flex items-center gap-1 bg-raised/80 px-2 py-1 rounded-lg border border-white/10 text-xs">
            <Gauge className="w-3.5 h-3.5 text-muted" />
            <select
              value={speed}
              onChange={(e) => onChangeSpeed(Number(e.target.value))}
              className="bg-transparent text-xs text-fg focus:outline-none cursor-pointer"
              aria-label="Simulation speed"
            >
              <option value={0.5} className="bg-zinc-900 text-fg">0.5x</option>
              <option value={1} className="bg-zinc-900 text-fg">1.0x</option>
              <option value={1.5} className="bg-zinc-900 text-fg">1.5x</option>
              <option value={2} className="bg-zinc-900 text-fg">2.0x</option>
            </select>
          </div>
        )}

        {onToggleReducedMotion && (
          <button
            type="button"
            onClick={onToggleReducedMotion}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors flex items-center gap-1 ${
              reducedMotion
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                : "bg-raised border-white/10 text-muted hover:text-fg"
            }`}
            title="Toggle reduced motion"
            aria-pressed={reducedMotion}
          >
            <Eye className="w-3 h-3" />
            <span className="hidden md:inline">Reduced Motion</span>
          </button>
        )}
      </div>
    </div>
  );
}
