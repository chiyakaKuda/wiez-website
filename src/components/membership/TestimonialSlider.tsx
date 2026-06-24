"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Engineer } from "@/components/engineers/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export type Testimonial = {
  engineer: Engineer;
  quote: string;
};

export default function TestimonialSlider({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  const go = (direction: 1 | -1) =>
    setIndex((i) => (i + direction + testimonials.length) % testimonials.length);

  return (
    <div className="relative mx-auto max-w-3xl">
      <Quote
        aria-hidden
        className="absolute -left-2 -top-8 hidden h-14 w-14 text-navy/10 sm:-left-6 sm:block"
        strokeWidth={1}
      />

      <div className="overflow-hidden rounded-[28px] border border-navy/5 bg-white p-8 shadow-[0_20px_50px_-25px_rgba(15,23,42,0.2)] sm:p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.engineer.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-col items-center text-center"
          >
            <p className="font-heading text-xl font-semibold leading-snug text-navy sm:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </p>

            <div className="mt-6 flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={current.engineer.photo}
                  alt={`Portrait of ${current.engineer.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-left">
                <p className="font-nav text-sm font-semibold text-navy">
                  {current.engineer.name}
                </p>
                <p className="font-sans text-xs text-slate-custom">
                  {current.engineer.discipline}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.engineer.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-lime" : "w-2 bg-navy/15"
              )}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next testimonial"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
