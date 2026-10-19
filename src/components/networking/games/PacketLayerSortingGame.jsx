import { useState } from "react";
import { Layers, CheckCircle2, XCircle, RotateCcw, ArrowRight, HelpCircle, Trophy } from "lucide-react";

const ROUNDS = [
  {
    round: 1,
    title: "Round 1: Protocol Data Units (PDUs)",
    description: "Assign each Protocol Data Unit (PDU) to its correct OSI Layer.",
    items: [
      { id: "pdu-seg", label: "Segment", targetLayer: 4, explanation: "At Layer 4 (Transport), data encapsulated with TCP/UDP headers is called a Segment." },
      { id: "pdu-pkt", label: "Packet", targetLayer: 3, explanation: "At Layer 3 (Network), data wrapped in IP headers is called a Packet." },
      { id: "pdu-frm", label: "Frame", targetLayer: 2, explanation: "At Layer 2 (Data Link), data wrapped in MAC headers and an FCS trailer is a Frame." },
      { id: "pdu-bit", label: "Bits (0s & 1s)", targetLayer: 1, explanation: "At Layer 1 (Physical), raw electrical signals or light pulses are Bits." }
    ]
  },
  {
    round: 2,
    title: "Round 2: Common Protocols",
    description: "Match each protocol to the layer where it operates.",
    items: [
      { id: "proto-http", label: "HTTP / HTTPS", targetLayer: 7, explanation: "HTTP/HTTPS operates at Layer 7 (Application) to deliver web pages." },
      { id: "proto-tcp", label: "TCP & UDP", targetLayer: 4, explanation: "TCP and UDP manage port multiplexing and flow control at Layer 4 (Transport)." },
      { id: "proto-ip", label: "IPv4 & IPv6", targetLayer: 3, explanation: "IP provides logical addressing and routing at Layer 3 (Network)." },
      { id: "proto-eth", label: "Ethernet & Wi-Fi", targetLayer: 2, explanation: "Ethernet (802.3) and Wi-Fi (802.11) operate at Layer 2 (Data Link) using MAC addresses." },
      { id: "proto-tls", label: "TLS / SSL", targetLayer: 6, explanation: "TLS encrypts and formats data payloads at Layer 6 (Presentation)." }
    ]
  },
  {
    round: 3,
    title: "Round 3: Core Responsibilities & Devices",
    description: "Map each architectural responsibility and device to its layer.",
    items: [
      { id: "resp-route", label: "IP Routing & Routers", targetLayer: 3, explanation: "Routers inspect IP destination addresses at Layer 3 (Network)." },
      { id: "resp-switch", label: "MAC Switching & Switches", targetLayer: 2, explanation: "Switches forward frames based on Layer 2 MAC addresses." },
      { id: "resp-ports", label: "Port Addressing (0-65535)", targetLayer: 4, explanation: "Port numbers identify application endpoints at Layer 4 (Transport)." },
      { id: "resp-cables", label: "Fiber Optic & Cat6 Copper", targetLayer: 1, explanation: "Physical mediums operate at Layer 1 (Physical)." },
      { id: "resp-api", label: "REST APIs & Web Services", targetLayer: 7, explanation: "Application software APIs run at Layer 7 (Application)." }
    ]
  }
];

const OSI_LAYERS = [
  { num: 7, name: "Application", color: "text-purple-400 border-purple-500/30" },
  { num: 6, name: "Presentation", color: "text-indigo-400 border-indigo-500/30" },
  { num: 5, name: "Session", color: "text-blue-400 border-blue-500/30" },
  { num: 4, name: "Transport", color: "text-cyan-400 border-cyan-500/30" },
  { num: 3, name: "Network", color: "text-emerald-400 border-emerald-500/30" },
  { num: 2, name: "Data Link", color: "text-amber-400 border-amber-500/30" },
  { num: 1, name: "Physical", color: "text-rose-400 border-rose-500/30" },
];

