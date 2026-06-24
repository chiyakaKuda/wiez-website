"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

type ProgramCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
};

export default function ProgramCard({
  icon: Icon,
  title,
  description,
  href,
}: ProgramCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group relative flex h-full flex-col rounded-[24px] border border-transparent bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22)]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 transition-colors duration-300 group-hover:bg-lime/15">
        <Icon
          className="h-7 w-7 text-navy transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
          strokeWidth={1.75}
        />
      </div>

      <h3 className="mt-6 font-heading text-xl font-extrabold text-navy">
        {title}
      </h3>
      <p className="mt-3 flex-1 font-sans text-[15px] leading-relaxed text-slate-custom">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-1.5 font-nav text-sm font-semibold text-navy"
      >
        Learn More
        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </motion.div>
  );
}
