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
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg border border-transparent hover:border-[#21262d] hover:bg-[#111821] transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/explore"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg border border-transparent hover:border-[#21262d] hover:bg-[#111821] transition-colors"
          >
            CTF Explorer
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111821] hover:bg-[#16202e] border border-[#21262d] text-xs text-[#8b98a8] hover:text-[#fa7970] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Identity Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#21262d] bg-[#111821] p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2f81f7]/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2f81f7] to-[#111821] border border-[#2f81f7]/40 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-[#2f81f7]/20 shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#f0f6fc]">
                    {displayName}
                  </h1>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/30">
                    VERIFIED RESEARCHER
                  </span>
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
            <div className="p-3.5 rounded-xl border border-[#21262d] bg-[#0d1117] text-xs space-y-2 shrink-0">
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
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        isSelected
                          ? "bg-[#2f81f7] text-white"
                          : "bg-[#16202e] text-[#8b98a8] hover:text-[#f0f6fc]"
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

        {/* 4 Gamification Stat Cards: Level, XP, Streak, Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Level Card */}
          <div className="p-5 rounded-xl border border-[#21262d] bg-[#111821] flex flex-col justify-between space-y-3">
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
            <div className="w-full bg-[#0d1117] h-2 rounded-full overflow-hidden border border-[#21262d]">
              <div
                className="bg-[#2f81f7] h-full rounded-full transition-all duration-500"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total Verified XP Card */}
          <div className="p-5 rounded-xl border border-[#21262d] bg-[#111821] flex flex-col justify-between space-y-3">
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
            <div className="text-[10px] font-mono text-[#3fb950] flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Immutable ledger records</span>
            </div>
          </div>

          {/* Learning Streak Card */}
          <div className="p-5 rounded-xl border border-[#21262d] bg-[#111821] flex flex-col justify-between space-y-3">
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
            <div className="text-[10px] font-mono text-[#8b98a8]">
              Total active days: {streakData.totalActiveDays}
            </div>
          </div>

          {/* Earned Badges Card */}
          <div className="p-5 rounded-xl border border-[#21262d] bg-[#111821] flex flex-col justify-between space-y-3">
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
              className="text-[10px] text-[#58a6ff] hover:underline flex items-center gap-1"
            >
              <span>View curriculum roadmap</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 14-Day Activity Calendar & Assessment Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 14-Day Streak Calendar */}
          <div className="rounded-xl border border-[#21262d] bg-[#111821] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f0f6fc] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#58a6ff]" />
                  <span>14-Day Learning Activity Heatmap</span>
                </h3>
                <p className="text-[11px] text-[#8b98a8] mt-0.5">
                  Recorded only upon verified lesson completions or passed knowledge checks.
                </p>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0d1117] border border-[#21262d] text-[#8b98a8]">
                {streakData.streakStatus === "active_today"
                  ? "Streak Active Today"
                  : streakData.streakStatus === "at_risk"
                  ? "Streak At Risk (Complete an Activity)"
                  : "Inactive"}
              </span>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-14 gap-2 pt-2">
              {streakData.recentCalendar?.map((day) => (
                <div
                  key={day.dateStr}
                  className={`p-2 rounded-lg border text-center flex flex-col items-center justify-between min-h-[56px] transition-all ${
                    day.hasActivity
                      ? "bg-[#3fb950]/20 border-[#3fb950]/50 text-[#3fb950]"
                      : "bg-[#0d1117] border-[#21262d] text-[#8b98a8]"
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
          <div className="rounded-xl border border-[#21262d] bg-[#111821] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#f0f6fc] flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#3fb950]" />
                  <span>Assessment Performance Summary</span>
                </h3>
                <p className="text-[11px] text-[#8b98a8] mt-0.5">
                  Interactive knowledge checks evaluated server-side.
                </p>
              </div>
              <span className="text-[10px] font-mono text-[#3fb950]">
                {assessmentSummary?.passedQuizzesCount || 0} Quizzes Passed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg border border-[#21262d] bg-[#0d1117]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Average Score</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
                  {assessmentSummary?.averageScore || 0}%
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#21262d] bg-[#0d1117]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Pass Rate</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
                  {assessmentSummary?.passRate || 0}%
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#21262d] bg-[#0d1117]">
                <span className="text-[10px] font-mono text-[#8b98a8] block">Total Attempts</span>
                <div className="text-xl font-bold text-[#f0f6fc] mt-1">
                  {assessmentSummary?.totalAttempts || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Earned vs Locked Badges Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#f0f6fc] flex items-center gap-2">
                <Award className="w-5 h-5 text-[#f2cc60]" />
                <span>Verified Credentials & Achievement Badges</span>
              </h2>
              <p className="text-xs text-[#8b98a8]">
                Badges are unlocked strictly upon fulfilling curriculum milestone criteria.
              </p>
            </div>
            <span className="text-xs font-mono text-[#8b98a8]">
              {earnedBadges.length} of {BADGES_DEFINITION.length} Earned
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BADGES_DEFINITION.map((badge) => {
              const earnedRecord = earnedBadges.find((b) => b.slug === badge.slug);
              const isEarned = Boolean(earnedRecord);
              const Icon = BADGE_ICONS[badge.iconName] || Award;

              return (
                <div
                  key={badge.slug}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isEarned
                      ? "border-[#3fb950]/50 bg-[#3fb950]/10 shadow-sm shadow-[#3fb950]/10"
                      : "border-[#21262d] bg-[#111821] opacity-75"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                          isEarned
                            ? "bg-[#0d1117] border-[#3fb950]/50 text-[#3fb950]"
                            : "bg-[#0d1117] border-[#21262d] text-[#8b98a8]"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded ${
                          isEarned
                            ? "bg-[#0d1117] text-[#3fb950] border border-[#3fb950]/40"
                            : "bg-[#0d1117] text-[#8b98a8] border border-[#21262d]"
                        }`}
                      >
                        {isEarned ? "EARNED" : "LOCKED"}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#f0f6fc] mb-1">{badge.name}</h4>
                    <p className="text-[11px] text-[#8b98a8] leading-relaxed mb-3">
                      {badge.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#21262d] flex items-center justify-between text-[10px]">
                    <span className="text-[#8b98a8]">
                      {isEarned ? "Awarded:" : "Status:"}
                    </span>
                    <span
                      className={`font-mono ${
                        isEarned ? "text-[#3fb950]" : "text-[#8b98a8]"
                      }`}
                    >
                      {isEarned
                        ? earnedRecord.earnedAt
                          ? new Date(earnedRecord.earnedAt).toLocaleDateString()
                          : "Verified"
                        : "Requirements Pending"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* XP Rewards Ledger History */}
        <div className="rounded-xl border border-[#21262d] bg-[#111821] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
            <div>
              <h3 className="text-sm font-bold text-[#f0f6fc] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#58a6ff]" />
                <span>Verified XP Reward Ledger</span>
              </h3>
              <p className="text-[11px] text-[#8b98a8] mt-0.5">
                Every transaction is cryptographically enforced and uniquely constrained.
              </p>
            </div>
            <span className="text-xs font-mono text-[#58a6ff]">
              Total: {xpProfile.totalXp} XP
            </span>
          </div>

          {xpProfile.ledger?.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8b98a8]">
              No XP transactions recorded yet. Complete your first lesson or assessment to start earning XP!
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {xpProfile.ledger.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-[#21262d] bg-[#0d1117] flex items-center justify-between text-xs"
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
