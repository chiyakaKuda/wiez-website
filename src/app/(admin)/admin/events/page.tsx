"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Calendar, CalendarPlus, ImageOff, MapPin, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { MOCK_EVENTS } from "@/lib/mock-data";

const STATUS_OPTIONS = ["Upcoming", "Open", "Sold Out", "Completed", "Cancelled"];
const TYPE_OPTIONS = ["Free", "Paid", "Member Only"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_EVENTS.filter((event) => {
      if (query && !event.name.toLowerCase().includes(query)) return false;
      if (status !== "all" && event.status !== status) return false;
      if (type !== "all" && event.type !== type) return false;
      return true;
    });
  }, [search, status, type]);

  const hasActiveFilters = search !== "" || status !== "all" || type !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
    setType("all");
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Events"
        description="Plan, publish and track registrations for WiEZ events."
        action={{
          label: "Create Event",
          icon: CalendarPlus,
          onClick: () => toast.info("Create event form opened"),
        }}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search events..."
        selects={[
          {
            label: "Status",
            value: status,
            onChange: setStatus,
            options: [
              { label: "All Statuses", value: "all" },
              ...STATUS_OPTIONS.map((s) => ({ label: s, value: s })),
            ],
          },
          {
            label: "Type",
            value: type,
            onChange: setType,
            options: [
              { label: "All Types", value: "all" },
              ...TYPE_OPTIONS.map((t) => ({ label: t, value: t })),
            ],
          },
        ]}
      />

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-32 items-center justify-center bg-slate-100">
                <ImageOff className="size-6 text-slate-300" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-nav text-sm font-semibold text-navy">{event.name}</p>
                  <StatusBadge status={event.status} className="shrink-0" />
                </div>
                <div className="mt-2 space-y-1 font-sans text-xs text-slate-500">
                  <p className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {event.date}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {event.venue}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {event.registrations}/{event.capacity} registered
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toast.info(`Managing "${event.name}"`)}
                  className="mt-3 h-8 w-full rounded-[6px]"
                >
                  Manage
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Try adjusting your filters, or create a new event to get started."
          action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
        />
      )}
    </div>
  );
}
