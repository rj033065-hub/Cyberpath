import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Shield,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  LockKeyhole,
  Clock,
  Sparkles,
  Flame,
  ShieldCheck,
  Globe,
  Award,
  PlayCircle,
  HelpCircle,
  BookOpen,
} from "lucide-react";
import { getPathBySlug } from "../data/curriculumData";
import { getCompletedLessonSlugs, getStudentDashboardMetrics } from "../lib/learningService";

const TRACK_ICONS = {
  "red-team": Flame,
  "blue-team": ShieldCheck,
  "web-security": Globe,
};

export default function PathCurriculum() {
  const { pathSlug } = useParams();
  const { user, profile, updateProfileSelectedPath } = useAuth();
  const navigate = useNavigate();

  const [completedSlugs, setCompletedSlugs] = useState([]);
  const [loading, setLoading] = useState(true);

  const path = getPathBySlug(pathSlug || "red-team") || getPathBySlug("red-team");
  const TrackIcon = TRACK_ICONS[path.slug] || Shield;

  useEffect(() => {
    if (user?.id) {
      getCompletedLessonSlugs(user.id).then((slugs) => {
        setCompletedSlugs(slugs);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  const allPathLessons = path.modules.flatMap((m) => m.lessons);
  const totalLessons = allPathLessons.length;
  const completedCount = allPathLessons.filter((l) =>
    completedSlugs.includes(l.slug)
  ).length;
  const percentComplete =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Next recommended lesson
  const nextLesson =
    allPathLessons.find((l) => !completedSlugs.includes(l.slug)) ||
    allPathLessons[0];

  const handleMakeActiveTrack = async () => {
    if (user?.id) {
      await updateProfileSelectedPath(path.slug);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc] flex flex-col selection:bg-[#2f81f7]/30 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#21262d] bg-[#0d1117]/95 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg text-[#8b98a8] hover:text-[#f0f6fc] hover:bg-[#16202e] transition-colors flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-[#21262d]" />
          <span className="font-bold tracking-tight text-sm text-[#f0f6fc]">
            {path.title} Curriculum
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/explore"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors hidden sm:inline"
          >
            CTF Explorer
          </Link>
          <Link
            to="/profile"
            className="text-xs text-[#8b98a8] hover:text-[#f0f6fc] px-2.5 py-1.5 rounded-md hover:bg-[#111821] transition-colors hidden sm:inline"
          >
            Profile
          </Link>

          {profile?.selected_path !== path.slug && (
            <button
              type="button"
              onClick={handleMakeActiveTrack}
              className="text-xs px-3 py-1.5 rounded-lg border border-[#21262d] bg-[#111821] hover:border-[#2f81f7] text-[#8b98a8] hover:text-[#f0f6fc] transition-colors"
            >
              Set as Active Track
            </button>
          )}

          {nextLesson && (
            <Link
              to={`/learn/${path.slug}/${nextLesson.slug}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2f81f7] hover:bg-[#2069cc] text-xs font-semibold text-white shadow-sm shadow-[#2f81f7]/25 transition-all"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{completedCount > 0 ? "Continue Learning" : "Start Track"}</span>
            </Link>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-page-enter">
        {/* Track Hero Banner: Focal Element */}
        <section className="rounded-2xl bg-[#111722] p-6 sm:p-9 space-y-6 relative overflow-hidden border border-[#212b38]/70 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#58a6ff] uppercase tracking-wider font-semibold">
                <TrackIcon className="w-3.5 h-3.5" />
                <span>{path.subtitle}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#f0f6fc] leading-tight">
                {path.title} Curriculum Roadmap
              </h1>
              <p className="text-[15px] sm:text-base text-[#8b98a8] leading-relaxed">
                {path.description}
              </p>
            </div>

            {/* Progress Card: Raised Surface */}
            <div className="p-5 rounded-2xl bg-[#182232] text-xs space-y-3 shrink-0 min-w-[220px] shadow-md">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[11px] text-[#8b98a8] uppercase">Track Progress</span>
                <span className="font-bold text-sm text-[#58a6ff]">{percentComplete}%</span>
              </div>
              <div className="w-full bg-[#090d14] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#2f81f7] h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
              <div className="text-[11px] text-[#8b98a8] flex items-center justify-between pt-1">
                <span>{completedCount} of {totalLessons} Lessons</span>
                <span className="font-semibold text-[#f0f6fc]">{totalLessons - completedCount} Left</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modules & Lessons List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-[22px] font-bold text-[#f0f6fc] tracking-tight flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#58a6ff]" />
              <span>Curriculum Modules & Lessons</span>
            </h2>
            <span className="text-xs font-mono text-[#8b98a8]">
              {path.modules.length} Modules · {totalLessons} Lessons
            </span>
          </div>

          <div className="space-y-5">
            {path.modules.map((mod, modIdx) => {
              const modCompleted = mod.lessons.filter((l) =>
                completedSlugs.includes(l.slug)
              ).length;
              const isModFinished =
                mod.lessons.length > 0 && modCompleted === mod.lessons.length;

              return (
                <div
                  key={mod.id}
                  className="rounded-2xl bg-[#111722] overflow-hidden shadow-lg border border-transparent hover:border-[#212b38] transition-colors"
                >
                  {/* Module Header: Raised surface header */}
                  <div className="p-5 sm:p-6 bg-[#182232]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-mono text-[#58a6ff] uppercase font-semibold">
                          Stage {modIdx + 1}
                        </span>
                        {isModFinished && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#3fb950]/15 text-[#3fb950] font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Cleared
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-[#f0f6fc]">
                        {mod.title}
                      </h3>
                      <p className="text-[13px] text-[#8b98a8] mt-0.5 max-w-2xl leading-relaxed">
                        {mod.description}
                      </p>
                    </div>

                    <div className="text-xs font-mono text-[#8b98a8] shrink-0">
                      <strong className="text-[#f0f6fc]">{modCompleted}</strong> / {mod.lessons.length} Completed
                    </div>
                  </div>

                  {/* Lessons in this Module: Clean rows without heavy 1px borders */}
                  <div className="divide-y divide-white/5">
                    {mod.lessons.map((lesson) => {
                      const isDone = completedSlugs.includes(lesson.slug);

                      return (
                        <Link
                          key={lesson.slug}
                          to={`/learn/${path.slug}/${lesson.slug}`}
                          className="card-interactive p-4 sm:p-5 flex items-center justify-between hover:bg-[#182232]/80 transition-colors group"
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-semibold mt-0.5 transition-colors ${
                                isDone
                                  ? "bg-[#3fb950]/20 text-[#3fb950]"
                                  : "bg-[#090d14] text-[#8b98a8] group-hover:text-[#58a6ff]"
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span>{lesson.sequenceOrder}</span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <h4 className="text-sm sm:text-[15px] font-semibold text-[#f0f6fc] group-hover:text-[#58a6ff] transition-colors">
                                {lesson.title}
                              </h4>
                              <p className="text-xs text-[#8b98a8] line-clamp-1 max-w-xl">
                                {lesson.summary}
                              </p>

                              <div className="flex items-center gap-3 text-[11px] font-mono text-[#8b98a8] pt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> ~{lesson.estimatedMinutes}m
                                </span>
                                {lesson.quiz && (
                                  <span className="flex items-center gap-1 text-[#58a6ff]">
                                    <HelpCircle className="w-3 h-3" /> Assessment Included
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-md transition-colors ${
                                isDone
                                  ? "text-[#3fb950] bg-[#3fb950]/10"
                                  : "text-[#8b98a8] group-hover:text-white"
                              }`}
                            >
                              {isDone ? "Review" : "Start"}
                            </span>
                            <ChevronRight className="w-4 h-4 text-[#8b98a8] group-hover:text-[#58a6ff] group-hover:translate-x-0.5 transition-all" />
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
      </main>
    </div>
  );
}
