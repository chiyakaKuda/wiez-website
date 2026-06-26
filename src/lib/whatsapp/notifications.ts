import { eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships, users, eventRegistrations } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { formatAmount, formatDate } from "@/lib/whatsapp/utils";
import { promptEventPaymentMethod } from "@/lib/whatsapp/flows/events";

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

async function getWhatsappNumberForUser(userId: string): Promise<string | null> {
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return user?.whatsappNumber ?? null;
}

// ---------------------------------------------------------------------------
// Membership
// ---------------------------------------------------------------------------

export async function notifyMembershipApproved(membershipId: string): Promise<void> {
  const membership = await db.query.memberships.findFirst({ where: eq(memberships.id, membershipId) });
  if (!membership) return;

  const to = await getWhatsappNumberForUser(membership.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `🎉 *Great news!*\n\nYour WiEZ membership application has been approved!\n\nTo activate your membership, please make payment:\n🌐 ${appUrl()}/membership/payment/${membership.id}\n\nYou have 14 days to complete payment.`
  );
}

export async function notifyMembershipRejected(membershipId: string): Promise<void> {
  const membership = await db.query.memberships.findFirst({ where: eq(memberships.id, membershipId) });
  if (!membership) return;

  const to = await getWhatsappNumberForUser(membership.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `❌ *Application Update*\n\nUnfortunately your WiEZ membership application was not approved.\n\nReason: ${membership.rejectionReason ?? "Not specified"}\n\nYou may re-apply after addressing the issues noted. Contact membership@wiez.co.zw for guidance.`
  );
}

export async function notifyInfoRequested(membershipId: string): Promise<void> {
  const membership = await db.query.memberships.findFirst({ where: eq(memberships.id, membershipId) });
  if (!membership) return;

  const to = await getWhatsappNumberForUser(membership.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `⚠️ *Additional Information Needed*\n\nOur team needs more information to process your WiEZ membership application.\n\nPlease check your email or contact membership@wiez.co.zw for details.`
  );
}

export async function notifyMembershipPaymentVerified(membershipId: string): Promise<void> {
  const membership = await db.query.memberships.findFirst({ where: eq(memberships.id, membershipId) });
  if (!membership) return;

  const to = await getWhatsappNumberForUser(membership.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `🏅 *Welcome to WiEZ!*\n\nYour payment has been verified and your membership is now active!\n\nMembership Number: *${membership.membershipNumber}*\nValid until: ${membership.expiryDate ?? "N/A"}\n\nWelcome to the community! 💚`
  );
}

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export async function notifyEventApproved(registrationId: string): Promise<void> {
  const registration = await db.query.eventRegistrations.findFirst({
    where: eq(eventRegistrations.id, registrationId),
    with: { event: true },
  });
  if (!registration) return;

  const to = await getWhatsappNumberForUser(registration.userId);
  if (!to) return;

  if (registration.paymentStatus === "not_required") {
    await WhatsAppAPI.sendText(
      to,
      `🎟️ *Registration Confirmed!*\n\nEvent: ${registration.event.title}\nDate: ${formatDate(registration.event.date)}\nTicket: ${registration.ticketNumber}\n\n✅ Your spot is secured! See you there! 🎉`
    );
    return;
  }

  await promptEventPaymentMethod(to, registration.id, registration.event.title, registration.event.fee);
}

export async function notifyEventRegistrationRejected(registrationId: string): Promise<void> {
  const registration = await db.query.eventRegistrations.findFirst({
    where: eq(eventRegistrations.id, registrationId),
    with: { event: true },
  });
  if (!registration) return;

  const to = await getWhatsappNumberForUser(registration.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `❌ *Registration Update*\n\nYour registration for ${registration.event.title} was not approved.${registration.rejectionReason ? `\n\nReason: ${registration.rejectionReason}` : ""}\n\nContact membership@wiez.co.zw with any questions.`
  );
}

export async function notifyEventPaymentVerified(registrationId: string): Promise<void> {
  const registration = await db.query.eventRegistrations.findFirst({
    where: eq(eventRegistrations.id, registrationId),
    with: { event: true },
  });
  if (!registration) return;

  const to = await getWhatsappNumberForUser(registration.userId);
  if (!to) return;

  await WhatsAppAPI.sendText(
    to,
    `✅ *Payment Verified!*\n\nEvent: ${registration.event.title}\nDate: ${formatDate(registration.event.date)}\nAmount: ${formatAmount(registration.event.fee)}\nTicket: *${registration.ticketNumber}*\n\nShow this ticket number at the venue for check-in. See you there! 🎉`
  );
}

export async function notifyEventPaymentRejected(registrationId: string): Promise<void> {
  const registration = await db.query.eventRegistrations.findFirst({
    where: eq(eventRegistrations.id, registrationId),
    with: { event: true },
  });
  if (!registration) return;

  const to = await getWhatsappNumberForUser(registration.userId);
  if (!to) return;

  await promptEventPaymentMethod(to, registration.id, registration.event.title, registration.event.fee);
}
