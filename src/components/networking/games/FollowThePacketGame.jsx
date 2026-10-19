import { useState } from "react";
import { ArrowRight, CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy, Globe, Network, ShieldCheck } from "lucide-react";

const CHECKPOINTS = [
  {
    id: 1,
    title: "Checkpoint 1: The Local Client",
    stage: "Browser Address Bar",
    context: "A user types 'https://secure.bank.corp' into their browser. The local OS has never contacted this server before.",
    question: "Before any TCP connection or HTTP request can be transmitted, which protocol MUST execute first?",
    options: [
      { id: "a", text: "DNS (Domain Name System) to resolve the hostname to an IP address" },
      { id: "b", text: "BGP (Border Gateway Protocol) to map global autonomous systems" },
      { id: "c", text: "FTP (File Transfer Protocol) to download server certificates" },
      { id: "d", text: "SNMP (Simple Network Management Protocol) to inspect memory" }
    ],
    correctOptionId: "a",
    explanation: "Routers and operating systems cannot route domain names like 'secure.bank.corp'; they require numerical IP addresses. DNS must resolve the domain before a TCP handshake can begin."
  },
  {
    id: 2,
    title: "Checkpoint 2: The Local Switch",
    stage: "Layer 2 Ethernet Framing",
    context: "The client resolves the target server to public IP 198.51.100.80. The client's own IP is 192.168.1.50/24. The client compares the IPs and realizes the server is on an external network.",
    question: "What destination MAC address does the client place into the Layer 2 Ethernet frame to get the packet off the local switch?",
    options: [
      { id: "a", text: "The target Web Server's MAC address" },
      { id: "b", text: "The Default Gateway Router's MAC address" },
      { id: "c", text: "Broadcast MAC address FF:FF:FF:FF:FF:FF" },
      { id: "d", text: "The Google DNS MAC address" }
    ],
    correctOptionId: "b",
    explanation: "Switches only deliver within the local broadcast domain. To reach any external IP, the client addresses the Layer 2 frame to its Default Gateway's MAC address."
  },
  {
    id: 3,
    title: "Checkpoint 3: The Border Router",
    stage: "Layer 3 Routing & NAT",
    context: "The router receives the frame on its internal interface (192.168.1.1) and prepares to forward it over its WAN link to the public Internet.",
    question: "Because 192.168.1.50 is an RFC 1918 private IP, what transformation must the router perform?",
    options: [
      { id: "a", text: "It converts all binary 1s to 0s to encrypt the packet" },
      { id: "b", text: "Network Address Translation (NAT): Rewrites the Source IP to the router's public WAN IP" },
      { id: "c", text: "It doubles the TTL so the packet survives the ocean cable" },
      { id: "d", text: "It strips the TCP header and sends raw ASCII" }
    ],
    correctOptionId: "b",
    explanation: "Private RFC 1918 IPs cannot route on the public Internet. The router performs NAT/PAT, rewriting the source IP to its routable public IP and recording the translation in its NAT state table."
  },
  {
    id: 4,
    title: "Checkpoint 4: Target Web Server",
    stage: "Layer 4 TCP Handshake",
    context: "The server receives the client's TCP SYN packet with Sequence = 1000. The server replies with SYN-ACK (Seq = 4000, Ack = 1001).",
    question: "What must the client return to transition the TCP connection to the ESTABLISHED state?",
    options: [
      { id: "a", text: "A TCP RST (Reset) packet" },
      { id: "b", text: "A TCP ACK packet with Ack = 4001 (Server Seq + 1)" },
      { id: "c", text: "A new DHCP Discover broadcast" },
      { id: "d", text: "An ICMP Echo Request" }
    ],
    correctOptionId: "b",
    explanation: "To complete the 3-way handshake, the client sends an ACK packet with an acknowledgment number incremented by 1 (Ack = 4001), establishing the full-duplex session."
  },
  {
    id: 5,
    title: "Checkpoint 5: Secure Application Session",
    stage: "Layer 6/7 TLS & HTTPS",
    context: "The TCP connection is ESTABLISHED. The client and server now perform the TLS handshake over port 443.",
    question: "Once public-key asymmetric encryption negotiates a shared master secret, how is subsequent HTTP traffic encrypted?",
    options: [
      { id: "a", text: "Using high-speed symmetric session keys (e.g. AES-GCM)" },
      { id: "b", text: "Traffic reverts to cleartext HTTP for faster download speeds" },
      { id: "c", text: "Using the client's Wi-Fi WPA2 password" },
      { id: "d", text: "By hashing the packets with MD5 without keys" }
    ],
    correctOptionId: "a",
    explanation: "Asymmetric encryption is computationally expensive. TLS uses asymmetric cryptography only to exchange a secret; all bulk HTTP traffic is encrypted using fast symmetric ciphers (e.g. AES or ChaCha20)."
  }
];

export default function FollowThePacketGame({ onCompleteGame }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const checkpoint = CHECKPOINTS[currentIdx];

  const handleSelectOption = (optId) => {
    if (isAnswered) return;
    setSelectedOption(optId);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || isAnswered) return;
    setIsAnswered(true);
    if (selectedOption === checkpoint.correctOptionId) {
      setScore((prev) => prev + 25);
    }
  };

  const handleNextCheckpoint = () => {
    if (currentIdx < CHECKPOINTS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else if (onCompleteGame) {
      const finalScore = score + (selectedOption === checkpoint.correctOptionId ? 25 : 0);
      onCompleteGame({ gameId: "follow-packet", score: finalScore });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCorrect = selectedOption === checkpoint.correctOptionId;

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
              Hop {checkpoint.id} of {CHECKPOINTS.length}
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">{checkpoint.title}</h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-zinc-400">{checkpoint.stage}</span>
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              Score: {score} XP
            </span>
          </div>
        </div>

        {/* Narrative Context */}
        <div className="p-4 rounded-xl bg-page border border-white/10 text-xs text-zinc-300 space-y-2 mb-6">
          <p className="font-semibold text-fg">Current Scenario:</p>
          <p className="leading-relaxed">{checkpoint.context}</p>
        </div>

        {/* Tactical Question */}
        <div className="space-y-3">
          <p className="text-sm font-semibold text-fg flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{checkpoint.question}</span>
          </p>

          <div className="space-y-2">
            {checkpoint.options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              let style = "bg-raised/60 hover:bg-white/5 border-white/10 text-zinc-200";

              if (isAnswered) {
                if (opt.id === checkpoint.correctOptionId) {
                  style = "bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold";
                } else if (isSelected && opt.id !== checkpoint.correctOptionId) {
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
                  onClick={() => handleSelectOption(opt.id)}
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
        </div>

        {/* Detailed Explanation */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border mt-4 text-xs flex items-start gap-3 ${
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
              <p className="font-semibold">{isCorrect ? "Correct Decision!" : "Incorrect Strategy"}</p>
              <p className="mt-1 leading-relaxed">{checkpoint.explanation}</p>
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
              onClick={handleConfirmAnswer}
              disabled={!selectedOption}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-black transition-colors"
            >
              Confirm Inspection
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextCheckpoint}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentIdx < CHECKPOINTS.length - 1 ? "Next Hop" : "Complete Challenge"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
