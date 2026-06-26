"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

function scrollToRequirements() {
  const el = document.getElementById("who-can-join");
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top, behavior: "smooth" });
}

export function MembershipHero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-28 lg:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(#FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[8%] h-24 w-24 rounded-2xl border border-white/10"
        />
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute top-[60%] right-[10%] h-16 w-16 rounded-full border border-lime/30"
        />
        <motion.div
          animate={{ y: [0, -12, 0], x: [0, 10, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute top-[30%] right-[22%] h-10 w-10 rotate-45 border border-white/10"
        />
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-lime/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex items-center justify-center gap-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            WiEZ Membership
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Become a Member of Women in Engineering Zimbabwe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/70"
        >
          Join Zimbabwe&apos;s premier network of women engineers, technologists and
          innovators. Membership is selective — we maintain high professional standards.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/membership/apply"
            className="inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
          >
            Apply for Membership
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={scrollToRequirements}
            className="inline-flex items-center justify-center rounded-full border border-white/20 px-7 py-3.5 font-nav text-sm font-semibold text-white transition-colors duration-300 hover:bg-white/10"
          >
            View Requirements
          </button>
        </motion.div>
      </div>
    </section>
  );
}
