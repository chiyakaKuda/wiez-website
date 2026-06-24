"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Trophy, Users, Briefcase } from "lucide-react";
import {
  FEATURED_STORY,
  TESTIMONIALS,
  ACHIEVEMENT_METRICS,
  JOURNEY_STAGES,
  GALLERY_PHOTOS,
} from "@/components/stories/data";
import FeaturedStory from "@/components/stories/FeaturedStory";
import TestimonialCarousel from "@/components/stories/TestimonialCarousel";
import JourneyTimeline from "@/components/stories/JourneyTimeline";
import PhotoGallery from "@/components/stories/PhotoGallery";
import StatCard from "@/components/ui/StatCard";
import CTAPattern from "@/components/ui/CTAPattern";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRIC_ICONS = [Trophy, Briefcase, Users, Building2];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function SuccessStories() {
  return (
    <section
      id="success-stories"
      className="relative bg-white py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Success Stories
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Inspiring Journeys. Real Impact.
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Discover how mentorship, networking and professional development
            through WiEZ have helped women engineers achieve their goals.
          </p>
        </motion.div>

        <div className="mt-16">
          <FeaturedStory story={FEATURED_STORY} />
        </div>

        <div className="mt-20">
          <h3 className="text-center font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            What Our Members Say
          </h3>
          <div className="mt-10">
            <TestimonialCarousel testimonials={TESTIMONIALS} />
          </div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {ACHIEVEMENT_METRICS.map((metric, i) => (
            <motion.div key={metric.label} variants={cardVariants}>
              <StatCard
                icon={METRIC_ICONS[i % METRIC_ICONS.length]}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                delay={i * 0.08}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20">
          <h3 className="text-center font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            The WiEZ Member Journey
          </h3>
          <p className="mx-auto mt-2 max-w-xl text-center font-sans text-base text-slate-custom">
            From first-year student to industry leader and mentor &mdash;
            WiEZ supports every stage of the journey.
          </p>
          <div className="mt-12">
            <JourneyTimeline stages={JOURNEY_STAGES} />
          </div>
        </div>

        <div className="mt-20">
          <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Moments From Our Community
          </h3>
          <div className="mt-8">
            <PhotoGallery photos={GALLERY_PHOTOS} />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto mt-20 max-w-4xl overflow-hidden rounded-[32px] bg-navy/[0.03] px-8 py-14 text-center lg:px-16 lg:py-20"
        >
          <CTAPattern />

          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Your Success Story Starts Here
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-sans text-lg leading-relaxed text-slate-custom">
              Join a community committed to helping women engineers grow,
              lead and succeed.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
              >
                Become a Member
              </Link>
              <Link
                href="/programs"
                className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                Explore Programs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
