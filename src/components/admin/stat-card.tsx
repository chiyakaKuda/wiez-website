"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
  highlight?: boolean;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
  highlight = false,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        highlight ? "border-amber-300 bg-amber-50/40" : "border-slate-200"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-nav text-xs font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">{value}</p>
        </div>
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-lime/15"
          style={iconColor ? { backgroundColor: `${iconColor}1A` } : undefined}
        >
          <Icon className="size-5" style={{ color: iconColor ?? "#0F172A" }} />
        </div>
      </div>

      {change && (
        <div
          className={cn(
            "mt-3 flex items-center gap-1 font-sans text-xs font-semibold",
            changeType === "positive" && "text-green-600",
            changeType === "negative" && "text-red-600",
            changeType === "neutral" && "text-slate-500"
          )}
        >
          {changeType === "positive" && <ArrowUp className="size-3" />}
          {changeType === "negative" && <ArrowDown className="size-3" />}
          <span>{change}</span>
        </div>
      )}
    </motion.div>
  );
}
