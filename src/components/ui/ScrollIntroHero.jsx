import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────
// CYBERPATH — scroll-scrubbed intro (first visit only)
//
// - Covers the landing page with a full-screen overlay.
// - Wheel / touch / keyboard input scrubs the animation forward/back.
// - When scrub reaches 100% (or visitor clicks "Skip" / presses Escape)
//   the overlay fades out and page scrolls normally.
// - Shown once per visitor via localStorage.
// - Add ?intro=1 to the URL to replay while testing.
// - Automatically skipped on mobile (< 768 px) and reduced-motion.
// - If /intro.mp4 is missing it works as a pure text reveal — nothing breaks.
// ─────────────────────────────────────────────────────────────

const SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const COL_BG = "#09090b";
const COL_TEXT = "#fafafa";
const FADE_MS = 400;

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function shouldShowIntro(storageKey, forceShow) {
  if (typeof window === "undefined") return false;
  try {
    if (
      forceShow ||
      new URLSearchParams(window.location.search).get("intro") === "1"
    ) {
      return true;
    }
  } catch {
    /* ignore */
  }
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }
  if (window.matchMedia?.("(max-width: 767px)").matches) return false;
  try {
    if (window.localStorage.getItem(storageKey)) return false;
  } catch {
    /* storage blocked — show the intro, it still releases at the end */
  }
  return true;
}

