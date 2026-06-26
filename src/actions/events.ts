"use server";

import { revalidatePath } from "next/cache";
import { and, asc, desc, eq, gt, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, eventRegistrations, eventPayments, users } from "@/db/schema";
import { type ActionResult, errorMessage } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth-utils";
import { SECTION_ROLES } from "@/lib/rbac";
import {
  notifyEventApproved,
  notifyEventRegistrationRejected,
  notifyEventPaymentVerified,
  notifyEventPaymentRejected,
} from "@/lib/whatsapp/notifications";
import type {
  Event,
  EventRegistration,
  EventRegistrationStatus,
  EventStatus,
  EventType,
} from "@/types/events";
import type { PaymentMethod } from "@/types/memberships";
import type { ZimbabweProvince } from "@/types/auth";

async function requireEventsAdmin(): Promise<{ id: string; name: string }> {
  const user = await getCurrentUser();
  const allowedRoles: readonly string[] = SECTION_ROLES.events;
  if (!user || !user.roles.some((role) => allowedRoles.includes(role))) {
    throw new Error("You do not have permission to perform this action.");
  }
  return { id: user.id, name: user.name };
}

export async function getPendingEventRegistrationsCount(): Promise<number> {
  await requireEventsAdmin();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.status, "pending_review"));
  return row.count;
}

// ---------------------------------------------------------------------------
// Reference generators — pure DB sequence reads, no session dependency.
// Safe to call from the WhatsApp webhook as well as web admin actions.
// ---------------------------------------------------------------------------

export async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.execute<{ seq: string }>(
    sql`SELECT nextval('ticket_number_seq') AS seq`
  );
  const seq = Number(result.rows[0]?.seq ?? 0);
  return `WIEZ-TKT-${year}-${String(seq).padStart(4, "0")}`;
}

