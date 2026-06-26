import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-utils";
import {
  getMembershipTypes,
  getUserActiveOrPendingMembership,
  getUserDraftApplication,
} from "@/actions/memberships";
import { ApplyWizard } from "@/components/membership/apply-wizard";
import { MEMBERSHIP_TYPE_NAMES } from "@/lib/constants";
import type { MembershipTypeName } from "@/types/memberships";

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const params = await searchParams;
  const callbackUrl = params.type
    ? `/membership/apply?type=${encodeURIComponent(params.type)}`
    : "/membership/apply";

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const activeOrPending = await getUserActiveOrPendingMembership();
  if (activeOrPending) {
    redirect("/dashboard/membership");
  }

  const [membershipTypes, draft] = await Promise.all([
    getMembershipTypes(),
    getUserDraftApplication(),
  ]);

  const requestedType = params.type;
  const initialTypeName = (MEMBERSHIP_TYPE_NAMES as readonly string[]).includes(
    requestedType ?? ""
  )
    ? (requestedType as MembershipTypeName)
    : null;

  return (
    <ApplyWizard
      membershipTypes={membershipTypes}
      initialTypeName={initialTypeName}
      initialDraft={draft}
    />
  );
}
