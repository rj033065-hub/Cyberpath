/**
 * Lab 1: SQL Injection Fundamentals
 * Route: /labs/sqli-basics
 *
 * SECURITY CONTRACT:
 * - Student input is NEVER sent to a database or executed as SQL.
 * - The "login" panel is a purely in-memory React state machine.
 * - All "vulnerable" and "safe" outcomes are pre-computed based on string matching rules,
 *   NOT by running SQL.
 * - No real credentials or real targets are used.
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

// ── Fictional account data (static, never consulted by real SQL) ────────────
const FICTIONAL_ACCOUNTS = [
  { username: "alice", password: "hunter2" },
  { username: "bob", password: "qwerty123" },
];

/**
 * Simulates the VULNERABLE query outcome (string concatenation).
 * Input is never executed — this is a deterministic simulation.
 * Returns "bypassed" | "failed" | "success"
 */
function simulateVulnerableLogin(username, password) {
  // Classic bypass: ' OR '1'='1
  const trimmed = username.trim().toLowerCase();
  const pwTrimmed = password.trim();

  // Detect common bypass patterns (purely educational demonstration)
  const bypassPatterns = [
    "' or '1'='1",
    "' or 1=1--",
    "' or '1'='1'--",
    "admin'--",
    "' or 1=1 --",
    "' or 'a'='a",
    "') or ('1'='1",
    "' or ''='",
  ];

  const combinedInput = (trimmed + " " + pwTrimmed).toLowerCase();
  if (bypassPatterns.some((p) => combinedInput.includes(p.toLowerCase()))) {
    return "bypassed";
  }

  // Legitimate fictional account check
  const match = FICTIONAL_ACCOUNTS.find(
    (a) => a.username === trimmed && a.password === pwTrimmed
  );
  return match ? "success" : "failed";
}

/**
 * Simulates the SAFE parameterized-query outcome.
 * Bypass patterns are treated as literal strings — always fail.
 */
function simulateSafeLogin(username, password) {
  const match = FICTIONAL_ACCOUNTS.find(
    (a) => a.username === username.trim() && a.password === password.trim()
  );
  return match ? "success" : "failed";
}

const TOTAL_STEPS = 4;

const HINTS = [
  "Look at the query template in Step 2. Notice the username is placed directly inside the string using concatenation.",
  "Try typing a single quote (') in the username field in the vulnerable panel. What happens to the SQL string structure?",
  "A classic bypass appends ' OR '1'='1 to the username. Because 1=1 is always true, the WHERE clause evaluates to true for every row.",
  "The safe panel uses a parameterized query — the username is passed as a separate value, never embedded in the SQL string. Try the same input; it should fail.",
];

