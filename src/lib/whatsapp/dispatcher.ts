import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { getOrCreateSession, updateSession } from "@/lib/whatsapp/session";
import { parseMessage, normalizeText } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { routeIntent } from "@/lib/whatsapp/router";
import { sendMainMenu } from "@/lib/whatsapp/menus";
import { startRegistrationFlow, handleRegistrationFlow } from "@/lib/whatsapp/flows/registration";
import { startLoginFlow, handleLoginFlow } from "@/lib/whatsapp/flows/login";
import { startEventsFlow, handleEventsFlow } from "@/lib/whatsapp/flows/events";
import { startStatusFlow, handleStatusFlow } from "@/lib/whatsapp/flows/status";
import { startEnquiryFlow, handleEnquiryFlow } from "@/lib/whatsapp/flows/enquiry";
import { logMessage } from "@/lib/whatsapp/message-log";
import type { WhatsAppSession } from "@/types/whatsapp";

const THIRTY_MINUTES_MS = 30 * 60 * 1000;

const FLOW_LABELS: Record<string, string> = {
  registration: "registering for membership",
  event_registration: "registering for an event",
  status_check: "checking your status",
  enquiry: "submitting an enquiry",
  login: "logging in",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Meta's webhook payload shape, validated structurally below
export async function processIncomingMessage(payload: any): Promise<void> {
  const entry = payload?.entry?.[0];
  const change = entry?.changes?.[0];
  const value = change?.value;
  const messages = value?.messages;

  // No `messages` array means this is a status/delivery-receipt update, not
  // an inbound message — Meta sends both through the same webhook.
  if (!messages || messages.length === 0) return;

  const message = messages[0];
  const from: string = message.from;
  const messageId: string = message.id;

  await WhatsAppAPI.markAsRead(messageId);

  const session = await getOrCreateSession(from);

  if (session.isBlocked) {
    // Login-attempt blocks self-expire via a stored timestamp rather than an
    // in-memory timer, which wouldn't survive a serverless cold start.
    const blockedUntil = session.flowData.blockedUntil as string | undefined;
    if (blockedUntil && new Date(blockedUntil) <= new Date()) {
      await updateSession(from, { isBlocked: false, flowData: {} });
    } else {
      await WhatsAppAPI.sendText(
        from,
        "⚠️ Your account has been temporarily blocked. Please contact support."
      );
      return;
    }
  }

  const parsed = parseMessage(message);
  const text = normalizeText(parsed.text ?? "");

  await logMessage({
    whatsappNumber: from,
    direction: "inbound",
    messageType: parsed.type,
    content: parsed.text ?? parsed.filename ?? parsed.mediaId ?? "(no content)",
    flow: session.currentFlow,
    step: session.currentStep,
  });

  const idleMs = Date.now() - session.lastMessageAt.getTime();
  if (session.currentFlow && idleMs > THIRTY_MINUTES_MS && text !== "continue" && text !== "menu") {
    const label = FLOW_LABELS[session.currentFlow] ?? "in a previous step";
    await WhatsAppAPI.sendText(
      from,
      `Welcome back! You were ${label}.\n\nReply *CONTINUE* to resume or *MENU* to start over.`
    );
    return;
  }

  if (session.currentFlow) {
    await handleActiveFlow(from, session, parsed);
  } else {
    await handleIntent(from, session, parsed);
  }
}

async function handleIntent(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const intent = routeIntent(parsed);
  switch (intent) {
    case "MAIN_MENU":
      await sendMainMenu(to, true);
      return;
    case "REGISTER":
      await startRegistrationFlow(to, session);
      return;
    case "LOGIN":
      await startLoginFlow(to);
      return;
    case "EVENTS":
      await startEventsFlow(to);
      return;
    case "STATUS":
      await startStatusFlow(to, session);
      return;
    case "ENQUIRY":
      await startEnquiryFlow(to);
      return;
    default:
      await WhatsAppAPI.sendText(to, "Sorry, I didn't quite understand that.");
      await sendMainMenu(to, false);
  }
}

async function handleActiveFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  switch (session.currentFlow) {
    case "registration":
      await handleRegistrationFlow(to, session, parsed);
      return;
    case "login":
      await handleLoginFlow(to, session, parsed);
      return;
    case "event_registration":
      await handleEventsFlow(to, session, parsed);
      return;
    case "status_check":
      await handleStatusFlow(to, session, parsed);
      return;
    case "enquiry":
      await handleEnquiryFlow(to, session, parsed);
      return;
  }
}
