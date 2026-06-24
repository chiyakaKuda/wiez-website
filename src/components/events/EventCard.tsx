"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Event } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-ZW", { month: "short" });

export default function EventCard({ event }: { event: Event }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-transparent bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22),0_0_0_1px_rgba(163,230,53,0.4)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />

        <span className="absolute left-4 top-4 flex flex-col items-center rounded-lg bg-white px-2.5 py-1.5 shadow-md">
          <span className="font-nav text-[10px] font-bold uppercase tracking-wider text-lime">
            {MONTH_FORMATTER.format(event.date)}
          </span>
          <span className="font-heading text-base font-extrabold leading-none text-navy">
            {event.date.getDate()}
          </span>
        </span>

        <span className="absolute right-4 top-4 rounded-full bg-navy/80 px-3 py-1 font-nav text-[11px] font-semibold text-white backdrop-blur-sm">
          {event.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-lg font-extrabold text-navy">
          {event.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 font-sans text-xs text-slate-custom">
          <MapPin className="h-3 w-3 shrink-0" />
          {event.location}
        </p>
        <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-slate-custom">
          {event.description}
        </p>

        <Link
          href={`/events/${event.id}/register`}
          className="mt-5 inline-flex items-center justify-center rounded-full border border-navy/15 px-5 py-2.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
        >
          {event.registrationOpen ? "Register" : "Join Waitlist"}
        </Link>
      </div>
    </motion.div>
  );
}
