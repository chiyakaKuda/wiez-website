import { eq, and } from "drizzle-orm";
import { verifyPassword } from "better-auth/crypto";
import { db } from "@/db";
import { users, accounts } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { updateSession, saveFlowData, setFlowStep, clearFlow } from "@/lib/whatsapp/session";
import { handleUniversalCommands, requireText } from "@/lib/whatsapp/common";
import { isValidEmail } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { getMembershipByUserId } from "@/actions/memberships";
import { membershipStatusLabel } from "@/components/membership/status-badge";
import type { WhatsAppSession } from "@/types/whatsapp";

const MAX_ATTEMPTS = 3;
const BLOCK_DURATION_MS = 60 * 60 * 1000;

export async function startLoginFlow(to: string): Promise<void> {
  await setFlowStep(to, "login", "login_email");
  await WhatsAppAPI.sendText(
    to,
    "🔐 *Login to Your Account*\n\nPlease enter your registered email address:"
  );
}

export async function handleLoginFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (await handleUniversalCommands(to, parsed)) return;

  switch (session.currentStep) {
    case "login_email":
      await handleLoginEmail(to, parsed);
      return;
    case "login_password":
      await handleLoginPassword(to, session, parsed);
      return;
  }
}

async function handleLoginEmail(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please enter your registered email address:");
  if (!text) return;

  if (!isValidEmail(text)) {
    await WhatsAppAPI.sendText(
      to,
      "⚠️ That doesn't look like a valid email.\n\nPlease enter your registered email address:"
    );
    return;
  }

  const email = text.toLowerCase();
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(
      to,
      "❌ No account found with that email.\n\nReply *REGISTER* to create an account or *MENU* for options."
    );
    return;
  }

  await saveFlowData(to, "loginEmail", email);
  await saveFlowData(to, "loginAttempts", 0);
  await setFlowStep(to, "login", "login_password");
  await WhatsAppAPI.sendText(to, "🔑 Please enter your password:");
}

async function handleLoginPassword(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const text = await requireText(to, parsed, "Please enter your password:");
  if (!text) return;

  const email = session.flowData.loginEmail as string | undefined;
  if (!email) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please start again. Reply *MENU* for options.");
    return;
  }

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  const account = user
    ? await db.query.accounts.findFirst({
        where: and(eq(accounts.userId, user.id), eq(accounts.providerId, "credential")),
      })
    : null;

  const isValid = account?.password
    ? await verifyPassword({ hash: account.password, password: text })
    : false;

  if (!isValid || !user) {
    const attempts = ((session.flowData.loginAttempts as number) ?? 0) + 1;

    if (attempts >= MAX_ATTEMPTS) {
      await updateSession(to, {
        isBlocked: true,
        currentFlow: null,
        currentStep: null,
        flowData: { blockedUntil: new Date(Date.now() + BLOCK_DURATION_MS).toISOString() },
      });
      await WhatsAppAPI.sendText(
        to,
        "🔒 Too many failed attempts. Your account has been temporarily blocked for 1 hour."
      );
      return;
    }

    await saveFlowData(to, "loginAttempts", attempts);
    await WhatsAppAPI.sendText(
      to,
      `❌ Incorrect password. Please try again. (${attempts}/${MAX_ATTEMPTS} attempts)\n\n🔑 Please enter your password:`
    );
    return;
  }

  await updateSession(to, {
    userId: user.id,
    isAuthenticated: true,
    currentFlow: null,
    currentStep: null,
    flowData: {},
  });

  const membership = await getMembershipByUserId(user.id);
  let statusBlock = "";
  if (membership?.status === "approved") {
    statusBlock = `\n\n🏅 Membership: ACTIVE\n📋 Number: ${membership.membershipNumber}\n📅 Valid until: ${membership.expiryDate}`;
  } else if (membership) {
    statusBlock = `\n\n⏳ Membership: ${membershipStatusLabel(membership.status).toUpperCase()}\n📋 Reference: ${membership.applicationReference}`;
  }

  await WhatsAppAPI.sendButtons(
    to,
    `✅ *Logged in successfully!*\n\nWelcome back, ${user.name}! 👋${statusBlock}\n\nWhat would you like to do?`,
    [
      { id: "STATUS", title: "View Status" },
      { id: "EVENTS", title: "View Events" },
      { id: "MAIN_MENU", title: "Main Menu" },
    ]
  );
}
