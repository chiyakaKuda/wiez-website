"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
}

export function QuickActions({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className={cn(
              "flex flex-col items-start gap-2.5 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors",
              "hover:border-lime/50 hover:bg-lime/5"
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-navy/5">
              <Icon className="size-4.5 text-navy" />
            </span>
            <span className="font-nav text-sm font-semibold text-navy">{action.label}</span>
          </button>
        );
      })}
    </div>
  );
}
