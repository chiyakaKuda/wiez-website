"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const SLIDES = [
  {
    src: "/images/female-technician-supervising-automated-production-line.jpg",
    alt: "A technician monitoring an automated production line",
  },
  {
    src: "/images/portrait-professional-young-black-woman-civil-engineer-architecture-worker-wearing-hard-hat-safety-working-construction-site-warehouseusing-laptop-work.jpg",
    alt: "A civil engineer on a construction site holding a tablet",
  },
  {
    src: "/images/automation-expert-smart-industrial-factory.jpg",
    alt: "An automation expert in a smart industrial factory",
  },
];

const SLIDE_DURATION = 6000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <AnimatePresence>
        <motion.div
          key={SLIDES[index].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: EASE }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>
      </AnimatePresence>

      {/* Legibility scrim — strongest over the text column on the left,
          lighter on the right so the photo still reads behind the glass cards. */}
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-white/50" />

      <div className="absolute inset-0 flex items-end justify-center gap-2 pb-6 lg:hidden">
        {SLIDES.map((slide, i) => (
          <span
            key={slide.src}
            className={
              i === index
                ? "h-1.5 w-6 rounded-full bg-navy transition-all duration-300"
                : "h-1.5 w-1.5 rounded-full bg-navy/25 transition-all duration-300"
            }
          />
        ))}
      </div>
    </div>
  );
}
