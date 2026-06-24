"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Check, GraduationCap, Landmark, Network } from "lucide-react";
import {
  MARQUEE_PARTNERS,
  PARTNERS,
  IMPACT_METRICS,
  PARTNERSHIP_BENEFITS,
  FEATURED_SPONSOR,
} from "@/components/partners/data";
import LogoMarquee from "@/components/partners/LogoMarquee";
import PartnerCard from "@/components/partners/PartnerCard";
import PartnershipNetworkGraphic from "@/components/partners/PartnershipNetworkGraphic";
import FeaturedSponsor from "@/components/partners/FeaturedSponsor";
import StatCard from "@/components/ui/StatCard";
import CTAPattern from "@/components/ui/CTAPattern";

const EASE = [0.22, 1, 0.36, 1] as const;

const METRIC_ICONS = [Building2, GraduationCap, Landmark, Network];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function Partners() {
  return (
    <section id="partners" className="relative bg-white py-24 lg:py-32">
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
              Partners &amp; Sponsors
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Building the Future Together
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            WiEZ collaborates with industry leaders, academic institutions,
            government agencies and technology organizations to create
            opportunities for women engineers across Zimbabwe.
          </p>
        </motion.div>

        <div className="mt-14">
          <p className="text-center font-nav text-xs font-semibold uppercase tracking-[0.16em] text-slate-custom">
            Trusted By
          </p>
          <div className="mt-6">
            <LogoMarquee items={MARQUEE_PARTNERS} />
          </div>
        </div>

        <div className="mt-20">
          <h3 className="text-center font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Our Partners
          </h3>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={gridVariants}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {PARTNERS.map((partner) => (
              <motion.div key={partner.id} variants={cardVariants}>
                <PartnerCard partner={partner} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {IMPACT_METRICS.map((metric, i) => (
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

        <div className="mt-24 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="order-2 lg:order-1"
          >
            <PartnershipNetworkGraphic />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="order-1 lg:order-2"
          >
            <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Why Partner With WiEZ?
            </h3>

            <ul className="mt-7 space-y-3">
              {PARTNERSHIP_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/15">
                    <Check className="h-3 w-3 text-navy" strokeWidth={3} />
                  </span>
                  <span className="font-sans text-sm leading-relaxed text-navy/90">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/partners/become-a-partner"
                className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
              >
                Become a Partner
              </Link>
              <Link
                href="/partners/sponsor-an-event"
                className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                Sponsor an Event
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-24">
          <FeaturedSponsor sponsor={FEATURED_SPONSOR} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto mt-24 max-w-4xl overflow-hidden rounded-[32px] bg-navy/[0.03] px-8 py-14 text-center lg:px-16 lg:py-20"
        >
          <CTAPattern />

          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Interested in Partnering With WiEZ?
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-sans text-lg leading-relaxed text-slate-custom">
              Join a growing network of organizations committed to
              empowering women engineers and advancing innovation across
              Zimbabwe.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/partners/become-a-partner"
                className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
              >
                Become a Partner
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
