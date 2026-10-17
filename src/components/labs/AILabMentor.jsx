// src/components/labs/AILabMentor.jsx
/**
 * CyberPath — Global AI Assistant & AI Lab Mentor
 *
 * Single, reusable, site-wide AI Assistant that provides:
 * - Persistent floating bottom-right launcher with pulse / badge
 * - Open, close, minimize, and restore controls
 * - Responsive desktop floating window and mobile sheet layout
 * - Dark UI aesthetic with cyan/blue accents and readable typography
 * - Context-aware quick action pills (lab-specific when in a lab, page-specific across site)
 * - Safe text & markdown rendering with syntax-styled code blocks and copy buttons
 * - "New Chat" action to reset conversation
 * - In-memory session persistence across route navigation
 * - Rate-limit and authentication banners with retry support
 */

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Sparkles,
  X,
  Minus,
  Maximize2,
  Send,
  RefreshCw,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Lightbulb,
  Bug,
  BookOpen,
  ShieldCheck,
  Compass,
  HelpCircle,
} from "lucide-react";
import { useAIAssistant } from "../../context/AIAssistantContext";
import { resolveLabConfig } from "../../lib/aiLabConfig";

// Mode icon mapping
const MODE_ICONS = {
  hint: Lightbulb,
  explain: BookOpen,
  debug: Bug,
  remediation: ShieldCheck,
  chat: Compass,
};

/**
 * Safe markdown & code renderer.
 * Safely parses code blocks, inline code, bold, bullets, and paragraphs WITHOUT innerHTML or eval.
 */
