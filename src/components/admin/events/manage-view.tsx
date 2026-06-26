"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Calendar, Edit, Loader2, MapPin, Users, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { ActionDialog } from "@/components/admin/membership-detail/action-dialog";
import {
  ApproveRegistrationAction,
  RejectRegistrationAction,
  VerifyEventPaymentAction,
  RejectEventPaymentAction,
  MarkAttendedAction,
} from "@/components/admin/events/registration-actions";
import { publishEvent, cancelEvent, type EventRegistrationListItem } from "@/actions/events";
import type { Event } from "@/types/events";

const columnHelper = createColumnHelper<EventRegistrationListItem>();

function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const STATUS_LABELS: Record<string, string> = {
  pending_review: "Pending Review",
  confirmed: "Confirmed",
  rejected: "Rejected",
  cancelled: "Cancelled",
  attended: "Attended",
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  not_required: "Not Required",
  pending: "Pending",
  submitted: "Submitted",
  verified: "Verified",
};

function AttendeeCell({ name, email }: { name: string; email: string }) {
  return (
    <div>
      <p className="font-medium text-navy">{name}</p>
      <p className="text-xs text-slate-400">{email}</p>
    </div>
  );
}

function OverviewTab({ event }: { event: Event }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    const result = await publishEvent(event.id);
    setIsPublishing(false);
    if (result.success) {
      toast.success("Event published.");
      router.refresh();
    } else {
      toast.error(result.error ?? "Failed to publish event.");
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-bold text-navy">{event.title}</h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 font-sans text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDateTime(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {event.venue}, {event.province}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {event.registeredCount}/{event.capacity} registered
              </span>
            </div>
          </div>
          <StatusBadge
            status={event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          />
        </div>
        <p className="mt-4 font-sans text-sm leading-relaxed text-slate-600">{event.description}</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Type</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy capitalize">
              {event.type.replace("_", " ")}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Fee</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
              {event.fee > 0 ? `$${event.fee}` : "Free"}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Approval Required</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
              {event.requiresApproval ? "Yes" : "No"}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">Created</dt>
            <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
              {formatDateTime(event.createdAt)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-400">Actions</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/admin/events/${event.id}`)}
          className="h-10 w-full rounded-[6px]"
        >
          <Edit className="size-4" />
          Edit Event
        </Button>

        {event.status === "draft" && (
          <Button
            type="button"
            onClick={() => void handlePublish()}
            disabled={isPublishing}
            className="h-10 w-full rounded-[6px] bg-green-600 text-white hover:bg-green-700"
          >
            {isPublishing && <Loader2 className="size-4 animate-spin" />}
            Publish Event
          </Button>
        )}

        {(event.status === "published" || event.status === "draft") && (
          <ActionDialog
            trigger={
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full rounded-[6px] border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="size-4" />
                Cancel Event
              </Button>
            }
            title="Cancel Event"
            description="Registrants will need to be notified separately. This cannot be easily undone."
            confirmLabel="Cancel Event"
            destructive
            onConfirm={async () => {
              const result = await cancelEvent(event.id);
              if (result.success) {
                toast.success("Event cancelled.");
                router.refresh();
                return true;
              }
              toast.error(result.error ?? "Failed to cancel event.");
              return false;
            }}
          />
        )}
      </div>
    </div>
  );
}

export function ManageEventView({
  event,
  registrations,
}: {
  event: Event;
  registrations: EventRegistrationListItem[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState("overview");

  function refresh() {
    router.refresh();
  }

  const pendingRegistrations = useMemo(
    () => registrations.filter((r) => r.status === "pending_review"),
    [registrations]
  );
  const attendanceRows = useMemo(
    () => registrations.filter((r) => r.status === "confirmed" || r.status === "attended"),
    [registrations]
  );
  const paymentRows = useMemo(
    () => registrations.filter((r) => r.paymentStatus !== "not_required"),
    [registrations]
  );

  const registrationColumns = useMemo(
    () => [
      columnHelper.accessor("attendeeName", {
        header: "Attendee",
        cell: (info) => <AttendeeCell name={info.getValue()} email={info.row.original.attendeeEmail} />,
      }),
      columnHelper.accessor("registrationReference", { header: "Reference" }),
      columnHelper.accessor("registeredAt", {
        header: "Registered",
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor("source", {
        header: "Source",
        cell: (info) => <span className="capitalize">{info.getValue()}</span>,
      }),
      columnHelper.display({
        id: "stage",
        header: "Stage",
        cell: ({ row }) =>
          row.original.adminApproved ? (
            <StatusBadge status="Awaiting Payment" className="bg-blue-100 text-blue-700 border-blue-200" />
          ) : (
            <StatusBadge status="Pending Review" />
          ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.adminApproved ? (
            <span className="font-sans text-xs text-slate-400">Waiting on attendee</span>
          ) : (
            <div className="flex items-center gap-2">
              <ApproveRegistrationAction registrationId={row.original.id} onSuccess={refresh} />
              <RejectRegistrationAction registrationId={row.original.id} onSuccess={refresh} />
            </div>
          ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable across renders
    []
  );

  const attendanceColumns = useMemo(
    () => [
      columnHelper.accessor("attendeeName", {
        header: "Attendee",
        cell: (info) => <AttendeeCell name={info.getValue()} email={info.row.original.attendeeEmail} />,
      }),
      columnHelper.accessor("ticketNumber", {
        header: "Ticket",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={STATUS_LABELS[info.getValue()] ?? info.getValue()} />,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.status === "confirmed" ? (
            <MarkAttendedAction registrationId={row.original.id} onSuccess={refresh} />
          ) : (
            <span className="font-sans text-xs text-slate-400">Checked in</span>
          ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable across renders
    []
  );

  const paymentColumns = useMemo(
    () => [
      columnHelper.accessor("attendeeName", {
        header: "Attendee",
        cell: (info) => <AttendeeCell name={info.getValue()} email={info.row.original.attendeeEmail} />,
      }),
      columnHelper.accessor("paymentMethod", {
        header: "Method",
        cell: (info) => (
          <span className="capitalize">{info.getValue()?.replace("_", " ") ?? "—"}</span>
        ),
      }),
      columnHelper.accessor("paymentReference", {
        header: "Reference",
        cell: (info) => info.getValue() ?? "—",
      }),
      columnHelper.accessor("paymentStatus", {
        header: "Status",
        cell: (info) => (
          <StatusBadge status={PAYMENT_STATUS_LABELS[info.getValue()] ?? info.getValue()} />
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) =>
          row.original.paymentStatus === "submitted" ? (
            <div className="flex items-center gap-2">
              <VerifyEventPaymentAction registrationId={row.original.id} onSuccess={refresh} />
              <RejectEventPaymentAction registrationId={row.original.id} onSuccess={refresh} />
            </div>
          ) : (
            <span className="font-sans text-xs text-slate-400">No action needed</span>
          ),
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable across renders
    []
  );

  return (
    <div className="space-y-5">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registrations">
            Registrations{pendingRegistrations.length > 0 ? ` (${pendingRegistrations.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payments">
            Payments
            {paymentRows.filter((r) => r.paymentStatus === "submitted").length > 0
              ? ` (${paymentRows.filter((r) => r.paymentStatus === "submitted").length})`
              : ""}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewTab event={event} />
        </TabsContent>

        <TabsContent value="registrations">
          {pendingRegistrations.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={registrationColumns} data={pendingRegistrations} />
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No pending registrations"
              description="New registrations awaiting review will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="attendance">
          {attendanceRows.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={attendanceColumns} data={attendanceRows} />
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No confirmed attendees yet"
              description="Confirmed registrations will appear here for check-in."
            />
          )}
        </TabsContent>

        <TabsContent value="payments">
          {paymentRows.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={paymentColumns} data={paymentRows} />
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No payments to review"
              description="Payments submitted via WhatsApp will appear here for verification."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
