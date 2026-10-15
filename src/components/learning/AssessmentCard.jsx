import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Award, AlertCircle, RotateCcw, ChevronRight, HelpCircle, ShieldCheck } from "lucide-react";
import { submitQuizAnswers, getQuizAttempts } from "../../lib/learningService";

export default function AssessmentCard({
  userId,
  quiz,
  onQuizPassed,
  onBadgeAwarded,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pastAttempts, setPastAttempts] = useState([]);

  // Load prior attempts
  useEffect(() => {
    if (userId && quiz?.slug) {
      getQuizAttempts(userId, quiz.slug).then((attempts) => {
        setPastAttempts(attempts || []);
        const passedAttempt = (attempts || []).find((a) => a.passed);
        if (passedAttempt) {
          setResult({
            score: passedAttempt.score,
            passed: true,
            passingScore: quiz.passingScore,
            feedback: passedAttempt.feedback || [],
          });
          setSubmitted(true);
        }
      });
    }
  }, [userId, quiz?.slug, quiz?.passingScore]);

  const handleSelectOption = (questionId, optionId) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    setError("");
  };

  const allAnswered =
    quiz.questions.length > 0 &&
    quiz.questions.every((q) => selectedAnswers[q.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!allAnswered) {
      setError("Please select an answer for each question before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await submitQuizAnswers(userId, quiz, selectedAnswers);
      setResult(res);
      setSubmitted(true);

      if (res.passed) {
        if (onQuizPassed) onQuizPassed(res);
      }

      if (res.newlyAwardedBadges && res.newlyAwardedBadges.length > 0) {
        if (onBadgeAwarded) onBadgeAwarded(res.newlyAwardedBadges);
      }
    } catch (err) {
      setError(err.message || "Failed to submit assessment.");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setResult(null);
    setError("");
  };

  return (
    <div className="rounded-2xl border border-white/12 bg-[#101012] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/15 flex items-center justify-center text-white">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.06] text-white border border-white/15">
                Knowledge Check
              </span>
              <span className="text-xs text-[#a1a1aa]">
                Passing Score: {quiz.passingScore}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#fafafa] mt-1">{quiz.title}</h3>
          </div>
        </div>

        {submitted && result && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
                result.passed
                  ? "bg-[#4ade80]/15 border-[#4ade80]/40 text-[#4ade80]"
                  : "bg-[#f87171]/15 border-[#f87171]/40 text-[#f87171]"
              }`}
            >
              {result.passed ? (
                <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
              ) : (
                <XCircle className="w-4 h-4 text-[#f87171]" />
              )}
              <span>Score: {result.score}% ({result.passed ? "PASSED" : "FAILED"})</span>
            </div>

            {result.passed && result.xpAwarded > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-white/[0.08] border border-white/20 text-white text-xs font-mono font-bold animate-in fade-in">
                +{result.xpAwarded} XP
              </span>
            )}
          </div>
        )}
      </div>

      {/* Questions list */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {quiz.questions.map((q, idx) => {
          const selectedOption = selectedAnswers[q.id];
          const questionFeedback = result?.feedback?.find(
            (f) => f.questionId === q.id
          );

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl border border-white/10 bg-[#09090b] space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-[#1c1c20] border border-white/15 text-xs font-mono font-semibold flex items-center justify-center text-white shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-[#fafafa] leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt) => {
                  const isChecked = selectedOption === opt.id;
                  let optionStateClasses =
                    "border-white/10 bg-[#101012] hover:border-white/28 text-[#fafafa]";

                  if (isChecked && !submitted) {
                    optionStateClasses =
                      "border-white/40 bg-white/[0.08] text-white ring-1 ring-white/30";
                  } else if (submitted) {
                    if (opt.id === q.correctOptionId) {
                      optionStateClasses =
                        "border-[#4ade80]/60 bg-[#4ade80]/15 text-[#4ade80] font-medium";
                    } else if (isChecked && opt.id !== q.correctOptionId) {
                      optionStateClasses =
                        "border-[#f87171]/60 bg-[#f87171]/15 text-[#f87171]";
                    }
                  }

                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(q.id, opt.id)}
                      className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-all ${optionStateClasses}`}
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={opt.id}
                        checked={isChecked}
                        onChange={() => handleSelectOption(q.id, opt.id)}
                        disabled={submitted}
                        className="sr-only"
                      />
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked
                            ? "border-white bg-white"
                            : "border-white/20 bg-[#09090b]"
                        }`}
                      >
                        {isChecked && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#09090b]" />
                        )}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </label>
                  );
                })}
              </div>

              {/* Post-submission explanation */}
              {submitted && questionFeedback && (
                <div
                  className={`mt-3 ml-9 p-3 rounded-lg text-xs leading-relaxed border ${
                    questionFeedback.isCorrect
                      ? "bg-[#4ade80]/10 border-[#4ade80]/30 text-[#fafafa]"
                      : "bg-[#f87171]/10 border-[#f87171]/30 text-[#fafafa]"
                  }`}
                >
                  <strong className="block mb-1 font-semibold text-white">
                    {questionFeedback.isCorrect
                      ? "✓ Correct!"
                      : "✕ Needs Review:"}
                  </strong>
                  <span className="text-[#a1a1aa]">{questionFeedback.explanation}</span>
                </div>
              )}
            </div>
          );
        })}

        {error && (
          <div className="p-3 rounded-lg bg-[#f87171]/10 border border-[#f87171]/30 text-xs text-[#f87171] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!submitted ? (
            <button
              type="submit"
              disabled={loading || !allAnswered}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-[#e4e4e7] disabled:opacity-50 disabled:cursor-not-allowed text-[#09090b] text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-[#09090b]" />
              <span>{loading ? "Evaluating Assessment..." : "Submit Answers"}</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/12 bg-transparent hover:bg-white/[0.06] text-xs text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span>Retake Quiz</span>
              </button>

              {result?.passed && (
                <span className="text-xs font-mono text-[#4ade80] flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                  <span>Requirement Met</span>
                </span>
              )}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
