"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ActionDialog } from "@/components/admin/membership-detail/action-dialog";
import {
  approveEventRegistration,
  rejectEventRegistration,
  verifyEventPayment,
  rejectEventPayment,
  markAttended,
} from "@/actions/events";

export function ApproveRegistrationAction({
  registrationId,
  onSuccess,
}: {
  registrationId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await approveEventRegistration(registrationId);
    setLoading(false);
    if (result.success) {
      toast.success("Registration approved.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to approve registration.");
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="h-8 rounded-[6px] bg-green-600 text-white hover:bg-green-700"
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      Approve
    </Button>
  );
}

export function RejectRegistrationAction({
  registrationId,
  onSuccess,
}: {
  registrationId: string;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <ActionDialog
      trigger={
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8 rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
        >
          Reject
        </Button>
      }
      title="Reject Registration"
      confirmLabel="Confirm Rejection"
      destructive
      onConfirm={async () => {
        const result = await rejectEventRegistration(registrationId, reason.trim() || undefined);
        if (result.success) {
          toast.success("Registration rejected.");
          onSuccess();
          return true;
        }
        toast.error(result.error ?? "Failed to reject registration.");
        return false;
      }}
    >
      <Textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Reason for rejection (optional)"
        rows={3}
      />
    </ActionDialog>
  );
}

export function VerifyEventPaymentAction({
  registrationId,
  onSuccess,
}: {
  registrationId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await verifyEventPayment(registrationId);
    setLoading(false);
    if (result.success) {
      toast.success("Payment verified — ticket issued.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to verify payment.");
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="h-8 rounded-[6px] bg-green-600 text-white hover:bg-green-700"
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      Verify Payment
    </Button>
  );
}

export function RejectEventPaymentAction({
  registrationId,
  onSuccess,
}: {
  registrationId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await rejectEventPayment(registrationId);
    setLoading(false);
    if (result.success) {
      toast.success("Payment rejected — attendee will be asked to pay again.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to reject payment.");
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      variant="outline"
      onClick={handleClick}
      disabled={loading}
      className="h-8 rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      Reject Payment
    </Button>
  );
}

export function MarkAttendedAction({
  registrationId,
  onSuccess,
}: {
  registrationId: string;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await markAttended(registrationId);
    setLoading(false);
    if (result.success) {
      toast.success("Marked as attended.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to mark attendance.");
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="h-8 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      Mark Attended
    </Button>
  );
}
