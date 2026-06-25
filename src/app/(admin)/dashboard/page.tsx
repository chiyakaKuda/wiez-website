import { getCurrentUser } from "@/lib/auth-utils";
import { MemberDashboard } from "@/components/admin/dashboards/member-dashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return <MemberDashboard user={user} />;
}
