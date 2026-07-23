"use client";

import { motion } from "framer-motion";

export function TelehealthIllustration() {
  return (
    <svg
      viewBox="0 0 400 260"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Illustration of a behavioral health provider on a video call"
    >
      <defs>
        <linearGradient id="thBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(172 65% 26%)" />
          <stop offset="55%" stopColor="hsl(160 55% 38%)" />
          <stop offset="100%" stopColor="hsl(178 45% 46%)" />
        </linearGradient>
        <radialGradient id="thGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="400" height="260" fill="url(#thBg)" />
      <rect width="400" height="260" fill="url(#thGlow)" />

      {/* ambient floating particles */}
      <motion.circle
        cx="60" cy="50" r="4" fill="#ffffff" opacity="0.25"
        animate={{ cy: [50, 38, 50] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="345" cy="90" r="3" fill="#ffffff" opacity="0.2"
        animate={{ cy: [90, 105, 90] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.circle
        cx="320" cy="210" r="5" fill="#ffffff" opacity="0.15"
        animate={{ cx: [320, 335, 320] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* provider figure — simple, friendly, geometric */}
      <g transform="translate(200,150)">
        <motion.ellipse
          cx="0" cy="78" rx="72" ry="14" fill="#000000" opacity="0.12"
        />
        {/* shoulders / coat */}
        <path
          d="M -70 78 C -70 20 -40 -6 0 -6 C 40 -6 70 20 70 78 Z"
          fill="#ffffff"
          opacity="0.95"
        />
        {/* coat lapel accent */}
        <path d="M -14 -2 L 0 30 L 14 -2 Z" fill="hsl(172 65% 26%)" opacity="0.85" />
        {/* stethoscope */}
        <path
          d="M -18 4 C -24 22 -20 38 -6 40 C 8 42 12 26 8 16"
          fill="none"
          stroke="hsl(172 40% 55%)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="8" cy="16" r="4" fill="hsl(172 40% 55%)" />

        {/* head */}
        <motion.circle
          cx="0" cy="-40" r="38" fill="#ffffff"
          animate={{ cy: [-40, -42, -40] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* hair */}
        <path d="M -38 -46 C -40 -70 40 -70 38 -46 C 30 -60 -30 -60 -38 -46 Z" fill="hsl(30 25% 22%)" />
        {/* simple face — friendly, non-identifiable */}
        <circle cx="-13" cy="-38" r="3.2" fill="hsl(172 40% 20%)" />
        <circle cx="13" cy="-38" r="3.2" fill="hsl(172 40% 20%)" />
        <path
          d="M -12 -22 Q 0 -14 12 -22"
          stroke="hsl(172 40% 20%)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* screen frame corner accents to read as a "video call" */}
      <path d="M14 14 L14 30 M14 14 L30 14" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M386 14 L386 30 M386 14 L370 14" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M14 246 L14 230 M14 246 L30 246" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M386 246 L386 230 M386 246 L370 246" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
