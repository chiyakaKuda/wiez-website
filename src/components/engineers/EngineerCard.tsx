"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import type { Engineer } from "./types";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function EngineerCard({
  engineer,
  onOpen,
}: {
  engineer: Engineer;
  onOpen: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: EASE }}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-transparent bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)] transition-[border-color,box-shadow] duration-300 hover:border-lime hover:shadow-[0_24px_50px_-20px_rgba(15,23,42,0.22)]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
        aria-label={`View full profile of ${engineer.name}`}
        className="flex h-full flex-col cursor-pointer"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src={engineer.photo}
            alt={`Portrait of ${engineer.name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-lg font-extrabold text-navy">
            {engineer.name}
          </h3>
          <p className="mt-1 font-nav text-sm font-semibold text-navy/70">
            {engineer.discipline}
          </p>
          <p className="mt-0.5 font-sans text-sm text-slate-custom">
            {engineer.organization}
          </p>
          <p className="mt-1 flex items-center gap-1 font-sans text-xs text-slate-custom">
            <MapPin className="h-3 w-3 shrink-0" />
            {engineer.province}
          </p>

          <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-slate-custom">
            {engineer.shortBio}
          </p>

          <div className="mt-5 flex items-center justify-between border-t border-navy/5 pt-4">
            <span className="font-nav text-xs font-semibold text-navy">
              View Profile
            </span>
            <a
              href={engineer.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label={`${engineer.name} on LinkedIn`}
              onClick={(e) => e.stopPropagation()}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/5 text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
