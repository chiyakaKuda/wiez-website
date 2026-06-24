"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Quote } from "lucide-react";
import type { FeaturedStory as FeaturedStoryData } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function FeaturedStory({
  story,
}: {
  story: FeaturedStoryData;
}) {
  const { engineer } = story;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="grid grid-cols-1 overflow-hidden rounded-[32px] border border-navy/5 bg-white shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)] lg:grid-cols-[42%_58%]"
    >
      <div className="relative aspect-[4/5] lg:aspect-auto">
        <Image
          src={engineer.photo}
          alt={`Portrait of ${engineer.name}`}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 1024px) 42vw, 100vw"
        />
        <span className="absolute left-5 top-5 rounded-full bg-lime px-4 py-1.5 font-nav text-xs font-bold uppercase tracking-wider text-navy">
          Success Story
        </span>
      </div>

      <div className="relative flex flex-col justify-center p-8 lg:p-12">
        <Quote
          aria-hidden
          className="absolute right-8 top-8 hidden h-16 w-16 text-navy/[0.06] lg:block"
          strokeWidth={1}
        />

        <h3 className="font-heading text-3xl font-extrabold text-navy sm:text-4xl">
          {engineer.name}
        </h3>
        <p className="mt-2 font-nav text-base font-semibold text-navy/70">
          {engineer.discipline}
        </p>
        <p className="mt-0.5 font-sans text-sm text-slate-custom">
          {story.position}
        </p>

        <p className="mt-6 border-l-4 border-lime pl-5 font-heading text-lg font-medium italic leading-relaxed text-navy/90 sm:text-xl">
          &ldquo;{story.story}&rdquo;
        </p>

        <ul className="mt-7 space-y-2.5">
          {story.achievements.map((achievement) => (
            <li
              key={achievement}
              className="flex items-start gap-2.5 font-sans text-sm text-navy/90"
            >
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime/15">
                <Check className="h-3 w-3 text-navy" strokeWidth={3} />
              </span>
              {achievement}
            </li>
          ))}
        </ul>

        <Link
          href={`/success-stories/${engineer.id}`}
          className="mt-8 inline-flex w-fit items-center justify-center rounded-full bg-navy px-7 py-3.5 font-nav text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
        >
          Read Full Story
        </Link>
      </div>
    </motion.div>
  );
}
