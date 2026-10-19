import { useState, useEffect, useRef } from "react";
import { Layers, ArrowDown, ArrowUp, Info, CheckCircle2 } from "lucide-react";
import SimulationControls from "./SimulationControls";

const ENCAPSULATION_STEPS = [
  {
    stepId: 0,
    title: "1. Layer 7: Application Data",
    pdu: "Data",
    layer: "Layer 7 (Application)",
    addedHeader: "Application Payload",
    caption: "The application generates the raw user payload: an HTTP request or JSON data payload ready for transmission.",
    content: "POST /api/login HTTP/1.1 { 'user': 'alex' }",
    color: "text-purple-300 border-purple-500/40 bg-purple-950/20"
  },
  {
    stepId: 1,
    title: "2. Layer 4: Transport Header Added (Segment)",
    pdu: "Segment",
    layer: "Layer 4 (Transport)",
    addedHeader: "TCP Header [Src Port: 52140 | Dst Port: 443 | Seq: 1001]",
    caption: "The Transport Layer wraps the data in a TCP header containing source/destination ports and sequence numbers. The PDU is now a Segment.",
    content: "[TCP Header] + Payload",
    color: "text-blue-300 border-blue-500/40 bg-blue-950/20"
  },
  {
    stepId: 2,
    title: "3. Layer 3: Network Header Added (Packet)",
    pdu: "Packet",
    layer: "Layer 3 (Network)",
    addedHeader: "IP Header [Src IP: 192.168.1.50 | Dst IP: 104.21.5.20 | TTL: 64]",
    caption: "The Network Layer wraps the segment in an IPv4 header containing logical source/destination IP addresses and TTL. The PDU is now an IP Packet.",
    content: "[IP Header] + [TCP Header] + Payload",
    color: "text-emerald-300 border-emerald-500/40 bg-emerald-950/20"
  },
  {
    stepId: 3,
    title: "4. Layer 2: Data Link Header & Trailer (Frame)",
    pdu: "Frame",
    layer: "Layer 2 (Data Link)",
    addedHeader: "Ethernet Header [Src MAC: AA:AA... | Dst MAC: BB:BB...] + [FCS Trailer]",
    caption: "The Data Link Layer adds a MAC header at the front and a Frame Check Sequence (FCS) error-checking trailer at the back. The PDU is now an Ethernet Frame.",
    content: "[Ethernet Header] + [IP Header] + [TCP Header] + Payload + [FCS Trailer]",
    color: "text-cyan-300 border-cyan-500/40 bg-cyan-950/20"
  },
  {
    stepId: 4,
    title: "5. Layer 1: Physical Bitstream (Bits)",
    pdu: "Bits (0s and 1s)",
    layer: "Layer 1 (Physical)",
    addedHeader: "Transmitted on wire/radio as electrical voltages or light pulses",
    caption: "The entire frame is converted into electrical voltages, light pulses, or RF frequencies and physically clocked across the physical cable. PDU = Bits.",
    content: "01001000 01100101 01100001 01100100 01100101 01110010...",
    color: "text-amber-300 border-amber-500/40 bg-amber-950/20"
  }
];

