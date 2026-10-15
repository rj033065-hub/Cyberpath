/**
 * LabCatalog — /labs route
 *
 * Displays all four CyberPath labs with real progress from labService.
 * Supports filter by topic and status, and a search field.
 * Authenticated users see real saved progress.
 * Demo mode shows practice-only progress from localStorage.
 * Signed-out users are redirected via ProtectedRoute in App.jsx.
 */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FlaskConical,
  Shield,
  Database,
  Globe,
  LockKeyhole,
  Search,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  ChevronRight,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getLabProgress } from "../lib/labService";

const LABS = [
  {
    slug: "sqli-basics",
    href: "/labs/sqli-basics",
    title: "SQL Injection Fundamentals",
    description:
      "Investigate a fictional training application's login form and understand how unsafe SQL query construction can cause authentication bypasses.",
    category: "Injection",
    topic: "web-security",
    topicLabel: "Web Security",
    difficulty: "Beginner",
    estimatedTime: "20–25 min",
    icon: Database,
    skills: ["SQL query structure", "Parameterized queries", "Auth bypass patterns"],
    relatedPath: "web-security",
    relatedLesson: "/learn/web-security/sql-injection-web",
  },
  {
    slug: "xss-playground",
    href: "/labs/xss-playground",
    title: "XSS Playground",
    description:
      "Understand how unsafe rendering of user-controlled content can cause cross-site scripting, and learn the defenses used in modern web apps.",
    category: "Injection",
    topic: "web-security",
    topicLabel: "Web Security",
    difficulty: "Beginner",
    estimatedTime: "20–25 min",
    icon: Globe,
    skills: ["Output encoding", "Safe rendering", "DOM security"],
    relatedPath: "web-security",
    relatedLesson: "/learn/web-security/cross-site-scripting-web",
  },
  {
    slug: "idor-investigation",
    href: "/labs/idor-investigation",
    title: "IDOR Investigation",
    description:
      "Investigate a fictional profile-record application where object access is incorrectly authorized. Identify the flaw and choose correct remediation.",
    category: "Access Control",
    topic: "access-control",
    topicLabel: "Access Control",
    difficulty: "Beginner",
    estimatedTime: "15–20 min",
    icon: LockKeyhole,
    skills: ["Object-level authorization", "Deny-by-default", "IDOR identification"],
    relatedPath: "web-security",
    relatedLesson: "/learn/web-security/access-control-vulnerabilities",
  },
  {
    slug: "auth-checkpoint",
    href: "/labs/auth-checkpoint",
    title: "Authentication Checkpoint",
    description:
      "Audit a fictional authentication flow and identify security weaknesses: weak decisions, session handling, rate limiting, and secure logout.",
    category: "Authentication",
    topic: "authentication",
    topicLabel: "Authentication",
    difficulty: "Beginner",
    estimatedTime: "25–30 min",
    icon: Shield,
    skills: ["Session security", "Rate limiting", "Password hashing", "Authorization"],
    relatedPath: "web-security",
    relatedLesson: "/learn/web-security/cookies-sessions-and-authentication",
  },
];

const TOPIC_FILTERS = [
  { id: "all", label: "All Topics" },
  { id: "web-security", label: "Web Security" },
  { id: "access-control", label: "Access Control" },
  { id: "authentication", label: "Authentication" },
];

