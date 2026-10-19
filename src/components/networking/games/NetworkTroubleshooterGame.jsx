import { useState } from "react";
import { Terminal, CheckCircle2, XCircle, RotateCcw, ArrowRight, Play, Wrench, AlertTriangle, Info } from "lucide-react";

const INCIDENTS = [
  {
    id: 1,
    title: "Incident #401: Complete Internet Drop",
    userReport: "Employee Alex reports: 'I plugged into the wall Ethernet jack after lunch, but my computer has zero Internet connection. Teams and browser are totally disconnected!'",
    cliResponses: {
      "ipconfig": `Ethernet adapter Local Area Connection:
   Connection-specific DNS Suffix  . : 
   Link-local IPv6 Address . . . . . : fe80::1044:812f:99ab
   IPv4 Address. . . . . . . . . . . : 169.254.44.112
   Subnet Mask . . . . . . . . . . . : 255.255.0.0
   Default Gateway . . . . . . . . . : `,
      "ping 127.0.0.1": `Pinging 127.0.0.1 with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "ping 192.168.1.1": `Pinging 192.168.1.1 with 32 bytes of data:
Destination host unreachable.
Destination host unreachable.
Ping statistics: 4 packets transmitted, 0 received, 100% loss`,
      "ping 8.8.8.8": `Pinging 8.8.8.8 with 32 bytes of data:
General failure.
Ping statistics: 4 packets transmitted, 0 received, 100% loss`,
      "nslookup google.com": `DNS request timed out.
   timeout was 2 seconds.
*** Can't find server address for google.com: Timed out`
    },
    question: "Based on the diagnostic CLI outputs above, what is the root cause of this failure?",
    options: [
      { id: "a", text: "APIPA address (169.254.x.x) assigned because the machine failed to reach the DHCP server" },
      { id: "b", text: "The employee's web browser cookies are corrupt" },
      { id: "c", text: "Google DNS servers are experiencing a global outage" },
      { id: "d", text: "The network card is attempting to communicate using Bluetooth" }
    ],
    correctOptionId: "a",
    recommendedFix: "Release and renew the DHCP lease (or check switch port VLAN assignment) to obtain a valid 192.168.1.x IP from the DHCP server.",
    explanation: "The IP 169.254.44.112 is an APIPA (Automatic Private IP Addressing) address assigned automatically by Windows/Linux when no response is received from a DHCP server. The host is on an isolated link-local island."
  },
  {
    id: 2,
    title: "Incident #402: IP Works, Hostnames Fail",
    userReport: "Sysadmin reports: 'I can ping remote servers directly by numerical IP, but none of the workstation browsers can open internal or external domain names.'",
    cliResponses: {
      "ipconfig": `Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . . . . . . : 192.168.1.75
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.1.1
   DNS Servers . . . . . . . . . . . : 127.0.0.1`,
      "ping 127.0.0.1": `Pinging 127.0.0.1 with 32 bytes of data:
Reply from 127.0.0.1: bytes=32 time<1ms TTL=128
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "ping 192.168.1.1": `Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "ping 8.8.8.8": `Pinging 8.8.8.8 with 32 bytes of data:
Reply from 8.8.8.8: bytes=32 time=14ms TTL=117
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "nslookup google.com": `Server:  localhost
Address:  127.0.0.1

*** localhost can't find google.com: No response from server`
    },
    question: "What is causing domains to fail while public IP pinging succeeds?",
    options: [
      { id: "a", text: "The network cable is only half plugged in" },
      { id: "b", text: "DNS server is misconfigured to 127.0.0.1 with no local DNS resolver listening on port 53" },
      { id: "c", text: "Default Gateway 192.168.1.1 is rejecting TCP packets" },
      { id: "d", text: "The Subnet Mask must be /16 instead of /24" }
    ],
    correctOptionId: "b",
    recommendedFix: "Update the workstation's DNS server setting to point to a valid corporate resolver (or 1.1.1.1 / 8.8.8.8).",
    explanation: "Because `ping 8.8.8.8` returns in 14ms, routing and WAN connectivity are 100% operational. The DNS server is set to loopback 127.0.0.1, but no DNS daemon is running locally, causing all name resolution to fail."
  },
  {
    id: 3,
    title: "Incident #403: Local Printing Works, WAN Blocked",
    userReport: "Reception reports: 'I can print documents to the office printer at 192.168.1.200 just fine, but opening our cloud scheduling portal gives Destination Unreachable.'",
    cliResponses: {
      "ipconfig": `Ethernet adapter Local Area Connection:
   IPv4 Address. . . . . . . . . . . : 192.168.1.80
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 0.0.0.0`,
      "ping 192.168.1.200 (Printer)": `Pinging 192.168.1.200 with 32 bytes of data:
Reply from 192.168.1.200: bytes=32 time=1ms TTL=64
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "ping 192.168.1.1": `Pinging 192.168.1.1 with 32 bytes of data:
Reply from 192.168.1.1: bytes=32 time=1ms TTL=64
Ping statistics: 4 packets transmitted, 4 received, 0% loss`,
      "ping 8.8.8.8": `Pinging 8.8.8.8 with 32 bytes of data:
PING: transmit failed. General failure.
Destination host unreachable.`,
      "nslookup google.com": `DNS request timed out.`
    },
    question: "Why can the host talk to local printers on 192.168.1.0/24 but not the outside world?",
    options: [
      { id: "a", text: "Missing Default Gateway (set to 0.0.0.0), so the OS does not know how to forward remote packets" },
      { id: "b", text: "The printer is running a denial of service attack" },
      { id: "c", text: "Wi-Fi radio interference is blocking public IP packets" },
      { id: "d", text: "The network switch ran out of MAC addresses" }
    ],
    correctOptionId: "a",
    recommendedFix: "Set the Default Gateway to the router's internal IP: 192.168.1.1.",
    explanation: "For local devices on the same subnet (192.168.1.x), the computer uses ARP directly over the switch. But for remote IPs outside the subnet, it requires a valid Default Gateway router. With gateway set to 0.0.0.0, external packets are discarded."
  },
  {
    id: 4,
    title: "Incident #404: Port Refused on Production Web Server",
    userReport: "DevOps alert: 'Web server 203.0.113.10 is accessible via SSH terminal (port 22), but customers report Connection Refused when visiting https://203.0.113.10!'",
    cliResponses: {
      "ipconfig": `Linux Server eth0:
   inet 203.0.113.10  netmask 255.255.255.0  broadcast 203.0.113.255
   default via 203.0.113.1 dev eth0`,
      "ping 203.0.113.1": `64 bytes from 203.0.113.1: icmp_seq=1 ttl=64 time=0.4 ms
4 packets transmitted, 4 received, 0% packet loss`,
      "netstat -tuln": `Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address   Foreign Address   State      
tcp        0      0 0.0.0.0:22      0.0.0.0:*         LISTEN     
tcp        0      0 0.0.0.0:80      0.0.0.0:*         LISTEN`,
      "iptables -L -n": `Chain INPUT (policy ACCEPT)
target     prot opt source     destination         
ACCEPT     tcp  --  0.0.0.0/0  0.0.0.0/0  tcp dpt:22
ACCEPT     tcp  --  0.0.0.0/0  0.0.0.0/0  tcp dpt:80
DROP       tcp  --  0.0.0.0/0  0.0.0.0/0  tcp dpt:443`,
      "nslookup google.com": `Server:  1.1.1.1
Address: 1.1.1.1#53
Non-authoritative answer: Name: google.com Address: 142.250.190.46`
    },
    question: "What is preventing external customers from connecting to the HTTPS service on port 443?",
    options: [
      { id: "a", text: "The server has run out of RAM" },
      { id: "b", text: "Firewall rule `DROP tcp dpt:443` is actively rejecting HTTPS packets" },
      { id: "c", text: "The network cable has high packet loss" },
      { id: "d", text: "The server is running on a private RFC 1918 address" }
    ],
    correctOptionId: "b",
    recommendedFix: "Update the server firewall ruleset: remove `DROP tcp dpt:443` and allow inbound traffic on port 443.",
    explanation: "The `iptables -L -n` firewall output clearly lists an explicit rule: `DROP tcp -- 0.0.0.0/0 0.0.0.0/0 tcp dpt:443`. The firewall is actively dropping all incoming HTTPS connections."
  }
];

export default function NetworkTroubleshooterGame({ onCompleteGame }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState("");
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const incident = INCIDENTS[currentIdx];

  const handleRunCommand = (cmd) => {
    const res = incident.cliResponses[cmd] || "Command executed.";
    setTerminalOutput(`$ ${cmd}\n${res}\n\n`);
  };

  const handleConfirm = () => {
    if (!selectedOpt || isAnswered) return;
    setIsAnswered(true);
    if (selectedOpt === incident.correctOptionId) {
      setScore((prev) => prev + 35);
    }
  };

  const handleNext = () => {
    if (currentIdx < INCIDENTS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTerminalOutput("");
      setSelectedOpt(null);
      setIsAnswered(false);
    } else if (onCompleteGame) {
      const finalScore = score + (selectedOpt === incident.correctOptionId ? 35 : 0);
      onCompleteGame({ gameId: "network-troubleshooter", score: finalScore });
    }
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setTerminalOutput("");
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
  };

  const isCorrect = selectedOpt === incident.correctOptionId;

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
              Ticket {incident.id} of {INCIDENTS.length}
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">{incident.title}</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            Score: {score} XP
          </span>
        </div>

        {/* User Ticket Report */}
        <div className="p-3.5 rounded-xl bg-page border border-white/10 text-xs text-zinc-300 flex items-start gap-2.5 mb-4">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-fg">Helpdesk Incident Report:</p>
            <p className="leading-relaxed mt-0.5">{incident.userReport}</p>
          </div>
        </div>

        {/* Diagnostic Toolbox: Interactive Command Launcher */}
        <div className="space-y-2 mb-4">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
            Run Diagnostic Probes:
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(incident.cliResponses).map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => handleRunCommand(cmd)}
                className="px-3 py-1.5 rounded-lg bg-raised hover:bg-cyan-500/20 hover:border-cyan-500/40 border border-white/10 text-xs font-mono text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{cmd}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Simulated CLI Terminal Screen */}
        <div className="rounded-xl border border-white/12 bg-black/90 p-4 font-mono text-xs text-emerald-400 min-h-[140px] max-h-56 overflow-y-auto whitespace-pre-wrap shadow-inner">
          {terminalOutput ? (
            terminalOutput
          ) : (
            <span className="text-zinc-600 italic">
              Terminal ready. Click one of the diagnostic probes above to inspect network responses...
            </span>
          )}
        </div>

        {/* Diagnosis Options */}
        <div className="space-y-2 mt-5">
          <span className="text-xs font-mono text-zinc-400 block mb-1">{incident.question}</span>
          {incident.options.map((opt) => {
            const isSelected = selectedOpt === opt.id;
            let style = "bg-raised/60 hover:bg-white/5 border-white/10 text-zinc-200";

            if (isAnswered) {
              if (opt.id === incident.correctOptionId) {
                style = "bg-emerald-950/50 border-emerald-500/60 text-emerald-200 font-semibold";
              } else if (isSelected && opt.id !== incident.correctOptionId) {
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

        {/* Post-Mortem Feedback & Fix */}
        {isAnswered && (
          <div
            className={`p-4 rounded-xl border mt-4 text-xs space-y-2 ${
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
                <p className="font-semibold">{isCorrect ? "Diagnosis Confirmed!" : "Misdiagnosed Root Cause"}</p>
                <p className="mt-1 leading-relaxed">{incident.explanation}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-white/10 font-mono text-[11px] flex items-center gap-1.5 text-cyan-300">
              <Wrench className="w-3.5 h-3.5 shrink-0" />
              <span>Recommended Remediation: {incident.recommendedFix}</span>
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
              Confirm Diagnosis
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentIdx < INCIDENTS.length - 1 ? "Next Incident" : "Complete Troubleshooting"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
