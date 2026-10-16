/**
 * CyberPath Labs — Phase 2: Interactive SQL Injection Lab
 * Route: /labs/sqli-basics
 *
 * SECURITY & ARCHITECTURAL CONTRACT:
 * - Student input is NEVER sent to an actual database or executed as SQL or JavaScript.
 * - The simulation is a completely self-contained in-memory React state machine.
 * - Outlines and evaluation are 100% deterministic based on conceptual pattern analysis.
 * - Uses strictly fictional training application ("ApexSec Gateway") and fictional user records.
 * - Provides progressive hints, structured conceptual tasks, live query visualization,
 *   and practice-only completion summary.
 */

import { useState, useCallback, useId } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Play,
  Terminal,
  Database,
  Lock,
  ArrowRight,
  Eye,
  Lightbulb,
  FileCode2,
  HelpCircle,
  Check,
} from "lucide-react";
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

// ── Fictional in-memory records (pure static mock, never consulted by real SQL) ──
const FICTIONAL_ACCOUNTS = [
  { username: "alice", password: "hunter2", role: "Auditor", id: 101 },
  { username: "bob", password: "qwerty123", role: "Junior Analyst", id: 102 },
];

/**
 * Deterministic evaluator for the vulnerable concatenated query simulation.
 * No SQL is executed. Analyzes boolean logic patterns conceptually.
 */
function simulateVulnerableLogin(rawUsername, rawPassword) {
  const user = (rawUsername || "").trim();
  const pass = (rawPassword || "").trim();

  if (!user && !pass) {
    return { outcome: "empty", message: "Please enter a username and password." };
  }

  // Detect common SQL injection patterns conceptually
  const normalizedUser = user.toLowerCase();
  const combined = (normalizedUser + " " + pass.toLowerCase()).trim();

  const bypassPatterns = [
    "' or '1'='1",
    "' or 1=1",
    "' or 'a'='a",
    "') or ('1'='1",
    "' or ''='",
    "' or true",
    "admin'--",
    "admin' #",
    "admin'/*",
    "' or 1=1--",
    "' or 1=1#",
    "' or 1=1/*",
    "' or '1'='1'--",
    "' or '1'='1'#",
    "' or '1'='1'/*",
  ];

  const matchedPattern = bypassPatterns.find((pattern) =>
    combined.includes(pattern) || normalizedUser.includes(pattern)
  );

  if (matchedPattern) {
    return {
      outcome: "bypassed",
      message:
        "Authentication Bypassed! The injected payload closed the string delimiter and evaluated to TRUE for all rows. The query returned the first user in the database without checking the password.",
      injectedLogic: matchedPattern,
      matchedUser: FICTIONAL_ACCOUNTS[0].username,
    };
  }

  // Check legitimate fictional accounts
  const found = FICTIONAL_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === normalizedUser && acc.password === pass
  );

  if (found) {
    return {
      outcome: "legitimate",
      message: `Successfully authenticated as ${found.username} (${found.role}) using legitimate fictional credentials.`,
      matchedUser: found.username,
    };
  }

  return {
    outcome: "failed",
    message: "Invalid credentials. The fictional database returned 0 rows matching this username and password.",
  };
}

/**
 * Deterministic evaluator for the safe parameterized query simulation.
 * User input is treated strictly as literal data parameter values.
 */
function simulateSafeLogin(rawUsername, rawPassword) {
  const user = (rawUsername || "").trim();
  const pass = (rawPassword || "").trim();

  if (!user && !pass) {
    return { outcome: "empty", message: "Please enter a username and password." };
  }

  const normalizedUser = user.toLowerCase();

  // In a parameterized query, input is never evaluated as SQL syntax.
  // Injection payloads simply become literal username string searches.
  const found = FICTIONAL_ACCOUNTS.find(
    (acc) => acc.username.toLowerCase() === normalizedUser && acc.password === pass
  );

  if (found) {
    return {
      outcome: "legitimate",
      message: `Safe authentication successful: Verified credentials for ${found.username}.`,
      matchedUser: found.username,
    };
  }

  return {
    outcome: "failed",
    message: `Authentication failed. The database searched for a literal username equal to "${user}" and found no matching records.`,
  };
}

