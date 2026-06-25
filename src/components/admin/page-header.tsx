"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PageHeaderAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: PageHeaderAction;
}) {
  const ActionIcon = action?.icon;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">{title}</h1>
        {description && (
          <p className="mt-1 font-sans text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && (
        <Button
          type="button"
          onClick={action.onClick}
          className="h-10 w-fit rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          {ActionIcon && <ActionIcon className="size-4" />}
          {action.label}
        </Button>
      )}
    </div>
  );
}
