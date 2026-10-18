// api/lib/authVerifier.js
/**
 * Server-side authentication verification using Supabase.
 * Strictly verifies JWT tokens against Supabase Auth without trusting client IDs.
 */

import { createClient } from "@supabase/supabase-js";

function getEnv(key) {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key];
  }
  return undefined;
}

const DEFAULT_SUPABASE_URL = "https://wpuavcfraqvjelxgtbnb.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_XV1mgnJ_iuFgR2MzS7zhFw_1lLOKf2y";

/**
 * Verifies the incoming HTTP request's authentication state.
 *
 * @param {object} req - Incoming HTTP request (Express-like or web Request)
 * @param {object} [parsedBody] - Parsed request body
 * @returns {Promise<{ isGuest: boolean, isValid: boolean, userId: string, error?: string }>}
 */
export async function verifyRequestAuth(req, parsedBody = null) {
  const supabaseUrl =
    getEnv("SUPABASE_URL") ||
    getEnv("VITE_SUPABASE_URL") ||
    DEFAULT_SUPABASE_URL;

  const supabaseAnonKey =
    getEnv("SUPABASE_ANON_KEY") ||
    getEnv("VITE_SUPABASE_ANON_KEY") ||
    getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
    DEFAULT_SUPABASE_KEY;

  const supabasePublishableKey =
    getEnv("VITE_SUPABASE_PUBLISHABLE_KEY") ||
    getEnv("SUPABASE_PUBLISHABLE_KEY") ||
    DEFAULT_SUPABASE_KEY;

  // Extract URL & headers across Node and Web Request interfaces
  const urlString = req.url || "";
  const requestUrl = new URL(urlString, "http://localhost");

  const getHeader = (name) => {
    if (typeof req.headers?.get === "function") {
      return req.headers.get(name) || req.headers.get(name.toLowerCase());
    }
    return (
      req.headers?.[name] ||
      req.headers?.[name.toLowerCase()] ||
      req.headers?.[name.toUpperCase()] ||
      null
    );
  };

  const isGuestFlag =
    requestUrl.pathname.endsWith("/guest") ||
    requestUrl.searchParams.get("mode") === "guest" ||
    getHeader("x-cyberpath-guest") === "true" ||
    Boolean(parsedBody && typeof parsedBody === "object" && parsedBody.guest === true);

  const authHeader = getHeader("Authorization") || getHeader("authorization");

  const isPublicKey = (t) =>
    !t ||
    t === supabaseAnonKey ||
    t === supabasePublishableKey ||
    t.startsWith("sb_publishable_");

  // If explicit guest or no Bearer token provided, treat as unauthenticated guest
  if (isGuestFlag || !authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      isGuest: true,
      isValid: true,
      userId: "guest_visitor",
    };
  }

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();

  // If token is just the public/anon key, treat as guest
  if (isPublicKey(token)) {
    return {
      isGuest: true,
      isValid: true,
      userId: "guest_visitor",
    };
  }

  // Token is present and not the public key: verify with Supabase server-side
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: userData, error: userError } = await supabase.auth.getUser(token);

    if (userError || !userData?.user) {
      return {
        isGuest: false,
        isValid: false,
        userId: null,
        error: "Invalid or expired session. Please sign in again.",
      };
    }

    return {
      isGuest: false,
      isValid: true,
      userId: userData.user.id, // Strictly derived from verified server session
    };
  } catch (err) {
    return {
      isGuest: false,
      isValid: false,
      userId: null,
      error: "Authentication service encountered an unexpected error.",
    };
  }
}
