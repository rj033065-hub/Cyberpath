import { useState } from "react";
import { ShieldAlert, Search, CheckCircle2, XCircle, RotateCcw, ArrowRight, Filter, Terminal, Info } from "lucide-react";

const MOCK_PACKET_DATASET = [
  { id: 101, time: "14:02:10.104", src: "192.168.1.105", dst: "192.168.1.50", proto: "TCP", port: "21", flags: "[SYN]", info: "Seq=0 Win=1024 Len=0" },
  { id: 102, time: "14:02:10.108", src: "192.168.1.105", dst: "192.168.1.50", proto: "TCP", port: "22", flags: "[SYN]", info: "Seq=0 Win=1024 Len=0" },
  { id: 103, time: "14:02:10.112", src: "192.168.1.105", dst: "192.168.1.50", proto: "TCP", port: "23", flags: "[SYN]", info: "Seq=0 Win=1024 Len=0" },
  { id: 104, time: "14:02:10.116", src: "192.168.1.105", dst: "192.168.1.50", proto: "TCP", port: "25", flags: "[SYN]", info: "Seq=0 Win=1024 Len=0" },
  { id: 105, time: "14:02:12.441", src: "192.168.1.42", dst: "203.0.113.15", proto: "HTTP", port: "80", flags: "[PSH, ACK]", info: "POST /login.php HTTP/1.1 (user=admin&pass=Winter2026!)" },
  { id: 106, time: "14:02:15.890", src: "AA:BB:CC:DD:EE:FF", dst: "FF:FF:FF:FF:FF:FF", proto: "ARP", port: "—", flags: "Gratuitous", info: "ARP Reply: 192.168.1.1 is at AA:BB:CC:DD:EE:FF (Duplicate IP Claim)" },
  { id: 107, time: "14:02:18.201", src: "192.168.1.88", dst: "1.1.1.1", proto: "DNS", port: "53", flags: "Standard Query", info: "A aXNfcGFzc3dvcmRfZXhmaWx0cmF0aW9u.attacker-domain.xyz" },
  { id: 108, time: "14:02:20.550", src: "192.168.1.12", dst: "142.250.190.46", proto: "TLSv1.3", port: "443", flags: "[ACK]", info: "Application Data (Encrypted)" }
];

const DETECTIVE_CASES = [
  {
    caseId: 1,
    title: "Case 1: Automated Port Scan Detection",
    prompt: "A security monitoring alert fired: 'High volume of connection attempts on consecutive low ports.' Inspect the log entries. Which source IP address is conducting an automated port scan?",
    targetRowIds: [101, 102, 103, 104],
    options: [
      { id: "a", text: "192.168.1.105 (Sending rapid TCP SYN packets across ports 21, 22, 23, 25)" },
      { id: "b", text: "192.168.1.42 (Sending HTTP POST request)" },
      { id: "c", text: "1.1.1.1 (Cloudflare DNS Server)" },
      { id: "d", text: "142.250.190.46 (Google HTTPS)" }
    ],
    correctOptionId: "a",
    explanation: "Packets 101-104 show host 192.168.1.105 firing consecutive TCP [SYN] probes to ports 21, 22, 23, and 25 within milliseconds—the signature pattern of an Nmap or Masscan network scan."
  },
  {
    caseId: 2,
    title: "Case 2: Plaintext Credential Exposure",
    prompt: "An employee submitted a web form over unencrypted HTTP. Which packet number exposed their password in cleartext on the wire?",
    targetRowIds: [105],
    options: [
      { id: "a", text: "Packet #101" },
      { id: "b", text: "Packet #105 (POST /login.php with user=admin&pass=Winter2026!)" },
      { id: "c", text: "Packet #108 (Encrypted TLS stream)" },
      { id: "d", text: "Packet #106" }
    ],
    correctOptionId: "b",
    explanation: "Packet #105 uses unencrypted HTTP on port 80. The POST payload exposes credentials `user=admin&pass=Winter2026!` directly in the cleartext TCP payload."
  },
  {
    caseId: 3,
    title: "Case 3: Man-in-the-Middle ARP Poisoning",
    prompt: "Inspect the Layer 2 traffic. Which packet demonstrates a gratuitous ARP spoofing attack impersonating the Default Gateway?",
    targetRowIds: [106],
    options: [
      { id: "a", text: "Packet #103" },
      { id: "b", text: "Packet #106 (ARP Reply claiming 192.168.1.1 is at rogue MAC AA:BB:CC:DD:EE:FF)" },
      { id: "c", text: "Packet #107" },
      { id: "d", text: "Packet #105" }
    ],
    correctOptionId: "b",
    explanation: "Packet #106 contains an unsolicited (gratuitous) ARP reply claiming that the default gateway (192.168.1.1) is now at MAC AA:BB:CC:DD:EE:FF. This poisons the local switch and host ARP tables."
  },
  {
    caseId: 4,
    title: "Case 4: DNS Tunneling & Exfiltration",
    prompt: "Which log entry indicates data exfiltration disguised as standard Domain Name System lookups?",
    targetRowIds: [107],
    options: [
      { id: "a", text: "Packet #108" },
      { id: "b", text: "Packet #107 (A query for 'aXNfcGFzc3dvcmRfZXhmaWx0cmF0aW9u.attacker-domain.xyz')" },
      { id: "c", text: "Packet #102" },
      { id: "d", text: "Packet #104" }
    ],
    correctOptionId: "b",
    explanation: "Packet #107 queries an abnormal subdomain containing base64 data (`aXNfcGFzc3dvcmRfZXhmaWx0cmF0aW9u`, which decodes to 'is_password_exfiltration'). This is classic DNS tunneling used to sneak data past firewalls."
  }
];

