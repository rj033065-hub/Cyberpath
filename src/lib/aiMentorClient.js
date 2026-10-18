// src/lib/aiMentorClient.js
/**
 * Frontend client for CyberPath AI Assistant (Vercel Serverless API + Google Gemini).
 *
 * Security & Architecture Rules:
 * 1. This client calls the serverless endpoint `/api/chat` powered by Google Gemini.
 * 2. It attaches the active Supabase JWT session token when logged in.
 * 3. It NEVER accesses or stores Gemini API keys in client-side code.
 * 4. It does NOT use fake/mock responses to hide backend or auth errors.
 * 5. Legacy Supabase Edge Function remains as a secondary fallback if needed.
 */

import { supabase } from "./supabase";

/**
 * Resolves the Supabase URL across Vite browser environments and Node test runners.
 */
function getSupabaseUrl() {
  const envUrl =
    (typeof import.meta !== "undefined" && import.meta?.env?.VITE_SUPABASE_URL) ||
    (typeof process !== "undefined" && process?.env?.VITE_SUPABASE_URL) ||
    "";
  if (envUrl && !envUrl.includes("placeholder") && !envUrl.includes("your-project-ref")) {
    return envUrl.replace(/\/+$/, "");
  }
  return "";
}

/**
 * Resolves the Supabase Anon / Publishable Key across environments.
 */
function getSupabaseAnonKey() {
  return (
    (typeof import.meta !== "undefined" &&
      (import.meta?.env?.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta?.env?.VITE_SUPABASE_ANON_KEY)) ||
    (typeof process !== "undefined" &&
      (process?.env?.VITE_SUPABASE_PUBLISHABLE_KEY || process?.env?.VITE_SUPABASE_ANON_KEY)) ||
    ""
  );
}

/**
 * Sends a request to the CyberPath AI Assistant (/api/chat).
 *
 * @param {Object} params
 * @param {string} [params.labId]         - Optional stable lab identifier (e.g. "sqli-basics").
 * @param {string} [params.pageContext]   - Optional page context (e.g. "home", "roadmaps", "dashboard").
 * @param {"hint"|"explain"|"debug"|"remediation"|"chat"} [params.mode] - Desired tutoring mode.
 * @param {string} params.message         - The user's question.
 * @param {Array<{role:string,content:string}>} [params.history] - Recent conversation (max 10).
 * @returns {Promise<{role:string,content:string}>} The assistant reply.
 */
export async function callAiMentor({ labId, pageContext, mode, message, history = [] }) {
  const effectiveMode = mode || "chat";

  // 1. Check for active Supabase session
  const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
  const isGuest = !session?.access_token;

  // If attempting to access an interactive practice lab without signing in
  if (isGuest && labId) {
    const authErr = new Error("Interactive lab mentoring requires signing in to CyberPath.");
    authErr.status = 401;
    authErr.isAuthError = true;
    throw authErr;
  }

  const payload = {
    ...(labId ? { labId } : {}),
    ...(pageContext ? { pageContext } : {}),
    mode: effectiveMode,
    message: String(message || "").trim(),
    history: Array.isArray(history) ? history.slice(isGuest ? -4 : -10) : [],
    ...(isGuest ? { guest: true } : {}),
  };

  // Primary: Vercel Serverless API (/api/chat)
  // Uses relative path in browser environment (supported natively on Vercel and local Vite dev proxy)
  const isBrowser = typeof window !== "undefined";
  const apiUrl = isBrowser ? "/api/chat" : (process.env.APP_URL || "http://localhost:3000") + "/api/chat";

  const requestHeaders = {
    "Content-Type": "application/json",
  };

  if (session?.access_token) {
    requestHeaders["Authorization"] = `Bearer ${session.access_token}`;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errJson = null;
      try {
        errJson = await response.json();
      } catch (_e) {
        // ignore parsing error
      }

      const errorMessage =
        errJson?.error ||
        (response.status === 429
          ? "You've sent too many questions in a short period. Please wait a minute before trying again."
          : response.status === 401
          ? "Your session has expired or is invalid. Please sign in again."
          : response.status === 503
          ? "AI Assistant service is currently unconfigured. Missing server-side credentials."
          : response.status === 504
          ? "AI Assistant timed out waiting for a response. Please try again."
          : `AI Assistant request failed (status ${response.status})`);

      const err = new Error(errorMessage);
      err.status = response.status;
      err.retryAfter = errJson?.retry_after;
      err.isRateLimit = response.status === 429;
      err.isAuthError = response.status === 401;
      throw err;
    }

    const result = await response.json();
    if (!result?.content) {
      throw new Error("Received an unexpected empty response from the AI Assistant.");
    }
    return result;
  } catch (primaryErr) {
    // If it's a validated HTTP error (such as 401, 400, 429, 503), rethrow directly without masking
    if (primaryErr.status) throw primaryErr;

    // Secondary Legacy Fallback: Supabase Edge Function (if /api/chat is unreachable)
    const baseUrl = getSupabaseUrl();
    const anonKey = getSupabaseAnonKey();

    if (baseUrl) {
      try {
        const edgeEndpoint = isGuest
          ? `${baseUrl}/functions/v1/ai-lab-mentor?mode=guest`
          : `${baseUrl}/functions/v1/ai-lab-mentor`;

        const edgeHeaders = {
          "Content-Type": "application/json",
          ...(anonKey ? { apikey: anonKey } : {}),
        };
        if (session?.access_token) {
          edgeHeaders["Authorization"] = `Bearer ${session.access_token}`;
        }

        const edgeResp = await fetch(edgeEndpoint, {
          method: "POST",
          headers: edgeHeaders,
          body: JSON.stringify(payload),
        });

        if (edgeResp.ok) {
          const edgeData = await edgeResp.json();
          if (edgeData?.content) return edgeData;
        }
      } catch (_edgeErr) {
        // Fall through to final error
      }
    }

    const connectErr = new Error(
      "Unable to connect to CyberPath AI Assistant. Please verify your connection or ensure the endpoint is running."
    );
    connectErr.status = 503;
    throw connectErr;
  }
}
