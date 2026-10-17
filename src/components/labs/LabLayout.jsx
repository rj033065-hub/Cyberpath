/**
 * LabLayout — Shared page wrapper for all CyberPath lab pages.
 * Provides consistent header (breadcrumb, exit button), progress bar, responsive layout,
 * and integrated CyberPath AI Lab Mentor with floating bottom-right launcher.
 */
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FlaskConical, Sparkles } from "lucide-react";
import LabProgressIndicator from "./LabProgressIndicator";
import { useAIAssistant } from "../../context/AIAssistantContext";

function resolveLabId(mentorContext, title) {
  if (mentorContext?.labId) return mentorContext.labId;
  const t = (title || "").toLowerCase();
  if (t.includes("sql")) return "sqli-basics";
  if (t.includes("xss")) return "xss-playground";
  if (t.includes("idor")) return "idor-investigation";
  if (t.includes("auth")) return "auth-checkpoint";
  return "sqli-basics";
}

export default function LabLayout({
  title,
  category,
  difficulty = "Beginner",
  estimatedTime,
  totalSteps,
  currentStep,
  mentorContext,
  mentorSlot,
  children,
}) {
  const { isOpen, toggleAssistant, setLabContext, clearLabContext } = useAIAssistant();

  const labId = useMemo(
    () => resolveLabId(mentorContext, title),
    [mentorContext, title]
  );

  // Register lab context with the global assistant while mounted
  useEffect(() => {
    setLabContext({
      labId,
      currentStep: mentorContext?.currentStep || currentStep || 1,
      totalSteps: mentorContext?.totalSteps || totalSteps || 4,
      labTitle: title,
    });

    return () => {
      clearLabContext();
    };
  }, [labId, mentorContext, currentStep, totalSteps, title, setLabContext, clearLabContext]);

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/12 bg-page/90 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/labs"
            className="flex items-center gap-1.5 text-muted hover:text-fg text-sm transition-colors shrink-0"
            aria-label="Return to labs catalog"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Labs</span>
          </Link>
          <span className="text-faint text-sm hidden sm:inline" aria-hidden="true">/</span>
          <div className="flex items-center gap-2 min-w-0">
            <FlaskConical className="w-4 h-4 text-accent shrink-0" />
            <span className="text-sm font-medium text-fg truncate">{title}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {category && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/[0.06] border border-white/12 text-accent">
              {category}
            </span>
          )}
          <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-raised text-muted">
            {difficulty}
          </span>
          {estimatedTime && (
            <span className="text-xs text-muted hidden lg:inline">~{estimatedTime}</span>
          )}

          {/* AI Lab Mentor Reusable Entry Point Trigger */}
          <button
            type="button"
            onClick={toggleAssistant}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all cursor-pointer ${
              isOpen
                ? "bg-accent text-on-accent border-accent shadow-sm"
                : "bg-surface hover:bg-raised text-muted hover:text-fg border-white/12 hover:border-white/28"
            }`}
            title="AI Lab Mentor — Ask for hints, concepts, or defense explanations"
            aria-label="Toggle AI Lab Mentor panel"
            aria-expanded={isOpen}
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-muted hover:text-fg text-xs border border-white/12 hover:border-white/28 px-2.5 py-1 rounded-md transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </div>
      </header>

      {/* Progress indicator */}
      {totalSteps && currentStep !== undefined && (
        <div className="border-b border-white/12 bg-page">
          <LabProgressIndicator total={totalSteps} current={currentStep} />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      {/* Optional custom mentor slot if explicitly provided */}
      {mentorSlot}
    </div>
  );
}
