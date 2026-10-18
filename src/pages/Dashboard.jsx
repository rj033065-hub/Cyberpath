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
import CyberPathLogo from "../components/common/CyberPathLogo";
import BadgeCard from "../components/badges/BadgeCard";
import NextBadgeFeatured from "../components/badges/NextBadgeFeatured";
import {
  getBadgeProgress,
  getNextBadgeToUnlock,
} from "../components/badges/badgeProgressHelper";
import { useCardSpotlight } from "../hooks/useCardSpotlight";
import { useAnimatedNumber, useAnimatedBar } from "../hooks/useAnimatedNumber";

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
    borderClass: "border-white/28 hover:border-white/28",
    pillClass: "bg-transparent border-white/12 text-fg",
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
    borderClass: "border-white/12 hover:border-white/28",
    pillClass: "bg-transparent border-white/12 text-fg",
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
    borderClass: "border-white/12 hover:border-white/28",
    pillClass: "bg-transparent border-white/12 text-fg",
    description: "Explore HTTP mechanics, client-server architectures, OWASP vulnerabilities, and proxy inspection.",
    milestonesCount: 10,
    badgeAward: "Web Security Expert",
  },
];

/**
 * SpotlightPathCard — learning path card with cursor spotlight effect.
 * Extracted to a named component so each card gets its own spotlight ref.
 */
