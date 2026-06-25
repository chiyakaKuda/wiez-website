import { getRoleLabel } from "@/lib/rbac";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<UserRole, string> = {
  super_admin: "bg-[#0F172A] text-[#A3E635]",
  org_admin: "bg-purple-100 text-purple-700",
  membership_officer: "bg-blue-100 text-blue-700",
  events_manager: "bg-indigo-100 text-indigo-700",
  content_editor: "bg-teal-100 text-teal-700",
  member: "bg-slate-100 text-slate-600",
};

export function RoleBadge({
  role,
  className,
}: {
  role: UserRole;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 font-nav text-xs font-medium whitespace-nowrap",
        ROLE_STYLES[role],
        className
      )}
    >
      {getRoleLabel(role)}
    </span>
  );
}
