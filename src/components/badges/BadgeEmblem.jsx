import {
  Terminal,
  Network,
  Globe,
  Compass,
  Flame,
  ShieldCheck,
  Crown,
  Award,
  LockKeyhole,
  Star,
  Sparkles,
} from "lucide-react";
import { getTrackPalette } from "./badgeProgressHelper";

const ICON_MAP = {
  Terminal,
  Network,
  Globe,
  Compass,
  Flame,
  ShieldCheck,
  Crown,
  Award,
};

/**
 * Custom inline-SVG Emblem Component with Layered Rim, Center Icon, Tier Marker,
 * Progress Ring, Shine Sweep, and Motion-Safe Unlock Animation.
 */
export default function BadgeEmblem({
  badge,
  state = "locked", // "locked" | "in_progress" | "earned"
  completedSteps = 0,
  totalSteps = 1,
  size = 120, // size in px
  showProgressRing = true,
  isNewUnlock = false,
  className = "",
}) {
  const palette = getTrackPalette(badge);
  const isMaster = badge?.isMaster || badge?.slug === "cyberpath-master" || badge?.track === "Apex Credential";
  const IconComponent = (badge?.iconName && ICON_MAP[badge.iconName]) || (badge?.icon ? badge.icon : Award);

  const isEarned = state === "earned";
  const isInProgress = state === "in_progress";
  const isLocked = state === "locked";

  const percent = totalSteps > 0 ? Math.min(100, Math.round((completedSteps / totalSteps) * 100)) : 0;

  // Circular progress ring metrics
  // ViewBox is 160x160 with center at (80, 80)
  const ringRadius = 72;
  const circumference = 2 * Math.PI * ringRadius; // ~452.39
  const strokeDashoffset = circumference - (circumference * (isEarned ? 100 : percent)) / 100;

  const uniqueId = `badge-${badge?.slug || "item"}-${Math.random().toString(36).substring(2, 7)}`;

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none badge-shine-container group ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${badge?.name || "Badge"} - ${state}`}
    >
      {/* 1. Unlock Ring Burst Animation (respects prefers-reduced-motion) */}
      {(isNewUnlock || (isEarned && isNewUnlock)) && (
        <div
          className="absolute inset-0 rounded-full border-2 border-white/80 animate-ring-burst pointer-events-none"
          style={{ borderColor: palette.primary }}
        />
      )}

      {/* 2. Soft Ambient Glow for Earned Badges */}
      {isEarned && (
        <div
          className="absolute -inset-2 rounded-full blur-xl opacity-60 transition-opacity duration-500 group-hover:opacity-85 pointer-events-none"
          style={{
            background: isMaster
              ? "radial-gradient(circle, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.15) 70%, transparent 100%)"
              : `radial-gradient(circle, ${palette.glowColor} 0%, ${palette.glowColorSecondary} 60%, transparent 100%)`,
          }}
        />
      )}

      {/* 3. Main SVG Emblem */}
      <svg
        viewBox="0 0 160 160"
        className={`w-full h-full relative z-10 transition-transform duration-300 group-hover:scale-105 ${
          isNewUnlock ? "animate-badge-unlock" : ""
        } ${isLocked ? "filter grayscale brightness-50 contrast-125 opacity-75" : ""}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* Gradients */}
          {/* Master Gold Rim Gradient */}
          <linearGradient id={`${uniqueId}-gold-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="#fbbf24" />
            <stop offset="75%" stopColor="#92400e" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>

          {/* Metallic Monochrome Rim Gradient */}
          <linearGradient id={`${uniqueId}-metallic-rim`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f5" />
            <stop offset="30%" stopColor="#71717a" />
            <stop offset="60%" stopColor="#27272a" />
            <stop offset="100%" stopColor="#d4d4d8" />
          </linearGradient>

          {/* Inner Plate Gradients */}
          <radialGradient id={`${uniqueId}-plate`} cx="50%" cy="40%" r="65%">
            <stop
              offset="0%"
              stopColor={isMaster ? "#2f2008" : isEarned ? "#1c1c20" : "#141416"}
            />
            <stop offset="100%" stopColor="#09090b" />
          </radialGradient>

          {/* Subtle Bevel Highlight Gradient */}
          <linearGradient id={`${uniqueId}-bevel-light`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.6)" />
          </linearGradient>

          {/* Shine Sweep Gradient */}
          <linearGradient id={`${uniqueId}-shine-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="rgba(255, 255, 255, 0.85)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Shine Sweep Clip Path for the Inner Shield */}
          <clipPath id={`${uniqueId}-shield-clip`}>
            {/* Inner Shield / Hexagon Path */}
            <path d="M 44,28 L 116,28 L 132,46 L 132,90 L 80,136 L 28,90 L 28,46 Z" />
          </clipPath>
        </defs>

        {/* 4. Progress Ring (Around the emblem) */}
        {showProgressRing && (
          <g className="progress-ring-group" transform="rotate(-90 80 80)">
            {/* Background Track Circle */}
            <circle
              cx="80"
              cy="80"
              r={ringRadius}
              fill="none"
              stroke={isLocked ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.1)"}
              strokeWidth="3.5"
            />
            {/* Active Progress Arc */}
            <circle
              cx="80"
              cy="80"
              r={ringRadius}
              fill="none"
              stroke={
                isEarned
                  ? isMaster
                    ? "url(#" + uniqueId + "-gold-rim)"
                    : palette.primary
                  : isInProgress
                  ? palette.primary
                  : "rgba(255, 255, 255, 0.2)"
              }
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </g>
        )}

        {/* 5. Outer Rim (Layer 1: Beveled Shield Contour) */}
        {/* Outer Path: M 42,22 L 118,22 L 138,44 L 138,92 L 80,144 L 22,92 L 22,44 Z */}
        <path
          d="M 42,22 L 118,22 L 138,44 L 138,92 L 80,144 L 22,92 L 22,44 Z"
          fill={
            isLocked
              ? "#161b22"
              : isMaster
              ? `url(#${uniqueId}-gold-rim)`
              : `url(#${uniqueId}-metallic-rim)`
          }
          stroke={isLocked ? "rgba(255, 255, 255, 0.1)" : isMaster ? "#fef08a" : "rgba(255, 255, 255, 0.4)"}
          strokeWidth="1.5"
          filter={isEarned ? "drop-shadow(0 4px 10px rgba(0,0,0,0.6))" : "none"}
        />

        {/* 6. Subtle Bevel / Shadow Offset Rim (Layer 2) */}
        <path
          d="M 45,25 L 115,25 L 134,45 L 134,90 L 80,140 L 26,90 L 26,45 Z"
          fill="#09090b"
          stroke="rgba(0,0,0,0.4)"
          strokeWidth="1"
        />

        {/* 7. Inner Plate (Layer 3: Metallic/Cyber Core) */}
        <path
          d="M 47,27 L 113,27 L 131,46 L 131,88 L 80,136 L 29,88 L 29,46 Z"
          fill={`url(#${uniqueId}-plate)`}
          stroke={`url(#${uniqueId}-bevel-light)`}
          strokeWidth="1.8"
        />

        {/* Inner Plate Fine Cyber Linework / Grid Accents */}
        <g opacity={isLocked ? 0.15 : 0.4} stroke={isMaster ? "#fbbf24" : palette.secondary} strokeWidth="0.75">
          <line x1="40" y1="48" x2="120" y2="48" />
          <line x1="80" y1="27" x2="80" y2="38" />
          <line x1="80" y1="124" x2="80" y2="136" />
          <path d="M 36,80 L 44,80" />
          <path d="M 124,80 L 116,80" />
        </g>

        {/* 8. Shine Sweep on Hover (Masked to Inner Shield) */}
        <g clipPath={`url(#${uniqueId}-shield-clip)`} className="pointer-events-none">
          <rect
            x="-120"
            y="-20"
            width="60"
            height="200"
            fill={`url(#${uniqueId}-shine-grad)`}
            className="badge-shine-effect pointer-events-none"
          />
        </g>

        {/* 9. Center Track Icon & Tier Marker */}
        <g transform="translate(80, 77)">
          {/* Center Icon Glow */}
          {isEarned && (
            <circle
              cx="0"
              cy="0"
              r="24"
              fill={isMaster ? "rgba(242, 204, 96, 0.2)" : palette.glowColorSecondary}
              filter="blur(4px)"
            />
          )}

          {/* Render Center Icon via foreignObject for vector crispness */}
          <foreignObject x="-20" y={isMaster ? "-16" : "-20"} width="40" height="40">
            <div className="w-full h-full flex items-center justify-center">
              <IconComponent
                className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
                  isLocked
                    ? "text-muted"
                    : isMaster
                    ? "text-[#fef08a] filter drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)]"
                    : "text-white"
                }`}
                style={{
                  color: isLocked ? "#a1a1aa" : isMaster ? "#fef08a" : palette.primary,
                  filter: isEarned ? `drop-shadow(0 0 6px ${palette.primary})` : "none",
                }}
                strokeWidth={2.2}
              />
            </div>
          </foreignObject>

          {/* Lock Overlay for Locked State */}
          {isLocked && (
            <foreignObject x="-12" y="10" width="24" height="24">
              <div className="w-full h-full flex items-center justify-center">
                <div className="p-1 rounded-full bg-page border border-white/12 shadow-sm text-muted">
                  <LockKeyhole className="w-3.5 h-3.5 text-muted" />
                </div>
              </div>
            </foreignObject>
          )}

          {/* Tier Marker (Top or Center Pips) */}
          {isMaster ? (
            /* Master: 3 Gold Stars */
            <g transform="translate(0, -36)">
              <foreignObject x="-28" y="-10" width="56" height="20">
                <div className="flex items-center justify-center gap-1">
                  <Star className="w-3 h-3 fill-[#fef08a] text-[#fef08a] drop-shadow-[0_0_4px_#f59e0b]" />
                  <Star className="w-3.5 h-3.5 fill-[#fef08a] text-[#fef08a] drop-shadow-[0_0_5px_#f59e0b] -translate-y-0.5" />
                  <Star className="w-3 h-3 fill-[#fef08a] text-[#fef08a] drop-shadow-[0_0_4px_#f59e0b]" />
                </div>
              </foreignObject>
            </g>
          ) : (
            /* Regular & Specialist: Sleek Tier Pip / Notch */
            <g transform="translate(0, -38)">
              <polygon
                points="0,-4 4,0 0,4 -4,0"
                fill={isLocked ? "#a1a1aa" : palette.accent}
                stroke={isLocked ? "transparent" : palette.primary}
                strokeWidth="1"
              />
            </g>
          )}
        </g>

        {/* 10. In-Progress or Locked Steps Counter Badge at Bottom */}
        {showProgressRing && !isEarned && (
          <g transform="translate(80, 150)">
            <rect
              x="-22"
              y="-10"
              width="44"
              height="18"
              rx="9"
              fill="#09090b"
              stroke={isInProgress ? palette.primary : "rgba(255,255,255,0.15)"}
              strokeWidth="1.2"
            />
            <text
              x="0"
              y="2.5"
              textAnchor="middle"
              fill={isInProgress ? palette.primary : "#a1a1aa"}
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {completedSteps}/{totalSteps}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
