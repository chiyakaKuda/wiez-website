import { requireRole } from "@/lib/auth-utils";
import { SECTION_ROLES } from "@/lib/rbac";

export default async function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole(SECTION_ROLES.content);
  return <>{children}</>;
}
