/**
 * useAnimatedNumber
 *
 * Counts a number from 0 to `target` over `duration` ms using an
 * IntersectionObserver to trigger only when the element enters the viewport.
 * Runs once per page view (resets on component mount, not on re-intersection).
 *
 * Respects prefers-reduced-motion (snaps instantly if reduced motion is set).
 *
 * Usage:
 *   const [displayValue, countRef] = useAnimatedNumber(42, 800);
 *   <span ref={countRef}>{displayValue}</span>
 */

import { useState, useRef, useEffect } from "react";

export function useAnimatedNumber(target, duration = 800) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const run = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      if (motionQuery.matches) {
        setValue(target);
        return;
      }

      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [value, ref];
}

/**
 * useAnimatedBar
 *
 * Returns [widthPercent, ref] where widthPercent animates from 0 → target
 * when the ref element enters the viewport.
 *
 * Usage:
 *   const [width, barRef] = useAnimatedBar(75, 800);
 *   <div ref={barRef} style={{ width: `${width}%` }} />
 */
export function useAnimatedBar(target, duration = 800) {
  const [width, setWidth] = useState(0);
  const ref = useRef(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const run = () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;

      if (motionQuery.matches) {
        setWidth(target);
        return;
      }

      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setWidth(eased * target);
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          run();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return [width, ref];
}
