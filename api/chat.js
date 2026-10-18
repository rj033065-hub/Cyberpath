// api/chat.js
/**
 * Vercel Serverless API Endpoint: /api/chat
 * Powered by Google Gemini and Supabase Authentication.
 *
 * Security & Architecture Rules:
 * 1. GEMINI_API_KEY is read exclusively on the server (never exposed to client).
 * 2. Authenticates students server-side via Supabase; guest requests follow strict limits.
 * 3. Never trusts client-supplied user IDs.
 * 4. Dual-compatible handler supporting Vercel Node runtime and Web Request/Response.
 */

import { GoogleGenAI } from "@google/genai";
import {
  buildSystemPrompt,
  validateRequestBody,
  ALLOWED_LABS,
  ALLOWED_PAGE_CONTEXTS,
} from "./lib/systemPrompts.js";
import { verifyRequestAuth } from "./lib/authVerifier.js";
import { enforceRateLimit, getClientIp } from "./lib/rateLimiter.js";

// CORS Headers for secure browser invocation
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info, x-cyberpath-guest",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Helper to parse request body across Node streams and Web Request objects.
 */
async function parseBody(req) {
  if (typeof req.json === "function") {
    try {
      return await req.json();
    } catch (_e) {
      return null;
    }
  }
  if (
    req.body &&
    typeof req.body === "object" &&
    typeof req.body.getReader !== "function" &&
    typeof req.body.pipe !== "function"
  ) {
    return req.body;
  }
  if (typeof req.text === "function") {
    try {
      const text = await req.text();
      return JSON.parse(text);
    } catch (_e) {
      return null;
    }
  }
  // Node IncomingMessage buffer stream
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 100000) {
        resolve(null); // Protection against massive payloads
      }
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch (_e) {
        resolve(null);
      }
    });
    req.on("error", () => resolve(null));
  });
}

/**
 * Unified response sender supporting both Node res and Web Response.
 */
function sendResponse(res, status, data, extraHeaders = {}) {
  const headers = { ...corsHeaders, "Content-Type": "application/json", ...extraHeaders };
  if (res && typeof res.status === "function" && typeof res.json === "function") {
    for (const [key, val] of Object.entries(headers)) {
      res.setHeader(key, val);
    }
    return res.status(status).json(data);
  }
  // Standard Web Response
  return new Response(JSON.stringify(data), {
    status,
    headers,
  });
}

/**
 * Executes Gemini completion with a strict timeout.
 */
