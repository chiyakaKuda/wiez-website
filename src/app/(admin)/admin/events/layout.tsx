import { requireRole } from "@/lib/auth-utils";
import { SECTION_ROLES } from "@/lib/rbac";

export default async function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(SECTION_ROLES.events);
  return <>{children}</>;
}
