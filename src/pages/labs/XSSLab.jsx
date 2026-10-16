/**
 * CyberPath Labs — Phase 3: Interactive XSS Playground
 * Route: /labs/xss-playground
 *
 * SECURITY & ARCHITECTURAL CONTRACT:
 * - Student input is NEVER executed as live JavaScript or evaluated with eval/new Function.
 * - dangerouslySetInnerHTML is NEVER called with student input.
 * - All student-entered text is rendered using React's default text node interpolation,
 *   which automatically escapes HTML markup into harmless text.
 * - Safe illustrative comparison demonstrates the conceptual vulnerability without running untrusted code.
 * - Fully integrated with the shared LabLayout and prepared for the reusable AI Lab Mentor integration point.
 */

import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  Code2,
  FileCode,
  Globe,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  HelpCircle,
  Layers,
  Lock,
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

const TOTAL_STEPS = 4;

const PROGRESSIVE_HINTS = [
  "Step 1 Hint: Look at how the browser interprets strings. When using `element.innerHTML`, the browser parser treats `<` and `>` as HTML tag boundaries. When using `textContent` or React `{value}`, the browser creates a text node where `<` is just a glyph.",
  "Step 2 Hint: Try entering a simulated payload like `<img src=x onerror=alert(1)>`. Notice that in the safe preview, it is displayed literally as text on screen rather than executing an image load error handler.",
  "Step 3 Hint: In Stored XSS, the payload persists in a database and executes for anyone visiting the page. In Reflected XSS, the payload is in the request (e.g. URL query) and reflected immediately. In DOM XSS, client-side JavaScript reads from a source like location.hash and writes directly into the DOM.",
  "Step 4 Hint: The most robust primary defense is contextual output encoding (using framework templating like React that escapes by default). Defense-in-depth adds Content Security Policy (CSP) and HttpOnly flags on session cookies to prevent theft.",
];

const INITIAL_COMMENTS = [
  { id: 1, author: "sarah_sec", text: "Welcome to the ApexSec Community Hub! Feel free to test comment previews." },
  { id: 2, author: "marcus_dev", text: "Remember to always encode user-controlled content before rendering." },
];

