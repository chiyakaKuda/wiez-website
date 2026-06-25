import { requireRole } from "@/lib/auth-utils";
import { SECTION_ROLES } from "@/lib/rbac";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(SECTION_ROLES.users);
  return <>{children}</>;
}
