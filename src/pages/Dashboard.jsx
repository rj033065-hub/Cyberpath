import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  LogOut,
  Flame,
  ShieldCheck,
  Globe,
  Crown,
  Award,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  Compass,
  AlertCircle,
  Database,
  PlayCircle,
  BookOpen,
  ArrowRight,
  Terminal,
  Network,
  HelpCircle,
  ChevronRight,
  Zap,
  User,
  Calendar,
} from "lucide-react";
import { BADGES_DEFINITION } from "../data/curriculumData";
import { getStudentDashboardMetrics } from "../lib/learningService";
import BadgeCard from "../components/badges/BadgeCard";
import NextBadgeFeatured from "../components/badges/NextBadgeFeatured";
import {
  getBadgeProgress,
  getNextBadgeToUnlock,
} from "../components/badges/badgeProgressHelper";

const TRACK_ICONS = {
  "red-team": Flame,
  "blue-team": ShieldCheck,
  "web-security": Globe,
};

const BADGE_ICONS = {
  Terminal,
  Network,
  Globe,
  Compass,
  Flame,
  ShieldCheck,
  Crown,
  Award,
};

const LEARNING_PATHS_INFO = [
  {
    slug: "red-team",
    title: "Red Team",
    subtitle: "Offensive Security",
    icon: Flame,
    colorTheme: "blue",
    borderClass: "border-[#2f81f7]/40 hover:border-[#2f81f7]",
    pillClass: "bg-[#2f81f7]/15 border-[#2f81f7]/40 text-[#58a6ff]",
    description: "Learn ethical hacking, network reconnaissance, and authorized penetration testing workflows.",
    milestonesCount: 12,
    badgeAward: "Red Team Specialist",
  },
  {
    slug: "blue-team",
    title: "Blue Team",
    subtitle: "Defensive Security",
    icon: ShieldCheck,
    colorTheme: "green",
    borderClass: "border-[#3fb950]/40 hover:border-[#3fb950]",
    pillClass: "bg-[#3fb950]/15 border-[#3fb950]/40 text-[#3fb950]",
    description: "Master defensive security operations, threat telemetry analysis, SIEM monitoring, and incident response.",
    milestonesCount: 9,
    badgeAward: "Blue Team Defender",
  },
  {
    slug: "web-security",
    title: "Web Security",
    subtitle: "Application Security",
    icon: Globe,
    colorTheme: "purple",
    borderClass: "border-[#a371f7]/40 hover:border-[#a371f7]",
    pillClass: "bg-[#a371f7]/15 border-[#a371f7]/40 text-[#bc8cff]",
    description: "Explore HTTP mechanics, client-server architectures, OWASP vulnerabilities, and proxy inspection.",
    milestonesCount: 10,
    badgeAward: "Web Security Expert",
  },
];

