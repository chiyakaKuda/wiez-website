"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type FeaturedSponsorData = {
  name: string;
  tagline: string;
  story: string;
  impact: string;
  href: string;
};

export default function FeaturedSponsor({
  sponsor,
}: {
  sponsor: FeaturedSponsorData;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden rounded-[32px] border border-navy/5 bg-white p-8 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)] lg:p-14"
    >
      <span className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-nav text-xs font-semibold text-navy">
        <Sparkles className="h-3.5 w-3.5" />
        Featured Sponsor
      </span>

      <div className="mt-5 flex h-16 items-center rounded-2xl bg-navy/5 px-5 w-fit">
        <span className="font-heading text-xl font-extrabold text-navy">
          {sponsor.name}
        </span>
      </div>
      <p className="mt-2 font-sans text-sm text-slate-custom">
        {sponsor.tagline}
      </p>

      <p className="mt-6 max-w-3xl font-sans text-[17px] leading-relaxed text-slate-custom">
        {sponsor.story}
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl bg-navy/[0.03] p-5">
        <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-lime" />
        <p className="font-sans text-sm leading-relaxed text-navy/90">
          <span className="font-nav font-semibold text-navy">
            Impact created:
          </span>{" "}
          {sponsor.impact}
        </p>
      </div>

      <Link
        href={sponsor.href}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-navy px-7 py-3.5 font-nav text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
      >
        Read the Case Study
      </Link>
    </motion.div>
  );
}
