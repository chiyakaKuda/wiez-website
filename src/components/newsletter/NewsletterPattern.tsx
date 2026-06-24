"use client";

import { motion } from "framer-motion";

export default function NewsletterPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        viewBox="0 0 1200 600"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 90H300V270H640" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M1200 150H900V350H600" stroke="#FFFFFF" strokeWidth="1.5" />
        <path d="M0 480H220V560" stroke="#FFFFFF" strokeWidth="1.5" />
        <circle cx="300" cy="270" r="5" fill="#A3E635" />
        <circle cx="900" cy="350" r="5" fill="#A3E635" />
        <circle cx="220" cy="560" r="5" fill="#A3E635" />
      </svg>

      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[18%] h-16 w-16 rounded-2xl border border-white/10"
      />
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[12%] top-[12%] h-10 w-10 rounded-full border border-lime/30"
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[44%] bottom-[14%] h-8 w-8 rotate-45 border border-white/10"
      />
    </div>
  );
}
