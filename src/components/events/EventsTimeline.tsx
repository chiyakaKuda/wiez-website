"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Event } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-ZW", { month: "short" });

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const rowVariants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function EventsTimeline({ events }: { events: Event[] }) {
  const sorted = [...events].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <motion.ol
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className="relative"
    >
      <span
        aria-hidden
        className="absolute left-[27px] top-2 h-[calc(100%-1rem)] w-px bg-navy/10 sm:left-[35px]"
      />

      {sorted.map((event) => (
        <motion.li
          key={event.id}
          variants={rowVariants}
          className="relative flex items-start gap-5 py-5 sm:gap-7"
        >
          <div className="flex w-14 shrink-0 flex-col items-center rounded-2xl bg-navy py-2.5 sm:w-[70px]">
            <span className="font-nav text-[10px] font-bold uppercase tracking-wider text-lime">
              {MONTH_FORMATTER.format(event.date)}
            </span>
            <span className="font-heading text-lg font-extrabold text-white">
              {event.date.getDate()}
            </span>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-between gap-3 border-b border-navy/5 pb-5">
            <div>
              <span className="inline-flex items-center rounded-full bg-navy/5 px-2.5 py-0.5 font-nav text-[11px] font-semibold text-navy/70">
                {event.category}
              </span>
              <h4 className="mt-1.5 font-heading text-lg font-extrabold text-navy">
                {event.title}
              </h4>
              <p className="mt-1 flex items-center gap-1.5 font-sans text-sm text-slate-custom">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {event.location}
              </p>
            </div>

            <Link
              href={`/events/${event.id}/register`}
              className="inline-flex items-center justify-center rounded-full border border-navy/15 px-5 py-2 font-nav text-xs font-semibold text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
            >
              {event.registrationOpen ? "Register" : "Join Waitlist"}
            </Link>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
