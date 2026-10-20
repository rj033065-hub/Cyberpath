// components/ui/scroll-locked-video-hero.tsx
"use client"

import { useEffect, useRef, useState } from "react"

// ─────────────────────────────────────────────────────────────
// ROOTCOMPASS — short scroll‑scrubbed intro (first visit only)
// Updated to fix body lock release, add keyboard support, and match theme.
// ─────────────────────────────────────────────────────────────

export interface ScrollIntroHeroProps {
  /** Local video in /public. Compress to ~720p, under 3 MB, muted. */
  videoSrc?: string
  /** Poster image in /public shown until the video is ready. */
  posterSrc?: string
  title?: string
  tagline?: string
  scrollHint?: string
  /** Total input distance (px) needed to scrub the whole intro. */
  scrubDistance?: number
  /** localStorage key used to remember that the intro was seen. */
  storageKey?: string
  /** Show even if already seen, or on mobile / reduced motion. */
  forceShow?: boolean
  /** Called once the overlay has finished fading out. */
  onComplete?: () => void
}

const SANS = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
const COL_BG = "#09090b"
const COL_TEXT = "#fafafa"
const FADE_MS = 400

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

function shouldShowIntro(storageKey: string, forceShow?: boolean): boolean {
  if (typeof window === "undefined") return false
  try {
    if (forceShow || new URLSearchParams(window.location.search).get("intro") === "1") {
      return true
    }
  } catch {}
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return false
  if (window.matchMedia?.("(max-width: 767px)").matches) return false
  try {
    if (window.localStorage.getItem(storageKey)) return false
  } catch {}
  return true
}

