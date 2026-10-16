/**
 * useCardSpotlight
 *
 * Attaches a radial white spotlight effect that follows the mouse inside
 * a card element. Updates CSS variables --mx and --my on the element.
 *
 * Disabled automatically for:
 *  - Touch devices (pointerType !== 'mouse')
 *  - prefers-reduced-motion media query
 *
 * Usage:
 *   const cardRef = useCardSpotlight();
 *   <div ref={cardRef} className="spotlight-card"> ... </div>
 *
 * Add to your CSS:
 *   .spotlight-card { position: relative; overflow: hidden; }
 *   .spotlight-card::before {
 *     content: '';
 *     position: absolute;
 *     inset: 0;
 *     pointer-events: none;
 *     background: radial-gradient(
 *       200px circle at var(--mx, -9999px) var(--my, -9999px),
 *       rgba(255,255,255,0.08) 0%,
 *       transparent 100%
 *     );
 *     border-radius: inherit;
 *     transition: opacity 200ms ease;
 *     opacity: 0;
 *     z-index: 0;
 *   }
 *   .spotlight-card:hover::before { opacity: 1; }
 */

import { useRef, useEffect } from "react";

export function useCardSpotlight() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const onPointerMove = (e) => {
      // Only run for mouse, not touch
      if (e.pointerType === "touch") return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onPointerLeave = () => {
      // Move spotlight off-screen so it disappears cleanly
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    };

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);

    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return ref;
}
