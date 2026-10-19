import { useState } from "react";
import { Hash, Calculator, CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle, Trophy } from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    tier: "Novice",
    question: "How many USABLE host IP addresses are available in a /24 IPv4 subnet (255.255.255.0)?",
    options: [
      { id: "a", text: "256 hosts" },
      { id: "b", text: "254 hosts" },
      { id: "c", text: "128 hosts" },
      { id: "d", text: "512 hosts" }
    ],
    correctId: "b",
    formula: "2^(32 - 24) - 2 = 2^8 - 2 = 256 - 2 = 254 usable hosts. (The first address is the Network ID; the last is the Broadcast address)."
  },
  {
    id: 2,
    tier: "Novice",
    question: "What is the dotted-decimal subnet mask corresponding to CIDR prefix /26?",
    options: [
      { id: "a", text: "255.255.255.0" },
      { id: "b", text: "255.255.255.128" },
      { id: "c", text: "255.255.255.192" },
      { id: "d", text: "255.255.255.224" }
    ],
    correctId: "c",
    formula: "A /26 mask has 26 ones: 11111111.11111111.11111111.11000000. The last octet binary is 128 + 64 = 192, giving 255.255.255.192."
  },
  {
    id: 3,
    tier: "Intermediate",
    question: "For the subnet 192.168.10.0/28, what is the exact Broadcast IP address?",
    options: [
      { id: "a", text: "192.168.10.15" },
      { id: "b", text: "192.168.10.16" },
      { id: "c", text: "192.168.10.255" },
      { id: "d", text: "192.168.10.31" }
    ],
    correctId: "a",
    formula: "Host bits = 32 - 28 = 4 bits (block size = 2^4 = 16 addresses). Range is 192.168.10.0 to 192.168.10.15. The final address (192.168.10.15) is the Broadcast address."
  },
  {
    id: 4,
    tier: "Intermediate",
    question: "In the subnet 10.50.1.64/26, what is the FIRST usable host IP address?",
    options: [
      { id: "a", text: "10.50.1.1" },
      { id: "b", text: "10.50.1.64" },
      { id: "c", text: "10.50.1.65" },
      { id: "d", text: "10.50.1.126" }
    ],
    correctId: "c",
    formula: "The Network ID is 10.50.1.64. The first usable host address is always Network ID + 1, which equals 10.50.1.65."
  },
  {
    id: 5,
    tier: "Advanced",
    question: "Network engineers need to configure a dedicated point-to-point link between two core routers. Which CIDR prefix provides exactly 2 usable host addresses without wasting IPs?",
    options: [
      { id: "a", text: "/28" },
      { id: "b", text: "/30" },
      { id: "c", text: "/31" },
      { id: "d", text: "/29" }
    ],
    correctId: "b",
    formula: "A /30 prefix leaves 2 host bits: 2^2 = 4 total addresses. Subtracting Network ID and Broadcast leaves exactly 2 usable host IPs (2^2 - 2 = 2), perfect for two interconnected router interfaces."
  },
  {
    id: 6,
    tier: "Advanced",
    question: "An enterprise requires a single subnet capable of hosting at least 500 computers with the minimum number of wasted addresses. Which prefix should be chosen?",
    options: [
      { id: "a", text: "/24 (254 hosts)" },
      { id: "b", text: "/23 (510 usable hosts)" },
      { id: "c", text: "/22 (1,022 usable hosts)" },
      { id: "d", text: "/21 (2,046 usable hosts)" }
    ],
    correctId: "b",
    formula: "A /23 prefix leaves 9 host bits: 2^9 - 2 = 512 - 2 = 510 usable hosts. This satisfies the requirement of >= 500 hosts with minimal overhead."
  }
];

export default function SubnetChallengeGame({ onCompleteGame }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[currentIdx];

  const handleSelect = (id) => {
    if (isAnswered) return;
    setSelectedOpt(id);
  };

  const handleConfirm = () => {
    if (!selectedOpt || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === q.correctId) {
      setScore((prev) => prev + 30);
    }
  };

  const handleNext = () => {
    if (currentIdx < QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else if (onCompleteGame) {
      const finalScore = score + (selectedOpt === q.correctId ? 30 : 0);
      onCompleteGame({ gameId: "subnet-challenge", score: finalScore });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCorrect = selectedOpt === q.correctId;

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">
              Challenge {q.id} of {QUESTIONS.length} · {q.tier} Tier
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">IPv4 Subnet Calculation Gauntlet</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-300">
            Score: {score} XP
          </span>
        </div>

        {/* Question Prompt */}
        <div className="space-y-3 my-4">
          <p className="text-sm font-semibold text-fg flex items-start gap-2">
            <Calculator className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{q.question}</span>
          </p>

          <div className="space-y-2 mt-4">
            {q.options.map((opt) => {
              const isSelected = selectedOpt === opt.id;
              let style = "bg-raised/60 hover:bg-white/5 border-white/10 text-zinc-200";

              if (isAnswered) {
                if (opt.id === q.correctId) {
                  style = "bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold";
                } else if (isSelected && opt.id !== q.correctId) {
                  style = "bg-red-950/50 border-red-500/60 text-red-200";
                } else {
                  style = "bg-raised/30 border-white/5 opacity-50 text-muted";
                }
              } else if (isSelected) {
                style = "bg-emerald-950/50 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50";
              }

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs font-mono transition-all flex items-center gap-3 ${style}`}
                >
                  <span className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[11px] shrink-0">
                    {opt.id.toUpperCase()}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step-by-Step Mathematical Explanation */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border mt-4 text-xs ${
              isCorrect
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/30 border-red-500/50 text-red-200"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-semibold">{isCorrect ? "Correct Calculation!" : "Calculation Error"}</p>
                <div className="mt-2 p-2.5 rounded bg-black/40 border border-white/10 font-mono text-[11px] leading-relaxed">
                  <span className="text-zinc-400 block mb-1">Mathematical Solution:</span>
                  <span className="text-fg">{q.formula}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-4 mt-6 border-t border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 text-xs text-muted hover:text-fg"
          >
            Restart
          </button>

          {!isAnswered ? (
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedOpt}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-black transition-colors"
            >
              Verify Calculation
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentIdx < QUESTIONS.length - 1 ? "Next Challenge" : "Complete Gauntlet"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
