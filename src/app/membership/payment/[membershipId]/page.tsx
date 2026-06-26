import { notFound, redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth-utils";
import { getMembershipById } from "@/actions/memberships";
import { PaymentForm } from "@/components/membership/payment-form";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ membershipId: string }>;
}) {
  const user = await requireAuth();
  const { membershipId } = await params;

  const membership = await getMembershipById(membershipId);
  if (!membership) notFound();
  if (membership.userId !== user.id) redirect("/dashboard");
  if (membership.status !== "pending_payment") redirect("/dashboard/membership");

  return (
    <PaymentForm
      membershipId={membership.id}
      applicationReference={membership.applicationReference ?? ""}
      applicantName={membership.applicant.name}
      membershipTypeName={membership.membershipType.name}
      fee={membership.membershipType.fee}
      approvedAt={membership.approvedAt}
    />
  );
}
