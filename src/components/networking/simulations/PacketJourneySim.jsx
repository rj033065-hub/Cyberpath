import { useState, useEffect, useRef } from "react";
import { Laptop, Network, Router as RouterIcon, Server, ArrowRight, ShieldCheck, Info } from "lucide-react";
import SimulationControls from "./SimulationControls";

const JOURNEY_STEPS = [
  {
    stepId: 0,
    title: "1. Client Prepares Packet",
    activeNode: "client",
    packetPos: "client",
    caption: "The client prepares an HTTP GET request. Because the destination IP (203.0.113.80) is on an external network, the client addresses the Layer 2 Ethernet frame to its Default Gateway's MAC address.",
    headers: {
      l2: { srcMac: "AA:AA:11:22:33:44", dstMac: "BB:BB:00:11:22:33 (Router)", type: "0x0800 (IPv4)" },
      l3: { srcIp: "192.168.1.50", dstIp: "203.0.113.80", ttl: 64, proto: "TCP (6)" },
      l4: { srcPort: "54321", dstPort: "80 (HTTP)" },
      l7: "GET /index.html HTTP/1.1"
    }
  },
  {
    stepId: 1,
    title: "2. Switch Forwards Local Frame",
    activeNode: "switch",
    packetPos: "client-to-switch",
    caption: "The Layer 2 switch receives the frame on Port 1. It reads the destination MAC (BB:BB:00:11:22:33) and forwards it directly to Port 4 (connected to the router). The switch does not inspect IP addresses.",
    headers: {
      l2: { srcMac: "AA:AA:11:22:33:44", dstMac: "BB:BB:00:11:22:33 (Router)", type: "0x0800 (IPv4)" },
      l3: { srcIp: "192.168.1.50", dstIp: "203.0.113.80", ttl: 64, proto: "TCP (6)" },
      l4: { srcPort: "54321", dstPort: "80 (HTTP)" },
      l7: "GET /index.html HTTP/1.1"
    }
  },
  {
    stepId: 2,
    title: "3. Router Inspects IP & Performs NAT",
    activeNode: "router",
    packetPos: "switch-to-router",
    caption: "The router strips the incoming Layer 2 frame. It inspects the Layer 3 destination IP, consults its routing table, decrements TTL to 63, and applies NAT (translating private IP 192.168.1.50 to public IP 198.51.100.1).",
    headers: {
      l2: { srcMac: "CC:CC:55:66:77:88 (Router WAN)", dstMac: "DD:DD:99:88:77:66 (ISP Gateway)", type: "0x0800" },
      l3: { srcIp: "198.51.100.1 (NAT)", dstIp: "203.0.113.80", ttl: 63, proto: "TCP (6)" },
      l4: { srcPort: "61025 (NAT Port)", dstPort: "80 (HTTP)" },
      l7: "GET /index.html HTTP/1.1"
    }
  },
  {
    stepId: 3,
    title: "4. Traversing the WAN Backbone",
    activeNode: "wan",
    packetPos: "router-to-server",
    caption: "The packet travels across the ISP WAN fiber backbones. At each intermediary router, the Layer 2 headers are rewritten for the next link, but the Layer 3 destination IP (203.0.113.80) remains constant.",
    headers: {
      l2: { srcMac: "EE:EE:12:34:56:78 (Edge Router)", dstMac: "FF:FF:98:76:54:32 (Server NIC)", type: "0x0800" },
      l3: { srcIp: "198.51.100.1", dstIp: "203.0.113.80", ttl: 58, proto: "TCP (6)" },
      l4: { srcPort: "61025", dstPort: "80 (HTTP)" },
      l7: "GET /index.html HTTP/1.1"
    }
  },
  {
    stepId: 4,
    title: "5. Server Processes Request",
    activeNode: "server",
    packetPos: "server",
    caption: "The web server decapsulates the packet: verifies MAC, checks destination IP, passes TCP segment to port 80, and hands the HTTP GET request to the Nginx web application daemon.",
    headers: {
      l2: { srcMac: "EE:EE:12:34:56:78", dstMac: "FF:FF:98:76:54:32", type: "0x0800" },
      l3: { srcIp: "198.51.100.1", dstIp: "203.0.113.80", ttl: 58, proto: "TCP (6)" },
      l4: { srcPort: "61025", dstPort: "80 (HTTP)" },
      l7: "Processing: 200 OK Response"
    }
  },
  {
    stepId: 5,
    title: "6. Server Returns HTTP 200 Response",
    activeNode: "server",
    packetPos: "server-to-client",
    caption: "The server generates an HTTP 200 OK response with the webpage HTML. The source and destination IPs are reversed. The packet begins its return journey back to the client!",
    headers: {
      l2: { srcMac: "FF:FF:98:76:54:32", dstMac: "EE:EE:12:34:56:78", type: "0x0800" },
      l3: { srcIp: "203.0.113.80", dstIp: "198.51.100.1", ttl: 64, proto: "TCP (6)" },
      l4: { srcPort: "80 (HTTP)", dstPort: "61025" },
      l7: "HTTP/1.1 200 OK (Content: HTML)"
    }
  }
];

