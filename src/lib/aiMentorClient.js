// src/lib/aiMentorClient.js
/**
 * Frontend client for CyberPath AI Lab Mentor Edge Function.
 *
 * Security & Architecture Rules:
 * 1. This client calls the secure Supabase Edge Function `ai-lab-mentor`.
 * 2. It NEVER calls OpenRouter directly.
 * 3. It attaches the active Supabase JWT session token.
 * 4. It supports seamless local practice/demo sessions without breaking offline learning.
 * 5. It does not handle or store any API keys in client-side code.
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
 * Canonical educational responses for local practice/demo sessions.
 */
const DEMO_RESPONSES = {
  "sqli-basics": {
    explain: `### SQL Injection (SQLi) Fundamentals

**SQL Injection** occurs when untrusted user input is directly concatenated into a dynamic SQL query string instead of being treated strictly as literal data.

In this lab, the vulnerable backend query constructs SQL like this:
\`\`\`sql
SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}';
\`\`\`

When a user submits:
\`\`\`text
' OR '1'='1
\`\`\`
The single quote closes the username string literal early, and the injected \`OR '1'='1\` alters the query logic. The database evaluates:
\`\`\`sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '...';
\`\`\`
Because \`'1'='1'\` is always **TRUE**, the entire \`WHERE\` condition evaluates to true, resulting in authentication bypass!

**The Golden Rule**: Never concatenate user input directly into executable SQL statements.`,

    hint: `💡 **Incremental Hint**:
Look closely at the query structure in Task 1. The input values are wrapped in single quotation marks (\`'...'\`).
- What happens if your input contains a single quote (\`'\`)?
- What logical operator (\`OR\`) can you add so the query condition is always true?`,

    debug: `🔍 **Reasoning Analysis**:
When testing your login bypass payload:
1. Did you balance or close the opening quote correctly?
2. Did you test \`' OR '1'='1\`?
3. In the simulated panel, observe the **Constructed Query** box to see how your characters manipulate the SQL syntax.`,

    remediation: `🛡️ **Defensive Remediation**:
The industry-standard mitigation is **Parameterized Queries (Prepared Statements)**:
\`\`\`javascript
// SECURE: Prepared Statement with Parameter Binding
const sql = "SELECT id, username, role FROM users WHERE username = ? AND password = ?";
const [rows] = await db.execute(sql, [username, hashedPassword]);
\`\`\`
With parameterization, the SQL database compiles the query structure *before* inserting user data. The user input is treated strictly as literal data values and cannot alter the SQL syntax.`,
  },
  "xss-playground": {
    explain: `### Cross-Site Scripting (XSS) Explained

**XSS** occurs when an application includes untrusted user input directly in an HTML document without proper contextual encoding or sanitization.

- **Reflected XSS**: The payload is sent in a request (like a search query) and immediately reflected in the response page.
- **Stored XSS**: The payload is stored in the database (like comments or bio) and served to other users later.
- **DOM-based XSS**: Client-side JavaScript reads an untrusted source (like \`location.hash\`) and writes it directly to an unsafe DOM sink (like \`element.innerHTML\`).`,

    hint: `💡 **Incremental Hint**:
Inspect where your text is rendered. Is it being assigned to an unsafe sink like \`innerHTML\` or safely written to \`textContent\`?
Try entering a simple markup tag like \`<b>test</b>\` or an image tag with an onerror handler: \`<img src="x" onerror="console.log(1)">\`.`,

    debug: `🔍 **Reasoning Analysis**:
If your payload displays as plain text on the screen, the application is using safe text nodes (like React JSX \`{value}\` or \`textContent\`).
If the browser actually parses and renders the HTML elements, you are dealing with an unsafe rendering sink.`,

    remediation: `🛡️ **Defensive Remediation**:
1. **Context-Aware Output Encoding**: Convert characters like \`<\`, \`>\`, \`&\`, \`"\`, and \`'\` into HTML entities (\`&lt;\`, \`&gt;\`, etc.).
2. **Use Safe APIs**: Use \`element.textContent\` instead of \`element.innerHTML\`.
3. **HTML Sanitization**: If rich HTML must be supported, sanitize using a proven library like **DOMPurify**.
4. **Content Security Policy (CSP)**: Deploy a strong CSP header (\`script-src 'self'\`) to restrict unauthorized script execution.`,
  },
  "idor-investigation": {
    explain: `### Insecure Direct Object References (IDOR)

**IDOR** is an access control vulnerability that arises when an application uses client-provided input to access objects directly without server-side authorization checks.

For example, an API endpoint like:
\`\`\`http
GET /api/documents/1002
\`\`\`
takes the ID \`1002\` directly. If the server only looks up \`SELECT * FROM documents WHERE id = 1002\` without checking \`WHERE owner_id = current_user.id\`, any authenticated student can read any other student's private documents simply by changing the ID!`,

    hint: `💡 **Incremental Hint**:
Jordan Kim's user ID is 1001. Look at the record IDs available (1001 to 1004).
Notice what happens when you request document 1002 in the vulnerable panel vs the secure panel. Which check was missing?`,

    debug: `🔍 **Reasoning Analysis**:
Remember that possession of an ID is NOT proof of permission. Even if a user knows or guesses document ID 1002, the server must still perform an authorization check before returning data.`,

    remediation: `🛡️ **Defensive Remediation**:
Always enforce authorization server-side for every request:
\`\`\`javascript
// SECURE: Always verify ownership on the server
const doc = await db.query(
  "SELECT * FROM documents WHERE id = ? AND owner_id = ?",
  [documentId, req.user.id]
);
if (!doc) {
  return res.status(403).json({ error: "Access Denied" });
}
\`\`\``,
  },
  "auth-checkpoint": {
    explain: `### Authentication & Session Security

Authentication verifies *identity* ("who you are"). Secure authentication requires defense-in-depth across the entire lifecycle:
1. **Password Storage**: Must use slow, salted cryptographic hashes like Argon2id or bcrypt.
2. **Rate Limiting**: Prevent brute-force password guessing by throttling failed login attempts.
3. **Session Lifecycles**: Enforce idle timeouts, absolute expirations, and server-side token invalidation on logout.
4. **Server Authorization**: Never trust client-side claims like \`isAdmin: true\` in localStorage.`,

    hint: `💡 **Incremental Hint**:
Look at the four audit scenarios. Pay attention to what happens when an attacker automates thousands of requests. What server-side control is missing to stop brute-force attempts?`,

    debug: `🔍 **Reasoning Analysis**:
Disabling a button in the browser (client-side) does NOT stop an attacker because they can send HTTP requests directly to the API using cURL or Python. All rate limits and security checks must be enforced by the server.`,

    remediation: `🛡️ **Defensive Remediation**:
Implement server-side rate limiting and robust password hashing:
\`\`\`javascript
// SECURE: Server-side attempt throttling with exponential backoff
const attempts = await checkRateLimit(req.ip, req.body.email);
if (attempts > 5) {
  return res.status(429).json({ error: "Too many failed attempts. Try again in 15 minutes." });
}
\`\`\``,
  },
};

