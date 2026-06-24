"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { EVENTS, FEATURED_EVENT, CATEGORIES, PAST_EVENTS_GALLERY } from "@/components/events/data";
import type { EventCategory } from "@/components/events/types";
import FeaturedEvent from "@/components/events/FeaturedEvent";
import EventsTimeline from "@/components/events/EventsTimeline";
import CategoryFilter from "@/components/events/CategoryFilter";
import EventCard from "@/components/events/EventCard";
import PastEventsGallery from "@/components/events/PastEventsGallery";

const EASE = [0.22, 1, 0.36, 1] as const;
const ALL = "All Events" as const;

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Events() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | typeof ALL>(ALL);

  const filteredEvents = useMemo(() => {
    if (activeCategory === ALL) return EVENTS;
    return EVENTS.filter((event) => event.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="events" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Upcoming Events
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Connect, Learn and Grow
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Join engineering events, leadership forums, mentorship sessions
            and networking opportunities happening across Zimbabwe.
          </p>
        </motion.div>

        <div className="mt-14">
          <FeaturedEvent event={FEATURED_EVENT} />
        </div>

        <div className="mt-20">
          <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Events Timeline
          </h3>
          <div className="mt-8">
            <EventsTimeline events={EVENTS} />
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-center font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Browse by Category
          </h3>
          <div className="mt-8">
            <CategoryFilter
              categories={CATEGORIES}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          <motion.div
            key={activeCategory}
            initial="hidden"
            animate="show"
            variants={gridVariants}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredEvents.map((event) => (
              <motion.div key={event.id} variants={cardVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="mt-20">
          <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Past Events Gallery
          </h3>
          <p className="mt-2 font-sans text-base text-slate-custom">
            A look back at the moments, sessions and faces from our recent
            events.
          </p>
          <div className="mt-8">
            <PastEventsGallery photos={PAST_EVENTS_GALLERY} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mt-20 max-w-2xl rounded-[32px] border border-navy/5 bg-navy/[0.03] px-8 py-12 text-center lg:px-16 lg:py-14"
        >
          <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Never Miss an Opportunity
          </h3>
          <p className="mt-4 font-sans text-lg leading-relaxed text-slate-custom">
            Stay informed about upcoming engineering events and professional
            development opportunities.
          </p>

          <button
            type="button"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
          >
            <Bell className="h-4 w-4" />
            Subscribe to Event Updates
          </button>
        </motion.div>
      </div>
    </section>
  );
}
