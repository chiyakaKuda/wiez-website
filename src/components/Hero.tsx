"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import HeroCarousel from "@/components/hero/HeroCarousel";
import HeroBackground from "@/components/hero/HeroBackground";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import EventCountdown from "@/components/ui/EventCountdown";
import SpeakerTimeline from "@/components/hero/SpeakerTimeline";
import { SUMMIT_DATE, SUMMIT_LOCATION } from "@/lib/events";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { value: 500, suffix: "+", label: "Members" },
  { value: 100, suffix: "+", label: "Events" },
  { value: 8, suffix: "", label: "Provinces" },
  { value: 20, suffix: "+", label: "Partners" },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate bg-white lg:flex lg:h-screen lg:min-h-[760px] lg:items-center"
    >
      <HeroCarousel />
      <HeroBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 px-6 py-28 lg:grid-cols-[60%_40%] lg:gap-10 lg:px-8 lg:pt-24 lg:pb-12">
        {/* LEFT — narrative, CTAs, stats */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="flex flex-col justify-center"
        >
          <motion.h1
            variants={itemVariants}
            className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-navy sm:text-6xl lg:text-[4.25rem]"
          >
            Engineering Zimbabwe&apos;s Future,{" "}
            <span className="text-lime">Together</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl font-sans text-lg leading-8 text-slate-custom"
          >
            A professional network connecting students, graduates and
            industry leaders across Zimbabwe.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link
              href="/membership"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
            >
              Join Network
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
            >
              Explore Programs
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-navy/10 pt-8 sm:grid-cols-4"
          >
            {STATS.map((stat, i) => (
              <div key={stat.label}>
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={i * 0.1}
                  className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl"
                />
                <div className="mt-1 font-sans text-sm text-slate-custom">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* RIGHT — floating glass card system */}
        <div className="relative flex flex-col justify-center gap-6">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: EASE }}
            className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          >
            <p className="font-nav text-xs font-bold uppercase tracking-[0.16em] text-lime">
              Next Event
            </p>
            <h3 className="mt-2 font-heading text-xl font-extrabold leading-snug text-navy">
              Women in Engineering Summit 2026
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 font-sans text-sm text-slate-custom">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              {SUMMIT_LOCATION}
            </p>

            <div className="mt-5">
              <EventCountdown targetDate={SUMMIT_DATE} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
            className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] backdrop-blur-xl"
          >
            <SpeakerTimeline />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
