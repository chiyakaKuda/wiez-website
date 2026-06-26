import { requireAuth } from "@/lib/auth-utils";
import {
  getUserCurrentMembership,
  getUserDraftApplication,
  getMembershipById,
  getMembershipTypes,
} from "@/actions/memberships";
import {
  NoApplicationState,
  DraftState,
  SubmittedState,
  InfoRequestedState,
  PendingPaymentState,
  PaymentSubmittedState,
  ActiveState,
  RejectedState,
  SuspendedOrRevokedState,
  ExpiredState,
} from "@/components/membership/dashboard-content";

export default async function MembershipDashboardPage() {
  const user = await requireAuth();
  const current = await getUserCurrentMembership();

  if (!current) {
    const draft = await getUserDraftApplication();
    const membershipType = draft
      ? (await getMembershipTypes()).find((type) => type.id === draft.membershipTypeId)
      : null;

    return (
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        {draft && membershipType ? (
          <DraftState draft={draft} membershipType={membershipType} />
        ) : (
          <NoApplicationState />
        )}
      </main>
    );
  }

  const detail = await getMembershipById(current.id);
  if (!detail) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
        <NoApplicationState />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      {detail.status === "submitted" || detail.status === "under_review" ? (
        <SubmittedState membership={detail} />
      ) : detail.status === "info_requested" ? (
        <InfoRequestedState membership={detail} />
      ) : detail.status === "pending_payment" ? (
        <PendingPaymentState membership={detail} membershipType={detail.membershipType} />
      ) : detail.status === "payment_submitted" || detail.status === "payment_verified" ? (
        <PaymentSubmittedState payment={detail.payments[0] ?? null} />
      ) : detail.status === "approved" ? (
        <ActiveState
          membership={detail}
          membershipType={detail.membershipType}
          memberName={user.name}
        />
      ) : detail.status === "rejected" ? (
        <RejectedState membership={detail} />
      ) : detail.status === "suspended" || detail.status === "revoked" ? (
        <SuspendedOrRevokedState membership={detail} />
      ) : detail.status === "expired" ? (
        <ExpiredState membership={detail} />
      ) : (
        <NoApplicationState />
      )}
    </main>
  );
}
