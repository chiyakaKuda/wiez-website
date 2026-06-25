import { requireAuth } from "@/lib/auth-utils";
import { getRoleLabel } from "@/lib/rbac";
import AppHeader from "@/components/app/AppHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();
  const roleLabel = user.roles.length
    ? user.roles.map(getRoleLabel).join(", ")
    : "Member";

  return (
    <div className="min-h-screen bg-white">
      <AppHeader name={user.name} roleLabel={roleLabel} homeHref="/dashboard" />
      {children}
    </div>
  );
}
