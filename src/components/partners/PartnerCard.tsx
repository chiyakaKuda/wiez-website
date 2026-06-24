"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { Partner } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex h-full flex-col rounded-[24px] border border-transparent bg-white p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22),0_0_0_1px_rgba(163,230,53,0.4)]"
    >
      <div className="relative h-12 w-full">
        <Image
          src={partner.logo}
          alt={partner.name}
          fill
          className="object-contain object-left"
          sizes="160px"
        />
      </div>

      <span className="mt-5 inline-flex w-fit items-center rounded-full bg-navy/5 px-2.5 py-1 font-nav text-[11px] font-semibold text-navy/70">
        {partner.category}
      </span>

      <h3 className="mt-3 font-heading text-base font-extrabold text-navy">
        {partner.name}
      </h3>

      <p className="mt-2 flex-1 font-sans text-sm leading-relaxed text-slate-custom">
        {partner.description}
      </p>

      <a
        href={partner.website}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-1.5 font-nav text-sm font-semibold text-navy"
      >
        Visit Website
        <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </motion.div>
  );
}
