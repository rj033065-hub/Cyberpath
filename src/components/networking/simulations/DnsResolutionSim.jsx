import { useState, useEffect, useRef } from "react";
import { Laptop, Database, Globe, Server, ArrowRight, CheckCircle2, Info } from "lucide-react";
import SimulationControls from "./SimulationControls";

const DNS_STEPS = [
  {
    stepId: 0,
    title: "1. Client Queries Local Cache",
    activeNode: "client",
    query: "cyberpath.dev",
    target: "Local OS Cache",
    caption: "The browser checks the operating system DNS cache and hosts file for 'cyberpath.dev'. Cache miss: the domain has not been recently visited.",
    packet: { type: "Internal Cache Lookup", detail: "MISS: Not in local memory" }
  },
  {
    stepId: 1,
    title: "2. Query Sent to Recursive Resolver",
    activeNode: "resolver",
    query: "cyberpath.dev",
    target: "Recursive Resolver (1.1.1.1)",
    caption: "Client sends a recursive DNS query to its configured recursive resolver (e.g. Cloudflare 1.1.1.1 or ISP resolver). The resolver takes over the search.",
    packet: { type: "DNS Query (UDP 53)", detail: "Standard query A cyberpath.dev" }
  },
  {
    stepId: 2,
    title: "3. Resolver Queries Root Nameserver (.)",
    activeNode: "root",
    query: "Where is .dev?",
    target: "Root Nameserver (198.41.0.4)",
    caption: "The recursive resolver queries one of the 13 global Root Nameserver clusters (.) asking for 'cyberpath.dev'. The Root responds: 'I don't know the full domain, but here is the referral to the .dev TLD nameserver.'",
    packet: { type: "DNS Referral", detail: "Referral to .dev TLD Nameservers" }
  },
  {
    stepId: 3,
    title: "4. Resolver Queries TLD Nameserver (.dev)",
    activeNode: "tld",
    query: "Where is cyberpath.dev?",
    target: ".dev TLD Nameserver",
    caption: "The resolver queries the Top-Level Domain (TLD) server for '.dev'. The TLD server responds with the Authoritative Nameserver responsible for cyberpath.dev (e.g., ns1.cyberpath.dev).",
    packet: { type: "DNS Referral", detail: "Referral to Authoritative ns1.cyberpath.dev" }
  },
  {
    stepId: 4,
    title: "5. Resolver Queries Authoritative Nameserver",
    activeNode: "authoritative",
    query: "What is IP of cyberpath.dev?",
    target: "Authoritative Nameserver (ns1.cyberpath.dev)",
    caption: "The resolver queries the Authoritative Nameserver. This server holds the master DNS zone records and returns: 'cyberpath.dev has IPv4 A Record 76.76.21.21 with TTL = 300 seconds.'",
    packet: { type: "DNS Answer", detail: "A Record: 76.76.21.21 (TTL 300s)" }
  },
  {
    stepId: 5,
    title: "6. Resolver Returns IP to Client & Caches",
    activeNode: "client",
    query: "Resolved: 76.76.21.21",
    target: "Client Browser",
    caption: "The recursive resolver saves the answer in its local cache for 300 seconds and returns 76.76.21.21 to the client. The browser can now initiate an HTTPS connection to the web server!",
    packet: { type: "Resolved A Record", detail: "76.76.21.21 delivered to browser" }
  }
];

export default function DnsResolutionSim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const step = DNS_STEPS[currentStep];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2800 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= DNS_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed]);

  return (
    <div className="space-y-4">
      {/* Simulation Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">Hierarchical DNS Resolution Visualizer</h3>
          </div>
          <span className="text-xs font-mono text-purple-400 bg-purple-950/40 px-2.5 py-1 rounded-md border border-purple-800/40">
            Root ➔ TLD ➔ Authoritative
          </span>
        </div>

        {/* DNS Architecture Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 my-6">
          {/* Client */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "client"
                ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-1.5">
              <Laptop className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Client Host</p>
            <p className="text-[10px] font-mono text-muted">Browser</p>
          </div>

          {/* Resolver */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "resolver"
                ? "bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-1.5">
              <Server className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Recursive Resolver</p>
            <p className="text-[10px] font-mono text-muted">1.1.1.1</p>
          </div>

          {/* Root (.) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "root"
                ? "bg-amber-950/30 border-amber-500/60 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-1.5">
              <Globe className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Root Server (.)</p>
            <p className="text-[10px] font-mono text-muted">13 Global Clusters</p>
          </div>

          {/* TLD (.dev) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "tld"
                ? "bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-1.5">
              <Database className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-fg">TLD Server (.dev)</p>
            <p className="text-[10px] font-mono text-muted">Registry</p>
          </div>

          {/* Authoritative */}
          <div
            className={`p-3.5 rounded-xl border text-center col-span-2 md:col-span-1 transition-all ${
              step.activeNode === "authoritative"
                ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-1.5">
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Authoritative Server</p>
            <p className="text-[10px] font-mono text-muted">ns1.cyberpath.dev</p>
          </div>
        </div>

        {/* Live Query / Response Box */}
        <div className="p-4 rounded-xl bg-page border border-white/12 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">DNS Transaction Trace</span>
            <span className="text-[11px] font-mono text-purple-400">{step.title}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Target Endpoint</span>
              <span className="text-fg">{step.target}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Query Message</span>
              <span className="text-cyan-300 font-semibold">{step.query}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Packet Type</span>
              <span className="text-purple-300">{step.packet.type}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-raised/40 border border-white/5 text-xs font-mono">
            <span className="text-[10px] text-zinc-400 uppercase block mb-0.5">Payload Details</span>
            <span className="text-emerald-400 font-semibold">{step.packet.detail}</span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 flex items-start gap-2">
            <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>{step.caption}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <SimulationControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={() => currentStep < DNS_STEPS.length - 1 && setCurrentStep(currentStep + 1)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        currentStep={currentStep}
        totalSteps={DNS_STEPS.length}
        speed={speed}
        onChangeSpeed={setSpeed}
        stepLabel={step.title}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        canStep={currentStep < DNS_STEPS.length - 1}
      />
    </div>
  );
}
