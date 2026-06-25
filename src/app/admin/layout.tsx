import { requireRole } from "@/lib/auth-utils";
import { ADMIN_ROLES, getRoleLabel } from "@/lib/rbac";
import AppHeader from "@/components/app/AppHeader";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(ADMIN_ROLES);
  const roleLabel = user.roles.length
    ? user.roles.map(getRoleLabel).join(", ")
    : "Member";

  return (
    <div className="min-h-screen bg-white">
      <AppHeader name={user.name} roleLabel={roleLabel} homeHref="/admin" />
      {children}
    </div>
  );
}
