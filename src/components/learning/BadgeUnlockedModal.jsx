import { Award, Crown, Flame, ShieldCheck, Globe, Terminal, Network, Compass, Sparkles, X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

export default function BadgeUnlockedModal({ badge, onClose }) {
  if (!badge) return null;

  const Icon = ICON_MAP[badge.iconName] || Award;
  const isMaster = badge.slug === "cyberpath-master";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl border border-[#2f81f7]/50 bg-[#111821] p-6 text-center shadow-2xl shadow-[#2f81f7]/20 space-y-5 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#8b98a8] hover:text-[#f0f6fc] hover:bg-[#16202e] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Emitted Aura */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full blur-xl opacity-60 ${
              isMaster ? "bg-[#d29922]" : "bg-[#2f81f7]"
            }`}
          />
          <div
            className={`relative w-20 h-20 rounded-2xl border flex items-center justify-center shadow-lg ${
              isMaster
                ? "bg-gradient-to-br from-[#d29922]/30 to-[#111821] border-[#d29922] text-[#f2cc60]"
                : "bg-gradient-to-br from-[#2f81f7]/30 to-[#111821] border-[#2f81f7] text-[#58a6ff]"
            }`}
          >
            <Icon className="w-10 h-10" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#2f81f7]/30 bg-[#2f81f7]/10 text-[#58a6ff] text-[11px] font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VERIFIED CREDENTIAL UNLOCKED</span>
          </div>

          <h3 className="text-xl font-extrabold text-[#f0f6fc]">
            {badge.name}
          </h3>

          <p className="text-xs text-[#8b98a8] leading-relaxed max-w-sm mx-auto">
            {badge.description}
          </p>
        </div>

        {/* Security verification stamp */}
        <div className="p-3 rounded-xl border border-[#21262d] bg-[#0d1117] text-[11px] font-mono text-[#8b98a8] flex items-center justify-between">
          <span>STATUS: AUTHENTICATED</span>
          <span className="text-[#3fb950] font-semibold">SAVED TO SUPABASE</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#21262d] bg-[#16202e] hover:bg-[#1f2d40] text-xs font-semibold text-[#f0f6fc] transition-colors"
          >
            Keep Learning
          </button>
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-xs font-semibold text-white shadow-sm shadow-[#2f81f7]/25 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