export default function SQLiLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Vulnerable panel state
  const [vulnUser, setVulnUser] = useState("");
  const [vulnPass, setVulnPass] = useState("");
  const [vulnResult, setVulnResult] = useState(null); // null | "bypassed" | "failed" | "success"

  // Safe panel state
  const [safeUser, setSafeUser] = useState("");
  const [safePass, setSafePass] = useState("");
  const [safeResult, setSafeResult] = useState(null);

  // Challenge: student must demonstrate bypass on vulnerable panel, then safe on parameterized
  const [challengeBypassDone, setChallengeBypassDone] = useState(false);
  const [challengeSafeDone, setChallengeSafeDone] = useState(false);

  const startLab = async () => {
    setStarted(true);
    if (user?.id) await markLabStarted(user.id, "sqli-basics");
  };

  const handleVulnSubmit = (e) => {
    e.preventDefault();
    const outcome = simulateVulnerableLogin(vulnUser, vulnPass);
    setVulnResult(outcome);
    if (outcome === "bypassed") setChallengeBypassDone(true);
  };

  const handleSafeSubmit = (e) => {
    e.preventDefault();
    const outcome = simulateSafeLogin(safeUser, safePass);
    setSafeResult(outcome);
    if (outcome === "failed" && challengeBypassDone) {
      // Student has now seen that the same bypass doesn't work with parameterized queries
      setChallengeSafeDone(true);
    }
  };

  const handleHintReveal = useCallback(
    async (idx) => {
      if (user?.id) await recordHintUsed(user.id, "sqli-basics");
    },
    [user?.id]
  );

  const handleComplete = async () => {
    if (!user?.id) return;
    const result = await markLabComplete(user.id, "sqli-basics");
    setXpAwarded(result.xpAwarded || 0);
    setCompleted(true);
  };

  const retry = () => {
    setVulnUser(""); setVulnPass(""); setVulnResult(null);
    setSafeUser(""); setSafePass(""); setSafeResult(null);
    setChallengeBypassDone(false); setChallengeSafeDone(false);
    setCurrentStep(1); setCompleted(false);
  };

  if (!started) {
    return (
      <LabLayout title="SQL Injection Fundamentals" category="Injection" difficulty="Beginner" estimatedTime="20–25 min">
        <MissionBriefing
          mission="Investigate a fictional training application's login form. Understand why unsafe SQL query construction leads to authentication bypass, and learn how parameterized queries prevent it."
          objectives={[
            "Understand how string-concatenated SQL queries are constructed",
            "Demonstrate how an injection bypass works in a simulated panel",
            "Observe that the same input fails against a parameterized query",
            "Explain why parameterized queries are the correct defense",
          ]}
          estimatedTime="20–25 minutes"
        />
        <div className="flex justify-center">
          <button
            onClick={startLab}
            className="px-6 py-3 rounded-lg bg-[#2f81f7] text-white font-semibold hover:bg-[#388bfd] transition-colors"
          >
            Begin Lab
          </button>
        </div>
      </LabLayout>
    );
  }

  if (completed) {
    return (
      <LabLayout title="SQL Injection Fundamentals" category="Injection" difficulty="Beginner">
        <LabCompletionSummary
          labTitle="SQL Injection Fundamentals"
          xpAwarded={xpAwarded}
          skills={["SQL query structure", "Parameterized queries", "Auth bypass patterns"]}
          nextLab={{ href: "/labs/xss-playground", label: "Next: XSS Playground" }}
          relatedLesson={{ href: "/learn/web-security/sql-injection-web", label: "SQLi Lesson" }}
          onRetry={retry}
          isPracticeOnly
        />
      </LabLayout>
    );
  }

  return (
    <LabLayout
      title="SQL Injection Fundamentals"
      category="Injection"
      difficulty="Beginner"
      estimatedTime="20–25 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
    >
      {/* ── Step 1: What is SQL Injection? ── */}
      {currentStep >= 1 && (
        <>
          <LabInstructions step={1} title="What is SQL Injection?">
            <p>
              SQL Injection (SQLi) is a web security vulnerability that occurs when user-supplied
              input is embedded directly into a SQL query without validation or escaping.
              An attacker can alter the query's logic to read, modify, or bypass database controls.
            </p>
            <p>
              In this lab, you will interact with a <strong>fictional</strong>, self-contained login
              panel. No real database exists — the outcomes are simulated to help you understand the
              vulnerability pattern.
            </p>

            {/* Fictional query illustration */}
            <div className="mt-4 rounded-lg bg-[#010409] border border-[#21262d] p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-[#6e7681] mb-1">// Unsafe string concatenation (fictional example)</p>
              <p className="text-[#f0f6fc]">
                <span className="text-[#e3b341]">const</span> query = <span className="text-[#a5d6ff]">"SELECT * FROM users WHERE username = '"</span>
                <span className="text-[#f0f6fc]"> + </span>
                <span className="text-[#79c0ff]">username</span>
                <span className="text-[#f0f6fc]"> + </span>
                <span className="text-[#a5d6ff]">"' AND password = '"</span>
                <span className="text-[#f0f6fc]"> + </span>
                <span className="text-[#79c0ff]">password</span>
                <span className="text-[#f0f6fc]"> + </span>
                <span className="text-[#a5d6ff]">"'"</span>;
              </p>
              <p className="text-[#6e7681] mt-3 mb-1">// With normal input:</p>
              <p className="text-[#3fb950]">SELECT * FROM users WHERE username = 'alice' AND password = 'hunter2'</p>
              <p className="text-[#6e7681] mt-3 mb-1">// With injected input: username = <span className="text-[#f85149]">' OR '1'='1</span></p>
              <p className="text-[#f85149]">{"SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''"}</p>
              <p className="text-[#6e7681] mt-1">// '1'='1' is always true → all rows returned → bypass!</p>
            </div>

            <ChallengeFeedback
              type="info"
              title="Important"
              message="This panel is completely isolated. No SQL is executed against any real database. Your input is evaluated by a JavaScript state machine that simulates vulnerable outcomes."
            />
          </LabInstructions>

          {currentStep === 1 && (
            <div className="flex justify-end mt-2 mb-8">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors"
              >
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 2: Try the Vulnerable Panel ── */}
      {currentStep >= 2 && (
        <>
          <LabInstructions step={2} title="Challenge — The Vulnerable Panel">
            <p>
              The form below simulates a login backed by an unsafe string-concatenated query.
              Try to bypass authentication <strong>without knowing a real password</strong>.
              Use the fictional accounts (username: <code className="bg-[#21262d] px-1 rounded">alice</code> / password: <code className="bg-[#21262d] px-1 rounded">hunter2</code>) or an injection string.
            </p>
          </LabInstructions>

          <SimulatedTarget label="TrainingApp — Vulnerable Login (Fictional)">
            <form onSubmit={handleVulnSubmit} className="space-y-4 max-w-sm">
              <div>
                <label htmlFor="vuln-username" className="block text-xs text-[#8b949e] mb-1 font-medium">
                  Username
                </label>
                <input
                  id="vuln-username"
                  type="text"
                  value={vulnUser}
                  onChange={(e) => setVulnUser(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors font-mono"
                />
              </div>
              <div>
                <label htmlFor="vuln-password" className="block text-xs text-[#8b949e] mb-1 font-medium">
                  Password
                </label>
                <input
                  id="vuln-password"
                  type="text"
                  value={vulnPass}
                  onChange={(e) => setVulnPass(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#f85149]/15 border border-[#f85149]/40 text-[#f85149] text-sm font-semibold hover:bg-[#f85149]/25 transition-colors"
              >
                Login (Vulnerable)
              </button>
            </form>

            {vulnResult === "bypassed" && (
              <div className="mt-4 rounded-lg border border-[#f85149]/40 bg-[#f85149]/10 p-4">
                <p className="text-sm font-semibold text-[#f85149]">⚠ Authentication Bypassed!</p>
                <p className="text-xs text-[#c9d1d9] mt-1">
                  The simulated query returned all rows because OR '1'='1' evaluates to true.
                  In a real application, this could grant access to any account.
                </p>
              </div>
            )}
            {vulnResult === "success" && (
              <div className="mt-4 rounded-lg border border-[#3fb950]/40 bg-[#3fb950]/10 p-4">
                <p className="text-sm font-semibold text-[#3fb950]">✓ Logged in as {vulnUser}</p>
                <p className="text-xs text-[#c9d1d9] mt-1">Valid credentials for a fictional account.</p>
              </div>
            )}
            {vulnResult === "failed" && (
              <div className="mt-4 rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
                <p className="text-sm text-[#8b949e]">✗ Login failed — try a bypass pattern.</p>
              </div>
            )}
          </SimulatedTarget>

          <HintPanel hints={HINTS} onHintReveal={handleHintReveal} />

          {challengeBypassDone && currentStep === 2 && (
            <>
              <ChallengeFeedback
                type="success"
                title="Bypass Demonstrated"
                message="You've seen how input is injected into an unsafe query. Now try the same payload against the parameterized version."
              />
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors"
                >
                  Continue →
                </button>
              </div>
            </>
          )}
          {!challengeBypassDone && currentStep === 2 && (
            <p className="text-xs text-[#8b949e] italic mb-8">
              Complete the bypass in the vulnerable panel above to continue.
            </p>
          )}
        </>
      )}

      {/* ── Step 3: The Safe Panel ── */}
      {currentStep >= 3 && (
        <>
          <LabInstructions step={3} title="Defense — Parameterized Query">
            <p>
              Parameterized queries (also called prepared statements) separate the SQL command from
              the data. The database driver handles escaping automatically — user input is always
              treated as a literal value, never as SQL syntax.
            </p>
            <div className="mt-3 rounded-lg bg-[#010409] border border-[#21262d] p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              <p className="text-[#6e7681] mb-1">// Safe parameterized query (fictional example)</p>
              <p className="text-[#3fb950]">{"const query = \"SELECT * FROM users WHERE username = $1 AND password = $2\";"}</p>
              <p className="text-[#3fb950]">{"const result = db.query(query, [username, password]);"}</p>
              <p className="text-[#6e7681] mt-2">// With injection input ' OR '1'='1 :</p>
              <p className="text-[#3fb950]">{"// username is passed as the literal string \" ' OR '1'='1 \" — no SQL meaning"}</p>
              <p className="text-[#3fb950]">{"SELECT * FROM users WHERE username = ''' OR ''1''=''1' AND password = ''"}</p>
              <p className="text-[#6e7681]">// No rows match → bypass fails</p>
            </div>
            <p className="mt-3">
              Now try the same bypass payload in the safe panel below. Notice that it fails.
            </p>
          </LabInstructions>

          <SimulatedTarget label="TrainingApp — Safe Login (Parameterized)">
            <form onSubmit={handleSafeSubmit} className="space-y-4 max-w-sm">
              <div>
                <label htmlFor="safe-username" className="block text-xs text-[#8b949e] mb-1 font-medium">
                  Username
                </label>
                <input
                  id="safe-username"
                  type="text"
                  value={safeUser}
                  onChange={(e) => setSafeUser(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#3fb950]/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>
              <div>
                <label htmlFor="safe-password" className="block text-xs text-[#8b949e] mb-1 font-medium">
                  Password
                </label>
                <input
                  id="safe-password"
                  type="text"
                  value={safePass}
                  onChange={(e) => setSafePass(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#3fb950]/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#3fb950]/15 border border-[#3fb950]/40 text-[#3fb950] text-sm font-semibold hover:bg-[#3fb950]/25 transition-colors"
              >
                Login (Safe)
              </button>
            </form>

            {safeResult === "success" && (
              <div className="mt-4 rounded-lg border border-[#3fb950]/40 bg-[#3fb950]/10 p-4">
                <p className="text-sm font-semibold text-[#3fb950]">✓ Logged in as {safeUser}</p>
              </div>
            )}
            {safeResult === "failed" && (
              <div className="mt-4 rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
                <p className="text-sm text-[#8b949e]">✗ Login failed — input treated as a literal string, not SQL syntax.</p>
              </div>
            )}
          </SimulatedTarget>

          {challengeSafeDone && currentStep === 3 && (
            <>
              <ChallengeFeedback
                type="success"
                title="Defense Verified"
                message="The same bypass payload fails against the parameterized query. The database received the injection string as a literal username value — no rows matched."
              />
              <div className="flex justify-end mb-8">
                <button
                  onClick={() => setCurrentStep(4)}
                  className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors"
                >
                  Continue to Knowledge Check →
                </button>
              </div>
            </>
          )}
          {!challengeSafeDone && currentStep === 3 && (
            <p className="text-xs text-[#8b949e] italic mb-8">
              Try the bypass payload in the safe panel, then observe it fails to continue.
            </p>
          )}
        </>
      )}

      {/* ── Step 4: Knowledge Check ── */}
      {currentStep >= 4 && (
        <>
          <LabInstructions step={4} title="Knowledge Check">
            <p>Answer the questions below to complete this lab.</p>
          </LabInstructions>

          <KnowledgeCheck
            question="Why does ' OR '1'='1 bypass a login form that uses string concatenation?"
            options={[
              { id: "a", text: "It deletes the users table so there is nothing to authenticate against." },
              { id: "b", text: "It makes the WHERE clause always evaluate to true, so all rows are returned and login succeeds." },
              { id: "c", text: "It hashes the password field so the database cannot compare it correctly." },
              { id: "d", text: "It sends the query to a different database that has no authentication." },
            ]}
            correctId="b"
            explanation="String concatenation embeds the input literally into the SQL query. ' OR '1'='1 closes the username string and appends a condition that is always true, making the entire WHERE clause evaluate to true regardless of the actual credentials."
            wrongExplanation={{
              a: "DROP or DELETE statements are a different class of SQLi attack (destructive). A simple OR bypass does not drop tables.",
              c: "Injection attacks alter query logic, not hashing. Password hashing is a separate defence mechanism.",
              d: "The query still runs on the same database. The bypass manipulates the WHERE clause logic, not the connection target.",
            }}
            onCorrect={() => {}}
          />

          <KnowledgeCheck
            question="Which of the following is the primary defence against SQL injection?"
            options={[
              { id: "a", text: "Filtering out single quotes from user input" },
              { id: "b", text: "Using HTTPS to encrypt the database connection" },
              { id: "c", text: "Using parameterized queries (prepared statements)" },
              { id: "d", text: "Rate-limiting login attempts" },
            ]}
            correctId="c"
            explanation="Parameterized queries separate SQL code from data. The database driver handles escaping, so user input is always treated as a literal value — never as SQL syntax. Input filtering (A) is fragile and bypassable. HTTPS (B) protects the transport layer, not query logic. Rate-limiting (D) limits brute-force attacks, not injection."
            wrongExplanation={{
              a: "Blocklisting single quotes is fragile. Attackers can use alternative encodings, Unicode, or second-order injection to bypass it.",
              b: "HTTPS encrypts data in transit but has no effect on how the database processes a query.",
              d: "Rate-limiting is a useful additional control but does not prevent injection — a single crafted request is enough to bypass authentication.",
            }}
            onCorrect={() => {}}
          />

          <div className="mt-6 p-4 rounded-lg border border-[#21262d] bg-[#010409] text-xs text-[#8b949e]">
            <strong className="text-[#c9d1d9]">Real-world note:</strong> This simulation demonstrates
            the conceptual behaviour of SQL injection. A successful-looking result in this fictional
            panel does NOT indicate that any real system is vulnerable. Always obtain written
            authorization before testing real applications.
          </div>

          {user?.id && !completed && (
            <div className="flex justify-end mt-6">
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-lg bg-[#3fb950] text-[#010409] text-sm font-bold hover:bg-[#46c85a] transition-colors"
              >
                Complete Lab ✓
              </button>
            </div>
          )}
          {!user?.id && (
            <ChallengeFeedback
              type="info"
              title="Sign in to save progress"
              message="Progress is saved locally in demo mode. Sign in to persist your lab completion."
            />
          )}
        </>
      )}
    </LabLayout>
  );
}
