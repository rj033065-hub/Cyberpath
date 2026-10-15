import React from "react";

export interface AstronautIllustrationProps {
  className?: string;
  style?: React.CSSProperties;
  isPaused?: boolean;
}

/**
 * AstronautIllustration
 *
 * An original inline SVG illustration of a friendly astronaut / robot sitting cross-legged,
 * holding a glowing cyber device, with angular cyan light beams shooting outward,
 * scattered stars, and a smooth curved tether cable flowing behind.
 *
 * Palette (Monochrome White-on-Dark):
 * - Primary accent: #ffffff (was brand blue #2f7bff)
 * - Suit highlights: #e2e8f0, #cbd5e1, #94a3b8
 * - Soft cyan glow for beams & device: #00f2fe, #38bdf8, #22d3ee (sci-fi atmosphere)
 * - Dark outlines: #0b1329 / #0f172a
 */
export const AstronautIllustration: React.FC<AstronautIllustrationProps> = ({
  className = "",
  style,
  isPaused = false,
}) => {
  return (
    <svg
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full select-none ${className}`}
      style={{
        ...style,
        animationPlayState: isPaused ? "paused" : "running",
      }}
      aria-hidden="true"
    >
      <defs>
        {/* Glow Filters */}
        <filter id="softCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="intenseCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="14" result="blur1" />
          <feGaussianBlur stdDeviation="4" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Cable Gradient */}
        <linearGradient id="cableGradient" x1="40" y1="240" x2="480" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="35%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>

        {/* Beams Gradients (Soft Cyan to Transparent - Strictly No Yellow) */}
        <linearGradient id="beamGradUpRight" x1="260" y1="260" x2="410" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#e2e8f0" stopOpacity="0.75" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="beamGradDownLeft" x1="245" y1="270" x2="90" y2="470" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#e2e8f0" stopOpacity="0.7" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="beamGradDownRight" x1="275" y1="270" x2="430" y2="465" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#e2e8f0" stopOpacity="0.75" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Device Screen Glow */}
        <linearGradient id="deviceScreenGrad" x1="230" y1="250" x2="290" y2="290" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#a1a1aa" />
        </linearGradient>

        {/* Visor Reflection Gradient */}
        <linearGradient id="visorGrad" x1="220" y1="130" x2="300" y2="185" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0e1726" />
          <stop offset="45%" stopColor="#1e293b" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#e2e8f0" stopOpacity="0.9" />
        </linearGradient>

        {/* Visor Glare Line */}
        <linearGradient id="visorGlare" x1="230" y1="135" x2="280" y2="155" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        {/* Suit Shading & Highlights */}
        <linearGradient id="suitHighlightGrad" x1="200" y1="180" x2="320" y2="340" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#e2e8f0" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <linearGradient id="lavenderGlowGrad" x1="210" y1="200" x2="310" y2="330" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c7d2fe" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#a5b4fc" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
        </linearGradient>

        {/* Radial Ambient Glow Behind Astronaut */}
        <radialGradient id="astronautAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <style>{`
        @keyframes floatMotion {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes beamPulseSlow {
          0%, 100% {
            opacity: 0.65;
            transform: scale(0.98);
          }
          50% {
            opacity: 1;
            transform: scale(1.03);
          }
        }

        @keyframes beamPulseFast {
          0%, 100% {
            opacity: 0.6;
            transform: scale(0.97);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.02);
          }
        }

        @keyframes twinkleStar {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.2);
          }
        }

        .astro-float-group {
          animation: floatMotion 5s ease-in-out infinite;
          transform-origin: center center;
        }

        .beam-pulse-1 {
          animation: beamPulseSlow 4.2s ease-in-out infinite;
          transform-origin: 260px 270px;
        }

        .beam-pulse-2 {
          animation: beamPulseFast 3.6s ease-in-out infinite 0.7s;
          transform-origin: 245px 270px;
        }

        .beam-pulse-3 {
          animation: beamPulseSlow 4.8s ease-in-out infinite 1.4s;
          transform-origin: 275px 270px;
        }

        .star-twinkle-1 {
          animation: twinkleStar 3.2s ease-in-out infinite 0.2s;
          transform-origin: center;
        }
        .star-twinkle-2 {
          animation: twinkleStar 4s ease-in-out infinite 1.1s;
          transform-origin: center;
        }
        .star-twinkle-3 {
          animation: twinkleStar 2.7s ease-in-out infinite 1.8s;
          transform-origin: center;
        }
        .star-twinkle-4 {
          animation: twinkleStar 3.7s ease-in-out infinite 2.5s;
          transform-origin: center;
        }

        @media (prefers-reduced-motion: reduce) {
          .astro-float-group,
          .beam-pulse-1,
          .beam-pulse-2,
          .beam-pulse-3,
          .star-twinkle-1,
          .star-twinkle-2,
          .star-twinkle-3,
          .star-twinkle-4 {
            animation: none !important;
          }
        }
      `}</style>

      {/* ─── AMBIENT BACKGROUND GLOW ─── */}
      <circle cx="260" cy="270" r="190" fill="url(#astronautAura)" />

      {/* ─── BACKGROUND STARS ─── */}
      <g opacity="0.85">
        {/* Star 1 - Top Left 4-point sparkle */}
        <g className="star-twinkle-1" style={{ transformOrigin: "85px 95px" }}>
          <path
            d="M 85 85 Q 85 95 95 95 Q 85 95 85 105 Q 85 95 75 95 Q 85 95 85 85 Z"
            fill="#a5b4fc"
          />
        </g>
        {/* Star 2 - Top Right small dot */}
        <circle cx="430" cy="110" r="2.5" fill="#38bdf8" className="star-twinkle-2" style={{ transformOrigin: "430px 110px" }} />
        {/* Star 3 - Mid Right sparkle */}
        <g className="star-twinkle-3" style={{ transformOrigin: "475px 200px" }}>
          <path
            d="M 475 192 Q 475 200 483 200 Q 475 200 475 208 Q 475 200 467 200 Q 475 200 475 192 Z"
            fill="#00f2fe"
          />
        </g>
        {/* Star 4 - Mid Left dot */}
        <circle cx="65" cy="285" r="2" fill="#c7d2fe" className="star-twinkle-4" style={{ transformOrigin: "65px 285px" }} />
        {/* Star 5 - Bottom Left sparkle */}
        <g className="star-twinkle-2" style={{ transformOrigin: "115px 430px" }}>
          <path
            d="M 115 422 Q 115 430 123 430 Q 115 430 115 438 Q 115 430 107 430 Q 115 430 115 422 Z"
            fill="#38bdf8"
          />
        </g>
        {/* Star 6 - Bottom Right dot */}
        <circle cx="455" cy="405" r="2.5" fill="#a5b4fc" className="star-twinkle-1" style={{ transformOrigin: "455px 405px" }} />
        {/* Star 7 - Upper Center small sparkle */}
        <circle cx="210" cy="55" r="2" fill="#00f2fe" className="star-twinkle-3" style={{ transformOrigin: "210px 55px" }} />
      </g>

      {/* ─── CURVED TETHER / CABLE FLOWING BEHIND ─── */}
      <g opacity="0.8">
        {/* Outer subtle shadow line */}
        <path
          d="M 35 235 C 130 160 170 330 260 295 C 350 255 390 355 485 245"
          fill="none"
          stroke="#0b1329"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Glowing core cable */}
        <path
          d="M 35 235 C 130 160 170 330 260 295 C 350 255 390 355 485 245"
          fill="none"
          stroke="url(#cableGradient)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Connection joint connector at left */}
        <circle cx="35" cy="235" r="4.5" fill="#ffffff" stroke="#0b1329" strokeWidth="2" />
        {/* Connection joint connector at right */}
        <circle cx="485" cy="245" r="4.5" fill="#00f2fe" stroke="#0b1329" strokeWidth="2" />
      </g>

      {/* ─── FLOATING ASTRONAUT & LIGHT BEAMS GROUP ─── */}
      <g className="astro-float-group">
        {/* ─── ANGULAR LIGHT BEAMS (EMANATING FROM CONSOLE - CYAN ONLY) ─── */}
        <g id="light-beams">
          {/* Beam 1: Shooting Up-Right with angular zigzag edges */}
          <polygon
            points="260,265 295,210 288,206 350,135 340,130 425,50 380,85 390,95 330,175 342,185 275,275"
            fill="url(#beamGradUpRight)"
            filter="url(#softCyanGlow)"
            className="beam-pulse-1"
          />

          {/* Beam 2: Shooting Down-Left with angular zigzag edges */}
          <polygon
            points="245,275 205,320 213,326 155,385 168,393 80,480 120,435 110,425 180,355 170,345 238,285"
            fill="url(#beamGradDownLeft)"
            filter="url(#softCyanGlow)"
            className="beam-pulse-2"
          />

          {/* Beam 3: Shooting Down-Right with angular zigzag edges */}
          <polygon
            points="275,275 315,325 306,331 370,390 360,400 445,475 405,435 415,425 340,360 350,350 285,285"
            fill="url(#beamGradDownRight)"
            filter="url(#softCyanGlow)"
            className="beam-pulse-3"
          />
        </g>

        {/* ─── ASTRONAUT / ROBOT BODY ─── */}
        <g id="astronaut-body">
          {/* ── BACKPACK / LIFE SUPPORT UNIT ── */}
          <rect
            x="195"
            y="170"
            width="130"
            height="115"
            rx="22"
            fill="#1e293b"
            stroke="#0b1329"
            strokeWidth="3.5"
          />
          {/* Backpack side vents */}
          <rect x="186" y="195" width="9" height="30" rx="3" fill="#ffffff" stroke="#0b1329" strokeWidth="2" />
          <rect x="325" y="195" width="9" height="30" rx="3" fill="#ffffff" stroke="#0b1329" strokeWidth="2" />

          {/* ── CROSS-LEGGED LOWER BODY & LEGS ── */}
          {/* Left Thigh (viewer's left) */}
          <path
            d="M 215 285 C 175 295 150 330 165 370 C 175 395 210 405 245 390 C 255 385 260 375 255 360 C 250 340 235 310 215 285 Z"
            fill="url(#suitHighlightGrad)"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Right Thigh (viewer's right) */}
          <path
            d="M 305 285 C 345 295 370 330 355 370 C 345 395 310 405 275 390 C 265 385 260 375 265 360 C 270 340 285 310 305 285 Z"
            fill="url(#suitHighlightGrad)"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Left Leg Fold & Knee */}
          <path
            d="M 160 365 C 150 395 180 435 220 440 C 250 445 275 425 280 405 C 275 390 250 380 220 385 C 190 390 170 380 160 365 Z"
            fill="#e2e8f0"
            stroke="#0b1329"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Right Leg Fold & Knee */}
          <path
            d="M 360 365 C 370 395 340 435 300 440 C 270 445 245 425 240 405 C 245 390 270 380 300 385 C 330 390 350 380 360 365 Z"
            fill="#cbd5e1"
            stroke="#0b1329"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Left Boot / Sole Folded */}
          <path
            d="M 215 415 C 200 425 205 450 230 455 C 255 460 270 445 265 425 C 260 410 240 405 215 415 Z"
            fill="#1e293b"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Left boot cyan sole grip */}
          <path
            d="M 218 435 C 230 445 245 448 258 440"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Right Boot / Sole Folded */}
          <path
            d="M 305 415 C 320 425 315 450 290 455 C 265 460 250 445 255 425 C 260 410 280 405 305 415 Z"
            fill="#0f172a"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Right boot cyan sole grip */}
          <path
            d="M 302 435 C 290 445 275 448 262 440"
            stroke="#00f2fe"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* ── TORSO & SUIT ── */}
          <path
            d="M 210 185 C 190 220 195 270 215 305 C 235 315 285 315 305 305 C 325 270 330 220 310 185 C 290 178 230 178 210 185 Z"
            fill="url(#suitHighlightGrad)"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Lavender ambient suit glow overlay */}
          <path
            d="M 215 195 C 205 230 205 265 220 295 C 240 305 280 305 300 295 C 315 265 315 230 305 195 Z"
            fill="url(#lavenderGlowGrad)"
          />

          {/* Cyber chest badge / interface */}
          <rect
            x="244"
            y="202"
            width="32"
            height="18"
            rx="4"
            fill="#0f172a"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Tiny glowing interface dots */}
          <circle cx="252" cy="211" r="2" fill="#00f2fe" />
          <circle cx="260" cy="211" r="2" fill="#38bdf8" />
          <circle cx="268" cy="211" r="2" fill="#818cf8" />

          {/* Suit harness straps */}
          <path d="M 230 185 L 244 235" stroke="#0b1329" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M 290 185 L 276 235" stroke="#0b1329" strokeWidth="2.5" strokeLinecap="round" />

          {/* ── ARMS & HANDS HOLDING DEVICE ── */}
          {/* Left Arm (viewer's left) */}
          <path
            d="M 210 195 C 170 220 160 260 190 280 C 205 290 225 280 235 270"
            fill="#e2e8f0"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Left Shoulder Patch (White Accent) */}
          <circle cx="188" cy="235" r="7" fill="#ffffff" stroke="#0b1329" strokeWidth="2" />

          {/* Right Arm (viewer's right) */}
          <path
            d="M 310 195 C 350 220 360 260 330 280 C 315 290 295 280 285 270"
            fill="#cbd5e1"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right Shoulder Patch (White Accent) */}
          <circle cx="332" cy="235" r="7" fill="#ffffff" stroke="#0b1329" strokeWidth="2" />

          {/* ── HOLOGRAPHIC CYBER DEVICE / TABLET ── */}
          {/* Device outer frame */}
          <rect
            x="234"
            y="254"
            width="52"
            height="34"
            rx="6"
            fill="#090d16"
            stroke="#00f2fe"
            strokeWidth="2.5"
            filter="url(#softCyanGlow)"
          />
          {/* Glowing screen */}
          <rect
            x="238"
            y="258"
            width="44"
            height="26"
            rx="3"
            fill="url(#deviceScreenGrad)"
          />
          {/* Screen Cyber glyph (X / shield icon in bright white) */}
          <path
            d="M 252 265 L 268 277 M 268 265 L 252 277"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="260" cy="271" r="3.5" fill="#ffffff" filter="url(#intenseCyanGlow)" />

          {/* Left Hand / Glove holding side */}
          <path
            d="M 226 260 C 223 255 233 248 240 252 C 244 255 243 275 238 278 C 232 281 227 275 226 260 Z"
            fill="#e2e8f0"
            stroke="#0b1329"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Left Thumb */}
          <ellipse cx="240" cy="256" rx="3.5" ry="5" fill="#cbd5e1" stroke="#0b1329" strokeWidth="1.5" />

          {/* Right Hand / Glove holding side */}
          <path
            d="M 294 260 C 297 255 287 248 280 252 C 276 255 277 275 282 278 C 288 281 293 275 294 260 Z"
            fill="#cbd5e1"
            stroke="#0b1329"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Right Thumb */}
          <ellipse cx="280" cy="256" rx="3.5" ry="5" fill="#94a3b8" stroke="#0b1329" strokeWidth="1.5" />

          {/* ── NECK COLLAR RING ── */}
          <ellipse
            cx="260"
            cy="178"
            rx="32"
            ry="12"
            fill="#1e293b"
            stroke="#0b1329"
            strokeWidth="3"
          />
          <ellipse
            cx="260"
            cy="176"
            rx="27"
            ry="8"
            fill="#0f172a"
          />

          {/* ── HELMET & VISOR ── */}
          {/* Helmet Base Dome */}
          <path
            d="M 212 152 C 208 105 240 82 260 82 C 280 82 312 105 308 152 C 305 178 285 186 260 186 C 235 186 215 178 212 152 Z"
            fill="url(#suitHighlightGrad)"
            stroke="#0b1329"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Left Ear Antenna Knob */}
          <rect
            x="202"
            y="136"
            width="10"
            height="26"
            rx="4"
            fill="#ffffff"
            stroke="#0b1329"
            strokeWidth="2.5"
          />
          <circle cx="207" cy="149" r="2.5" fill="#e2e8f0" />

          {/* Right Ear Antenna Knob */}
          <rect
            x="308"
            y="136"
            width="10"
            height="26"
            rx="4"
            fill="#ffffff"
            stroke="#0b1329"
            strokeWidth="2.5"
          />
          <circle cx="313" cy="149" r="2.5" fill="#e2e8f0" />

          {/* Helmet Visor (Smooth Shield with Reflection) */}
          <path
            d="M 220 148 C 218 116 242 100 260 100 C 278 100 302 116 300 148 C 298 168 280 176 260 176 C 240 176 222 168 220 148 Z"
            fill="url(#visorGrad)"
            stroke="#0b1329"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Glowing Visor Reflection from the Cyber Device Below */}
          <path
            d="M 230 156 C 240 168 280 168 290 156 C 282 170 238 170 230 156 Z"
            fill="#00f2fe"
            opacity="0.8"
            filter="url(#softCyanGlow)"
          />

          {/* Visor Glare Curvature Line */}
          <path
            d="M 232 118 C 248 108 272 108 288 118"
            stroke="url(#visorGlare)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Visor Small Glint */}
          <circle cx="240" cy="122" r="3" fill="#ffffff" opacity="0.8" />
        </g>
      </g>
    </svg>
  );
};

export default AstronautIllustration;