function SpotlightPathCard({ path, isSelected, onSelect, savingPath }) {
  const cardRef = useCardSpotlight();
  const Icon = path.icon;

  return (
    <div
      ref={cardRef}
      onClick={() => onSelect(path.slug)}
      className={`spotlight-card card-interactive rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all ${
        isSelected
          ? "border border-white/28 bg-white/[0.06] shadow-xl shadow-black/20"
          : "bg-surface hover:bg-raised/70 border border-transparent hover:border-white/28"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSelected ? "bg-white/[0.06] text-accent" : "bg-page text-muted"
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {isSelected ? (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-accent font-semibold">
              ACTIVE TRACK
            </span>
          ) : (
            <span className="text-xs text-muted font-mono">
              {path.milestonesCount} lessons
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-fg mb-1.5">{path.title}</h3>
        <p className="text-[14px] text-muted leading-relaxed mb-5">{path.description}</p>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
        <Link
          to={`/learn/${path.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold text-accent hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Explore Curriculum</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          disabled={savingPath}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(path.slug);
          }}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isSelected
              ? "bg-accent text-on-accent shadow-sm"
              : "bg-page text-muted hover:text-fg hover:bg-raised"
          }`}
        >
          {isSelected ? "Current" : "Switch"}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user, profile, signOut, updateProfileSelectedPath } = useAuth();
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

  // Phase 5: Spotlight refs for hero and stat strip
  const heroSpotlightRef = useCardSpotlight();
  const statsSpotlightRef = useCardSpotlight();

  // Phase 5: Animated stat numbers
  const [animPercent, percentRef] = useAnimatedNumber(percentComplete, 800);
  const [animGlobal, globalRef] = useAnimatedNumber(metrics?.totalGlobalCompleted || 0, 800);
  const [animRemaining, remainingRef] = useAnimatedNumber(remainingCount, 600);
  const [animBadges, badgesRef] = useAnimatedNumber(earnedBadges.length, 600);

  // Phase 5: Animated progress bar
  const [barWidth, barRef] = useAnimatedBar(percentComplete, 800);

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/12 bg-page/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <CyberPathLogo size="sm" glow className="group-hover:scale-105 transition-transform" />
          <span className="font-bold tracking-tight text-base text-fg">
            Cyber<span className="text-blue-400">Path</span>
            <span className="text-xs font-mono text-muted ml-2 font-normal hidden sm:inline">
              / Student Dashboard
            </span>
          </span>
        </Link>

        {/* User Identity Chip & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/12 bg-surface text-xs">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-medium text-fg max-w-[140px] truncate">{displayName}</span>
          </div>

          <Link
            to={`/learn/${currentSelectedPath}`}
            className="text-xs text-accent hover:text-white px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors font-medium hidden md:block"
          >
            Curriculum Roadmap
          </Link>

          <Link
            to="/explore"
            className="text-xs text-muted hover:text-fg px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1"
          >
            <Compass className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">CTF Explorer</span>
          </Link>

          <Link
            to="/labs"
            className="text-xs text-accent hover:text-white px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1 font-medium"
          >
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Labs</span>
          </Link>

          <Link
            to="/profile"
            className="text-xs text-muted hover:text-fg px-2.5 py-1.5 rounded-md hover:bg-raised transition-colors flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-accent" />
            <span className="hidden sm:inline">Profile</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-raised border border-white/12 hover:border-danger/50 text-xs text-muted hover:text-danger transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">


        {/* FOCAL HERO ELEMENT: Continue Your Lesson */}
        <section ref={heroSpotlightRef} className="spotlight-card relative overflow-hidden rounded-2xl bg-surface p-6 sm:p-9 border border-white/12 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] blur-[120px] pointer-events-none rounded-full" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3.5 flex-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-accent uppercase tracking-wider font-semibold">
                  {activePathDetails.title} Track
                </span>
                <span className="text-muted text-xs">·</span>
                <span className="text-xs text-muted">
                  {completedCount} of {totalLessons} lessons finished ({percentComplete}%)
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-fg leading-[1.15]">
                Welcome back, <span className="text-accent">{displayName}</span>
              </h1>

              <p className="text-[15px] sm:text-base text-muted leading-relaxed">
                {recommendation?.reason || "Pick up right where you left off in your cybersecurity curriculum."}
              </p>

              {/* Action Buttons: Continue Learning & View Roadmap */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {recommendation ? (
                  <Link
                    to={recommendation.targetUrl}
                    className="card-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>{recommendation.actionLabel}: {recommendation.title}</span>
                  </Link>
                ) : (
                  <Link
                    to={`/learn/${currentSelectedPath}`}
                    className="card-interactive inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>Continue Learning Track</span>
                  </Link>
                )}

                <Link
                  to={`/learn/${currentSelectedPath}`}
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-raised hover:bg-raised text-fg text-xs sm:text-sm font-medium transition-all"
                >
                  <BookOpen className="w-4 h-4 text-accent" />
                  <span>Roadmap</span>
                </Link>

                <Link
                  to="/explore"
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-raised hover:bg-raised text-muted hover:text-fg text-xs sm:text-sm font-medium transition-all"
                >
                  <Compass className="w-4 h-4 text-accent" />
                  <span>CTF Labs</span>
                </Link>

                <Link
                  to="/labs"
                  className="card-interactive inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-raised hover:bg-raised text-accent hover:text-white text-xs sm:text-sm font-medium transition-all border border-white/12"
                >
                  <Terminal className="w-4 h-4 text-accent" />
                  <span>Interactive Labs</span>
                </Link>
              </div>
            </div>

            {/* Hero Right Detail Box: Raised surface with background contrast */}
            <div className="bg-raised p-5 sm:p-6 rounded-2xl shrink-0 lg:w-80 w-full space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span className="uppercase text-[10px]">Active Milestone</span>
                {recommendation?.estimatedMinutes && (
                  <span>~{recommendation.estimatedMinutes}m study</span>
                )}
              </div>

              <h3 className="text-base font-bold text-fg line-clamp-1">
                {recommendation?.title || activePathDetails.title}
              </h3>
              <p className="text-xs text-muted line-clamp-2 leading-relaxed">
                {recommendation?.moduleTitle || activePathDetails.description}
              </p>

              <div className="pt-2 border-t border-white/5 space-y-1.5">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-muted">Track Progress</span>
                  <span className="text-accent font-bold">{percentComplete}%</span>
                </div>
                <div className="w-full bg-page h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${percentComplete}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SLIM STATS STRIP: Replaces bulky stat cards */}
        <div ref={statsSpotlightRef} className="spotlight-card bg-surface rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          {/* Level & XP */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-raised transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-accent">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-fg group-hover:text-accent transition-colors">
                Level {xpProfile.levelInfo.level} · {xpProfile.levelInfo.title}
              </div>
              <div className="text-[11px] font-mono text-muted">
                <strong className="text-fg">{xpProfile.totalXp}</strong> XP verified
              </div>
            </div>
          </Link>

          <div className="hidden sm:block w-px h-6 bg-white/12" />

          {/* Daily Streak */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-raised transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-danger">
              <Flame className="w-4 h-4 text-danger" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-fg group-hover:text-danger transition-colors">
                {streakData.currentStreak} Day Streak
              </div>
              <div className="text-[11px] font-mono text-muted">
                Longest: {streakData.longestStreak} days
              </div>
            </div>
          </Link>

          <div className="hidden sm:block w-px h-6 bg-white/12" />

          {/* Badges Earned */}
          <Link
            to="/profile"
            className="card-interactive flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-raised transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center text-accent">
              <Award className="w-4 h-4 text-accent" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-fg group-hover:text-white transition-colors">
                {earnedBadges.length} / {BADGES_DEFINITION.length} Badges
              </div>
              <div className="text-[11px] font-mono text-muted">
                {BADGES_DEFINITION.length - earnedBadges.length} to unlock
              </div>
            </div>
          </Link>

          <div className="hidden lg:block w-px h-6 bg-white/12" />

          {/* 14-Day Activity Heatmap */}
          <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5">
            <span className="text-[11px] font-mono text-muted">Activity</span>
            <div className="flex items-center gap-1">
              {streakData.recentCalendar?.slice(-10).map((day) => (
                <div
                  key={day.dateStr}
                  title={`${day.dateStr}: ${day.hasActivity ? "Active" : "No activity"}`}
                  className={`w-3 h-4 rounded-sm transition-all ${
                    day.hasActivity ? "bg-white" : "bg-raised"
                  } ${day.isToday ? "ring-1 ring-white/40" : ""}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Section: Learning Paths Selector */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent" />
                <span>Your Selected Learning Path</span>
              </h2>
              <p className="text-xs text-muted">
                Select a track below to focus your study. Switching tracks preserves your progress across all paths.
              </p>
            </div>

            {saveSuccess && (
              <span className="text-xs text-success flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>Track selection saved to profile!</span>
              </span>
            )}

            {saveError && (
              <span className="text-xs text-danger flex items-center gap-1.5 animate-in fade-in">
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
                <SpotlightPathCard
                  key={path.slug}
                  path={path}
                  isSelected={isSelected}
                  onSelect={handleSelectPath}
                  savingPath={savingPath}
                />
              );
            })}
          </div>
        </section>

        {/* Section: True Calculated Progress Overview */}
        <section className="rounded-2xl bg-surface p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-xl sm:text-[22px] font-bold text-fg tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-success" />
                <span>Curriculum Progress Overview</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Calculated strictly from your completed lessons and verified assessment results.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {completedCount} of {totalLessons} Track Lessons Finished
            </span>
          </div>

          {/* 4 Stat Metric Cards — numbers animate in via IntersectionObserver */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="spotlight-card p-5 rounded-xl bg-raised space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase block">Track Progress</span>
              <div ref={percentRef} className="text-2xl font-extrabold text-fg">{animPercent}%</div>
              <span className="text-[11px] text-muted block">
                {completedCount} / {totalLessons} lessons
              </span>
            </div>

            <div className="spotlight-card p-5 rounded-xl bg-raised space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase block">Global Lessons</span>
              <div ref={globalRef} className="text-2xl font-extrabold text-fg">
                {animGlobal}
              </div>
              <span className="text-[11px] text-muted block">
                Across all 3 tracks (31 total)
              </span>
            </div>

            <div className="spotlight-card p-5 rounded-xl bg-raised space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase block">Remaining in Track</span>
              <div ref={remainingRef} className="text-2xl font-extrabold text-fg">{animRemaining}</div>
              <span className="text-[11px] text-muted block">
                {metrics?.moduleSummaries?.filter((m) => !m.isFinished).length || 0} modules left
              </span>
            </div>

            <div className="spotlight-card p-5 rounded-xl bg-raised space-y-1">
              <span className="text-[11px] font-mono text-muted uppercase block">Earned Badges</span>
              <div ref={badgesRef} className="text-2xl font-extrabold text-fg">
                {animBadges}
              </div>
              <span className="text-[11px] text-muted block">
                {BADGES_DEFINITION.length} total available
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Active Track: <strong className="text-fg">{activePathDetails.title}</strong></span>
              <span className="font-mono">{completedCount} / {totalLessons} Milestones ({percentComplete}%)</span>
            </div>
            <div ref={barRef} className="w-full bg-page h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full rounded-full"
                style={{ width: `${barWidth}%`, transition: "width 16ms linear" }}
              />
            </div>
          </div>

          {/* Module Breakdown Checklist */}
          {metrics?.moduleSummaries && (
            <div className="pt-2 border-t border-white/12 space-y-3">
              <span className="text-xs font-mono text-muted block">MODULE PROGRESS BREAKDOWN</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {metrics.moduleSummaries.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-lg border border-white/12 bg-page text-xs flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <span className="font-semibold text-fg line-clamp-1">{m.title}</span>
                      <span className="text-[10px] font-mono text-muted">
                        {m.completed} / {m.total} completed
                      </span>
                    </div>
                    {m.isFinished ? (
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-muted/40 shrink-0" />
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
              <h2 className="text-xl sm:text-[22px] font-bold text-fg tracking-tight flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span>Path Completion Badges & Credentials</span>
              </h2>
              <p className="text-xs text-muted mt-0.5">
                Badges are awarded automatically upon passing required assessments and finishing milestones.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {earnedBadges.length} / {BADGES_DEFINITION.length} Unlocked
            </span>
          </div>

          {/* Featured Next Badge to Unlock */}
          <NextBadgeFeatured
            nextBadgeData={nextBadgeToUnlock}
            currentPath={currentSelectedPath}
          />

          {/* Subsection 1: Genuinely Earned Badges Only */}
          <div className="rounded-2xl bg-surface p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">
                Your Earned Badges ({earnedBadges.length})
              </span>
              <span className="text-xs font-mono text-success">Verified</span>
            </div>

            {earnedBadges.length === 0 ? (
              <div className="p-8 rounded-xl bg-page text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-raised text-muted flex items-center justify-center mx-auto">
                  <LockKeyhole className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-fg">No badges earned yet</h3>
                <p className="text-xs text-muted max-w-md mx-auto leading-relaxed">
                  Complete lessons and pass interactive knowledge checks to unlock your first verified badge. Try completing the first module in your track!
                </p>
                {nextLesson && (
                  <Link
                    to={`/learn/${currentSelectedPath}/${nextLesson.slug}`}
                    className="card-interactive inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-on-accent text-xs font-semibold mt-2"
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
          <div className="rounded-2xl bg-surface p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <span className="text-xs font-mono font-semibold text-muted uppercase tracking-wider">
                Available Badges Roadmap ({BADGES_DEFINITION.length})
              </span>
              <span className="text-xs font-mono text-accent">Curriculum Milestones</span>
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
          <div className="p-4 rounded-xl border border-white/12 bg-surface/70 text-xs text-muted flex items-start gap-3">
            <Shield className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <strong className="text-fg block mb-0.5">
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
      <footer className="w-full border-t border-white/12 bg-page py-6 px-4 text-center text-xs text-muted">
        CyberPath · Student Learning Environment · Authenticated via Supabase
      </footer>
    </div>
  );
}
