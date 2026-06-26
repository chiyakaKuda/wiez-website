import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { getMembershipById } from "@/actions/memberships";
import { MembershipDetailView } from "@/components/admin/membership-detail/detail-view";

export default async function MembershipDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [admin, membership] = await Promise.all([requireAuth(), getMembershipById(id)]);

  if (!membership) notFound();

  return <MembershipDetailView membership={membership} currentAdminId={admin.id} />;
}
