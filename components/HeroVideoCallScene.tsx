"use client";

import { motion } from "framer-motion";

/**
 * Original illustrated artwork (not a photo) depicting a telehealth video
 * call between a provider and a patient — two distinct figures, so it
 * reads clearly as "a video visit in progress" rather than a portrait.
 */
export function HeroVideoCallScene() {
  return (
    <svg
      viewBox="0 0 1600 900"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a behavioral health provider on a video call with a patient"
    >
      <defs>
        <linearGradient id="heroSceneBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(172 55% 16%)" />
          <stop offset="50%" stopColor="hsl(165 45% 22%)" />
          <stop offset="100%" stopColor="hsl(178 40% 20%)" />
        </linearGradient>
        <radialGradient id="heroSceneGlow" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="1600" height="900" fill="url(#heroSceneBg)" />
      <rect width="1600" height="900" fill="url(#heroSceneGlow)" />

      <motion.circle
        cx="180" cy="160" r="5" fill="#ffffff" opacity="0.15"
        animate={{ cy: [160, 140, 160] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="1420" cy="220" r="4" fill="#ffffff" opacity="0.12"
        animate={{ cy: [220, 245, 220] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="1300" cy="700" r="6" fill="#ffffff" opacity="0.1"
        animate={{ cx: [1300, 1330, 1300] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <g transform="translate(620,560)">
        <ellipse cx="0" cy="230" rx="190" ry="30" fill="#000000" opacity="0.15" />
        <path
          d="M -185 220 C -185 60 -105 -10 0 -10 C 105 -10 185 60 185 220 Z"
          fill="#ffffff"
          opacity="0.96"
        />
        <path d="M -34 -6 L 0 76 L 34 -6 Z" fill="hsl(172 65% 26%)" opacity="0.85" />
        <path
          d="M -46 10 C -62 56 -52 96 -16 100 C 20 104 30 66 20 40"
          fill="none"
          stroke="hsl(172 40% 55%)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="20" cy="40" r="9" fill="hsl(172 40% 55%)" />

        <motion.circle
          cx="0" cy="-96" r="94" fill="#ffffff"
          animate={{ cy: [-96, -101, -96] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <path d="M -92 -110 C -96 -168 96 -168 92 -110 C 72 -144 -72 -144 -92 -110 Z" fill="hsl(30 25% 22%)" />
        <circle cx="-32" cy="-92" r="8" fill="hsl(172 40% 20%)" />
        <circle cx="32" cy="-92" r="8" fill="hsl(172 40% 20%)" />
        <path d="M -30 -52 Q 0 -32 30 -52" stroke="hsl(172 40% 20%)" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      <path d="M40 40 L40 90 M40 40 L90 40" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M1560 40 L1560 90 M1560 40 L1510 40" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M40 860 L40 810 M40 860 L90 860" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M1560 860 L1560 810 M1560 860 L1510 860" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="4" strokeLinecap="round" fill="none" />

      <g transform="translate(1330,190)" opacity="0.98">
        <rect x="-110" y="-70" width="220" height="150" rx="14" fill="hsl(200 20% 92%)" />
        <ellipse cx="0" cy="86" rx="70" ry="14" fill="#000000" opacity="0.08" />
        <path
          d="M -66 78 C -66 20 -38 -2 0 -2 C 38 -2 66 20 66 78 Z"
          fill="hsl(210 15% 55%)"
        />
        <circle cx="0" cy="-34" r="34" fill="hsl(28 45% 65%)" />
        <path d="M -32 -40 C -34 -62 32 -62 32 -40 C 24 -52 -24 -52 -32 -40 Z" fill="hsl(20 30% 25%)" />
      </g>
    </svg>
  );
}
