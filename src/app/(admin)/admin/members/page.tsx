"use client";

import { useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, UserPlus, Users } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { FilterBar } from "@/components/admin/filter-bar";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { RowActions } from "@/components/admin/row-actions";
import { EmptyState } from "@/components/admin/empty-state";
import { MOCK_MEMBERS, type Member } from "@/lib/mock-data";
import { ZIMBABWE_PROVINCES, ENGINEERING_DISCIPLINES } from "@/lib/constants";

const columnHelper = createColumnHelper<Member>();

const STATUS_OPTIONS = ["Active", "Pending", "Expired", "Rejected", "Suspended"];
const TYPE_OPTIONS = ["Student", "Graduate", "Professional", "Corporate"];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("all");
  const [discipline, setDiscipline] = useState("all");
  const [status, setStatus] = useState("all");
  const [membershipType, setMembershipType] = useState("all");

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_MEMBERS.filter((member) => {
      if (
        query &&
        !member.name.toLowerCase().includes(query) &&
        !member.email.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (province !== "all" && member.province !== province) return false;
      if (discipline !== "all" && member.discipline !== discipline) return false;
      if (status !== "all" && member.status !== status) return false;
      if (membershipType !== "all" && member.membershipType !== membershipType) return false;
      return true;
    });
  }, [search, province, discipline, status, membershipType]);

  const hasActiveFilters =
    search !== "" ||
    province !== "all" ||
    discipline !== "all" ||
    status !== "all" ||
    membershipType !== "all";

  function clearFilters() {
    setSearch("");
    setProvince("all");
    setDiscipline("all");
    setStatus("all");
    setMembershipType("all");
  }

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
      columnHelper.accessor("membershipNumber", { header: "Membership No" }),
      columnHelper.accessor("membershipType", { header: "Type" }),
      columnHelper.accessor("province", { header: "Province" }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={info.getValue()} />,
      }),
      columnHelper.accessor("joinedDate", { header: "Joined" }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <RowActions
            actions={[
              {
                label: "View",
                icon: Eye,
                onClick: () => toast.info(`Viewing ${row.original.name}`),
              },
              {
                label: "Edit",
                icon: Pencil,
                onClick: () => toast.info(`Editing ${row.original.name}`),
              },
              {
                label: "Delete",
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
        title="Members"
        description="Manage WiEZ member records, profiles and membership history."
        action={{
          label: "Add Member",
          icon: UserPlus,
          onClick: () => toast.info("Add member form opened"),
        }}
      />

      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        selects={[
          {
            label: "Province",
            value: province,
            onChange: setProvince,
            options: [
              { label: "All Provinces", value: "all" },
              ...ZIMBABWE_PROVINCES.map((p) => ({ label: p, value: p })),
            ],
          },
          {
            label: "Discipline",
            value: discipline,
            onChange: setDiscipline,
            options: [
              { label: "All Disciplines", value: "all" },
              ...ENGINEERING_DISCIPLINES.map((d) => ({ label: d, value: d })),
            ],
          },
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
            label: "Membership Type",
            value: membershipType,
            onChange: setMembershipType,
            options: [
              { label: "All Types", value: "all" },
              ...TYPE_OPTIONS.map((t) => ({ label: t, value: t })),
            ],
          },
        ]}
      />

      {filteredMembers.length > 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <DataTable columns={columns} data={filteredMembers} />
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No members found"
          description="Try adjusting your filters or search terms to find who you're looking for."
          action={hasActiveFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
        />
      )}
    </div>
  );
}
