import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep, clearFlow, updateSession } from "@/lib/whatsapp/session";
import { handleUniversalCommands, requireText } from "@/lib/whatsapp/common";
import { formatAmount, formatDate, isValidEmail } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import {
  getPublishedUpcomingEvents,
  getEventById,
  createEventRegistration,
  submitSimulatedEventPayment,
} from "@/actions/events";
import { getMembershipByUserId } from "@/actions/memberships";
import type { Event } from "@/types/events";
import type { PaymentMethod } from "@/types/memberships";
import type { WhatsAppSession } from "@/types/whatsapp";

function randomSimReference(): string {
  return `SIM-${Math.floor(10000000 + Math.random() * 90000000)}`;
}

export async function startEventsFlow(to: string): Promise<void> {
  // Browsing and registering for events doesn't require an account — only
  // member-only events gate on membership status, checked at detail/confirm time.
  await sendEventsList(to);
}

async function sendEventsList(to: string): Promise<void> {
  const events = await getPublishedUpcomingEvents(5);

  if (events.length === 0) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(
      to,
      `📅 No upcoming events at the moment.\n\nCheck back soon or visit ${process.env.NEXT_PUBLIC_APP_URL ?? ""}/events\n\nReply *MENU* for main menu.`
    );
    return;
  }

  await setFlowStep(to, "event_registration", "events_list");
  await WhatsAppAPI.sendList(to, "📅 *Upcoming WiEZ Events*\n\nHere are our upcoming events:", "View Events", [
    {
      title: "Events",
      rows: events.map((event) => ({
        id: `EVENT_${event.id}`,
        title: event.title,
        description: `${formatDate(event.date)} · ${event.venue} · ${event.fee > 0 ? formatAmount(event.fee) : "Free"}`,
      })),
    },
  ]);
}

export async function handleEventsFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  // The payment-method step is reachable even when the user didn't initiate
  // this turn of the flow themselves (it's triggered proactively by an
  // admin approval), but universal commands should still work normally.
  if (await handleUniversalCommands(to, parsed)) return;

  switch (session.currentStep) {
    case "events_list":
      await handleEventsList(to, parsed);
      return;
    case "event_detail":
      await handleEventDetail(to, session, parsed);
      return;
    case "event_confirm":
      await handleEventConfirm(to, session, parsed);
      return;
    case "guest_name":
      await handleGuestName(to, parsed);
      return;
    case "guest_email":
      await handleGuestEmail(to, parsed);
      return;
    case "guest_password":
      await handleGuestPassword(to, parsed);
      return;
    case "guest_confirm_password":
      await handleGuestConfirmPassword(to, session, parsed);
      return;
    case "event_payment_method":
      await handlePaymentMethod(to, session, parsed);
      return;
  }
}

async function handleEventsList(to: string, parsed: ParsedMessage): Promise<void> {
  const eventId = (parsed.replyId ?? "").replace("EVENT_", "");
  if (!eventId) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select an event from the list above.");
    return;
  }
  await sendEventDetail(to, eventId);
}

async function sendEventDetail(to: string, eventId: string): Promise<void> {
  const event = await getEventById(eventId);
  if (!event) {
    await WhatsAppAPI.sendText(to, "That event couldn't be found. Please choose another.");
    await sendEventsList(to);
    return;
  }

  await saveFlowData(to, "eventId", event.id);
  await setFlowStep(to, "event_registration", "event_detail");

  const isFull = event.registeredCount >= event.capacity;
  const description = event.description.slice(0, 200);

  let restriction = "";
  if (event.type === "member_only") {
    restriction =
      "\n\n⚠️ This event is for WiEZ members only. We'll check your membership status when you register.";
  }

  const body =
    `🎯 *${event.title}*\n` +
    `📅 Date: ${formatDate(event.date)}\n` +
    `📍 Venue: ${event.venue}, ${event.province}\n` +
    `💰 Fee: ${event.fee > 0 ? formatAmount(event.fee) : "Free"}\n` +
    `👥 ${event.registeredCount} / ${event.capacity} spots taken\n\n` +
    `${description}${restriction}` +
    (isFull ? "\n\n❌ This event is fully booked." : "");

  if (isFull) {
    await WhatsAppAPI.sendButtons(to, body, [{ id: "EVENTS_BACK", title: "Back to Events ↩️" }]);
    return;
  }

  await WhatsAppAPI.sendButtons(to, body, [
    { id: "EVENT_REGISTER", title: "Register Now ✅" },
    { id: "EVENTS_BACK", title: "Back to Events ↩️" },
  ]);
}

