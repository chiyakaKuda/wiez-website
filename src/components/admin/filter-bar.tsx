"use client";

import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterSelect {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  selects = [],
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  selects?: FilterSelect[];
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
          className="h-9 w-full rounded-[8px] border border-slate-200 bg-slate-50 pr-3 pl-9 font-sans text-sm text-navy placeholder:text-slate-400 focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
        />
      </div>
      {selects.map((select) => (
        <Select
          key={select.label}
          value={select.value}
          onValueChange={(value) => select.onChange(value ?? "all")}
        >
          <SelectTrigger className="h-9 w-full rounded-[8px] sm:w-44" aria-label={select.label}>
            <SelectValue placeholder={select.label} />
          </SelectTrigger>
          <SelectContent>
            {select.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
