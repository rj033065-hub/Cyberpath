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
    <div className="rounded-2xl border border-[#21262d] bg-[#111821] p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#21262d] pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2f81f7]/15 border border-[#2f81f7]/40 flex items-center justify-center text-[#58a6ff]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#2f81f7]/20 text-[#58a6ff] border border-[#2f81f7]/30">
                Knowledge Check
              </span>
              <span className="text-xs text-[#8b98a8]">
                Passing Score: {quiz.passingScore}%
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#f0f6fc] mt-1">{quiz.title}</h3>
          </div>
        </div>

        {submitted && result && (
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <div
              className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 ${
                result.passed
                  ? "bg-[#3fb950]/15 border-[#3fb950]/40 text-[#3fb950]"
                  : "bg-[#f85149]/15 border-[#f85149]/40 text-[#f85149]"
              }`}
            >
              {result.passed ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span>Score: {result.score}% ({result.passed ? "PASSED" : "FAILED"})</span>
            </div>

            {result.passed && result.xpAwarded > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-[#f2cc60]/15 border border-[#d29922]/40 text-[#f2cc60] text-xs font-mono font-bold animate-in fade-in">
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
              className="p-5 rounded-xl border border-[#21262d] bg-[#0d1117] space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-[#16202e] border border-[#21262d] text-xs font-mono font-semibold flex items-center justify-center text-[#58a6ff] shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-[#f0f6fc] leading-relaxed">
                  {q.questionText}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2 pl-9">
                {q.options.map((opt) => {
                  const isChecked = selectedOption === opt.id;
                  let optionStateClasses =
                    "border-[#21262d] bg-[#111821] hover:border-[#30363d] text-[#c9d1d9]";

                  if (isChecked && !submitted) {
                    optionStateClasses =
                      "border-[#2f81f7] bg-[#2f81f7]/10 text-white ring-1 ring-[#2f81f7]";
                  } else if (submitted) {
                    if (opt.id === q.correctOptionId) {
                      optionStateClasses =
                        "border-[#3fb950] bg-[#3fb950]/15 text-[#3fb950] font-medium";
                    } else if (isChecked && opt.id !== q.correctOptionId) {
                      optionStateClasses =
                        "border-[#f85149] bg-[#f85149]/15 text-[#f85149]";
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
                            ? "border-[#2f81f7] bg-[#2f81f7]"
                            : "border-[#30363d] bg-[#0d1117]"
                        }`}
                      >
                        {isChecked && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
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
                      ? "bg-[#3fb950]/10 border-[#3fb950]/30 text-[#e6edf3]"
                      : "bg-[#f85149]/10 border-[#f85149]/30 text-[#e6edf3]"
                  }`}
                >
                  <strong className="block mb-1 font-semibold text-white">
                    {questionFeedback.isCorrect
                      ? "✓ Correct!"
                      : "✕ Needs Review:"}
                  </strong>
                  <span>{questionFeedback.explanation}</span>
                </div>
              )}
            </div>
          );
        })}

        {error && (
          <div className="p-3 rounded-lg bg-[#f85149]/10 border border-[#f85149]/30 text-xs text-[#f85149] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {!submitted ? (
            <button
              type="submit"
              disabled={loading || !allAnswered}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2f81f7] hover:bg-[#2069cc] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-sm shadow-[#2f81f7]/25 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? "Evaluating Assessment..." : "Submit Answers"}</span>
            </button>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#21262d] bg-[#111821] hover:bg-[#16202e] text-xs text-[#c9d1d9] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#58a6ff]" />
                <span>Retake Quiz</span>
              </button>

              {result?.passed && (
                <span className="text-xs font-mono text-[#3fb950] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
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
