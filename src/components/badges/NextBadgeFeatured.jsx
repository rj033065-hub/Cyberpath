import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Target, CheckCircle2, Shield } from "lucide-react";
import BadgeEmblem from "./BadgeEmblem";
import { getTrackPalette } from "./badgeProgressHelper";

/**
 * Featured "Next Badge to Unlock" Component
 * Highlights the student's closest credential to unlock with exact remaining steps,
 * animated progress bar, and immediate call to action.
 */
export default function NextBadgeFeatured({
  nextBadgeData,
  currentPath = "red-team",
  className = "",
}) {
  if (!nextBadgeData) {
    // All badges earned state
    return (
      <div className={`p-6 sm:p-8 rounded-2xl border border-[#d29922]/60 bg-gradient-to-r from-[#1c160a] via-[#111821] to-[#0d1117] relative overflow-hidden ${className}`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#f59e0b]/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#d29922]/20 border border-[#f2cc60]/50 flex items-center justify-center text-[#f2cc60] shrink-0">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#f2cc60]/40 bg-[#d29922]/20 text-[#f2cc60] text-[10px] font-mono uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>All Achievements Unlocked</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#f0f6fc]">
              Full Credential Mastery Conquered
            </h3>
            <p className="text-xs text-[#8b98a8] leading-relaxed max-w-xl">
              You have completed every foundational and path milestone across Red Team, Blue Team, and Web Security. All 8 verified badges are cryptographically signed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { badge, completedSteps, totalSteps, remainingSteps, percent, requirementText, pathSlug } = nextBadgeData;
  const palette = getTrackPalette(badge);
  const isMaster = badge.isMaster || badge.slug === "cyberpath-master";

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/12 bg-[#101012] p-6 sm:p-7 shadow-xl ${className}`}
    >
      {/* Background Ambient Aura */}
      <div
        className="absolute top-0 right-0 w-96 h-96 blur-[120px] pointer-events-none rounded-full opacity-20"
        style={{
          background: isMaster
            ? "radial-gradient(circle, #f59e0b 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
        }}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Side: Emblem Showcase */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left w-full lg:w-auto">
          <div className="shrink-0">
            <BadgeEmblem
              badge={badge}
              state="in_progress"
              completedSteps={completedSteps}
              totalSteps={totalSteps}
              size={130}
              showProgressRing={true}
            />
          </div>

          <div className="space-y-2 max-w-lg">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-white/20 bg-white/[0.06] text-white text-[10px] font-mono uppercase tracking-wider font-semibold">
                <Target className="w-3 h-3 text-white" />
                Next Badge to Unlock
              </span>
              <span className="text-[11px] font-mono text-[#a1a1aa]">
                {badge.track} · {palette.tierName}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-[#fafafa] tracking-tight">
              {badge.name}
            </h3>

            <p className="text-xs text-[#a1a1aa] leading-relaxed">
              {requirementText}
            </p>

            {/* Remaining steps prompt */}
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2 text-xs font-mono">
              <span
                className="font-bold text-sm text-white"
                style={{ color: isMaster ? "#f2cc60" : "#ffffff" }}
              >
                {remainingSteps} {remainingSteps === 1 ? "step" : "steps"} remaining
              </span>
              <span className="text-[#a1a1aa] text-[11px]">
                ({completedSteps} of {totalSteps} milestones finished)
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Progress Bar & CTA */}
        <div className="w-full lg:w-72 flex flex-col gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#a1a1aa]">Unlock Progress</span>
              <span
                className="font-bold"
                style={{ color: isMaster ? "#f2cc60" : "#ffffff" }}
              >
                {percent}%
              </span>
            </div>
            <div className="w-full bg-[#1c1c20] h-2 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percent}%`,
                  backgroundColor: isMaster ? "#f2cc60" : "#ffffff",
                }}
              />
            </div>
          </div>

          <Link
            to={pathSlug === "all" ? `/learn/${currentPath}` : `/learn/${pathSlug}`}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              isMaster
                ? "bg-[#d29922] hover:bg-[#b5831b] text-white"
                : "bg-white hover:bg-[#e4e4e7] text-[#09090b]"
            }`}
          >
            <span>Continue Towards Badge</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
