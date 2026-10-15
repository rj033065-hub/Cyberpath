import React, { useRef, useEffect } from "react";

// Small radar sweep animation for empty‑state illustrations.
const RadarScan: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrame: number;
    const size = 80; // fixed size for empty‑state icons
    canvas.width = size;
    canvas.height = size;

    const draw = (angle: number) => {
      ctx.clearRect(0, 0, size, size);
      // background circle
      ctx.fillStyle = "rgba(16,16,18,0.5)"; // dark surface
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      // radar sweep
      const sweepAngle = angle % (Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, "rgba(255,255,255,0.0)");
      gradient.addColorStop(0.2, "rgba(255,255,255,0.1)");
      gradient.addColorStop(0.4, "rgba(255,255,255,0.25)");
      gradient.addColorStop(1, "rgba(255,255,255,0.0)");
      ctx.fillStyle = gradient;
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(sweepAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, size / 2, 0, Math.PI / 4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      // outer ring
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.stroke();
    };

    let start = performance.now();
    const loop = (now: number) => {
      const elapsed = now - start;
      const angle = (elapsed * 0.001) % (Math.PI * 2);
      draw(angle);
      animationFrame = requestAnimationFrame(loop);
    };
    loop(start);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="inline-block w-12 h-12 pointer-events-none"
      aria-label="Radar scan animation"
    />
  );
};

export default RadarScan;
