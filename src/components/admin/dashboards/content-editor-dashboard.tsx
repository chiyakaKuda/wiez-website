"use client";

import { toast } from "sonner";
import { FileText, Megaphone, Pencil, Sparkles, UserPlus } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { QuickActions } from "@/components/admin/quick-actions";
import { Button } from "@/components/ui/button";
import { CONTENT_STATS, MOCK_ANNOUNCEMENTS } from "@/lib/mock-data";

const WEEK_DAYS = [
  { label: "Mon", date: "Jun 22" },
  { label: "Tue", date: "Jun 23" },
  { label: "Wed", date: "Jun 24", item: "Gala recap published" },
  { label: "Thu", date: "Jun 25" },
  { label: "Fri", date: "Jun 26", item: "Dues update — draft review" },
  { label: "Sat", date: "Jun 27" },
  { label: "Sun", date: "Jun 28" },
];

export function ContentEditorDashboard() {
  function handleEdit(title: string) {
    toast.info(`Opening "${title}" for editing`);
  }

  const actions = [
    { label: "New Announcement", icon: Megaphone, onClick: () => toast.info("New announcement form opened") },
    { label: "New Partner", icon: UserPlus, onClick: () => toast.info("New partner form opened") },
    { label: "Feature an Engineer", icon: Sparkles, onClick: () => toast.info("Feature an engineer form opened") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Published Announcements"
          value={CONTENT_STATS.publishedAnnouncements}
          icon={Megaphone}
          index={0}
        />
        <StatCard
          title="Draft Content"
          value={CONTENT_STATS.draftContent}
          icon={FileText}
          index={1}
        />
        <StatCard
          title="Active Partners"
          value={CONTENT_STATS.activePartners}
          icon={UserPlus}
          index={2}
        />
        <StatCard
          title="Featured Engineers"
          value={CONTENT_STATS.featuredEngineers}
          icon={Sparkles}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="font-heading text-sm font-semibold text-navy">Recent Announcements</h3>
          <div className="mt-4 space-y-3">
            {MOCK_ANNOUNCEMENTS.map((announcement) => (
              <div
                key={announcement.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-100 p-3"
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-medium text-navy">
                    {announcement.title}
                  </p>
                  <p className="mt-0.5 font-sans text-xs text-slate-400">
                    {announcement.publishedDate ?? "Not published yet"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={announcement.status} />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label={`Edit ${announcement.title}`}
                    onClick={() => handleEdit(announcement.title)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Quick Actions</h3>
          <div className="mt-4">
            <QuickActions actions={actions} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-navy">Content Calendar</h3>
        <p className="font-sans text-xs text-slate-500">This week</p>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {WEEK_DAYS.map((day) => (
            <div
              key={day.label}
              className="min-h-24 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5"
            >
              <p className="font-nav text-xs font-semibold text-navy">{day.label}</p>
              <p className="font-sans text-[11px] text-slate-400">{day.date}</p>
              {day.item && (
                <p className="mt-2 rounded-md bg-lime/15 px-1.5 py-1 font-sans text-[11px] font-medium text-navy">
                  {day.item}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
