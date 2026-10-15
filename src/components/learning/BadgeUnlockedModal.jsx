import { Sparkles, X, ArrowRight, Download } from "lucide-react";
import { Link } from "react-router-dom";
import BadgeEmblem from "../badges/BadgeEmblem";
import { downloadBadgePng } from "../badges/badgeProgressHelper";

export default function BadgeUnlockedModal({ badge, onClose, studentName = "Student Researcher" }) {
  if (!badge) return null;

  const isMaster = badge.slug === "cyberpath-master";

  const handleDownload = () => {
    downloadBadgePng(badge, new Date().toISOString(), studentName);
  };

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

        {/* Custom SVG Emblem Showcase with Scale-In & Ring Burst */}
        <div className="relative mx-auto flex items-center justify-center py-2">
          <BadgeEmblem
            badge={badge}
            state="earned"
            isNewUnlock={true}
            size={130}
            showProgressRing={true}
          />
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

        {/* Security verification stamp & Download action */}
        <div className="flex flex-col gap-2">
          <div className="p-3 rounded-xl border border-[#21262d] bg-[#0d1117] text-[11px] font-mono text-[#8b98a8] flex items-center justify-between">
            <span>STATUS: AUTHENTICATED</span>
            <span className="text-[#3fb950] font-semibold">SAVED TO SUPABASE</span>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            className="w-full py-2.5 px-4 rounded-xl border border-[#21262d] bg-[#16202e] hover:bg-[#1f2d40] text-xs font-semibold text-[#f0f6fc] flex items-center justify-center gap-2 transition-colors shadow-sm active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>Download High-Resolution PNG Credential</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
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