function SafeMarkdownRenderer({ content }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const copyToClipboard = async (text, idx) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (_e) {
      // ignore clipboard write failure
    }
  };

  // Split into code block chunks and text chunks
  const chunks = useMemo(() => {
    const result = [];
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({
          type: "text",
          content: content.substring(lastIndex, match.index),
        });
      }
      result.push({
        type: "code",
        lang: match[1] || "text",
        code: match[2].trimEnd(),
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      result.push({
        type: "text",
        content: content.substring(lastIndex),
      });
    }

    return result;
  }, [content]);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed break-words font-sans select-text">
      {chunks.map((chunk, idx) => {
        if (chunk.type === "code") {
          const isCopied = copiedIndex === idx;
          return (
            <div
              key={idx}
              className="my-2 rounded-lg overflow-hidden border border-white/12 bg-black/60 shadow-inner"
            >
              <div className="flex items-center justify-between px-3 py-1.5 bg-white/[0.04] border-b border-white/8 text-[11px] font-mono text-muted">
                <span>{chunk.lang || "code"}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(chunk.code, idx)}
                  className="flex items-center gap-1 hover:text-fg transition-colors cursor-pointer"
                  aria-label="Copy code to clipboard"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-[10px]">Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 text-[12px] font-mono overflow-x-auto text-emerald-300">
                <code>{chunk.code}</code>
              </pre>
            </div>
          );
        }

        // Render plain text with inline code, bold, and list formatting
        const lines = chunk.content.split("\n");
        return (
          <div key={idx} className="space-y-1">
            {lines.map((line, lIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lIdx} className="h-1" />;

              const isBullet = trimmed.startsWith("- ") || trimmed.startsWith("* ");
              const textContent = isBullet ? trimmed.substring(2) : line;

              // Parse inline tokens: `code` and **bold**
              const parts = textContent.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

              const parsedLine = parts.map((part, pIdx) => {
                if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
                  return (
                    <code
                      key={pIdx}
                      className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-accent font-mono text-[11px]"
                    >
                      {part.slice(1, -1)}
                    </code>
                  );
                }
                if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
                  return (
                    <strong key={pIdx} className="font-semibold text-fg">
                      {part.slice(2, -2)}
                    </strong>
                  );
                }
                return part;
              });

              if (isBullet) {
                return (
                  <div key={lIdx} className="flex items-start gap-2 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                    <span className="flex-1">{parsedLine}</span>
                  </div>
                );
              }

              return <p key={lIdx}>{parsedLine}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function AILabMentor() {
  const {
    isOpen,
    setIsOpen,
    isMinimized,
    openAssistant,
    closeAssistant,
    minimizeAssistant,
    restoreAssistant,
    activeLabContext,
    pageContext,
    messages,
    isLoading,
    errorState,
    sendMessage,
    retryLastMessage,
    clearChat,
  } = useAIAssistant();

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Determine active context metadata
  const labConfig = useMemo(
    () => (activeLabContext?.labId ? resolveLabConfig(activeLabContext.labId) : null),
    [activeLabContext]
  );

  const displayTitle = useMemo(() => {
    if (activeLabContext?.labTitle) return activeLabContext.labTitle;
    if (labConfig?.title) return labConfig.title;
    if (pageContext?.title) return pageContext.title;
    return "CyberPath AI Assistant";
  }, [activeLabContext, labConfig, pageContext]);

  const displayBadge = useMemo(() => {
    if (labConfig?.shortName) return labConfig.shortName;
    if (pageContext?.badge) return pageContext.badge;
    return "Assistant";
  }, [labConfig, pageContext]);

  // Contextual quick actions (lab quick actions if in lab, else page context quick actions)
  const quickActions = useMemo(() => {
    if (labConfig?.quickActions?.length) {
      return labConfig.quickActions;
    }
    if (pageContext?.quickActions?.length) {
      return pageContext.quickActions;
    }
    return [
      { mode: "chat", label: "What is Ethical Hacking?", prompt: "What is ethical hacking and what are the fundamentals?" },
      { mode: "chat", label: "Where to start?", prompt: "Where should an absolute beginner start on CyberPath?" },
      { mode: "chat", label: "Explain CIA Triad", prompt: "Explain the CIA Triad (Confidentiality, Integrity, Availability) in simple terms." },
    ];
  }, [labConfig, pageContext]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      const timer = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isMinimized]);

  // Submit message
  const handleSend = (textOverride, modeOverride) => {
    const text = (textOverride || inputMessage).trim();
    if (!text || isLoading) return;

    sendMessage(text, modeOverride);
    setInputMessage("");
  };

  // Keyboard shortcut: Shift+Enter for newline, Enter to submit
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === "Escape") {
      closeAssistant();
    }
  };

  return (
    <>
      {/* ── Floating Launcher Trigger (When closed) ── */}
      {!isOpen && (
        <aside
          aria-label="AI Assistant Trigger"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 animate-fade-in"
        >
          <button
            type="button"
            onClick={openAssistant}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-accent to-emerald-400 text-on-accent shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20 font-medium text-xs sm:text-sm cursor-pointer"
            aria-label="Open CyberPath AI Assistant"
            title="Ask CyberPath AI Assistant for concepts, hints, or guidance"
          >
            <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
            <span className="font-semibold tracking-wide">
              {activeLabContext ? "AI Mentor" : "AI Assistant"}
            </span>
            <span className="hidden sm:inline text-[11px] opacity-90 px-1.5 py-0.5 rounded-full bg-black/20">
              {displayBadge}
            </span>
          </button>
        </aside>
      )}

      {/* ── Minimized Floating Bar ── */}
      {isOpen && isMinimized && (
        <aside
          aria-label="Minimized AI Assistant"
          className="fixed bottom-5 right-5 z-40 animate-slide-up"
        >
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface/95 backdrop-blur-md border border-white/12 shadow-2xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-fg">{displayTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-accent/20 text-accent uppercase">
                {displayBadge}
              </span>
            </div>
            <div className="flex items-center gap-1 border-l border-white/10 pl-2">
              <button
                type="button"
                onClick={restoreAssistant}
                className="p-1 rounded-md text-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer"
                aria-label="Expand AI Assistant"
                title="Expand Assistant"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={closeAssistant}
                className="p-1 rounded-md text-muted hover:text-fg hover:bg-raised transition-colors cursor-pointer"
                aria-label="Close AI Assistant"
                title="Close Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* ── Main Chat Floating Window (Desktop & Mobile) ── */}
      {isOpen && !isMinimized && (
        <section
          role="dialog"
          aria-label="CyberPath AI Assistant"
          className="fixed inset-x-2 bottom-2 top-14 sm:inset-auto sm:bottom-5 sm:right-5 sm:w-[430px] sm:h-[600px] max-h-[calc(100vh-4.5rem)] z-50 flex flex-col rounded-2xl bg-surface/98 backdrop-blur-2xl border border-white/12 shadow-2xl overflow-hidden animate-slide-up"
        >
          {/* Header */}
          <header className="px-4 py-3 border-b border-white/10 bg-white/[0.02] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-semibold text-fg truncate">
                    {activeLabContext ? "AI Lab Mentor" : "CyberPath Assistant"}
                  </h2>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-accent/20 text-accent font-medium">
                    {displayBadge}
                  </span>
                </div>
                <p className="text-[10px] text-muted truncate">
                  {activeLabContext
                    ? `Step ${activeLabContext.currentStep || 1} of ${activeLabContext.totalSteps || 4} · ${displayTitle}`
                    : displayTitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* New Chat Button */}
              <button
                type="button"
                onClick={clearChat}
                className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Start new conversation"
                title="Start new conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Minimize Button */}
              <button
                type="button"
                onClick={minimizeAssistant}
                className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Minimize assistant chat"
                title="Minimize chat"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeAssistant}
                className="p-1.5 rounded-lg text-muted hover:text-fg hover:bg-white/[0.06] transition-colors cursor-pointer"
                aria-label="Close assistant chat"
                title="Close chat"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Quick Actions Pills Bar */}
          <div className="px-3 py-2 border-b border-white/8 bg-white/[0.01] shrink-0 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {quickActions.map((action, i) => {
              const Icon = MODE_ICONS[action.mode] || HelpCircle;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSend(action.prompt, action.mode)}
                  disabled={isLoading}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-all border shrink-0 bg-white/[0.03] border-white/10 text-muted hover:text-fg hover:bg-white/[0.08] hover:border-white/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  title={action.prompt}
                >
                  <Icon className="w-3 h-3 text-accent shrink-0" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>

          {/* Messages Scrollable Area */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3.5 focus:outline-none"
            tabIndex={0}
            aria-live="polite"
          >
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[10px] mt-0.5 border ${
                      isUser
                        ? "bg-white/10 border-white/20 text-fg"
                        : "bg-accent/20 border-accent/40 text-accent font-semibold"
                    }`}
                  >
                    {isUser ? "You" : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-sm text-xs sm:text-sm ${
                      isUser
                        ? "bg-gradient-to-br from-accent/25 to-accent/10 border border-accent/40 text-fg rounded-tr-none"
                        : "bg-white/[0.05] border border-white/10 text-fg/90 rounded-tl-none"
                    }`}
                  >
                    <SafeMarkdownRenderer content={msg.content} />
                    <div
                      className={`text-[9px] mt-1.5 flex items-center gap-1.5 opacity-60 font-mono ${
                        isUser ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {msg.mode && msg.mode !== "intro" && (
                        <span>· {msg.mode}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 animate-pulse">
                <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/40 flex items-center justify-center text-accent mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="rounded-xl px-3.5 py-2.5 bg-white/[0.04] border border-white/10 text-xs text-muted flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span>AI Assistant is typing...</span>
                </div>
              </div>
            )}

            {/* Error Notification with Retry or Sign-In */}
            {errorState && (
              <div
                role="alert"
                className={`p-3 rounded-xl border text-xs flex flex-col gap-2 ${
                  errorState.isRateLimit
                    ? "bg-amber-950/40 border-amber-500/30 text-amber-200"
                    : "bg-red-950/40 border-red-500/30 text-red-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <strong className="block font-semibold">
                      {errorState.isRateLimit ? "Rate Limit Notice" : "Assistant Notice"}
                    </strong>
                    <p className="mt-0.5 leading-relaxed">{errorState.message}</p>
                  </div>
                </div>
                {errorState.isAuthError ? (
                  <div className="flex justify-end pt-1">
                    <a
                      href="/login"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-on-accent text-xs font-semibold hover:brightness-110 transition-all cursor-pointer shadow-sm"
                    >
                      <span>Sign In to CyberPath</span>
                    </a>
                  </div>
                ) : errorState.retryablePayload && (
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={retryLastMessage}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-fg text-xs font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Controls Footer */}
          <footer className="p-3 border-t border-white/10 bg-white/[0.02] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex flex-col gap-2"
            >
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeLabContext
                      ? `Ask a question about ${labConfig?.shortName || "this lab"}... (Shift+Enter for newline)`
                      : "Ask anything about cybersecurity or CyberPath... (Shift+Enter for newline)"
                  }
                  maxLength={2000}
                  rows={2}
                  disabled={isLoading}
                  className="w-full resize-none rounded-xl bg-black/40 border border-white/12 px-3 py-2 text-xs sm:text-sm text-fg placeholder:text-muted/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all disabled:opacity-50"
                  aria-label="Your question for AI Assistant"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px]">
                    {inputMessage.length}/2000
                  </span>
                  <span className="hidden sm:inline text-muted/60">· Shift+Enter for newline</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isLoading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-accent text-on-accent font-medium hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs shadow-sm cursor-pointer"
                    aria-label="Send message"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </form>
          </footer>
        </section>
      )}
    </>
  );
}
