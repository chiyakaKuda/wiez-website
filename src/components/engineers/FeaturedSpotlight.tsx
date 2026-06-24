"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import EngineerBadge from "./EngineerBadge";
import type { Engineer } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FeaturedSpotlight({
  engineer,
  onOpen,
}: {
  engineer: Engineer;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 overflow-hidden rounded-[32px] border border-navy/5 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-[42%_58%]"
    >
      <div className="relative aspect-[4/5] lg:aspect-auto">
        <Image
          src={engineer.photo}
          alt={`Portrait of ${engineer.name}`}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, 100vw"
        />
        <span className="absolute left-5 top-5 rounded-full bg-lime px-4 py-1.5 font-nav text-xs font-bold uppercase tracking-wider text-navy">
          Engineer of the Month
        </span>
      </div>

      <div className="flex flex-col justify-center p-8 lg:p-12">
        <h3 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          {engineer.name}
        </h3>
        <p className="mt-2 font-nav text-base font-semibold text-navy/70">
          {engineer.discipline} &mdash; {engineer.organization}
        </p>

        <p className="mt-6 font-sans text-[17px] leading-relaxed text-slate-custom">
          {engineer.fullBio}
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {engineer.badges.map((badge) => (
            <EngineerBadge key={badge} label={badge} />
          ))}
        </div>

        <ul className="mt-6 space-y-2">
          {engineer.achievements.slice(0, 3).map((achievement) => (
            <li
              key={achievement}
              className="flex items-start gap-2 font-sans text-sm text-navy/90"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
              {achievement}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onOpen}
            className="inline-flex items-center justify-center rounded-full bg-navy px-6 py-3 font-nav text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
          >
            View Full Profile
          </button>
          <a
            href={engineer.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-6 py-3 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
          >
            <LinkedinIcon className="h-4 w-4" />
            LinkedIn
          </a>
        </div>
      </div>
    </motion.div>
  );
}
