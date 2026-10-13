import React, { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { AstronautIllustration } from "./AstronautIllustration";

export interface DashboardBackdropProps {
  /** Optional manual override of opacity */
  overrideOpacity?: number;
  /** Optional class name */
  className?: string;
}

/**
 * Calculates visibility and opacity for the astronaut backdrop based on pathname and hash.
 *
 * Rules:
 * - Login, Signup, Auth routes: NOT shown (hidden/null)
 * - Lab and CTF challenge routes: NOT shown
 * - Dashboard: opacity ~0.15
 * - Learning paths, roadmap, achievements, resources, profile: lower opacity ~0.10
 */
export function getBackdropConfig(pathname: string, hash: string = ""): {
  visible: boolean;
  opacity: number;
} {
  const p = pathname.toLowerCase();
  const h = hash.toLowerCase();

  // Strict rule: Exclude /login, /signup, auth routes
  if (
    p === "/login" ||
    p === "/signup" ||
    p === "/forgot-password" ||
    p === "/reset-password" ||
    p.startsWith("/auth")
  ) {
    return { visible: false, opacity: 0 };
  }

  // Strict rule: Lab and CTF challenge routes/sections - clean & distraction-free
  if (
    p.includes("/lab") ||
    p.includes("/challenge") ||
    p.includes("/ctf") ||
    h === "#labs" ||
    h === "#ctf" ||
    h === "#challenges"
  ) {
    return { visible: false, opacity: 0 };
  }

  // Dashboard route: show it (opacity ~0.15)
  if (p === "/dashboard") {
    return { visible: true, opacity: 0.15 };
  }

  // Learning paths, roadmap, achievements, resources, profile: show it at lower opacity (~0.10)
  if (
    p === "/" ||
    p.startsWith("/paths") ||
    p.startsWith("/learning-paths") ||
    p.startsWith("/roadmap") ||
    p.startsWith("/achievements") ||
    p.startsWith("/resources") ||
    p.startsWith("/profile")
  ) {
    return { visible: true, opacity: 0.10 };
  }

  // Default fallback for general student pages
  return { visible: true, opacity: 0.10 };
}

/**
 * DashboardBackdrop
 *
 * A fixed, bottom-right ambient illustration layer that sits in the background of
 * the CyberPath dashboard and app pages as a subtle, high-tech watermark.
 *
 * Features:
 * - Positioned bottom-right (right: 2%, bottom: 0), width ~420px on desktop
 * - pointer-events: none, z-index below page content (shows in empty gaps)
 * - Soft dark gradient mask (fades to transparent toward top and left)
 * - Hidden below 1024px (mobile and tablet) to keep pages fast and clean
 * - Respects prefers-reduced-motion (renders static, no parallax/loop)
 * - Automatically pauses animations when browser tab is hidden
 * - Slight subtle cursor parallax (max 10px shift), disabled on touch devices
 * - Route-aware: mounts once in shared layout, updates opacity smoothly without unmounting
 */
export const DashboardBackdrop: React.FC<DashboardBackdropProps> = ({
  overrideOpacity,
  className = "",
}) => {
  const location = useLocation();
  const [isTabHidden, setIsTabHidden] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 });

  const animFrameRef = useRef<number | null>(null);
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const currentOffsetRef = useRef({ x: 0, y: 0 });

  // Compute route-based visibility & opacity
  const routeConfig = useMemo(() => {
    return getBackdropConfig(location.pathname, location.hash);
  }, [location.pathname, location.hash]);

  const targetOpacity = overrideOpacity !== undefined ? overrideOpacity : routeConfig.opacity;
  const isVisible = routeConfig.visible && targetOpacity > 0;

  // 1. Detect prefers-reduced-motion & fine pointer capabilities
  useEffect(() => {
    if (typeof window === "undefined") return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const pointerQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(pointerQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    const handlePointerChange = (e: MediaQueryListEvent) => {
      setIsFinePointer(e.matches);
    };

    motionQuery.addEventListener("change", handleMotionChange);
    pointerQuery.addEventListener("change", handlePointerChange);

    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      pointerQuery.removeEventListener("change", handlePointerChange);
    };
  }, []);

  // 2. Tab visibility detection (pause animations when hidden)
  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsTabHidden(document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 3. Subtle Parallax effect towards cursor (max 10px shift, fine pointer only)
  useEffect(() => {
    if (!isVisible || prefersReducedMotion || !isFinePointer || isTabHidden) {
      setParallaxOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth === 0 || innerHeight === 0) return;

      // Normalized coordinates from center: -1 to +1
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;

      // Max 10px shift
      targetOffsetRef.current = {
        x: normX * 10,
        y: normY * 10,
      };
    };

    // Smooth lerp RAF loop
    let isActive = true;
    const lerp = () => {
      if (!isActive) return;

      const current = currentOffsetRef.current;
      const target = targetOffsetRef.current;

      const nextX = current.x + (target.x - current.x) * 0.08;
      const nextY = current.y + (target.y - current.y) * 0.08;

      currentOffsetRef.current = { x: nextX, y: nextY };
      setParallaxOffset({
        x: Math.round(nextX * 100) / 100,
        y: Math.round(nextY * 100) / 100,
      });

      animFrameRef.current = requestAnimationFrame(lerp);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    animFrameRef.current = requestAnimationFrame(lerp);

    return () => {
      isActive = false;
      window.removeEventListener("mousemove", handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isVisible, prefersReducedMotion, isFinePointer, isTabHidden]);

  // If excluded route, do not render into DOM
  if (!isVisible) {
    return null;
  }

  return (
    <aside
      aria-hidden="true"
      className={`hidden lg:block fixed pointer-events-none select-none ${className}`}
      style={{
        right: "2%",
        bottom: "0px",
        width: "420px",
        height: "420px",
        zIndex: 1,
        opacity: targetOpacity,
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        // Soft dark gradient mask: fades to transparent towards top and left
        WebkitMaskImage:
          "linear-gradient(to top left, rgba(0, 0, 0, 1) 32%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0) 88%)",
        maskImage:
          "linear-gradient(to top left, rgba(0, 0, 0, 1) 32%, rgba(0, 0, 0, 0.65) 60%, rgba(0, 0, 0, 0) 88%)",
        transform:
          prefersReducedMotion || !isFinePointer
            ? "translate3d(0, 0, 0)"
            : `translate3d(${parallaxOffset.x}px, ${parallaxOffset.y}px, 0)`,
        willChange: prefersReducedMotion ? "auto" : "transform, opacity",
      }}
    >
      <AstronautIllustration isPaused={isTabHidden || prefersReducedMotion} />
    </aside>
  );
};

export default DashboardBackdrop;
