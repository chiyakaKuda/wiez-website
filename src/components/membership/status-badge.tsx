import { cn } from "@/lib/utils";
import type { MembershipStatus } from "@/types/memberships";

const STATUS_STYLES: Record<MembershipStatus, string> = {
  draft: "bg-slate-100 text-slate-500 border-slate-200",
  submitted: "bg-blue-100 text-blue-700 border-blue-200",
  under_review: "bg-indigo-100 text-indigo-700 border-indigo-200",
  info_requested: "bg-amber-100 text-amber-700 border-amber-200",
  pending_payment: "bg-yellow-100 text-yellow-700 border-yellow-200",
  payment_submitted: "bg-purple-100 text-purple-700 border-purple-200",
  payment_verified: "bg-teal-100 text-teal-700 border-teal-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
  suspended: "bg-orange-100 text-orange-700 border-orange-200",
  // Not in the original spec palette — added alongside the "revoked" status
  // itself, distinct (darker/rose) from "rejected" since it's a more severe,
  // permanent outcome applied to a formerly-active membership.
  revoked: "bg-rose-200 text-rose-800 border-rose-300",
  expired: "bg-slate-100 text-slate-500 border-slate-200",
};

const STATUS_LABELS: Record<MembershipStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  info_requested: "Info Requested",
  pending_payment: "Pending Payment",
  payment_submitted: "Payment Submitted",
  payment_verified: "Payment Verified",
  approved: "Active",
  rejected: "Rejected",
  suspended: "Suspended",
  revoked: "Revoked",
  expired: "Expired",
};

export function membershipStatusLabel(status: MembershipStatus): string {
  return STATUS_LABELS[status];
}

export function MembershipStatusBadge({
  status,
  className,
}: {
  status: MembershipStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-nav text-xs font-medium whitespace-nowrap",
        STATUS_STYLES[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
