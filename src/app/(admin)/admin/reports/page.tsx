"use client";

import { toast } from "sonner";
import { BarChart3, Calendar, Download, MapPinned, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

interface ReportDefinition {
  title: string;
  description: string;
  icon: LucideIcon;
  lastGenerated: string;
}

const REPORTS: ReportDefinition[] = [
  {
    title: "Membership Report",
    description: "Full breakdown of members by status, type, province and discipline.",
    icon: Users,
    lastGenerated: "2026-06-20",
  },
  {
    title: "Revenue Report",
    description: "Membership fees, event ticket sales and donations over a date range.",
    icon: BarChart3,
    lastGenerated: "2026-06-18",
  },
  {
    title: "Event Attendance Report",
    description: "Registrations, check-ins and attendance rates per event.",
    icon: Calendar,
    lastGenerated: "2026-06-10",
  },
  {
    title: "Province Distribution Report",
    description: "Member counts and growth across all 10 Zimbabwe provinces.",
    icon: MapPinned,
    lastGenerated: "2026-06-05",
  },
  {
    title: "Discipline Distribution Report",
    description: "Member counts across every engineering discipline tracked by WiEZ.",
    icon: Sparkles,
    lastGenerated: "2026-05-29",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Reports"
        description="Generate and download reports across membership, finance and events."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {REPORTS.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.title}
              className="flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-lime/15">
                <Icon className="size-5 text-navy" />
              </div>
              <h3 className="mt-3 font-heading text-sm font-semibold text-navy">
                {report.title}
              </h3>
              <p className="mt-1.5 flex-1 font-sans text-sm text-slate-500">
                {report.description}
              </p>
              <p className="mt-3 font-nav text-xs text-slate-400">
                Last generated {report.lastGenerated}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => toast.success(`Generating "${report.title}"...`)}
                  className="h-8 flex-1 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
                >
                  Generate
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  aria-label={`Download last ${report.title}`}
                  onClick={() => toast.info(`Downloading last "${report.title}"...`)}
                  className="h-8 rounded-[6px]"
                >
                  <Download className="size-3.5" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
