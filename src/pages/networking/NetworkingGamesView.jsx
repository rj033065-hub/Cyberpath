import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  Gamepad2,
  Trophy,
  CheckCircle2,
  Sparkles,
  Network,
  Layers,
  Search,
  Hash,
  Terminal,
  Activity,
  Award
} from "lucide-react";
import CyberPathLogo from "../../components/common/CyberPathLogo";
import {
  BuildNetworkGame,
  PacketLayerSortingGame,
  FollowThePacketGame,
  SubnetChallengeGame,
  PacketDetectiveGame,
  NetworkTroubleshooterGame
} from "../../components/networking/games";
import { recordNetworkingGameScore, getNetworkingGameStats } from "../../lib/networkingService";

const GAMES = [
  {
    id: "build-network",
    title: "Build Your First Network",
    shortName: "Build Network",
    icon: Network,
    color: "text-cyan-400",
    component: BuildNetworkGame,
    description: "Construct small networks by wiring PCs, switches, routers, and web servers. Learn why topology and correct interface cabling matter."
  },
  {
    id: "packet-sorting",
    title: "Packet Layer Sorting",
    shortName: "OSI Sorting",
    icon: Layers,
    color: "text-blue-400",
    component: PacketLayerSortingGame,
    description: "Drag or match protocols, PDUs (packets, frames, segments), and architectural duties to their correct OSI layer."
  },
  {
    id: "follow-packet",
    title: "Follow the Packet",
    shortName: "Follow Packet",
    icon: Activity,
    color: "text-emerald-400",
    component: FollowThePacketGame,
    description: "Inspect a packet journey hop by hop and answer tactical questions regarding routing tables, ports, NAT, and TLS."
  },
  {
    id: "subnet-challenge",
    title: "Subnet Challenge Gauntlet",
    shortName: "Subnet Math",
    icon: Hash,
    color: "text-amber-400",
    component: SubnetChallengeGame,
    description: "Solve progressively harder binary, CIDR, and network boundary calculations with instant mathematical explanations."
  },
  {
    id: "packet-detective",
    title: "Packet Detective",
    shortName: "Detective",
    icon: Search,
    color: "text-purple-400",
    component: PacketDetectiveGame,
    description: "Examine a realistic fictional dataset of network traffic events to catch port scanners, unencrypted passwords, and ARP spoofing."
  },
  {
    id: "network-troubleshooter",
    title: "Network Troubleshooter",
    shortName: "Troubleshoot",
    icon: Terminal,
    color: "text-rose-400",
    component: NetworkTroubleshooterGame,
    description: "Diagnose realistic helpdesk incident tickets by executing simulated CLI diagnostics (ping, ipconfig, nslookup, netstat)."
  }
];

export default function NetworkingGamesView() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const gameParam = searchParams.get("game");

  const [activeGameId, setActiveGameId] = useState(
    GAMES.some((g) => g.id === gameParam) ? gameParam : "build-network"
  );
  const [gameStats, setGameStats] = useState({});
  const [lastReward, setLastReward] = useState(null);

  useEffect(() => {
    if (gameParam && GAMES.some((g) => g.id === gameParam)) {
      setActiveGameId(gameParam);
    }
  }, [gameParam]);

  useEffect(() => {
    const stats = getNetworkingGameStats(user?.id);
    setGameStats(stats);
  }, [user?.id]);

  const activeGame = GAMES.find((g) => g.id === activeGameId) || GAMES[0];
  const ActiveGameComponent = activeGame.component;

  const handleSelectGame = (id) => {
    setActiveGameId(id);
    setSearchParams({ game: id });
    setLastReward(null);
  };

  const handleCompleteGame = ({ gameId, score }) => {
    const res = recordNetworkingGameScore(user?.id, gameId, score);
    setGameStats(res.allGameStats);
    setLastReward({
      gameId,
      score,
      xpAwarded: res.xpAwarded,
      isNewBest: res.isNewBest,
      isFirstCompletion: res.isFirstCompletion
    });
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
            <span className="text-xs font-mono text-purple-400 font-semibold">
              Networking Arcade
            </span>
          </div>
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 text-purple-400 text-xs font-mono">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Interactive Mini-Games Arcade</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-fg">
            Hands-on Networking Challenges
          </h1>
          <p className="text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Gamified learning experiences designed to test your protocol knowledge, troubleshooting instincts, packet dissection, and subnetting speed.
          </p>
        </div>

        {/* Reward Notification Banner */}
        {lastReward && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-surface to-surface border border-purple-500/40 flex items-center justify-between text-xs animate-bounce-once">
            <div className="flex items-center gap-2.5">
              <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-fg block text-sm">Challenge Completed!</span>
                <span className="text-zinc-300">
                  You scored <strong>{lastReward.score} points</strong>.
                  {lastReward.xpAwarded > 0 ? ` +${lastReward.xpAwarded} XP awarded to your profile!` : " Best score recorded!"}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setLastReward(null)}
              className="text-zinc-400 hover:text-fg text-xs font-mono"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Game Tab Selection Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 border-b border-white/10 pb-4">
          {GAMES.map((game) => {
            const Icon = game.icon;
            const isActive = activeGameId === game.id;
            const stats = gameStats[game.id];

            return (
              <button
                key={game.id}
                type="button"
                onClick={() => handleSelectGame(game.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? "bg-purple-950/40 border-purple-400 shadow-md ring-1 ring-purple-400/40"
                    : "bg-surface hover:bg-raised border-white/10 text-muted hover:text-fg"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${isActive ? "text-purple-400" : game.color}`} />
                  {stats?.completed && (
                    <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <div>
                  <h3 className={`text-xs font-bold truncate ${isActive ? "text-fg" : "text-zinc-300"}`}>
                    {game.shortName}
                  </h3>
                  <span className="text-[10px] font-mono text-zinc-500 block truncate mt-0.5">
                    {stats?.bestScore ? `${stats.bestScore} XP` : "Not played"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Game Description */}
        <div className="p-4 rounded-xl bg-surface border border-white/10 flex items-start gap-3 text-xs text-zinc-300">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0">
            <activeGame.icon className={`w-4 h-4 ${activeGame.color}`} />
          </div>
          <div>
            <span className="font-bold text-fg block text-sm">{activeGame.title}</span>
            <p className="mt-0.5 leading-relaxed text-zinc-400">{activeGame.description}</p>
          </div>
        </div>

        {/* Active Game Component */}
        <div className="pt-2">
          <ActiveGameComponent onCompleteGame={handleCompleteGame} />
        </div>
      </main>
    </div>
  );
}