const TOTAL_STEPS = 4;

const PROGRESSIVE_HINTS = [
  "Step 1 Hint: In SQL, single quotes (') delimit text strings. Notice how string concatenation (`+`) allows the input to inject a closing quote and append arbitrary boolean logic.",
  "Step 2 Hint: The payload `' OR '1'='1` makes the entire WHERE clause evaluate to TRUE. Since `1=1` is always true, the database returns all user records regardless of whether the password matches.",
  "Step 3 Hint: In a parameterized query (prepared statement), the database compiles the SQL command structure first. Values passed into `$1` or `?` placeholders are treated exclusively as literal data, never as executable SQL commands.",
  "Step 4 Hint: Blacklisting quotes or keywords fails because attackers can use alternate character encodings, comments, or numeric comparisons without quotes. Parameterization is the only defense that guarantees code and data separation.",
];

export default function SQLiLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Vulnerable target simulation state
  const [vulnUser, setVulnUser] = useState("");
  const [vulnPass, setVulnPass] = useState("");
  const [vulnFeedback, setVulnFeedback] = useState(null);
  const [bypassDemonstrated, setBypassDemonstrated] = useState(false);

  // Safe parameterized simulation state
  const [safeUser, setSafeUser] = useState("");
  const [safePass, setSafePass] = useState("");
  const [safeFeedback, setSafeFeedback] = useState(null);
  const [safeDemonstrated, setSafeDemonstrated] = useState(false);

  // Conceptual challenge answers tracking
  const [task1Passed, setTask1Passed] = useState(false);
  const [task2Passed, setTask2Passed] = useState(false);
  const [task3Passed, setTask3Passed] = useState(false);
  const [task4Passed, setTask4Passed] = useState(false);

  const startLab = async () => {
    setStarted(true);
    const userId = user?.id || "guest_student";
    await markLabStarted(userId, "sqli-basics");
  };

  const handleVulnSubmit = (e) => {
    e.preventDefault();
    const result = simulateVulnerableLogin(vulnUser, vulnPass);
    setVulnFeedback(result);
    if (result.outcome === "bypassed") {
      setBypassDemonstrated(true);
    }
  };

  const handleSafeSubmit = (e) => {
    e.preventDefault();
    const result = simulateSafeLogin(safeUser, safePass);
    setSafeFeedback(result);
    if (result.outcome === "failed" && (safeUser.includes("'") || safeUser.toLowerCase().includes("or"))) {
      setSafeDemonstrated(true);
    }
  };

  const handleHintReveal = useCallback(
    async (idx) => {
      const userId = user?.id || "guest_student";
      await recordHintUsed(userId, "sqli-basics");
    },
    [user?.id]
  );

  const resetVulnerableTarget = () => {
    setVulnUser("");
    setVulnPass("");
    setVulnFeedback(null);
  };

  const resetSafeTarget = () => {
    setSafeUser("");
    setSafePass("");
    setSafeFeedback(null);
  };

  const resetEntireSimulation = () => {
    resetVulnerableTarget();
    resetSafeTarget();
    setBypassDemonstrated(false);
    setSafeDemonstrated(false);
    setTask1Passed(false);
    setTask2Passed(false);
    setTask3Passed(false);
    setTask4Passed(false);
    setCurrentStep(1);
    setCompleted(false);
  };

  const handleComplete = async () => {
    const userId = user?.id || "guest_student";
    const result = await markLabComplete(userId, "sqli-basics");
    setXpAwarded(result.xpAwarded || 30);
    setCompleted(true);
  };

  // ── Mission Briefing View (Pre-start) ──
  if (!started) {
    return (
      <LabLayout
        title="SQL Injection Fundamentals"
        category="Injection"
        difficulty="Beginner"
        estimatedTime="20–25 min"
      >
        <MissionBriefing
          mission="Investigate a fictional corporate portal login form ('ApexSec Gateway'). Understand why unsafe string-concatenated SQL queries create critical vulnerabilities, and discover how parameterized queries fundamentally protect applications."
          objectives={[
            "Explain what SQL is and why SQL injection happens",
            "Identify unsafe string concatenation in backend query construction",
            "Test a simulated login bypass using boolean logic injection",
            "Demonstrate why the same payload fails against a parameterized query",
            "Understand why input filtering/blacklisting is an incomplete defense",
            "Select the correct mitigation strategy to secure application databases",
          ]}
          estimatedTime="20–25 minutes"
        />

        {/* Detailed Concept Primer before starting */}
        <div className="rounded-xl border border-white/12 bg-surface p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-fg font-semibold text-base">
            <Database className="w-5 h-5 text-accent" />
            <h3>Conceptual Primer & Ethical Scope</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-xs text-muted leading-relaxed">
            <div className="p-4 rounded-lg bg-page border border-white/12 space-y-2">
              <h4 className="font-semibold text-fg text-sm">What is SQL & SQL Injection?</h4>
              <p>
                <strong>SQL (Structured Query Language)</strong> is the standard language used by applications to create,
                read, update, and delete data in relational databases.
              </p>
              <p>
                <strong>SQL Injection (SQLi)</strong> occurs when untrusted user input is directly concatenated into
                a SQL query string without escaping or parameterization. This allows an attacker to alter the query's
                intended syntax and execute unexpected commands.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-page border border-white/12 space-y-2">
              <h4 className="font-semibold text-fg text-sm">Code vs. Data Separation</h4>
              <p>
                In a vulnerable system, user input is treated as <em>code</em> by the database's SQL interpreter.
              </p>
              <p>
                In a secure system using <strong>parameterized queries (prepared statements)</strong>, the database compiles
                the query logic first. User inputs are bound strictly as <em>data literals</em>, preventing input from ever
                altering the SQL structure.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.04] border border-white/12 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-muted leading-relaxed">
              <strong className="text-fg block mb-0.5">Strict Ethical Scope & Simulation Contract:</strong>
              This simulation executes entirely in-memory inside your browser using simulated state machines.
              No real database is connected, and no user input is ever executed as real SQL. Testing techniques learned
              here must only be performed on systems for which you have explicit, written authorization.
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startLab}
            className="card-interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin Interactive Lab</span>
          </button>
        </div>
      </LabLayout>
    );
  }

  // ── Completion State View ──
  if (completed) {
    return (
      <LabLayout title="SQL Injection Fundamentals" category="Injection" difficulty="Beginner">
        <LabCompletionSummary
          labTitle="SQL Injection Fundamentals"
          xpAwarded={xpAwarded}
          skills={[
            "SQL query structure analysis",
            "Vulnerable string concatenation identification",
            "Boolean logic injection bypass mechanics",
            "Parameterized queries & prepared statements",
            "Input filter & blacklist limitation analysis",
            "Database least-privilege principles",
          ]}
          nextLab={{ href: "/labs/xss-playground", label: "Next Lab: XSS Playground" }}
          relatedLesson={{ href: "/learn/web-security/sql-injection-web", label: "Read SQLi Curriculum Lesson" }}
          onRetry={resetEntireSimulation}
          isPracticeOnly={true}
        />

        {/* Detailed Solution & Concept Debrief */}
        <div className="rounded-xl border border-white/12 bg-surface p-6 space-y-4 mb-6">
          <h3 className="text-base font-bold text-fg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span>Key Takeaways & Real-World Remediation</span>
          </h3>

          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <p>
              <strong className="text-fg">1. Always Parameterize:</strong> Use parameterized queries (prepared statements)
              or modern ORMs with bound parameters for 100% of database interactions. This provides absolute separation
              between the SQL parser and user data.
            </p>
            <p>
              <strong className="text-fg">2. Never Rely on Blacklists:</strong> Blocklists that strip single quotes, dashes,
              or keywords like <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">UNION</code> or <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">SELECT</code> are
              fragile and bypassable via alternate encodings, case permutations, or second-order vulnerabilities.
            </p>
            <p>
              <strong className="text-fg">3. Defense-in-Depth:</strong> Configure database user accounts with least-privilege
              permissions (e.g. read-only permissions for lookup queries), and never run web application database queries
              as administrative superusers (<code className="bg-page px-1 py-0.5 rounded text-fg font-mono">sa</code> or <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">root</code>).
            </p>
          </div>
        </div>
      </LabLayout>
    );
  }

  // ── Active Interactive Lab Steps View ──
  return (
    <LabLayout
      title="SQL Injection Fundamentals"
      category="Injection"
      difficulty="Beginner"
      estimatedTime="20–25 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
    >
      {/* ─────────────────────────────────────────────────────────────
          TASK 1: Unsafe Query Construction & Simulated Vulnerable Panel
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 1 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={1} title="Task 1: Unsafe Query Construction & Login Bypass">
            <p>
              Consider a fictional backend login endpoint for the <strong>ApexSec Portal</strong>. The developer
              constructed the SQL query by concatenating user input strings directly:
            </p>

            {/* Static Code Illustration */}
            <div className="rounded-xl bg-page border border-white/12 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              <span className="text-faint">// Vulnerable server-side handler (JavaScript / Node.js mock)</span>
              <p className="text-fg mt-1">
                <span className="text-warning">const</span> query = <span className="text-muted">"SELECT * FROM users WHERE username = '"</span>
                <span className="text-fg"> + </span>
                <span className="text-accent underline font-semibold">req.body.username</span>
                <span className="text-fg"> + </span>
                <span className="text-muted">"' AND password = '"</span>
                <span className="text-fg"> + </span>
                <span className="text-accent underline font-semibold">req.body.password</span>
                <span className="text-muted">"'"</span>;
              </p>
            </div>

            <p>
              Try interacting with the fictional target below. You can log in using legitimate test credentials
              (<code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">alice</code> / <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">hunter2</code>)
              or demonstrate an injection bypass by typing <code className="bg-raised px-1 py-0.5 rounded text-accent font-mono">' OR '1'='1</code> into the username field with any password.
            </p>
          </LabInstructions>

          <SimulatedTarget label="ApexSec Employee Gateway (Vulnerable Target)">
            <form onSubmit={handleVulnSubmit} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="vuln-username" className="block text-xs text-muted mb-1 font-medium">
                  Username
                </label>
                <input
                  id="vuln-username"
                  type="text"
                  value={vulnUser}
                  onChange={(e) => setVulnUser(e.target.value)}
                  placeholder="e.g. alice or ' OR '1'='1"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-sm text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label htmlFor="vuln-password" className="block text-xs text-muted mb-1 font-medium">
                  Password
                </label>
                <input
                  id="vuln-password"
                  type="text"
                  value={vulnPass}
                  onChange={(e) => setVulnPass(e.target.value)}
                  placeholder="e.g. hunter2 or test"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-sm text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>

              {/* Dynamic Live Query Construction Preview */}
              <div className="p-3 rounded-lg bg-page border border-white/12 text-xs font-mono">
                <span className="text-faint block mb-1 font-sans">// Real-time Concatenated Query Preview:</span>
                <div className="overflow-x-auto text-muted">
                  <span>SELECT * FROM users WHERE username = '</span>
                  <span className="text-accent font-bold bg-white/[0.08] px-1 rounded">
                    {vulnUser || <span className="text-faint font-normal">username</span>}
                  </span>
                  <span>' AND password = '</span>
                  <span className="text-muted font-bold bg-white/[0.08] px-1 rounded">
                    {vulnPass ? "••••••••" : <span className="text-faint font-normal">password</span>}
                  </span>
                  <span>'</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors"
                >
                  Submit Login Request
                </button>
                <button
                  type="button"
                  onClick={resetVulnerableTarget}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/12 text-xs text-muted hover:text-fg hover:border-white/28 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </form>

            {/* Simulated Evaluator Feedback */}
            {vulnFeedback && (
              <div className="mt-4">
                {vulnFeedback.outcome === "bypassed" && (
                  <ChallengeFeedback
                    type="success"
                    title="Authentication Bypass Simulated!"
                    message={vulnFeedback.message}
                  />
                )}
                {vulnFeedback.outcome === "legitimate" && (
                  <ChallengeFeedback
                    type="info"
                    title="Valid Authentication"
                    message={vulnFeedback.message}
                  />
                )}
                {vulnFeedback.outcome === "failed" && (
                  <ChallengeFeedback
                    type="error"
                    title="Login Failed"
                    message={vulnFeedback.message}
                  />
                )}
                {vulnFeedback.outcome === "empty" && (
                  <ChallengeFeedback
                    type="info"
                    title="Input Required"
                    message={vulnFeedback.message}
                  />
                )}
              </div>
            )}
          </SimulatedTarget>

          {/* Conceptual Check for Task 1 */}
          <div className="mt-4">
            <KnowledgeCheck
              question="Task 1 Check: What is the root cause of this vulnerability in the query construction pattern?"
              options={[
                {
                  id: "a",
                  text: "The database password field is stored in plain text rather than hashed.",
                },
                {
                  id: "b",
                  text: "User input is directly concatenated into the SQL command string, letting input syntax alter the parser's logic.",
                },
                {
                  id: "c",
                  text: "The SQL SELECT statement queried all columns using '*' instead of specific column names.",
                },
                {
                  id: "d",
                  text: "The login form uses HTTP POST rather than an encrypted WebSocket connection.",
                },
              ]}
              correctId="b"
              explanation="In unsafe string concatenation, user input becomes part of the SQL command syntax itself. A single quote breaks out of the string boundary, allowing the student to inject an OR condition that forces the query to evaluate to true."
              wrongExplanation={{
                a: "Password hashing is critical for data-at-rest protection, but it does not cause or prevent SQL injection.",
                c: "Selecting all columns with '*' may return unneeded data, but it does not allow an attacker to bypass authentication logic.",
                d: "The transport protocol does not alter how the backend database interprets SQL query syntax.",
              }}
              onCorrect={() => setTask1Passed(true)}
            />
          </div>

          {currentStep === 1 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!task1Passed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Continue to Task 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TASK 2: The Parameterized Query Approach & Safe Simulation
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 2 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={2} title="Task 2: Choosing the Parameterized Query Approach">
            <p>
              Now observe the secure defense: <strong>Parameterized Queries</strong> (prepared statements).
              In parameterized queries, the SQL statement template is pre-compiled by the database engine.
              User input is transmitted as separate, bound values ($1, $2) that are strictly interpreted as
              literal data values:
            </p>

            <div className="rounded-xl bg-page border border-white/12 p-4 font-mono text-xs leading-relaxed overflow-x-auto">
              <span className="text-faint">// Safe parameterized query (Prepared Statement)</span>
              <p className="text-fg mt-1">
                <span className="text-warning">const</span> queryText = <span className="text-muted">"SELECT id, username FROM users WHERE username = $1 AND password = $2"</span>;
              </p>
              <p className="text-fg">
                <span className="text-warning">const</span> result = <span className="text-warning">await</span> db.query(queryText, [
                <span className="text-accent underline font-semibold">req.body.username</span>,
                <span className="text-accent underline font-semibold">req.body.password</span>
                ]);
              </p>
            </div>

            <p>
              Test the same bypass payload (<code className="bg-raised px-1 py-0.5 rounded text-accent font-mono">' OR '1'='1</code>)
              in the secure panel below. Notice that authentication fails because the database driver treats the payload as a literal username string rather than SQL code.
            </p>
          </LabInstructions>

          <SimulatedTarget label="ApexSec Employee Gateway (Secure Parameterized Target)">
            <form onSubmit={handleSafeSubmit} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="safe-username" className="block text-xs text-muted mb-1 font-medium">
                  Username
                </label>
                <input
                  id="safe-username"
                  type="text"
                  value={safeUser}
                  onChange={(e) => setSafeUser(e.target.value)}
                  placeholder="Test ' OR '1'='1 or alice"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-sm text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label htmlFor="safe-password" className="block text-xs text-muted mb-1 font-medium">
                  Password
                </label>
                <input
                  id="safe-password"
                  type="text"
                  value={safePass}
                  onChange={(e) => setSafePass(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="off"
                  className="w-full px-3 py-2 rounded-lg border border-white/12 bg-page text-sm text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                />
              </div>

              {/* Dynamic Parameter Array Preview */}
              <div className="p-3 rounded-lg bg-page border border-white/12 text-xs font-mono">
                <span className="text-faint block mb-1 font-sans">// Parameterized Bind Array:</span>
                <div className="text-muted">
                  <p>SQL Template: <span className="text-fg">"SELECT * FROM users WHERE username = $1 AND password = $2"</span></p>
                  <p className="mt-1">
                    $1 (literal data) = <span className="text-accent font-bold">"{safeUser || ""}"</span>
                  </p>
                  <p>
                    $2 (literal data) = <span className="text-muted font-bold">"{safePass ? "••••••••" : ""}"</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover transition-colors"
                >
                  Submit Safe Login
                </button>
                <button
                  type="button"
                  onClick={resetSafeTarget}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/12 text-xs text-muted hover:text-fg hover:border-white/28 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </form>

            {/* Simulated Evaluator Feedback */}
            {safeFeedback && (
              <div className="mt-4">
                {safeFeedback.outcome === "failed" && (
                  <ChallengeFeedback
                    type="info"
                    title="Defense Demonstrated: Payload Treated As Literal Data"
                    message={safeFeedback.message}
                  />
                )}
                {safeFeedback.outcome === "legitimate" && (
                  <ChallengeFeedback
                    type="success"
                    title="Legitimate Login Verified"
                    message={safeFeedback.message}
                  />
                )}
                {safeFeedback.outcome === "empty" && (
                  <ChallengeFeedback
                    type="info"
                    title="Input Required"
                    message={safeFeedback.message}
                  />
                )}
              </div>
            )}
          </SimulatedTarget>

          {/* Conceptual Check for Task 2 */}
          <div className="mt-4">
            <KnowledgeCheck
              question="Task 2 Check: Why does the bypass payload fail against the parameterized query?"
              options={[
                {
                  id: "a",
                  text: "The web application detected single quotes and automatically replaced them with spaces.",
                },
                {
                  id: "b",
                  text: "The database query template is pre-compiled; parameters are passed strictly as literal values, never parsed as SQL syntax.",
                },
                {
                  id: "c",
                  text: "The database encrypted the username string with AES-256 before comparing it.",
                },
                {
                  id: "d",
                  text: "The query was routed to an in-memory cache that ignores boolean expressions.",
                },
              ]}
              correctId="b"
              explanation="Parameterized queries (prepared statements) fundamentally separate code from data. The SQL command structure is compiled beforehand. The input string is supplied directly as data for $1, so characters like ' and OR have no special syntactic meaning."
              wrongExplanation={{
                a: "No string replacement or filtering was applied. Parameterization does not alter input; it ensures input is handled as pure data.",
                c: "Database parameterization relies on driver protocol placeholders, not data-at-rest encryption.",
                d: "Caching layers do not alter query parsing semantics.",
              }}
              onCorrect={() => setTask2Passed(true)}
            />
          </div>

          {currentStep === 2 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!task2Passed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Continue to Task 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TASK 3: Explaining Why Input Filtering Alone is Insufficient
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 3 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={3} title="Task 3: Analyzing Defense Inadequacy — Why Input Filtering Fails">
            <p>
              Developers sometimes attempt to defend against SQL injection by using <strong>input blacklists</strong> or
              filters—for example, writing regular expressions that strip single quotes (<code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">'</code>),
              hyphens (<code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">--</code>), or words like <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">UNION</code>.
            </p>
            <p>
              In practice, input filtering alone is <strong>fragile and inadequate</strong>. Attackers frequently bypass
              naive filters using Unicode variations, double-encoding, inline comments, or injection vectors that require
              no quotes at all (such as numeric fields).
            </p>
          </LabInstructions>

          <KnowledgeCheck
            question="Task 3 Check: Why is input filtering / blacklisting alone considered an incomplete and fragile defense against SQL injection?"
            options={[
              {
                id: "a",
                text: "Because blacklists only work when the web server runs on Windows, not Linux.",
              },
              {
                id: "b",
                text: "Because blacklists cannot account for all permutations of encoding, numeric injection contexts, or alternate SQL comment styles.",
              },
              {
                id: "c",
                text: "Because modern web browsers automatically disable backend filters before sending requests.",
              },
              {
                id: "d",
                text: "Because SQL queries cannot process strings that have had characters removed.",
              },
            ]}
            correctId="b"
            explanation="Blacklists suffer from the 'enumeration problem'—it is nearly impossible to anticipate every bypass technique. Numeric injections (e.g., WHERE id = 1 OR 1=1) require no quotes, and complex encodings can evade simple regex patterns. Parameterization guarantees safety regardless of the input format."
            wrongExplanation={{
              a: "Filter effectiveness has nothing to do with the underlying operating system.",
              c: "Browsers have no visibility or control over backend server-side validation logic.",
              d: "SQL queries process sanitized strings normally; the problem is that malicious inputs still slip past imperfect filters.",
            }}
            onCorrect={() => setTask3Passed(true)}
          />

          {currentStep === 3 && (
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCurrentStep(4)}
                disabled={!task3Passed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span>Continue to Task 4</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TASK 4: Selecting the Appropriate Mitigation Strategy
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 4 && (
        <div className="space-y-6 mb-8">
          <LabInstructions step={4} title="Task 4: Selecting the Complete Mitigation Strategy">
            <p>
              To complete the lab, identify the complete mitigation approach the engineering team must adopt across
              the application codebase and database infrastructure.
            </p>
          </LabInstructions>

          <KnowledgeCheck
            question="Task 4 Check: Which combination of practices represents the industry standard for complete SQL injection mitigation?"
            options={[
              {
                id: "a",
                text: "Enforce HTTPS encryption on all login endpoints and require 16-character user passwords.",
              },
              {
                id: "b",
                text: "Use parameterized queries/prepared statements for all database access, combined with principle of least privilege database accounts.",
              },
              {
                id: "c",
                text: "Convert all SQL queries into base64 strings before executing them on the database server.",
              },
              {
                id: "d",
                text: "Use a Web Application Firewall (WAF) as the sole defense while keeping concatenated queries in application code.",
              },
            ]}
            correctId="b"
            explanation="The primary defense is parameterized queries/prepared statements (or an ORM that uses parameter binding). Combined with database accounts restricted to only the minimal permissions required (least privilege), applications are protected even if an edge case occurs."
            wrongExplanation={{
              a: "HTTPS secures communication in transit against eavesdropping, but has zero effect on how the database engine executes queries.",
              c: "Base64 encoding does not change the query logic once decoded and executed by the database.",
              d: "WAFs provide useful outer-perimeter monitoring, but relying on a WAF instead of fixing vulnerable code is a recognized anti-pattern that attackers routinely bypass.",
            }}
            onCorrect={() => setTask4Passed(true)}
          />

          {/* Progressive Hint Panel */}
          <HintPanel hints={PROGRESSIVE_HINTS} onHintReveal={handleHintReveal} />

          {/* Complete Lab Action */}
          <div className="p-4 rounded-xl border border-white/12 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <div>
                <strong className="text-fg block text-sm">All Learning Objectives Satisfied</strong>
                <span className="text-xs text-muted">
                  Ready to record practice completion and view the concepts debrief.
                </span>
              </div>
            </div>

            <button
              onClick={handleComplete}
              disabled={!task4Passed}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-accent text-on-accent text-sm font-semibold hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Complete Lab & View Summary ✓
            </button>
          </div>
        </div>
      )}
    </LabLayout>
  );
}
