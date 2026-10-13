import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function AuthIllustration() {
  const shouldReduceMotion = useReducedMotion();

  // Generate deterministic stars with subtle twinkling
  const stars = useMemo(() => {
    return [
      { x: 50, y: 80, r: 1.5, delay: 0.2, duration: 2.5 },
      { x: 120, y: 140, r: 1.2, delay: 0.8, duration: 3.2 },
      { x: 80, y: 220, r: 2.0, delay: 1.4, duration: 2.8 },
      { x: 160, y: 70, r: 1.0, delay: 0.5, duration: 3.6 },
      { x: 220, y: 120, r: 1.8, delay: 1.8, duration: 3.0 },
      { x: 290, y: 60, r: 1.3, delay: 2.1, duration: 2.4 },
      { x: 380, y: 80, r: 2.2, delay: 0.4, duration: 3.5 },
      { x: 450, y: 130, r: 1.4, delay: 1.1, duration: 2.7 },
      { x: 520, y: 90, r: 1.8, delay: 1.9, duration: 3.3 },
      { x: 560, y: 180, r: 1.2, delay: 0.7, duration: 2.9 },
      { x: 510, y: 250, r: 1.6, delay: 2.3, duration: 3.1 },
      { x: 440, y: 220, r: 1.1, delay: 1.0, duration: 3.8 },
      { x: 90, y: 350, r: 1.4, delay: 1.3, duration: 2.6 },
      { x: 540, y: 340, r: 1.7, delay: 0.6, duration: 3.4 },
      { x: 140, y: 440, r: 1.2, delay: 2.0, duration: 2.9 },
      { x: 510, y: 430, r: 1.5, delay: 1.5, duration: 3.7 },
      { x: 70, y: 490, r: 1.9, delay: 0.9, duration: 2.8 },
      { x: 570, y: 500, r: 1.3, delay: 2.4, duration: 3.0 },
    ];
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-[#07070a]">
      {/* Background space ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(37,99,235,0.12),transparent_70%)] pointer-events-none" />

      <svg
        viewBox="0 0 640 640"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[620px] max-h-[620px] object-contain select-none"
        aria-hidden="true"
      >
        <defs>
          {/* Gradients */}
          <radialGradient
            id="centerAura"
            cx="50%"
            cy="45%"
            r="45%"
            fx="50%"
            fy="45%"
          >
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#07070a" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="cableGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="60%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>

          <linearGradient id="suitGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          <linearGradient id="suitShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#4338ca" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="visorReflect" x1="50%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#eab308" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="deviceGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="glowLight" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient center aura */}
        <circle cx="320" cy="290" r="260" fill="url(#centerAura)" />

        {/* Twinkling background stars */}
        <g id="stars">
          {stars.map((star, idx) => (
            <motion.circle
              key={idx}
              cx={star.x}
              cy={star.y}
              r={star.r}
              fill="#ffffff"
              animate={
                shouldReduceMotion
                  ? { opacity: 0.6 }
                  : { opacity: [0.2, 1, 0.2] }
              }
              transition={{
                duration: star.duration,
                repeat: Infinity,
                delay: star.delay,
                ease: "easeInOut",
              }}
            />
          ))}
        </g>

        {/* Flowing blue cable/wave line running behind astronaut */}
        <motion.path
          d="M -10 260 C 90 280, 160 360, 260 340 C 330 325, 330 220, 270 200 C 220 180, 180 230, 230 280 C 280 330, 420 370, 500 290 C 560 230, 610 250, 650 240"
          stroke="url(#cableGrad)"
          strokeWidth="7"
          strokeLinecap="round"
          filter="url(#cableGlow)"
          animate={
            shouldReduceMotion
              ? {}
              : {
                  strokeDashoffset: [0, 40],
                }
          }
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "linear",
          }}
        />

        {/* FLOATING ASTRONAUT & LIGHTNING GROUP */}
        <motion.g
          id="floatingAstronautGroup"
          animate={
            shouldReduceMotion
              ? { y: 0 }
              : { y: [0, -12, 0] }
          }
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "easeInOut",
          }}
        >
          {/* Dynamic yellow lightning beams shooting outward */}
          <motion.g
            id="lightningBeams"
            animate={
              shouldReduceMotion
                ? { opacity: 0.95 }
                : {
                    opacity: [0.8, 1, 0.85, 1, 0.8],
                    scale: [0.99, 1.015, 0.99],
                  }
            }
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: "easeInOut",
            }}
            style={{ transformOrigin: "320px 300px" }}
          >
            {/* Top-Right Lightning Bolt shooting into the sky */}
            <path
              d="M 335 270 L 370 180 L 355 185 L 400 90 L 380 95 L 430 15 L 410 75 L 435 70 L 390 160 L 410 155 L 350 270 Z"
              fill="url(#lightningGrad)"
              filter="url(#glowLight)"
            />

            {/* Bottom-Left Lightning Bolt radiating downward across floor */}
            <path
              d="M 305 320 L 260 380 L 275 380 L 210 460 L 230 460 L 160 550 L 195 480 L 175 480 L 245 400 L 225 400 L 295 325 Z"
              fill="url(#lightningGrad)"
              filter="url(#glowLight)"
            />

            {/* Bottom-Right Lightning Bolt radiating downward */}
            <path
              d="M 335 320 L 380 380 L 365 380 L 430 460 L 410 460 L 480 550 L 445 480 L 465 480 L 395 400 L 415 400 L 345 325 Z"
              fill="url(#lightningGrad)"
              filter="url(#glowLight)"
            />
          </motion.g>

          {/* ASTRONAUT FIGURE */}
          <g id="astronautBody">
            {/* Cross-legged lower body & legs */}
            {/* Left Knee & Leg */}
            <path
              d="M 270 330 C 220 340, 200 375, 235 410 C 265 435, 310 415, 330 380 Z"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Left leg shadow highlight */}
            <path
              d="M 215 385 C 220 405, 250 425, 280 418 C 260 410, 235 395, 230 375 Z"
              fill="url(#suitShadowGrad)"
            />

            {/* Right Knee & Leg */}
            <path
              d="M 370 330 C 420 340, 440 375, 405 410 C 375 435, 330 415, 310 380 Z"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Right leg shadow highlight */}
            <path
              d="M 425 385 C 420 405, 390 425, 360 418 C 380 410, 405 395, 410 375 Z"
              fill="url(#suitShadowGrad)"
            />

            {/* Crossed astronaut boots / ankles */}
            <ellipse
              cx="320"
              cy="410"
              rx="35"
              ry="22"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="3"
            />
            <path
              d="M 298 405 C 310 395, 330 395, 342 405 C 330 415, 310 415, 298 405 Z"
              fill="#38bdf8"
              opacity="0.8"
            />

            {/* Torso & Suit */}
            <path
              d="M 270 250 C 260 280, 265 335, 320 345 C 375 335, 380 280, 370 250 C 350 240, 290 240, 270 250 Z"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Purple ambient light on right side of torso */}
            <path
              d="M 330 250 C 360 260, 375 290, 368 335 C 355 338, 340 335, 335 320 Z"
              fill="url(#suitShadowGrad)"
              opacity="0.85"
            />

            {/* Backpack / Life-support outline behind shoulders */}
            <rect
              x="260"
              y="200"
              width="120"
              height="80"
              rx="16"
              fill="#1e1b4b"
              stroke="#0f172a"
              strokeWidth="3"
            />

            {/* Arms holding the device */}
            {/* Left Arm */}
            <path
              d="M 270 245 C 240 260, 240 300, 275 315 C 285 320, 298 310, 298 300 C 275 295, 270 270, 280 255 Z"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Left Glove */}
            <circle
              cx="292"
              cy="305"
              r="14"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2.5"
            />

            {/* Right Arm */}
            <path
              d="M 370 245 C 400 260, 400 300, 365 315 C 355 320, 342 310, 342 300 C 365 295, 370 270, 360 255 Z"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="3.5"
            />
            {/* Right Glove */}
            <circle
              cx="348"
              cy="305"
              r="14"
              fill="#334155"
              stroke="#0f172a"
              strokeWidth="2.5"
            />

            {/* GLOWING HANDHELD CONTROLLER / DEVICE */}
            <g id="handheldDevice">
              {/* Outer chassis */}
              <rect
                x="298"
                y="288"
                width="44"
                height="34"
                rx="8"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2.5"
              />
              {/* Glowing cyan dual segments */}
              <rect
                x="305"
                y="294"
                width="12"
                height="22"
                rx="4"
                fill="#0284c7"
              />
              <rect
                x="323"
                y="294"
                width="12"
                height="22"
                rx="4"
                fill="#0284c7"
              />
              {/* Radiant warm power emitter */}
              <circle
                cx="320"
                cy="305"
                r="9"
                fill="#facc15"
                filter="url(#glowLight)"
              />
              <ellipse
                cx="320"
                cy="302"
                rx="18"
                ry="8"
                fill="#fef08a"
                opacity="0.9"
              />
            </g>

            {/* HELMET & VISOR */}
            {/* Collar Ring */}
            <ellipse
              cx="320"
              cy="235"
              rx="46"
              ry="16"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="3.5"
            />

            {/* Helmet Outer Shell */}
            <ellipse
              cx="320"
              cy="190"
              rx="54"
              ry="50"
              fill="url(#suitGrad)"
              stroke="#0f172a"
              strokeWidth="4"
            />

            {/* Helmet Visor Faceplate */}
            <ellipse
              cx="320"
              cy="192"
              rx="44"
              ry="38"
              fill="url(#visorReflect)"
              stroke="#0f172a"
              strokeWidth="3"
            />

            {/* Visor Golden Glow from handheld device */}
            <ellipse
              cx="320"
              cy="208"
              rx="30"
              ry="16"
              fill="#fef08a"
              opacity="0.8"
              filter="url(#glowLight)"
            />

            {/* Visor Specular White Highlight */}
            <path
              d="M 295 170 C 310 162, 335 162, 345 170"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Helmet earpiece modules */}
            <circle
              cx="268"
              cy="194"
              r="7"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="2"
            />
            <circle
              cx="372"
              cy="194"
              r="7"
              fill="#1e293b"
              stroke="#0f172a"
              strokeWidth="2"
            />
          </g>
        </motion.g>
      </svg>

      {/* Dark gradient overlay at bottom of illustration panel for quote readability */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#07070a] via-[#07070a]/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}

export default AuthIllustration;
