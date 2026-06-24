"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  Building2,
  Calendar,
  GraduationCap,
  MapPinned,
  Users,
} from "lucide-react";
import ImpactPattern from "@/components/impact/ImpactPattern";
import StatCard from "@/components/ui/StatCard";

const EASE = [0.22, 1, 0.36, 1] as const;

const STATS = [
  { icon: Users, value: 500, suffix: "+", label: "Members Nationwide" },
  { icon: Calendar, value: 100, suffix: "+", label: "Events Hosted" },
  { icon: Building2, value: 20, suffix: "+", label: "Corporate Partners" },
  { icon: MapPinned, value: 8, suffix: "", label: "Provinces Reached" },
  { icon: GraduationCap, value: 50, suffix: "+", label: "Mentors" },
  { icon: BookOpen, value: 1000, suffix: "+", label: "Students Reached" },
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

export default function Impact() {
  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32">
      <ImpactPattern />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
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
              Our Impact
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Driving Change Across Zimbabwe
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Empowering women engineers through mentorship, leadership,
            innovation and professional development.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridVariants}
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} variants={cardVariants}>
              <StatCard
                icon={stat.icon}
                value={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                delay={i * 0.08}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mx-auto mt-16 max-w-3xl border-l-4 border-lime bg-navy/[0.03] py-6 pl-8 pr-6"
        >
          <p className="font-heading text-xl font-semibold leading-snug text-navy sm:text-2xl">
            Building the future of engineering through collaboration,
            innovation and leadership.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
