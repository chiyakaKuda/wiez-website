import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, userRoles, roles, accounts, memberships, membershipTypes } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { clearFlow, updateSession } from "@/lib/whatsapp/session";
import { countWords } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { generateApplicationReference } from "@/actions/memberships";
import { logStatusChange } from "@/lib/membership-internal";
import type { MembershipApplicationData, MembershipDocument, MembershipTypeName } from "@/types/memberships";
import type { WhatsAppSession } from "@/types/whatsapp";
import type { ZIMBABWE_PROVINCES, ENGINEERING_DISCIPLINES } from "@/lib/constants";

type Province = (typeof ZIMBABWE_PROVINCES)[number];
type EngineeringDiscipline = (typeof ENGINEERING_DISCIPLINES)[number];

export async function goToReviewStep(
  to: string,
  session: WhatsAppSession,
  data: MembershipApplicationData
): Promise<void> {
  const type = session.flowData.membershipType as MembershipTypeName;
  const fee = session.flowData.membershipFee as number;
  const email = session.flowData.accountEmail as string;
  const documents = (session.flowData.uploadedDocs as MembershipDocument[]) ?? [];

  const isCorporate = type === "Corporate";

  const personalSection = isCorporate
    ? `Company: ${data.companyName}\nContact: ${data.contactPersonName} (${data.contactPersonTitle})\nIndustry: ${data.industry}`
    : `Name: ${data.fullLegalName}\nID: ${data.nationalId}\nProvince: ${data.province}\nCity: ${data.city}`;

  const statement = data.personalStatement || data.professionalBio || data.whyJoinWiez || data.howSupportWomen;
  const statementLine = statement ? `\nStatement: ✅ Submitted (${countWords(statement)} words)` : "";

  const docLines = documents.map((doc) => `✅ ${doc.type}`).join("\n");

  await WhatsAppAPI.sendButtons(
    to,
    `📋 *APPLICATION SUMMARY*\n━━━━━━━━━━━━━━━━━━━━━\nType: ${type} — $${fee}/year\nAccount: 📧 ${email}\n\n*Information*\n${personalSection}${statementLine}\n\n*Documents*\n${docLines}\n━━━━━━━━━━━━━━━━━━━━━\nReady to submit?`,
    [
      { id: "SUBMIT_APPLICATION", title: "Submit Application ✅" },
      { id: "CANCEL_APPLICATION", title: "Cancel ❌" },
    ]
  );
  // Step kept as "review_confirm" so the main dispatcher can route the reply here.
  await updateSession(to, { currentStep: "review_confirm" });
}

export async function handleReviewConfirm(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (parsed.replyId === "CANCEL_APPLICATION") {
    await WhatsAppAPI.sendText(
      to,
      "❌ Cancelled. Your progress has been saved.\n\nReply *CONTINUE* to resume or *MENU* to start over."
    );
    return;
  }

  if (parsed.replyId !== "SUBMIT_APPLICATION") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
    return;
  }

  await submitApplication(to, session);
}

async function submitApplication(to: string, session: WhatsAppSession): Promise<void> {
  const type = session.flowData.membershipType as MembershipTypeName;
  const email = session.flowData.accountEmail as string;
  const password = session.flowData.accountPassword as string;
  const documents = (session.flowData.uploadedDocs as MembershipDocument[]) ?? [];
  const name =
    type === "Corporate"
      ? (session.flowData.companyName as string)
      : (session.flowData.fullLegalName as string);

  try {
    const hashedPassword = await hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        emailVerified: false,
        phone: (session.flowData.phone as string | undefined) ?? null,
        province: type === "Corporate" ? null : ((session.flowData.province as Province | undefined) ?? null),
        engineeringDiscipline:
          type === "Corporate"
            ? null
            : ((session.flowData.engineeringDiscipline as EngineeringDiscipline | undefined) ?? null),
        whatsappNumber: to,
        mustChangePassword: true,
      })
      .returning();

    await db.insert(accounts).values({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      password: hashedPassword,
    });

    const memberRole = await db.query.roles.findFirst({ where: eq(roles.name, "member") });
    if (memberRole) {
      await db.insert(userRoles).values({ userId: user.id, roleId: memberRole.id });
    }

    const membershipType = await db.query.membershipTypes.findFirst({
      where: eq(membershipTypes.name, type),
    });
    if (!membershipType) throw new Error(`Membership type ${type} not found`);

    const applicationReference = await generateApplicationReference();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- membershipType isn't part of the stored applicationData shape
    const { membershipType: _ignored, ...applicationData } = session.flowData;

    const [membership] = await db
      .insert(memberships)
      .values({
        userId: user.id,
        membershipTypeId: membershipType.id,
        applicationReference,
        status: "submitted",
        applicationData: applicationData as MembershipApplicationData,
        documents,
        submittedAt: new Date(),
      })
      .returning({ id: memberships.id });

    await logStatusChange(membership.id, "draft", "submitted", user.id);

    await updateSession(to, {
      userId: user.id,
      isAuthenticated: true,
      currentFlow: null,
      currentStep: null,
      flowData: {},
    });

    await WhatsAppAPI.sendText(
      to,
      `🎉 *Application Submitted!*\n\nReference: *${applicationReference}*\nSave this number — you'll need it to track your application.\n\n*What happens next:*\n1️⃣ Our team reviews your application (5–7 business days)\n2️⃣ You'll receive a WhatsApp notification with the outcome\n3️⃣ If approved, payment instructions will be sent here\n\nTo track your status anytime, send *STATUS*\n\nYou can also log in to the web dashboard:\n🌐 ${process.env.NEXT_PUBLIC_APP_URL ?? ""}/sign-in\n\nWelcome to WiEZ! 💚`
    );
  } catch (error) {
    console.error("Failed to submit WhatsApp membership application:", error);
    await clearFlow(to);
    await WhatsAppAPI.sendText(
      to,
      "❌ Something went wrong submitting your application. Please contact membership@wiez.co.zw, or reply *REGISTER* to try again."
    );
  }
}
