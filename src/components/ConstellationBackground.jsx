import { useEffect, useRef, useCallback } from "react";

/**
 * ConstellationBackground
 *
 * A fixed, full-viewport HTML Canvas drawn behind all page content.
 * - position: fixed; inset: 0; z-index: -1; pointer-events: none
 * - Nodes drift slowly and wrap at viewport edges
 * - Lines connect nearby nodes, fading by distance
 * - Cursor attracts nearby nodes gently
 * - Handles devicePixelRatio, debounced resize, tab visibility pause
 * - Respects prefers-reduced-motion: static frame, no animation
 *
 * Props:
 *   density    {number}  Number of nodes to render (~70 desktop, ~30 mobile if not specified)
 *   opacity    {number}  Overall alpha multiplier for all drawing (0–1)
 *   interactive {boolean} Whether nodes are attracted by the cursor
 */
export function ConstellationBackground({
  density,
  opacity = 1,
  interactive = true,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef({
    nodes: [],
    mouse: { x: -9999, y: -9999 },
    width: 0,
    height: 0,
    dpr: 1,
    paused: false,
    reducedMotion: false,
    opacity,
    interactive,
  });

  // ─── Constants ────────────────────────────────────────────────
  const LINE_DISTANCE = 140;
  const CURSOR_DISTANCE = 200;
  const CURSOR_EASE = 0.012; // how fast nodes ease toward cursor
  const LINE_MAX_OPACITY = 0.12;
  const CURSOR_LINE_OPACITY = 0.18;
  const BRAND_WHITE = { r: 255, g: 255, b: 255 };

  // ─── Node factory ─────────────────────────────────────────────
  function createNode(w, h) {
    const r = 250;
    const g = 250;
    const b = 250;
    const size = 0.8 + Math.random() * 1.7; // 0.8 – 2.5 px

    return {
      x: Math.random() * w,
      y: Math.random() * h,
      ox: 0, // offset from drift position (cursor pull)
      oy: 0,
      vx: (Math.random() - 0.5) * 0.3, // -0.15 to +0.15 px/frame
      vy: (Math.random() - 0.5) * 0.3,
      size,
      r,
      g,
      b,
      glow: size > 1.8,
    };
  }

  function buildNodes(w, h, count) {
    const nodes = [];
    for (let i = 0; i < count; i++) {
      nodes.push(createNode(w, h));
    }
    return nodes;
  }

  // ─── Resize / init ────────────────────────────────────────────
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Resolve density
    const effectiveDensity =
      density !== undefined
        ? density
        : w < 768
        ? 30
        : 70;

    const state = stateRef.current;
    state.width = w;
    state.height = h;
    state.dpr = dpr;

    // Preserve existing nodes if canvas just resized (re-scatter out-of-bounds ones)
    if (state.nodes.length === 0) {
      state.nodes = buildNodes(w, h, effectiveDensity);
    } else {
      // Clamp existing nodes back in bounds and add/remove to match density
      state.nodes.forEach((n) => {
        if (n.x > w) n.x = Math.random() * w;
        if (n.y > h) n.y = Math.random() * h;
      });
      while (state.nodes.length < effectiveDensity) {
        state.nodes.push(createNode(w, h));
      }
      if (state.nodes.length > effectiveDensity) {
        state.nodes.length = effectiveDensity;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density]);

  // ─── Draw one frame ───────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const state = stateRef.current;
    const { width: w, height: h, nodes, mouse, reducedMotion } = state;
    const alpha = Math.max(0, Math.min(1, state.opacity));
    const isInteractive = state.interactive;

    ctx.clearRect(0, 0, w, h);

    if (!reducedMotion) {
      // ── Update node positions ──
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        // Wrap at edges
        if (n.x < -4) n.x = w + 4;
        if (n.x > w + 4) n.x = -4;
        if (n.y < -4) n.y = h + 4;
        if (n.y > h + 4) n.y = -4;

        // Cursor attraction
        if (isInteractive) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CURSOR_DISTANCE && dist > 0) {
            const pull = (1 - dist / CURSOR_DISTANCE) * CURSOR_EASE;
            n.ox += dx * pull;
            n.oy += dy * pull;
          }
          // Gradually release back
          n.ox *= 0.92;
          n.oy *= 0.92;
        }
      }
    }

    // ── Draw inter-node lines ──
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const ax = a.x + a.ox;
      const ay = a.y + a.oy;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const bx = b.x + b.ox;
        const by = b.y + b.oy;
        const dx = ax - bx;
        const dy = ay - by;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < LINE_DISTANCE) {
          const lineAlpha = (1 - dist / LINE_DISTANCE) * LINE_MAX_OPACITY * alpha;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(255,255,255,${lineAlpha * 0.75})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // ── Draw cursor lines (interactive only) ──
    if (isInteractive && mouse.x > -9000) {
      for (const n of nodes) {
        const nx = n.x + n.ox;
        const ny = n.y + n.oy;
        const dx = mouse.x - nx;
        const dy = mouse.y - ny;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CURSOR_DISTANCE) {
          const lineAlpha = (1 - dist / CURSOR_DISTANCE) * CURSOR_LINE_OPACITY * alpha;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(nx, ny);
          ctx.strokeStyle = `rgba(255,255,255,${lineAlpha * 0.8})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // ── Draw nodes ──
    for (const n of nodes) {
      const nx = n.x + n.ox;
      const ny = n.y + n.oy;
      const nodeAlpha = (0.35 + Math.random() * 0.1) * alpha; // subtle twinkle

      if (n.glow) {
        // Soft radial glow behind larger nodes
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, n.size * 3.5);
        gradient.addColorStop(0, `rgba(255,255,255,${nodeAlpha * 0.2})`);
        gradient.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(nx, ny, n.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(nx, ny, n.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${nodeAlpha * 0.9})`;
      ctx.fill();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Animation loop ───────────────────────────────────────────
  const loop = useCallback(() => {
    const state = stateRef.current;
    if (!state.paused) {
      draw();
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [draw]);

  // ─── Lifecycle ────────────────────────────────────────────────
  useEffect(() => {
    const state = stateRef.current;

    // Detect reduced motion preference
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    state.reducedMotion = mql.matches;

    // Listen for changes at runtime
    const onMotionChange = (e) => {
      state.reducedMotion = e.matches;
    };
    mql.addEventListener("change", onMotionChange);

    // Debounced resize handler
    let resizeTimer = null;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        init();
      }, 150);
    };

    // Mouse tracking
    const onMouseMove = (e) => {
      state.mouse.x = e.clientX;
      state.mouse.y = e.clientY;
    };

    // Pause when tab is hidden, resume on visibility
    const onVisibility = () => {
      state.paused = document.hidden;
    };

    init();

    // If reduced motion: draw one static frame then stop
    if (state.reducedMotion) {
      draw();
    } else {
      rafRef.current = requestAnimationFrame(loop);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      mql.removeEventListener("change", onMotionChange);
      clearTimeout(resizeTimer);
    };
  }, [init, draw, loop]);

  // Keep stateRef in sync with prop changes without re-mounting
  useEffect(() => {
    stateRef.current.opacity = opacity;
    stateRef.current.interactive = interactive;
  }, [opacity, interactive]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

export default ConstellationBackground;
