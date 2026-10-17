// src/lib/aiMentorClient.js
/**
 * Frontend client for CyberPath AI Lab Mentor Edge Function.
 *
 * Security & Architecture Rules:
 * 1. This client calls ONLY the secure Supabase Edge Function `ai-lab-mentor`.
 * 2. It NEVER calls OpenRouter directly.
 * 3. It attaches the active Supabase JWT session token.
 * 4. It does not handle or store any API keys in client-side code.
 */

import { supabase, isSupabaseConfigured } from "./supabase";

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
 * Sends a request to the AI Lab Mentor Edge Function.
 *
 * @param {Object} params
 * @param {string} params.labId            - The stable lab identifier (e.g. "sqli-basics").
 * @param {"hint"|"explain"|"debug"|"remediation"} params.mode   - Desired tutoring mode.
 * @param {string} params.message         - The user's question.
 * @param {Array<{role:string,content:string}>} [params.history] - Recent conversation (max 10).
 * @returns {Promise<{role:string,content:string}>} The assistant reply.
 */
export async function callAiMentor({ labId, mode, message, history = [] }) {
  // 1. Check for active Supabase session
  const { data: { session }, error: sessErr } = await supabase.auth.getSession();

  if (sessErr || !session || !session.access_token) {
    const authErr = new Error("Authentication required. Please sign in to your CyberPath account to ask the AI Lab Mentor.");
    authErr.status = 401;
    authErr.isAuthError = true;
    throw authErr;
  }

  const payload = {
    labId,
    mode: mode || "hint",
    message: String(message || "").trim(),
    history: Array.isArray(history) ? history.slice(-10) : [],
  };

  const baseUrl = getSupabaseUrl();

  // Try direct fetch to edge function endpoint first for fine-grained HTTP status codes
  if (baseUrl) {
    const endpoint = `${baseUrl}/functions/v1/ai-lab-mentor`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
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
            ? "Your session has expired. Please sign in again."
            : response.status === 503
            ? "The AI Lab Mentor service is temporarily unconfigured or unavailable."
            : `AI mentor request failed (status ${response.status})`);

        const err = new Error(errorMessage);
        err.status = response.status;
        err.retryAfter = errJson?.retry_after;
        err.isRateLimit = response.status === 429;
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

  // Fallback to supabase.functions.invoke if direct fetch failed
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
      throw e;
    }

    if (!data?.content) {
      throw new Error("Received an empty response from AI Lab Mentor.");
    }
    return data;
  } catch (err) {
    if (err.status) throw err;
    const fallbackErr = new Error(
      isSupabaseConfigured
        ? "Unable to connect to AI Lab Mentor. Please check your internet connection and try again."
        : "Live AI Lab Mentor is disabled in local demo mode. Configure your Supabase project credentials to enable it."
    );
    fallbackErr.status = 503;
    throw fallbackErr;
  }
}
