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
    <div className="min-h-screen bg-[#090d14] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#090d14]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-[#f0f6fc] group-hover:border-[#58a6ff] transition-colors shadow-sm shadow-[#2f81f7]/20">
            <Shield className="w-4 h-4 text-[#58a6ff]" strokeWidth={2.4} />
          </div>
          <span className="font-bold tracking-tight text-base text-[#f0f6fc]">
            Cyber<span className="text-[#58a6ff]">Path</span>
            <span className="text-xs font-mono text-[#8b98a8] ml-2 font-normal hidden sm:inline">
              / Student Profile & Credentials
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/dashboard"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/labs"
            className="text-xs text-[#58a6ff] hover:text-white px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors font-medium"
          >
            Labs
          </Link>
          <Link
            to="/explore"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg hover:bg-[#111722] transition-colors"
          >
            CTF Explorer
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111722] hover:bg-[#182232] border border-[#21262d] text-xs text-[#8b98a8] hover:text-[#fa7970] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Profile Identity Card (Hero Focal Element) */}
        <div className="relative overflow-hidden rounded-2xl bg-[#111722] p-6 sm:p-8 shadow-xl shadow-black/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2f81f7]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#2f81f7]/20 shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#f0f6fc] tracking-tight">
                    {displayName}
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#8b98a8]">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#58a6ff]" />
                    <span>{user?.email || "Student Account"}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#58a6ff]" />
                    <span>Joined {memberSince}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Track Switcher */}
            <div className="p-3.5 rounded-xl bg-[#182232] text-xs space-y-2 shrink-0">
              <span className="text-[10px] font-mono uppercase text-[#8b98a8] block">
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
                          ? "bg-[#2f81f7] text-white shadow-sm shadow-[#2f81f7]/30"
                          : "bg-[#111722] text-[#8b98a8] hover:text-[#f0f6fc]"
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
          <div className="p-5 rounded-xl bg-[#111722] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8b98a8]">
                Current Rank
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2f81f7]/15 text-[#58a6ff] border border-[#2f81f7]/30">
                LEVEL {levelInfo.level}
              </span>
            </div>
            <div>
              <div className="text-xl font-bold text-[#f0f6fc]">
                {levelInfo.title}
              </div>
              <div className="text-xs text-[#8b98a8] mt-1">
                {levelInfo.xpToNextLevel > 0
                  ? `${levelInfo.xpToNextLevel} XP to Level ${levelInfo.level + 1}`
                  : "Maximum Level Reached"}
              </div>
            </div>
            <div className="w-full bg-[#090d14] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2f81f7] h-full rounded-full animate-progress"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total Verified XP Card */}
          <div className="p-5 rounded-xl bg-[#111722] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8b98a8]">
                Total Verified XP
              </span>
              <Zap className="w-4 h-4 text-[#f2cc60]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">
                {xpProfile.totalXp} <span className="text-sm font-mono text-[#58a6ff]">XP</span>
              </div>
              <div className="text-xs text-[#8b98a8] mt-1">
                Derived strictly from verified milestones
              </div>
            </div>
            <div className="text-[11px] text-[#3fb950] flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verified milestones</span>
            </div>
          </div>

          {/* Learning Streak Card */}
          <div className="p-5 rounded-xl bg-[#111722] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8b98a8]">
                Daily Learning Streak
              </span>
              <Flame className="w-4 h-4 text-[#fa7970]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">
                {streakData.currentStreak}{" "}
                <span className="text-sm font-normal text-[#8b98a8]">
                  {streakData.currentStreak === 1 ? "day" : "days"}
                </span>
              </div>
              <div className="text-xs text-[#8b98a8] mt-1">
                Longest streak: <strong className="text-[#f0f6fc]">{streakData.longestStreak} days</strong>
              </div>
            </div>
            <div className="text-[11px] text-[#8b98a8]">
              Total active days: {streakData.totalActiveDays}
            </div>
          </div>

          {/* Earned Badges Card */}
          <div className="p-5 rounded-xl bg-[#111722] flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8b98a8]">
                Earned Credentials
              </span>
              <Award className="w-4 h-4 text-[#f2cc60]" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-[#f0f6fc]">
                {earnedBadges.length}{" "}
                <span className="text-sm font-normal text-[#8b98a8]">
                  / {BADGES_DEFINITION.length}
                </span>
              </div>
              <div className="text-xs text-[#8b98a8] mt-1">
                {BADGES_DEFINITION.length - earnedBadges.length} remaining to unlock
              </div>
            </div>
            <Link
              to={`/learn/${currentSelectedPath}`}
              className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View curriculum roadmap</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 14-Day Activity Calendar & Assessment Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 14-Day Streak Calendar */}
          <div className="rounded-xl bg-[#111722] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#f0f6fc] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#58a6ff]" />
                  <span>14-Day Learning Activity Heatmap</span>
                </h3>
                <p className="text-xs text-[#8b98a8] mt-0.5">
                  Recorded upon verified lesson completions and passed knowledge checks.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182232] text-[#8b98a8]">
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
                      ? "bg-[#3fb950]/20 text-[#3fb950] border border-[#3fb950]/40"
                      : "bg-[#090d14] text-[#8b98a8]"
                  } ${day.isToday ? "ring-1 ring-[#58a6ff]" : ""}`}
                >
                  <span className="text-[9px] font-mono uppercase opacity-75">
                    {day.dayName}
                  </span>
                  <span className="text-xs font-bold my-0.5">{day.dayNumber}</span>
                  {day.hasActivity ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#21262d]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assessment Performance Summary */}
          <div className="rounded-xl bg-[#111722] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#f0f6fc] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#3fb950]" />
                  <span>Assessment Performance Summary</span>
                </h3>
                <p className="text-xs text-[#8b98a8] mt-0.5">
                  Interactive knowledge checks evaluated server-side.
                </p>
              </div>
              <span className="text-xs font-mono text-[#3fb950]">
                {assessmentSummary?.passedQuizzesCount || 0} Passed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-lg bg-[#182232]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Average Score</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
                  {assessmentSummary?.averageScore || 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#182232]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Pass Rate</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
                  {assessmentSummary?.passRate || 0}%
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#182232]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Total Attempts</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
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
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#f0f6fc] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#f2cc60]" />
                <span>Verified Credentials & Achievement Badges</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#8b98a8] mt-1">
                Badges are unlocked strictly upon fulfilling curriculum milestone criteria.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8b98a8]">
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
        <div className="rounded-xl bg-[#111722] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h3 className="text-base font-bold text-[#f0f6fc] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#58a6ff]" />
                <span>Verified XP Reward Ledger</span>
              </h3>
              <p className="text-xs text-[#8b98a8] mt-0.5">
                Every transaction is cryptographically enforced and uniquely constrained.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#58a6ff]">
              Total: {xpProfile.totalXp} XP
            </span>
          </div>

          {!xpProfile.ledger?.length ? (
            <div className="py-8 text-center text-xs text-[#8b98a8]">
              No XP transactions recorded yet. Complete your first lesson or assessment to start earning XP!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {xpProfile.ledger.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-lg bg-[#182232] hover:bg-[#202e42] transition-colors flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-[#f0f6fc] block">
                      {item.description || item.action_type}
                    </span>
                    <span className="text-[10px] font-mono text-[#8b98a8]">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[#3fb950] px-2 py-0.5 rounded bg-[#3fb950]/15 border border-[#3fb950]/30 shrink-0">
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
