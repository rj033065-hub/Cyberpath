/**
 * KnowledgeCheck — Multiple-choice or single-answer quiz component.
 * Does NOT lock content behind completion.
 * Provides explanations for both correct and incorrect answers.
 *
 * Props:
 *   question  — string
 *   options   — [{ id, text }]
 *   correctId — id of the correct option
 *   explanation — string shown after any answer
 *   wrongExplanation — optional map { optionId: "why this is wrong" }
 *   onCorrect — callback when the correct answer is submitted
 */
import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function KnowledgeCheck({
  question,
  options = [],
  correctId,
  explanation,
  wrongExplanation = {},
  onCorrect,
}) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === correctId && onCorrect) onCorrect();
  };

  const isCorrect = submitted && selected === correctId;
  const isWrong = submitted && selected !== correctId;

  return (
    <div className="rounded-xl border border-white/12 bg-page p-5 mb-6">
      <p className="text-sm font-semibold text-fg mb-4">{question}</p>

      <fieldset className="space-y-2" disabled={submitted}>
        <legend className="sr-only">Select the correct answer</legend>
        {options.map((opt) => {
          const isChosen = selected === opt.id;
          const isCorrectOpt = submitted && opt.id === correctId;
          const isWrongChosen = submitted && isChosen && opt.id !== correctId;

          return (
            <label
              key={opt.id}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all text-sm
                ${submitted ? "cursor-default" : "hover:border-white/12 hover:bg-surface"}
                ${isCorrectOpt ? "border-success/40 bg-white/[0.04] text-success" : ""}
                ${isWrongChosen ? "border-danger/40 bg-white/[0.04] text-danger" : ""}
                ${!submitted && isChosen ? "border-white/28 bg-white/[0.06]" : ""}
                ${!submitted && !isChosen ? "border-white/12 text-fg" : ""}
                ${submitted && !isCorrectOpt && !isWrongChosen ? "border-white/12 text-faint" : ""}
              `}
            >
              <input
                type="radio"
                name="kc-question"
                value={opt.id}
                checked={isChosen}
                onChange={() => !submitted && setSelected(opt.id)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center
                  ${isCorrectOpt ? "border-success" : isWrongChosen ? "border-danger" : isChosen ? "border-white/28" : "border-white/12"}`}
              >
                {isChosen && !submitted && (
                  <span className="w-2 h-2 rounded-full bg-accent" />
                )}
                {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                {isWrongChosen && <XCircle className="w-3.5 h-3.5 text-danger" />}
              </span>
              <span>{opt.text}</span>
            </label>
          );
        })}
      </fieldset>

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-accent text-on-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm ${
            isCorrect
              ? "border-white/12 bg-white/[0.04] text-success"
              : "border-danger/30 bg-white/[0.04] text-danger"
          }`}
        >
          <p className="font-semibold mb-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</p>
          {isWrong && wrongExplanation[selected] && (
            <p className="text-fg mb-2">{wrongExplanation[selected]}</p>
          )}
          {explanation && <p className="text-fg">{explanation}</p>}
        </div>
      )}
    </div>
  );
}
