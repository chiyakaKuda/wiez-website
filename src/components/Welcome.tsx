"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import WelcomePattern from "@/components/welcome/WelcomePattern";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Welcome() {
  return (
    <section
      id="welcome"
      className="relative overflow-hidden bg-white py-24 lg:py-32"
    >
      <WelcomePattern />

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 lg:grid-cols-2 lg:items-start lg:gap-20 lg:px-8">
        {/* LEFT — portrait */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="lg:sticky lg:top-28"
        >
          <div className="relative mx-auto max-w-md">
            <div className="absolute -left-5 -top-5 -z-10 h-28 w-28 rounded-2xl bg-lime/25 lg:-left-7 lg:-top-7 lg:h-36 lg:w-36" />

            <div className="relative aspect-[3/4] overflow-hidden rounded-[24px] shadow-2xl shadow-navy/20">
              <Image
                src="/profile/berverly.png"
                alt="Portrait of Berverly Nyakutsikwa, Chair of Women in Engineering Zimbabwe"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 90vw"
              />
            </div>

            <div className="absolute -bottom-6 -right-6 hidden h-24 w-24 rounded-full border-[6px] border-lime sm:block" />
          </div>
        </motion.div>

        {/* RIGHT — message */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
        >
          <motion.div
            variants={itemVariants}
            className="relative flex items-center pl-6"
          >
            <span className="absolute left-0 top-0 h-full w-1 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Message From The President
            </p>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-5 font-heading text-[28px] font-extrabold leading-tight tracking-tight text-navy sm:text-[36px] lg:text-[48px]"
          >
            Welcome to Women in Engineering Zimbabwe
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="mt-8 space-y-5 font-sans text-[18px] leading-relaxed text-slate-custom"
          >
            <p>
              Women in Engineering Zimbabwe exists to empower, connect and
              inspire women engineers across the nation. Through mentorship,
              professional development, networking and advocacy, we are
              building a future where women play a leading role in shaping
              Zimbabwe&apos;s engineering landscape.
            </p>
            <p>
              Whether you are a student beginning your journey, a graduate
              engineer advancing your career, or an experienced professional
              driving innovation, WiEZ is your community.
            </p>
            <p>
              Together, we are engineering solutions, creating opportunities
              and inspiring the next generation of women leaders in STEM.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10">
            <p className="font-heading text-lg font-extrabold text-navy">
              Berverly Nyakutsikwa (Pr.Eng)
            </p>
            <p className="mt-1 font-sans text-sm text-slate-custom">
              Civil and Water Engineer | Chair – Women in Engineering Zimbabwe | TechWomen | AWE |
              EaglesNest | Next She Exporter
            </p>
            <svg
              width="140"
              height="40"
              viewBox="0 0 140 40"
              fill="none"
              aria-hidden
              className="mt-3 text-navy/70"
            >
              <path
                d="M2 28C10 6 18 34 28 18C36 6 40 30 50 22C58 16 62 30 72 20C80 12 86 28 96 18C104 10 110 26 120 16C126 10 130 20 138 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10">
            <Link
              href="/about"
              className="group inline-flex items-center gap-2 rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-all duration-300 hover:border-navy hover:bg-navy hover:text-white"
            >
              Read Our Vision
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
