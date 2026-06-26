import Link from "next/link";
import {
  AlertTriangle,
  Award,
  Check,
  Clock,
  Download,
  FileQuestion,
  Mail,
  PartyPopper,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MembershipStatusBadge,
  membershipStatusLabel,
} from "@/components/membership/status-badge";
import type {
  Membership,
  MembershipApplicationData,
  MembershipDocument,
  MembershipPayment,
  MembershipType,
} from "@/types/memberships";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "membership@wiez.co.zw";

function formatDate(value: string | Date | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function daysBetween(from: Date, to: Date): number {
  return Math.ceil((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// No application yet
// ---------------------------------------------------------------------------

export function NoApplicationState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-lime/15">
        <Award className="size-6 text-navy" />
      </div>
      <h2 className="mt-4 font-heading text-xl font-bold text-navy">
        You haven&apos;t applied for WiEZ membership yet
      </h2>
      <p className="mt-2 max-w-sm font-sans text-sm text-slate-500">
        Join Zimbabwe&apos;s premier network of women engineers, technologists and innovators.
      </p>
      <Button
        render={<Link href="/membership/apply" />}
        className="mt-6 h-11 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Apply for Membership
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Draft saved
// ---------------------------------------------------------------------------

function computeCompletedSteps(
  data: MembershipApplicationData | null,
  documents: MembershipDocument[] | null,
  membershipType: MembershipType
): boolean[] {
  const hasPersonalInfo = Boolean(data?.fullLegalName || data?.companyName);
  const hasProfessionalInfo = Boolean(
    data?.personalStatement || data?.professionalBio || data?.whyJoinWiez || data?.howSupportWomen
  );
  const requiredDocs = membershipType.requiredDocuments.filter(
    (label) => !label.includes("(Optional)")
  );
  const uploadedTypes = new Set((documents ?? []).map((doc) => doc.type));
  const hasAllDocs = requiredDocs.length > 0 && requiredDocs.every((label) => uploadedTypes.has(label));

  return [true, hasPersonalInfo, hasProfessionalInfo, hasAllDocs];
}

export function DraftState({
  draft,
  membershipType,
}: {
  draft: Membership;
  membershipType: MembershipType;
}) {
  const stepLabels = ["Membership Type", "Personal Info", "Professional Info", "Documents"];
  const completed = computeCompletedSteps(draft.applicationData, draft.documents, membershipType);

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6">
      <h2 className="font-heading text-xl font-bold text-navy">
        You have an incomplete application
      </h2>
      <p className="mt-1.5 font-sans text-sm text-slate-600">
        Continue your {membershipType.name} membership application — your progress has been
        saved.
      </p>

      <div className="mt-5 flex items-center gap-2">
        {stepLabels.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-full font-nav text-xs font-semibold",
                completed[index] ? "bg-lime text-navy" : "bg-white text-slate-400"
              )}
            >
              {completed[index] ? <Check className="size-3.5" /> : index + 1}
            </div>
            {index < stepLabels.length - 1 && (
              <div className={cn("h-0.5 flex-1", completed[index] ? "bg-lime" : "bg-slate-200")} />
            )}
          </div>
        ))}
      </div>

      <Button
        render={<Link href="/membership/apply" />}
        className="mt-6 h-11 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Continue Application
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Submitted / Under Review
// ---------------------------------------------------------------------------

const TIMELINE_STEPS = ["Submitted", "Under Review", "Outcome", "Payment", "Active"];

function timelineIndexForStatus(status: Membership["status"]): number {
  switch (status) {
    case "submitted":
      return 0;
    case "under_review":
    case "info_requested":
      return 1;
    case "pending_payment":
    case "rejected":
      return 2;
    case "payment_submitted":
    case "payment_verified":
      return 3;
    case "approved":
      return 4;
    default:
      return 0;
  }
}

export function SubmittedState({ membership }: { membership: Membership }) {
  const activeIndex = timelineIndexForStatus(membership.status);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-nav text-xs uppercase tracking-wide text-slate-400">
            Reference: {membership.applicationReference}
          </p>
          <h2 className="mt-1 font-heading text-xl font-bold text-navy">Your Application</h2>
        </div>
        <MembershipStatusBadge status={membership.status} />
      </div>

      <p className="mt-3 font-sans text-sm text-slate-500">
        Submitted {formatDate(membership.submittedAt)} · Estimated response: within 5–7
        business days
      </p>

      <div className="mt-6 flex items-center">
        {TIMELINE_STEPS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full font-nav text-xs font-semibold",
                  index < activeIndex
                    ? "bg-lime text-navy"
                    : index === activeIndex
                      ? "bg-navy text-white"
                      : "bg-slate-100 text-slate-400"
                )}
              >
                {index < activeIndex ? <Check className="size-3.5" /> : index + 1}
              </div>
              <p
                className={cn(
                  "mt-1.5 hidden font-nav text-[10px] font-medium sm:block",
                  index <= activeIndex ? "text-navy" : "text-slate-400"
                )}
              >
                {label}
              </p>
            </div>
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={cn("mx-1.5 h-0.5 flex-1", index < activeIndex ? "bg-lime" : "bg-slate-100")}
              />
            )}
          </div>
        ))}
      </div>

      {(membership.documents ?? []).length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
            Submitted Documents
          </p>
          <ul className="mt-2 space-y-1.5">
            {(membership.documents ?? []).map((doc) => (
              <li key={doc.type} className="flex items-center gap-2 font-sans text-sm text-slate-600">
                <Check className="size-3.5 text-green-600" />
                {doc.type}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-6 font-sans text-xs text-slate-400">
        If you need to add information, contact{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-navy underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Info Requested
// ---------------------------------------------------------------------------

export function InfoRequestedState({ membership }: { membership: Membership }) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6">
      <div className="flex items-start gap-3">
        <FileQuestion className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <div>
          <h2 className="font-heading text-lg font-bold text-navy">
            Additional Information Required
          </h2>
          <p className="mt-2 font-sans text-sm leading-relaxed text-slate-700">
            {membership.infoRequestMessage}
          </p>
        </div>
      </div>
      <p className="mt-4 font-sans text-xs text-slate-500">
        Our team will be in touch via email. You can also reach us directly at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-navy underline">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pending Payment
// ---------------------------------------------------------------------------

export function PendingPaymentState({
  membership,
  membershipType,
}: {
  membership: Membership;
  membershipType: MembershipType;
}) {
  const approvedAt = membership.approvedAt ? new Date(membership.approvedAt) : new Date();
  const deadline = new Date(approvedAt);
  deadline.setDate(deadline.getDate() + 14);
  const daysRemaining = Math.max(0, daysBetween(new Date(), deadline));

  return (
    <div className="rounded-2xl border border-lime/40 bg-lime/10 p-6">
      <div className="flex items-center gap-2">
        <PartyPopper className="size-5 text-navy" />
        <h2 className="font-heading text-xl font-bold text-navy">
          Your application has been approved!
        </h2>
      </div>
      <p className="mt-2 font-sans text-sm text-slate-700">
        Please make your membership payment within 14 days to activate your membership.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/60 bg-white p-4">
          <p className="font-nav text-xs uppercase tracking-wide text-slate-400">Amount Due</p>
          <p className="mt-1 font-heading text-2xl font-extrabold text-navy">
            ${membershipType.fee}
          </p>
        </div>
        <div className="rounded-xl border border-white/60 bg-white p-4">
          <p className="font-nav text-xs uppercase tracking-wide text-slate-400">
            Payment Deadline
          </p>
          <p
            className={cn(
              "mt-1 font-heading text-2xl font-extrabold",
              daysRemaining <= 3 ? "text-red-600" : "text-navy"
            )}
          >
            {daysRemaining} {daysRemaining === 1 ? "day" : "days"} left
          </p>
        </div>
      </div>

      <Button
        render={<Link href={`/membership/payment/${membership.id}`} />}
        className="mt-6 h-11 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Make Payment
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Payment Submitted
// ---------------------------------------------------------------------------

export function PaymentSubmittedState({ payment }: { payment: MembershipPayment | null }) {
  return (
    <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6">
      <div className="flex items-center gap-2">
        <Clock className="size-5 text-purple-600" />
        <h2 className="font-heading text-lg font-bold text-navy">
          Payment submitted — awaiting verification
        </h2>
      </div>
      <p className="mt-2 font-sans text-sm text-slate-600">
        Verification typically takes 1–2 business days.
      </p>

      {payment && (
        <dl className="mt-5 grid grid-cols-2 gap-4 rounded-xl bg-white p-4 sm:grid-cols-4">
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Method</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy capitalize">
              {payment.paymentMethod.replace("_", " ")}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Reference</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
              {payment.paymentReference}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Amount</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">${payment.amount}</dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Submitted</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
              {formatDate(payment.submittedAt)}
            </dd>
          </div>
        </dl>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Active Membership
// ---------------------------------------------------------------------------

export function ActiveState({
  membership,
  membershipType,
  memberName,
}: {
  membership: Membership;
  membershipType: MembershipType;
  memberName: string;
}) {
  const expiringSoon = membership.expiryDate
    ? daysBetween(new Date(), new Date(membership.expiryDate)) <= 60
    : false;

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-sm">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute -top-10 -right-10 size-32 rounded-full bg-lime/20 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="flex items-center justify-between">
            <p className="font-heading text-lg font-extrabold tracking-tight">
              W<span className="text-lime">i</span>EZ
            </p>
            <span className="font-nav text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Member
            </span>
          </div>

          <p className="mt-8 font-nav text-base font-semibold">{memberName}</p>
          <p className="mt-1 font-sans text-sm tracking-wide text-lime">
            {membership.membershipNumber}
          </p>

          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="font-nav text-[10px] uppercase tracking-wide text-white/50">Type</p>
              <p className="font-sans text-sm font-medium">{membershipType.name} Member</p>
            </div>
            <div className="text-right">
              <p className="font-nav text-[10px] uppercase tracking-wide text-white/50">Valid</p>
              <p className="font-sans text-sm font-medium">
                {formatDate(membership.startDate)} – {formatDate(membership.expiryDate)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {expiringSoon && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="flex items-center gap-2 font-sans text-sm text-amber-800">
            <AlertTriangle className="size-4" />
            Your membership expires on {formatDate(membership.expiryDate)}.
          </p>
          <Button size="sm" className="h-9 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]">
            Renew Membership
          </Button>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-bold text-navy">Membership Benefits</h3>
          <Button variant="outline" size="sm" className="h-8 rounded-[6px]">
            <Download className="size-3.5" />
            Download Certificate
          </Button>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {membershipType.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 font-sans text-sm text-slate-600">
              <Check className="mt-0.5 size-3.5 shrink-0 text-lime" strokeWidth={3} />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rejected / Suspended / Revoked
// ---------------------------------------------------------------------------

export function RejectedState({ membership }: { membership: Membership }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6">
      <div className="flex items-center gap-2">
        <XCircle className="size-5 text-red-600" />
        <h2 className="font-heading text-lg font-bold text-navy">Application Not Approved</h2>
      </div>
      {membership.rejectionReason && (
        <p className="mt-3 font-sans text-sm leading-relaxed text-slate-700">
          {membership.rejectionReason}
        </p>
      )}
      <p className="mt-3 font-sans text-sm text-slate-600">
        You may re-apply after addressing the issues noted above.
      </p>
      <Button
        render={<Link href="/membership/apply" />}
        className="mt-5 h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Re-apply
      </Button>
    </div>
  );
}

export function SuspendedOrRevokedState({ membership }: { membership: Membership }) {
  const isRevoked = membership.status === "revoked";
  return (
    <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="size-5 text-orange-600" />
        <h2 className="font-heading text-lg font-bold text-navy">
          Membership {isRevoked ? "Revoked" : "Suspended"}
        </h2>
      </div>
      {membership.rejectionReason && (
        <p className="mt-3 font-sans text-sm leading-relaxed text-slate-700">
          {membership.rejectionReason}
        </p>
      )}
      <p className="mt-4 font-sans text-xs text-slate-500">
        <Mail className="mr-1 inline size-3.5" />
        Contact{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-navy underline">
          {CONTACT_EMAIL}
        </a>{" "}
        for more information.
      </p>
    </div>
  );
}

export function ExpiredState({ membership }: { membership: Membership }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
      <div className="flex items-center gap-2">
        <Clock className="size-5 text-slate-500" />
        <h2 className="font-heading text-lg font-bold text-navy">Membership Expired</h2>
      </div>
      <p className="mt-3 font-sans text-sm text-slate-600">
        Your membership expired on {formatDate(membership.expiryDate)}. Renew or re-apply to
        regain access to member benefits.
      </p>
      <Button
        render={<Link href="/membership/apply" />}
        className="mt-5 h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Re-apply
      </Button>
    </div>
  );
}

export { membershipStatusLabel };
