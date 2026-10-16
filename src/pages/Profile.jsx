import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  User,
  Mail,
  Calendar,
  Flame,
  Award,
  Zap,
  CheckCircle2,
  LockKeyhole,
  Clock,
  ArrowRight,
  TrendingUp,
  HelpCircle,
  Compass,
  Sparkles,
  BookOpen,
  ChevronRight,
  LogOut,
  Terminal,
  Network,
  Globe,
  ShieldCheck,
  Crown,
  Database,
  BarChart2,
} from "lucide-react";
import { BADGES_DEFINITION } from "../data/curriculumData";
import {
  getStudentDashboardMetrics,
  getStudentAssessmentSummary,
} from "../lib/learningService";
import BadgeCard from "../components/badges/BadgeCard";
import NextBadgeFeatured from "../components/badges/NextBadgeFeatured";
import {
  getBadgeProgress,
  getNextBadgeToUnlock,
} from "../components/badges/badgeProgressHelper";

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

export default function Profile() {
  const { user, profile, signOut, updateProfileSelectedPath } = useAuth();
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState(null);
  const [assessmentSummary, setAssessmentSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingPath, setUpdatingPath] = useState(false);

  const currentSelectedPath = profile?.selected_path || "red-team";

  useEffect(() => {
    let isMounted = true;
    if (user?.id) {
      Promise.all([
        getStudentDashboardMetrics(user.id, currentSelectedPath),
        getStudentAssessmentSummary(user.id),
      ]).then(([metricsData, assessData]) => {
        if (isMounted) {
          setMetrics(metricsData);
          setAssessmentSummary(assessData);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [user?.id, currentSelectedPath]);

  const handleSelectPath = async (slug) => {
    if (slug === currentSelectedPath || updatingPath) return;
    setUpdatingPath(true);
    try {
      await updateProfileSelectedPath(slug);
      const fresh = await getStudentDashboardMetrics(user.id, slug);
      setMetrics(fresh);
    } finally {
      setUpdatingPath(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const displayName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "Student Researcher";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Active Student";

  const earnedBadges = metrics?.earnedBadges || [];
  const nextBadgeToUnlock = getNextBadgeToUnlock(
    BADGES_DEFINITION,
    metrics?.completedLessonSlugs || [],
    metrics?.quizAttemptsMap || {},
    earnedBadges,
    currentSelectedPath
  );
  const xpProfile = metrics?.xpProfile || { totalXp: 0 };
  const levelInfo = xpProfile?.levelInfo || {
    level: 1,
    title: "Novice Explorer",
    progressPercent: 0,
    xpToNextLevel: 100,
  };
  const streakData = metrics?.streakData || {
    currentStreak: 0,
    longestStreak: 0,
    totalActiveDays: 0,
    recentCalendar: [],
  };

  return (
    <div className="min-h-screen bg-page text-fg flex flex-col selection:bg-white/20 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/12 bg-page/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-raised border border-white/28 flex items-center justify-center text-fg group-hover:border-white/40 transition-colors shadow-sm">
            <Shield className="w-4 h-4 text-accent" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-fg">
            Cyber<span className="text-accent">Path</span>
            <span className="text-xs font-mono text-muted ml-2 font-normal hidden sm:inline">
              / Student Profile & Credentials
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard"
            className="text-xs text-muted hover:text-fg px-3 py-1.5 rounded-lg hover:bg-raised transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/labs"
            className="text-xs text-accent hover:text-white px-3 py-1.5 rounded-lg hover:bg-raised transition-colors font-medium"
          >
            Labs
          </Link>
          <Link
            to="/explore"
            className="text-xs text-muted hover:text-fg px-3 py-1.5 rounded-lg hover:bg-raised transition-colors"
          >
            CTF Explorer
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-raised border border-white/12 text-xs text-muted hover:text-danger transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Profile Identity Card (Hero Focal Element) */}
        <div className="relative overflow-hidden rounded-2xl bg-surface p-6 sm:p-8 shadow-xl shadow-black/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.04] blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-raised border border-white/28 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-black/20 shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-fg tracking-tight">
                    {displayName}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>{user?.email || "Student Account"}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-accent" />
                    <span>Joined {memberSince}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Track Switcher */}
            <div className="p-3.5 rounded-xl bg-raised text-xs space-y-2 shrink-0">
              <span className="text-[10px] font-mono uppercase text-muted block">
                Primary Specialization Track
              </span>
              <div className="flex gap-1.5">
                {[
                  { slug: "red-team", label: "Red Team" },
                  { slug: "blue-team", label: "Blue Team" },
                  { slug: "web-security", label: "Web Security" },
                ].map((track) => {
                  const isSelected = currentSelectedPath === track.slug;
                  return (
                    <button
                      key={track.slug}
                      type="button"
                      disabled={updatingPath}
                      onClick={() => handleSelectPath(track.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all card-interactive ${
                        isSelected
                          ? "bg-accent text-on-accent shadow-sm"
                          : "bg-surface text-muted hover:text-fg"
                      }`}
                    >
                      {track.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Gamification Stat Cards: Level, XP, Streak, Badges (Clean Panel Surfaces) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level Card */}
          <div className="p-5 rounded-xl bg-surface flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-muted">
                Current Rank
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-accent border border-white/12">
                LEVEL {levelInfo.level}
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-fg">
                {levelInfo.title}
              </div>
              <div className="text-xs text-muted mt-1">
                {levelInfo.xpToNextLevel > 0
                  ? `${levelInfo.xpToNextLevel} XP to Level ${levelInfo.level + 1}`
                  : "Maximum Level Reached"}
              </div>
            </div>
            <div className="w-full bg-page h-2 rounded-full overflow-hidden">
              <div
                className="bg-accent h-full rounded-full animate-progress"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total Verified XP Card */}
          <div className="p-5 rounded-xl bg-surface flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-muted">
                Total Verified XP
              </span>
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-fg">
                {xpProfile.totalXp} <span className="text-sm font-mono text-accent">XP</span>
              </div>
              <div className="text-xs text-muted mt-1">
                Derived strictly from verified milestones
              </div>
            </div>
            <div className="text-[11px] text-success flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified milestones</span>
            </div>
          </div>

          {/* Learning Streak Card */}
          <div className="p-5 rounded-xl bg-surface flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-muted">
                Daily Learning Streak
              </span>
              <Flame className="w-4 h-4 text-danger" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-fg">
                {streakData.currentStreak}{" "}
                <span className="text-sm font-normal text-muted">
                  {streakData.currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="text-xs text-muted mt-1">
                Longest streak: <strong className="text-fg">{streakData.longestStreak} days</strong>
              </div>
            </div>
            <div className="text-[11px] text-muted">
              Total active days: {streakData.totalActiveDays}
            </div>
          </div>

          {/* Earned Badges Card */}
          <div className="p-5 rounded-xl bg-surface flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-muted">
                Earned Credentials
              </span>
              <Award className="w-4 h-4 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-fg">
                {earnedBadges.length}{" "}
                <span className="text-sm font-normal text-muted">
                  / {BADGES_DEFINITION.length}
                </span>
              </div>
              <div className="text-xs text-muted mt-1">
                {BADGES_DEFINITION.length - earnedBadges.length} remaining to unlock
              </div>
            </div>
            <Link
              to={`/learn/${currentSelectedPath}`}
              className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
            >
              <span>View curriculum roadmap</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 14-Day Activity Calendar & Assessment Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 14-Day Streak Calendar */}
          <div className="rounded-xl bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-fg flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>14-Day Learning Activity Heatmap</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Recorded upon verified lesson completions and passed knowledge checks.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-raised text-muted">
                {streakData.streakStatus === "active_today"
                  ? "Streak Active Today"
                  : streakData.streakStatus === "at_risk"
                  ? "Streak At Risk"
                  : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
              {streakData.recentCalendar?.map((day) => (
                <div
                  key={day.dateStr}
                  className={`p-2 rounded-lg text-center flex flex-col items-center justify-between min-h-[56px] transition-all ${
                    day.hasActivity
                      ? "bg-white/[0.06] text-success border border-white/12"
                      : "bg-page text-muted"
                  } ${day.isToday ? "ring-1 ring-white/40" : ""}`}
                >
                  <span className="text-[9px] font-mono uppercase opacity-75">
                    {day.dayName}
                  </span>
                  <span className="text-xs font-bold my-0.5">{day.dayNumber}</span>
                  {day.hasActivity ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-raised" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Performance Summary */}
          <div className="rounded-xl bg-surface p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-fg flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-success" />
                  <span>Assessment Performance Summary</span>
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Interactive knowledge checks evaluated server-side.
                </p>
              </div>
              <span className="text-xs font-mono text-success">
                {assessmentSummary?.passedQuizzesCount || 0} Passed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-raised">
                <span className="text-[10px] font-mono text-muted block">Average Score</span>
                <div className="text-xl font-bold text-fg mt-1">
                  {assessmentSummary?.averageScore || 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-raised">
                <span className="text-[10px] font-mono text-muted block">Pass Rate</span>
                <div className="text-xl font-bold text-fg mt-1">
                  {assessmentSummary?.passRate || 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-raised">
                <span className="text-[10px] font-mono text-muted block">Total Attempts</span>
                <div className="text-xl font-bold text-fg mt-1">
                  {assessmentSummary?.totalAttempts || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Next Badge to Unlock */}
        <NextBadgeFeatured
          nextBadgeData={nextBadgeToUnlock}
          currentPath={currentSelectedPath}
        />

        {/* Earned vs Locked Badges Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg flex items-center gap-2">
                <Award className="w-5 h-5 text-accent" />
                <span>Verified Credentials & Achievement Badges</span>
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1">
                Badges are unlocked strictly upon fulfilling curriculum milestone criteria.
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {earnedBadges.length} of {BADGES_DEFINITION.length} Earned
            </span>
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

        {/* XP Rewards Ledger History */}
        <div className="rounded-xl bg-surface p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <Database className="w-4 h-4 text-accent" />
                <span>Verified XP Reward Ledger</span>
              </h3>
              <p className="text-xs text-muted mt-0.5">
                Every transaction is cryptographically enforced and uniquely constrained.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-accent">
              Total: {xpProfile.totalXp} XP
            </span>
          </div>

          {!xpProfile.ledger?.length ? (
            <div className="py-8 text-center text-xs text-muted">
              No XP transactions recorded yet. Complete your first lesson or assessment to start earning XP!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {xpProfile.ledger.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-raised hover:bg-raised transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-fg block">
                      {item.description || item.action_type}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-success px-2 py-0.5 rounded bg-white/[0.06] border border-white/12 shrink-0">
                    +{item.xp_amount} XP
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
