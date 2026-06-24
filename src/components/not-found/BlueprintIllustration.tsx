"use client";

import { motion } from "framer-motion";
import { Compass, FileQuestion, PenTool, Ruler, Triangle } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function BlueprintIllustration() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
      <div className="absolute -inset-10 -z-10 rounded-[40px] bg-lime/10 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative h-full w-full overflow-hidden rounded-[28px] bg-navy shadow-2xl shadow-navy/30"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <svg
          aria-hidden
          className="absolute inset-0 h-full w-full opacity-30"
          viewBox="0 0 400 300"
          fill="none"
        >
          <path
            d="M40 250 L160 250"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
          <path
            d="M240 60 L240 140"
            stroke="#FFFFFF"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        </svg>

        <div
          aria-hidden
          className="absolute inset-x-0 top-0 flex h-7 items-end border-b border-white/20 bg-white/5"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 border-l border-white/25"
              style={{ height: i % 4 === 0 ? "100%" : "50%" }}
            />
          ))}
        </div>

        <div className="absolute bottom-4 right-4 rounded-md border border-white/20 bg-navy/80 px-3 py-1.5 text-right">
          <p className="font-nav text-[9px] uppercase tracking-wider text-white/50">
            Dwg No.
          </p>
          <p className="font-heading text-xs font-bold text-lime">404-ER</p>
        </div>

        <div className="absolute left-1/2 top-1/2 flex h-32 w-44 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border-2 border-dashed border-lime/60 bg-white/[0.03]">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <FileQuestion className="h-10 w-10 text-lime" strokeWidth={1.5} />
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[12%] top-[18%] flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5"
        >
          <Compass className="h-5 w-5 text-white/70" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
          className="absolute right-[14%] top-[22%] flex h-9 w-9 items-center justify-center rounded-full border border-lime/30 bg-white/5"
        >
          <Ruler className="h-4 w-4 text-lime" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [0, -6, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          }}
          className="absolute bottom-[16%] left-[16%] flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5"
        >
          <Triangle className="h-4 w-4 text-white/70" strokeWidth={1.5} />
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
          className="absolute right-[18%] bottom-[20%] flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5"
        >
          <PenTool className="h-4 w-4 text-white/70" strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </div>
  );
}
