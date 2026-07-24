"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HeroVideoCallScene } from "@/components/HeroVideoCallScene";

/**
 * Looks for a real photo at /public/images/hero-consultation.jpg — this
 * would be a licensed photo depicting a provider on a video visit with a
 * patient (not a solo portrait). Until one is provided, it shows an
 * original illustrated video-call scene instead, so the hero never
 * depends on a specific real photo being available.
 */
export function HeroPhotoBackground() {
  const [errored, setErrored] = useState(false);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden bg-neutral-900">
      {!errored && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/hero-consultation.jpg"
          alt=""
          onError={() => setErrored(true)}
          className="h-full w-full object-cover object-[center_8%] sm:object-[center_12%]"
        />
      )}
      {errored && <HeroVideoCallScene />}

      <div className="absolute top-6 left-6 flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur px-3 py-1.5 z-10">
        <motion.span
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-red-400"
        />
        <span className="text-[11px] text-white/90 font-medium tracking-wide">
          LIVE VIDEO VISIT
        </span>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
    </div>
  );
}
