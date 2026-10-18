// api/lib/rateLimiter.js
/**
 * Server-side rate limiting and abuse prevention.
 * Supports durable Upstash Redis / Vercel KV REST API with safe in-memory fallback.
 */

// In-memory sliding window fallback map: identifier -> array of timestamps
export const memoryRateLimitMap = new Map();

/**
 * Extracts a sanitized client IP from request headers.
 */
export function getClientIp(req) {
  const getHeader = (name) => {
    if (typeof req?.headers?.get === "function") {
      return req.headers.get(name) || req.headers.get(name.toLowerCase());
    }
    return (
      req?.headers?.[name] ||
      req?.headers?.[name.toLowerCase()] ||
      req?.headers?.[name.toUpperCase()] ||
      null
    );
  };

  const forwarded = getHeader("x-forwarded-for");
  if (forwarded && typeof forwarded === "string") {
    // Only trust the first (client) IP in the forwarded chain
    const clientIp = forwarded.split(",")[0].trim();
    if (clientIp) return clientIp;
  }

  const cfIp = getHeader("cf-connecting-ip");
  if (cfIp && typeof cfIp === "string") return cfIp.trim();

  const realIp = getHeader("x-real-ip");
  if (realIp && typeof realIp === "string") return realIp.trim();

  return req?.socket?.remoteAddress || req?.ip || "guest_client";
}

/**
 * Upstash Redis / Vercel KV REST pipeline executor.
 */
async function checkUpstashRateLimit(url, token, key, limit, windowSeconds) {
  try {
    const endpoint = `${url.replace(/\/+$/, "")}/pipeline`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, windowSeconds, "NX"],
      ]),
    });

    if (!res.ok) {
      throw new Error(`Upstash returned HTTP ${res.status}`);
    }

    const json = await res.json();
    const count = Number(json?.[0]?.result || 1);
    return {
      allowed: count <= limit,
      current: count,
      limit,
    };
  } catch (err) {
    // Fail safely: report error so fallback handles it
    return null;
  }
}

/**
 * Enforces rate limiting for guest or authenticated identity.
 *
 * @param {object} params
 * @param {boolean} params.isGuest - True for guest requests, false for authenticated
 * @param {string} params.identifier - Client IP (for guests) or User ID (for authenticated)
 * @returns {Promise<{ allowed: boolean, error?: string, retryAfter?: number }>}
 */
export async function enforceRateLimit({ isGuest, identifier }) {
  const maxPerMinute = isGuest ? 3 : 5;
  const maxPerDay = isGuest ? 20 : 100;

  const redisUrl =
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL;
  const redisToken =
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN;

  // 1. Check durable Redis / KV if configured
  if (redisUrl && redisToken) {
    const minuteKey = `rl:${isGuest ? "guest" : "auth"}:${identifier}:min`;
    const dayKey = `rl:${isGuest ? "guest" : "auth"}:${identifier}:day`;

    const minuteResult = await checkUpstashRateLimit(redisUrl, redisToken, minuteKey, maxPerMinute, 60);
    const dayResult = await checkUpstashRateLimit(redisUrl, redisToken, dayKey, maxPerDay, 86400);

    if (minuteResult !== null && dayResult !== null) {
      if (!minuteResult.allowed) {
        return {
          allowed: false,
          error: isGuest
            ? "Guest rate limit reached (3 requests/min). Please wait a moment or sign in for higher limits."
            : "Request rate limit reached (5 requests/min). Please wait a moment.",
          retryAfter: 60,
        };
      }
      if (!dayResult.allowed) {
        return {
          allowed: false,
          error: isGuest
            ? "Daily guest message limit reached (20 requests/day). Please sign in to continue chatting with the assistant."
            : "Daily message limit reached. Please return tomorrow.",
          retryAfter: 86400,
        };
      }
      return { allowed: true };
    }
    // If Redis pipeline failed, fail safely into defensive in-memory sliding window
  }

  // 2. Sliding window memory implementation (Fallback / Development)
  const now = Date.now();
  const oneMinuteAgo = now - 60 * 1000;
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const rateKey = `${isGuest ? "guest" : "auth"}:${identifier}`;
  let timestamps = memoryRateLimitMap.get(rateKey) || [];
  timestamps = timestamps.filter((t) => t > oneDayAgo);

  const minuteCount = timestamps.filter((t) => t > oneMinuteAgo).length;
  if (minuteCount >= maxPerMinute) {
    return {
      allowed: false,
      error: isGuest
        ? "Guest rate limit reached (3 requests/min). Please wait a moment or sign in for higher limits."
        : "Rate limit reached (5 requests/min). Please wait a moment.",
      retryAfter: 60,
    };
  }

  if (timestamps.length >= maxPerDay) {
    return {
      allowed: false,
      error: isGuest
        ? "Daily guest message limit reached (20 requests/day). Please sign in to continue chatting with the assistant."
        : "Daily message limit reached. Please check back tomorrow.",
      retryAfter: 86400,
    };
  }

  timestamps.push(now);
  memoryRateLimitMap.set(rateKey, timestamps);

  // Periodic cleanup if memory map grows large
  if (memoryRateLimitMap.size > 5000) {
    for (const [key, list] of memoryRateLimitMap.entries()) {
      if (list.every((t) => t <= oneDayAgo)) {
        memoryRateLimitMap.delete(key);
      }
    }
  }

  return { allowed: true };
}
