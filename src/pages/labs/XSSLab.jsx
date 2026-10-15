/**
 * Lab 2: XSS Playground
 * Route: /labs/xss-playground
 *
 * SECURITY CONTRACT:
 * - Student-provided text is rendered using React's default text node interpolation (escaped).
 * - dangerouslySetInnerHTML is NEVER used with untrusted input.
 * - eval, new Function, script injection are NEVER used.
 * - The "unsafe rendered" example uses a hardcoded, static demonstration string — never student input.
 * - Arbitrary HTML or JavaScript from students cannot execute in this component.
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

const TOTAL_STEPS = 4;

const HINTS = [
  "XSS occurs when a web app renders user input as HTML markup rather than plain text. Look at the 'Unsafe Rendering' example — the hardcoded script tag becomes active HTML.",
  "React's JSX uses {value} to render text. This always produces a text node — the browser never parses it as HTML. Try typing <script>alert(1)</script> in the safe panel — it will display as text.",
  "The key difference is context: innerHTML treats the string as markup; textContent (or React's text interpolation) treats it as data. Always use the latter for untrusted content.",
  "Content Security Policy (CSP) is a complementary header-based defence. It restricts which scripts the browser may execute, even if a developer accidentally uses innerHTML.",
];

export default function XSSLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Safe comment panel
  const [commentInput, setCommentInput] = useState("");
  const [postedComments, setPostedComments] = useState([
    { id: 1, author: "alice_defender", text: "Great tutorial on secure coding!" },
  ]);

  // Challenge tracking: student posts something that would be dangerous if rendered as HTML
  const [challengeDone, setChallengeChallengeDone] = useState(false);

  const startLab = async () => {
    setStarted(true);
    if (user?.id) await markLabStarted(user.id, "xss-playground");
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    const text = commentInput.trim();
    if (!text) return;
    setPostedComments((prev) => [
      ...prev,
      { id: Date.now(), author: "you", text },
    ]);
    // Mark challenge done if the student posted something containing a tag
    if (text.includes("<") || text.includes("script")) {
      setChallengeChallengeDone(true);
    }
    setCommentInput("");
  };

  const handleHintReveal = useCallback(async () => {
    if (user?.id) await recordHintUsed(user.id, "xss-playground");
  }, [user?.id]);

  const handleComplete = async () => {
    if (!user?.id) return;
    const result = await markLabComplete(user.id, "xss-playground");
    setXpAwarded(result.xpAwarded || 0);
    setCompleted(true);
  };

  const retry = () => {
    setCommentInput("");
    setPostedComments([{ id: 1, author: "alice_defender", text: "Great tutorial on secure coding!" }]);
    setChallengeChallengeDone(false);
    setCurrentStep(1);
    setCompleted(false);
  };

  // Static hardcoded demonstration of what UNSAFE innerHTML would do
  // This is NOT student input — it is a fixed educational example
  const STATIC_UNSAFE_DEMO = `Hello! <img src="x" onerror="/* script would run here */" /> Nice site!`;
  const STATIC_UNSAFE_LABEL = `Hello! <img src="x" onerror="alert('XSS')" /> Nice site!`;

  if (!started) {
    return (
      <LabLayout title="XSS Playground" category="Injection" difficulty="Beginner" estimatedTime="20–25 min">
        <MissionBriefing
          mission="Understand how unsafe rendering of user-controlled content causes Cross-Site Scripting (XSS). Observe the difference between escaped text rendering and HTML interpretation, and learn effective defences."
          objectives={[
            "Understand the difference between text nodes and HTML markup",
            "Observe how React's default rendering safely escapes user input",
            "See (statically) how unsafe innerHTML would interpret the same content",
            "Apply knowledge of contextual output encoding and safe rendering defences",
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
      <LabLayout title="XSS Playground" category="Injection" difficulty="Beginner">
        <LabCompletionSummary
          labTitle="XSS Playground"
          xpAwarded={xpAwarded}
          skills={["Output encoding", "Safe text rendering", "DOM security", "CSP awareness"]}
          nextLab={{ href: "/labs/idor-investigation", label: "Next: IDOR Investigation" }}
          relatedLesson={{ href: "/learn/web-security/cross-site-scripting-web", label: "XSS Lesson" }}
          onRetry={retry}
          isPracticeOnly
        />
      </LabLayout>
    );
  }

  return (
    <LabLayout
      title="XSS Playground"
      category="Injection"
      difficulty="Beginner"
      estimatedTime="20–25 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
    >
      {/* ── Step 1: What is XSS? ── */}
      {currentStep >= 1 && (
        <>
          <LabInstructions step={1} title="What is Cross-Site Scripting?">
            <p>
              Cross-Site Scripting (XSS) is a vulnerability where an attacker injects malicious
              scripts into web pages viewed by other users. It occurs when user-supplied content is
              rendered as HTML markup rather than as plain text.
            </p>
            <p>Three main types exist:</p>
            <ul className="list-none space-y-1.5 mt-2">
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2f81f7] shrink-0" />
                <span><strong className="text-[#f0f6fc]">Reflected XSS</strong> — the payload is embedded in a URL and reflected in the response.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2f81f7] shrink-0" />
                <span><strong className="text-[#f0f6fc]">Stored XSS</strong> — the payload is saved to the server (e.g., a comment) and rendered to all viewers.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#2f81f7] shrink-0" />
                <span><strong className="text-[#f0f6fc]">DOM-based XSS</strong> — the payload is processed by client-side JavaScript that writes to the DOM unsafely.</span>
              </li>
            </ul>
          </LabInstructions>
          {currentStep === 1 && (
            <div className="flex justify-end mt-2 mb-8">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors">
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 2: Unsafe rendering demonstration (STATIC, hardcoded) ── */}
      {currentStep >= 2 && (
        <>
          <LabInstructions step={2} title="Unsafe Rendering — Static Demonstration">
            <p>
              The panel below shows a <strong>hardcoded, static example</strong> of how a comment
              that contains an <code className="bg-[#21262d] px-1 rounded text-[#a5d6ff]">{"<img onerror=…>"}</code> tag
              would appear if an app used <code className="bg-[#21262d] px-1 rounded text-[#a5d6ff]">innerHTML</code> to
              render untrusted content.
            </p>
            <ChallengeFeedback
              type="info"
              title="No student input is executed here"
              message="The content below is a fixed educational illustration. It is rendered using React's text interpolation — the browser receives escaped text, not live HTML. No JavaScript executes."
            />
          </LabInstructions>

          <SimulatedTarget label="BlogApp — Comment Section (Unsafe innerHTML Demo)">
            <div className="space-y-3">
              <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-3">
                <p className="text-xs text-[#8b949e] mb-1 font-medium">alice_defender</p>
                <p className="text-sm text-[#c9d1d9]">Great tutorial on secure coding!</p>
              </div>
              {/* Hardcoded demonstration — rendered as SAFE text, not HTML */}
              <div className="rounded-lg border border-[#f85149]/40 bg-[#f85149]/8 p-3">
                <p className="text-xs text-[#f85149] mb-1 font-medium">
                  attacker — what they submitted:
                </p>
                <p className="text-xs font-mono text-[#c9d1d9] bg-[#010409] p-2 rounded mb-2 break-all">
                  {STATIC_UNSAFE_LABEL}
                </p>
                <p className="text-xs text-[#8b949e] mb-1">
                  If the app used <code>innerHTML</code>, the browser would execute the onerror handler.
                  Because this panel uses React text interpolation, you see the literal string instead.
                </p>
                {/* Safe text rendering — this IS the safe output */}
                <div className="mt-2 border-t border-[#f85149]/20 pt-2">
                  <p className="text-xs text-[#6e7681] mb-1">✓ What you actually see (safe text node):</p>
                  <p className="text-sm text-[#c9d1d9] break-all">{STATIC_UNSAFE_DEMO}</p>
                </div>
              </div>
            </div>
          </SimulatedTarget>

          {currentStep === 2 && (
            <div className="flex justify-end mb-8">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors">
                Continue →
              </button>
            </div>
          )}
        </>
      )}

      {/* ── Step 3: Safe comment panel (student input) ── */}
      {currentStep >= 3 && (
        <>
          <LabInstructions step={3} title="Challenge — Safe Rendering Panel">
            <p>
              Post a comment below. Try entering HTML tags or a script tag. Notice that the output
              is always displayed as plain text — React's JSX interpolation escapes all markup.
            </p>
            <p>
              This demonstrates <strong>contextual output encoding</strong>: user input placed in an
              HTML context is always escaped before the browser receives it.
            </p>
          </LabInstructions>

          <SimulatedTarget label="BlogApp — Safe Comment Section">
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {postedComments.map((c) => (
                <div key={c.id} className="rounded-lg border border-[#21262d] bg-[#0d1117] p-3">
                  <p className="text-xs text-[#8b949e] mb-1 font-medium">{c.author}</p>
                  {/* Safe: React renders this as a text node, never as HTML */}
                  <p className="text-sm text-[#c9d1d9] break-all">{c.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handlePostComment} className="flex gap-2">
              <label htmlFor="comment-input" className="sr-only">
                Comment text
              </label>
              <input
                id="comment-input"
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder='Try: <script>alert(1)</script>'
                className="flex-1 px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors font-mono"
                maxLength={300}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors shrink-0"
              >
                Post
              </button>
            </form>
          </SimulatedTarget>

          <HintPanel hints={HINTS} onHintReveal={handleHintReveal} />

          {challengeDone && currentStep === 3 && (
            <>
              <ChallengeFeedback
                type="success"
                title="Observation Complete"
                message="Your HTML/script input was rendered as literal text, not executed markup. This is React's default behaviour — and the correct approach for all untrusted content."
              />
              <div className="flex justify-end mb-8">
                <button onClick={() => setCurrentStep(4)} className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors">
                  Continue to Knowledge Check →
                </button>
              </div>
            </>
          )}
          {!challengeDone && currentStep === 3 && (
            <p className="text-xs text-[#8b949e] italic mb-8">
              Post a comment containing an HTML tag (e.g., <code>&lt;script&gt;</code>) to continue.
            </p>
          )}
        </>
      )}

      {/* ── Step 4: Knowledge Check ── */}
      {currentStep >= 4 && (
        <>
          <LabInstructions step={4} title="Knowledge Check" />

          <KnowledgeCheck
            question="A comment form stores user input and later displays it with innerHTML. What type of XSS is this?"
            options={[
              { id: "a", text: "Reflected XSS — the payload is in the URL and echoed back once" },
              { id: "b", text: "Stored XSS — the payload is saved server-side and rendered to all viewers" },
              { id: "c", text: "DOM-based XSS — client-side JS reads from location.hash without sanitization" },
              { id: "d", text: "CSP bypass — the Content-Security-Policy header is missing" },
            ]}
            correctId="b"
            explanation="When a comment is saved to the server and later rendered to any visitor via innerHTML, it is Stored (Persistent) XSS. Every user who loads the page receives the malicious markup."
            wrongExplanation={{
              a: "Reflected XSS requires the payload to be part of the request (usually a URL parameter) and is reflected immediately in the response — it is not stored.",
              c: "DOM-based XSS involves client-side JavaScript writing untrusted data to the DOM (e.g., reading from location.hash). A server-stored comment is not DOM-based.",
              d: "Missing CSP makes exploitation easier, but it is not a type of XSS. The vulnerability is the innerHTML usage itself.",
            }}
          />

          <KnowledgeCheck
            question="Which of the following BEST prevents XSS when displaying user-generated content in HTML?"
            options={[
              { id: "a", text: "Removing the <script> tag from user input with a blocklist" },
              { id: "b", text: "Using contextual output encoding / escaping before inserting into HTML" },
              { id: "c", text: "Enforcing HTTPS so the response cannot be tampered with" },
              { id: "d", text: "Storing the content in a database instead of a flat file" },
            ]}
            correctId="b"
            explanation={'Contextual output encoding converts characters like <, >, and " into their HTML entities (&lt;, &gt;, &quot;) so the browser treats them as text, not markup. React\'s JSX does this automatically via text nodes.'}
            wrongExplanation={{
              a: "Blocklisting <script> is easily bypassed with event handlers (onerror, onload), SVG elements, or alternate encodings. Always encode output rather than block input patterns.",
              c: "HTTPS encrypts the connection. It does not prevent XSS, which is a server-rendering vulnerability.",
              d: "Where data is stored has no bearing on XSS. The vulnerability is in how the data is rendered in the browser.",
            }}
          />

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
              message="Sign in to persist your lab completion to your profile."
            />
          )}
        </>
      )}
    </LabLayout>
  );
}