export default function PacketDetectiveGame({ onCompleteGame }) {
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [protocolFilter, setProtocolFilter] = useState("ALL");

  const currentCase = DETECTIVE_CASES[currentCaseIdx];

  const filteredLogs = MOCK_PACKET_DATASET.filter((p) => {
    if (protocolFilter === "ALL") return true;
    return p.proto === protocolFilter;
  });

  const handleConfirm = () => {
    if (!selectedOpt || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === currentCase.correctOptionId) {
      setScore((prev) => prev + 35);
    }
  };

  const handleNext = () => {
    if (currentCaseIdx < DETECTIVE_CASES.length - 1) {
      setCurrentCaseIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else if (onCompleteGame) {
      const finalScore = score + (selectedOpt === currentCase.correctOptionId ? 35 : 0);
      onCompleteGame({ gameId: "packet-detective", score: finalScore });
    }
  };

  const handleReset = () => {
    setCurrentCaseIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCorrect = selectedOpt === currentCase.correctOptionId;

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
              Investigation {currentCase.caseId} of {DETECTIVE_CASES.length}
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">{currentCase.title}</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            Score: {score} XP
          </span>
        </div>

        {/* Question Prompt */}
        <div className="p-3.5 rounded-xl bg-page border border-white/10 text-xs text-zinc-300 flex items-start gap-2.5 mb-4">
          <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium text-fg">{currentCase.prompt}</p>
        </div>

        {/* Packet Capture Dataset Viewer */}
        <div className="rounded-xl border border-white/12 bg-page overflow-hidden my-4">
          <div className="flex items-center justify-between px-3 py-2 bg-raised/80 border-b border-white/10 text-xs">
            <span className="font-mono text-zinc-400 text-[11px] flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Captured Network Events (PCAP Stream)</span>
            </span>

            <div className="flex items-center gap-1 text-[11px] font-mono">
              <Filter className="w-3 h-3 text-muted" />
              <select
                value={protocolFilter}
                onChange={(e) => setProtocolFilter(e.target.value)}
                className="bg-transparent text-zinc-300 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-zinc-900">All Protocols</option>
                <option value="TCP" className="bg-zinc-900">TCP Only</option>
                <option value="HTTP" className="bg-zinc-900">HTTP Only</option>
                <option value="ARP" className="bg-zinc-900">ARP Only</option>
                <option value="DNS" className="bg-zinc-900">DNS Only</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto max-h-56 overflow-y-auto font-mono text-[11px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 bg-white/5">
                  <th className="py-1.5 px-3">No.</th>
                  <th className="py-1.5 px-2">Time</th>
                  <th className="py-1.5 px-2">Source</th>
                  <th className="py-1.5 px-2">Destination</th>
                  <th className="py-1.5 px-2">Proto</th>
                  <th className="py-1.5 px-2">Port</th>
                  <th className="py-1.5 px-3">Info</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((row) => {
                  const isHighlighted = currentCase.targetRowIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        isAnswered && isHighlighted
                          ? "bg-cyan-950/40 text-cyan-200"
                          : "text-zinc-300"
                      }`}
                    >
                      <td className="py-1.5 px-3 text-zinc-500 font-semibold">{row.id}</td>
                      <td className="py-1.5 px-2 text-zinc-400">{row.time}</td>
                      <td className="py-1.5 px-2 text-cyan-300 truncate max-w-[120px]">{row.src}</td>
                      <td className="py-1.5 px-2 text-zinc-300 truncate max-w-[120px]">{row.dst}</td>
                      <td className="py-1.5 px-2 text-amber-300 font-semibold">{row.proto}</td>
                      <td className="py-1.5 px-2 text-zinc-400">{row.port}</td>
                      <td className="py-1.5 px-3 truncate max-w-[260px] text-fg">{row.info}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detective Findings Options */}
        <div className="space-y-2 mt-4">
          <span className="text-xs font-mono text-zinc-400 block mb-1">Select Your Forensic Conclusion:</span>
          {currentCase.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            let style = "bg-raised/60 hover:bg-white/5 border-white/10 text-zinc-200";

            if (isAnswered) {
              if (opt.id === currentCase.correctOptionId) {
                style = "bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold";
              } else if (isSelected && opt.id !== currentCase.correctOptionId) {
                style = "bg-red-950/50 border-red-500/60 text-red-200";
              } else {
                style = "bg-raised/30 border-white/5 opacity-50 text-muted";
              }
            } else if (isSelected) {
              style = "bg-cyan-950/50 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50";
            }

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => !isAnswered && setSelectedOpt(opt.id)}
                disabled={isAnswered}
                className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-start gap-3 ${style}`}
              >
                <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[11px] shrink-0 mt-0.5">
                  {opt.id.toUpperCase()}
                </span>
                <span className="leading-relaxed">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation Alert */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border mt-4 text-xs flex items-start gap-2.5 ${
              isCorrect
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/30 border-red-500/50 text-red-200"
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-semibold">{isCorrect ? "Case Solved!" : "Incorrect Analysis"}</p>
              <p className="mt-1 leading-relaxed">{currentCase.explanation}</p>
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
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-black transition-colors"
            >
              Submit Forensic Verdict
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentCaseIdx < DETECTIVE_CASES.length - 1 ? "Next Case" : "Complete Investigation"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
