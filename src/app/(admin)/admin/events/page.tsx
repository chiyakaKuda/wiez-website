"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowRight, Calendar, CalendarPlus, Clock, TicketCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { StatusBadge } from "@/components/admin/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAllEvents, type EventListItem } from "@/actions/events";
import { EVENT_TYPES } from "@/lib/constants";
import type { EventStatus } from "@/types/events";

const columnHelper = createColumnHelper<EventListItem>();

const TAB_GROUPS: { label: string; value: string; status: EventStatus | null }[] = [
  { label: "All", value: "all", status: null },
  { label: "Draft", value: "draft", status: "draft" },
  { label: "Published", value: "published", status: "published" },
  { label: "Cancelled", value: "cancelled", status: "cancelled" },
  { label: "Completed", value: "completed", status: "completed" },
];

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Draft",
  published: "Published",
  cancelled: "Cancelled",
  completed: "Completed",
};

const TYPE_LABELS: Record<string, string> = {
  free: "Free",
  paid: "Paid",
  member_only: "Member Only",
  corporate_sponsored: "Corporate Sponsored",
};

export default function AdminEventsPage() {
  const router = useRouter();
  const [allRows, setAllRows] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  useEffect(() => {
    const handle = setTimeout(() => {
      void getAllEvents({
        search: search || undefined,
        type: type === "all" ? undefined : (type as (typeof EVENT_TYPES)[number]),
      }).then((rows) => {
        setAllRows(rows);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [search, type]);

  const activeGroup = TAB_GROUPS.find((group) => group.value === tab);
  const filteredRows = useMemo(() => {
    if (!activeGroup?.status) return allRows;
    return allRows.filter((row) => row.status === activeGroup.status);
  }, [allRows, activeGroup]);

  const stats = useMemo(
    () => ({
      total: allRows.length,
      upcoming: allRows.filter((r) => r.status === "published" && new Date(r.date) > new Date()).length,
      pendingRegistrations: allRows.reduce((sum, r) => sum + r.pendingRegistrations, 0),
      totalRegistered: allRows.reduce((sum, r) => sum + r.registeredCount, 0),
    }),
    [allRows]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Event",
        cell: (info) => <p className="font-medium text-navy">{info.getValue()}</p>,
      }),
      columnHelper.accessor("date", {
        header: "Date",
        cell: (info) =>
          new Date(info.getValue()).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
      }),
      columnHelper.accessor("venue", { header: "Venue" }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => TYPE_LABELS[info.getValue()] ?? info.getValue(),
      }),
      columnHelper.display({
        id: "registered",
        header: "Registered",
        cell: ({ row }) => `${row.original.registeredCount}/${row.original.capacity}`,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={STATUS_LABELS[info.getValue()]} />,
      }),
      columnHelper.accessor("pendingRegistrations", {
        header: "Pending",
        cell: (info) =>
          info.getValue() > 0 ? (
            <StatusBadge
              status={`${info.getValue()} Pending`}
              className="bg-amber-100 text-amber-700 border-amber-200"
            />
          ) : (
            "—"
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            actions={[
              {
                label: "Manage",
                icon: ArrowRight,
                onClick: () => router.push(`/admin/events/${row.original.id}/manage`),
              },
            ]}
          />
        ),
      }),
    ],
    [router]
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Events"
        description="Plan, publish and track registrations for WiEZ events."
        action={{
          label: "Create Event",
          icon: CalendarPlus,
          onClick: () => router.push("/admin/events/new"),
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Events" value={stats.total} icon={Calendar} index={0} />
        <StatCard title="Upcoming" value={stats.upcoming} icon={Clock} index={1} />
        <StatCard
          title="Pending Registrations"
          value={stats.pendingRegistrations}
          icon={Users}
          highlight={stats.pendingRegistrations > 0}
          index={2}
        />
        <StatCard title="Total Registered" value={stats.totalRegistered} icon={TicketCheck} index={3} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="flex-wrap">
          {TAB_GROUPS.map((group) => (
            <TabsTrigger key={group.value} value={group.value}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by title or venue..."
        selects={[
          {
            label: "Type",
            value: type,
            onChange: setType,
            options: [
              { label: "All Types", value: "all" },
              ...EVENT_TYPES.map((t) => ({ label: TYPE_LABELS[t] ?? t, value: t })),
            ],
          },
        ]}
      />

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center font-sans text-sm text-slate-400">
          Loading events...
        </div>
      ) : filteredRows.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <DataTable columns={columns} data={filteredRows} />
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No events found"
          description="Try adjusting your filters, or create a new event to get started."
          action={{ label: "Create Event", onClick: () => router.push("/admin/events/new") }}
        />
      )}
    </div>
  );
}
