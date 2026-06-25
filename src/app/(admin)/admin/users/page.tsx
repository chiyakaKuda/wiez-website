"use client";

import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { Ban, Trash2, UserCog, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { RoleBadge } from "@/components/admin/role-badge";
import { RowActions } from "@/components/admin/row-actions";
import { MOCK_SYSTEM_USERS, type SystemUser } from "@/lib/mock-data";

const columnHelper = createColumnHelper<SystemUser>();

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDateTime(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function SystemUsersPage() {
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-xs font-semibold text-white">
              {initials(info.getValue())}
            </span>
            <span className="font-medium text-navy">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("role", {
        header: "Role",
        cell: (info) => <RoleBadge role={info.getValue()} />,
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("lastLogin", {
        header: "Last Login",
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor("createdAt", { header: "Created" }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            actions={[
              {
                label: "Edit Role",
                icon: UserCog,
                onClick: () => toast.info(`Editing role for ${row.original.name}`),
              },
              {
                label: "Suspend",
                icon: Ban,
                onClick: () => toast.warning(`${row.original.name} suspended`),
              },
              {
                label: "Remove",
                icon: Trash2,
                destructive: true,
                onClick: () => toast.error(`${row.original.name} removed`),
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
        title="System Users"
        description="Manage admin, officer and staff accounts and their roles."
        action={{
          label: "Invite User",
          icon: UserPlus,
          onClick: () => toast.info("Invite user form opened"),
        }}
      />

      <div className="rounded-xl border border-slate-200 bg-white">
        <DataTable columns={columns} data={MOCK_SYSTEM_USERS} />
      </div>
    </div>
  );
}
