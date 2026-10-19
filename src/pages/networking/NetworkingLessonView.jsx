import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  Lightbulb,
  AlertTriangle,
  ShieldAlert,
  Info,
  Activity,
  Gamepad2,
  Check,
  XCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import CyberPathLogo from "../../components/common/CyberPathLogo";
import {
  getNetworkingLessonBySlug,
  getAllNetworkingLessons
} from "../../data/networkingCurriculumData";
import { getDetailedNetworkingLesson } from "../../data/networkingLessonContent";
import { markLessonComplete, getCompletedLessonSlugs } from "../../lib/learningService";
import BadgeUnlockedModal from "../../components/learning/BadgeUnlockedModal";
import {
  PacketJourneySim,
  TcpHandshakeSim,
  DnsResolutionSim,
  OsiEncapsulationSim,
  ArpDiscoverySim,
  SubnetVisualizerSim
} from "../../components/networking/simulations";

const SIMULATION_COMPONENTS = {
  "packet-journey": PacketJourneySim,
  "tcp-handshake": TcpHandshakeSim,
  "dns-resolution": DnsResolutionSim,
  "osi-encapsulation": OsiEncapsulationSim,
  "arp-discovery": ArpDiscoverySim,
  "subnet-visualizer": SubnetVisualizerSim,
};