async function handleEventDetail(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (parsed.replyId === "EVENTS_BACK") {
    await sendEventsList(to);
    return;
  }

  if (parsed.replyId !== "EVENT_REGISTER") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
    return;
  }

  const eventId = session.flowData.eventId as string | undefined;
  if (!eventId) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please start again. Reply *EVENTS* to try again.");
    return;
  }

  const event = await getEventById(eventId);
  if (!event) {
    await sendEventsList(to);
    return;
  }

  if (event.type === "member_only") {
    const membership = session.userId ? await getMembershipByUserId(session.userId) : null;
    if (!membership || membership.status !== "approved") {
      await clearFlow(to);
      await WhatsAppAPI.sendText(
        to,
        "⚠️ This event is for active WiEZ members only.\n\nReply *REGISTER* to apply for membership, or *EVENTS* to see other events."
      );
      return;
    }
  }

  await setFlowStep(to, "event_registration", "event_confirm");
  await sendConfirmStep(to, event);
}

async function sendConfirmStep(to: string, event: Event): Promise<void> {
  const isFree = event.fee <= 0 && event.type === "free";

  if (isFree) {
    await WhatsAppAPI.sendButtons(
      to,
      `✅ *Confirm Registration*\n\n📅 *${event.title}*\n🗓️ ${formatDate(event.date)}\n📍 ${event.venue}\n💰 Free\n\nYour spot will be confirmed immediately.`,
      [
        { id: "CONFIRM_REGISTRATION", title: "Confirm Registration ✅" },
        { id: "CANCEL_REGISTRATION", title: "Cancel ❌" },
      ]
    );
    return;
  }

  await WhatsAppAPI.sendButtons(
    to,
    `✅ *Confirm Registration*\n\n📅 *${event.title}*\n🗓️ ${formatDate(event.date)}\n💰 ${formatAmount(event.fee)}\n\nYour registration will be reviewed before confirmation.`,
    [
      { id: "CONFIRM_REGISTRATION", title: "Submit Registration ✅" },
      { id: "CANCEL_REGISTRATION", title: "Cancel ❌" },
    ]
  );
}

async function handleEventConfirm(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (parsed.replyId === "CANCEL_REGISTRATION") {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Registration cancelled. Reply *MENU* for options.");
    return;
  }

  if (parsed.replyId !== "CONFIRM_REGISTRATION") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
    return;
  }

  const eventId = session.flowData.eventId as string | undefined;
  if (!eventId) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please start again. Reply *EVENTS* to try again.");
    return;
  }

  if (session.userId) {
    await finalizeEventRegistration(to, eventId, session.userId);
    return;
  }

  // No account yet — collect just enough to create one, skipping membership entirely.
  await setFlowStep(to, "event_registration", "guest_name");
  await WhatsAppAPI.sendText(
    to,
    "You don't need to be a WiEZ member to attend — just need a few quick details.\n\n👤 Full name?"
  );
}

async function finalizeEventRegistration(to: string, eventId: string, userId: string): Promise<void> {
  const result = await createEventRegistration({ eventId, userId, source: "whatsapp" });
  await clearFlow(to);

  if (!result.success || !result.data) {
    await WhatsAppAPI.sendText(to, `❌ ${result.error ?? "Failed to register for this event."}`);
    return;
  }

  const event = await getEventById(eventId);

  if (result.data.status === "confirmed") {
    await WhatsAppAPI.sendText(
      to,
      `🎟️ *Registration Confirmed!*\n\nEvent: ${event?.title}\nDate: ${event ? formatDate(event.date) : ""}\nTicket: ${result.data.ticketNumber}\n\n✅ Your spot is secured!\n\nShow this ticket number at the venue for check-in.\nSee you there! 🎉`
    );
    return;
  }

  await WhatsAppAPI.sendText(
    to,
    `📋 *Registration Submitted*\n\nEvent: ${event?.title}\nReference: ${result.data.registrationReference}\n\nYour registration is under review.\nYou'll be notified here once confirmed.\n\nTo track status, send *STATUS*`
  );
}

// ---------------------------------------------------------------------------
// Guest signup — a lightweight account (name, email, password) for people
// registering for an event who aren't WiEZ members and don't want to apply.
// No membership row, no role assigned.
// ---------------------------------------------------------------------------

async function handleGuestName(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "👤 Full name?");
  if (!text) return;
  await saveFlowData(to, "guestName", text);
  await setFlowStep(to, "event_registration", "guest_email");
  await WhatsAppAPI.sendText(to, "📧 Email address?");
}

