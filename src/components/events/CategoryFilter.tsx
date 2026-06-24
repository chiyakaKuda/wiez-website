"use client";

import { cn } from "@/lib/utils";
import type { EventCategory } from "./types";

const ALL = "All Events";

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: EventCategory[];
  active: EventCategory | typeof ALL;
  onChange: (value: EventCategory | typeof ALL) => void;
}) {
  const tabs: (EventCategory | typeof ALL)[] = [ALL, ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-2.5">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          aria-pressed={active === tab}
          className={cn(
            "rounded-full border px-5 py-2.5 font-nav text-sm font-semibold transition-colors duration-300",
            active === tab
              ? "border-navy bg-navy text-white"
              : "border-navy/15 text-navy hover:bg-navy/5"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