export default function PacketLayerSortingGame({ onCompleteGame }) {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [placedItems, setPlacedItems] = useState({}); // { [itemId]: targetLayer }
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);

  const round = ROUNDS[currentRoundIdx];
  const unplacedItems = round.items.filter((item) => placedItems[item.id] === undefined);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setFeedback(null);
  };

  const handleLayerTarget = (layerNum) => {
    if (!selectedItem) return;

    if (selectedItem.targetLayer === layerNum) {
      // Correct match!
      setPlacedItems({ ...placedItems, [selectedItem.id]: layerNum });
      setScore((prev) => prev + 25);
      setFeedback({
        type: "correct",
        message: `Correct! ${selectedItem.explanation}`
      });
      setSelectedItem(null);
    } else {
      // Incorrect match
      setFeedback({
        type: "incorrect",
        message: `Incorrect for ${selectedItem.label}. Hint: ${selectedItem.explanation}`
      });
    }
  };

  const isRoundComplete = unplacedItems.length === 0 && round.items.every(
    (item) => placedItems[item.id] === item.targetLayer
  );

  const handleNextRound = () => {
    if (currentRoundIdx < ROUNDS.length - 1) {
      setCurrentRoundIdx((prev) => prev + 1);
      setPlacedItems({});
      setSelectedItem(null);
      setFeedback(null);
    } else if (onCompleteGame) {
      onCompleteGame({ gameId: "packet-sorting", score: score + 50 });
    }
  };

  const handleResetRound = () => {
    setPlacedItems({});
    setSelectedItem(null);
    setFeedback(null);
  };

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
              Round {round.round} of {ROUNDS.length}
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">{round.title}</h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
            Score: {score} XP
          </span>
        </div>

        <p className="text-xs text-zinc-300 mb-4">{round.description}</p>

        {/* Unplaced Items Pool */}
        <div className="p-4 rounded-xl bg-page border border-white/10 mb-6">
          <span className="text-[10px] text-zinc-400 uppercase font-mono block mb-2">
            Items to Sort ({unplacedItems.length} remaining)
          </span>
          {unplacedItems.length === 0 ? (
            <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> All items sorted correctly for this round!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {unplacedItems.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleItemSelect(item)}
                    className={`px-3 py-2 rounded-lg border text-xs font-mono font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-cyan-500 text-black border-cyan-400 shadow-md ring-2 ring-cyan-400/50"
                        : "bg-raised hover:bg-white/10 text-fg border-white/12"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}
          {selectedItem && (
            <p className="text-xs text-cyan-400 font-mono mt-3">
              Now click the target OSI Layer (1-7) below for: <strong>{selectedItem.label}</strong>
            </p>
          )}
        </div>

        {/* 7 OSI Layers Target Buckets */}
        <div className="space-y-2">
          {OSI_LAYERS.map((layer) => {
            const itemsInLayer = round.items.filter((item) => placedItems[item.id] === layer.num);

            return (
              <button
                key={layer.num}
                type="button"
                onClick={() => handleLayerTarget(layer.num)}
                disabled={!selectedItem}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all ${
                  selectedItem
                    ? "hover:border-cyan-400/70 hover:bg-white/5 cursor-pointer"
                    : "cursor-default"
                } ${layer.color} bg-raised/30`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center font-mono font-bold text-xs">
                    L{layer.num}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-fg block">{layer.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">Layer {layer.num}</span>
                  </div>
                </div>

                {/* Items placed in this bucket */}
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {itemsInLayer.map((placed) => (
                    <span
                      key={placed.id}
                      className="px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-mono flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{placed.label}</span>
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3.5 rounded-xl border mt-4 text-xs flex items-start gap-2.5 ${
              feedback.type === "correct"
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-200"
                : "bg-red-950/30 border-red-500/40 text-red-200"
            }`}
          >
            {feedback.type === "correct" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{feedback.message}</p>
          </div>
        )}

        {/* Round Actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleResetRound}
            className="px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 text-xs text-muted hover:text-fg"
          >
            Reset Round
          </button>

          {isRoundComplete && (
            <button
              type="button"
              onClick={handleNextRound}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentRoundIdx < ROUNDS.length - 1 ? "Next Round" : "Complete Game"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
