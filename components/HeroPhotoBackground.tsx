"use client";

import { useState } from "react";

/**
 * Looks for a real photo at /public/images/hero-consultation.jpg.
 * Until you add one, it falls back to a designed gradient wash so the
 * hero still looks intentional. The moment a file exists at that exact
 * path, it will display automatically — no code changes needed.
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
      {errored && (
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_20%,_hsl(172_50%_20%)_0%,_hsl(200_35%_10%)_55%,_hsl(220_30%_6%)_100%)]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
    </div>
  );
}
