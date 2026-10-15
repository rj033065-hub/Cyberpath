/**
 * Lab 3: IDOR Investigation
 * Route: /labs/idor-investigation
 *
 * SECURITY CONTRACT:
 * - All user records are static, in-memory fictional data — no Supabase queries are made.
 * - No real student data is read or enumerated.
 * - The "current user" is a fictional persona, independent of the authenticated CyberPath user.
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
import { User, FileText, AlertTriangle, Lock } from "lucide-react";

// ── All fictional, static, in-memory data ───────────────────────────────────
const FICTIONAL_CURRENT_USER = { id: 1001, name: "Jordan Kim", email: "jordan@traininglab.local" };

const FICTIONAL_RECORDS = [
  { id: 1001, owner_id: 1001, title: "Jordan Kim's Security Report", content: "Confidential: quarterly pen-test findings for TrainingCorp." },
  { id: 1002, owner_id: 1002, title: "Alex Rivera's Security Report", content: "Confidential: Alex's endpoint audit results — not authorised for Jordan." },
  { id: 1003, owner_id: 1003, title: "Sam Chen's Security Report",  content: "Confidential: Sam's incident response notes — not authorised for Jordan." },
  { id: 1004, owner_id: 1001, title: "Jordan Kim's Incident Notes",  content: "Jordan's second document — authorised." },
];

const TOTAL_STEPS = 3;

const HINTS = [
  "Look at the record IDs available: 1001–1004. Jordan's user ID is 1001. Which records does Jordan own?",
  "An IDOR occurs when a server returns record 1002 or 1003 to Jordan simply because she requested that ID — without checking owner_id === current user's ID.",
  "The fix is server-side authorization: before returning a record, verify that auth.uid() === owner_id. The object's ID is not proof of permission.",
  "Deny-by-default means: if no explicit grant exists, access is refused. Never rely on the client hiding UI elements as a security control.",
];

export default function IDORLab() {
  const { user } = useAuth();
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(0);

  // Simulated vulnerable panel
  const [selectedId, setSelectedId] = useState(null);
  const [vulnRecord, setVulnRecord] = useState(null);
  const [vulnAccessed, setVulnAccessed] = useState(false);

  // Safe panel
  const [safeSelectedId, setSafeSelectedId] = useState(null);
  const [safeRecord, setSafeRecord] = useState(null);
  const [safeDenied, setSafeDenied] = useState(false);

  const startLab = async () => {
    setStarted(true);
    if (user?.id) await markLabStarted(user.id, "idor-investigation");
  };

  // Vulnerable: returns any record by ID with no ownership check
  const handleVulnFetch = () => {
    const rec = FICTIONAL_RECORDS.find((r) => r.id === Number(selectedId));
    setVulnRecord(rec || null);
    if (rec && rec.owner_id !== FICTIONAL_CURRENT_USER.id) {
      setVulnAccessed(true);
    }
  };

  // Safe: only returns records owned by the fictional current user
  const handleSafeFetch = () => {
    const rec = FICTIONAL_RECORDS.find((r) => r.id === Number(safeSelectedId));
    if (!rec) { setSafeRecord(null); setSafeDenied(false); return; }
    if (rec.owner_id === FICTIONAL_CURRENT_USER.id) {
      setSafeRecord(rec);
      setSafeDenied(false);
    } else {
      setSafeRecord(null);
      setSafeDenied(true);
    }
  };

  const handleHintReveal = useCallback(async () => {
    if (user?.id) await recordHintUsed(user.id, "idor-investigation");
  }, [user?.id]);

  const handleComplete = async () => {
    if (!user?.id) return;
    const result = await markLabComplete(user.id, "idor-investigation");
    setXpAwarded(result.xpAwarded || 0);
    setCompleted(true);
  };

  const retry = () => {
    setSelectedId(null); setVulnRecord(null); setVulnAccessed(false);
    setSafeSelectedId(null); setSafeRecord(null); setSafeDenied(false);
    setCurrentStep(1); setCompleted(false);
  };

  if (!started) {
    return (
      <LabLayout title="IDOR Investigation" category="Access Control" difficulty="Beginner" estimatedTime="15–20 min">
        <MissionBriefing
          mission="Investigate a fictional profile-record application where records are returned based on their ID alone, without verifying whether the requesting user is authorized to access them. Identify the flaw and select the correct remediation."
          objectives={[
            "Understand the difference between identifying a resource and being authorized to access it",
            "Demonstrate how IDOR allows access to another user's record",
            "Observe server-side ownership enforcement preventing the same access",
            "Apply knowledge of deny-by-default and object-level authorization",
          ]}
          estimatedTime="15–20 minutes"
        />
        <div className="flex justify-center">
          <button onClick={startLab} className="px-6 py-3 rounded-lg bg-[#2f81f7] text-white font-semibold hover:bg-[#388bfd] transition-colors">
            Begin Lab
          </button>
        </div>
      </LabLayout>
    );
  }

  if (completed) {
    return (
      <LabLayout title="IDOR Investigation" category="Access Control" difficulty="Beginner">
        <LabCompletionSummary
          labTitle="IDOR Investigation"
          xpAwarded={xpAwarded}
          skills={["Object-level authorization", "Deny-by-default", "IDOR identification"]}
          nextLab={{ href: "/labs/auth-checkpoint", label: "Next: Authentication Checkpoint" }}
          relatedLesson={{ href: "/learn/web-security/access-control-vulnerabilities", label: "Access Control Lesson" }}
          onRetry={retry}
          isPracticeOnly
        />
      </LabLayout>
    );
  }

  return (
    <LabLayout
      title="IDOR Investigation"
      category="Access Control"
      difficulty="Beginner"
      estimatedTime="15–20 min"
      totalSteps={TOTAL_STEPS}
      currentStep={currentStep}
    >
      {/* ── Step 1: Concept ── */}
      {currentStep >= 1 && (
        <>
          <LabInstructions step={1} title="What is IDOR?">
            <p>
              <strong>Insecure Direct Object Reference (IDOR)</strong> is an access-control
              vulnerability. It occurs when an application exposes a reference to an internal
              object (like a database record ID) and does not verify whether the requesting user
              is <em>authorized</em> to access that specific object.
            </p>
            <p>
              Knowing a record's ID is not the same as being permitted to read it. A secure system
              must verify on the server: <em>"Does this authenticated user own or have explicit
              permission to access record X?"</em>
            </p>

            {/* Fictional system context */}
            <div className="mt-4 rounded-lg bg-[#010409] border border-[#21262d] p-4 text-xs font-mono leading-relaxed">
              <p className="text-[#6e7681] mb-1">// Fictional TrainingApp — vulnerable endpoint</p>
              <p className="text-[#a5d6ff]">{"GET /api/records/:id"}</p>
              <p className="text-[#6e7681] mt-2 mb-1">// Server code (vulnerable):</p>
              <p className="text-[#f0f6fc]">{"const record = db.query(\"SELECT * FROM records WHERE id = $1\", [id]);"}</p>
              <p className="text-[#f0f6fc]">{"return res.json(record); // ← no ownership check!"}</p>
              <p className="text-[#6e7681] mt-3 mb-1">// Server code (secure):</p>
              <p className="text-[#3fb950]">{"const record = db.query(\"SELECT * FROM records WHERE id = $1 AND owner_id = $2\", [id, req.user.id]);"}</p>
              <p className="text-[#3fb950]">{"if (!record) return res.status(403).json({ error: 'Access denied' });"}</p>
            </div>

            <div className="mt-3 rounded-lg border border-[#21262d] p-3 bg-[#0d1117]">
              <p className="text-xs text-[#8b949e]">
                <strong className="text-[#f0f6fc]">Fictional scenario:</strong> You are logged in as{" "}
                <strong className="text-[#58a6ff]">Jordan Kim (user ID 1001)</strong>.
                The app has records with IDs 1001–1004. Jordan owns records 1001 and 1004.
                Records 1002 and 1003 belong to other fictional users.
              </p>
            </div>
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

      {/* ── Step 2: Challenge ── */}
      {currentStep >= 2 && (
        <>
          <LabInstructions step={2} title="Challenge — Explore Both Panels">
            <p>
              Use the <strong>Vulnerable</strong> panel to request a record by ID. Then use the{" "}
              <strong>Secure</strong> panel to observe that unauthorized records are blocked.
              Try record IDs 1001–1004 in both panels.
            </p>
          </LabInstructions>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {/* Vulnerable panel */}
            <SimulatedTarget label="Vulnerable — No Ownership Check">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                  <User className="w-3.5 h-3.5" />
                  Logged in as: <strong className="text-[#f0f6fc]">{FICTIONAL_CURRENT_USER.name}</strong>
                </div>
                <div>
                  <label htmlFor="vuln-record-id" className="block text-xs text-[#8b949e] mb-1">
                    Record ID
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="vuln-record-id"
                      value={selectedId || ""}
                      onChange={(e) => setSelectedId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] focus-visible:border-[#f85149]/40 focus-visible:outline-none transition-colors"
                    >
                      <option value="">Select ID…</option>
                      {FICTIONAL_RECORDS.map((r) => (
                        <option key={r.id} value={r.id}>{r.id}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleVulnFetch}
                      disabled={!selectedId}
                      className="px-3 py-2 rounded-lg bg-[#f85149]/15 border border-[#f85149]/40 text-[#f85149] text-sm font-semibold hover:bg-[#f85149]/25 disabled:opacity-40 transition-colors"
                    >
                      Fetch
                    </button>
                  </div>
                </div>
                {vulnRecord && (
                  <div className={`rounded-lg border p-3 ${vulnRecord.owner_id !== FICTIONAL_CURRENT_USER.id ? "border-[#f85149]/40 bg-[#f85149]/8" : "border-[#21262d] bg-[#0d1117]"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      {vulnRecord.owner_id !== FICTIONAL_CURRENT_USER.id && <AlertTriangle className="w-3.5 h-3.5 text-[#f85149]" />}
                      <p className="text-xs font-semibold text-[#f0f6fc]">{vulnRecord.title}</p>
                    </div>
                    <p className="text-xs text-[#8b949e]">{vulnRecord.content}</p>
                    {vulnRecord.owner_id !== FICTIONAL_CURRENT_USER.id && (
                      <p className="text-[10px] text-[#f85149] mt-1">⚠ This record belongs to another user — IDOR!</p>
                    )}
                  </div>
                )}
              </div>
            </SimulatedTarget>

            {/* Safe panel */}
            <SimulatedTarget label="Secure — Ownership Check Enforced">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-[#8b949e]">
                  <User className="w-3.5 h-3.5" />
                  Logged in as: <strong className="text-[#f0f6fc]">{FICTIONAL_CURRENT_USER.name}</strong>
                </div>
                <div>
                  <label htmlFor="safe-record-id" className="block text-xs text-[#8b949e] mb-1">
                    Record ID
                  </label>
                  <div className="flex gap-2">
                    <select
                      id="safe-record-id"
                      value={safeSelectedId || ""}
                      onChange={(e) => setSafeSelectedId(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-[#30363d] bg-[#0d1117] text-sm text-[#f0f6fc] focus-visible:border-[#3fb950]/40 focus-visible:outline-none transition-colors"
                    >
                      <option value="">Select ID…</option>
                      {FICTIONAL_RECORDS.map((r) => (
                        <option key={r.id} value={r.id}>{r.id}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleSafeFetch}
                      disabled={!safeSelectedId}
                      className="px-3 py-2 rounded-lg bg-[#3fb950]/15 border border-[#3fb950]/40 text-[#3fb950] text-sm font-semibold hover:bg-[#3fb950]/25 disabled:opacity-40 transition-colors"
                    >
                      Fetch
                    </button>
                  </div>
                </div>
                {safeRecord && (
                  <div className="rounded-lg border border-[#3fb950]/30 bg-[#3fb950]/8 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-3.5 h-3.5 text-[#3fb950]" />
                      <p className="text-xs font-semibold text-[#f0f6fc]">{safeRecord.title}</p>
                    </div>
                    <p className="text-xs text-[#8b949e]">{safeRecord.content}</p>
                    <p className="text-[10px] text-[#3fb950] mt-1">✓ Authorized access</p>
                  </div>
                )}
                {safeDenied && (
                  <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-3 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#8b949e] shrink-0" />
                    <p className="text-xs text-[#8b949e]">403 — Access denied. You are not authorized for this record.</p>
                  </div>
                )}
              </div>
            </SimulatedTarget>
          </div>

          <HintPanel hints={HINTS} onHintReveal={handleHintReveal} />

          {vulnAccessed && currentStep === 2 && (
            <>
              <ChallengeFeedback
                type="success"
                title="IDOR Identified"
                message="You accessed a record belonging to another fictional user via the vulnerable panel. The same request in the secure panel is denied — because ownership is checked server-side."
              />
              <div className="flex justify-end mb-8">
                <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-lg bg-[#2f81f7] text-white text-sm font-semibold hover:bg-[#388bfd] transition-colors">
                  Continue to Knowledge Check →
                </button>
              </div>
            </>
          )}
          {!vulnAccessed && currentStep === 2 && (
            <p className="text-xs text-[#8b949e] italic mb-8">
              Fetch a record you don't own (ID 1002 or 1003) from the vulnerable panel to continue.
            </p>
          )}
        </>
      )}

      {/* ── Step 3: Knowledge Check ── */}
      {currentStep >= 3 && (
        <>
          <LabInstructions step={3} title="Knowledge Check" />

          <KnowledgeCheck
            question="A user changes /api/records/1001 to /api/records/1002 and receives another user's private data. What best describes the root cause?"
            options={[
              { id: "a", text: "The application did not use HTTPS, so the request was intercepted." },
              { id: "b", text: "The server returned the record based on its ID alone, without checking whether the requesting user owns it." },
              { id: "c", text: "The front-end hid the link to record 1002 in the UI, but the back-end had no restriction." },
              { id: "d", text: "The database did not have Row Level Security enabled." },
            ]}
            correctId="b"
            explanation="IDOR's root cause is always missing server-side authorization. The server returned data based solely on the object's identifier without verifying ownership or permission. Front-end hiding (C) and missing RLS (D) are contributing factors or symptoms, but the fundamental flaw is the absent authorization check in application logic."
            wrongExplanation={{
              a: "HTTPS protects data in transit. The vulnerability is in the server's authorization logic, not encryption.",
              c: "This is partly true (hiding links is security by obscurity), but the root cause is that the server itself lacks an ownership check. Both are problems, but the server-side check is the authoritative control.",
              d: "Database RLS is one enforcement layer, but the primary fix must be in application logic. Many stacks don't use RLS at all and still secure IDOR correctly through service-layer checks.",
            }}
          />

          <KnowledgeCheck
            question="Which statement best describes the correct defence against IDOR?"
            options={[
              { id: "a", text: "Use UUIDs instead of sequential integer IDs so record IDs are hard to guess." },
              { id: "b", text: "Verify on the server that the authenticated user is authorized to access the specific object before returning it." },
              { id: "c", text: "Hide sensitive record links in the front-end and rely on obscurity." },
              { id: "d", text: "Rate-limit the API to prevent enumeration." },
            ]}
            correctId="b"
            explanation="Server-side object-level authorization is the correct defence. For every request, the server must confirm that the authenticated user has an explicit grant to access the specific record. This check must happen in the server or database layer, never in the client."
            wrongExplanation={{
              a: "Unpredictable IDs (UUIDs) reduce enumeration risk but are not access control. A UUID leak from any source (logs, URLs, APIs) still exposes the record if authorization is absent.",
              c: "Security by obscurity is not a valid control. The front-end can be bypassed by anyone with a browser's developer tools or a proxy.",
              d: "Rate-limiting slows enumeration but does not prevent unauthorized access if the authorization check is missing entirely.",
            }}
          />

          {user?.id && !completed && (
            <div className="flex justify-end mt-6">
              <button onClick={handleComplete} className="px-6 py-2.5 rounded-lg bg-[#3fb950] text-[#010409] text-sm font-bold hover:bg-[#46c85a] transition-colors">
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
