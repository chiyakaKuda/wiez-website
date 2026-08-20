"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ENGINEERS, SPOTLIGHT_ENGINEER } from "@/components/engineers/data";
import type { Engineer } from "@/components/engineers/types";
import FeaturedSpotlight from "@/components/engineers/FeaturedSpotlight";
import EngineerCard from "@/components/engineers/EngineerCard";
import EngineerModal from "@/components/engineers/EngineerModal";
import QuoteBand from "@/components/engineers/QuoteBand";

const EASE = [0.22, 1, 0.36, 1] as const;

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function FeaturedEngineers() {
  const [selected, setSelected] = useState<Engineer | null>(null);

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <section id="engineers" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Featured Engineers
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Meet the Women Engineering Zimbabwe&apos;s Future
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Celebrating the innovators, leaders and professionals shaping the
            future of engineering across Zimbabwe.
          </p>
        </motion.div>

        <div className="mt-16">
          <FeaturedSpotlight
            engineer={SPOTLIGHT_ENGINEER}
            onOpen={() => setSelected(SPOTLIGHT_ENGINEER)}
          />
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={gridVariants}
          className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {ENGINEERS.map((engineer) => (
            <motion.div key={engineer.id} variants={cardVariants}>
              <EngineerCard
                engineer={engineer}
                onOpen={() => setSelected(engineer)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16">
          <QuoteBand />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mt-20 max-w-2xl text-center"
        >
          <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Know an Inspiring Woman Engineer?
          </h3>
          <p className="mt-4 font-sans text-lg leading-relaxed text-slate-custom">
            Help us grow this gallery &mdash; nominate an engineer making an
            impact across Zimbabwe.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
            >
              Submit Nomination
            </Link>
            <Link
              href="/membership"
              className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
            >
              Join WiEZ
            </Link>
          </div>
        </motion.div>
      </div>

      <EngineerModal engineer={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
