import { getCurrentUser } from "@/lib/auth-utils";
import { SuperAdminDashboard } from "@/components/admin/dashboards/super-admin-dashboard";
import { MembershipOfficerDashboard } from "@/components/admin/dashboards/membership-officer-dashboard";
import { EventsManagerDashboard } from "@/components/admin/dashboards/events-manager-dashboard";
import { ContentEditorDashboard } from "@/components/admin/dashboards/content-editor-dashboard";
import { MemberDashboard } from "@/components/admin/dashboards/member-dashboard";

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const role = user.roles[0];

  if (role === "super_admin" || role === "org_admin") return <SuperAdminDashboard />;
  if (role === "membership_officer") return <MembershipOfficerDashboard />;
  if (role === "events_manager") return <EventsManagerDashboard />;
  if (role === "content_editor") return <ContentEditorDashboard />;

  return <MemberDashboard user={user} />;
}
