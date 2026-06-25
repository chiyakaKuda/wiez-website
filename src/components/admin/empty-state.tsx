"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick?: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-lime/15">
        <Icon className="size-6 text-navy" />
      </div>
      <h3 className="mt-4 font-heading text-base font-semibold text-navy">{title}</h3>
      <p className="mt-1.5 max-w-sm font-sans text-sm text-slate-500">{description}</p>
      {action && (
        <Button
          type="button"
          onClick={action.onClick}
          className="mt-5 h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
