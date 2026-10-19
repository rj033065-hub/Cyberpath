import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Network,
  Layers,
  Hash,
  Zap,
  ShieldAlert,
  Terminal,
  CheckCircle2,
  LockKeyhole,
  PlayCircle,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
  Gamepad2,
  Activity,
  Award,
  ChevronRight,
  ArrowLeft,
  Filter
} from "lucide-react";
import CyberPathLogo from "../../components/common/CyberPathLogo";
import {
  NETWORKING_MODULE_METADATA,
  NETWORKING_LEVELS,
  getAllNetworkingLessons
} from "../../data/networkingCurriculumData";
import { getNetworkingCompletedLessons, getNetworkingGameStats } from "../../lib/networkingService";

const LEVEL_ICONS = {
  1: Network,
  2: Layers,
  3: Hash,
  4: Zap,
  5: ShieldAlert,
  6: Terminal,
};

export default function NetworkingLanding() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [gameStats, setGameStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState("all");

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const completed = await getNetworkingCompletedLessons(user?.id);
        const games = getNetworkingGameStats(user?.id);
        if (isMounted) {
          setCompletedSlugs(completed);
          setGameStats(games);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const allLessons = getAllNetworkingLessons();
  const totalLessons = allLessons.length;
  const completedCount = completedSlugs.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Next lesson to continue
  const nextLesson = allLessons.find((l) => !completedSlugs.includes(l.slug)) || allLessons[0];

  // Filtering
  const filteredLevels = NETWORKING_LEVELS.filter((lvl) => {
    if (selectedLevelFilter !== "all" && lvl.level !== Number(selectedLevelFilter)) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const titleMatch = lvl.title.toLowerCase().includes(q) || lvl.description.toLowerCase().includes(q);
    const lessonMatch = lvl.lessons.some(
      (les) => les.title.toLowerCase().includes(q) || les.summary.toLowerCase().includes(q)
    );
    return titleMatch || lessonMatch;
  });

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/12 bg-page/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg text-muted hover:text-fg hover:bg-raised transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-raised hidden sm:block" />
          <Link to="/" className="flex items-center gap-2 group">
            <CyberPathLogo size="xs" glow />
            <span className="font-bold tracking-tight text-sm text-fg">
              Cyber<span className="text-blue-400">Path</span>
              <span className="text-xs font-mono text-cyan-400 ml-1.5">/ Networking</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          <Link
            to="/networking/simulations"
            className="text-cyan-400 hover:text-cyan-300 px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1.5 font-medium"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Simulations</span>
          </Link>

          <Link
            to="/networking/games"
            className="text-purple-400 hover:text-purple-300 px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1.5 font-medium"
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Mini-Games</span>
          </Link>

          <Link
            to="/labs"
            className="text-muted hover:text-fg px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors hidden md:block"
          >
            Security Labs
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-surface p-6 sm:p-10 border border-white/12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/[0.06] blur-[120px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 text-xs font-mono">
                <Network className="w-3.5 h-3.5" />
                <span>Beginner-to-Practitioner Track · 6 Levels</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-fg">
                Networking for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Cybersecurity</span>
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Before you can hack or defend networks, you must understand how data actually moves across them. Master LANs, WANs, the 7 OSI layers, CIDR subnetting, packet headers, and diagnostic tooling through theory, interactive simulations, and mini-games.
              </p>

              {/* Progress Summary */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono">
                <span className="text-zinc-400">
                  Progress: <strong className="text-cyan-400">{completedCount}</strong> of {totalLessons} lessons ({progressPercent}%)
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400">
                  Target Badge: <strong className="text-emerald-400">Network Navigator</strong>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-md h-2 rounded-full bg-raised overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Quick Action Box */}
            <div className="flex flex-col gap-3 sm:min-w-[240px]">
              {nextLesson && (
                <Link
                  to={`/networking/lesson/${nextLesson.slug}`}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{completedCount > 0 ? "Continue Learning" : "Start Level 1"}</span>
                </Link>
              )}

              <Link
                to="/networking/simulations"
                className="px-4 py-2.5 rounded-xl bg-raised hover:bg-white/10 border border-white/12 text-fg text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Interactive Simulations</span>
              </Link>

              <Link
                to="/networking/games"
                className="px-4 py-2.5 rounded-xl bg-raised hover:bg-white/10 border border-white/12 text-fg text-xs font-medium text-center transition-colors flex items-center justify-center gap-2"
              >
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Mini-Games Arcade</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Search & Topic Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search concepts (e.g. subnet, DNS, OSI)..."
              className="w-full bg-surface border border-white/12 pl-9 pr-4 py-2 rounded-xl text-xs text-fg focus:outline-none focus:border-cyan-500/60 placeholder:text-muted"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedLevelFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                selectedLevelFilter === "all"
                  ? "bg-cyan-500 text-black font-semibold"
                  : "bg-surface hover:bg-raised text-muted"
              }`}
            >
              All Levels
            </button>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSelectedLevelFilter(String(num))}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors shrink-0 ${
                  selectedLevelFilter === String(num)
                    ? "bg-cyan-500 text-black font-semibold"
                    : "bg-surface hover:bg-raised text-muted"
                }`}
              >
                Lvl {num}
              </button>
            ))}
          </div>
        </div>

        {/* 6 Progressive Levels Curriculum Roadmap */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-fg tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Curriculum Roadmap (Levels 1–6)</span>
            </h2>
            <span className="text-xs text-muted font-mono">{filteredLevels.length} levels shown</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredLevels.map((lvl) => {
              const Icon = LEVEL_ICONS[lvl.level] || Network;
              const levelLessons = lvl.lessons;
              const levelCompleted = levelLessons.filter((l) => completedSlugs.includes(l.slug)).length;
              const isLevelDone = levelLessons.length > 0 && levelCompleted === levelLessons.length;

              return (
                <div
                  key={lvl.id}
                  className="rounded-2xl bg-surface border border-white/12 p-5 sm:p-6 transition-all hover:border-white/20 shadow-md space-y-4"
                >
                  {/* Level Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${lvl.color}15`,
                          borderColor: `${lvl.color}40`,
                        }}
                      >
                        <Icon className="w-5 h-5" style={{ color: lvl.color }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold" style={{ color: lvl.color }}>
                            Level {lvl.level}
                          </span>
                          <span className="text-xs text-muted font-mono">• {lvl.estimatedMinutes} mins</span>
                          {isLevelDone && (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                              <CheckCircle2 className="w-3 h-3" /> Mastered
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-fg tracking-tight mt-0.5">{lvl.title}</h3>
                        <p className="text-xs text-zinc-400 mt-0.5">{lvl.subtitle}</p>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-zinc-400 self-start sm:self-auto">
                      {levelCompleted} of {levelLessons.length} Completed
                    </span>
                  </div>

                  {/* Lessons in this Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {levelLessons.map((les) => {
                      const isComplete = completedSlugs.includes(les.slug);
                      return (
                        <Link
                          key={les.slug}
                          to={`/networking/lesson/${les.slug}`}
                          className={`group p-4 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            isComplete
                              ? "bg-raised/40 border-emerald-500/30 hover:border-emerald-500/60"
                              : "bg-raised/70 border-white/10 hover:border-cyan-500/50 hover:bg-raised"
                          }`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono text-muted">Lesson {les.sequenceOrder}</span>
                              {isComplete ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                                  <CheckCircle2 className="w-3 h-3" /> Completed
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-muted">{les.estimatedMinutes} min</span>
                              )}
                            </div>
                            <h4 className="text-sm font-semibold text-fg group-hover:text-cyan-300 transition-colors">
                              {les.title}
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                              {les.summary}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                            <span>{isComplete ? "Review Lesson" : "Start Lesson"}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Visual Simulations Showcase */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-fg tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>Interactive Visual Simulations</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">Real-time deterministic simulation engines explaining complex protocols</p>
            </div>
            <Link
              to="/networking/simulations"
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Explore All (6)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: "packet-journey", title: "Packet Journey Visualizer", desc: "Follow frames across client, switch, router (NAT), and server.", icon: Network, color: "text-cyan-400" },
              { id: "tcp-handshake", title: "TCP 3-Way Handshake", desc: "Animate SYN, SYN-ACK, and ACK with state machine transitions.", icon: Zap, color: "text-blue-400" },
              { id: "dns-resolution", title: "Hierarchical DNS Resolver", desc: "Trace Root, TLD, and Authoritative servers resolving names.", icon: BookOpen, color: "text-purple-400" },
              { id: "osi-encapsulation", title: "OSI Encapsulation Stack", desc: "Step through Data, Segment, Packet, Frame, and bitstreams.", icon: Layers, color: "text-indigo-400" },
              { id: "arp-discovery", title: "ARP Resolution & Flooding", desc: "Simulate broadcast queries and unicast replies on a switch.", icon: Terminal, color: "text-emerald-400" },
              { id: "subnet-visualizer", title: "IPv4 Subnet Visualizer", desc: "Interactive CIDR calculation and visual host slot breakdown.", icon: Hash, color: "text-amber-400" },
            ].map((sim) => {
              const Icon = sim.icon;
              return (
                <Link
                  key={sim.id}
                  to={`/networking/simulations?sim=${sim.id}`}
                  className="p-4 rounded-xl bg-surface hover:bg-raised border border-white/10 hover:border-cyan-500/40 transition-all text-left flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className={`w-4 h-4 ${sim.color}`} />
                    </div>
                    <h3 className="text-xs font-bold text-fg group-hover:text-cyan-300 transition-colors">
                      {sim.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {sim.desc}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1 pt-2 border-t border-white/5">
                    <span>Launch Simulator</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Mini-Games Showcase */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-fg tracking-tight flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <span>Hands-on Mini-Games</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">Test your networking fluency through interactive puzzle challenges</p>
            </div>
            <Link
              to="/networking/games"
              className="text-xs font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              <span>Arcade Hub (6)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { id: "build-network", title: "Build Your First Network", desc: "Select devices and connect valid cables to route traffic." },
              { id: "packet-sorting", title: "Packet Layer Sorting", desc: "Sort PDUs, protocols, and tasks into the 7 OSI layers." },
              { id: "follow-packet", title: "Follow the Packet", desc: "Inspect hops and answer tactical routing and header questions." },
              { id: "subnet-challenge", title: "Subnet Challenge Gauntlet", desc: "Solve progressively harder binary & CIDR questions." },
              { id: "packet-detective", title: "Packet Detective", desc: "Inspect realistic network traffic logs to catch cyber attacks." },
              { id: "network-troubleshooter", title: "Network Troubleshooter", desc: "Run simulated CLI diagnostic probes to fix broken connections." },
            ].map((game) => {
              const stats = gameStats[game.id];
              return (
                <Link
                  key={game.id}
                  to={`/networking/games?game=${game.id}`}
                  className="p-4 rounded-xl bg-surface hover:bg-raised border border-white/10 hover:border-purple-500/40 transition-all text-left flex flex-col justify-between space-y-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-semibold">Mini-Game</span>
                      {stats?.completed && (
                        <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Best: {stats.bestScore} XP
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-fg group-hover:text-purple-300 transition-colors">
                      {game.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {game.desc}
                    </p>
                  </div>
                  <span className="text-[11px] font-mono text-purple-400 flex items-center gap-1 pt-2 border-t border-white/5">
                    <span>Play Challenge</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Connected Cybersecurity Tracks & Labs */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-fg tracking-tight">Connected Cybersecurity Labs</h3>
              <p className="text-xs text-muted">Apply your networking knowledge to hands-on security challenges:</p>
            </div>
            <Link to="/labs" className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
              View All Labs
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <Link to="/labs/sqli-basics" className="p-3.5 rounded-xl bg-raised border border-white/10 hover:border-white/20 transition-all">
              <span className="text-cyan-400 font-semibold block">SQL Injection Fundamentals</span>
              <p className="text-zinc-400 mt-1 text-[11px]">Analyze HTTP requests & auth bypass vectors.</p>
            </Link>
            <Link to="/labs/xss-playground" className="p-3.5 rounded-xl bg-raised border border-white/10 hover:border-white/20 transition-all">
              <span className="text-blue-400 font-semibold block">XSS Playground</span>
              <p className="text-zinc-400 mt-1 text-[11px]">Inspect browser DOM execution & output encoding.</p>
            </Link>
            <Link to="/labs/idor-investigation" className="p-3.5 rounded-xl bg-raised border border-white/10 hover:border-white/20 transition-all">
              <span className="text-purple-400 font-semibold block">IDOR Investigation</span>
              <p className="text-zinc-400 mt-1 text-[11px]">Audit authorization controls on REST APIs.</p>
            </Link>
            <Link to="/labs/auth-checkpoint" className="p-3.5 rounded-xl bg-raised border border-white/10 hover:border-white/20 transition-all">
              <span className="text-emerald-400 font-semibold block">Authentication Checkpoint</span>
              <p className="text-zinc-400 mt-1 text-[11px]">Enforce rate-limiting, sessions & cookies.</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
