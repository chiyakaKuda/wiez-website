"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

type StatCardProps = {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
};

export default function StatCard({
  icon: Icon,
  value,
  suffix = "",
  label,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[20px] bg-white p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.22)]"
    >
      <span className="absolute inset-x-0 top-0 h-1.5 bg-lime" />

      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5">
        <Icon className="h-6 w-6 text-navy" strokeWidth={1.75} />
      </div>

      <div className="mt-6">
        <AnimatedNumber
          value={value}
          suffix={suffix}
          duration={2}
          delay={delay}
          className="font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl"
        />
      </div>

      <p className="mt-2 font-sans text-sm text-slate-custom">{label}</p>
    </motion.div>
  );
}
