import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Network,
  Zap,
  Globe,
  Layers,
  Terminal,
  Hash,
  BookOpen,
  Gamepad2,
  ChevronRight
} from "lucide-react";
import CyberPathLogo from "../../components/common/CyberPathLogo";
import {
  PacketJourneySim,
  TcpHandshakeSim,
  DnsResolutionSim,
  OsiEncapsulationSim,
  ArpDiscoverySim,
  SubnetVisualizerSim
} from "../../components/networking/simulations";

const SIMULATIONS = [
  {
    id: "packet-journey",
    title: "Packet Journey Visualizer",
    subtitle: "End-to-End Hop Traversal",
    icon: Network,
    color: "text-cyan-400",
    component: PacketJourneySim,
    description: "Visualize Layer 2 MAC addresses changing at every hop across switch and router while Layer 3 destination IP remains fixed, with NAT address translation."
  },
  {
    id: "tcp-handshake",
    title: "TCP 3-Way Handshake",
    subtitle: "SYN, SYN-ACK, ACK State Machine",
    icon: Zap,
    color: "text-blue-400",
    component: TcpHandshakeSim,
    description: "Inspect sequence number synchronization, acknowledgment arithmetic, and client/server connection state machine transitions."
  },
  {
    id: "dns-resolution",
    title: "Hierarchical DNS Resolver",
    subtitle: "Root ➔ TLD ➔ Authoritative",
    icon: Globe,
    color: "text-purple-400",
    component: DnsResolutionSim,
    description: "Follow a recursive resolver querying root nameservers, .dev TLD registry servers, and authoritative nameservers to resolve an A record."
  },
  {
    id: "osi-encapsulation",
    title: "OSI Encapsulation Stack",
    subtitle: "Data ➔ Segment ➔ Packet ➔ Frame ➔ Bits",
    icon: Layers,
    color: "text-indigo-400",
    component: OsiEncapsulationSim,
    description: "Step-by-step encapsulation wrapping application payloads with TCP, IP, and Ethernet headers, with reversible decapsulation mode."
  },
  {
    id: "arp-discovery",
    title: "ARP Resolution & Flooding",
    subtitle: "Layer 2 Broadcasts & Unicast Reply",
    icon: Terminal,
    color: "text-emerald-400",
    component: ArpDiscoverySim,
    description: "Observe a switch flooding a broadcast ARP request (FF:FF:FF:FF:FF:FF) and the target device returning a unicast reply to update the ARP cache."
  },
  {
    id: "subnet-visualizer",
    title: "IPv4 Subnet Visualizer",
    subtitle: "CIDR Prefix & Binary Boundaries",
    icon: Hash,
    color: "text-amber-400",
    component: SubnetVisualizerSim,
    description: "Interactive CIDR calculation calculating Network ID, Broadcast Address, usable host counts, and visual block slot allocation."
  }
];

export default function NetworkingSimulationsView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const simParam = searchParams.get("sim");

  const [activeSimId, setActiveSimId] = useState(
    SIMULATIONS.some((s) => s.id === simParam) ? simParam : "packet-journey"
  );

  useEffect(() => {
    if (simParam && SIMULATIONS.some((s) => s.id === simParam)) {
      setActiveSimId(simParam);
    }
  }, [simParam]);

  const activeSim = SIMULATIONS.find((s) => s.id === activeSimId) || SIMULATIONS[0];
  const ActiveComponent = activeSim.component;

  const handleSelectSim = (id) => {
    setActiveSimId(id);
    setSearchParams({ sim: id });
  };

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/12 bg-page/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/networking"
            className="p-2 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Networking Hub</span>
          </Link>
          <div className="h-4 w-px bg-raised hidden sm:block" />
          <div className="flex items-center gap-2">
            <CyberPathLogo size="xs" glow />
            <span className="text-xs font-mono text-cyan-400 font-semibold">
              Simulation Lab
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <Link
            to="/networking/games"
            className="text-purple-400 hover:text-purple-300 px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1.5 font-medium"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mini-Games</span>
          </Link>
          <Link
            to="/networking"
            className="text-muted hover:text-fg px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors"
          >
            Curriculum
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Header Banner */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Visual Simulation Workbench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-fg">
            Protocol Simulation Laboratory
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Real-time deterministic simulation engines illustrating how packets are encapsulated, addressed, routed, and resolved across local networks and the global Internet.
          </p>
        </div>

        {/* Tab Selection Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 border-b border-white/10 pb-4">
          {SIMULATIONS.map((sim) => {
            const Icon = sim.icon;
            const isActive = activeSimId === sim.id;
            return (
              <button
                key={sim.id}
                type="button"
                onClick={() => handleSelectSim(sim.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-cyan-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/40"
                    : "bg-surface hover:bg-raised border-white/10 text-muted hover:text-fg"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : sim.color}`} />
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                </div>
                <div>
                  <h3 className={`text-xs font-bold truncate ${isActive ? "text-fg" : "text-zinc-300"}`}>
                    {sim.title}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 block truncate mt-0.5">
                    {sim.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Simulation Description */}
        <div className="p-4 rounded-xl bg-surface border border-white/10 flex items-start gap-3 text-xs text-zinc-300">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <activeSim.icon className={`w-4 h-4 ${activeSim.color}`} />
          </div>
          <div>
            <span className="font-bold text-fg block text-sm">{activeSim.title}</span>
            <p className="mt-0.5 leading-relaxed text-zinc-400">{activeSim.description}</p>
          </div>
        </div>

        {/* Active Simulation Component */}
        <div className="pt-2">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
