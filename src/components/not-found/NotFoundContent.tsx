"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import BlueprintIllustration from "@/components/not-found/BlueprintIllustration";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function NotFoundContent() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden bg-white px-6 pb-20 pt-32 lg:px-8 lg:pt-24">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="text-center lg:text-left"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-navy/10 bg-navy/5 px-4 py-1.5 font-nav text-xs font-semibold uppercase tracking-[0.14em] text-navy"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            Error 404
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="mt-6 font-heading text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl"
          >
            Blueprint <span className="text-lime">Not Found</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-md font-sans text-lg leading-relaxed text-slate-custom lg:mx-0"
          >
            The page you&apos;re looking for seems to have disappeared from
            the design plans. Let&apos;s get you back on track.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
            >
              Return Home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
            >
              Explore Programs
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
        >
          <BlueprintIllustration />
        </motion.div>
      </div>
    </section>
  );
}
