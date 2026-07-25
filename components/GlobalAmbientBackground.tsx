"use client";

import { motion } from "framer-motion";

export function GlobalAmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--primary) / 0.18) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <motion.div
        animate={{ transform: ["translate(0px, 0px)", "translate(40px, -30px)", "translate(-20px, 20px)", "translate(0px, 0px)"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[-10%] h-[26rem] w-[26rem] rounded-full bg-primary/10 blur-[100px]"
      />
      <motion.div
        animate={{ transform: ["translate(0px, 0px)", "translate(-30px, 25px)", "translate(20px, -20px)", "translate(0px, 0px)"] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] right-[-12%] h-[24rem] w-[24rem] rounded-full bg-teal-400/10 blur-[100px]"
      />
      <motion.div
        animate={{ transform: ["translate(0px, 0px)", "translate(25px, -20px)", "translate(-15px, 15px)", "translate(0px, 0px)"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-8%] left-[20%] h-[22rem] w-[22rem] rounded-full bg-emerald-300/10 blur-[100px]"
      />
    </div>
  );
}