export default function ScrollIntroHero({
  videoSrc = "/intro.mp4",
  posterSrc = "/intro-poster.jpg",
  title = "CYBERPATH",
  tagline = "Find your path. Build your skills.",
  scrollHint = "SCROLL",
  scrubDistance = 1500,
  storageKey = "cyberpath-intro-seen",
  forceShow = false,
  onComplete,
}) {
  const [visible, setVisible] = useState(() =>
    shouldShowIntro(storageKey, forceShow)
  );
  const [leaving, setLeaving] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const titleRef = useRef(null);
  const hintRef = useRef(null);
  const taglineRef = useRef(null);
  const progressBarRef = useRef(null);
  const finishRef = useRef(() => {});
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!visible) return;
    const root = rootRef.current;
    if (!root) return;

    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    let unlocked = false;
    const unlock = () => {
      if (unlocked) return;
      unlocked = true;
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };

    const video = videoRef.current;
    let duration = 0;
    let rafId = 0;
    let fadeTimer = 0;
    let targetProgress = 0;
    let currentProgress = 0;
    let hasStartedScrolling = false;
    let isSeeking = false;
    let pendingTime = null;
    let touchStartY = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      try {
        window.localStorage.setItem(storageKey, "1");
      } catch {
        /* ignore */
      }
      unlock();
      cancelAnimationFrame(rafId);
      setLeaving(true);
      fadeTimer = window.setTimeout(() => {
        setVisible(false);
        onCompleteRef.current?.();
      }, FADE_MS + 20);
    };
    finishRef.current = finish;

    const onLoadedData = () => {
      duration = video?.duration || 0;
    };
    const onSeeked = () => {
      isSeeking = false;
      if (pendingTime !== null && video) {
        const t = pendingTime;
        pendingTime = null;
        isSeeking = true;
        video.currentTime = t;
      }
    };
    const seekTo = (t) => {
      if (!video) return;
      if (isSeeking) { pendingTime = t; return; }
      isSeeking = true;
      video.currentTime = t;
    };

    if (video) {
      video.addEventListener("loadeddata", onLoadedData);
      video.addEventListener("seeked", onSeeked);
      const p = video.play();
      if (p && typeof p.then === "function") {
        p.then(() => video.pause()).catch(() => {});
      } else {
        video.pause();
      }
    }

    const addDelta = (deltaY) => {
      targetProgress = clamp(targetProgress + deltaY / scrubDistance, 0, 1);
      if (targetProgress > 0.001) hasStartedScrolling = true;
    };

    const onWheel = (e) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      addDelta(dy);
      e.preventDefault();
    };
    const onTouchStart = (e) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e) => {
      const y = e.touches[0]?.clientY ?? touchStartY;
      addDelta(touchStartY - y);
      touchStartY = y;
      e.preventDefault();
    };
    const onKeyDown = (e) => {
      const step = scrubDistance * 0.08;
      const onButton = e.target instanceof HTMLButtonElement;
      switch (e.key) {
        case "Escape": finish(); break;
        case "ArrowDown":
        case "PageDown": addDelta(step); e.preventDefault(); break;
        case " ":
          if (onButton) return;
          addDelta(step); e.preventDefault(); break;
        case "ArrowUp":
        case "PageUp": addDelta(-step); e.preventDefault(); break;
        case "End":
          targetProgress = 1; hasStartedScrolling = true; e.preventDefault(); break;
        case "Home": targetProgress = 0; e.preventDefault(); break;
        default: break;
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    const frame = () => {
      currentProgress += (targetProgress - currentProgress) * 0.18;

      if (duration > 0) seekTo(currentProgress * duration);

      if (videoRef.current) {
        videoRef.current.style.transform = `scale(${1 + currentProgress * 0.06})`;
      }
      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.35, 0, 1);
        titleRef.current.style.opacity = String(t);
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`;
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`;
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1";
      }
      if (taglineRef.current) {
        const t = clamp((currentProgress - 0.7) / 0.25, 0, 1);
        taglineRef.current.style.opacity = String(t);
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`;
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${currentProgress})`;
      }

      if (targetProgress >= 1 && currentProgress > 0.995) {
        finish();
        return;
      }
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(fadeTimer);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      if (video) {
        video.removeEventListener("loadeddata", onLoadedData);
        video.removeEventListener("seeked", onSeeked);
      }
      unlock();
    };
  }, [visible, scrubDistance, storageKey]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="CyberPath intro animation"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        height: "100dvh",
        width: "100%",
        overflow: "hidden",
        background: COL_BG,
        touchAction: "none",
        opacity: leaving ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
        pointerEvents: leaving ? "none" : "auto",
      }}
    >
      <style>{`
        @keyframes cp-intro-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50%       { transform: translateY(5px); opacity: 1; }
        }
        @keyframes cp-intro-scan {
          0%   { background-position: 0 0; }
          100% { background-position: 0 200px; }
        }
        .cp-intro-skip {
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .cp-intro-skip:hover {
          background: rgba(250, 250, 250, 0.1) !important;
          border-color: rgba(250, 250, 250, 0.4) !important;
        }
        .cp-intro-skip:focus-visible {
          outline: 2px solid #fafafa;
          outline-offset: 3px;
        }
        @media (prefers-reduced-motion: reduce) {
          .cp-intro-bounce { animation: none !important; }
        }
      `}</style>

      {/* Video layer */}
      {!videoFailed && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          onError={() => setVideoFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "grayscale(1) contrast(1.1)",
            transformOrigin: "center center",
            willChange: "transform",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Fallback grid background (when no video) */}
      {videoFailed && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            animation: "cp-intro-scan 8s linear infinite",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Vignette */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(9,9,11,0.5), rgba(9,9,11,0) 30%, rgba(9,9,11,0.25) 70%, rgba(9,9,11,0.75))",
          pointerEvents: "none",
        }}
      />

      {/* Wordmark badge */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "clamp(14px, 3vh, 28px)",
          left: "clamp(14px, 3vw, 32px)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: 13,
            letterSpacing: "0.06em",
            color: "rgba(250,250,250,0.7)",
          }}
        >
          Cyber<span style={{ color: "#60a5fa" }}>Path</span>
        </span>
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
          }}
        />
      </div>

      {/* Title */}
      <div
        ref={titleRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 6%",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: SANS,
            fontWeight: 800,
            fontSize: "clamp(30px, 7vw, 96px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: COL_TEXT,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            display: "inline-block",
            willChange: "transform, filter, opacity",
          }}
        >
          {title}
        </span>
      </div>

      {/* Tagline */}
      {tagline && (
        <div
          ref={taglineRef}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 8%",
            textAlign: "center",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              fontFamily: SANS,
              fontWeight: 700,
              fontSize: "clamp(18px, 3vw, 38px)",
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      {/* Skip button */}
      <button
        type="button"
        id="cp-intro-skip-btn"
        className="cp-intro-skip"
        onClick={() => finishRef.current()}
        style={{
          position: "absolute",
          top: "clamp(14px, 3vh, 28px)",
          right: "clamp(14px, 3vw, 32px)",
          zIndex: 3,
          padding: "8px 18px",
          borderRadius: 999,
          border: "1px solid rgba(250,250,250,0.2)",
          background: "rgba(9,9,11,0.5)",
          color: COL_TEXT,
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.05em",
          cursor: "pointer",
          backdropFilter: "blur(8px)",
        }}
      >
        Skip intro
      </button>

      {/* Scroll hint */}
      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px, 6vh, 52px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "rgba(250,250,250,0.75)",
          fontFamily: SANS,
          fontSize: "clamp(10px, 1.2vw, 11px)",
          fontWeight: 600,
          letterSpacing: "0.35em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg
          className="cp-intro-bounce"
          width="14"
          height="18"
          viewBox="0 0 14 18"
          aria-hidden="true"
          style={{ animation: "cp-intro-bounce 1.6s ease-in-out infinite" }}
        >
          <path
            d="M7 1 L7 17 M2 12 L7 17 L12 12"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Progress bar */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(255,255,255,0.1)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: "linear-gradient(90deg, #60a5fa, #a78bfa, #fafafa)",
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  );
}
