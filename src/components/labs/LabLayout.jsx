/**
 * LabLayout — Shared page wrapper for all CyberPath lab pages.
 * Provides consistent header (breadcrumb, exit button), progress bar, responsive layout,
 * and a reusable AI Lab Mentor integration point.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, FlaskConical, Sparkles, X, BrainCircuit, ExternalLink } from "lucide-react";
import LabProgressIndicator from "./LabProgressIndicator";

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
  const [mentorDrawerOpen, setMentorDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/12 bg-page/90 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
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
            onClick={() => setMentorDrawerOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
              mentorDrawerOpen
                ? "bg-accent text-on-accent border-accent shadow-sm"
                : "bg-surface hover:bg-raised text-muted hover:text-fg border-white/12 hover:border-white/28"
            }`}
            title="AI Lab Mentor — Contextual guidance integration slot"
            aria-label="Toggle AI Lab Mentor panel"
            aria-expanded={mentorDrawerOpen}
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

      {/* ── Reusable AI Lab Mentor Integration Drawer / Panel Slot ── */}
      {mentorDrawerOpen && (
        <aside
          role="complementary"
          aria-label="AI Lab Mentor Panel"
          className="fixed top-14 right-0 bottom-0 w-full sm:w-96 border-l border-white/12 bg-surface/98 backdrop-blur-xl z-50 p-6 flex flex-col shadow-2xl transition-all animate-page-enter"
        >
          <div className="flex items-center justify-between pb-4 border-b border-white/12">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/12 flex items-center justify-center">
                <BrainCircuit className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-fg">AI Lab Mentor</h3>
                <span className="text-[10px] font-mono text-muted uppercase">Framework Integration Slot</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setMentorDrawerOpen(false)}
              className="p-1 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors"
              aria-label="Close AI Mentor panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 space-y-4">
            {mentorSlot ? (
              // Dedicated injected mentor component if provided by future integration
              mentorSlot
            ) : (
              // Standardized, non-simulated architecture slot with live lab context binding
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-page border border-white/12 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-mono text-muted pb-1 border-b border-white/5">
                    <span>BOUND LAB CONTEXT</span>
                    <span className="text-success font-semibold">Active Ready</span>
                  </div>
                  <div>
                    <span className="text-muted block font-sans">Lab ID:</span>
                    <code className="text-accent font-mono">{mentorContext?.labId || title || "lab-session"}</code>
                  </div>
                  {mentorContext?.topic && (
                    <div>
                      <span className="text-muted block font-sans">Topic:</span>
                      <code className="text-fg font-mono">{mentorContext.topic}</code>
                    </div>
                  )}
                  <div>
                    <span className="text-muted block font-sans">Challenge Stage:</span>
                    <span className="text-fg font-medium">
                      Step {mentorContext?.currentStep || currentStep || 1} of {mentorContext?.totalSteps || totalSteps || 4}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/12 space-y-2 text-xs text-muted leading-relaxed">
                  <strong className="text-fg block">Architecture Status:</strong>
                  <p>
                    This panel serves as the universal integration point for the upcoming AI Lab Mentor.
                    In compliance with security standards, all client-side context (lab ID, topic, current step,
                    and learning objectives) is prepared for secure server-side proxy dispatch without exposing
                    frontend API credentials or executing arbitrary code.
                  </p>
                </div>

                {mentorContext?.learningObjectives && mentorContext.learningObjectives.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono text-muted uppercase tracking-wider block">
                      Target Objectives:
                    </span>
                    <ul className="space-y-1 text-xs text-muted">
                      {mentorContext.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/12 text-center text-[11px] text-muted">
            CyberPath Mentor Architecture · Zero Client-Side Keys
          </div>
        </aside>
      )}
    </div>
  );
}

