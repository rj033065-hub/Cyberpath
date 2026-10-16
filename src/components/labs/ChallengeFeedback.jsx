/**
 * ChallengeFeedback — Inline success / error state banner.
 * type: "success" | "error" | "info"
 */
import { CheckCircle2, XCircle, Info } from "lucide-react";

const STYLES = {
  success: {
    wrapper: "border-white/12 bg-white/[0.04]",
    icon: <CheckCircle2 className="w-5 h-5 text-success shrink-0" />,
    title: "text-success",
    body: "text-fg",
  },
  error: {
    wrapper: "border-danger/30 bg-white/[0.04]",
    icon: <XCircle className="w-5 h-5 text-danger shrink-0" />,
    title: "text-danger",
    body: "text-fg",
  },
  info: {
    wrapper: "border-white/12 bg-white/[0.06]",
    icon: <Info className="w-5 h-5 text-accent shrink-0" />,
    title: "text-accent",
    body: "text-fg",
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
