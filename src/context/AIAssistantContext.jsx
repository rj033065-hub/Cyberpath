// src/context/AIAssistantContext.jsx
/**
 * Global AI Assistant Context for CyberPath.
 *
 * Provides a single, unified site-wide assistant state across the entire platform:
 * - Preserves conversation history across page navigation during the session
 * - Detects route changes and provides trusted, server-validated pageContext
 * - Tracks active lab context when entering interactive security labs
 * - Controls floating launcher visibility (open, close, minimize, restore)
 * - Exposes actions: sendMessage, retryLastMessage, clearChat, setLabContext, clearLabContext
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { callAiMentor } from "../lib/aiMentorClient";
import { resolvePageContext, resolveLabConfig } from "../lib/aiLabConfig";

const AIAssistantContext = createContext(null);

export function AIAssistantProvider({ children }) {
  const location = useLocation();

  // Window State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Active Lab Context (set dynamically by LabLayout when learner enters a lab)
  // Format: { labId: string, currentStep: number, totalSteps: number, labTitle: string } | null
  const [activeLabContext, setActiveLabContext] = useState(null);

  // Resolved Page Context based on current route
  const pageContext = useMemo(() => resolvePageContext(location.pathname), [location.pathname]);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // Helper to construct initial greeting message
  const createGreeting = useCallback((labCtx, pageCtx) => {
    if (labCtx?.labTitle || labCtx?.labId) {
      const cfg = resolveLabConfig(labCtx.labId);
      const title = labCtx.labTitle || cfg?.title || "Security Lab";
      return {
        id: `greeting-${Date.now()}`,
        role: "assistant",
        mode: "intro",
        content: `Hello! 👋 I am your **CyberPath AI Lab Mentor** for **${title}**.\n\nI can provide progressive hints, debug your reasoning, or explain defensive secure coding fixes without spoiling the solution. What would you like to explore?`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
    }

    return {
      id: `greeting-${Date.now()}`,
      role: "assistant",
      mode: "intro",
      content: `Hello! 👋 Welcome to **CyberPath**.\n\nI am your site-wide AI Assistant. I can help you understand cybersecurity concepts, choose learning paths, explain XP & badges, or guide you through hands-on labs.\n\nWhat would you like to learn today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  }, []);

  // In-memory conversation messages (persists across route changes during session)
  const [messages, setMessages] = useState(() => [createGreeting(null, pageContext)]);

  // Clean lab context on navigating away from /labs/:id
  useEffect(() => {
    if (!location.pathname.startsWith("/labs/")) {
      setActiveLabContext(null);
    }
  }, [location.pathname]);

  // Open / Close / Minimize handlers
  const openAssistant = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleAssistant = useCallback(() => {
    setIsOpen((prev) => !prev);
    setIsMinimized(false);
  }, []);

  const minimizeAssistant = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restoreAssistant = useCallback(() => {
    setIsMinimized(false);
  }, []);

  // Register and clear lab context
  const setLabContext = useCallback((ctx) => {
    setActiveLabContext(ctx);
  }, []);

  const clearLabContext = useCallback(() => {
    setActiveLabContext(null);
  }, []);

  // "New Chat" reset action
  const clearChat = useCallback(() => {
    setMessages([createGreeting(activeLabContext, pageContext)]);
    setErrorState(null);
  }, [activeLabContext, pageContext, createGreeting]);

  // Send user message
  const sendMessage = useCallback(
    async (textToSend, modeOverride) => {
      const text = String(textToSend || "").trim();
      if (!text || isLoading) return;

      const effectiveMode = modeOverride || (activeLabContext ? "hint" : "chat");

      const userMsg = {
        id: `u-${Date.now()}`,
        role: "user",
        mode: effectiveMode,
        content: text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setErrorState(null);

      // Build recent history (last 10 messages)
      const historyPayload = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-9)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const response = await callAiMentor({
          labId: activeLabContext?.labId || undefined,
          pageContext: !activeLabContext ? pageContext?.id : undefined,
          mode: effectiveMode,
          message: text,
          history: historyPayload,
        });

        const assistantMsg = {
          id: `a-${Date.now()}`,
          role: "assistant",
          mode: effectiveMode,
          content: response.content,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const isRateLimit = err?.status === 429 || err?.isRateLimit;
        const isAuthError = err?.status === 401 || err?.isAuthError;

        setErrorState({
          message: err.message || "Failed to reach AI Assistant.",
          isRateLimit,
          isAuthError,
          retryablePayload: { text, mode: effectiveMode },
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, activeLabContext, pageContext, messages]
  );

  // Retry previous failed request
  const retryLastMessage = useCallback(() => {
    if (!errorState?.retryablePayload) return;
    const { text, mode } = errorState.retryablePayload;
    setErrorState(null);
    sendMessage(text, mode);
  }, [errorState, sendMessage]);

  const value = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      isMinimized,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      minimizeAssistant,
      restoreAssistant,
      activeLabContext,
      setLabContext,
      clearLabContext,
      pageContext,
      messages,
      isLoading,
      errorState,
      sendMessage,
      retryLastMessage,
      clearChat,
    }),
    [
      isOpen,
      isMinimized,
      openAssistant,
      closeAssistant,
      toggleAssistant,
      minimizeAssistant,
      restoreAssistant,
      activeLabContext,
      setLabContext,
      clearLabContext,
      pageContext,
      messages,
      isLoading,
      errorState,
      sendMessage,
      retryLastMessage,
      clearChat,
    ]
  );

  return (
    <AIAssistantContext.Provider value={value}>
      {children}
    </AIAssistantContext.Provider>
  );
}

export function useAIAssistant() {
  const context = useContext(AIAssistantContext);
  if (!context) {
    throw new Error("useAIAssistant must be used within an AIAssistantProvider");
  }
  return context;
}
