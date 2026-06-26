"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { ArrowRight, Clock, CreditCard, Download, IdCard, UserCheck, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import { StatCard } from "@/components/admin/stat-card";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembershipStatusBadge } from "@/components/membership/status-badge";
import {
  getAllMemberships,
  exportMemberships,
  type MembershipListItem,
} from "@/actions/memberships";
import { ZIMBABWE_PROVINCES, MEMBERSHIP_TYPE_NAMES } from "@/lib/constants";
import type { MembershipStatus } from "@/types/memberships";

const columnHelper = createColumnHelper<MembershipListItem>();

const TAB_GROUPS: { label: string; value: string; statuses: MembershipStatus[] | null }[] = [
  { label: "All", value: "all", statuses: null },
  { label: "Pending Review", value: "pending_review", statuses: ["submitted", "under_review"] },
  { label: "Info Requested", value: "info_requested", statuses: ["info_requested"] },
  { label: "Pending Payment", value: "pending_payment", statuses: ["pending_payment"] },
  {
    label: "Payment Verification",
    value: "payment_verification",
    statuses: ["payment_submitted", "payment_verified"],
  },
  { label: "Active", value: "active", statuses: ["approved"] },
  { label: "Rejected", value: "rejected", statuses: ["rejected"] },
  { label: "Expired", value: "expired", statuses: ["expired"] },
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function AdminMembershipsPage() {
  const router = useRouter();
  const [allRows, setAllRows] = useState<MembershipListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [province, setProvince] = useState("all");

  function handleSearchChange(value: string) {
    setSearch(value);
    setLoading(true);
  }

  function handleTypeChange(value: string) {
    setType(value);
    setLoading(true);
  }

  function handleProvinceChange(value: string) {
    setProvince(value);
    setLoading(true);
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      void getAllMemberships({
        search: search || undefined,
        type: type === "all" ? undefined : (type as (typeof MEMBERSHIP_TYPE_NAMES)[number]),
        province: province === "all" ? undefined : province,
      }).then((rows) => {
        setAllRows(rows);
        setLoading(false);
      });
    }, 300);
    return () => clearTimeout(handle);
  }, [search, type, province]);

  const activeGroup = TAB_GROUPS.find((group) => group.value === tab);
  const filteredRows = useMemo(() => {
    if (!activeGroup?.statuses) return allRows;
    return allRows.filter((row) => activeGroup.statuses!.includes(row.status));
  }, [allRows, activeGroup]);

  const stats = useMemo(
    () => ({
      total: allRows.length,
      pendingReview: allRows.filter((r) => r.status === "submitted" || r.status === "under_review")
        .length,
      paymentVerification: allRows.filter(
        (r) => r.status === "payment_submitted" || r.status === "payment_verified"
      ).length,
      active: allRows.filter((r) => r.status === "approved").length,
    }),
    [allRows]
  );

  async function handleExport() {
    const csv = await exportMemberships({
      search: search || undefined,
      type: type === "all" ? undefined : (type as (typeof MEMBERSHIP_TYPE_NAMES)[number]),
      province: province === "all" ? undefined : province,
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `memberships-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Memberships exported.");
  }

  const columns = useMemo(
    () => [
      columnHelper.accessor("applicantName", {
        header: "Applicant",
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-xs font-semibold text-white">
              {initials(info.getValue())}
            </span>
            <div>
              <p className="font-medium text-navy">{info.getValue()}</p>
              <p className="text-xs text-slate-400">{info.row.original.applicantEmail}</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("applicationReference", {
        header: "Reference",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("membershipTypeName", { header: "Type" }),
      columnHelper.accessor("submittedAt", {
        header: "Submitted",
        cell: (info) => (info.getValue() ? new Date(info.getValue()!).toLocaleDateString() : "—"),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <MembershipStatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("latestPaymentStatus", {
        header: "Payment",
        cell: (info) =>
          info.getValue() ? (
            <span className="font-sans text-xs text-slate-500 capitalize">{info.getValue()}</span>
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
                label: "Review",
                icon: ArrowRight,
                onClick: () => router.push(`/admin/memberships/${row.original.id}`),
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
        title="Membership Applications"
        description="Review, approve and manage WiEZ membership applications."
        action={{ label: "Export CSV", icon: Download, onClick: () => void handleExport() }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Applications" value={stats.total} icon={Users} index={0} />
        <StatCard
          title="Pending Review"
          value={stats.pendingReview}
          icon={Clock}
          highlight={stats.pendingReview > 0}
          index={1}
        />
        <StatCard
          title="Pending Payment Verification"
          value={stats.paymentVerification}
          icon={CreditCard}
          highlight={stats.paymentVerification > 0}
          index={2}
        />
        <StatCard title="Active Members" value={stats.active} icon={UserCheck} index={3} />
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
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search by name, email or reference..."
        selects={[
          {
            label: "Type",
            value: type,
            onChange: handleTypeChange,
            options: [
              { label: "All Types", value: "all" },
              ...MEMBERSHIP_TYPE_NAMES.map((name) => ({ label: name, value: name })),
            ],
          },
          {
            label: "Province",
            value: province,
            onChange: handleProvinceChange,
            options: [
              { label: "All Provinces", value: "all" },
              ...ZIMBABWE_PROVINCES.map((p) => ({ label: p, value: p })),
            ],
          },
        ]}
      />

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center font-sans text-sm text-slate-400">
          Loading applications...
        </div>
      ) : filteredRows.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <DataTable columns={columns} data={filteredRows} />
        </div>
      ) : (
        <EmptyState
          icon={IdCard}
          title="No applications found"
          description="Try adjusting your filters or search terms."
        />
      )}
    </div>
  );
}
