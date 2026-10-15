/**
 * HintPanel — Progressive hint disclosure.
 * Hints are revealed one at a time in order.
 * Calls onHintReveal(index) when a new hint is revealed so the parent can track usage.
 */
import { useState } from "react";
import { Lightbulb, ChevronDown, Eye } from "lucide-react";

export default function HintPanel({ hints = [], onHintReveal }) {
  const [revealed, setRevealed] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const revealNext = () => {
    if (revealed < hints.length) {
      const newIdx = revealed;
      setRevealed((prev) => prev + 1);
      setExpanded(true);
      if (onHintReveal) onHintReveal(newIdx);
    }
  };

  if (hints.length === 0) return null;

  return (
    <div className="rounded-xl border border-[#e3b341]/20 bg-[#e3b341]/5 mb-6">
      {/* Collapsible header */}
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e3b341]/40 rounded-xl"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls="hint-panel-body"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#e3b341]" />
          <span className="text-sm font-medium text-[#e3b341]">
            Hints ({revealed}/{hints.length} revealed)
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-[#e3b341] transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div id="hint-panel-body" className="px-4 pb-4 space-y-3 border-t border-[#e3b341]/10 pt-3">
          {/* Already revealed hints */}
          {hints.slice(0, revealed).map((hint, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 p-3 rounded-lg bg-[#e3b341]/8 border border-[#e3b341]/15"
            >
              <span className="text-[#e3b341] text-xs font-bold mt-0.5 shrink-0">
                Hint {i + 1}
              </span>
              <p className="text-sm text-[#c9d1d9]">{hint}</p>
            </div>
          ))}

          {/* Reveal next button */}
          {revealed < hints.length && (
            <button
              onClick={revealNext}
              className="flex items-center gap-2 text-sm text-[#e3b341] hover:text-[#f1c232] border border-[#e3b341]/30 hover:border-[#e3b341]/60 px-3 py-2 rounded-lg transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
              {revealed === 0 ? "Show first hint" : "Show next hint"}
            </button>
          )}

          {revealed === hints.length && (
            <p className="text-xs text-[#6e7681] italic">All hints revealed.</p>
          )}
        </div>
      )}
    </div>
  );
}