/**
 * Sends a request to the AI Lab Mentor.
 *
 * @param {Object} params
 * @param {string} params.labId            - The stable lab identifier (e.g. "sqli-basics").
 * @param {"hint"|"explain"|"debug"|"remediation"} params.mode   - Desired tutoring mode.
 * @param {string} params.message         - The user's question.
 * @param {Array<{role:string,content:string}>} [params.history] - Recent conversation (max 10).
 * @returns {Promise<{role:string,content:string}>} The assistant reply.
 */
export async function callAiMentor({ labId, mode, message, history = [] }) {
  const effectiveMode = mode || "hint";

  // 1. Check for active Supabase session
  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data?.session || null;
  } catch (_e) {
    // ignore
  }

  // 2. Check for local demo session if Supabase session is not found
  let isDemoSession = false;
  if (!session || !session.access_token) {
    const demoRaw = typeof localStorage !== "undefined" ? localStorage.getItem("cyberpath_demo_session") : null;
    if (demoRaw) {
      try {
        const parsed = JSON.parse(demoRaw);
        if (parsed?.session) {
          session = parsed.session;
          isDemoSession = true;
        }
      } catch (_e) {
        // ignore
      }
    }
  }

  // If student has a demo session or offline practice mode, provide instant local response
  if (isDemoSession || (session && session.access_token === "demo-token")) {
    const labResp = DEMO_RESPONSES[labId] || DEMO_RESPONSES["sqli-basics"];
    const content = labResp[effectiveMode] || labResp.explain;
    return {
      role: "assistant",
      content: `${content}\n\n*(Demo Practice Session · Connect Supabase for Live Edge AI)*`,
    };
  }

  // If strictly unauthenticated (no session at all), prompt to sign in
  if (!session || !session.access_token) {
    const authErr = new Error("Authentication required. Please sign in to your CyberPath account to ask the AI Lab Mentor.");
    authErr.status = 401;
    authErr.isAuthError = true;
    throw authErr;
  }

  const payload = {
    labId,
    mode: effectiveMode,
    message: String(message || "").trim(),
    history: Array.isArray(history) ? history.slice(-10) : [],
  };

  const baseUrl = getSupabaseUrl();

  // Try direct fetch to edge function endpoint
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
          // ignore
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
    }
  }

  // Fallback to supabase.functions.invoke
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

    // If edge function is not deployed yet or unreachable, gracefully return educational response
    const labResp = DEMO_RESPONSES[labId] || DEMO_RESPONSES["sqli-basics"];
    const fallbackContent = labResp[effectiveMode] || labResp.explain;
    return {
      role: "assistant",
      content: `${fallbackContent}\n\n*(Note: Edge Function is currently connecting or offline; showing local curriculum guidance)*`,
    };
  }
}