export default function NetworkingLessonView() {
  const { lessonSlug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const lessonLookup = getNetworkingLessonBySlug(lessonSlug);
  const detailedLesson = getDetailedNetworkingLesson(lessonSlug);

  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false);
  const [newBadges, setNewBadges] = useState([]);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkCompletion() {
      if (user?.id) {
        const completed = await getCompletedLessonSlugs(user.id);
        if (isMounted) {
          setIsCompleted(completed.includes(lessonSlug));
          setLoading(false);
        }
      } else {
        if (isMounted) setLoading(false);
      }
    }
    checkCompletion();
    return () => {
      isMounted = false;
    };
  }, [user?.id, lessonSlug]);

  if (!lessonLookup || !detailedLesson) {
    return (
      <div className="min-h-screen bg-page text-fg flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold mb-2">Lesson Not Found</h2>
        <p className="text-sm text-muted mb-4">The requested networking lesson could not be located.</p>
        <Link
          to="/networking"
          className="px-4 py-2 rounded-xl bg-cyan-500 text-black text-xs font-semibold"
        >
          Return to Networking Hub
        </Link>
      </div>
    );
  }

  const { lesson, prevLesson, nextLesson, currentIndex, totalLessons } = lessonLookup;
  const SimulationComp = SIMULATION_COMPONENTS[detailedLesson.simulationId] || null;

  const handleSelectAnswer = (qId, optionId) => {
    if (quizSubmitted && quizPassed) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionId });
  };

  const handleSubmitQuiz = async () => {
    const questions = detailedLesson.quiz?.questions || [];
    if (questions.length === 0) return;

    let correctCount = 0;
    for (const q of questions) {
      if (selectedAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    }

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    const passed = calculatedScore >= (detailedLesson.quiz?.passingScore || 75);

    setQuizScore(calculatedScore);
    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed && user?.id) {
      const res = await markLessonComplete(user.id, "networking", lessonSlug);
      if (res?.success) {
        setIsCompleted(true);
        if (res.newlyAwardedBadges && res.newlyAwardedBadges.length > 0) {
          setNewBadges(res.newlyAwardedBadges);
          setShowBadgeModal(true);
        }
      }
    }
  };

  const handleManualMarkComplete = async () => {
    if (user?.id) {
      const res = await markLessonComplete(user.id, "networking", lessonSlug);
      if (res?.success) {
        setIsCompleted(true);
        if (nextLesson) {
          navigate(`/networking/lesson/${nextLesson.slug}`);
        } else {
          navigate("/networking");
        }
      }
    } else {
      if (nextLesson) {
        navigate(`/networking/lesson/${nextLesson.slug}`);
      } else {
        navigate("/networking");
      }
    }
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
            <span className="text-xs font-mono text-zinc-400 hidden md:inline">
              Lesson {currentIndex} of {totalLessons}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {prevLesson && (
            <Link
              to={`/networking/lesson/${prevLesson.slug}`}
              className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:bg-raised text-muted hover:text-fg flex items-center gap-1"
              title="Previous lesson"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Link>
          )}

          {nextLesson && (
            <Link
              to={`/networking/lesson/${nextLesson.slug}`}
              className="px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 flex items-center gap-1 font-medium"
              title="Next lesson"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}

          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Completed</span>
            </span>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 animate-page-enter">
        {/* Lesson Header */}
        <div className="space-y-3 pb-6 border-b border-white/12">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-400 font-bold">
              Level {detailedLesson.levelNumber}
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {detailedLesson.estimatedMinutes} min read
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-400">{detailedLesson.levelTitle}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-fg">
            {detailedLesson.title}
          </h1>

          <p className="text-sm text-zinc-300 leading-relaxed">
            {detailedLesson.summary}
          </p>
        </div>

        {/* Learning Objectives */}
        <div className="p-5 rounded-2xl bg-surface border border-white/12 space-y-3">
          <h2 className="text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Learning Objectives</span>
          </h2>
          <ul className="grid grid-cols-1 gap-2 text-xs text-zinc-300">
            {detailedLesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real-World Analogy */}
        {detailedLesson.analogy && (
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 via-surface to-surface border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Real-World Analogy: {detailedLesson.analogy.title}</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
              {detailedLesson.analogy.text}
            </p>
          </div>
        )}

        {/* Theory Breakdown Section */}
        <div className="p-6 rounded-2xl bg-surface border border-white/12 space-y-6">
          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-4">
            <div
              className="space-y-4"
              dangerouslySetInnerHTML={{
                __html: detailedLesson.theory
                  .replace(/### (.*?)\n/g, '<h3 class="text-base font-bold text-fg pt-4 pb-1 border-b border-white/10">$1</h3>')
                  .replace(/---/g, '<hr class="border-white/10 my-4" />')
                  .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-raised text-cyan-300 font-mono text-xs">$1</code>')
                  .replace(/\n\n/g, '<p class="text-zinc-300 leading-relaxed"></p>')
              }}
            />
          </div>
        </div>

        {/* Embedded Interactive Simulation (If available for this lesson) */}
        {SimulationComp && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-fg tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Interactive Visual Simulation</span>
              </h2>
              <span className="text-xs font-mono text-cyan-400">Live Browser Engine</span>
            </div>

            <SimulationComp />
          </div>
        )}

        {/* Worked Example */}
        {detailedLesson.workedExample && (
          <div className="p-5 rounded-2xl bg-surface border border-white/12 space-y-3">
            <h3 className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Worked Example: {detailedLesson.workedExample.title}</span>
            </h3>
            <p className="text-xs text-zinc-400 italic mb-2">
              {detailedLesson.workedExample.scenario}
            </p>
            <div className="space-y-2">
              {detailedLesson.workedExample.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-300 bg-raised/40 p-2.5 rounded-lg border border-white/5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{st}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Terms Glossary Grid */}
        {detailedLesson.keyTerms && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase text-zinc-400 font-bold tracking-wider">
              Key Terms & Vocabulary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {detailedLesson.keyTerms.map((kt, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-surface border border-white/10 space-y-1">
                  <span className="text-xs font-bold text-cyan-400 block font-mono">{kt.term}</span>
                  <p className="text-xs text-zinc-400 leading-relaxed">{kt.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Misconceptions Alert */}
        {detailedLesson.commonMisconceptions && (
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Common Beginner Misconceptions</span>
            </div>
            <div className="space-y-2">
              {detailedLesson.commonMisconceptions.map((mis, i) => (
                <p key={i} className="text-xs text-zinc-300 leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/5">
                  {mis}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Cybersecurity Relevance */}
        {detailedLesson.cybersecurityRelevance && (
          <div className="p-5 rounded-2xl bg-surface border border-rose-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Cybersecurity Relevance & Defense</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
              {detailedLesson.cybersecurityRelevance}
            </p>
          </div>
        )}

        {/* Knowledge Check Assessment Quiz */}
        {detailedLesson.quiz && (
          <div className="p-6 rounded-2xl bg-surface border border-white/12 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-fg tracking-tight">{detailedLesson.quiz.title}</h3>
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Passing: {detailedLesson.quiz.passingScore}%
              </span>
            </div>

            <div className="space-y-6">
              {detailedLesson.quiz.questions.map((q, idx) => {
                const userSelected = selectedAnswers[q.id];
                return (
                  <div key={q.id} className="space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-fg">
                      <span className="text-cyan-400 font-mono mr-1.5">{idx + 1}.</span>
                      {q.questionText}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt) => {
                        const isChosen = userSelected === opt.id;
                        let optStyle = "bg-raised/60 hover:bg-white/5 border-white/10 text-zinc-300";

                        if (quizSubmitted) {
                          if (opt.id === q.correctOptionId) {
                            optStyle = "bg-emerald-950/60 border-emerald-500/70 text-emerald-200 font-semibold";
                          } else if (isChosen && opt.id !== q.correctOptionId) {
                            optStyle = "bg-red-950/60 border-red-500/70 text-red-200";
                          } else {
                            optStyle = "bg-raised/30 border-white/5 opacity-50 text-muted";
                          }
                        } else if (isChosen) {
                          optStyle = "bg-cyan-950/50 border-cyan-400 text-cyan-200 ring-1 ring-cyan-400/50";
                        }

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt.id)}
                            disabled={quizSubmitted && quizPassed}
                            className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 ${optStyle}`}
                          >
                            <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[10px] shrink-0 mt-0.5">
                              {opt.id.toUpperCase()}
                            </span>
                            <span className="leading-relaxed">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="text-[11px] text-zinc-400 bg-black/30 p-2.5 rounded-lg border border-white/5 mt-2">
                        <strong className="text-zinc-300">Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Quiz Results Summary */}
            {quizSubmitted && (
              <div
                className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
                  quizPassed
                    ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                    : "bg-red-950/40 border-red-500/50 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {quizPassed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>
                    Score: <strong>{quizScore}%</strong> — {quizPassed ? "Assessment Passed! 10 XP Awarded." : "Score below 75%. Review the material and try again."}
                  </span>
                </div>
                {!quizPassed && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuizSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="px-3 py-1.5 rounded-lg bg-raised hover:bg-white/10 text-xs font-mono font-semibold"
                  >
                    Retry Quiz
                  </button>
                )}
              </div>
            )}

            {!quizSubmitted && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(selectedAnswers).length < detailedLesson.quiz.questions.length}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-black transition-colors"
                >
                  Submit Knowledge Check
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/12">
          {prevLesson ? (
            <Link
              to={`/networking/lesson/${prevLesson.slug}`}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-surface hover:bg-raised border border-white/10 text-xs text-muted hover:text-fg flex items-center justify-center gap-2 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous: {prevLesson.title}</span>
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {!isCompleted && (
              <button
                type="button"
                onClick={handleManualMarkComplete}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-raised hover:bg-white/10 border border-white/12 text-xs font-medium text-fg transition-colors"
              >
                Mark Complete
              </button>
            )}

            {nextLesson ? (
              <Link
                to={`/networking/lesson/${nextLesson.slug}`}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                to="/networking"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-bold text-black transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Return to Hub</span>
                <Check className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Badge Unlocked Celebration Modal */}
      {showBadgeModal && newBadges.length > 0 && (
        <BadgeUnlockedModal
          badges={newBadges}
          onClose={() => setShowBadgeModal(false)}
        />
      )}
    </div>
  );
}
