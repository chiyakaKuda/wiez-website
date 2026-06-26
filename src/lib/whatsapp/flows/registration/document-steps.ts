import { UTApi, UTFile } from "uploadthing/server";
import { db } from "@/db";
import { whatsappDocumentUploads } from "@/db/schema";
import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep } from "@/lib/whatsapp/session";
import { isSkip } from "@/lib/whatsapp/common";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { REQUIRED_DOCS, isOptionalDocLabel } from "@/lib/whatsapp/flows/registration/shared";
import { goToReviewStep } from "@/lib/whatsapp/flows/registration/review-step";
import type { MembershipApplicationData, MembershipDocument, MembershipTypeName } from "@/types/memberships";
import type { WhatsAppDocumentType, WhatsAppSession } from "@/types/whatsapp";

const utapi = new UTApi();

export async function goToFirstDocumentStep(to: string, type: MembershipTypeName): Promise<void> {
  const docs = REQUIRED_DOCS[type];
  await saveFlowData(to, "uploadedDocs", []);

  const requiredList = docs.map((doc) => `• ${doc.label}`).join("\n");
  await WhatsAppAPI.sendText(
    to,
    `📎 *Document Upload*\n\nPlease send the following documents one at a time.\n\nAccepted formats: PDF, JPG, PNG (max 10MB each)\nRequired for ${type} membership:\n\n${requiredList}\n\nLet's start with your ${docs[0].label}.\n\nSend it now 👇`
  );
  await setFlowStep(to, "registration", `doc_${docs[0].key}`);
}

function docKeyFromStep(step: string): WhatsAppDocumentType {
  return step.replace("doc_", "") as WhatsAppDocumentType;
}

export async function handleDocumentStep(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const membershipType = session.flowData.membershipType as MembershipTypeName;
  const docs = REQUIRED_DOCS[membershipType];
  const currentKey = docKeyFromStep(session.currentStep ?? "");
  const currentDoc = docs.find((doc) => doc.key === currentKey);

  if (!currentDoc) {
    await WhatsAppAPI.sendText(to, "Something went wrong. Reply *MENU* to start over.");
    return;
  }

  if (parsed.type === "text" && isSkip(parsed.text) && isOptionalDocLabel(currentDoc.label)) {
    await advanceToNextDoc(to, session, membershipType, currentKey);
    return;
  }

  if (parsed.type !== "image" && parsed.type !== "document") {
    await WhatsAppAPI.sendText(
      to,
      `⚠️ Please send a file or photo, not text.\n\nSend your ${currentDoc.label} now.`
    );
    return;
  }

  const mediaId = parsed.mediaId;
  if (!mediaId) {
    await WhatsAppAPI.sendText(to, "⚠️ We couldn't read that file. Please try sending it again.");
    return;
  }

  const filename = parsed.filename ?? `${currentDoc.key}.jpg`;
  const mimeType = parsed.mimeType ?? "application/octet-stream";

  // Meta media URLs expire in ~5 minutes — download immediately.
  const mediaUrl = await WhatsAppAPI.getMediaUrl(mediaId);
  const buffer = mediaUrl ? await WhatsAppAPI.downloadMedia(mediaUrl) : null;

  if (!buffer) {
    await db.insert(whatsappDocumentUploads).values({
      whatsappNumber: to,
      userId: session.userId,
      documentType: currentKey,
      metaMediaId: mediaId,
      filename,
      mimeType,
      status: "failed",
    });
    await WhatsAppAPI.sendText(to, "⚠️ We couldn't download that file. Please try sending it again.");
    return;
  }

  let uploadedUrl: string | null = null;
  let uploadedSize = buffer.length;
  try {
    const file = new UTFile([new Uint8Array(buffer)], filename, { type: mimeType });
    const result = await utapi.uploadFiles(file);
    if (result.data) {
      uploadedUrl = result.data.ufsUrl;
      uploadedSize = result.data.size;
    } else {
      console.error("UploadThing upload failed:", result.error);
    }
  } catch (error) {
    console.error("UploadThing upload failed:", error);
  }

  await db.insert(whatsappDocumentUploads).values({
    whatsappNumber: to,
    userId: session.userId,
    documentType: currentKey,
    metaMediaId: mediaId,
    uploadThingUrl: uploadedUrl,
    filename,
    mimeType,
    status: uploadedUrl ? "uploaded" : "failed",
  });

  if (!uploadedUrl) {
    await WhatsAppAPI.sendText(to, "⚠️ We couldn't upload that file. Please try sending it again.");
    return;
  }

  const uploadedDocs = ((session.flowData.uploadedDocs as MembershipDocument[]) ?? []).filter(
    (doc) => doc.type !== currentDoc.label
  );
  uploadedDocs.push({
    type: currentDoc.label,
    name: filename,
    url: uploadedUrl,
    size: uploadedSize,
    uploadedAt: new Date().toISOString(),
    verified: false,
  });
  await saveFlowData(to, "uploadedDocs", uploadedDocs);

  await WhatsAppAPI.sendText(to, `✅ ${currentDoc.label} received!`);
  await advanceToNextDoc(to, session, membershipType, currentKey);
}

async function advanceToNextDoc(
  to: string,
  session: WhatsAppSession,
  membershipType: MembershipTypeName,
  justCompletedKey: WhatsAppDocumentType
): Promise<void> {
  const docs = REQUIRED_DOCS[membershipType];
  const currentIndex = docs.findIndex((doc) => doc.key === justCompletedKey);
  const nextDoc = docs[currentIndex + 1];

  if (nextDoc) {
    await setFlowStep(to, "registration", `doc_${nextDoc.key}`);
    await WhatsAppAPI.sendText(to, `Now send your ${nextDoc.label}.`);
    return;
  }

  const uploadedDocs = (session.flowData.uploadedDocs as MembershipDocument[]) ?? [];
  const summary = uploadedDocs.map((doc) => `✅ ${doc.type}`).join("\n");
  await WhatsAppAPI.sendText(
    to,
    `✅ All documents received!\n\n${summary}\n\nReply *CONTINUE* to review your application.`
  );
  await setFlowStep(to, "registration", "review_confirm_ready");
}

export async function handleReviewConfirmReady(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (!/continue/i.test(parsed.text ?? "")) {
    await WhatsAppAPI.sendText(to, "Reply *CONTINUE* to review your application, or *MENU* for options.");
    return;
  }

  const applicationData: MembershipApplicationData = { ...session.flowData } as MembershipApplicationData;
  await goToReviewStep(to, session, applicationData);
}
