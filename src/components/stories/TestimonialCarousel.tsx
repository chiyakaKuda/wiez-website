"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { animate, motion, useMotionValue } from "framer-motion";
import { Quote } from "lucide-react";
import type { Testimonial } from "./data";

const AUTO_SCROLL_MS = 6000;
const GAP_PX = 24;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function TestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const offsetPx = useRef(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      const outer = outerRef.current;
      const track = trackRef.current;
      if (!outer || !track) return;

      const card = track.querySelector<HTMLElement>("[data-card]");
      const step = (card?.offsetWidth ?? outer.clientWidth) + GAP_PX;
      const maxOffset = Math.max(0, track.scrollWidth - outer.clientWidth);

      let next = offsetPx.current + step;
      if (next > maxOffset + 4) next = 0;
      offsetPx.current = next;

      animate(x, -next, { duration: 0.6, ease: EASE });
    }, AUTO_SCROLL_MS);
    return () => clearInterval(interval);
  }, [paused, x]);

  return (
    <div
      ref={outerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="overflow-hidden"
    >
      <motion.div ref={trackRef} style={{ x }} className="flex gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.engineer.id}
            data-card
            className="flex w-full shrink-0 flex-col rounded-[24px] border border-navy/5 bg-white p-7 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <Quote aria-hidden className="h-7 w-7 text-lime" strokeWidth={1.5} />
            <p className="mt-4 flex-1 font-sans text-[15px] leading-relaxed text-navy/90">
              &ldquo;{testimonial.quote}&rdquo;
            </p>

            <div className="mt-6 flex items-center gap-3 border-t border-navy/5 pt-5">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={testimonial.engineer.photo}
                  alt={`Portrait of ${testimonial.engineer.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-nav text-sm font-semibold text-navy">
                  {testimonial.engineer.name}
                </p>
                <p className="font-sans text-xs text-slate-custom">
                  {testimonial.engineer.discipline} &middot;{" "}
                  {testimonial.engineer.organization}
                </p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
