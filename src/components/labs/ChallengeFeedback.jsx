/**
 * ChallengeFeedback — Inline success / error state banner.
 * type: "success" | "error" | "info"
 */
import { CheckCircle2, XCircle, Info } from "lucide-react";

const STYLES = {
  success: {
    wrapper: "border-[#3fb950]/30 bg-[#3fb950]/8",
    icon: <CheckCircle2 className="w-5 h-5 text-[#3fb950] shrink-0" />,
    title: "text-[#3fb950]",
    body: "text-[#c9d1d9]",
  },
  error: {
    wrapper: "border-[#f85149]/30 bg-[#f85149]/8",
    icon: <XCircle className="w-5 h-5 text-[#f85149] shrink-0" />,
    title: "text-[#f85149]",
    body: "text-[#c9d1d9]",
  },
  info: {
    wrapper: "border-[#2f81f7]/30 bg-[#2f81f7]/8",
    icon: <Info className="w-5 h-5 text-[#58a6ff] shrink-0" />,
    title: "text-[#58a6ff]",
    body: "text-[#c9d1d9]",
  },
};

export default function ChallengeFeedback({ type = "info", title, message }) {
  const s = STYLES[type] || STYLES.info;
  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 mb-4 ${s.wrapper}`}>
      {s.icon}
      <div>
        {title && <p className={`text-sm font-semibold mb-0.5 ${s.title}`}>{title}</p>}
        {message && <p className={`text-sm leading-relaxed ${s.body}`}>{message}</p>}
      </div>
    </div>
  );
}
