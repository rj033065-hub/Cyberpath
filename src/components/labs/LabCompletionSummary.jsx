/**
 * LabCompletionSummary — Shown when a student completes a lab.
 * Displays XP awarded (practice-only), completion time, skills learned,
 * links to the next lab and related lesson.
 */
import { Link } from "react-router-dom";
import { CheckCircle2, Zap, ArrowRight, BookOpen, FlaskConical } from "lucide-react";

export default function LabCompletionSummary({
  labTitle,
  xpAwarded = 0,
  skills = [],
  nextLab,
  relatedLesson,
  onRetry,
  isPracticeOnly = true,
}) {
  return (
    <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-full bg-[#3fb950]/15 border border-[#3fb950]/40 flex items-center justify-center">
          <CheckCircle2 className="w-5 h-5 text-[#3fb950]" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-[#3fb950]">Lab Complete!</h2>
          <p className="text-xs text-[#8b949e]">{labTitle}</p>
        </div>
      </div>

      {/* XP badge */}
      {xpAwarded > 0 && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e3b341]/10 border border-[#e3b341]/30 mb-4">
          <Zap className="w-3.5 h-3.5 text-[#e3b341]" />
          <span className="text-sm font-semibold text-[#e3b341]">+{xpAwarded} XP</span>
          {isPracticeOnly && (
            <span className="text-[10px] text-[#6e7681] ml-1">(practice)</span>
          )}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold mb-2">
            Skills Practiced
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#21262d] text-[#c9d1d9] border border-[#30363d]"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Note about practice XP */}
      {isPracticeOnly && (
        <p className="text-xs text-[#6e7681] mb-5 border-l-2 border-[#30363d] pl-3">
          Practice XP is stored locally and counted in your learning profile. Authoritative badge
          awards require completing the full curriculum track.
        </p>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3">
        {nextLab && (
          <Link
            to={nextLab.href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors"
          >
            <FlaskConical className="w-4 h-4" />
            {nextLab.label}
            <ArrowRight className="w-4 h-4 ml-auto" />
          </Link>
        )}
        {relatedLesson && (
          <Link
            to={relatedLesson.href}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#30363d] text-[#c9d1d9] text-sm font-medium hover:border-[#58a6ff]/40 hover:text-white transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {relatedLesson.label}
          </Link>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#30363d] text-[#8b949e] text-sm hover:border-[#30363d] hover:text-[#c9d1d9] transition-all"
          >
            Retry Lab
          </button>
        )}
        <Link
          to="/labs"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#30363d] text-[#8b949e] text-sm hover:text-[#c9d1d9] transition-all"
        >
          Back to Labs
        </Link>
      </div>
    </div>
  );
}
