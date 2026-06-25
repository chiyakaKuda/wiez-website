import { CheckCircle2, XCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth-utils";
import { getRoleLabel, hasRole } from "@/lib/rbac";
import type { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const ADMIN_SECTIONS: { label: string; roles: UserRole[] }[] = [
  {
    label: "Members",
    roles: ["membership_officer", "org_admin", "super_admin"],
  },
  {
    label: "Events",
    roles: ["events_manager", "org_admin", "super_admin"],
  },
  {
    label: "Content",
    roles: ["content_editor", "org_admin", "super_admin"],
  },
  { label: "Reports", roles: ["org_admin", "super_admin"] },
  { label: "Settings", roles: ["org_admin", "super_admin"] },
  { label: "Users", roles: ["super_admin"] },
];

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const roleLabel = user.roles.length
    ? user.roles.map(getRoleLabel).join(", ")
    : "Member";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="rounded-[20px] border border-navy/10 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)]">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
          Admin Dashboard
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 font-sans text-slate-custom">
          You have signed in as: <span className="font-semibold text-navy">{roleLabel}</span>
        </p>

        <h2 className="mt-8 font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
          Section Access
        </h2>
        <ul className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ADMIN_SECTIONS.map((section) => {
            const allowed = section.roles.some((role) => hasRole(user.roles, role));
            return (
              <li
                key={section.label}
                className={cn(
                  "flex items-center gap-2.5 rounded-[12px] border px-4 py-3",
                  allowed
                    ? "border-lime/40 bg-lime/10"
                    : "border-navy/10 bg-navy/[0.02] text-slate-custom"
                )}
              >
                {allowed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-navy" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-slate-custom" />
                )}
                <span
                  className={cn(
                    "font-sans text-sm font-semibold",
                    allowed ? "text-navy" : "text-slate-custom"
                  )}
                >
                  {section.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
