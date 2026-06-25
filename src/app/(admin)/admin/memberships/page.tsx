"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { Download, Eye, IdCard } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MOCK_MEMBERSHIP_APPLICATIONS,
  type ApplicationStatus,
  type MembershipApplication,
} from "@/lib/mock-data";

const columnHelper = createColumnHelper<MembershipApplication>();

const TABS: { label: string; value: ApplicationStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Active", value: "Active" },
  { label: "Expired", value: "Expired" },
  { label: "Rejected", value: "Rejected" },
];

export default function MembershipsPage() {
  const [tab, setTab] = useState<ApplicationStatus | "All">("All");

  const filtered = useMemo(() => {
    if (tab === "All") return MOCK_MEMBERSHIP_APPLICATIONS;
    return MOCK_MEMBERSHIP_APPLICATIONS.filter((application) => application.status === tab);
  }, [tab]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("memberName", {
        header: "Member",
        cell: (info) => (
          <div>
            <p className="font-medium text-navy">{info.getValue()}</p>
            <p className="text-xs text-slate-400">{info.row.original.memberEmail}</p>
          </div>
        ),
      }),
      columnHelper.accessor("membershipType", { header: "Type" }),
      columnHelper.accessor("appliedDate", { header: "Applied" }),
      columnHelper.accessor("approvedDate", {
        header: "Approved",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("expiryDate", {
        header: "Expiry",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("paymentStatus", {
        header: "Payment Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            actions={[
              {
                label: "View",
                icon: Eye,
                onClick: () => toast.info(`Viewing ${row.original.memberName}'s membership`),
              },
            ]}
          />
        ),
      }),
    ],
    []
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Memberships"
        description="Track membership applications, approvals, renewals and expiries."
        action={{
          label: "Export",
          icon: Download,
          onClick: () => toast.success("Exporting memberships to CSV..."),
        }}
      />

      <Tabs value={tab} onValueChange={(value) => setTab(value as ApplicationStatus | "All")}>
        <TabsList variant="line">
          {TABS.map((tabItem) => (
            <TabsTrigger key={tabItem.value} value={tabItem.value}>
              {tabItem.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <DataTable columns={columns} data={filtered} />
        </div>
      ) : (
        <EmptyState
          icon={IdCard}
          title="No memberships in this category"
          description="Switch tabs to see applications in a different status."
        />
      )}
    </div>
  );
}