const STATUS_FILTERS = [
  { id: "all", label: "All Status" },
  { id: "not_started", label: "Not Started" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
];

function StatusBadge({ status }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#3fb950] bg-[#3fb950]/10 border border-[#3fb950]/30 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="w-3 h-3" /> Completed
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#e3b341] bg-[#e3b341]/10 border border-[#e3b341]/30 px-2 py-0.5 rounded-full">
        <PlayCircle className="w-3 h-3" /> In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-[#8b949e] bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded-full">
      <Circle className="w-3 h-3" /> Not Started
    </span>
  );
}

export default function LabCatalog() {
  const { user, isConfigured } = useAuth();
  const [labProgress, setLabProgress] = useState({});
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    if (user?.id) {
      getLabProgress(user.id).then((progress) => {
        if (mounted) {
          setLabProgress(progress);
          setLoadingProgress(false);
        }
      });
    } else {
      setLoadingProgress(false);
    }
    return () => { mounted = false; };
  }, [user?.id]);

  const completedCount = LABS.filter(
    (l) => labProgress[l.slug]?.status === "completed"
  ).length;

  const filtered = LABS.filter((lab) => {
    const matchSearch =
      !search ||
      lab.title.toLowerCase().includes(search.toLowerCase()) ||
      lab.description.toLowerCase().includes(search.toLowerCase()) ||
      lab.category.toLowerCase().includes(search.toLowerCase());

    const matchTopic = topicFilter === "all" || lab.topic === topicFilter;

    const labStatus = labProgress[lab.slug]?.status || "not_started";
    const matchStatus = statusFilter === "all" || labStatus === statusFilter;

    return matchSearch && matchTopic && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0d1117]/90 backdrop-blur-md px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 text-[#8b949e] hover:text-[#f0f6fc] text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <span className="text-[#30363d] hidden sm:inline">/</span>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-[#2f81f7]" />
            <span className="text-sm font-semibold text-[#f0f6fc]">CyberPath Labs</span>
          </div>
        </div>
        {!isConfigured && (
          <span className="text-[10px] bg-[#e3b341]/10 border border-[#e3b341]/30 text-[#e3b341] px-2 py-0.5 rounded font-semibold">
            Demo Mode — progress saved locally
          </span>
        )}
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-page-enter">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-[#f0f6fc] tracking-tight mb-1">
                Interactive Security Labs
              </h1>
              <p className="text-sm text-[#8b949e]">
                Practice beginner web security concepts in safe, simulated environments. No real systems involved.
              </p>
            </div>
            {/* Progress summary */}
            {!loadingProgress && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#21262d] bg-[#0d1117]">
                <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                <span className="text-sm text-[#c9d1d9]">
                  <span className="font-semibold text-[#f0f6fc]">{completedCount}</span>
                  <span className="text-[#8b949e]"> / {LABS.length} completed</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7681] pointer-events-none" />
            <input
              type="search"
              placeholder="Search labs…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#21262d] bg-[#010409] text-sm text-[#f0f6fc] placeholder:text-[#6e7681] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors"
            />
          </div>
          {/* Topic filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e7681] pointer-events-none" />
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="pl-9 pr-8 py-2 rounded-lg border border-[#21262d] bg-[#010409] text-sm text-[#f0f6fc] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors appearance-none cursor-pointer"
              aria-label="Filter by topic"
            >
              {TOPIC_FILTERS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#21262d] bg-[#010409] text-sm text-[#f0f6fc] focus-visible:border-[#2f81f7] focus-visible:outline-none transition-colors appearance-none cursor-pointer"
            aria-label="Filter by completion status"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Lab cards grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#8b949e]">
            <FlaskConical className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No labs match your filters.</p>
            <button
              onClick={() => { setSearch(""); setTopicFilter("all"); setStatusFilter("all"); }}
              className="mt-3 text-xs text-[#2f81f7] hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filtered.map((lab) => {
              const status = loadingProgress
                ? null
                : labProgress[lab.slug]?.status || "not_started";
              const Icon = lab.icon;
              return (
                <article
                  key={lab.slug}
                  className="rounded-xl border border-[#21262d] bg-[#010409] hover:border-[#30363d] card-interactive flex flex-col"
                >
                  <div className="p-5 flex-1">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg bg-[#2f81f7]/10 border border-[#2f81f7]/30 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#58a6ff]" />
                      </div>
                      {!loadingProgress && <StatusBadge status={status} />}
                    </div>

                    <h2 className="text-sm font-semibold text-[#f0f6fc] mb-1.5">{lab.title}</h2>
                    <p className="text-xs text-[#8b949e] leading-relaxed mb-4">
                      {lab.description}
                    </p>

                    {/* Meta row */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#2f81f7]/10 border border-[#2f81f7]/25 text-[#58a6ff]">
                        {lab.category}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-[#21262d] border border-[#30363d] text-[#8b949e]">
                        {lab.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-[#6e7681]">
                        <Clock className="w-3 h-3" />
                        {lab.estimatedTime}
                      </span>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-1.5">
                      {lab.skills.map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 text-[10px] rounded bg-[#161b22] border border-[#21262d] text-[#8b949e]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5">
                    <Link
                      to={lab.href}
                      className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-[#2f81f7] hover:bg-[#388bfd] text-white text-sm font-semibold transition-colors"
                      aria-label={
                        status === "completed"
                          ? `Review ${lab.title}`
                          : status === "in_progress"
                          ? `Continue ${lab.title}`
                          : `Start ${lab.title}`
                      }
                    >
                      <span>
                        {status === "completed"
                          ? "Review Lab"
                          : status === "in_progress"
                          ? "Continue Lab"
                          : "Start Lab"}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 rounded-lg border border-[#21262d] bg-[#010409] p-4 text-xs text-[#6e7681]">
          <strong className="text-[#8b949e]">Security Notice:</strong> All labs run entirely
          in-browser using fictional data and mock scenarios. No real databases, credentials, or
          external systems are involved. Student input is never executed as code.
        </div>
      </main>
    </div>
  );
}
