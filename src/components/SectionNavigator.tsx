"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;
const NAVBAR_OFFSET = 24;

const SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "welcome", label: "President's Welcome" },
  { id: "impact", label: "Impact Statistics" },
  { id: "programs", label: "Programs" },
  { id: "engineers", label: "Featured Engineers" },
  { id: "events", label: "Events" },
  { id: "membership", label: "Membership" },
  { id: "success-stories", label: "Success Stories" },
  { id: "partners", label: "Partners" },
  { id: "contact", label: "Contact" },
];

type Status = "completed" | "current" | "upcoming";

function getStatus(index: number, activeIndex: number): Status {
  if (activeIndex === -1) return index === 0 ? "current" : "upcoming";
  if (index < activeIndex) return "completed";
  if (index === activeIndex) return "current";
  return "upcoming";
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function SectionNavigator() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const fillHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const fillScaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);

  return (
    <>
      {/* Mobile / tablet: compact top progress indicator */}
      <motion.div
        style={{ scaleX: fillScaleX }}
        className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-lime lg:hidden"
      />

      {/* Desktop: vertical section rail */}
      <div className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="relative flex flex-col items-center">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-slate-custom/25" />
          <motion.div
            style={{ height: fillHeight }}
            className="absolute left-1/2 top-0 w-px origin-top -translate-x-1/2 bg-lime"
          />

          {SECTIONS.map((section, i) => {
            const status = getStatus(i, activeIndex);
            return (
              <div
                key={section.id}
                className="relative flex h-9 items-center justify-center"
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  type="button"
                  onClick={() => scrollToSection(section.id)}
                  onFocus={() => setHoveredId(section.id)}
                  onBlur={() => setHoveredId(null)}
                  aria-label={`Go to ${section.label} section`}
                  aria-current={status === "current"}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
                >
                  {status === "current" && (
                    <motion.span
                      animate={{ scale: [1, 2.4, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute h-3 w-3 rounded-full bg-lime"
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 block rounded-full border-2 transition-all duration-300",
                      status === "completed" && "h-2.5 w-2.5 border-lime bg-lime",
                      status === "current" && "h-3 w-3 border-lime bg-lime",
                      status === "upcoming" &&
                        "h-2.5 w-2.5 border-slate-custom/40 bg-white"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {hoveredId === section.id && (
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2, ease: EASE }}
                      className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 font-nav text-xs font-semibold text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.4)]"
                    >
                      {section.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
