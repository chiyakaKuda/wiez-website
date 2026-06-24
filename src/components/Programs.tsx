"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Check,
  GraduationCap,
  Lightbulb,
  Network,
  Users,
} from "lucide-react";
import ProgramCard from "@/components/programs/ProgramCard";
import MentorIllustration from "@/components/programs/MentorIllustration";

const EASE = [0.22, 1, 0.36, 1] as const;

const PROGRAMS = [
  {
    icon: Users,
    title: "Mentorship Program",
    description:
      "Connect students and graduates with experienced engineers for guidance and career growth.",
    href: "/programs/mentorship",
  },
  {
    icon: Award,
    title: "Leadership Development",
    description:
      "Build leadership skills through workshops, coaching and executive development programs.",
    href: "/programs/leadership",
  },
  {
    icon: GraduationCap,
    title: "STEM Outreach",
    description:
      "Inspire the next generation of girls through school visits and STEM engagement initiatives.",
    href: "/programs/stem-outreach",
  },
  {
    icon: Lightbulb,
    title: "Research & Innovation",
    description:
      "Support research, innovation and technical excellence across engineering disciplines.",
    href: "/programs/research",
  },
  {
    icon: Briefcase,
    title: "Scholarships & Opportunities",
    description:
      "Provide access to scholarships, internships and career opportunities.",
    href: "/programs/scholarships",
  },
  {
    icon: Network,
    title: "Networking & Events",
    description:
      "Create connections through conferences, networking events and professional gatherings.",
    href: "/programs/networking",
  },
];

const FEATURES = [
  "One-on-one mentorship",
  "Career development support",
  "Professional networking",
  "Industry exposure",
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

export default function Programs() {
  return (
    <section id="programs" className="relative bg-white py-24 lg:py-32">
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
              What We Do
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Empowering Women Through Programs That Create Impact
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            From mentorship and leadership development to STEM outreach and
            professional networking, WiEZ creates opportunities that help
            women engineers thrive.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={gridVariants}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {PROGRAMS.map((program) => (
            <motion.div key={program.title} variants={cardVariants}>
              <ProgramCard
                icon={program.icon}
                title={program.title}
                description={program.description}
                href={program.href}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-20 grid grid-cols-1 gap-12 rounded-[32px] bg-gradient-to-br from-navy/[0.04] to-lime/[0.07] p-8 lg:grid-cols-2 lg:items-center lg:gap-16 lg:p-16"
        >
          <div>
            <h3 className="font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
              Mentorship That Transforms Careers
            </h3>
            <p className="mt-5 font-sans text-[17px] leading-relaxed text-slate-custom">
              Our mentorship program connects aspiring engineers with
              experienced professionals who provide guidance, support and
              industry insights.
            </p>

            <ul className="mt-8 space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime">
                    <Check className="h-3 w-3 text-navy" strokeWidth={3} />
                  </span>
                  <span className="font-sans text-[15px] text-navy/90">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/programs/mentorship/mentee"
                className="inline-flex items-center justify-center rounded-full bg-lime px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-transform duration-300 hover:scale-105"
              >
                Become a Mentee
              </Link>
              <Link
                href="/programs/mentorship/mentor"
                className="inline-flex items-center justify-center rounded-full border border-navy/15 px-7 py-3.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                Become a Mentor
              </Link>
            </div>
          </div>

          <MentorIllustration />
        </motion.div>
      </div>
    </section>
  );
}