async function generateGeminiCompletion(ai, modelName, contents, config, timeoutMs = 15000) {
  let timeoutId;
  const timeoutPromise = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error("Gemini API request timed out.");
      err.name = "TimeoutError";
      reject(err);
    }, timeoutMs);
  });

  try {
    const callPromise = ai.models.generateContent({
      model: modelName,
      contents,
      config,
    });
    const result = await Promise.race([callPromise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Main Handler for /api/chat
 */
export default async function handler(req, res) {
  const method = req.method || (req instanceof Request ? req.method : "GET");

  // 1. CORS Preflight
  if (method === "OPTIONS") {
    if (res && typeof res.status === "function") {
      for (const [key, val] of Object.entries(corsHeaders)) {
        res.setHeader(key, val);
      }
      return res.status(200).end();
    }
    return new Response("ok", { headers: corsHeaders });
  }

  // 2. HTTP Method Validation
  if (method !== "POST") {
    return sendResponse(res, 405, { error: "Method not allowed. Use POST." });
  }

  // 3. Parse JSON Request Body
  const rawBody = await parseBody(req);
  if (!rawBody || typeof rawBody !== "object") {
    return sendResponse(res, 400, { error: "Invalid JSON in request body." });
  }

  // 4. Authenticate Request Server-Side (Distinguish Guest from Authenticated)
  const authState = await verifyRequestAuth(req, rawBody);
  if (!authState.isValid) {
    return sendResponse(res, 401, {
      error: authState.error || "Invalid or expired session. Please sign in again.",
    });
  }

  const { isGuest, userId } = authState;

  // 5. Validate Body Payload with Appropriate Security Policy
  const validation = validateRequestBody(rawBody, isGuest);
  if (!validation.valid || !validation.data) {
    return sendResponse(res, 400, { error: validation.error });
  }

  const { labId, pageContext, mode, message, history = [] } = validation.data;

  // 6. Enforce Server-Side Rate Limiting
  const clientIdentifier = isGuest ? getClientIp(req) : userId;
  const rateLimitResult = await enforceRateLimit({ isGuest, identifier: clientIdentifier });

  if (!rateLimitResult.allowed) {
    return sendResponse(
      res,
      429,
      {
        error: rateLimitResult.error,
        retry_after: rateLimitResult.retryAfter,
      },
      { "Retry-After": String(rateLimitResult.retryAfter || 60) }
    );
  }

  // 7. Validate Gemini API Key Server-Side
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey || geminiApiKey.trim().length === 0) {
    return sendResponse(res, 503, {
      error: "AI Assistant service is currently unconfigured. Missing server-side credentials.",
    });
  }

  // 8. Assemble Server-Controlled System Prompt & Gemini Contents
  const systemPrompt = buildSystemPrompt(labId, pageContext, mode, isGuest);

  const formattedContents = [
    ...history.map((h) => ({
      role: h.role === "assistant" ? "model" : "user",
      parts: [{ text: h.content }],
    })),
    {
      role: "user",
      parts: [{ text: message }],
    },
  ];

  const geminiConfig = {
    systemInstruction: systemPrompt,
    maxOutputTokens: isGuest ? 350 : 600,
    temperature: 0.6,
  };

  const configuredModel = process.env.GEMINI_MODEL || "gemini-3.5-flash";
  const modelChain = Array.from(
    new Set([configuredModel, "gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.8-flash"])
  );

  // 9. Call Google Gemini via official @google/genai SDK
  try {
    const ai = new GoogleGenAI({ apiKey: geminiApiKey });
    let response = null;
    let lastError = null;

    for (const modelToTry of modelChain) {
      try {
        response = await generateGeminiCompletion(
          ai,
          modelToTry,
          formattedContents,
          geminiConfig,
          25000
        );
        if (response) break;
      } catch (err) {
        lastError = err;
        const isModelUnavailable =
          err.status === 404 ||
          err.message?.includes("not found") ||
          err.message?.includes("NOT_FOUND") ||
          err.message?.includes("is no longer available") ||
          err.message?.includes("is not supported");

        if (isModelUnavailable) {
          // Model unavailable or deprecated, continue to next fallback candidate
          continue;
        } else {
          // Rate limit, timeout, or auth issue: break early and throw
          throw err;
        }
      }
    }

    if (!response && lastError) {
      throw lastError;
    }

    const replyText = response?.text || response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText || typeof replyText !== "string") {
      return sendResponse(res, 502, {
        error: "Empty or unrecognized response structure from AI provider.",
      });
    }

    return sendResponse(res, 200, {
      role: "assistant",
      content: replyText.trim(),
    });
  } catch (err) {
    console.error("[CyberPath AI /api/chat error]:", err?.status, err?.message || err);

    if (err?.name === "TimeoutError") {
      return sendResponse(res, 504, {
        error: "CyberPath AI Assistant timed out waiting for a response. Please try again.",
      });
    }

    // Rate limit / high load detection from provider
    const isRateLimit =
      err?.status === 429 ||
      err?.message?.includes("RESOURCE_EXHAUSTED") ||
      err?.message?.includes("429") ||
      err?.message?.includes("quota");

    if (isRateLimit) {
      return sendResponse(res, 429, {
        error: "The AI service is experiencing high load. Please try again in a few moments.",
      });
    }

    // Return safe, sanitized error message without leaking secrets or stack traces
    return sendResponse(res, 502, {
      error: "CyberPath AI Assistant encountered an upstream service error. Please try again later.",
    });
  }
}
