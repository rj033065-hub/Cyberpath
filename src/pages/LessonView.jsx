import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  AlertTriangle,
  ExternalLink,
  Laptop,
  Check,
  Award,
  Sparkles,
  Terminal,
  FileText,
  LockKeyhole,
} from "lucide-react";
import {
  getPathBySlug,
  getLessonBySlug,
} from "../data/curriculumData";
import {
  markLessonComplete,
  getCompletedLessonSlugs,
} from "../lib/learningService";
import AssessmentCard from "../components/learning/AssessmentCard";
import BadgeUnlockedModal from "../components/learning/BadgeUnlockedModal";

export default function LessonView() {
  const { pathSlug, lessonSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [marking, setMarking] = useState(false);
  const [unlockedBadge, setUnlockedBadge] = useState(null);
  const [xpEarnedNotice, setXpEarnedNotice] = useState(0);

  const path = getPathBySlug(pathSlug);
  const lessonData = getLessonBySlug(pathSlug, lessonSlug);

  useEffect(() => {
    if (user?.id) {
      getCompletedLessonSlugs(user.id).then((slugs) => {
        setCompletedSlugs(slugs);
      });
    }
  }, [user?.id]);

  if (!path || !lessonData) {
    return (
      <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full p-6 rounded-2xl border border-[#21262d] bg-[#111821] text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-[#f2cc60] mx-auto" />
          <h2 className="text-lg font-bold">Lesson Not Found</h2>
          <p className="text-xs text-[#8b98a8]">
            The requested lesson could not be found in the CyberPath curriculum.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2f81f7] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  const { lesson, prevLesson, nextLesson, totalInPath, currentIndex } =
    lessonData;
  const isCompleted = completedSlugs.includes(lesson.slug);

  const handleMarkComplete = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setMarking(true);
    try {
      const res = await markLessonComplete(user.id, pathSlug, lesson.slug);
      if (res.success) {
        setCompletedSlugs(res.completedSlugs);
        if (res.xpAwarded && res.xpAwarded > 0) {
          setXpEarnedNotice(res.xpAwarded);
          setTimeout(() => setXpEarnedNotice(0), 4000);
        }
        if (res.newlyAwardedBadges && res.newlyAwardedBadges.length > 0) {
          setUnlockedBadge(res.newlyAwardedBadges[0]);
        }
      }
    } finally {
      setMarking(false);
    }
  };

  const handleBadgeAwarded = (badges) => {
    if (badges && badges.length > 0) {
      setUnlockedBadge(badges[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/learn/${path.slug}`}
            className="p-2 rounded-lg text-[#8b98a8] hover:text-[#f0f6fc] hover:bg-[#16202e] transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Path Roadmap</span>
          </Link>
          <div className="h-4 w-px bg-[#21262d] hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full border border-[#21262d] bg-[#111821] text-[#58a6ff]">
              {path.title}
            </span>
            <span className="text-xs text-[#8b98a8] hidden md:inline">
              / Lesson {currentIndex} of {totalInPath}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {xpEarnedNotice > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-[#f2cc60]/15 border border-[#d29922]/40 text-[#f2cc60] text-xs font-mono font-bold animate-in fade-in">
              +{xpEarnedNotice} XP Awarded!
            </span>
          )}

          <Link
            to="/explore"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors hidden md:inline"
          >
            CTF Explorer
          </Link>

          <Link
            to="/dashboard"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-3 py-1.5 rounded-lg border border-[#21262d] bg-[#111821] hover:bg-[#16202e] transition-colors"
          >
            Dashboard
          </Link>

          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={marking || isCompleted}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isCompleted
                ? "bg-[#3fb950]/15 text-[#3fb950] border border-[#3fb950]/40 cursor-default"
                : "bg-[#2f81f7] hover:bg-[#2069cc] text-white shadow-sm shadow-[#2f81f7]/25"
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{marking ? "Saving..." : "Mark as Complete"}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Lesson Hero Banner */}
        <div className="rounded-2xl border border-[#21262d] bg-[#111821] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8b98a8]">
            <span className="font-mono text-[#58a6ff]">
              {lesson.moduleTitle}
            </span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>~{lesson.estimatedMinutes} mins study</span>
              </span>
              {isCompleted && (
                <span className="flex items-center gap-1 text-[#3fb950] font-mono font-medium">
                  <Check className="w-3.5 h-3.5" /> Verified
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#f0f6fc]">
            {lesson.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#8b98a8] leading-relaxed max-w-3xl">
            {lesson.summary}
          </p>

          {/* Prerequisites */}
          {lesson.prerequisites && lesson.prerequisites.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#8b98a8]">
                Prerequisites:
              </span>
              {lesson.prerequisites.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0d1117] border border-[#21262d] text-[#c9d1d9]"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Learning Objectives Box */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="rounded-xl border border-[#2f81f7]/30 bg-[#2f81f7]/5 p-5 space-y-3">
            <h2 className="text-xs font-mono font-bold uppercase text-[#58a6ff] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Core Learning Objectives</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#c9d1d9]">
              {lesson.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff] shrink-0 mt-1.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Educational Content Section */}
        <article className="rounded-2xl border border-[#21262d] bg-[#111821] p-6 sm:p-8 prose prose-invert max-w-none text-[#c9d1d9] text-sm leading-relaxed space-y-4">
          <div
            className="space-y-4 whitespace-pre-line"
            dangerouslySetInnerHTML={{
              __html: formatMarkdownToHtml(lesson.contentMarkdown),
            }}
          />
        </article>

        {/* Important Notes & Common Pitfalls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
            <div className="rounded-xl border border-[#3fb950]/30 bg-[#3fb950]/5 p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#3fb950] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Security Takeaways</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#c9d1d9]">
                {lesson.keyTakeaways.map((k, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#3fb950] font-bold">✓</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {lesson.commonPitfalls && lesson.commonPitfalls.length > 0 && (
            <div className="rounded-xl border border-[#f85149]/30 bg-[#f85149]/5 p-5 space-y-3">
              <h3 className="text-xs font-mono font-bold uppercase text-[#f85149] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Common Beginner Mistakes</span>
              </h3>
              <ul className="space-y-2 text-xs text-[#c9d1d9]">
                {lesson.commonPitfalls.map((cp, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#f85149] font-bold">!</span>
                    <span>{cp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Legal Sandbox Labs & Curated Resources */}
        <div className="rounded-2xl border border-[#21262d] bg-[#111821] p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#21262d] pb-3">
            <h3 className="text-sm font-bold text-[#f0f6fc] flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#58a6ff]" />
              <span>Recommended Hands-On Labs & Documentation</span>
            </h3>
            <span className="text-[10px] font-mono text-[#8b98a8]">
              LEGAL SANDBOXES ONLY
            </span>
          </div>

          {lesson.labGuidance && (
            <p className="text-xs text-[#8b98a8] leading-relaxed bg-[#0d1117] p-3 rounded-xl border border-[#21262d]">
              <strong className="text-[#f0f6fc] block mb-1">
                Practical Mission:
              </strong>
              {lesson.labGuidance}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(lesson.resources || [
              {
                title: "TryHackMe Guided Security Room",
                url: "https://tryhackme.com/",
                platform: "TryHackMe",
                type: "lab",
              },
              {
                title: "Official Security Tool Documentation",
                url: "https://owasp.org/",
                platform: "Documentation",
                type: "documentation",
              },
            ]).map((res, idx) => (
              <a
                key={idx}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="p-3.5 rounded-xl border border-[#21262d] bg-[#0d1117] hover:border-[#2f81f7]/50 hover:bg-[#16202e] transition-all group flex items-center justify-between"
              >
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono text-[#58a6ff] uppercase">
                    {res.platform} · {res.type}
                  </span>
                  <div className="text-xs font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                    {res.title}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#8b98a8] group-hover:text-[#58a6ff] shrink-0" />
              </a>
            ))}
          </div>
        </div>

        {/* Interactive Knowledge Assessment (if present) */}
        {lesson.quiz && (
          <AssessmentCard
            userId={user?.id}
            quiz={lesson.quiz}
            onQuizPassed={() => {
              if (user?.id) {
                markLessonComplete(user.id, pathSlug, lesson.slug).then((res) => {
                  setCompletedSlugs(res.completedSlugs);
                });
              }
            }}
            onBadgeAwarded={handleBadgeAwarded}
          />
        )}

        {/* Previous & Next Navigation */}
        <div className="pt-4 border-t border-[#21262d] flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link
              to={`/learn/${pathSlug}/${prevLesson.slug}`}
              className="px-4 py-2.5 rounded-xl border border-[#21262d] bg-[#111821] hover:bg-[#16202e] text-xs font-medium text-[#c9d1d9] hover:text-white transition-all flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <div className="text-left hidden sm:block">
                <span className="text-[10px] text-[#8b98a8] block">Previous</span>
                <span className="max-w-[160px] truncate block font-semibold">{prevLesson.title}</span>
              </div>
              <span className="sm:hidden">Previous</span>
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {!isCompleted && (
              <button
                type="button"
                onClick={handleMarkComplete}
                disabled={marking}
                className="px-5 py-2.5 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] text-white text-xs font-semibold shadow-sm transition-all"
              >
                {marking ? "Saving..." : "Mark as Complete"}
              </button>
            )}
          </div>

          {nextLesson ? (
            <Link
              to={`/learn/${pathSlug}/${nextLesson.slug}`}
              className="px-4 py-2.5 rounded-xl border border-[#21262d] bg-[#111821] hover:bg-[#16202e] text-xs font-medium text-[#c9d1d9] hover:text-white transition-all flex items-center gap-2 text-right"
            >
              <span className="sm:hidden">Next</span>
              <div className="hidden sm:block">
                <span className="text-[10px] text-[#8b98a8] block">Next Lesson</span>
                <span className="max-w-[160px] truncate block font-semibold">{nextLesson.title}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              to={`/learn/${pathSlug}`}
              className="px-4 py-2.5 rounded-xl bg-[#3fb950] hover:bg-[#2ea043] text-white text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>Track Complete!</span>
              <Award className="w-4 h-4" />
            </Link>
          )}
        </div>
      </main>

      {/* Unlocked Badge Modal */}
      {unlockedBadge && (
        <BadgeUnlockedModal
          badge={unlockedBadge}
          onClose={() => setUnlockedBadge(null)}
        />
      )}
    </div>
  );
}

// Simple helper to format headers and code blocks in markdown preview
function formatMarkdownToHtml(markdown) {
  if (!markdown) return "";
  let html = markdown
    // Format headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-[#f0f6fc] mt-6 mb-2">$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4 class="text-sm font-semibold text-[#58a6ff] mt-4 mb-1">$1</h4>')
    // Format lists
    .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-xs text-[#c9d1d9] mb-1">$1</li>')
    // Format code blocks
    .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="p-4 rounded-xl bg-[#090d16] border border-[#21262d] font-mono text-xs text-[#58a6ff] overflow-x-auto my-3"><code>$2</code></pre>')
    // Format inline code
    .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-[#090d16] text-[#58a6ff] font-mono text-xs border border-[#21262d]">$1</code>')
    // Format bold
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
  return html;
}