export default function XSSLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Simulated target state
  const [commentInput, setCommentInput] = useState("");
  const [postedComments, setPostedComments] = useState(INITIAL_COMMENTS);
  const [activePreviewMode, setActivePreviewMode] = useState("safe"); // "safe" | "illustrative"
  const [tagDemonstrated, setTagDemonstrated] = useState(false);

  // Conceptual tasks tracking
  const [task1Passed, setTask1Passed] = useState(false);
  const [task2Passed, setTask2Passed] = useState(false);
  const [task3Passed, setTask3Passed] = useState(false);
  const [task4Passed, setTask4Passed] = useState(false);

  const startLab = async () => {
    setStarted(true);
    const userId = user?.id || "guest_student";
    await markLabStarted(userId, "xss-playground");
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text) return;

    // Append to in-memory list (strictly local, safe text node)
    setPostedComments((prev) => [
      ...prev,
      { id: Date.now(), author: "student_tester", text },
    ]);

    // Check if the student provided a string containing HTML tag delimiters
    if (text.includes("<") || text.includes(">") || text.toLowerCase().includes("script")) {
      setTagDemonstrated(true);
    }

    setCommentInput("");
  };

  const resetTargetComments = () => {
    setCommentInput("");
    setPostedComments(INITIAL_COMMENTS);
    setTagDemonstrated(false);
    setActivePreviewMode("safe");
  };

  const resetEntireLab = () => {
    resetTargetComments();
    setTask1Passed(false);
    setTask2Passed(false);
    setTask3Passed(false);
    setTask4Passed(false);
    setCurrentStep(1);
    setCompleted(false);
  };

  const handleHintReveal = useCallback(
    async (idx) => {
      const userId = user?.id || "guest_student";
      await recordHintUsed(userId, "xss-playground");
    },
    [user?.id]
  );

  const handleComplete = async () => {
    const userId = user?.id || "guest_student";
    const result = await markLabComplete(userId, "xss-playground");
    setXpAwarded(result.xpAwarded || 30);
    setCompleted(true);
  };

  // Helper to visually demonstrate HTML entity escaping without executing anything
  const getEscapedEntities = (str) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;");
  };

  // ── Mission Briefing Pre-Start View ──
  if (!started) {
    return (
      <LabLayout
        title="XSS Playground"
        category="Injection"
        difficulty="Beginner"
        estimatedTime="20–25 min"
        mentorContext={{
          labId: "xss-playground",
          topic: "Browser Security & XSS",
          currentStep: 1,
          totalSteps: TOTAL_STEPS,
          learningObjectives: [
            "Understand Reflected, Stored, and DOM-based XSS",
            "Differentiate text node rendering from unsafe HTML interpretation",
            "Observe contextual output encoding in modern UI frameworks",
            "Implement Content Security Policy and defense-in-depth mitigations",
          ],
        }}
      >
        <MissionBriefing
          mission="Investigate how web applications process user-submitted input in the browser. Learn the distinction between safe text node rendering and unsafe HTML interpretation, explore Reflected vs. Stored vs. DOM XSS, and master contextual output encoding."
          objectives={[
            "Explain what Cross-Site Scripting (XSS) is and why it occurs",
            "Differentiate between Reflected, Stored, and DOM-based XSS",
            "Identify unsafe rendering sinks (innerHTML, document.write) in frontend code",
            "Interact with a safe comment previewer demonstrating automatic text escaping",
            "Understand why contextual output encoding is the primary defense",
            "Select industry-standard mitigations (CSP, HttpOnly cookies, safe framework defaults)",
          ]}
          estimatedTime="20–25 minutes"
        />

        <div className="rounded-xl border border-white/12 bg-surface p-6 mb-6 space-y-4">
          <div className="flex items-center gap-2 text-fg font-semibold text-base">
            <Globe className="w-5 h-5 text-accent" />
            <h3>Conceptual Primer: The Three Faces of XSS</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-xs text-muted leading-relaxed">
            <div className="p-4 rounded-lg bg-page border border-white/12 space-y-1.5">
              <span className="font-mono text-accent text-[11px] font-bold uppercase tracking-wider block">
                1. Reflected XSS
              </span>
              <p className="text-fg font-semibold">Non-Persistent / Request-Echoed</p>
              <p>
                The malicious script is embedded in a client request (such as a search query URL <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">?q=...</code>)
                and echoed immediately in the web server's response page without sanitization.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-page border border-white/12 space-y-1.5">
              <span className="font-mono text-accent text-[11px] font-bold uppercase tracking-wider block">
                2. Stored XSS
              </span>
              <p className="text-fg font-semibold">Persistent / Database-Stored</p>
              <p>
                The payload is permanently saved to the server's database (e.g. user comments, profile biographies, forum posts)
                and rendered to every user who subsequently loads the affected page.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-page border border-white/12 space-y-1.5">
              <span className="font-mono text-accent text-[11px] font-bold uppercase tracking-wider block">
                3. DOM-Based XSS
              </span>
              <p className="text-fg font-semibold">Client-Side Sink Execution</p>
              <p>
                The vulnerability exists entirely in client-side JavaScript. Untrusted data from a source (like <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">location.hash</code>)
                is passed directly to an execution sink (like <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">element.innerHTML</code>) without server involvement.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.04] border border-white/12 text-xs flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <div className="text-muted leading-relaxed">
              <strong className="text-fg block mb-0.5">Strict Security Sandbox Contract:</strong>
              This playground runs completely within a sandboxed React component. No student-supplied JavaScript
              is ever executed, and <code className="font-mono text-fg">dangerouslySetInnerHTML</code> is never called on user input.
              You will safely observe how modern frameworks neutralize markup by treating input as inert data.
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={startLab}
            className="card-interactive inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm shadow-sm transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Begin XSS Playground</span>
          </button>
        </div>
      </LabLayout>
    );
  }

  // ── Completion State View ──
  if (completed) {
    return (
      <LabLayout
        title="XSS Playground"
        category="Injection"
        difficulty="Beginner"
        mentorContext={{
          labId: "xss-playground",
          topic: "Browser Security & XSS",
          currentStep: TOTAL_STEPS,
          totalSteps: TOTAL_STEPS,
        }}
      >
        <LabCompletionSummary
          labTitle="XSS Playground"
          xpAwarded={xpAwarded}
          skills={[
            "Reflected vs. Stored vs. DOM XSS taxonomy",
            "Safe text node rendering vs. innerHTML sinks",
            "Contextual HTML output encoding",
            "Content Security Policy (CSP) implementation",
            "HttpOnly cookie session hardening",
          ]}
          nextLab={{ href: "/labs/idor-investigation", label: "Next Lab: IDOR Investigation" }}
          relatedLesson={{ href: "/learn/web-security/cross-site-scripting-web", label: "Read XSS Curriculum Lesson" }}
          onRetry={resetEntireLab}
          isPracticeOnly={true}
        />

        {/* Detailed Real-world Defense Debrief */}
        <div className="rounded-xl border border-white/12 bg-surface p-6 space-y-4 mb-6">
          <h3 className="text-base font-bold text-fg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span>Defensive Engineering: How Modern Teams Prevent XSS</span>
          </h3>

          <div className="space-y-3 text-xs text-muted leading-relaxed">
            <p>
              <strong className="text-fg">1. Context-Aware Output Encoding (Primary Defense):</strong> Always encode untrusted
              data before placing it into the document. Modern frameworks (React, Vue, Angular) escape interpolated text nodes automatically.
              Avoid bypassing framework protections with APIs like <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">dangerouslySetInnerHTML</code>.
            </p>
            <p>
              <strong className="text-fg">2. Content Security Policy (CSP) (Defense-in-Depth):</strong> Set the <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">Content-Security-Policy</code> HTTP
              response header to restrict which script sources the browser may execute. A strong policy disallows inline scripts
              (<code className="bg-page px-1 py-0.5 rounded text-fg font-mono">'unsafe-inline'</code>) and prevents unauthorized domains from executing scripts.
            </p>
            <p>
              <strong className="text-fg">3. HttpOnly Session Cookies:</strong> Set the <code className="bg-page px-1 py-0.5 rounded text-fg font-mono">HttpOnly</code> flag
              on sensitive session and authentication cookies. This ensures JavaScript (<code className="bg-page px-1 py-0.5 rounded text-fg font-mono">document.cookie</code>) cannot
              read the cookie even if an XSS vulnerability occurs elsewhere on the domain.
            </p>
          </div>
        </div>
      </LabLayout>
    );
  }

  // ── Active Interactive Challenge Steps View ──
  return (
    <LabLayout
      title="XSS Playground"
      category="Injection"
      difficulty="Beginner"
      estimatedTime="20–25 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
      mentorContext={{
        labId: "xss-playground",
        topic: "Browser Security & XSS",
        currentStep,
        totalSteps: TOTAL_STEPS,
        learningObjectives: [
          "Identify unsafe rendering sinks in code",
          "Distinguish safe text output from HTML interpretation",
          "Classify Reflected, Stored, and DOM-based XSS",
          "Select comprehensive XSS mitigations",
        ],
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          TASK 1: Identifying Unsafe Rendering Patterns
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 1 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={1} title="Task 1: Identifying Unsafe Rendering Sinks in Code">
            <p>
              In web applications, vulnerabilities occur when untrusted data reaches an <strong>execution sink</strong>—an
              API that instructs the browser's parser to interpret a string as executable HTML markup instead of plain text.
            </p>

            {/* Code comparison illustration */}
            <div className="grid md:grid-cols-2 gap-4 my-3 font-mono text-xs">
              <div className="rounded-xl bg-page border border-danger/40 p-4 space-y-2">
                <span className="text-danger font-bold flex items-center gap-1.5 font-sans">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Vulnerable: Unsafe innerHTML Sink
                </span>
                <p className="text-faint">// Untrusted input directly parsed as HTML</p>
                <div className="bg-white/[0.04] p-2.5 rounded text-fg overflow-x-auto leading-relaxed">
                  <span className="text-warning">function</span> renderComment(comment) &#123;<br />
                  &nbsp;&nbsp;<span className="text-faint">// Unsafe DOM sink!</span><br />
                  &nbsp;&nbsp;document.getElementById(<span className="text-accent">"box"</span>).<span className="text-danger font-bold">innerHTML</span> = <span className="text-accent">"&lt;p&gt;"</span> + comment + <span className="text-accent">"&lt;/p&gt;"</span>;<br />
                  &#125;
                </div>
                <p className="text-[11px] text-muted font-sans">
                  The browser treats tags like <code className="text-fg">&lt;script&gt;</code> or <code className="text-fg">&lt;img onerror=...&gt;</code> as active markup.
                </p>
              </div>

              <div className="rounded-xl bg-page border border-white/12 p-4 space-y-2">
                <span className="text-accent font-bold flex items-center gap-1.5 font-sans">
                  <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                  Secure: Safe Text Node Interpolation
                </span>
                <p className="text-faint">// Data treated strictly as inert text</p>
                <div className="bg-white/[0.04] p-2.5 rounded text-fg overflow-x-auto leading-relaxed">
                  <span className="text-warning">function</span> CommentCard(&#123; comment &#125;) &#123;<br />
                  &nbsp;&nbsp;<span className="text-faint">// React text node escaping</span><br />
                  &nbsp;&nbsp;<span className="text-warning">return</span> &lt;<span className="text-accent">p</span>&gt;&#123;<span className="text-fg font-bold">comment</span>&#125;&lt;/<span className="text-accent">p</span>&gt;;<br />
                  &#125;
                </div>
                <p className="text-[11px] text-muted font-sans">
                  The browser generates a DOM Text node. Any <code className="text-fg">&lt;</code> or <code className="text-fg">&gt;</code> is rendered as visible text, never executed.
                </p>
              </div>
            </div>
          </LabInstructions>

          <KnowledgeCheck
            question="Task 1 Check: Why does assigning user-supplied strings directly to element.innerHTML create a security vulnerability?"
            options={[
              {
                id: "a",
                text: "Because innerHTML converts HTTP requests into unencrypted network packets.",
              },
              {
                id: "b",
                text: "Because innerHTML triggers the browser's HTML parser on the string, allowing injected script tags or event handlers to execute in the victim's session.",
              },
              {
                id: "c",
                text: "Because innerHTML automatically sends user input to an external search indexer.",
              },
              {
                id: "d",
                text: "Because innerHTML only works when the user is logged in as an administrator.",
              },
            ]}
            correctId="b"
            explanation="The innerHTML property treats any passed string as raw markup. If the string contains HTML elements like <img src=x onerror=...> or SVG script blocks, the browser parses and executes the embedded code within the origin's security context."
            wrongExplanation={{
              a: "innerHTML is a client-side DOM property. It does not alter network transport encryption or TLS.",
              c: "innerHTML does not broadcast data to external search engines; the vulnerability occurs inside the user's local browser DOM.",
              d: "innerHTML is standard JavaScript DOM API available on all HTML elements regardless of user privileges.",
            }}
            onCorrect={() => setTask1Passed(true)}
          />

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
          TASK 2: Safe Interactive Comment & Preview Simulation
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 2 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={2} title="Task 2: Testing Safe Text Rendering vs. HTML Interpretation">
            <p>
              Interact with the <strong>ApexSec Community Hub</strong> simulation below. Try typing a comment containing
              an HTML tag or script tag (for example: <code className="bg-raised px-1 py-0.5 rounded text-accent font-mono">&lt;script&gt;alert(1)&lt;/script&gt;</code> or <code className="bg-raised px-1 py-0.5 rounded text-accent font-mono">&lt;img src=x onerror=alert('xss')&gt;</code>).
            </p>
            <p>
              Observe the two tabs in the previewer:
            </p>
            <ul className="space-y-1 text-xs text-muted list-disc ml-5">
              <li>
                <strong className="text-fg">Safe Text Rendering:</strong> Shows how React's text node interpolation renders your input as safe, harmless literal text on screen.
              </li>
              <li>
                <strong className="text-fg">Safe Illustrative Comparison:</strong> Explains conceptually what an insecure browser would have attempted without executing any live student script.
              </li>
            </ul>
          </LabInstructions>

          <SimulatedTarget label="ApexSec Community Hub (Interactive Preview Simulation)">
            {/* Target Tab Navigation */}
            <div className="flex items-center justify-between border-b border-white/12 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActivePreviewMode("safe")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreviewMode === "safe"
                      ? "bg-accent text-on-accent shadow-sm"
                      : "bg-surface hover:bg-raised text-muted hover:text-fg border border-white/12"
                  }`}
                >
                  Safe Text Rendering (Active)
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewMode("illustrative")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activePreviewMode === "illustrative"
                      ? "bg-accent text-on-accent shadow-sm"
                      : "bg-surface hover:bg-raised text-muted hover:text-fg border border-white/12"
                  }`}
                >
                  Illustrative Flaw Comparison
                </button>
              </div>

              <button
                type="button"
                onClick={resetTargetComments}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/12 text-xs text-muted hover:text-fg hover:border-white/28 transition-colors"
                title="Reset simulation comments"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Preview</span>
              </button>
            </div>

            {/* Mode 1: Safe Text Rendering View */}
            {activePreviewMode === "safe" ? (
              <div className="space-y-4">
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {postedComments.map((c) => (
                    <div key={c.id} className="p-3.5 rounded-lg bg-page border border-white/12 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-fg font-mono">{c.author}</span>
                        <span className="text-[10px] text-faint">Safe Text Node</span>
                      </div>
                      {/* Strictly rendered as a React text node — never interpreted as HTML */}
                      <p className="text-xs text-fg break-all font-mono leading-relaxed bg-white/[0.02] p-2 rounded">
                        {c.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Form to submit test input */}
                <form onSubmit={handlePostComment} className="space-y-3 pt-2 border-t border-white/12">
                  <div>
                    <label htmlFor="test-comment-input" className="block text-xs text-muted mb-1 font-medium">
                      Post a test comment or payload:
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="test-comment-input"
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Try: <script>alert(1)</script> or <img src=x onerror=alert('test')>"
                        autoComplete="off"
                        maxLength={200}
                        className="flex-1 px-3 py-2 rounded-lg border border-white/12 bg-page text-xs text-fg placeholder:text-faint focus-visible:border-white/40 focus-visible:outline-none transition-colors font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-accent text-on-accent text-xs font-semibold hover:bg-accent-hover transition-colors shrink-0"
                      >
                        Preview & Post
                      </button>
                    </div>
                  </div>

                  {/* Real-time Entity Escaping Inspector */}
                  {commentInput && (
                    <div className="p-2.5 rounded-lg bg-page border border-white/12 text-xs font-mono space-y-1">
                      <span className="text-faint block font-sans text-[11px]">// Contextual Output Encoding Inspection:</span>
                      <div className="text-muted text-[11px] break-all">
                        <span>Original Input: </span>
                        <span className="text-fg">{commentInput}</span>
                      </div>
                      <div className="text-accent text-[11px] break-all">
                        <span>Browser HTML Entity Representation: </span>
                        <span className="font-semibold">{getEscapedEntities(commentInput)}</span>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              /* Mode 2: Safe Illustrative Comparison */
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-lg bg-page border border-danger/40 space-y-2">
                  <div className="flex items-center gap-2 text-danger font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Insecure Application Simulation (What Would Happen)</span>
                  </div>
                  <p className="text-muted leading-relaxed">
                    If an insecure application passed a comment containing <code className="bg-raised px-1 py-0.5 rounded text-fg font-mono">&lt;img src="x" onerror="alert(document.cookie)"&gt;</code> to <code className="bg-raised px-1 py-0.5 rounded text-danger font-mono">innerHTML</code>:
                  </p>
                  <ol className="list-decimal ml-5 space-y-1 text-muted">
                    <li>The browser's HTML parser creates an <code className="text-fg font-mono">&lt;img&gt;</code> element and attempts to fetch source <code className="text-fg font-mono">"x"</code>.</li>
                    <li>Image loading fails immediately, triggering the inline <code className="text-danger font-mono">onerror</code> event handler.</li>
                    <li>The embedded JavaScript executes in the context of the victim's session, granting access to local storage, cookies, and DOM state.</li>
                  </ol>
                </div>

                <div className="p-3.5 rounded-lg bg-white/[0.04] border border-white/12 text-xs text-muted">
                  <span className="font-semibold text-fg block mb-1">Why React Prevents This:</span>
                  In this playground, React uses standard DOM <code className="font-mono text-fg">document.createTextNode()</code> under the hood. The browser is never asked to parse the input as markup, completely neutralizing the attack vector.
                </div>
              </div>
            )}
          </SimulatedTarget>

          {/* Feedback banner once student tests a tag */}
          {tagDemonstrated && (
            <ChallengeFeedback
              type="success"
              title="Safe Rendering Observed"
              message="Your HTML tag was escaped into literal visible characters on screen. The browser did not parse it as active markup, and no scripts executed."
            />
          )}

          <KnowledgeCheck
            question="Task 2 Check: What is the key difference between element.textContent and element.innerHTML when displaying user input?"
            options={[
              {
                id: "a",
                text: "textContent treats the string strictly as data in a text node, whereas innerHTML invokes the HTML parser to construct DOM elements.",
              },
              {
                id: "b",
                text: "textContent deletes any single quotes, whereas innerHTML keeps them.",
              },
              {
                id: "c",
                text: "innerHTML is only available in backend Node.js applications.",
              },
              {
                id: "d",
                text: "textContent automatically encrypts the string using TLS.",
              },
            ]}
            correctId="a"
            explanation="textContent sets the text content of the node directly. The browser treats every character literally and does not parse tags. innerHTML forces the browser's parser to interpret tags, allowing injected scripts to execute."
            wrongExplanation={{
              b: "textContent does not delete quotes or modify characters; it preserves the exact string data without parsing tags.",
              c: "innerHTML is a standard web browser DOM API property.",
              d: "textContent is a DOM property; it has nothing to do with TLS network encryption.",
            }}
            onCorrect={() => setTask2Passed(true)}
          />

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
          TASK 3: Classifying Reflected, Stored, and DOM-Based XSS
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 3 && (
        <div className="space-y-6 mb-10 pb-10 border-b border-white/12">
          <LabInstructions step={3} title="Task 3: Classifying Reflected, Stored, and DOM XSS Scenarios">
            <p>
              Different types of XSS originate from different application architectures. Security engineers must accurately
              classify each vulnerability to apply the correct fix at the right layer of the application.
            </p>
          </LabInstructions>

          <KnowledgeCheck
            question="Scenario Check: A user submits a support ticket through a public contact form. When an administrator later logs into the internal helpdesk dashboard to read the ticket, an injected script in the ticket description executes in the administrator's browser. What type of XSS is this?"
            options={[
              {
                id: "a",
                text: "Reflected XSS — because the input was reflected back into the administrator's browser.",
              },
              {
                id: "b",
                text: "Stored (Persistent) XSS — because the payload was stored in the backend database and later executed when retrieved by another user.",
              },
              {
                id: "c",
                text: "DOM-based XSS — because client-side JavaScript was used to submit the form.",
              },
              {
                id: "d",
                text: "Cross-Site Request Forgery (CSRF) — because the request was sent to a support dashboard.",
              },
            ]}
            correctId="b"
            explanation="This is Stored (Persistent) XSS. The malicious payload was persisted in the database upon ticket creation and subsequently executed when the admin viewed the saved record."
            wrongExplanation={{
              a: "Reflected XSS occurs when input from the immediate request is echoed back in the immediate response (like search results). A ticket saved to a database is stored.",
              c: "DOM XSS occurs when client script processes data from a local DOM source (like location.hash) without server storage.",
              d: "CSRF tricks a browser into sending unwanted state-changing requests; it is not the execution of injected script from a stored database record.",
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
          TASK 4: Choosing Comprehensive Remediation
      ───────────────────────────────────────────────────────────── */}
      {currentStep >= 4 && (
        <div className="space-y-6 mb-8">
          <LabInstructions step={4} title="Task 4: Selecting Robust XSS Remediation Strategies">
            <p>
              To complete the lab, determine the comprehensive defensive strategy engineering teams should implement
              to eliminate XSS across the application stack.
            </p>
          </LabInstructions>

          <KnowledgeCheck
            question="Task 4 Check: Which combination of practices represents the most effective defense-in-depth strategy against XSS?"
            options={[
              {
                id: "a",
                text: "Rely solely on stripping the word '<script>' using a regular expression before saving data.",
              },
              {
                id: "b",
                text: "Context-aware output encoding using secure UI frameworks, complemented by a strict Content Security Policy (CSP) and HttpOnly flags on session cookies.",
              },
              {
                id: "c",
                text: "Disable JavaScript completely on all user machines across the internet.",
              },
              {
                id: "d",
                text: "Encrypt all HTML response bodies with a secret AES key that only the server knows.",
              },
            ]}
            correctId="b"
            explanation="Contextual output encoding ensures untrusted characters cannot be interpreted as markup. Adding Content Security Policy (CSP) restricts unauthorized script execution, and HttpOnly cookie flags prevent stolen session identifiers even if a script manages to execute."
            wrongExplanation={{
              a: "Stripping '<script>' is trivially bypassed via event handlers (<img onerror=...>), SVG tags, or alternate encodings.",
              c: "Disabling JavaScript is impractical for modern web applications.",
              d: "The browser must decrypt and parse the HTML to display it; encrypting the response does not prevent the browser from executing injected tags once parsed.",
            }}
            onCorrect={() => setTask4Passed(true)}
          />

          {/* Progressive Hints Section */}
          <HintPanel hints={PROGRESSIVE_HINTS} onHintReveal={handleHintReveal} />

          {/* Complete Lab Action Banner */}
          <div className="p-4 rounded-xl border border-white/12 bg-surface flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent" />
              <div>
                <strong className="text-fg block text-sm">All XSS Learning Objectives Satisfied</strong>
                <span className="text-xs text-muted">
                  Ready to record practice completion and review defensive guidelines.
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
