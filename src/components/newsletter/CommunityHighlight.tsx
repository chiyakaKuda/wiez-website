"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ENGINEERS } from "@/components/engineers/data";

const AVATAR_IDS = [
  "rutendo-chikafu",
  "nyasha-mutasa",
  "chiedza-moyo",
  "tariro-madziva",
];

const AVATARS = AVATAR_IDS.map(
  (id) => ENGINEERS.find((engineer) => engineer.id === id)!
);

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CommunityHighlight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="mx-auto max-w-2xl rounded-[28px] border border-white/15 bg-white/10 px-8 py-10 text-center backdrop-blur-xl"
    >
      <p className="font-heading text-xl font-semibold leading-snug text-white sm:text-2xl">
        &ldquo;Together we are building a stronger, more inclusive
        engineering future for Zimbabwe.&rdquo;
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <div className="flex items-center -space-x-3">
          {AVATARS.map((engineer, i) => (
            <motion.div
              key={engineer.id}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
              className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-navy"
            >
              <Image
                src={engineer.photo}
                alt={`Portrait of ${engineer.name}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
          <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-navy bg-lime font-nav text-xs font-bold text-navy">
            500+
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
          </span>
          <span className="font-nav text-xs font-semibold text-white/70">
            24 engineers joined this week
          </span>
        </div>
      </div>
    </motion.div>
  );
}
