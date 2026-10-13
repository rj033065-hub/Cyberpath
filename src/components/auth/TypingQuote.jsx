import React, { useState, useEffect } from "react";

// Derive reduced motion preference outside component render to avoid setState-in-effect
function getPrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TypingQuote({
  quote = "Welcome Back! The journey continues.",
  author = "EaseMize UI",
}) {
  const prefersReducedMotion = getPrefersReducedMotion();

  // If reduced motion, start with full text already displayed
  const [displayedText, setDisplayedText] = useState(
    prefersReducedMotion ? quote : ""
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(quote);
      return;
    }

    setDisplayedText("");
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex <= quote.length) {
        setDisplayedText(quote.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 48);

    return () => clearInterval(interval);
  }, [quote, prefersReducedMotion]);

  return (
    <div className="w-full text-center px-6 z-20 flex flex-col items-center">
      <div className="relative inline-block max-w-xl">
        <h2 className="text-white font-semibold text-[22px] sm:text-[24px] lg:text-[25px] tracking-tight leading-relaxed select-none">
          <span>&ldquo;{displayedText}</span>
          <span
            className="inline-block text-zinc-300 ml-0.5 font-light animate-caret select-none"
            aria-hidden="true"
          >
            |
          </span>
          <span>&rdquo;</span>
        </h2>
      </div>

      {author && (
        <p className="text-zinc-500 text-xs sm:text-sm font-normal tracking-wide mt-2 select-none">
          &mdash; {author}
        </p>
      )}
    </div>
  );
}

export default TypingQuote;
