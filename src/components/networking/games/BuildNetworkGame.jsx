import { useState } from "react";
import { Laptop, Network, Router as RouterIcon, Server, Globe, CheckCircle2, XCircle, RotateCcw, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";

const LEVELS = [
  {
    id: 1,
    title: "Scenario 1: Connect a Simple Home LAN",
    goal: "Connect Workstation A and Workstation B to a central Layer 2 switch so they can communicate locally on subnet 192.168.1.0/24.",
    requiredDevices: ["pcA", "switch", "pcB"],
    correctConnections: [
      { from: "pcA", to: "switch" },
      { from: "pcB", to: "switch" }
    ],
    hint: "Both computers must connect directly to the central switch. In a star topology, hosts do not connect directly to each other."
  },
  {
    id: 2,
    title: "Scenario 2: Gateway to the Internet",
    goal: "Connect the office LAN switch to a Default Gateway Router, and connect the router to the ISP Internet Cloud.",
    requiredDevices: ["switch", "router", "cloud"],
    correctConnections: [
      { from: "switch", to: "router" },
      { from: "router", to: "cloud" }
    ],
    hint: "Switches cannot route across WANs. The switch must connect to the router's LAN interface, and the router's WAN port connects to the Cloud."
  },
  {
    id: 3,
    title: "Scenario 3: Complete Enterprise Web DMZ",
    goal: "Build an end-to-end architecture: Client PC -> Office Switch -> Router -> Web Server in DMZ.",
    requiredDevices: ["pcA", "switch", "router", "server"],
    correctConnections: [
      { from: "pcA", to: "switch" },
      { from: "switch", to: "router" },
      { from: "router", to: "server" }
    ],
    hint: "The client connects to the switch. The switch uplinks to the router. The web server sits on the router's DMZ interface."
  }
];

export default function BuildNetworkGame({ onCompleteGame }) {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [activeConnections, setActiveConnections] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [score, setScore] = useState(0);

  const scenario = LEVELS[currentLevelIdx];

  const devicesList = [
    { id: "pcA", label: "Workstation A", ip: "192.168.1.10", icon: Laptop },
    { id: "pcB", label: "Workstation B", ip: "192.168.1.20", icon: Laptop },
    { id: "switch", label: "Core Switch", ip: "Layer 2 (CAM)", icon: Network },
    { id: "router", label: "Default Gateway", ip: "192.168.1.1", icon: RouterIcon },
    { id: "server", label: "Web Server (DMZ)", ip: "10.0.5.80", icon: Server },
    { id: "cloud", label: "ISP Internet Cloud", ip: "WAN / 0.0.0.0/0", icon: Globe },
  ].filter((d) => scenario.requiredDevices.includes(d.id));

  const handleDeviceClick = (devId) => {
    if (!selectedDevice) {
      setSelectedDevice(devId);
    } else {
      if (selectedDevice === devId) {
        setSelectedDevice(null);
        return;
      }
      // Check if connection already exists
      const exists = activeConnections.some(
        (c) => (c.from === selectedDevice && c.to === devId) || (c.from === devId && c.to === selectedDevice)
      );
      if (!exists) {
        setActiveConnections([...activeConnections, { from: selectedDevice, to: devId }]);
      } else {
        // Toggle off / remove connection
        setActiveConnections(
          activeConnections.filter(
            (c) => !((c.from === selectedDevice && c.to === devId) || (c.from === devId && c.to === selectedDevice))
          )
        );
      }
      setSelectedDevice(null);
      setEvaluation(null);
    }
  };

  const handleVerifyTopology = () => {
    const required = scenario.correctConnections;
    let missing = [];

    for (const req of required) {
      const match = activeConnections.some(
        (c) => (c.from === req.from && c.to === req.to) || (c.from === req.to && c.to === req.from)
      );
      if (!match) missing.push(req);
    }

    const extra = activeConnections.filter((c) => {
      return !required.some(
        (r) => (r.from === c.from && r.to === c.to) || (r.from === c.to && r.to === c.from)
      );
    });

    if (missing.length === 0 && extra.length === 0) {
      setEvaluation({
        passed: true,
        message: "Valid topology verified! Traffic flows properly without routing loops or invalid interfaces."
      });
      setScore((prev) => prev + 100);
    } else {
      let msg = "Invalid topology: ";
      if (missing.length > 0) {
        msg += `Missing critical link between ${missing[0].from.toUpperCase()} and ${missing[0].to.toUpperCase()}. `;
      }
      if (extra.length > 0) {
        msg += `Redundant or unsupported link between ${extra[0].from.toUpperCase()} and ${extra[0].to.toUpperCase()}.`;
      }
      setEvaluation({
        passed: false,
        message: msg
      });
    }
  };

  const handleReset = () => {
    setActiveConnections([]);
    setSelectedDevice(null);
    setEvaluation(null);
  };

  const handleNextLevel = () => {
    if (currentLevelIdx < LEVELS.length - 1) {
      setCurrentLevelIdx((prev) => prev + 1);
      setActiveConnections([]);
      setSelectedDevice(null);
      setEvaluation(null);
    } else if (onCompleteGame) {
      onCompleteGame({ gameId: "build-network", score: score + 100 });
    }
  };

  return (
    <div className="space-y-4">
      {/* Game Stage */}
      <div className="relative overflow-hidden rounded-2xl bg-surface p-6 border border-white/12 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-white/10">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
              Level {scenario.id} of {LEVELS.length}
            </span>
            <h3 className="text-base font-bold text-fg tracking-tight">{scenario.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-300">
              Score: {score} XP
            </span>
          </div>
        </div>

        {/* Goal Banner */}
        <div className="p-3.5 rounded-xl bg-page border border-white/10 flex items-start gap-2.5 text-xs text-zinc-300 leading-relaxed">
          <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-fg">Objective:</p>
            <p>{scenario.goal}</p>
            <p className="text-[11px] text-zinc-400 mt-1 italic">
              Hint: Click a device to select it, then click another device to link them. Click again to remove a link.
            </p>
          </div>
        </div>

        {/* Interactive Device Grid */}
        <div className="my-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {devicesList.map((dev) => {
            const Icon = dev.icon;
            const isSelected = selectedDevice === dev.id;
            const connectedLinks = activeConnections.filter(
              (c) => c.from === dev.id || c.to === dev.id
            );

            return (
              <button
                key={dev.id}
                type="button"
                onClick={() => handleDeviceClick(dev.id)}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer relative ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-500/20"
                    : connectedLinks.length > 0
                    ? "bg-raised/90 border-cyan-500/30 text-fg"
                    : "bg-raised/40 border-white/10 text-muted hover:border-white/25 hover:text-fg"
                }`}
              >
                {connectedLinks.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-sm" />
                )}
                <div className="w-10 h-10 mx-auto rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? "text-cyan-300" : "text-fg"}`} />
                </div>
                <p className="text-xs font-semibold text-fg">{dev.label}</p>
                <p className="text-[10px] font-mono text-zinc-400 mt-0.5">{dev.ip}</p>
                <span className="text-[10px] font-mono text-cyan-400 block mt-1.5">
                  {connectedLinks.length} {connectedLinks.length === 1 ? "cable" : "cables"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Connections List */}
        <div className="p-3.5 rounded-xl bg-page border border-white/10">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-mono text-zinc-400 uppercase text-[10px]">Cabled Connections ({activeConnections.length})</span>
            {activeConnections.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-muted hover:text-danger flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Clear Cables
              </button>
            )}
          </div>

          {activeConnections.length === 0 ? (
            <p className="text-xs text-muted italic font-mono py-1">No cables connected yet. Click any two devices to wire them.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {activeConnections.map((c, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-raised border border-cyan-500/30 text-xs font-mono text-cyan-300"
                >
                  <span>{c.from.toUpperCase()}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500" />
                  <span>{c.to.toUpperCase()}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Evaluation Feedback */}
        {evaluation && (
          <div
            className={`p-4 rounded-xl border mt-4 text-xs flex items-start gap-3 ${
              evaluation.passed
                ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-200"
                : "bg-red-950/30 border-red-500/50 text-red-200"
            }`}
          >
            {evaluation.passed ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{evaluation.passed ? "Success!" : "Connection Fault Detected"}</p>
              <p className="mt-1 leading-relaxed">{evaluation.message}</p>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/10">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 text-xs text-muted hover:text-fg font-medium"
          >
            Reset
          </button>

          {!evaluation?.passed ? (
            <button
              type="button"
              onClick={handleVerifyTopology}
              disabled={activeConnections.length === 0}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-black transition-colors"
            >
              Verify Connections
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNextLevel}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-xs font-semibold text-black transition-colors flex items-center gap-1.5"
            >
              <span>{currentLevelIdx < LEVELS.length - 1 ? "Next Scenario" : "Complete Game"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
