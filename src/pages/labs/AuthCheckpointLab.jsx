/**
 * Lab 4: Authentication Checkpoint
 * Route: /labs/auth-checkpoint
 *
 * SECURITY CONTRACT:
 * - All scenarios use fictional, static data — no real authentication flows are modified.
 * - No real user accounts, sessions, or tokens are read or written.
 * - The simulated states are controlled by local React state only.
 */
import { useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import LabLayout from "../../components/labs/LabLayout";
import MissionBriefing from "../../components/labs/MissionBriefing";
import LabInstructions from "../../components/labs/LabInstructions";
import SimulatedTarget from "../../components/labs/SimulatedTarget";
import HintPanel from "../../components/labs/HintPanel";
import ChallengeFeedback from "../../components/labs/ChallengeFeedback";
import KnowledgeCheck from "../../components/labs/KnowledgeCheck";
import LabCompletionSummary from "../../components/labs/LabCompletionSummary";
import { markLabStarted, markLabComplete, recordHintUsed } from "../../lib/labService";
import { CheckCircle2, XCircle, AlertTriangle, Shield, Clock } from "lucide-react";

const TOTAL_STEPS = 5;

const HINTS = [
  "Read each scenario carefully and look for what security control is absent or incorrectly implemented.",
  "Session expiration is about invalidating tokens after a set time, not just logging the user out client-side.",
  "Rate limiting protects against brute-force. It should be implemented on the server, not by disabling the login button in the browser.",
  "A secure logout must invalidate the server-side session. Clearing a cookie client-side is not enough if the token remains valid on the server.",
  "Password storage security is about making offline cracking hard. bcrypt, scrypt, and Argon2 are slow by design.",
];

// ── Scenario 1: Spot the weaknesses ─────────────────────────────────────────
const AUTH_SCENARIOS = [
  {
    id: "weak-passwords",
    title: "Scenario A — Weak Password Policy",
    description: "The TrainingApp login accepts passwords of any length and has no minimum complexity requirement. User 'admin' has the password '123456'.",
    vulnerabilities: ["No minimum password length", "No complexity requirement", "Predictable admin password"],
    fix: "Enforce minimum length (≥12 chars), require character variety, and check against common password lists. Use bcrypt/Argon2 for storage — never MD5 or SHA1 without salt.",
    severity: "high",
  },
  {
    id: "no-rate-limit",
    title: "Scenario B — No Rate Limiting",
    description: "The login endpoint allows unlimited password attempts with no delay, lockout, or CAPTCHA. An attacker can try thousands of passwords per second.",
    vulnerabilities: ["No server-side rate limiting", "No account lockout policy", "No CAPTCHA after failed attempts"],
    fix: "Implement server-side rate limiting (e.g., 5 attempts per minute per IP+username). Use exponential backoff. Alert on suspicious patterns. CAPTCHA as an additional layer.",
    severity: "high",
  },
  {
    id: "session-expiry",
    title: "Scenario C — Missing Session Expiration",
    description: "After login, the session token never expires. An attacker who obtains a stolen token from 2 years ago can still use it to access the account.",
    vulnerabilities: ["No session expiration time", "No idle timeout", "No server-side invalidation on logout"],
    fix: "Set absolute session expiration (e.g., 24h) and idle timeout (e.g., 30 min). On logout, invalidate the token on the server — do not rely solely on clearing a cookie client-side.",
    severity: "high",
  },
  {
    id: "post-login-check",
    title: "Scenario D — Missing Post-Login Authorization Check",
    description: "After login, the app navigates to /admin/dashboard based on a client-side role flag (isAdmin: true) stored in localStorage. The server never re-validates the user's role.",
    vulnerabilities: ["Client-side role flag trusted by server", "No server-side authorization check per request", "localStorage is writable by any JS on the page"],
    fix: "Validate roles on the server for every protected request. Never trust client-submitted role flags, JWTs with unverified claims, or localStorage values as authorization evidence.",
    severity: "critical",
  },
];

export default function AuthCheckpointLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Scenario audit state
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [reviewedScenarios, setReviewedScenarios] = useState(new Set());

  // Simulated login rate-limit demo
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [rateLimited, setRateLimited] = useState(false);
  const [loginInput, setLoginInput] = useState("");

  const startLab = async () => {
    setStarted(true);
    if (user?.id) await markLabStarted(user.id, "auth-checkpoint");
  };

  const handleHintReveal = useCallback(async () => {
    if (user?.id) await recordHintUsed(user.id, "auth-checkpoint");
  }, [user?.id]);

  const handleScenarioToggle = (id) => {
    setExpandedScenario(expandedScenario === id ? null : id);
    setReviewedScenarios((prev) => new Set([...prev, id]));
  };

  const handleSimulatedLogin = (e) => {
    e.preventDefault();
    const next = loginAttempts + 1;
    setLoginAttempts(next);
    if (next >= 5) setRateLimited(true);
  };

  const handleComplete = async () => {
    if (!user?.id) return;
    const result = await markLabComplete(user.id, "auth-checkpoint");
    setXpAwarded(result.xpAwarded || 0);
    setCompleted(true);
  };

  const retry = () => {
    setExpandedScenario(null);
    setReviewedScenarios(new Set());
    setLoginAttempts(0); setRateLimited(false); setLoginInput("");
    setCurrentStep(1); setCompleted(false);
  };

  const allScenariosReviewed = reviewedScenarios.size >= AUTH_SCENARIOS.length;

  if (!started) {
    return (
      <LabLayout title="Authentication Checkpoint" category="Authentication" difficulty="Beginner" estimatedTime="25–30 min">
        <MissionBriefing
          mission="Audit a fictional authentication flow and identify security weaknesses across password policy, rate limiting, session management, and post-login authorization. Select correct security controls and receive explanations for each."
          objectives={[
            "Identify weak authentication decisions in fictional scenarios",
            "Understand server-side session validation and expiration",
            "Explain why rate limiting and brute-force defences are essential",
            "Describe secure password storage principles",
            "Understand why post-login authorization checks must happen server-side",
          ]}
          estimatedTime="25–30 minutes"
        />
        <div className="flex justify-center">
          <button onClick={startLab} className="px-6 py-3 rounded-lg bg-accent text-on-accent font-semibold hover:bg-accent-hover transition-colors">
            Begin Lab
          </button>
        </div>
      </LabLayout>
    );
  }

  if (completed) {
    return (
      <LabLayout title="Authentication Checkpoint" category="Authentication" difficulty="Beginner">
        <LabCompletionSummary
          labTitle="Authentication Checkpoint"
          xpAwarded={xpAwarded}
          skills={["Session management", "Rate limiting", "Password storage", "Post-login authorization", "Secure logout"]}
          nextLab={null}
          relatedLesson={{ href: "/learn/web-security/cookies-sessions-and-authentication", label: "Cookies, Sessions & Auth Lesson" }}
          onRetry={retry}
          isPracticeOnly
        />
      </LabLayout>
    );
  }

  return (
    <LabLayout
      title="Authentication Checkpoint"
      category="Authentication"
      difficulty="Beginner"
      estimatedTime="25–30 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
    >
      {/* ── Step 1: Overview ── */}
      {currentStep >= 1 && (
        <>
          <LabInstructions step={1} title="Authentication — Why it matters">
            <p>
              Authentication verifies <em>who you are</em>. Authorization verifies <em>what you may do</em>.
              Many real-world breaches exploit authentication weaknesses: weak passwords, missing rate
              limits, non-expiring sessions, or trusting client-side claims as proof of identity.
            </p>
            <p>In this lab you will audit four fictional scenarios and identify the security controls that are missing or incorrectly implemented.</p>

            <div className="mt-4 grid sm:grid-cols-2 gap-3">
              {[
                { icon: Shield, label: "Password Storage", desc: "bcrypt / Argon2 with unique salts" },
                { icon: AlertTriangle, label: "Rate Limiting", desc: "Server-side attempt throttling" },
                { icon: Clock, label: "Session Expiry", desc: "Absolute & idle timeout + server revocation" },
                { icon: CheckCircle2, label: "Post-Login AuthZ", desc: "Server validates role on every request" },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-2.5 p-3 rounded-lg border border-white/12 bg-page">
                  <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-fg">{label}</p>
                    <p className="text-xs text-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </LabInstructions>
          {currentStep === 1 && (
            <div className="flex justify-end mt-2 mb-8">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors">
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 2: Scenario Audit ── */}
      {currentStep >= 2 && (
        <>
          <LabInstructions step={2} title="Audit the Fictional Scenarios">
            <p>
              Expand each scenario below. For each one, review the described vulnerability, then
              read the recommended fix.
            </p>
          </LabInstructions>

          <div className="space-y-3 mb-6">
            {AUTH_SCENARIOS.map((s) => {
              const isOpen = expandedScenario === s.id;
              const isReviewed = reviewedScenarios.has(s.id);
              return (
                <div key={s.id} className={`rounded-xl border transition-colors ${isOpen ? "border-white/28" : isReviewed ? "border-white/12" : "border-white/12"} bg-page`}>
                  <button
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
                    onClick={() => handleScenarioToggle(s.id)}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-2">
                      {isReviewed ? (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      ) : (
                        <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${s.severity === "critical" ? "border-danger" : "border-warning"}`} />
                      )}
                      <span className="text-sm font-medium text-fg">{s.title}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${s.severity === "critical" ? "bg-white/[0.06] text-danger" : "bg-white/[0.06] text-warning"}`}>
                      {s.severity}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-white/12 pt-3 space-y-3">
                      <p className="text-sm text-fg">{s.description}</p>
                      <div>
                        <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-1.5">Vulnerabilities:</p>
                        <ul className="space-y-1">
                          {s.vulnerabilities.map((v, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-fg">
                              <XCircle className="w-3.5 h-3.5 text-danger shrink-0 mt-0.5" />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-lg border border-white/12 bg-white/[0.04] p-3">
                        <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1.5">Recommended Fix:</p>
                        <p className="text-xs text-fg">{s.fix}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {allScenariosReviewed && currentStep === 2 && (
            <>
              <ChallengeFeedback type="success" title="All Scenarios Reviewed" message="You've examined all four fictional authentication vulnerability scenarios." />
              <div className="flex justify-end mb-8">
                <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors">
                  Continue →
                </button>
              </div>
            </>
          )}
          {!allScenariosReviewed && currentStep === 2 && (
            <p className="text-xs text-muted italic mb-8">
              Expand and review all {AUTH_SCENARIOS.length} scenarios to continue ({reviewedScenarios.size}/{AUTH_SCENARIOS.length} done).
            </p>
          )}
        </>
      )}

      {/* ── Step 3: Rate Limit Simulation ── */}
      {currentStep >= 3 && (
        <>
          <LabInstructions step={3} title="Simulation — Rate Limiting Demo">
            <p>
              This fictional login form enforces a <strong>simulated server-side rate limit</strong>:
              after 5 failed attempts, the form is locked. In a real application, this limit would
              be enforced on the server and per IP+username to prevent client-side bypass.
            </p>
          </LabInstructions>

          <SimulatedTarget label="TrainingApp — Login with Rate Limiting (Fictional)">
            {!rateLimited ? (
              <form onSubmit={handleSimulatedLogin} className="space-y-3 max-w-sm">
                <div>
                  <label htmlFor="rl-username" className="block text-xs text-muted mb-1">Username</label>
                  <input
                    id="rl-username"
                    type="text"
                    defaultValue="admin"
                    readOnly
                    className="w-full px-3 py-2 rounded-lg border border-white/12 bg-surface text-sm text-muted font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="rl-password" className="block text-xs text-muted mb-1">
                    Password (attempts: {loginAttempts}/5)
                  </label>
                  <input
                    id="rl-password"
                    type="text"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Try any password…"
                    className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-sm text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                  />
                </div>
                <button type="submit" className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors">
                  Login
                </button>
                {loginAttempts > 0 && (
                  <p className="text-xs text-danger">
                    ✗ Login failed ({loginAttempts}/5 attempts). {5 - loginAttempts} remaining before lockout.
                  </p>
                )}
              </form>
            ) : (
              <div className="rounded-lg border border-warning/40 bg-white/[0.04] p-4">
                <p className="text-sm font-semibold text-warning">⚠ Rate limit reached — account temporarily locked</p>
                <p className="text-xs text-fg mt-1">
                  A real server would enforce a cooldown period or require CAPTCHA. This simulation simply locks the form after 5 attempts.
                </p>
              </div>
            )}
          </SimulatedTarget>

          <HintPanel hints={HINTS} onHintReveal={handleHintReveal} />

          {currentStep === 3 && (
            <div className="flex justify-end mb-8">
              <button onClick={() => setCurrentStep(4)} className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors">
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 4: Secure Logout ── */}
      {currentStep >= 4 && (
        <>
          <LabInstructions step={4} title="Secure Logout Principles">
            <p>A correct logout sequence must:</p>
            <ul className="space-y-1.5 mt-2">
              {[
                "Invalidate the session token server-side (not just clear a client-side cookie).",
                "Respond with an appropriate redirect to the login page.",
                "Clear all sensitive state from browser memory (e.g., localStorage, sessionStorage).",
                "Prevent back-button access to authenticated pages after logout (Cache-Control headers).",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-fg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-lg border border-danger/30 bg-white/[0.04] p-3">
              <p className="text-xs text-danger font-semibold mb-1">Common mistake:</p>
              <p className="text-xs text-fg">
                Deleting a cookie only from the browser (e.g., <code className="bg-raised px-1 rounded">document.cookie = 'session=; Max-Age=0'</code>)
                without invalidating the token on the server. The token remains valid — an attacker who captured it can still use it.
              </p>
            </div>
          </LabInstructions>
          {currentStep === 4 && (
            <div className="flex justify-end mb-8">
              <button onClick={() => setCurrentStep(5)} className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors">
                Continue to Knowledge Check →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 5: Knowledge Check ── */}
      {currentStep >= 5 && (
        <>
          <LabInstructions step={5} title="Knowledge Check" />

          <KnowledgeCheck
            question="An application stores the user's role in localStorage as { role: 'admin' } and sends it in every API request. The server trusts this value without re-checking the database. What is the problem?"
            options={[
              { id: "a", text: "localStorage is slow and should use sessionStorage instead." },
              { id: "b", text: "Any JavaScript on the page can modify localStorage, so the server is trusting a client-controlled value as authoritative proof of role." },
              { id: "c", text: "The application is not using HTTPS, so the role can be modified in transit." },
              { id: "d", text: "The server should cache the role for better performance." },
            ]}
            correctId="b"
            explanation="localStorage is accessible by any JavaScript running on the page (including injected scripts). Trusting it as authoritative means any user who can run JS (or any XSS attacker) can escalate their own privileges. The server must validate the role by querying its own database on every protected request."
            wrongExplanation={{
              a: "sessionStorage vs localStorage is a persistence concern, not a security one. Both are writable by client-side JS.",
              c: "HTTPS prevents transit tampering. But the vulnerability here is that the server trusts a client-submitted value at all — regardless of encryption.",
              d: "Caching is irrelevant. The role must be validated server-side, whether from a live DB query or a verified, signed JWT with proper expiry.",
            }}
          />

          <KnowledgeCheck
            question="Why is bcrypt preferred over MD5 or SHA256 for password storage?"
            options={[
              { id: "a", text: "bcrypt produces longer hashes, making it harder to store in a database." },
              { id: "b", text: "bcrypt is deliberately slow and includes a built-in salt, making offline brute-force attacks computationally expensive." },
              { id: "c", text: "MD5 and SHA256 are not supported by modern databases." },
              { id: "d", text: "bcrypt encrypts passwords so they can be decrypted for comparison later." },
            ]}
            correctId="b"
            explanation="bcrypt uses a configurable cost factor that makes each hash computation intentionally slow, turning a brute-force attack from seconds into years. It also generates a unique per-password salt, preventing rainbow-table attacks. MD5 and SHA256 are fast general-purpose hash functions — catastrophically bad for passwords."
            wrongExplanation={{
              a: "Hash length is irrelevant to security here. A 128-bit MD5 hash is much weaker than bcrypt despite being shorter.",
              c: "MD5 and SHA256 are widely supported. The issue is speed and lack of built-in salting, not database compatibility.",
              d: "bcrypt is a one-way hash function, not encryption. Passwords hashed with bcrypt cannot be decrypted. Comparison works by hashing the supplied password with the stored salt and comparing the result.",
            }}
          />

          {user?.id && !completed && (
            <div className="flex justify-end mt-6">
              <button onClick={handleComplete} className="px-6 py-2.5 rounded-lg bg-accent text-on-accent text-sm font-bold hover:bg-accent-hover transition-colors">
                Complete Lab ✓
              </button>
            </div>
          )}
          {!user?.id && (
            <ChallengeFeedback type="info" title="Sign in to save progress" message="Sign in to persist your lab completion to your profile." />
          )}
        </>
      )}
    </LabLayout>
  );
}
