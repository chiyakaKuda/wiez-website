"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import NewsletterPattern from "@/components/newsletter/NewsletterPattern";
import SubscribeForm from "@/components/newsletter/SubscribeForm";
import CommunityHighlight from "@/components/newsletter/CommunityHighlight";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

const EASE = [0.22, 1, 0.36, 1] as const;

const RECEIVE_ITEMS = [
  "Event Invitations",
  "Engineering Opportunities",
  "Mentorship Updates",
  "Scholarships & Internships",
  "Industry News",
  "Leadership Programs",
];

const SOCIAL_PROOF = [
  { value: 500, suffix: "+", label: "Members" },
  { value: 100, suffix: "+", label: "Events" },
  { value: 20, suffix: "+", label: "Partners" },
  { value: 8, suffix: "", label: "Provinces" },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export default function Newsletter() {
  return (
    <section className="relative isolate overflow-hidden bg-navy py-24 lg:py-32">
      <NewsletterPattern />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            Join Zimbabwe&apos;s Largest Community of{" "}
            <span className="text-lime">Women Engineers</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="mx-auto mt-6 max-w-2xl font-sans text-lg leading-relaxed text-white/70"
          >
            Join a growing network of students, graduates, professionals and
            industry leaders shaping the future of engineering across
            Zimbabwe.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {RECEIVE_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/20">
                  <Check className="h-3 w-3 text-lime" strokeWidth={3} />
                </span>
                <span className="font-sans text-sm text-white/80">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12">
            <SubscribeForm />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {SOCIAL_PROOF.map((stat, i) => (
              <div key={stat.label}>
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                  delay={i * 0.1}
                  className="font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
                />
                <div className="mt-1 font-sans text-sm text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-14">
            <CommunityHighlight />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
