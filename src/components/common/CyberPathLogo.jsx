import React from "react";
import logoImg from "../../assets/cyberpath-logo.png";

/**
 * CyberPath Brand Logo Component
 *
 * @param {Object} props
 * @param {"icon"|"full"} [props.variant="icon"] - Whether to show just the shield emblem or full wordmark
 * @param {"xs"|"sm"|"md"|"lg"|"xl"} [props.size="sm"] - Sizing preset
 * @param {boolean} [props.glow=false] - Whether to apply ambient brand glow
 * @param {string} [props.className=""] - Additional custom classes
 */
export function CyberPathLogo({
  variant = "icon",
  size = "sm",
  glow = false,
  className = "",
  alt = "CyberPath Logo",
}) {
  const sizeMap = {
    xs: {
      container: "w-6 h-6",
      text: "text-sm",
      subtext: "text-[9px]",
    },
    sm: {
      container: "w-8 h-8",
      text: "text-base",
      subtext: "text-[10px]",
    },
    md: {
      container: "w-10 h-10",
      text: "text-lg",
      subtext: "text-[11px]",
    },
    lg: {
      container: "w-14 h-14",
      text: "text-2xl",
      subtext: "text-xs",
    },
    xl: {
      container: "w-20 h-20",
      text: "text-3xl",
      subtext: "text-sm",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  if (variant === "full") {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div
          className={`relative shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/15 flex items-center justify-center p-0.5 ${
            currentSize.container
          } ${glow ? "shadow-[0_0_20px_rgba(59,130,246,0.35)]" : "shadow-sm"}`}
        >
          <img
            src={logoImg}
            alt={alt}
            className="w-full h-full object-cover scale-110 drop-shadow-md rounded-lg"
            loading="eager"
          />
        </div>
        <div className="flex flex-col text-left leading-none">
          <span className={`font-bold tracking-tight text-white flex items-center ${currentSize.text}`}>
            Cyber<span className="text-blue-400">Path</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-pulse" />
          </span>
          <span className={`text-[#888] font-mono tracking-wider font-semibold mt-0.5 ${currentSize.subtext}`}>
            LEARN • PRACTICE • BUILD
          </span>
        </div>
      </div>
    );
  }

  // Icon only
  return (
    <div
      className={`relative shrink-0 rounded-xl overflow-hidden bg-black/40 border border-white/15 flex items-center justify-center p-0.5 transition-transform duration-200 group-hover:scale-105 ${
        currentSize.container
      } ${glow ? "shadow-[0_0_25px_rgba(59,130,246,0.4)]" : "shadow-sm"} ${className}`}
    >
      <img
        src={logoImg}
        alt={alt}
        className="w-full h-full object-cover scale-110 drop-shadow-md rounded-lg"
        loading="eager"
      />
    </div>
  );
}

export default CyberPathLogo;
