"use client";

import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  destructive?: boolean;
}

export function RowActions({ actions }: { actions: RowAction[] }) {
  return (
    <div className="flex items-center gap-1">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Tooltip key={action.label}>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={action.label}
                  onClick={action.onClick}
                  className={cn(action.destructive && "text-red-600 hover:bg-red-50 hover:text-red-700")}
                />
              }
            >
              <Icon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent>{action.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
