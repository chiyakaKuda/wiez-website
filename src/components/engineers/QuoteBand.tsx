"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function QuoteBand() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="grid grid-cols-1 items-center gap-8 rounded-[32px] border border-navy/5 bg-navy/[0.03] px-8 py-12 sm:grid-cols-[auto_1fr] sm:gap-10 lg:px-16 lg:py-16"
    >
      <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full ring-4 ring-lime/30 sm:h-32 sm:w-32">
        <Image
          src="/images/automation-expert-smart-industrial-factory.jpg"
          alt="Portrait of a Women in Engineering Zimbabwe member"
          fill
          className="object-cover"
        />
      </div>

      <div className="relative text-center sm:text-left">
        <Quote
          aria-hidden
          className="absolute -left-1 -top-8 hidden h-12 w-12 text-navy/10 sm:block"
          strokeWidth={1}
        />
        <p className="font-heading text-2xl font-semibold leading-snug text-navy sm:text-3xl">
          &ldquo;Engineering is not only about building structures. It is
          about building futures.&rdquo;
        </p>
        <p className="mt-4 flex items-center justify-center gap-2 font-nav text-sm font-semibold uppercase tracking-wider text-navy sm:justify-start">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          Voice of WiEZ
        </p>
      </div>
    </motion.div>
  );
}