async function handleGuestEmail(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "📧 Email address?");
  if (!text) return;

  if (!isValidEmail(text)) {
    await WhatsAppAPI.sendText(to, "⚠️ That doesn't look like a valid email.\n\nEmail address?");
    return;
  }

  const email = text.toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(
      to,
      "This email is already registered. Reply *LOGIN* to sign in, then try registering for the event again."
    );
    return;
  }

  await saveFlowData(to, "guestEmail", email);
  await setFlowStep(to, "event_registration", "guest_password");
  await WhatsAppAPI.sendText(
    to,
    "🔐 Create a password (so you can check your ticket later):\n\nRequirements:\n• Minimum 8 characters\n• At least one uppercase letter\n• At least one number"
  );
}

async function handleGuestPassword(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please create a password:");
  if (!text) return;

  const isValid = text.length >= 8 && /[A-Z]/.test(text) && /[0-9]/.test(text);
  if (!isValid) {
    await WhatsAppAPI.sendText(
      to,
      "⚠️ Your password must be at least 8 characters, with at least one uppercase letter and one number.\n\nPlease try again:"
    );
    return;
  }

  await saveFlowData(to, "guestPassword", text);
  await setFlowStep(to, "event_registration", "guest_confirm_password");
  await WhatsAppAPI.sendText(to, "🔐 Please confirm your password:");
}

async function handleGuestConfirmPassword(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const text = await requireText(to, parsed, "Please confirm your password:");
  if (!text) return;

  if (text !== session.flowData.guestPassword) {
    await WhatsAppAPI.sendText(to, "❌ Passwords do not match. Please enter your password again:");
    return;
  }

  const eventId = session.flowData.eventId as string | undefined;
  const name = session.flowData.guestName as string | undefined;
  const email = session.flowData.guestEmail as string | undefined;
  const password = session.flowData.guestPassword as string | undefined;

  if (!eventId || !name || !email || !password) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please start again. Reply *EVENTS* to try again.");
    return;
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await db
    .insert(users)
    .values({ name, email, emailVerified: false, whatsappNumber: to, mustChangePassword: true })
    .returning();

  await db.insert(accounts).values({
    userId: user.id,
    accountId: user.id,
    providerId: "credential",
    password: hashedPassword,
  });

  await updateSession(to, { userId: user.id, isAuthenticated: true });
  await finalizeEventRegistration(to, eventId, user.id);
}

/**
 * Proactively triggered by the admin's approveEventRegistration() action
 * (via the notifications module), not by anything the user just sent.
 */
export async function promptEventPaymentMethod(
  whatsappNumber: string,
  registrationId: string,
  eventTitle: string,
  fee: number
): Promise<void> {
  await updateSession(whatsappNumber, {
    currentFlow: "event_registration",
    currentStep: "event_payment_method",
    flowData: { paymentRegistrationId: registrationId, paymentFee: fee, paymentEventTitle: eventTitle },
  });

  await WhatsAppAPI.sendText(
    whatsappNumber,
    `✅ *Event Registration Approved!*\n\nYour registration for ${eventTitle} has been approved.\nAmount due: ${formatAmount(fee)}\n\nPay within 48 hours to secure your spot.`
  );
  await WhatsAppAPI.sendButtons(whatsappNumber, "💳 *Select Payment Method*\n\nHow would you like to pay the " + formatAmount(fee) + " fee?", [
    { id: "PAY_ECOCASH", title: "EcoCash" },
    { id: "PAY_INNBUCKS", title: "InnBucks" },
    { id: "PAY_BANK", title: "Bank Transfer" },
  ]);
}

const PAYMENT_METHOD_BY_REPLY: Record<string, { method: PaymentMethod; label: string }> = {
  PAY_ECOCASH: { method: "ecocash", label: "EcoCash" },
  PAY_INNBUCKS: { method: "innbucks", label: "InnBucks" },
  PAY_BANK: { method: "bank_transfer", label: "Bank Transfer" },
};

async function handlePaymentMethod(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const selected = PAYMENT_METHOD_BY_REPLY[parsed.replyId ?? ""];
  if (!selected) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a payment method from the options above.");
    return;
  }

  const registrationId = session.flowData.paymentRegistrationId as string | undefined;
  const fee = (session.flowData.paymentFee as number | undefined) ?? 0;
  if (!registrationId) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please contact membership@wiez.co.zw.");
    return;
  }

  const reference = randomSimReference();
  const result = await submitSimulatedEventPayment(registrationId, selected.method, reference, fee);
  await clearFlow(to);

  if (!result.success) {
    await WhatsAppAPI.sendText(to, "❌ Something went wrong recording your payment. Please contact membership@wiez.co.zw.");
    return;
  }

  await WhatsAppAPI.sendText(
    to,
    `✅ *Payment Confirmed!*\n\nMethod: ${selected.label}\nAmount: ${formatAmount(fee)}\nReference: ${reference}\nStatus: *PAID*\n\nYour payment has been recorded.\nOur team will issue your ticket shortly.`
  );
}
