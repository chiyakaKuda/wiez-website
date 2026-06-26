import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep, clearFlow } from "@/lib/whatsapp/session";
import { requireText } from "@/lib/whatsapp/common";
import { isValidEmail } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { MEMBERSHIP_TYPE_NAMES } from "@/lib/constants";
import { MEMBERSHIP_FEES, REQUIRED_DOCS } from "@/lib/whatsapp/flows/registration/shared";
import type { MembershipTypeName } from "@/types/memberships";
import type { WhatsAppSession } from "@/types/whatsapp";

const TYPE_BY_REPLY: Record<string, MembershipTypeName> = {
  TYPE_STUDENT: "Student",
  TYPE_GRADUATE: "Graduate",
  TYPE_PROFESSIONAL: "Professional",
  TYPE_CORPORATE: "Corporate",
};

export async function sendMembershipTypeSelect(to: string): Promise<void> {
  await setFlowStep(to, "registration", "membership_type_select");
  await WhatsAppAPI.sendList(
    to,
    "🎉 *Apply for WiEZ Membership*\n\nPlease select your membership type:",
    "Select Type",
    [
      {
        title: "Membership Types",
        rows: MEMBERSHIP_TYPE_NAMES.map((name) => ({
          id: `TYPE_${name.toUpperCase()}`,
          title: `${name} Member — $${MEMBERSHIP_FEES[name]}/year`,
          description:
            name === "Student"
              ? "For enrolled engineering students"
              : name === "Graduate"
                ? "For graduates within 5 years"
                : name === "Professional"
                  ? "For engineers with 5+ years"
                  : "For supporting organizations",
        })),
      },
    ]
  );
}

export async function handleMembershipTypeSelect(to: string, parsed: ParsedMessage): Promise<void> {
  const type = TYPE_BY_REPLY[parsed.replyId ?? ""];
  if (!type) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a membership type from the list above.");
    return;
  }

  await saveFlowData(to, "membershipType", type);
  await saveFlowData(to, "membershipFee", MEMBERSHIP_FEES[type]);
  await setFlowStep(to, "registration", "terms_agreement");

  const requiredDocsList = REQUIRED_DOCS[type].map((doc) => `• ${doc.label}`).join("\n");

  await WhatsAppAPI.sendButtons(
    to,
    `You selected: *${type} Member* ($${MEMBERSHIP_FEES[type]}/year)\n\nBefore continuing, please read our full membership terms and conditions:\n\n🔗 ${appUrl()}/membership#terms\n\nBy continuing you confirm you have read and agree to:\n✅ WiEZ Membership Terms & Conditions\n✅ WiEZ Code of Conduct\n✅ Privacy Policy\n\nRequired documents for ${type} membership:\n${requiredDocsList}`,
    [
      { id: "TERMS_AGREE", title: "I Agree, Continue ✅" },
      { id: "TERMS_BACK", title: "Go Back ↩️" },
    ]
  );
}

export async function handleTermsAgreement(to: string, parsed: ParsedMessage): Promise<void> {
  if (parsed.replyId === "TERMS_BACK") {
    await sendMembershipTypeSelect(to);
    return;
  }

  if (parsed.replyId !== "TERMS_AGREE") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
    return;
  }

  await setFlowStep(to, "registration", "account_email");
  await WhatsAppAPI.sendText(
    to,
    "📧 Please enter your email address:\n\nThis will be used to log in to the WiEZ web dashboard."
  );
}

export async function handleAccountEmail(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please enter your email address:");
  if (!text) return;

  if (!isValidEmail(text)) {
    await WhatsAppAPI.sendText(to, "⚠️ That doesn't look like a valid email.\n\nPlease enter your email address:");
    return;
  }

  const email = text.toLowerCase();
  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (existing) {
    if (existing.whatsappNumber) {
      await clearFlow(to);
      await WhatsAppAPI.sendText(
        to,
        "This email is already registered. Reply *LOGIN* to sign in."
      );
      return;
    }
    await clearFlow(to);
    await WhatsAppAPI.sendText(
      to,
      "This email is already registered on our web platform. Reply *LOGIN* to link your WhatsApp."
    );
    return;
  }

  await saveFlowData(to, "accountEmail", email);
  await setFlowStep(to, "registration", "account_password");
  await WhatsAppAPI.sendText(
    to,
    "🔐 Create a password for your account:\n\nRequirements:\n• Minimum 8 characters\n• At least one uppercase letter\n• At least one number\n\n(Your password is private and will not be shared)"
  );
}

export async function handleAccountPassword(to: string, parsed: ParsedMessage): Promise<void> {
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

  await saveFlowData(to, "accountPassword", text);
  await setFlowStep(to, "registration", "account_confirm_password");
  await WhatsAppAPI.sendText(to, "🔐 Please confirm your password:");
}

export async function handleAccountConfirmPassword(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage,
  onConfirmed: () => Promise<void>
): Promise<void> {
  const text = await requireText(to, parsed, "Please confirm your password:");
  if (!text) return;

  if (text !== session.flowData.accountPassword) {
    await WhatsAppAPI.sendText(to, "❌ Passwords do not match. Please enter your password again:");
    return;
  }

  await onConfirmed();
}

function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "";
}
