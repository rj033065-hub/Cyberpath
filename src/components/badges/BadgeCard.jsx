import { useState } from "react";
import { Link } from "react-router-dom";
import {
  LockKeyhole,
  CheckCircle2,
  Clock,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  Check,
} from "lucide-react";
import BadgeEmblem from "./BadgeEmblem";
import { getTrackPalette, downloadBadgePng } from "./badgeProgressHelper";

/**
 * Modern Clean Badge Card Component
 * Meets all user design guidelines:
 * - Removed heavy boxed card styling
 * - Large emblem centered
 * - Title below emblem
 * - One line requirement text
 * - Sleek progress line
 * - "Locked" label as small status text, NOT a pill
 * - Earned state with earned date, soft glow, shine sweep, Share & Download PNG
 */
export default function BadgeCard({
  badge,
  progress,
  studentName = "Student Researcher",
  onSelect,
  isSelected = false,
  className = "",
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const palette = getTrackPalette(badge);
  const isMaster = badge?.isMaster || badge?.slug === "cyberpath-master" || badge?.track === "Apex Credential";

  const {
    isEarned = false,
    state = "locked",
    completedSteps = 0,
    totalSteps = 1,
    percent = 0,
    requirementText = badge?.description || "",
    earnedAt = null,
    pathSlug = "red-team",
  } = progress || {};

  const earnedFormattedDate = earnedAt
    ? new Date(earnedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Verified";

  const handleDownload = (e) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      downloadBadgePng(badge, earnedAt, studentName);
    } finally {
      setTimeout(() => setDownloading(false), 800);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    const shareText = `I unlocked the verified "${badge.name}" achievement credential on CyberPath! 🛡️ #CyberSecurity #CyberPath`;
    const shareUrl = window.location.origin;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `CyberPath Credential: ${badge.name}`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // ignore
    }
  };

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col items-center justify-between p-6 rounded-2xl transition-all duration-300 ${
        isEarned
          ? "bg-[#111821]/50 hover:bg-[#111821]/80 border border-[#21262d]/60 hover:border-[#3fb950]/50 hover:shadow-xl hover:shadow-[#3fb950]/10"
          : state === "in_progress"
          ? "bg-[#111821]/40 hover:bg-[#111821]/70 border border-[#21262d]/60 hover:border-[#2f81f7]/50"
          : "bg-[#0d1117]/50 hover:bg-[#111821]/40 border border-[#21262d]/30 hover:border-[#21262d]/60"
      } ${isSelected ? "ring-2 ring-offset-2 ring-offset-[#0d1117] ring-[#2f81f7]" : ""} ${className}`}
    >
      {/* Subtle track ambient backdrop light */}
      {isEarned && (
        <div
          className="absolute inset-0 rounded-2xl opacity-15 pointer-events-none transition-opacity duration-300 group-hover:opacity-25"
          style={{
            background: isMaster
              ? "radial-gradient(circle at 50% 20%, #f59e0b 0%, transparent 70%)"
              : `radial-gradient(circle at 50% 20%, ${palette.primary} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Top Track & Tier Subtle Label */}
      <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#8b98a8] mb-3">
        <span
          className="font-semibold uppercase tracking-wider text-[10px]"
          style={{ color: isEarned ? (isMaster ? "#f2cc60" : palette.primary) : "#8b98a8" }}
        >
          {badge.track}
        </span>
        {isMaster ? (
          <span className="text-[#f2cc60] font-bold text-[10px] tracking-wide">APEX CREDENTIAL</span>
        ) : (
          <span className="text-[10px] text-[#8b98a8]/80">{palette.tierName}</span>
        )}
      </div>

      {/* Large Custom SVG Emblem */}
      <div className="my-2 flex items-center justify-center">
        <BadgeEmblem
          badge={badge}
          state={state}
          completedSteps={completedSteps}
          totalSteps={totalSteps}
          size={120}
          showProgressRing={true}
        />
      </div>

      {/* Badge Title */}
      <div className="w-full text-center mt-3">
        <h4
          className={`text-base font-bold tracking-tight transition-colors ${
            isEarned
              ? isMaster
                ? "text-transparent bg-clip-text bg-gradient-to-r from-[#fef08a] via-[#fbbf24] to-[#f59e0b]"
                : "text-[#f0f6fc] group-hover:text-white"
              : "text-[#8b98a8] group-hover:text-[#f0f6fc]"
          }`}
        >
          {badge.name}
        </h4>

        {/* One line of requirement text */}
        <p className="text-xs text-[#8b98a8] truncate max-w-full px-1 mt-1 leading-normal" title={requirementText}>
          {requirementText}
        </p>
      </div>

      {/* Progress Line */}
      <div className="w-full mt-4 space-y-1.5">
        <div className="w-full bg-[#21262d]/80 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${isEarned ? 100 : percent}%`,
              backgroundColor: isEarned
                ? isMaster
                  ? "#f2cc60"
                  : "#3fb950"
                : state === "in_progress"
                ? palette.primary
                : "transparent",
            }}
          />
        </div>

        {/* Small Status Text (NOT A PILL) */}
        <div className="flex items-center justify-between text-[11px] text-[#8b98a8] font-mono pt-1">
          {isEarned ? (
            <>
              <span className="flex items-center gap-1.5 text-[#3fb950] font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Earned {earnedFormattedDate}
              </span>
              <span className="text-[#3fb950] font-bold">100%</span>
            </>
          ) : state === "in_progress" ? (
            <>
              <span className="flex items-center gap-1.5 text-[#58a6ff]">
                <Clock className="w-3.5 h-3.5" />
                In progress
              </span>
              <span className="text-[#f0f6fc]">
                {completedSteps}/{totalSteps} completed
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-[#8b98a8]">
                <LockKeyhole className="w-3.5 h-3.5" />
                Locked
              </span>
              <span className="text-[#8b98a8]">
                {completedSteps}/{totalSteps} steps
              </span>
            </>
          )}
        </div>
      </div>

      {/* Action Row for Earned Badges: Share & Download PNG */}
      {isEarned ? (
        <div className="w-full flex items-center gap-2 pt-3 mt-3 border-t border-[#21262d]/50">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 py-1.5 px-2.5 rounded-lg bg-[#16202e] hover:bg-[#1f2d40] text-[#f0f6fc] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-[#21262d] shadow-sm active:scale-95"
            title="Download high-resolution PNG credential"
          >
            <Download className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>{downloading ? "Exporting..." : "Download PNG"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-1.5 px-2.5 rounded-lg bg-[#16202e] hover:bg-[#1f2d40] text-[#8b98a8] hover:text-[#f0f6fc] text-xs font-medium flex items-center justify-center gap-1 transition-colors border border-[#21262d] active:scale-95"
            title="Share credential link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                <span className="text-[11px] text-[#3fb950] font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[11px] hidden sm:inline">Share</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Unearned Action Row */
        <div className="w-full pt-3 mt-3 border-t border-[#21262d]/30 flex items-center justify-between text-xs">
          <Link
            to={pathSlug === "all" ? "/dashboard" : `/learn/${pathSlug}`}
            className="text-[11px] text-[#8b98a8] hover:text-[#58a6ff] transition-colors flex items-center gap-1 font-mono group-hover:translate-x-0.5"
          >
            <span>View Track Roadmap</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <span className="text-[10px] font-mono text-[#8b98a8]/70">
            {totalSteps - completedSteps} steps remaining
          </span>
        </div>
      )}
    </div>
  );
}
