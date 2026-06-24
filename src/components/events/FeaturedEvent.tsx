"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import EventCountdown from "@/components/ui/EventCountdown";
import type { Event } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-ZW", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function FeaturedEvent({ event }: { event: Event }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 overflow-hidden rounded-[32px] border border-navy/5 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-[55%_45%]"
    >
      <div className="relative aspect-[16/11] lg:aspect-auto">
        <Image
          src={event.image}
          alt={event.title}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 55vw, 100vw"
        />
      </div>

      <div className="flex flex-col justify-center p-8 lg:p-12">
        <span
          className={
            event.registrationOpen
              ? "inline-flex w-fit items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1 font-nav text-xs font-semibold text-navy"
              : "inline-flex w-fit items-center gap-1.5 rounded-full bg-navy/5 px-3 py-1 font-nav text-xs font-semibold text-slate-custom"
          }
        >
          <span
            className={
              event.registrationOpen
                ? "h-1.5 w-1.5 rounded-full bg-lime"
                : "h-1.5 w-1.5 rounded-full bg-slate-custom"
            }
          />
          {event.registrationOpen ? "Registration Open" : "Registration Closed"}
        </span>

        <h3 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
          {event.title}
        </h3>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
          <span className="flex items-center gap-1.5 font-nav text-sm font-semibold text-navy/70">
            <Calendar className="h-4 w-4 shrink-0" />
            {DATE_FORMATTER.format(event.date)}
          </span>
          <span className="flex items-center gap-1.5 font-sans text-sm text-slate-custom">
            <MapPin className="h-4 w-4 shrink-0" />
            {event.location}
          </span>
        </div>

        <p className="mt-5 font-sans text-[16px] leading-relaxed text-slate-custom">
          {event.description}
        </p>

        <div className="mt-7">
          <EventCountdown targetDate={event.date} />
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/events/summit-2026/register"
            className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
          >
            Register Now
          </Link>
          <Link
            href="/events/summit-2026/agenda"
            className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
          >
            View Agenda
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
