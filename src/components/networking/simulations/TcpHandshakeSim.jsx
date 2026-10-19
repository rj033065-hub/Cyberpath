import { useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Info, Laptop, Server } from "lucide-react";
import SimulationControls from "./SimulationControls";

const HANDSHAKE_STEPS = [
  {
    stepId: 0,
    title: "Initial State: Ready to Connect",
    clientState: "CLOSED",
    serverState: "LISTEN",
    packetDirection: null,
    packetSummary: null,
    caption: "The Web Server is in the LISTEN state on TCP Port 443, waiting for incoming connections. The Client is in CLOSED state.",
    details: {
      seq: "—",
      ack: "—",
      flags: "None",
      window: "—"
    }
  },
  {
    stepId: 1,
    title: "Step 1: Client sends SYN",
    clientState: "SYN_SENT",
    serverState: "LISTEN",
    packetDirection: "client-to-server",
    packetSummary: "TCP [SYN] Seq=1000 Win=65535",
    caption: "The client generates a random Initial Sequence Number (ISN = 1000), sets the SYN control bit, and sends it to the server. The client enters SYN_SENT state.",
    details: {
      seq: "1000",
      ack: "0",
      flags: "SYN (Synchronize)",
      window: "65,535 bytes"
    }
  },
  {
    stepId: 2,
    title: "Step 2: Server responds with SYN-ACK",
    clientState: "SYN_SENT",
    serverState: "SYN_RCVD",
    packetDirection: "server-to-client",
    packetSummary: "TCP [SYN, ACK] Seq=5000 Ack=1001 Win=65535",
    caption: "The server receives the SYN. It acknowledges the client's sequence by incrementing it (Ack = 1001), picks its own ISN (5000), sets SYN and ACK bits, and enters SYN_RCVD state.",
    details: {
      seq: "5000",
      ack: "1001 (Client Seq + 1)",
      flags: "SYN, ACK",
      window: "65,535 bytes"
    }
  },
  {
    stepId: 3,
    title: "Step 3: Client sends final ACK",
    clientState: "ESTABLISHED",
    serverState: "SYN_RCVD",
    packetDirection: "client-to-server",
    packetSummary: "TCP [ACK] Seq=1001 Ack=5001 Win=65535",
    caption: "The client receives the SYN-ACK, transitions to ESTABLISHED, and sends an ACK confirming the server's sequence (Ack = 5001). The connection is now active on the client side.",
    details: {
      seq: "1001",
      ack: "5001 (Server Seq + 1)",
      flags: "ACK (Acknowledgment)",
      window: "65,535 bytes"
    }
  },
  {
    stepId: 4,
    title: "Connection ESTABLISHED (Full Duplex)",
    clientState: "ESTABLISHED",
    serverState: "ESTABLISHED",
    packetDirection: "both",
    packetSummary: "Two-way reliable data streaming ready",
    caption: "The server receives the ACK and transitions to ESTABLISHED! Both endpoints now have synchronized sequence numbers and can transmit application data simultaneously.",
    details: {
      seq: "1001",
      ack: "5001",
      flags: "ESTABLISHED",
      window: "Bi-directional Stream"
    }
  }
];

export default function TcpHandshakeSim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timerRef = useRef(null);

  const step = HANDSHAKE_STEPS[currentStep];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2600 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= HANDSHAKE_STEPS.length - 1) {
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
      {/* Simulation Box */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">TCP 3-Way Handshake State Machine</h3>
          </div>
          <span className="text-xs font-mono text-blue-400 bg-blue-950/40 px-2.5 py-1 rounded-md border border-blue-800/40">
            Layer 4 Protocol Synchronization
          </span>
        </div>

        {/* Handshake Visual Stage */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 my-8">
          {/* Client Node */}
          <div className="p-4 rounded-xl bg-raised/70 border border-white/10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
              <Laptop className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">Client Host</p>
              <p className="text-xs font-mono text-muted">Port 54321</p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">TCP State</span>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold mt-1 ${
                  step.clientState === "ESTABLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : step.clientState === "SYN_SENT"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/5 text-muted border border-white/10"
                }`}
              >
                {step.clientState}
              </span>
            </div>
          </div>

          {/* In-Flight Packet Arrow & Label */}
          <div className="flex flex-col items-center justify-center p-4 text-center">
            {step.packetDirection === "client-to-server" && (
              <div className="space-y-2 w-full animate-pulse">
                <span className="text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-700/50 px-3 py-1 rounded-full inline-block shadow">
                  SYN →
                </span>
                <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full w-full" />
                <p className="text-[11px] font-mono text-zinc-300">{step.packetSummary}</p>
              </div>
            )}

            {step.packetDirection === "server-to-client" && (
              <div className="space-y-2 w-full animate-pulse">
                <span className="text-xs font-mono text-blue-300 bg-blue-950/70 border border-blue-700/50 px-3 py-1 rounded-full inline-block shadow">
                  &lt;── SYN-ACK
                </span>
                <div className="h-1 bg-gradient-to-l from-blue-500 to-cyan-500 rounded-full w-full" />
                <p className="text-[11px] font-mono text-zinc-300">{step.packetSummary}</p>
              </div>
            )}

            {step.packetDirection === "both" && (
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Synchronized & Connected</span>
                </div>
                <div className="h-1 bg-emerald-500/50 rounded-full w-full" />
                <p className="text-[11px] font-mono text-muted">Ready for HTTP GET / Data</p>
              </div>
            )}

            {!step.packetDirection && (
              <div className="text-xs text-muted font-mono italic">
                Press Play or Next Step to initiate connection
              </div>
            )}
          </div>

          {/* Server Node */}
          <div className="p-4 rounded-xl bg-raised/70 border border-white/10 text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-fg">Web Server</p>
              <p className="text-xs font-mono text-muted">Port 443 (HTTPS)</p>
            </div>
            <div className="pt-2">
              <span className="text-[10px] text-zinc-400 uppercase font-mono block">TCP State</span>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-mono font-bold mt-1 ${
                  step.serverState === "ESTABLISHED"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : step.serverState === "SYN_RCVD"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-white/5 text-muted border border-white/10"
                }`}
              >
                {step.serverState}
              </span>
            </div>
          </div>
        </div>

        {/* Detailed Segment Inspector */}
        <div className="p-4 rounded-xl bg-page border border-white/12 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">TCP Header Inspector</span>
            <span className="text-[11px] font-mono text-blue-400">{step.title}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Sequence Number</span>
              <span className="text-cyan-300 font-semibold">{step.details.seq}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Acknowledgment</span>
              <span className="text-blue-300 font-semibold">{step.details.ack}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Active Control Flags</span>
              <span className="text-amber-300 font-semibold">{step.details.flags}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-raised/70 border border-white/5">
              <span className="text-[10px] text-zinc-400 block mb-1">Receive Window Size</span>
              <span className="text-zinc-200">{step.details.window}</span>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>{step.caption}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <SimulationControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={() => currentStep < HANDSHAKE_STEPS.length - 1 && setCurrentStep(currentStep + 1)}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(0);
        }}
        currentStep={currentStep}
        totalSteps={HANDSHAKE_STEPS.length}
        speed={speed}
        onChangeSpeed={setSpeed}
        stepLabel={step.title}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        canStep={currentStep < HANDSHAKE_STEPS.length - 1}
      />
    </div>
  );
}
