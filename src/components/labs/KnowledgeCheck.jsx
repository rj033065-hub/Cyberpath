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
    <div className="rounded-xl border border-[#21262d] bg-[#0d1117] p-5 mb-6">
      <p className="text-sm font-semibold text-[#f0f6fc] mb-4">{question}</p>

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
                ${submitted ? "cursor-default" : "hover:border-[#30363d] hover:bg-[#161b22]"}
                ${isCorrectOpt ? "border-[#3fb950]/50 bg-[#3fb950]/8 text-[#3fb950]" : ""}
                ${isWrongChosen ? "border-[#f85149]/50 bg-[#f85149]/8 text-[#f85149]" : ""}
                ${!submitted && isChosen ? "border-[#2f81f7]/50 bg-[#2f81f7]/8" : ""}
                ${!submitted && !isChosen ? "border-[#21262d] text-[#c9d1d9]" : ""}
                ${submitted && !isCorrectOpt && !isWrongChosen ? "border-[#21262d] text-[#6e7681]" : ""}
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
                  ${isCorrectOpt ? "border-[#3fb950]" : isWrongChosen ? "border-[#f85149]" : isChosen ? "border-[#2f81f7]" : "border-[#30363d]"}`}
              >
                {isChosen && !submitted && (
                  <span className="w-2 h-2 rounded-full bg-[#2f81f7]" />
                )}
                {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />}
                {isWrongChosen && <XCircle className="w-3.5 h-3.5 text-[#f85149]" />}
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
          className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-[#2f81f7] text-white hover:bg-[#388bfd] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          Submit Answer
        </button>
      )}

      {/* Feedback */}
      {submitted && (
        <div
          className={`mt-4 rounded-lg border p-3 text-sm ${
            isCorrect
              ? "border-[#3fb950]/30 bg-[#3fb950]/8 text-[#3fb950]"
              : "border-[#f85149]/30 bg-[#f85149]/8 text-[#f85149]"
          }`}
        >
          <p className="font-semibold mb-1">{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</p>
          {isWrong && wrongExplanation[selected] && (
            <p className="text-[#c9d1d9] mb-2">{wrongExplanation[selected]}</p>
          )}
          {explanation && <p className="text-[#c9d1d9]">{explanation}</p>}
        </div>
      )}
    </div>
  );
}
