"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

type SectionTeaserProps = {
  id?: string;
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  tone?: "light" | "tint";
  align?: "left" | "center";
  children?: React.ReactNode;
};

export default function SectionTeaser({
  id,
  eyebrow,
  title,
  description,
  href,
  ctaLabel,
  tone = "light",
  align = "left",
  children,
}: SectionTeaserProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-20 lg:py-24",
        tone === "tint" ? "bg-navy/[0.03]" : "bg-white"
      )}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={containerVariants}
          className={cn(
            "max-w-2xl",
            align === "center" && "mx-auto text-center"
          )}
        >
          <motion.div
            variants={itemVariants}
            className={cn(
              "flex items-center gap-2",
              align === "center" && "justify-center"
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              {eyebrow}
            </p>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl"
          >
            {title}
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mt-4 font-sans text-lg leading-relaxed text-slate-custom"
          >
            {description}
          </motion.p>

          {children && (
            <motion.div variants={itemVariants} className="mt-8">
              {children}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="mt-8">
            <Link
              href={href}
              className="group inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
