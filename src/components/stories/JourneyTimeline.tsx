"use client";

import { motion } from "framer-motion";
import {
  BadgeCheck,
  Crown,
  GraduationCap,
  Rocket,
  Users,
  type LucideIcon,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ICONS: LucideIcon[] = [GraduationCap, Rocket, BadgeCheck, Crown, Users];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function JourneyTimeline({
  stages,
}: {
  stages: { title: string; description: string }[];
}) {
  return (
    <div className="relative">
      <div className="absolute left-0 top-7 hidden h-px w-full bg-navy/10 lg:block" />
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.1, ease: EASE }}
        style={{ transformOrigin: "left" }}
        className="absolute left-0 top-7 hidden h-px w-full bg-lime lg:block"
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={containerVariants}
        className="relative flex flex-col gap-8 lg:flex-row lg:justify-between lg:gap-4"
      >
        {stages.map((stage, i) => {
          const Icon = ICONS[i % ICONS.length];
          const isLast = i === stages.length - 1;

          return (
            <motion.div
              key={stage.title}
              variants={stepVariants}
              className="relative flex items-start gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center"
            >
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute left-7 top-14 h-[calc(100%-1rem)] w-px bg-navy/10 lg:hidden"
                />
              )}

              <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-navy">
                <Icon className="h-6 w-6 text-lime" strokeWidth={1.75} />
              </div>

              <div className="lg:max-w-[170px]">
                <h4 className="font-heading text-base font-extrabold text-navy">
                  {stage.title}
                </h4>
                <p className="mt-1 font-sans text-sm leading-relaxed text-slate-custom">
                  {stage.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
