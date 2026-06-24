"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  Calendar,
  Crown,
  GraduationCap,
  Network,
  Rocket,
  Sparkles,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { ENGINEERS } from "@/components/engineers/data";
import TierCard from "@/components/membership/TierCard";
import BenefitTile from "@/components/membership/BenefitTile";
import TestimonialSlider, {
  type Testimonial,
} from "@/components/membership/TestimonialSlider";
import CTAPattern from "@/components/ui/CTAPattern";
import StatCard from "@/components/ui/StatCard";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIERS = [
  {
    icon: GraduationCap,
    title: "Student Member",
    idealFor: "Students pursuing engineering studies.",
    benefits: [
      "Mentorship opportunities",
      "STEM programs",
      "Career guidance",
      "Scholarship opportunities",
      "Networking events",
    ],
    buttonLabel: "Join as Student",
    href: "/membership/student",
  },
  {
    icon: Rocket,
    title: "Graduate Member",
    idealFor: "Recent graduates entering the profession.",
    benefits: [
      "Career development support",
      "Industry exposure",
      "Mentorship matching",
      "Professional workshops",
      "Networking opportunities",
    ],
    buttonLabel: "Join as Graduate",
    href: "/membership/graduate",
  },
  {
    icon: Crown,
    title: "Professional Member",
    benefits: [
      "Leadership opportunities",
      "Industry recognition",
      "Speaking opportunities",
      "Conference discounts",
      "Professional networking",
      "Access to exclusive resources",
    ],
    buttonLabel: "Become a Professional Member",
    href: "/membership/professional",
    popular: true,
  },
  {
    icon: Building2,
    title: "Corporate Partner",
    benefits: [
      "Talent pipeline access",
      "Employer branding",
      "Event sponsorship opportunities",
      "Industry collaboration",
      "Recruitment visibility",
    ],
    buttonLabel: "Become a Corporate Partner",
    href: "/membership/corporate",
  },
];

const BENEFITS = [
  { icon: Network, label: "Professional Networking" },
  { icon: Users, label: "Mentorship Programs" },
  { icon: Award, label: "Leadership Development" },
  { icon: Trophy, label: "Industry Recognition" },
  { icon: GraduationCap, label: "Scholarship Opportunities" },
  { icon: TrendingUp, label: "Career Growth" },
  { icon: Sparkles, label: "Exclusive Resources" },
  { icon: Calendar, label: "Engineering Events" },
];

const METRICS = [
  { icon: Users, value: 500, suffix: "+", label: "Active Members" },
  { icon: Calendar, value: 100, suffix: "+", label: "Annual Events" },
  { icon: Building2, value: 20, suffix: "+", label: "Corporate Partners" },
  { icon: Network, value: 8, suffix: "", label: "Provinces Represented" },
];

const engineerById = (id: string) =>
  ENGINEERS.find((engineer) => engineer.id === id)!;

const TESTIMONIALS: Testimonial[] = [
  {
    engineer: engineerById("rutendo-chikafu"),
    quote:
      "Joining WiEZ connected me with mentors and opportunities that accelerated my engineering career.",
  },
  {
    engineer: engineerById("chiedza-moyo"),
    quote:
      "The leadership workshops gave me the confidence to speak up in rooms I used to stay quiet in.",
  },
  {
    engineer: engineerById("tariro-madziva"),
    quote:
      "Through WiEZ's network, I found mentors who pushed me to think bigger about what I could build.",
  },
];

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

export default function Membership() {
  return (
    <section id="membership" className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Membership
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Unlock Opportunities. Expand Your Network. Accelerate Your
            Career.
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Join a growing community of women engineers dedicated to
            leadership, innovation and professional excellence.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:items-start"
        >
          {TIERS.map((tier) => (
            <motion.div key={tier.title} variants={cardVariants}>
              <TierCard {...tier} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-24">
          <h3 className="text-center font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Everything Your Membership Unlocks
          </h3>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={gridVariants}
            className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4"
          >
            {BENEFITS.map((benefit) => (
              <motion.div key={benefit.label} variants={cardVariants}>
                <BenefitTile icon={benefit.icon} label={benefit.label} />
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
          className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {METRICS.map((metric, i) => (
            <motion.div key={metric.label} variants={cardVariants}>
              <StatCard
                icon={metric.icon}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                delay={i * 0.08}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-24">
          <TestimonialSlider testimonials={TESTIMONIALS} />
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
              Become Part of Zimbabwe&apos;s Leading Community of Women
              Engineers
            </h3>
            <p className="mx-auto mt-4 max-w-xl font-sans text-lg leading-relaxed text-slate-custom">
              Join hundreds of women engineers shaping the future of
              engineering across Zimbabwe.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/membership"
                className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
              >
                Become a Member
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
