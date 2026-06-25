import { requireRole } from "@/lib/auth-utils";
import { SECTION_ROLES } from "@/lib/rbac";

export default async function MembershipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(SECTION_ROLES.memberships);
  return <>{children}</>;
}
