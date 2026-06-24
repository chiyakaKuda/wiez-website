"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

type TierCardProps = {
  icon: LucideIcon;
  title: string;
  idealFor?: string;
  benefits: string[];
  buttonLabel: string;
  href: string;
  popular?: boolean;
};

export default function TierCard({
  icon: Icon,
  title,
  idealFor,
  benefits,
  buttonLabel,
  href,
  popular = false,
}: TierCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={cn(
        "group relative flex h-full flex-col rounded-[24px] border bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300",
        popular
          ? "border-lime shadow-[0_28px_60px_-20px_rgba(15,23,42,0.28)] lg:-translate-y-3"
          : "border-transparent hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22)]"
      )}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-lime px-4 py-1 font-nav text-[11px] font-bold uppercase tracking-wider text-navy shadow-md">
          Most Popular
        </span>
      )}

      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300",
          popular ? "bg-lime/15" : "bg-navy/5 group-hover:bg-lime/15"
        )}
      >
        <Icon className="h-6 w-6 text-navy" strokeWidth={1.75} />
      </div>

      <h3 className="mt-6 font-heading text-xl font-extrabold text-navy">
        {title}
      </h3>
      {idealFor && (
        <p className="mt-1.5 font-sans text-sm text-slate-custom">
          Ideal for: {idealFor}
        </p>
      )}

      <ul className="mt-6 flex-1 space-y-3">
        {benefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/15">
              <Check className="h-3 w-3 text-navy" strokeWidth={3} />
            </span>
            <span className="font-sans text-sm leading-relaxed text-navy/90">
              {benefit}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={href}
        className={cn(
          "mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-center font-nav text-sm font-semibold transition-transform duration-300 hover:scale-105",
          popular
            ? "bg-lime text-navy"
            : "border border-navy/15 text-navy hover:bg-navy/5"
        )}
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
}
