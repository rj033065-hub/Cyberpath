import { useState, useEffect, useRef } from "react";
import { Laptop, Network, CheckCircle2, XCircle, Info, ShieldAlert } from "lucide-react";
import SimulationControls from "./SimulationControls";

const ARP_STEPS = [
  {
    stepId: 0,
    title: "1. ARP Cache Miss on Host A",
    activeNode: "hostA",
    broadcastActive: false,
    caption: "Host A (192.168.1.10) wants to send an IP packet to Host C (192.168.1.30). It checks its local ARP cache table, but has no MAC entry for 192.168.1.30.",
    arpTableA: [{ ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" }],
    frame: { srcMac: "AA:AA:11:22:33:44", dstMac: "Pending...", type: "0x0806 (ARP)" }
  },
  {
    stepId: 1,
    title: "2. Host A Broadcasts ARP Request",
    activeNode: "switch",
    broadcastActive: true,
    caption: "Host A crafts an ARP Request: 'Who has 192.168.1.30? Tell 192.168.1.10'. It sets the destination MAC to the Ethernet broadcast address FF:FF:FF:FF:FF:FF and sends it to the switch.",
    arpTableA: [{ ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" }],
    frame: { srcMac: "AA:AA:11:22:33:44", dstMac: "FF:FF:FF:FF:FF:FF (Broadcast)", type: "ARP Request" }
  },
  {
    stepId: 2,
    title: "3. Switch Floods Broadcast Out All Ports",
    activeNode: "all",
    broadcastActive: true,
    caption: "The switch receives the broadcast frame on Port 1. Because destination is FF:FF:FF:FF:FF:FF, the switch floods the frame out of all other ports (Port 2, Port 3, Port 4).",
    arpTableA: [{ ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" }],
    frame: { srcMac: "AA:AA:11:22:33:44", dstMac: "FF:FF:FF:FF:FF:FF", type: "Flooded to all nodes" }
  },
  {
    stepId: 3,
    title: "4. Hosts Inspect Target IP",
    activeNode: "inspect",
    broadcastActive: false,
    caption: "Host B (192.168.1.20) and Host D (192.168.1.40) inspect the query: 'Not my IP!' and drop the frame. Host C (192.168.1.30) recognizes its own IP and prepares a reply.",
    arpTableA: [{ ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" }],
    frame: { srcMac: "AA:AA:11:22:33:44", dstMac: "Host C matches!", type: "Target verified" }
  },
  {
    stepId: 4,
    title: "5. Host C Sends Unicast ARP Reply",
    activeNode: "hostC",
    broadcastActive: false,
    caption: "Host C sends a direct unicast ARP Reply: '192.168.1.30 is at CC:CC:33:44:55:66'. The destination MAC is set specifically to Host A (AA:AA:11:22:33:44). The switch delivers it only to Port 1.",
    arpTableA: [{ ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" }],
    frame: { srcMac: "CC:CC:33:44:55:66", dstMac: "AA:AA:11:22:33:44", type: "ARP Reply (Unicast)" }
  },
  {
    stepId: 5,
    title: "6. Host A Updates Cache & Sends IP Packet",
    activeNode: "hostA",
    broadcastActive: false,
    caption: "Host A receives the reply and saves the mapping in its local ARP cache. It can now transmit its buffered IP packet directly to Host C's MAC address!",
    arpTableA: [
      { ip: "192.168.1.1", mac: "00:50:56:FE:ED:01", type: "Dynamic" },
      { ip: "192.168.1.30", mac: "CC:CC:33:44:55:66", type: "Dynamic (Resolved)" }
    ],
    frame: { srcMac: "AA:AA:11:22:33:44", dstMac: "CC:CC:33:44:55:66", type: "IPv4 Data Frame" }
  }
];

export default function ArpDiscoverySim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const step = ARP_STEPS[currentStep];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2800 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= ARP_STEPS.length - 1) {
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
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">ARP Resolution & Broadcast Flooding</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/40">
            Layer 2 / Layer 3 Binding
          </span>
        </div>

        {/* Network Diagram: Switch in center, 4 hosts around */}
        <div className="my-6 grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Host A (Sender) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "hostA" || step.activeNode === "all"
                ? "bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-1.5">
              <Laptop className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Host A (Sender)</p>
            <p className="text-[11px] font-mono text-muted">192.168.1.10</p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1">AA:AA:11:22:33:44</span>
          </div>

          {/* Host B (Ignores) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "all" || step.activeNode === "inspect"
                ? "bg-raised/80 border-white/20"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1.5">
              <Laptop className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Host B</p>
            <p className="text-[11px] font-mono text-muted">192.168.1.20</p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1">BB:BB:22:33:44:55</span>
            {currentStep === 3 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-danger mt-1">
                <XCircle className="w-3 h-3" /> Discards (Not me)
              </span>
            )}
          </div>

          {/* Host C (Target) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "hostC" || (step.activeNode === "inspect" && currentStep === 3)
                ? "bg-emerald-950/30 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-1.5">
              <Laptop className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Host C (Target)</p>
            <p className="text-[11px] font-mono text-muted">192.168.1.30</p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1">CC:CC:33:44:55:66</span>
            {currentStep === 3 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Target Match!
              </span>
            )}
          </div>

          {/* Host D (Ignores) */}
          <div
            className={`p-3.5 rounded-xl border text-center transition-all ${
              step.activeNode === "all" || step.activeNode === "inspect"
                ? "bg-raised/80 border-white/20"
                : "bg-raised/50 border-white/10 opacity-70"
            }`}
          >
            <div className="w-9 h-9 mx-auto rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-1.5">
              <Laptop className="w-4 h-4 text-zinc-400" />
            </div>
            <p className="text-xs font-semibold text-fg">Host D</p>
            <p className="text-[11px] font-mono text-muted">192.168.1.40</p>
            <span className="text-[10px] font-mono text-zinc-400 block mt-1">DD:DD:44:55:66:77</span>
            {currentStep === 3 && (
              <span className="inline-flex items-center gap-1 text-[10px] text-danger mt-1">
                <XCircle className="w-3 h-3" /> Discards (Not me)
              </span>
            )}
          </div>
        </div>

        {/* Live ARP Table on Host A */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-page border border-white/12 space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
              Host A's Local ARP Cache
            </span>
            <div className="space-y-1">
              {step.arpTableA.map((row, i) => (
                <div key={i} className="flex justify-between p-2 rounded bg-raised/60 border border-white/5">
                  <span className="text-cyan-300">{row.ip}</span>
                  <span className="text-zinc-300">{row.mac}</span>
                  <span className="text-emerald-400 text-[10px]">{row.type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-page border border-white/12 space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-bold">
              Transmitted Frame Metadata
            </span>
            <div className="p-2 rounded bg-raised/60 border border-white/5 space-y-1 text-[11px]">
              <p><span className="text-zinc-500">Frame Type:</span> <span className="text-cyan-300 font-semibold">{step.frame.type}</span></p>
              <p><span className="text-zinc-500">Source MAC:</span> <span className="text-zinc-300">{step.frame.srcMac}</span></p>
              <p><span className="text-zinc-500">Destination:</span> <span className="text-amber-300">{step.frame.dstMac}</span></p>
            </div>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed mt-4 pt-3 border-t border-white/10 flex items-start gap-2">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>{step.caption}</span>
        </p>
      </div>

      {/* Controls */}
      <SimulationControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={() => currentStep < ARP_STEPS.length - 1 && setCurrentStep(currentStep + 1)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        currentStep={currentStep}
        totalSteps={ARP_STEPS.length}
        speed={speed}
        onChangeSpeed={setSpeed}
        stepLabel={step.title}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        canStep={currentStep < ARP_STEPS.length - 1}
      />
    </div>
  );
}
