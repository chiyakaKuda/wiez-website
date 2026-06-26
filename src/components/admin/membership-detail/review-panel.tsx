"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ActionDialog } from "@/components/admin/membership-detail/action-dialog";
import { MembershipStatusBadge } from "@/components/membership/status-badge";
import {
  markAsUnderReview,
  requestMoreInformation,
  approveMembership,
  rejectMembership,
  verifyPayment,
  rejectPayment,
  suspendMembership,
  revokeMembership,
  addReviewNote,
} from "@/actions/memberships";
import type { MembershipDetail } from "@/actions/memberships";

function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Individual action buttons / modals
// ---------------------------------------------------------------------------

function MarkUnderReviewButton({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await markAsUnderReview(membershipId);
    setLoading(false);
    if (result.success) {
      toast.success("Marked as under review.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to update status.");
    }
  }

  return (
    <Button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="h-10 w-full rounded-[6px] bg-indigo-600 text-white hover:bg-indigo-700"
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      Mark as Under Review
    </Button>
  );
}

function RequestInfoAction({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [message, setMessage] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[6px] border-amber-300 text-amber-700 hover:bg-amber-50"
        >
          Request More Information
        </Button>
      }
      title="Request More Information"
      description="This message will be sent to the applicant explaining what's needed."
      confirmLabel="Send Request"
      confirmDisabled={!message.trim()}
      onConfirm={async () => {
        const result = await requestMoreInformation(membershipId, message.trim());
        if (result.success) {
          toast.success("Information request sent.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to send request.");
        return false;
      }}
    >
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="What additional information or documents are required?"
        rows={4}
      />
    </ActionDialog>
  );
}

function ApproveAction({
  membership,
  onSuccess,
}: {
  membership: MembershipDetail;
  onSuccess: () => void;
}) {
  const [note, setNote] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button type="button" className="h-10 w-full rounded-[6px] bg-green-600 text-white hover:bg-green-700">
          Approve Application
        </Button>
      }
      title="Approve Application"
      description={`Approve ${membership.applicant.name}'s ${membership.membershipType.name} membership ($${membership.membershipType.fee}/year). They'll be asked to submit payment within 14 days.`}
      confirmLabel="Approve & Request Payment"
      onConfirm={async () => {
        const result = await approveMembership(membership.id, note.trim() || undefined);
        if (result.success) {
          toast.success("Application approved.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to approve application.");
        return false;
      }}
    >
      <Textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Optional note to applicant..."
        rows={3}
      />
    </ActionDialog>
  );
}

function RejectAction({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [suggestions, setSuggestions] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
        >
          Reject Application
        </Button>
      }
      title="Reject Application"
      confirmLabel="Confirm Rejection"
      destructive
      confirmDisabled={!reason.trim()}
      onConfirm={async () => {
        const fullReason = suggestions.trim()
          ? `${reason.trim()}\n\nSuggestions for re-application: ${suggestions.trim()}`
          : reason.trim();
        const result = await rejectMembership(membershipId, fullReason);
        if (result.success) {
          toast.success("Application rejected.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to reject application.");
        return false;
      }}
    >
      <div>
        <Label>
          Rejection Reason <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          rows={3}
          className="mt-1.5"
        />
      </div>
      <div>
        <Label>Suggestions for re-application (optional)</Label>
        <Textarea
          value={suggestions}
          onChange={(event) => setSuggestions(event.target.value)}
          rows={2}
          className="mt-1.5"
        />
      </div>
    </ActionDialog>
  );
}

