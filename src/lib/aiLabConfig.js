// src/lib/aiLabConfig.js
/**
 * Configuration and metadata for CyberPath AI Lab Mentor.
 * Maps lab IDs to platform metadata and defines tutoring modes and starter quick actions.
 */

export const AI_LAB_CONFIG = {
  "sqli-basics": {
    id: "sqli-basics",
    title: "SQL Injection Fundamentals",
    category: "Web Security & Injection",
    shortName: "SQLi",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a small hint for this step without giving away the answer?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain how SQL injection works and why string concatenation is dangerous." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "I am trying to reason through this query. How should I analyze what the SQL engine does?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "How do parameterized queries / prepared statements stop this vulnerability?" },
    ],
  },
  "xss-playground": {
    id: "xss-playground",
    title: "Cross-Site Scripting Playground",
    category: "Web Security & Injection",
    shortName: "XSS",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "What should I look for in the DOM sink to find the vulnerability?" },
      { mode: "explain", label: "Explain Concept", prompt: "What is the difference between Reflected, Stored, and DOM XSS?" },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Why does my payload not execute or what makes an HTML sink vulnerable?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "What are the recommended defenses against XSS (encoding, sanitization, CSP)?" },
    ],
  },
  "idor-investigation": {
    id: "idor-investigation",
    title: "IDOR Investigation",
    category: "Access Control",
    shortName: "IDOR",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a hint on identifying the object reference and owner ID?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain Insecure Direct Object References in plain beginner language." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Why is knowing a record ID not the same as having authorization to view it?" },
      { mode: "remediation", label: "Explain the Defense", prompt: "How should a backend enforce object-level authorization properly?" },
    ],
  },
  "auth-checkpoint": {
    id: "auth-checkpoint",
    title: "Authentication Checkpoint",
    category: "Authentication & Session Management",
    shortName: "Auth",
    quickActions: [
      { mode: "hint", label: "Get a Hint", prompt: "Can you give me a hint on what control is missing in this authentication scenario?" },
      { mode: "explain", label: "Explain Concept", prompt: "Explain why rate limiting and password hashing are critical for authentication." },
      { mode: "debug", label: "Debug My Reasoning", prompt: "Help me analyze why client-side authorization checks fail to protect sensitive routes." },
      { mode: "remediation", label: "Explain the Defense", prompt: "What is the proper way to handle session invalidation and rate limiting?" },
    ],
  },
};

// Aliases for route slugs or legacy abbreviations
export const LAB_SLUG_ALIASES = {
  "sqli": "sqli-basics",
  "sqli-basics": "sqli-basics",
  "xss": "xss-playground",
  "xss-playground": "xss-playground",
  "idor": "idor-investigation",
  "idor-investigation": "idor-investigation",
  "auth": "auth-checkpoint",
  "auth-checkpoint": "auth-checkpoint",
};

/**
 * Resolves a route slug or lab name to a verified lab configuration.
 */
export function resolveLabConfig(slugOrId) {
  if (!slugOrId) return null;
  const canonicalId = LAB_SLUG_ALIASES[slugOrId] || slugOrId;
  return AI_LAB_CONFIG[canonicalId] || null;
}

/**
 * Helper to resolve the current route slug to the mentor labId.
 */
export function resolveLabIdFromSlug(slug) {
  const cfg = resolveLabConfig(slug);
  return cfg ? cfg.id : undefined;
}
