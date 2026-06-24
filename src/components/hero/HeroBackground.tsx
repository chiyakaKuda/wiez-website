"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yFast = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #0F172A 1px, transparent 1px), linear-gradient(to bottom, #0F172A 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,transparent,white)]" />

      <motion.div
        style={{ y: ySlow }}
        className="absolute -top-24 right-[6%] h-[420px] w-[420px] rounded-full bg-lime/10 blur-3xl"
      />
      <motion.div
        style={{ y: yFast }}
        className="absolute bottom-0 left-[8%] h-[320px] w-[320px] rounded-full bg-navy/5 blur-3xl"
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        viewBox="0 0 1200 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path d="M0 130H340V410H700" stroke="#0F172A" strokeWidth="1.5" />
        <path d="M1200 210H860V60H560" stroke="#0F172A" strokeWidth="1.5" />
        <path
          d="M1200 630H760V760H420V680"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        <path d="M0 560H180V480" stroke="#0F172A" strokeWidth="1.5" />
        <circle cx="340" cy="410" r="5" fill="#0F172A" />
        <circle cx="700" cy="410" r="5" fill="#0F172A" />
        <circle cx="560" cy="60" r="5" fill="#0F172A" />
        <circle cx="420" cy="680" r="5" fill="#0F172A" />
        <circle cx="180" cy="480" r="5" fill="#0F172A" />
      </svg>

      <motion.div
        animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[8%] top-[24%] h-16 w-16 rounded-2xl border border-navy/10"
      />
      <motion.div
        animate={{ y: [0, 14, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute right-[26%] top-[14%] h-10 w-10 rounded-full border border-lime/40"
      />
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, -4, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute left-[44%] bottom-[12%] h-8 w-8 rotate-45 border border-navy/10"
      />
    </div>
  );
}
