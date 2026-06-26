"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createEvent, updateEvent, type CreateEventInput } from "@/actions/events";
import { ZIMBABWE_PROVINCES, EVENT_TYPES } from "@/lib/constants";
import type { Event, EventType } from "@/types/events";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      <FieldError message={error} />
    </div>
  );
}

function toDatetimeLocal(value: Date | string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

const TYPE_LABELS: Record<EventType, string> = {
  free: "Free",
  paid: "Paid",
  member_only: "Member Only",
  corporate_sponsored: "Corporate Sponsored",
};

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter();
  const isEdit = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(toDatetimeLocal(event?.date));
  const [endDate, setEndDate] = useState(toDatetimeLocal(event?.endDate));
  const [venue, setVenue] = useState(event?.venue ?? "");
  const [province, setProvince] = useState(event?.province ?? "");
  const [type, setType] = useState<EventType | "">(event?.type ?? "");
  const [fee, setFee] = useState(event ? String(event.fee) : "0");
  const [capacity, setCapacity] = useState(event ? String(event.capacity) : "");
  const [requiresApproval, setRequiresApproval] = useState(event?.requiresApproval ?? false);
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [publishImmediately, setPublishImmediately] = useState(event?.status === "published");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required.";
    if (!description.trim()) next.description = "Description is required.";
    if (!date) next.date = "Date and time are required.";
    if (!venue.trim()) next.venue = "Venue is required.";
    if (!province) next.province = "Province is required.";
    if (!type) next.type = "Event type is required.";
    if (!capacity || Number(capacity) < 1) next.capacity = "Capacity must be at least 1.";
    if (type === "paid" && (!fee || Number(fee) <= 0)) {
      next.fee = "Paid events must have a fee greater than 0.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    setIsSubmitting(true);

    const input: CreateEventInput = {
      title: title.trim(),
      description: description.trim(),
      date: new Date(date).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      venue: venue.trim(),
      province: province as CreateEventInput["province"],
      type: type as EventType,
      fee: type === "free" ? 0 : Number(fee) || 0,
      capacity: Number(capacity),
      requiresApproval,
      status: publishImmediately ? "published" : "draft",
      imageUrl: imageUrl.trim() || undefined,
    };

    const result = isEdit ? await updateEvent(event!.id, input) : await createEvent(input);

    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to save event.");
      return;
    }

    toast.success(isEdit ? "Event updated." : "Event created.");
    const id = isEdit ? event!.id : (result as { data: { id: string } }).data.id;
    router.push(`/admin/events/${id}/manage`);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-heading text-sm font-bold text-navy">Event Details</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Title" required error={errors.title} className="sm:col-span-2">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-[8px]" />
          </Field>

          <Field label="Description" required error={errors.description} className="sm:col-span-2">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-[8px]"
            />
          </Field>

          <Field label="Date & Time" required error={errors.date}>
            <Input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-11 rounded-[8px]"
            />
          </Field>

          <Field label="End Date & Time (optional)" error={errors.endDate}>
            <Input
              type="datetime-local"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-11 rounded-[8px]"
            />
          </Field>

          <Field label="Venue" required error={errors.venue}>
            <Input value={venue} onChange={(e) => setVenue(e.target.value)} className="h-11 rounded-[8px]" />
          </Field>

          <Field label="Province" required error={errors.province}>
            <Select value={province} onValueChange={(value) => setProvince(value ?? "")}>
              <SelectTrigger className="h-11 w-full rounded-[8px]">
                <SelectValue placeholder="Select province" />
              </SelectTrigger>
              <SelectContent>
                {ZIMBABWE_PROVINCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Event Type" required error={errors.type}>
            <Select value={type} onValueChange={(value) => setType((value as EventType) ?? "")}>
              <SelectTrigger className="h-11 w-full rounded-[8px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Fee (USD)" error={errors.fee}>
            <Input
              type="number"
              min={0}
              step="0.01"
              value={fee}
              disabled={type === "free"}
              onChange={(e) => setFee(e.target.value)}
              className="h-11 rounded-[8px]"
            />
          </Field>

          <Field label="Capacity" required error={errors.capacity}>
            <Input
              type="number"
              min={1}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="h-11 rounded-[8px]"
            />
          </Field>

          <Field label="Image URL (optional)" className="sm:col-span-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="h-11 rounded-[8px]"
            />
          </Field>
        </div>

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
          <label className="flex items-start gap-2.5">
            <Checkbox
              checked={requiresApproval}
              onCheckedChange={(checked) => setRequiresApproval(checked === true)}
            />
            <span className="font-sans text-sm text-slate-600">
              Require admin approval before confirming registrations (automatically applies to Paid and
              Member Only events)
            </span>
          </label>
          <label className="flex items-start gap-2.5">
            <Checkbox
              checked={publishImmediately}
              onCheckedChange={(checked) => setPublishImmediately(checked === true)}
            />
            <span className="font-sans text-sm text-slate-600">
              Publish immediately (visible to members and bookable via the website and WhatsApp)
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} className="h-10 rounded-[6px]">
          Cancel
        </Button>
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isSubmitting}
          className="h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Event"}
        </Button>
      </div>
    </div>
  );
}