export default function PacketJourneySim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const step = JOURNEY_STEPS[currentStep];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (2800 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= JOURNEY_STEPS.length - 1) {
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

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < JOURNEY_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Simulation Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        {/* Topology Map Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">Interactive Packet Journey Visualizer</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/40">
            LAN to WAN Flow
          </span>
        </div>

        {/* Visual Node Diagram */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          {/* Node 1: Client Host */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              step.activeNode === "client"
                ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2">
              <Laptop className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Client Host</p>
            <p className="text-[11px] font-mono text-muted mt-0.5">192.168.1.50</p>
            <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
              MAC: AA:AA:11...
            </span>
          </div>

          {/* Node 2: Switch */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              step.activeNode === "switch"
                ? "bg-blue-950/30 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-2">
              <Network className="w-5 h-5 text-blue-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Layer 2 Switch</p>
            <p className="text-[11px] font-mono text-muted mt-0.5">Local Broadcast Domain</p>
            <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
              CAM Table Lookup
            </span>
          </div>

          {/* Node 3: Router / Gateway */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              step.activeNode === "router" || step.activeNode === "wan"
                ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-2">
              <RouterIcon className="w-5 h-5 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Default Gateway (NAT)</p>
            <p className="text-[11px] font-mono text-muted mt-0.5">LAN: 192.168.1.1</p>
            <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
              WAN: 198.51.100.1
            </span>
          </div>

          {/* Node 4: Web Server */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              step.activeNode === "server"
                ? "bg-purple-950/30 border-purple-500/60 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-10 h-10 mx-auto rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-2">
              <Server className="w-5 h-5 text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Target Web Server</p>
            <p className="text-[11px] font-mono text-muted mt-0.5">203.0.113.80:80</p>
            <span className="inline-block mt-2 text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
              HTTP Daemon (Nginx)
            </span>
          </div>
        </div>

        {/* Live Packet Header Dissector Box */}
        <div className="p-4 rounded-xl bg-page border border-white/12 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">Active Packet Dissection</span>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
              {step.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-400 block mb-1">Layer 2 (Ethernet)</span>
              <p className="text-fg truncate"><span className="text-zinc-400">Dst:</span> {step.headers.l2.dstMac}</p>
              <p className="text-zinc-400 truncate"><span className="text-zinc-500">Src:</span> {step.headers.l2.srcMac}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-400 block mb-1">Layer 3 (IPv4)</span>
              <p className="text-fg truncate"><span className="text-zinc-400">Src IP:</span> {step.headers.l3.srcIp}</p>
              <p className="text-fg truncate"><span className="text-zinc-400">Dst IP:</span> {step.headers.l3.dstIp}</p>
              <p className="text-zinc-400 text-[10px]">TTL: {step.headers.l3.ttl}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-400 block mb-1">Layer 4 (Transport)</span>
              <p className="text-fg"><span className="text-zinc-400">Src Port:</span> {step.headers.l4.srcPort}</p>
              <p className="text-fg"><span className="text-zinc-400">Dst Port:</span> {step.headers.l4.dstPort}</p>
            </div>

            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] uppercase text-zinc-400 block mb-1">Layer 7 (Application)</span>
              <p className="text-cyan-300 font-semibold truncate">{step.headers.l7}</p>
              <span className="text-[10px] text-zinc-400 block mt-1">Payload inspection</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{step.caption}</span>
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <SimulationControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={handleStepForward}
        onReset={handleReset}
        currentStep={currentStep}
        totalSteps={JOURNEY_STEPS.length}
        speed={speed}
        onChangeSpeed={setSpeed}
        stepLabel={step.title}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        canStep={currentStep < JOURNEY_STEPS.length - 1}
      />
    </div>
  );
}
