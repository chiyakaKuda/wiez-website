"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { Clock, DollarSign, Download, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { MOCK_PAYMENTS, PAYMENT_STATS, type Payment } from "@/lib/mock-data";

const columnHelper = createColumnHelper<Payment>();

export default function PaymentsPage() {
  const columns = useMemo(
    () => [
      columnHelper.accessor("memberName", { header: "Member" }),
      columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => `$${info.getValue().toLocaleString()}`,
      }),
      columnHelper.accessor("type", { header: "Type" }),
      columnHelper.accessor("method", { header: "Method" }),
      columnHelper.accessor("date", { header: "Date" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("reference", {
        header: "Reference",
        cell: (info) => <span className="font-sans text-xs text-slate-400">{info.getValue()}</span>,
      }),
    ],
    []
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payments"
        description="Review membership fees, event tickets and other transactions."
        action={{
          label: "Export",
          icon: Download,
          onClick: () => toast.success("Exporting payments to CSV..."),
        }}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Revenue"
          value={`$${PAYMENT_STATS.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          index={0}
        />
        <StatCard
          title="Pending"
          value={`$${PAYMENT_STATS.pending.toLocaleString()}`}
          icon={Clock}
          highlight={PAYMENT_STATS.pending > 0}
          index={1}
        />
        <StatCard
          title="This Month"
          value={`$${PAYMENT_STATS.thisMonth.toLocaleString()}`}
          change="+4.1% from last month"
          changeType="positive"
          icon={TrendingUp}
          index={2}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white">
        <DataTable columns={columns} data={MOCK_PAYMENTS} />
      </div>
    </div>
  );
}
