"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export default function BenefitTile({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-3 rounded-2xl border border-navy/5 bg-white p-6 text-center shadow-[0_6px_20px_-10px_rgba(15,23,42,0.10)] transition-shadow duration-300 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.18)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy/5">
        <Icon className="h-6 w-6 text-navy" strokeWidth={1.75} />
      </div>
      <p className="font-nav text-sm font-semibold text-navy">{label}</p>
    </motion.div>
  );
}