export async function generateRegReference(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.execute<{ seq: string }>(
    sql`SELECT nextval('registration_reference_seq') AS seq`
  );
  const seq = Number(result.rows[0]?.seq ?? 0);
  return `WIEZ-REG-${year}-${String(seq).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Ungated reads — used by both the public/WhatsApp surface and admin pages.
// ---------------------------------------------------------------------------

export async function getPublishedUpcomingEvents(limit = 5): Promise<Event[]> {
  const rows = await db.query.events.findMany({
    where: and(eq(events.status, "published"), gt(events.date, new Date())),
    orderBy: asc(events.date),
    limit,
  });
  return rows as Event[];
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = await db.query.events.findFirst({ where: eq(events.id, id) });
  return (event as Event) ?? null;
}

/**
 * Used by the WhatsApp events flow (no web session exists there) and by
 * the web registration path alike. Encapsulates the free-vs-paid/member-only
 * confirm logic from the spec in one place.
 */
export async function createEventRegistration(input: {
  eventId: string;
  userId: string;
  source: "web" | "whatsapp";
}): Promise<
  ActionResult<{
    registrationId: string;
    status: EventRegistrationStatus;
    ticketNumber: string | null;
    registrationReference: string;
  }>
> {
  try {
    const event = await db.query.events.findFirst({ where: eq(events.id, input.eventId) });
    if (!event) return { success: false, error: "Event not found." };
    if (event.status !== "published") {
      return { success: false, error: "This event is not open for registration." };
    }
    if (event.registeredCount >= event.capacity) {
      return { success: false, error: "This event is fully booked." };
    }

    const existing = await db.query.eventRegistrations.findFirst({
      where: and(
        eq(eventRegistrations.eventId, input.eventId),
        eq(eventRegistrations.userId, input.userId)
      ),
    });
    if (existing) {
      return { success: false, error: "You have already registered for this event." };
    }

    if (event.type === "member_only") {
      const membership = await getUserCurrentMembershipFor(input.userId);
      if (!membership || membership.status !== "approved") {
        return {
          success: false,
          error: "This event is for active WiEZ members only.",
        };
      }
    }

    const registrationReference = await generateRegReference();
    const needsApproval = event.requiresApproval || event.type === "paid" || event.type === "member_only";

    if (!needsApproval) {
      const ticketNumber = await generateTicketNumber();
      const [registration] = await db
        .insert(eventRegistrations)
        .values({
          eventId: input.eventId,
          userId: input.userId,
          ticketNumber,
          registrationReference,
          status: "confirmed",
          paymentStatus: "not_required",
          source: input.source,
        })
        .returning({ id: eventRegistrations.id });

      await db
        .update(events)
        .set({ registeredCount: event.registeredCount + 1 })
        .where(eq(events.id, event.id));

      return {
        success: true,
        data: {
          registrationId: registration.id,
          status: "confirmed",
          ticketNumber,
          registrationReference,
        },
      };
    }

    const [registration] = await db
      .insert(eventRegistrations)
      .values({
        eventId: input.eventId,
        userId: input.userId,
        registrationReference,
        status: "pending_review",
        paymentStatus: event.fee > 0 ? "pending" : "not_required",
        source: input.source,
      })
      .returning({ id: eventRegistrations.id });

    return {
      success: true,
      data: {
        registrationId: registration.id,
        status: "pending_review",
        ticketNumber: null,
        registrationReference,
      },
    };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

async function getUserCurrentMembershipFor(userId: string) {
  // getUserCurrentMembership() reads the session internally for the web
  // flow; the WhatsApp flow has no session, so look the user up directly.
  return db.query.memberships.findFirst({
    where: (table, { eq: equals, ne: notEqual, and: andFn }) =>
      andFn(equals(table.userId, userId), notEqual(table.status, "draft")),
    orderBy: (table, { desc: descFn }) => descFn(table.createdAt),
  });
}

export async function getUserEventRegistrations(userId: string): Promise<
  (EventRegistration & { eventTitle: string; eventDate: Date })[]
> {
  const rows = await db
    .select({
      id: eventRegistrations.id,
      eventId: eventRegistrations.eventId,
      userId: eventRegistrations.userId,
      ticketNumber: eventRegistrations.ticketNumber,
      registrationReference: eventRegistrations.registrationReference,
      status: eventRegistrations.status,
      adminApproved: eventRegistrations.adminApproved,
      paymentStatus: eventRegistrations.paymentStatus,
      paymentMethod: eventRegistrations.paymentMethod,
      paymentReference: eventRegistrations.paymentReference,
      paymentProofUrl: eventRegistrations.paymentProofUrl,
      rejectionReason: eventRegistrations.rejectionReason,
      source: eventRegistrations.source,
      registeredAt: eventRegistrations.registeredAt,
      createdAt: eventRegistrations.createdAt,
      updatedAt: eventRegistrations.updatedAt,
      eventTitle: events.title,
      eventDate: events.date,
    })
    .from(eventRegistrations)
    .innerJoin(events, eq(eventRegistrations.eventId, events.id))
    .where(eq(eventRegistrations.userId, userId))
    .orderBy(desc(eventRegistrations.createdAt))
    .limit(5);

  return rows as (EventRegistration & { eventTitle: string; eventDate: Date })[];
}

/** Records a simulated WhatsApp payment and marks the registration submitted. */
export async function submitSimulatedEventPayment(
  registrationId: string,
  paymentMethod: PaymentMethod,
  reference: string,
  amount: number
): Promise<ActionResult> {
  try {
    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
    });
    if (!registration) return { success: false, error: "Registration not found." };

    await db
      .update(eventRegistrations)
      .set({
        paymentStatus: "submitted",
        paymentMethod,
        paymentReference: reference,
        updatedAt: new Date(),
      })
      .where(eq(eventRegistrations.id, registrationId));

    await db.insert(eventPayments).values({
      registrationId,
      userId: registration.userId,
      amount,
      paymentMethod,
      paymentReference: reference,
      paymentProofUrl: "whatsapp-simulated",
      status: "submitted",
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Admin-facing
// ---------------------------------------------------------------------------

export interface EventFilters {
  status?: EventStatus | "all";
  type?: EventType | "all";
  search?: string;
}

export interface EventListItem extends Event {
  pendingRegistrations: number;
}

export async function getAllEvents(filters: EventFilters = {}): Promise<EventListItem[]> {
  const conditions = [];
  if (filters.status && filters.status !== "all") {
    conditions.push(eq(events.status, filters.status));
  }
  if (filters.type && filters.type !== "all") {
    conditions.push(eq(events.type, filters.type));
  }
  if (filters.search) {
    conditions.push(or(ilike(events.title, `%${filters.search}%`), ilike(events.venue, `%${filters.search}%`)));
  }

  const rows = await db
    .select()
    .from(events)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(events.date));

  if (rows.length === 0) return [];

  const pendingCounts = await db
    .select({ eventId: eventRegistrations.eventId, count: sql<number>`count(*)::int` })
    .from(eventRegistrations)
    .where(eq(eventRegistrations.status, "pending_review"))
    .groupBy(eventRegistrations.eventId);

  const pendingByEvent = new Map(pendingCounts.map((row) => [row.eventId, row.count]));

  return rows.map((row) => ({
    ...row,
    pendingRegistrations: pendingByEvent.get(row.id) ?? 0,
  })) as EventListItem[];
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  endDate?: string;
  venue: string;
  province: ZimbabweProvince;
  type: EventType;
  fee?: number;
  capacity: number;
  requiresApproval?: boolean;
  status?: EventStatus;
  imageUrl?: string;
}

export async function createEvent(input: CreateEventInput): Promise<ActionResult<{ id: string }>> {
  try {
    const admin = await requireEventsAdmin();
    const requiresApproval = input.requiresApproval ?? (input.type === "paid" || input.type === "member_only");

    const [event] = await db
      .insert(events)
      .values({
        title: input.title,
        description: input.description,
        date: new Date(input.date),
        endDate: input.endDate ? new Date(input.endDate) : null,
        venue: input.venue,
        province: input.province,
        type: input.type,
        fee: input.fee ?? 0,
        capacity: input.capacity,
        requiresApproval,
        status: input.status ?? "draft",
        imageUrl: input.imageUrl,
        createdBy: admin.id,
      })
      .returning({ id: events.id });

    revalidatePath("/admin/events");
    return { success: true, data: { id: event.id } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function updateEvent(
  id: string,
  input: Partial<CreateEventInput>
): Promise<ActionResult> {
  try {
    await requireEventsAdmin();

    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (input.title !== undefined) updates.title = input.title;
    if (input.description !== undefined) updates.description = input.description;
    if (input.date !== undefined) updates.date = new Date(input.date);
    if (input.endDate !== undefined) updates.endDate = input.endDate ? new Date(input.endDate) : null;
    if (input.venue !== undefined) updates.venue = input.venue;
    if (input.province !== undefined) updates.province = input.province;
    if (input.type !== undefined) updates.type = input.type;
    if (input.fee !== undefined) updates.fee = input.fee;
    if (input.capacity !== undefined) updates.capacity = input.capacity;
    if (input.requiresApproval !== undefined) updates.requiresApproval = input.requiresApproval;
    if (input.status !== undefined) updates.status = input.status;
    if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;

    await db.update(events).set(updates).where(eq(events.id, id));

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function publishEvent(id: string): Promise<ActionResult> {
  return updateEvent(id, { status: "published" });
}

export async function cancelEvent(id: string): Promise<ActionResult> {
  return updateEvent(id, { status: "cancelled" });
}

export interface EventRegistrationListItem extends EventRegistration {
  attendeeName: string;
  attendeeEmail: string;
}

export async function getEventRegistrations(eventId: string): Promise<EventRegistrationListItem[]> {
  const rows = await db
    .select({
      id: eventRegistrations.id,
      eventId: eventRegistrations.eventId,
      userId: eventRegistrations.userId,
      ticketNumber: eventRegistrations.ticketNumber,
      registrationReference: eventRegistrations.registrationReference,
      status: eventRegistrations.status,
      adminApproved: eventRegistrations.adminApproved,
      paymentStatus: eventRegistrations.paymentStatus,
      paymentMethod: eventRegistrations.paymentMethod,
      paymentReference: eventRegistrations.paymentReference,
      paymentProofUrl: eventRegistrations.paymentProofUrl,
      rejectionReason: eventRegistrations.rejectionReason,
      source: eventRegistrations.source,
      registeredAt: eventRegistrations.registeredAt,
      createdAt: eventRegistrations.createdAt,
      updatedAt: eventRegistrations.updatedAt,
      attendeeName: users.name,
      attendeeEmail: users.email,
    })
    .from(eventRegistrations)
    .innerJoin(users, eq(eventRegistrations.userId, users.id))
    .where(eq(eventRegistrations.eventId, eventId))
    .orderBy(desc(eventRegistrations.createdAt));

  return rows as EventRegistrationListItem[];
}

export async function approveEventRegistration(registrationId: string): Promise<ActionResult> {
  try {
    await requireEventsAdmin();

    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
      with: { event: true },
    });
    if (!registration) return { success: false, error: "Registration not found." };
    if (registration.status !== "pending_review") {
      return { success: false, error: "This registration is not awaiting review." };
    }
    if (registration.event.registeredCount >= registration.event.capacity) {
      return { success: false, error: "This event is fully booked." };
    }

    // Fee-required registrations don't get confirmed on approval — approval
    // just unlocks the WhatsApp payment-simulation prompt. Only payment
    // verification (verifyEventPayment) actually confirms those.
    if (registration.paymentStatus === "not_required") {
      const ticketNumber = await generateTicketNumber();
      await db
        .update(eventRegistrations)
        .set({ status: "confirmed", adminApproved: true, ticketNumber, updatedAt: new Date() })
        .where(eq(eventRegistrations.id, registrationId));

      await db
        .update(events)
        .set({ registeredCount: registration.event.registeredCount + 1 })
        .where(eq(events.id, registration.eventId));
    } else {
      await db
        .update(eventRegistrations)
        .set({ adminApproved: true, updatedAt: new Date() })
        .where(eq(eventRegistrations.id, registrationId));
    }

    await notifyEventApproved(registrationId);

    revalidatePath(`/admin/events/${registration.eventId}/manage`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function rejectEventRegistration(
  registrationId: string,
  reason?: string
): Promise<ActionResult> {
  try {
    await requireEventsAdmin();
    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
    });
    if (!registration) return { success: false, error: "Registration not found." };

    await db
      .update(eventRegistrations)
      .set({ status: "rejected", rejectionReason: reason ?? null, updatedAt: new Date() })
      .where(eq(eventRegistrations.id, registrationId));

    await notifyEventRegistrationRejected(registrationId);

    revalidatePath(`/admin/events/${registration.eventId}/manage`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function verifyEventPayment(registrationId: string): Promise<ActionResult> {
  try {
    const admin = await requireEventsAdmin();
    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
      with: { event: true },
    });
    if (!registration) return { success: false, error: "Registration not found." };
    if (registration.paymentStatus !== "submitted") {
      return { success: false, error: "This payment is not awaiting verification." };
    }

    const ticketNumber = await generateTicketNumber();

    await db
      .update(eventRegistrations)
      .set({
        status: "confirmed",
        paymentStatus: "verified",
        ticketNumber,
        updatedAt: new Date(),
      })
      .where(eq(eventRegistrations.id, registrationId));

    await db
      .update(events)
      .set({ registeredCount: registration.event.registeredCount + 1 })
      .where(eq(events.id, registration.eventId));

    await db
      .update(eventPayments)
      .set({ status: "verified", verifiedBy: admin.id, verifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(eventPayments.registrationId, registrationId));

    await notifyEventPaymentVerified(registrationId);

    revalidatePath(`/admin/events/${registration.eventId}/manage`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function rejectEventPayment(registrationId: string): Promise<ActionResult> {
  try {
    const admin = await requireEventsAdmin();
    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
    });
    if (!registration) return { success: false, error: "Registration not found." };

    await db
      .update(eventRegistrations)
      .set({ paymentStatus: "pending", updatedAt: new Date() })
      .where(eq(eventRegistrations.id, registrationId));

    await db
      .update(eventPayments)
      .set({ status: "rejected", verifiedBy: admin.id, verifiedAt: new Date(), updatedAt: new Date() })
      .where(eq(eventPayments.registrationId, registrationId));

    await notifyEventPaymentRejected(registrationId);

    revalidatePath(`/admin/events/${registration.eventId}/manage`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function markAttended(registrationId: string): Promise<ActionResult> {
  try {
    await requireEventsAdmin();
    const registration = await db.query.eventRegistrations.findFirst({
      where: eq(eventRegistrations.id, registrationId),
    });
    if (!registration) return { success: false, error: "Registration not found." };

    await db
      .update(eventRegistrations)
      .set({ status: "attended", updatedAt: new Date() })
      .where(eq(eventRegistrations.id, registrationId));

    revalidatePath(`/admin/events/${registration.eventId}/manage`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
