"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function QuickActionCard({
  icon: Icon,
  title,
  description,
  buttonLabel,
  href,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonLabel: string;
  href: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex h-full flex-col rounded-[24px] border border-transparent bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22),0_0_0_1px_rgba(163,230,53,0.4)]"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy/5 transition-colors duration-300 group-hover:bg-lime/15">
        <Icon className="h-6 w-6 text-navy" strokeWidth={1.75} />
      </div>

      <h3 className="mt-6 font-heading text-lg font-extrabold text-navy">
        {title}
      </h3>
      <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-slate-custom">
        {description}
      </p>

      <Link
        href={href}
        className="mt-6 inline-flex items-center justify-center rounded-full border border-navy/15 px-6 py-3 font-nav text-sm font-semibold text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white"
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
}
