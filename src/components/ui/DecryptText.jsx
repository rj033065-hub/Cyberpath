/**
 * DecryptText — A "decrypt / scramble-reveal" text animation component.
 *
 * Props:
 *   text           – the final string to display
 *   className       – applied to the outer wrapper
 *   speed           – ms per scramble frame (default 40)
 *   revealDelay     – ms before animation starts after entering viewport (default 200)
 *   stagger         – ms between each character's lock-in (default 35)
 *   characters      – scramble charset
 *   once            – run only once per mount (default true)
 *   replay          – re-run scramble on hover (default false)
 *   caret           – show blinking green caret after done (default false)
 *   onComplete      – callback when all characters are resolved
 *   glowColor       – CSS color for brief glow on resolved char
 *   resolvedColor   – final CSS color for resolved characters (inherits if omitted)
 *   useGradient     – if true, resolved chars inherit parent bg-clip-text gradient
 */

import { useState, useEffect, useRef } from "react";

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#/$%&*+=?[]{}~_|";

const PUNCTUATION = new Set([" ", ".", ",", ":", ";", "!", "?"]);

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function DecryptText({
  text = "",
  className = "",
  speed = 40,
  revealDelay = 200,
  stagger = 35,
  characters = DEFAULT_CHARS,
  once = true,
  replay = false,
  caret = false,
  onComplete,
  glowColor = "rgba(47,123,255,0.6)",
  resolvedColor,
  useGradient = false,
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const resolveTimesRef = useRef(null);
  const charArrRef = useRef(characters.split(""));

  const [phase, setPhase] = useState("idle"); // idle | animating | done
  const [displayChars, setDisplayChars] = useState(() => text.split(""));
  const [resolvedSet, setResolvedSet] = useState(() => new Set());
  const [glowingSet, setGlowingSet] = useState(() => new Set());

  // Precompute per-character resolve times
  function computeResolveTimes() {
    return text.split("").map((ch, i) => {
      if (PUNCTUATION.has(ch)) return 0;
      return revealDelay + i * stagger + Math.random() * stagger * 0.6;
    });
  }

  function startAnimation() {
    const times = computeResolveTimes();
    resolveTimesRef.current = times;
    startTimeRef.current = performance.now();

    // Reset display to scrambled
    setDisplayChars(
      text.split("").map((ch) =>
        PUNCTUATION.has(ch) ? ch : charArrRef.current[Math.floor(Math.random() * charArrRef.current.length)]
      )
    );
    setResolvedSet(new Set());
    setGlowingSet(new Set());
    setPhase("animating");
  }

  // Main animation loop
  useEffect(() => {
    if (phase !== "animating") return;

    let lastFrame = 0;
    const chars = text.split("");
    const charArr = charArrRef.current;
    const resolveTimes = resolveTimesRef.current;
    const startTime = startTimeRef.current;

    const tick = (now) => {
      if (now - lastFrame < speed) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;

      const elapsed = now - startTime;
      const newDisplay = [];
      const newResolved = new Set();
      const newGlowing = new Set();
      let allDone = true;

      for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        if (PUNCTUATION.has(ch)) {
          newDisplay.push(ch);
          newResolved.add(i);
          continue;
        }

        const resolveAt = resolveTimes[i];
        if (elapsed >= resolveAt) {
          newDisplay.push(ch);
          newResolved.add(i);
          // Glow for 400ms after resolve
          if (elapsed < resolveAt + 400) {
            newGlowing.add(i);
            allDone = false;
          }
        } else {
          allDone = false;
          newDisplay.push(charArr[Math.floor(Math.random() * charArr.length)]);
        }
      }

      setDisplayChars(newDisplay);
      setResolvedSet(newResolved);
      setGlowingSet(newGlowing);

      if (allDone) {
        setPhase("done");
        onComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase]); // Only depends on phase transitions

  // IntersectionObserver to trigger animation
  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplayChars(text.split(""));
      setResolvedSet(new Set(text.split("").map((_, i) => i)));
      setGlowingSet(new Set());
      setPhase("done");
      return;
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase((current) => {
            if (current === "idle") {
              // Schedule start on next microtask to avoid state conflicts
              setTimeout(() => startAnimation(), 0);
              return current; // startAnimation will set it to "animating"
            }
            if (current === "done" && !once) {
              setTimeout(() => startAnimation(), 0);
            }
            return current;
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // Mount-only

  // Hover replay
  const handleMouseEnter = () => {
    if (!replay || phase !== "done") return;
    startAnimation();
  };

  return (
    <span
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{ display: "inline" }}
    >
      {/* Screen-reader accessible real text */}
      <span className="sr-only">{text}</span>

      {/* Animated characters — grouped by word for natural line-wrapping */}
      <span aria-hidden="true" style={{ display: "inline" }}>
        {(() => {
          // Split into words and spaces, preserving indices
          const words = [];
          let currentWord = [];
          for (let i = 0; i < displayChars.length; i++) {
            if (text[i] === " ") {
              if (currentWord.length > 0) {
                words.push({ type: "word", chars: currentWord });
                currentWord = [];
              }
              words.push({ type: "space", index: i, ch: displayChars[i] });
            } else {
              currentWord.push({ index: i, ch: displayChars[i] });
            }
          }
          if (currentWord.length > 0) {
            words.push({ type: "word", chars: currentWord });
          }

          return words.map((word, wi) => {
            if (word.type === "space") {
              return (
                <span key={`s-${wi}`} style={{ display: "inline" }}>
                  {" "}
                </span>
              );
            }

            return (
              <span
                key={`w-${wi}`}
                style={{ display: "inline-block", whiteSpace: "nowrap" }}
              >
                {word.chars.map(({ index: i, ch }) => {
                  const isResolved = resolvedSet.has(i);
                  const isGlowing = glowingSet.has(i);
                  const isPunct = PUNCTUATION.has(text[i]);

                  let charColor;
                  let extraStyle = {};

                  if (isPunct) {
                    charColor = resolvedColor || "inherit";
                  } else if (isResolved) {
                    if (useGradient) {
                      charColor = "transparent";
                      extraStyle = {
                        background: "inherit",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                      };
                    } else {
                      charColor = resolvedColor || "inherit";
                    }
                  } else {
                    charColor = "rgba(100, 130, 170, 0.55)";
                    if (useGradient) {
                      extraStyle = {
                        background: "none",
                        WebkitBackgroundClip: "unset",
                        backgroundClip: "unset",
                      };
                    }
                  }

                  const style = {
                    transition: "color 0.4s ease, text-shadow 0.4s ease",
                    color: charColor,
                    textShadow: isGlowing
                      ? `0 0 12px ${glowColor}, 0 0 4px ${glowColor}`
                      : "none",
                    ...extraStyle,
                  };

                  return (
                    <span key={i} style={style}>
                      {ch}
                    </span>
                  );
                })}
              </span>
            );
          });
        })()}
      </span>

      {/* Optional blinking caret */}
      {caret && phase === "done" && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "2px",
            height: "1em",
            backgroundColor: "#3fb950",
            marginLeft: "4px",
            verticalAlign: "text-bottom",
            animation: "blink-caret 1s step-end infinite",
          }}
        />
      )}

      {caret && (
        <style>{`
          @keyframes blink-caret {
            50% { opacity: 0; }
          }
        `}</style>
      )}
    </span>
  );
}
