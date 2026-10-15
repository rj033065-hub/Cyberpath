import React, { useRef, useEffect } from "react";

// Hexagonal grid with drifting points.
const HexGridBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrame: number;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    const { width, height } = canvas;
    const hexSize = 30; // radius of hexagon
    const cols = Math.ceil(width / (hexSize * 1.5));
    const rows = Math.ceil(height / (hexSize * Math.sqrt(3)));
    const points: { x: number; y: number; offset: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * hexSize * 1.5 + (r % 2 === 0 ? 0 : hexSize * 0.75);
        const y = r * hexSize * Math.sqrt(3);
        points.push({ x, y, offset: Math.random() * Math.PI * 2 });
      }
    }

    const draw = () => {
      ctx.fillStyle = "rgba(9,9,11,0.6)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      ctx.lineWidth = 0.6;

      points.forEach(p => {
        const angle = Math.sin(p.offset + Date.now() * 0.0005);
        const dx = Math.cos(angle) * 0.4;
        const dy = Math.sin(angle) * 0.4;
        p.x += dx;
        p.y += dy;
        // wrap around edges
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.stroke();
      });
    };

    const loop = () => {
      draw();
      animationFrame = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      setSize();
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default HexGridBackground;
