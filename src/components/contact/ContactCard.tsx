"use client";

import { motion } from "framer-motion";
import type { ContactCardData } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactCard({ card }: { card: ContactCardData }) {
  const Icon = card.icon;
  const content = (
    <>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy/5 transition-colors duration-300 group-hover:bg-lime/15">
        <Icon className="h-5 w-5 text-navy" strokeWidth={1.75} />
      </div>
      <div>
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
          {card.label}
        </p>
        <p className="mt-0.5 font-sans text-[15px] font-semibold text-navy">
          {card.value}
        </p>
      </div>
    </>
  );

  const className =
    "group flex items-center gap-4 rounded-[20px] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-shadow duration-300 hover:shadow-[0_20px_45px_-15px_rgba(15,23,42,0.22)]";

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: EASE }}>
      {card.href ? (
        <a href={card.href} className={className}>
          {content}
        </a>
      ) : (
        <div className={className}>{content}</div>
      )}
    </motion.div>
  );
}
