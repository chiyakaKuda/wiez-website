"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const ASPECTS = [
  "aspect-[3/4]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[2/3]",
];

export default function PastEventsGallery({ photos }: { photos: string[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    document.body.style.overflow = activeIndex !== null ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveIndex(null);
      if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? i : (i + 1) % photos.length));
      }
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) =>
          i === null ? i : (i - 1 + photos.length) % photos.length
        );
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, photos.length]);

  return (
    <div>
      <div className="columns-2 gap-4 sm:columns-3">
        {photos.map((photo, i) => (
          <button
            key={photo + i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label="Open photo in lightbox"
            className={`relative mb-4 block w-full overflow-hidden rounded-2xl ${ASPECTS[i % ASPECTS.length]}`}
          >
            <Image
              src={photo}
              alt="Photo from a past WiEZ event"
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(min-width: 640px) 33vw, 50vw"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            onClick={() => setActiveIndex(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              aria-label="Close lightbox"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) =>
                  i === null ? i : (i - 1 + photos.length) % photos.length
                );
              }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="relative h-[70vh] w-full max-w-3xl"
            >
              <Image
                src={photos[activeIndex]}
                alt="Photo from a past WiEZ event"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex((i) =>
                  i === null ? i : (i + 1) % photos.length
                );
              }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