function VerifyPaymentAction({
  membership,
  onSuccess,
}: {
  membership: MembershipDetail;
  onSuccess: () => void;
}) {
  const [note, setNote] = useState("");
  const payment = membership.payments[0];

  return (
    <ActionDialog
      trigger={
        <Button type="button" className="h-10 w-full rounded-[6px] bg-green-600 text-white hover:bg-green-700">
          Verify Payment
        </Button>
      }
      title="Verify Payment"
      description={
        payment
          ? `Confirm you have received $${payment.amount} via ${payment.paymentMethod.replace("_", " ")} with reference ${payment.paymentReference}.`
          : undefined
      }
      confirmLabel="Confirm & Activate Membership"
      onConfirm={async () => {
        const result = await verifyPayment(membership.id, note.trim() || undefined);
        if (result.success) {
          toast.success(
            result.data ? `Membership activated: ${result.data.membershipNumber}` : "Membership activated."
          );
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to verify payment.");
        return false;
      }}
    >
      <Textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Internal note (optional)"
        rows={3}
      />
    </ActionDialog>
  );
}

function RejectPaymentAction({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
        >
          Reject Payment
        </Button>
      }
      title="Reject Payment"
      confirmLabel="Reject & Request Re-payment"
      destructive
      confirmDisabled={!reason.trim()}
      onConfirm={async () => {
        const result = await rejectPayment(membershipId, reason.trim());
        if (result.success) {
          toast.success("Payment rejected.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to reject payment.");
        return false;
      }}
    >
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Reason for rejection"
        rows={3}
      />
    </ActionDialog>
  );
}

function SuspendAction({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[6px] border-orange-300 text-orange-700 hover:bg-orange-50"
        >
          Suspend Membership
        </Button>
      }
      title="Suspend Membership"
      confirmLabel="Suspend"
      destructive
      confirmDisabled={!reason.trim()}
      onConfirm={async () => {
        const result = await suspendMembership(membershipId, reason.trim());
        if (result.success) {
          toast.success("Membership suspended.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to suspend membership.");
        return false;
      }}
    >
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Reason for suspension"
        rows={3}
      />
    </ActionDialog>
  );
}

function RevokeAction({
  membershipId,
  onSuccess,
}: {
  membershipId: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
        >
          Revoke Membership
        </Button>
      }
      title="Revoke Membership"
      description="This action is permanent. Revoked members forfeit all membership benefits with no refund of fees paid."
      confirmLabel="Revoke Membership"
      destructive
      confirmDisabled={!reason.trim() || !confirmed}
      onConfirm={async () => {
        const result = await revokeMembership(membershipId, reason.trim());
        if (result.success) {
          toast.success("Membership revoked.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to revoke membership.");
        return false;
      }}
    >
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Reason for revocation"
        rows={3}
      />
      <label className="flex items-start gap-2.5">
        <Checkbox checked={confirmed} onCheckedChange={(checked) => setConfirmed(checked === true)} />
        <span className="font-sans text-sm text-slate-600">
          I understand this action is permanent and cannot be undone.
        </span>
      </label>
    </ActionDialog>
  );
}

// ---------------------------------------------------------------------------
// Status-aware action list
// ---------------------------------------------------------------------------

function StatusActions({
  membership,
  isOwnApplication,
  onSuccess,
}: {
  membership: MembershipDetail;
  isOwnApplication: boolean;
  onSuccess: () => void;
}) {
  const { status } = membership;

  if (status === "submitted" || status === "under_review" || status === "info_requested") {
    return (
      <div className="space-y-2.5">
        {status === "info_requested" && membership.infoRequestMessage && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="font-nav text-xs font-semibold text-amber-700">
              Info requested from applicant:
            </p>
            <p className="mt-1 font-sans text-sm text-amber-900">
              {membership.infoRequestMessage}
            </p>
          </div>
        )}
        {status !== "under_review" && (
          <MarkUnderReviewButton membershipId={membership.id} onSuccess={onSuccess} />
        )}
        <RequestInfoAction membershipId={membership.id} onSuccess={onSuccess} />
        {isOwnApplication ? (
          <p className="font-sans text-xs text-slate-400 italic">
            You cannot approve your own membership application.
          </p>
        ) : (
          <ApproveAction membership={membership} onSuccess={onSuccess} />
        )}
        <RejectAction membershipId={membership.id} onSuccess={onSuccess} />
      </div>
    );
  }

  if (status === "pending_payment") {
    return (
      <p className="font-sans text-sm text-slate-400">
        Waiting for the applicant to submit payment proof.
      </p>
    );
  }

  if (status === "payment_submitted" || status === "payment_verified") {
    return (
      <div className="space-y-2.5">
        <VerifyPaymentAction membership={membership} onSuccess={onSuccess} />
        <RejectPaymentAction membershipId={membership.id} onSuccess={onSuccess} />
      </div>
    );
  }

  if (status === "approved") {
    return (
      <div className="space-y-2.5">
        <SuspendAction membershipId={membership.id} onSuccess={onSuccess} />
        <RevokeAction membershipId={membership.id} onSuccess={onSuccess} />
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <div className="space-y-2.5">
        <RevokeAction membershipId={membership.id} onSuccess={onSuccess} />
      </div>
    );
  }

  return <p className="font-sans text-sm text-slate-400">No actions available for this status.</p>;
}

