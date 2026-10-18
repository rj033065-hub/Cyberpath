// src/lib/aiMentorClient.js
/**
 * Frontend client for CyberPath AI Lab Mentor Edge Function.
 *
 * Security & Architecture Rules:
 * 1. This client calls ONLY the secure Supabase Edge Function `ai-lab-mentor`.
 * 2. It NEVER calls OpenRouter directly.
 * 3. It attaches the active Supabase JWT session token.
 * 4. It does not handle or store any API keys in client-side code.
 * 5. It does NOT use fake/mock responses to hide backend or auth errors.
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
 * Sends a request to the AI Mentor Edge Function.
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

  const baseUrl = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  // Direct fetch to edge function endpoint for exact HTTP status codes and headers
  if (baseUrl) {
    const endpoint = isGuest
      ? `${baseUrl}/functions/v1/ai-lab-mentor?mode=guest`
      : `${baseUrl}/functions/v1/ai-lab-mentor`;

    const requestHeaders = {
      "Content-Type": "application/json",
      ...(anonKey ? { apikey: anonKey } : {}),
    };

    if (session?.access_token) {
      requestHeaders["Authorization"] = `Bearer ${session.access_token}`;
    }

    try {
      const response = await fetch(endpoint, {
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
            ? "AI Mentor service is currently unconfigured. Missing server-side credentials."
            : response.status === 404
            ? "AI Lab Mentor Edge Function is not deployed yet. Please deploy the function to your Supabase project."
            : `AI mentor request failed (status ${response.status})`);

        const err = new Error(errorMessage);
        err.status = response.status;
        err.retryAfter = errJson?.retry_after;
        err.isRateLimit = response.status === 429;
        err.isAuthError = response.status === 401;
        throw err;
      }

      const result = await response.json();
      if (!result?.content) {
        throw new Error("Received an unexpected empty response from the AI Lab Mentor.");
      }
      return result;
    } catch (networkErr) {
      if (networkErr.status) throw networkErr; // Rethrow parsed HTTP errors
      // Fallback to supabase.functions.invoke below
    }
  }

  // Fallback invocation via Supabase client functions wrapper
  try {
    const { data, error } = await supabase.functions.invoke("ai-lab-mentor", {
      body: payload,
    });

    if (error) {
      const status = error?.status || error?.context?.status || 500;
      let msg = error.message || "Failed to reach AI Lab Mentor";

      if (error?.context && typeof error.context.json === "function") {
        try {
          const detail = await error.context.json();
          if (detail?.error) msg = detail.error;
        } catch (_e) {
          // ignore
        }
      }

      const e = new Error(msg);
      e.status = status;
      e.isRateLimit = status === 429;
      e.isAuthError = status === 401;
      throw e;
    }

    if (!data?.content) {
      throw new Error("Received an empty response from AI Lab Mentor.");
    }
    return data;
  } catch (err) {
    if (err.status) throw err;
    const connectErr = new Error(
      "Unable to connect to AI Lab Mentor Edge Function. Please verify your connection or ensure the function is deployed."
    );
    connectErr.status = 503;
    throw connectErr;
  }
}
