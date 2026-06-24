"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Briefcase,
  Mail,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import EngineerBadge from "./EngineerBadge";
import type { Engineer } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

function ModalSection({
  icon: Icon,
  title,
  items,
}: {
  icon: LucideIcon;
  title: string;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-lime" />
        <h4 className="font-nav text-xs font-semibold uppercase tracking-[0.14em] text-navy">
          {title}
        </h4>
      </div>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 font-sans text-sm leading-relaxed text-slate-custom"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy/20" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function EngineerModal({
  engineer,
  onClose,
}: {
  engineer: Engineer | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {engineer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/60 p-4 backdrop-blur-sm"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Full profile of ${engineer.name}`}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl lg:p-10"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-navy/5 text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                <Image
                  src={engineer.photo}
                  alt={`Portrait of ${engineer.name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-extrabold text-navy">
                  {engineer.name}
                </h3>
                <p className="mt-1 font-nav text-sm font-semibold text-navy/70">
                  {engineer.discipline} &middot; {engineer.organization}
                </p>
                <p className="mt-0.5 font-sans text-sm text-slate-custom">
                  {engineer.province} Province
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {engineer.badges.map((badge) => (
                    <EngineerBadge key={badge} label={badge} />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-6 font-sans text-[15px] leading-relaxed text-slate-custom">
              {engineer.fullBio}
            </p>

            <ModalSection
              icon={Briefcase}
              title="Career History"
              items={engineer.career}
            />
            <ModalSection
              icon={Trophy}
              title="Achievements"
              items={engineer.achievements}
            />
            <ModalSection
              icon={Award}
              title="Notable Projects"
              items={engineer.projects}
            />
            <ModalSection icon={Award} title="Awards" items={engineer.awards} />

            <div className="mt-8 flex flex-wrap gap-3 border-t border-navy/10 pt-6">
              <a
                href={engineer.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 font-nav text-sm font-semibold text-white transition-transform duration-300 hover:scale-105"
              >
                <LinkedinIcon className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="mailto:hello@wiez.org.zw"
                className="inline-flex items-center gap-2 rounded-full border border-navy/15 px-5 py-2.5 font-nav text-sm font-semibold text-navy transition-colors duration-300 hover:bg-navy/5"
              >
                <Mail className="h-4 w-4" />
                Contact
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