export default function OsiEncapsulationSim() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDecapsulationMode, setIsDecapsulationMode] = useState(false);
  const timerRef = useRef(null);

  const step = ENCAPSULATION_STEPS[currentStep];

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = 2600 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (!isDecapsulationMode) {
            if (prev >= ENCAPSULATION_STEPS.length - 1) {
              setIsPlaying(false);
              return prev;
            }
            return prev + 1;
          } else {
            if (prev <= 0) {
              setIsPlaying(false);
              return 0;
            }
            return prev - 1;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, isDecapsulationMode]);

  return (
    <div className="space-y-4">
      {/* Simulation Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h3 className="text-sm font-semibold text-fg tracking-tight">OSI Protocol Encapsulation Engine</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsDecapsulationMode(!isDecapsulationMode);
              setIsPlaying(false);
            }}
            className="text-xs font-mono px-3 py-1 rounded-md border border-white/12 bg-raised hover:bg-white/10 text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            {isDecapsulationMode ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
            <span>Mode: {isDecapsulationMode ? "Decapsulation (Up)" : "Encapsulation (Down)"}</span>
          </button>
        </div>

        {/* Visual Nested Boxes */}
        <div className="my-6 p-6 rounded-xl bg-page/80 border border-white/10 space-y-4">
          <div className="text-center pb-2">
            <span className="text-xs font-mono uppercase text-muted">Current Protocol Data Unit (PDU)</span>
            <p className="text-lg font-bold text-fg tracking-tight mt-0.5">{step.pdu}</p>
          </div>

          {/* Interactive Nesting Stack */}
          <div className="max-w-2xl mx-auto space-y-2 font-mono text-xs">
            {/* L2 Outer Frame Box */}
            <div
              className={`p-3 rounded-xl border transition-all ${
                currentStep >= 3
                  ? "border-cyan-500/50 bg-cyan-950/20 shadow-md"
                  : "border-dashed border-white/10 opacity-30"
              }`}
            >
              <div className="flex justify-between items-center text-[11px] text-cyan-400 mb-2 font-semibold">
                <span>Ethernet Header (L2 MACs)</span>
                <span>FCS Trailer (CRC32)</span>
              </div>

              {/* L3 Packet Box */}
              <div
                className={`p-3 rounded-lg border transition-all ${
                  currentStep >= 2
                    ? "border-emerald-500/50 bg-emerald-950/20"
                    : "border-dashed border-white/10 opacity-30"
                }`}
              >
                <div className="text-[11px] text-emerald-400 mb-2 font-semibold">
                  <span>IPv4 Header (L3 Source & Destination IPs, TTL)</span>
                </div>

                {/* L4 Segment Box */}
                <div
                  className={`p-3 rounded-md border transition-all ${
                    currentStep >= 1
                      ? "border-blue-500/50 bg-blue-950/20"
                      : "border-dashed border-white/10 opacity-30"
                  }`}
                >
                  <div className="text-[11px] text-blue-400 mb-2 font-semibold">
                    <span>TCP Segment Header (L4 Ports, Sequence/Ack Numbers)</span>
                  </div>

                  {/* L7 Payload Core */}
                  <div className="p-3 rounded bg-purple-950/40 border border-purple-500/50 text-center">
                    <span className="text-[10px] text-purple-300 uppercase block font-semibold">
                      Layer 7 Application Payload
                    </span>
                    <span className="text-xs text-fg font-mono">
                      GET /index.html HTTP/1.1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Box */}
        <div className="p-4 rounded-xl bg-page border border-white/12 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">Layer Metadata Added</span>
            <span className="text-[11px] font-mono text-cyan-400">{step.layer}</span>
          </div>
          <p className="text-xs font-mono text-emerald-300 font-semibold bg-raised/50 p-2 rounded border border-white/5">
            {step.addedHeader}
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{step.caption}</span>
          </p>
        </div>
      </div>

      {/* Controls */}
      <SimulationControls
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
        onStepForward={() => {
          if (!isDecapsulationMode && currentStep < ENCAPSULATION_STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
          } else if (isDecapsulationMode && currentStep > 0) {
            setCurrentStep(currentStep - 1);
          }
        }}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStep(isDecapsulationMode ? ENCAPSULATION_STEPS.length - 1 : 0);
        }}
        currentStep={currentStep}
        totalSteps={ENCAPSULATION_STEPS.length}
        speed={speed}
        onChangeSpeed={setSpeed}
        stepLabel={step.title}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion(!reducedMotion)}
        canStep={isDecapsulationMode ? currentStep > 0 : currentStep < ENCAPSULATION_STEPS.length - 1}
      />
    </div>
  );
}
