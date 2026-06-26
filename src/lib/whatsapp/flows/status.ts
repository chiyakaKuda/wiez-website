import { eq } from "drizzle-orm";
import { db } from "@/db";
import { memberships } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { setFlowStep, clearFlow } from "@/lib/whatsapp/session";
import { handleUniversalCommands, requireText } from "@/lib/whatsapp/common";
import { formatDate } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { getMembershipByUserId } from "@/actions/memberships";
import { getUserEventRegistrations } from "@/actions/events";
import type { Membership, MembershipStatus } from "@/types/memberships";
import type { WhatsAppSession } from "@/types/whatsapp";

const STATUS_MESSAGES: Record<MembershipStatus, (m: Membership) => string> = {
  draft: () =>
    `📝 *INCOMPLETE*\nYour application is not yet submitted.\nVisit ${appUrl()}/membership/apply to complete it.`,
  submitted: () => "📬 *SUBMITTED*\nReceived ✅ — awaiting review by our team.",
  under_review: () =>
    "🔄 *UNDER REVIEW*\nOur team is currently reviewing your application.\nExpected response: within 5–7 business days.",
  info_requested: () =>
    "⚠️ *INFORMATION REQUESTED*\nOur team needs additional information.\nPlease check your email or contact membership@wiez.co.zw",
  pending_payment: (m) =>
    `✅ *APPROVED — PAYMENT REQUIRED*\nCongratulations! Your application was approved.\nVisit ${appUrl()}/membership/payment/${m.id} to make payment.`,
  payment_submitted: () =>
    "💰 *PAYMENT UNDER VERIFICATION*\nPayment proof received.\nVerification takes 1–2 business days.",
  payment_verified: () =>
    "💰 *PAYMENT UNDER VERIFICATION*\nPayment proof received.\nVerification takes 1–2 business days.",
  approved: (m) =>
    `🏅 *ACTIVE MEMBER*\nMembership Number: *${m.membershipNumber}*\nValid until: ${m.expiryDate}`,
  rejected: (m) =>
    `❌ *APPLICATION NOT APPROVED*\nReason: ${m.rejectionReason ?? "Not specified"}\n\nYou may re-apply after addressing the issues noted.\nContact membership@wiez.co.zw for guidance.`,
  suspended: (m) =>
    `⚠️ *MEMBERSHIP SUSPENDED*\nReason: ${m.rejectionReason ?? "Not specified"}\nContact membership@wiez.co.zw for assistance.`,
  revoked: (m) =>
    `⚠️ *MEMBERSHIP REVOKED*\nReason: ${m.rejectionReason ?? "Not specified"}\nContact membership@wiez.co.zw for assistance.`,
  expired: (m) =>
    `⏰ *MEMBERSHIP EXPIRED*\nYour membership expired on ${m.expiryDate}.\nVisit ${appUrl()}/membership/apply to renew.`,
};

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}

export async function startStatusFlow(to: string, session: WhatsAppSession): Promise<void> {
  if (session.isAuthenticated && session.userId) {
    await sendMembershipStatusForUser(to, session.userId);
    return;
  }

  await setFlowStep(to, "status_check", "status_menu");
  await WhatsAppAPI.sendButtons(to, "🔍 *Track Your Status*\n\nWhat would you like to check?", [
    { id: "MEMBERSHIP_STATUS", title: "Membership Status" },
    { id: "EVENT_STATUS", title: "Event Registrations" },
  ]);
}

export async function handleStatusFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (await handleUniversalCommands(to, parsed)) return;

  switch (session.currentStep) {
    case "status_menu":
      await handleStatusMenu(to, session, parsed);
      return;
    case "status_membership_ref":
      await handleMembershipRef(to, parsed);
      return;
  }
}

async function handleStatusMenu(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const choice = parsed.replyId ?? parsed.text ?? "";

  if (choice === "EVENT_STATUS" || /event/i.test(choice)) {
    if (!session.isAuthenticated || !session.userId) {
      await clearFlow(to);
      await WhatsAppAPI.sendText(
        to,
        "🔒 Please log in first to view your event registrations.\n\nReply *LOGIN* to sign in."
      );
      return;
    }
    await sendEventRegistrationsForUser(to, session.userId);
    return;
  }

  if (choice === "MEMBERSHIP_STATUS" || /membership/i.test(choice)) {
    if (session.isAuthenticated && session.userId) {
      await sendMembershipStatusForUser(to, session.userId);
      return;
    }
    await setFlowStep(to, "status_check", "status_membership_ref");
    await WhatsAppAPI.sendText(
      to,
      "Please enter your application reference number:\n\n(Format: WIEZ-APP-2026-XXXX)"
    );
    return;
  }

  await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
}

async function handleMembershipRef(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please enter your application reference number:");
  if (!text) return;

  const membership = await db.query.memberships.findFirst({
    where: eq(memberships.applicationReference, text.toUpperCase()),
  });

  if (!membership) {
    await WhatsAppAPI.sendText(
      to,
      "❌ No application found with that reference number.\n\nPlease check and try again, or reply *MENU* for options."
    );
    return;
  }

  await clearFlow(to);
  await WhatsAppAPI.sendText(to, STATUS_MESSAGES[membership.status](membership as Membership));
}

async function sendMembershipStatusForUser(to: string, userId: string): Promise<void> {
  await clearFlow(to);
  const membership = await getMembershipByUserId(userId);
  if (!membership) {
    await WhatsAppAPI.sendText(
      to,
      `📝 You haven't applied for WiEZ membership yet.\n\nVisit ${appUrl()}/membership/apply or reply *REGISTER* to get started.`
    );
    return;
  }
  await WhatsAppAPI.sendText(to, STATUS_MESSAGES[membership.status](membership));
}

async function sendEventRegistrationsForUser(to: string, userId: string): Promise<void> {
  await clearFlow(to);
  const registrations = await getUserEventRegistrations(userId);

  if (registrations.length === 0) {
    await WhatsAppAPI.sendText(
      to,
      "🎟️ You haven't registered for any events yet.\n\nReply *EVENTS* to browse upcoming events."
    );
    return;
  }

  const lines = registrations.map((registration) => {
    const statusLine =
      registration.status === "confirmed"
        ? `Status: ✅ Confirmed\nTicket: ${registration.ticketNumber}`
        : registration.status === "pending_review"
          ? `Status: ⏳ Pending Review\nRef: ${registration.registrationReference}`
          : `Status: ${registration.status}`;
    return `*${registration.eventTitle}*\n📅 ${formatDate(registration.eventDate)}\n${statusLine}`;
  });

  await WhatsAppAPI.sendText(to, `🎟️ *Your Event Registrations*\n\n${lines.join("\n\n")}`);
}
