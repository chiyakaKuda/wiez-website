"use client";

import { motion } from "framer-motion";
import { CircleCheck, GraduationCap, User } from "lucide-react";

export default function MentorIllustration() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute -right-6 -top-10 h-56 w-56 rounded-full bg-lime/15 blur-3xl" />
      <div className="absolute -bottom-10 -left-6 h-56 w-56 rounded-full bg-navy/10 blur-3xl" />

      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex items-center justify-between gap-4 rounded-[28px] border border-navy/5 bg-white p-8 shadow-2xl shadow-navy/10"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy text-white">
            <User className="h-7 w-7" />
          </div>
          <span className="font-nav text-xs font-semibold text-slate-custom">
            Mentee
          </span>
        </div>

        <svg className="h-px flex-1 text-navy/20" viewBox="0 0 64 2">
          <line
            x1="0"
            y1="1"
            x2="64"
            y2="1"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime text-navy">
            <GraduationCap className="h-7 w-7" />
          </div>
          <span className="font-nav text-xs font-semibold text-slate-custom">
            Mentor
          </span>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.4,
        }}
        className="absolute -bottom-6 left-4 z-20 flex items-center gap-2 rounded-2xl border border-navy/5 bg-white px-4 py-3 shadow-xl shadow-navy/10"
      >
        <CircleCheck className="h-5 w-5 text-lime" />
        <span className="font-nav text-xs font-semibold text-navy">
          Mentor Matched
        </span>
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.8,
        }}
        className="absolute -top-6 right-2 z-20 rounded-2xl bg-navy px-4 py-3 shadow-xl"
      >
        <p className="font-heading text-lg font-extrabold text-white">500+</p>
        <p className="font-nav text-[10px] uppercase tracking-wider text-white/70">
          Mentees Guided
        </p>
      </motion.div>
    </div>
  );
}