export default function ScrollIntroHero({
  videoSrc = "/intro.mp4",
  posterSrc = "/intro-poster.jpg",
  title = "ROOTCOMPASS",
  tagline = "Find your way to root.",
  scrollHint = "SCROLL",
  scrubDistance = 1500,
  storageKey = "rootcompass-intro-seen",
  forceShow = false,
  onComplete,
}: ScrollIntroHeroProps) {
  const [visible, setVisible] = useState(() => shouldShowIntro(storageKey, forceShow))
  const [leaving, setLeaving] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const finishRef = useRef<() => void>(() => {})
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!visible) return
    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    html.style.overflow = "hidden"
    body.style.overflow = "hidden"
    let unlocked = false
    const releaseLock = () => {
      if (unlocked) return
      unlocked = true
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
    }

    const video = videoRef.current
    let duration = 0
    let rafId = 0
    let fadeTimer = 0
    let targetProgress = 0
    let currentProgress = 0
    let hasStartedScrolling = false
    let isSeeking = false
    let pendingTime: number | null = null
    let touchStartY = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      try { window.localStorage.setItem(storageKey, "1") } catch {}
      releaseLock()
      cancelAnimationFrame(rafId)
      setLeaving(true)
      fadeTimer = window.setTimeout(() => {
        setVisible(false)
        onCompleteRef.current?.()
      }, FADE_MS + 20)
    }
    finishRef.current = finish

    const onLoadedData = () => { duration = video?.duration || 0 }
    const onSeeked = () => {
      isSeeking = false
      if (pendingTime !== null && video) {
        const t = pendingTime
        pendingTime = null
        isSeeking = true
        video.currentTime = t
      }
    }
    const seekTo = (t: number) => {
      if (!video) return
      if (isSeeking) { pendingTime = t; return }
      isSeeking = true
      video.currentTime = t
    }

    if (video) {
      video.addEventListener("loadeddata", onLoadedData)
      video.addEventListener("seeked", onSeeked)
      const p = video.play()
      if (p && typeof (p as any).then === "function") {
        ;(p as Promise<void>).then(() => video.pause()).catch(() => {})
      } else {
        video.pause()
      }
    }

    const addDelta = (deltaY: number) => {
      targetProgress = clamp(targetProgress + deltaY / scrubDistance, 0, 1)
      if (targetProgress > 0.001) hasStartedScrolling = true
    }

    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY
      addDelta(dy)
      e.preventDefault()
    }
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0]?.clientY ?? 0 }
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchStartY
      addDelta(touchStartY - y)
      touchStartY = y
      e.preventDefault()
    }
    const onKeyDown = (e: KeyboardEvent) => {
      const step = scrubDistance * 0.08
      const onButton = e.target instanceof HTMLButtonElement
      switch (e.key) {
        case "Escape":
          finish()
          break
        case "ArrowDown":
        case "PageDown":
          addDelta(step); e.preventDefault(); break
        case " ":
          if (onButton) return
          addDelta(step); e.preventDefault(); break
        case "ArrowUp":
        case "PageUp":
          addDelta(-step); e.preventDefault(); break
        case "End":
          targetProgress = 1; hasStartedScrolling = true; e.preventDefault(); break
        case "Home":
          targetProgress = 0; e.preventDefault(); break
      }
    }

    window.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("touchstart", onTouchStart, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: false })
    window.addEventListener("keydown", onKeyDown)

    const frame = () => {
      currentProgress += (targetProgress - currentProgress) * 0.18
      if (duration > 0) seekTo(currentProgress * duration)
      if (videoRef.current) videoRef.current.style.transform = `scale(${1 + currentProgress * 0.06})`
      if (titleRef.current) {
        const t = 1 - clamp(currentProgress / 0.35, 0, 1)
        titleRef.current.style.opacity = String(t)
        titleRef.current.style.transform = `translateY(${(1 - t) * -24}px) scale(${0.96 + t * 0.04})`
        titleRef.current.style.filter = `blur(${(1 - t) * 10}px)`
      }
      if (hintRef.current) hintRef.current.style.opacity = hasStartedScrolling ? "0" : "1"
      if (taglineRef.current) {
        const t = clamp((currentProgress - 0.7) / 0.25, 0, 1)
        taglineRef.current.style.opacity = String(t)
        taglineRef.current.style.transform = `translateY(${(1 - t) * 20}px) scale(${0.97 + t * 0.03})`
        taglineRef.current.style.filter = `blur(${(1 - t) * 8}px)`
      }
      if (progressBarRef.current) progressBarRef.current.style.transform = `scaleX(${currentProgress})`
      if (targetProgress >= 1 && currentProgress > 0.995) { finish(); return }
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.clearTimeout(fadeTimer)
      window.removeEventListener("wheel", onWheel)
      window.removeEventListener("touchstart", onTouchStart)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("keydown", onKeyDown)
      if (video) {
        video.removeEventListener("loadeddata", onLoadedData)
        video.removeEventListener("seeked", onSeeked)
      }
      releaseLock()
    }
  }, [visible, scrubDistance, storageKey])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Intro animation"
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
        @keyframes rc-intro-bounce {0%,100%{transform:translateY(0);opacity:0.5}50%{transform:translateY(5px);opacity:1}}
        .rc-intro-skip{transition:background 0.2s ease,border-color 0.2s ease}
        .rc-intro-skip:hover{background:rgba(250,250,250,0.1);border-color:rgba(250,250,250,0.4)}
        .rc-intro-skip:focus-visible{outline:2px solid ${COL_TEXT};outline-offset:3px}
        @media (prefers-reduced-motion:reduce){.rc-intro-bounce{animation:none !important}}
      `}</style>

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

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,rgba(9,9,11,0.4),rgba(9,9,11,0) 30%,rgba(9,9,11,0.2) 70%,rgba(9,9,11,0.7))",
          pointerEvents: "none",
        }}
      />

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
            fontSize: "clamp(30px,7vw,96px)",
            lineHeight: 1,
            letterSpacing: "-0.02em",
            color: COL_TEXT,
            textShadow: "0 4px 30px rgba(0,0,0,0.5)",
            display: "inline-block",
            willChange: "transform,filter,opacity",
          }}
        >
          {title}
        </span>
      </div>

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
              fontSize: "clamp(20px,3.4vw,40px)",
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              color: COL_TEXT,
              textShadow: "0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            {tagline}
          </span>
        </div>
      )}

      <button
        type="button"
        className="rc-intro-skip"
        onClick={() => finishRef.current()}
        style={{
          position: "absolute",
          top: "clamp(14px,3vh,28px)",
          right: "clamp(14px,3vw,32px)",
          zIndex: 3,
          padding: "8px 16px",
          borderRadius: 999,
          border: "1px solid rgba(250,250,250,0.2)",
          background: "rgba(9,9,11,0.5)",
          color: COL_TEXT,
          fontFamily: SANS,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
        }}
      >
        Skip intro
      </button>

      <div
        ref={hintRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "clamp(20px,6vh,48px)",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "rgba(250,250,250,0.75)",
          fontFamily: SANS,
          fontSize: "clamp(10px,1.4vw,12px)",
          fontWeight: 600,
          letterSpacing: "0.3em",
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        <span>{scrollHint}</span>
        <svg
          className="rc-intro-bounce"
          width="14"
          height="18"
          viewBox="0 0 14 18"
          aria-hidden="true"
          style={{ animation: "rc-intro-bounce 1.6s ease-in-out infinite" }}
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

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "rgba(255,255,255,0.12)",
        }}
      >
        <div
          ref={progressBarRef}
          style={{
            height: "100%",
            width: "100%",
            background: COL_TEXT,
            transform: "scaleX(0)",
            transformOrigin: "left center",
          }}
        />
      </div>
    </div>
  )
}