// ---------------------------------------------------------------------------
// Review panel
// ---------------------------------------------------------------------------

export function ReviewPanel({
  membership,
  currentAdminId,
}: {
  membership: MembershipDetail;
  currentAdminId: string;
}) {
  const router = useRouter();
  const [noteText, setNoteText] = useState("");
  const [isSavingNote, setIsSavingNote] = useState(false);

  function refresh() {
    router.refresh();
  }

  async function handleAddNote() {
    if (!noteText.trim()) return;
    setIsSavingNote(true);
    const result = await addReviewNote(membership.id, noteText.trim());
    setIsSavingNote(false);
    if (result.success) {
      toast.success("Note added.");
      setNoteText("");
      refresh();
    } else {
      toast.error(result.error ?? "Failed to add note.");
    }
  }

  const isOwnApplication = membership.userId === currentAdminId;

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
          Current Status
        </p>
        <div className="mt-2">
          <MembershipStatusBadge status={membership.status} className="text-sm" />
        </div>
        <p className="mt-2 font-sans text-xs text-slate-400">
          Last updated {formatDateTime(membership.updatedAt)}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
          Actions
        </p>
        <div className="mt-3">
          <StatusActions
            membership={membership}
            isOwnApplication={isOwnApplication}
            onSuccess={refresh}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
          Internal Review Notes
        </p>
        <div className="mt-3 max-h-64 space-y-2.5 overflow-y-auto">
          {membership.reviewNotes.length === 0 ? (
            <p className="font-sans text-sm text-slate-400">No notes yet.</p>
          ) : (
            membership.reviewNotes.map((note) => (
              <div key={note.id} className="rounded-lg bg-slate-50 p-3">
                <p className="font-sans text-sm text-navy">{note.note}</p>
                <p className="mt-1 font-sans text-xs text-slate-400">
                  {note.adminName} · {formatDateTime(note.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
        <Textarea
          value={noteText}
          onChange={(event) => setNoteText(event.target.value)}
          placeholder="Add note..."
          rows={3}
          className="mt-3"
        />
        <Button
          type="button"
          onClick={handleAddNote}
          disabled={isSavingNote || !noteText.trim()}
          className="mt-2 h-9 w-full rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          {isSavingNote && <Loader2 className="size-4 animate-spin" />}
          Save Note
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">
          Activity Log
        </p>
        <ol className="mt-3 space-y-3">
          {membership.statusHistory.map((entry) => (
            <li key={entry.id} className="border-l-2 border-slate-100 pl-3">
              <p className="font-sans text-sm text-navy">
                {entry.fromStatus ?? "Created"} → {entry.toStatus}
              </p>
              <p className="font-sans text-xs text-slate-400">
                {entry.changedByName} · {formatDateTime(entry.createdAt)}
              </p>
              {entry.reason && (
                <p className="mt-0.5 font-sans text-xs text-slate-500">&ldquo;{entry.reason}&rdquo;</p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