export default function Dashboard() {
  const { user, profile, signOut, updateProfileSelectedPath, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [savingPath, setSavingPath] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const currentSelectedPath = profile?.selected_path || "red-team";
  const activePathDetails =
    LEARNING_PATHS_INFO.find((p) => p.slug === currentSelectedPath) ||
    LEARNING_PATHS_INFO[0];

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student Researcher";

  // Fetch real student metrics from Supabase / persisted storage
  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      getStudentDashboardMetrics(user.id, currentSelectedPath).then((data) => {
        if (isMounted) {
          setMetrics(data);
          setLoadingMetrics(false);
        }
      });
    } else {
      setLoadingMetrics(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, currentSelectedPath]);

  const handleSelectPath = async (slug) => {
    if (slug === currentSelectedPath) return;

    setSavingPath(true);
    setSaveError("");
    setSaveSuccess(false);

    try {
      const { error } = await updateProfileSelectedPath(slug);
      if (error) {
        setSaveError("Failed to save learning path to your profile in Supabase.");
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        // Refresh metrics for the newly selected path
        if (user?.id) {
          const fresh = await getStudentDashboardMetrics(user.id, slug);
          setMetrics(fresh);
        }
      }
    } catch (err) {
      setSaveError(err.message || "Failed to update learning path.");
    } finally {
      setSavingPath(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const percentComplete = metrics?.percentComplete || 0;
  const completedCount = metrics?.completedCount || 0;
  const totalLessons = metrics?.totalPathLessons || activePathDetails.milestonesCount;
  const remainingCount = metrics?.remainingCount ?? totalLessons;
  const nextLesson = metrics?.nextLesson;
  const earnedBadges = metrics?.earnedBadges || [];
  const nextBadgeToUnlock = getNextBadgeToUnlock(
    BADGES_DEFINITION,
    metrics?.completedLessonSlugs || [],
    metrics?.quizAttemptsMap || {},
    earnedBadges,
    currentSelectedPath
  );

  // Phase 4 Gamification & Recommendation Engine properties
  const recommendation = metrics?.recommendation;
  const xpProfile = metrics?.xpProfile || {
    totalXp: 0,
    levelInfo: { level: 1, title: "Novice Explorer", progressPercent: 0, xpToNextLevel: 100 },
  };
  const streakData = metrics?.streakData || {
    currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0,
    streakStatus: "inactive",
    recentCalendar: [],
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-[#f0f6fc] group-hover:border-[#58a6ff] transition-colors shadow-sm shadow-[#2f81f7]/20">
            <Shield className="w-4 h-4 text-[#58a6ff]" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-[#f0f6fc]">
            Cyber<span className="text-[#58a6ff]">Path</span>
            <span className="text-xs font-mono text-[#8b98a8] ml-2 font-normal hidden sm:inline">
              / Student Dashboard
            </span>
          </span>
        </Link>

        {/* User Identity Chip & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#21262d] bg-[#111821] text-xs">
            <span className="w-2 h-2 rounded-full bg-[#3fb950] animate-pulse" />
            <span className="font-medium text-[#f0f6fc] max-w-[140px] truncate">{displayName}</span>
          </div>

          <Link
            to={`/learn/${currentSelectedPath}`}
            className="text-xs text-[#58a6ff] hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors font-medium hidden md:block"
          >
            Curriculum Roadmap
          </Link>

          <Link
            to="/explore"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="hidden sm:inline">CTF Explorer</span>
          </Link>

          <Link
            to="/labs"
            className="text-xs text-[#58a6ff] hover:text-white px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors flex items-center gap-1 font-medium"
          >
            <Terminal className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span className="hidden sm:inline">Labs</span>
          </Link>

          <Link
            to="/profile"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-[#f2cc60]" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111821] hover:bg-[#16202e] border border-[#21262d] hover:border-[#fa7970]/50 text-xs text-[#8b98a8] hover:text-[#fa7970] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Supabase Connection Banner (development environment only) */}
        {import.meta.env.DEV && !isConfigured && (
          <div className="p-4 rounded-xl border border-[#d29922]/40 bg-[#d29922]/10 text-xs text-[#f2cc60] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 shrink-0 mt-0.5 text-[#f2cc60]" />
              <div>
                <strong className="block text-[#f0f6fc]">Demo Mode Active</strong>
                <span>
                  Configure live Supabase by adding <code className="bg-[#090d14] px-1 py-0.5 rounded text-white font-mono">VITE_SUPABASE_URL</code> and <code className="bg-[#090d14] px-1 py-0.5 rounded text-white font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code className="bg-[#090d14] px-1 py-0.5 rounded text-white font-mono">.env</code>.
                </span>
              </div>
            </div>
            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#d29922]/20 text-[#f2cc60] shrink-0">
              Local Storage Active
            </span>
          </div>
        )}

        {/* FOCAL HERO ELEMENT: Continue Your Lesson */}
        <section className="relative overflow-hidden rounded-2xl bg-[#111722] p-6 sm:p-9 border border-[#212b38]/80 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#2f81f7]/10 blur-[120px] pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3.5 flex-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#58a6ff] uppercase tracking-wider font-semibold">
                  {activePathDetails.title} Track
                </span>
                <span className="text-[#8b98a8] text-xs">·</span>
                <span className="text-xs text-[#8b98a8]">
                  {completedCount} of {totalLessons} lessons finished ({percentComplete}%)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-[#f0f6fc] leading-[1.15]">
                Welcome back, <span className="text-[#58a6ff]">{displayName}</span>
              </h1>

              <p className="text-[15px] sm:text-base text-[#8b98a8] leading-relaxed">
                {recommendation?.reason || "Pick up right where you left off in your cybersecurity curriculum."}
              </p>

              {/* Action Buttons: Continue Learning & View Roadmap */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {recommendation ? (
                  <Link
                    to={recommendation.targetUrl}
                    className="card-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#2f81f7]/25 transition-all"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>{recommendation.actionLabel}: {recommendation.title}</span>
                  </Link>
                ) : (
                  <Link
                    to={`/learn/${currentSelectedPath}`}
                    className="card-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#2f81f7]/25 transition-all"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>Continue Learning Track</span>
                  </Link>
                )}

                <Link
                  to={`/learn/${currentSelectedPath}`}
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#182232] hover:bg-[#1f2d40] text-[#f0f6fc] text-xs sm:text-sm font-medium transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                  <span>Roadmap</span>
                </Link>

                <Link
                  to="/explore"
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#182232] hover:bg-[#1f2d40] text-[#8b98a8] hover:text-[#f0f6fc] text-xs sm:text-sm font-medium transition-all"
                >
                  <Compass className="w-4 h-4 text-[#58a6ff]" />
                  <span>CTF Labs</span>
                </Link>

                <Link
                  to="/labs"
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#182232] hover:bg-[#1f2d40] text-[#58a6ff] hover:text-white text-xs sm:text-sm font-medium transition-all border border-[#2f81f7]/30"
                >
                  <Terminal className="w-4 h-4 text-[#58a6ff]" />
                  <span>Interactive Labs</span>
                </Link>
              </div>
            </div>

            {/* Hero Right Detail Box: Raised surface with background contrast */}
            <div className="bg-[#182232] p-5 sm:p-6 rounded-2xl shrink-0 lg:w-80 w-full space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-[#8b98a8]">
                <span className="uppercase text-[10px]">Active Milestone</span>
                {recommendation?.estimatedMinutes && (
                  <span>~{recommendation.estimatedMinutes}m study</span>
                )}
              </div>

              <h3 className="text-base font-bold text-[#f0f6fc] line-clamp-1">
                {recommendation?.title || activePathDetails.title}
              </h3>
              <p className="text-xs text-[#8b98a8] line-clamp-2 leading-relaxed">
                {recommendation?.moduleTitle || activePathDetails.description}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-[#8b98a8]">Track Progress</span>
                  <span className="text-[#58a6ff] font-bold">{percentComplete}%</span>
                </div>
                <div className="w-full bg-[#090d14] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2f81f7] h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIM STATS STRIP: Replaces bulky stat cards */}
        <div className="bg-[#111722] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Level & XP */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#182232] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2f81f7]/15 flex items-center justify-center text-[#58a6ff]">
              <Zap className="w-4 h-4 text-[#f2cc60]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                Level {xpProfile.levelInfo.level} · {xpProfile.levelInfo.title}
              </div>
              <div className="text-[11px] font-mono text-[#8b98a8]">
                <strong className="text-[#f0f6fc]">{xpProfile.totalXp}</strong> XP verified
              </div>
            </div>
          </Link>

          <div className="hidden sm:block w-px h-6 bg-[#212b38]" />

          {/* Daily Streak */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#182232] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#fa7970]/15 flex items-center justify-center text-[#fa7970]">
              <Flame className="w-4 h-4 text-[#fa7970]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#f0f6fc] group-hover:text-[#fa7970] transition-colors">
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-[11px] font-mono text-[#8b98a8]">
                Longest: {streakData.longestStreak} days
              </div>
            </div>
          </Link>

          <div className="hidden sm:block w-px h-6 bg-[#212b38]" />

          {/* Badges Earned */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-[#182232] transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#f2cc60]/15 flex items-center justify-center text-[#f2cc60]">
              <Award className="w-4 h-4 text-[#f2cc60]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#f0f6fc] group-hover:text-[#f2cc60] transition-colors">
                {earnedBadges.length} / {BADGES_DEFINITION.length} Badges
              </div>
              <div className="text-[11px] font-mono text-[#8b98a8]">
                {BADGES_DEFINITION.length - earnedBadges.length} to unlock
              </div>
            </div>
          </Link>

          <div className="hidden lg:block w-px h-6 bg-[#212b38]" />

          {/* 14-Day Activity Heatmap */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5">
            <span className="text-[11px] font-mono text-[#8b98a8]">Activity</span>
            <div className="flex items-center gap-1">
              {streakData.recentCalendar?.slice(-10).map((day) => (
                <div
                  key={day.dateStr}
                  title={`${day.dateStr}: ${day.hasActivity ? "Active" : "No activity"}`}
                  className={`w-3 h-4 rounded-sm transition-all ${
                    day.hasActivity ? "bg-[#3fb950]" : "bg-[#182232]"
                  } ${day.isToday ? "ring-1 ring-[#58a6ff]" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section: Learning Paths Selector */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-[#f0f6fc] flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#58a6ff]" />
                <span>Your Selected Learning Path</span>
              </h2>
              <p className="text-xs text-[#8b98a8]">
                Select a track below to focus your study. Switching tracks preserves your progress across all paths.
              </p>
            </div>

            {saveSuccess && (
              <span className="text-xs text-[#3fb950] flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Track selection saved to profile!</span>
              </span>
            )}

            {saveError && (
              <span className="text-xs text-[#fa7970] flex items-center gap-1.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4" />
                <span>{saveError}</span>
              </span>
            )}
          </div>

          {/* Path Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {LEARNING_PATHS_INFO.map((path) => {
              const Icon = path.icon;
              const isSelected = currentSelectedPath === path.slug;

              return (
                <div
                  key={path.slug}
                  onClick={() => handleSelectPath(path.slug)}
                  className={`card-interactive rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? "border border-[#2f81f7] bg-[#182232] shadow-xl shadow-[#2f81f7]/15 ring-1 ring-[#2f81f7]/40"
                      : "bg-[#111722] hover:bg-[#182232]/70 border border-transparent hover:border-[#212b38]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-[#2f81f7]/20 text-[#58a6ff]"
                            : "bg-[#090d14] text-[#8b98a8]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      {isSelected ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#2f81f7]/20 text-[#58a6ff] font-semibold">
                          ACTIVE TRACK
                        </span>
                      ) : (
                        <span className="text-xs text-[#8b98a8] font-mono">
                          {path.milestonesCount} lessons
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-[#f0f6fc] mb-1.5">{path.title}</h3>
                    <p className="text-[14px] text-[#8b98a8] leading-relaxed mb-5">{path.description}</p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <Link
                      to={`/learn/${path.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs font-semibold text-[#58a6ff] hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Curriculum</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      disabled={savingPath}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPath(path.slug);
                      }}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-[#2f81f7] text-white shadow-sm shadow-[#2f81f7]/30"
                          : "bg-[#090d14] text-[#8b98a8] hover:text-[#f0f6fc] hover:bg-[#182232]"
                      }`}
                    >
                      {isSelected ? "Current" : "Switch"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: True Calculated Progress Overview */}
        <section className="rounded-2xl bg-[#111722] p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl sm:text-[22px] font-bold text-[#f0f6fc] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#3fb950]" />
                <span>Curriculum Progress Overview</span>
              </h2>
              <p className="text-xs text-[#8b98a8] mt-0.5">
                Calculated strictly from your completed lessons and verified assessment results.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8b98a8]">
              {completedCount} of {totalLessons} Track Lessons Finished
            </span>
          </div>

          {/* 4 Stat Metric Cards (Surface 3: Raised without inner 1px borders) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-[#182232] space-y-1">
              <span className="text-[11px] font-mono text-[#8b98a8] uppercase block">Track Progress</span>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">{percentComplete}%</div>
              <span className="text-[11px] text-[#8b98a8] block">
                {completedCount} / {totalLessons} lessons
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#182232] space-y-1">
              <span className="text-[11px] font-mono text-[#8b98a8] uppercase block">Global Lessons</span>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">
                {metrics?.totalGlobalCompleted || 0}
              </div>
              <span className="text-[11px] text-[#8b98a8] block">
                Across all 3 tracks (31 total)
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#182232] space-y-1">
              <span className="text-[11px] font-mono text-[#8b98a8] uppercase block">Remaining in Track</span>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">{remainingCount}</div>
              <span className="text-[11px] text-[#8b98a8] block">
                {metrics?.moduleSummaries?.filter((m) => !m.isFinished).length || 0} modules left
              </span>
            </div>

            <div className="p-5 rounded-xl bg-[#182232] space-y-1">
              <span className="text-[11px] font-mono text-[#8b98a8] uppercase block">Earned Badges</span>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">
                {earnedBadges.length}
              </div>
              <span className="text-[11px] text-[#8b98a8] block">
                {BADGES_DEFINITION.length} total available
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-[#8b98a8]">
              <span>Active Track: <strong className="text-[#f0f6fc]">{activePathDetails.title}</strong></span>
              <span className="font-mono">{completedCount} / {totalLessons} Milestones ({percentComplete}%)</span>
            </div>
            <div className="w-full bg-[#090d14] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2f81f7] h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
          </div>

          {/* Module Breakdown Checklist */}
          {metrics?.moduleSummaries && (
            <div className="pt-2 border-t border-[#21262d] space-y-3">
              <span className="text-xs font-mono text-[#8b98a8] block">MODULE PROGRESS BREAKDOWN</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.moduleSummaries.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-[#21262d] bg-[#0d1117] text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-[#f0f6fc] line-clamp-1">{m.title}</span>
                      <span className="text-[10px] font-mono text-[#8b98a8]">
                        {m.completed} / {m.total} completed
                      </span>
                    </div>
                    {m.isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-[#3fb950] shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-[#8b98a8]/40 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Section: Badges (Distinguishing Earned vs Locked Badges) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-[22px] font-bold text-[#f0f6fc] tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-[#f2cc60]" />
                <span>Path Completion Badges & Credentials</span>
              </h2>
              <p className="text-xs text-[#8b98a8] mt-0.5">
                Badges are awarded automatically upon passing required assessments and finishing milestones.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8b98a8]">
              {earnedBadges.length} / {BADGES_DEFINITION.length} Unlocked
            </span>
          </div>

          {/* Featured Next Badge to Unlock */}
          <NextBadgeFeatured
            nextBadgeData={nextBadgeToUnlock}
            currentPath={currentSelectedPath}
          />

          {/* Subsection 1: Genuinely Earned Badges Only */}
          <div className="rounded-2xl bg-[#111722] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono font-semibold text-[#8b98a8] uppercase tracking-wider">
                Your Earned Badges ({earnedBadges.length})
              </span>
              <span className="text-xs font-mono text-[#3fb950]">Verified</span>
            </div>

            {earnedBadges.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#090d14] text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#182232] text-[#8b98a8] flex items-center justify-center mx-auto">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-[#f0f6fc]">No badges earned yet</h3>
                <p className="text-xs text-[#8b98a8] max-w-md mx-auto leading-relaxed">
                  Complete lessons and pass interactive knowledge checks to unlock your first verified badge. Try completing the first module in your track!
                </p>
                {nextLesson && (
                  <Link
                    to={`/learn/${currentSelectedPath}/${nextLesson.slug}`}
                    className="card-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2f81f7] text-white text-xs font-semibold mt-2"
                  >
                    <span>Start Lesson 1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {earnedBadges.map((badge) => {
                  const def = BADGES_DEFINITION.find((b) => b.slug === badge.slug) || badge;
                  const progress = getBadgeProgress(
                    def,
                    metrics?.completedLessonSlugs,
                    metrics?.quizAttemptsMap,
                    earnedBadges
                  );
                  return (
                    <BadgeCard
                      key={badge.slug}
                      badge={def}
                      progress={progress}
                      studentName={displayName}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Subsection 2: Available Badges Roadmap */}
          <div className="rounded-2xl bg-[#111722] p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono font-semibold text-[#8b98a8] uppercase tracking-wider">
                Available Badges Roadmap ({BADGES_DEFINITION.length})
              </span>
              <span className="text-xs font-mono text-[#58a6ff]">Curriculum Milestones</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {BADGES_DEFINITION.map((badge) => {
                const progress = getBadgeProgress(
                  badge,
                  metrics?.completedLessonSlugs,
                  metrics?.quizAttemptsMap,
                  earnedBadges
                );

                return (
                  <BadgeCard
                    key={badge.slug}
                    badge={badge}
                    progress={progress}
                    studentName={displayName}
                  />
                );
              })}
            </div>
          </div>

          {/* Database Security & Anti-tampering Notice */}
          <div className="p-4 rounded-xl border border-[#21262d] bg-[#111821]/70 text-xs text-[#8b98a8] flex items-start gap-3">
            <Shield className="w-5 h-5 text-[#3fb950] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#f0f6fc] block mb-0.5">
                Row Level Security & Anti-Tampering Protection
              </strong>
              <p className="leading-relaxed">
                In compliance with CyberPath Phase 3 database policies, students cannot award badges to themselves by
                modifying client-side code. Badges are issued strictly through trusted backend evaluation functions
                once all curriculum milestones and knowledge assessments are satisfied.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#21262d] bg-[#0d1117] py-6 px-4 text-center text-xs text-[#8b98a8]">
        CyberPath · Student Learning Environment · Authenticated via Supabase
      </footer>
    </div>
  );
}
