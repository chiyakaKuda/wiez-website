"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  whatsappSessions,
  whatsappEnquiries,
  whatsappDocumentUploads,
  whatsappMessages,
  users,
  memberships,
} from "@/db/schema";
import { type ActionResult, errorMessage } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth-utils";
import type { EnquiryCategory, WhatsAppMessageLogEntry } from "@/types/whatsapp";

async function requireWhatsAppAdmin(): Promise<{ id: string; name: string }> {
  const user = await getCurrentUser();
  const allowedRoles = ["org_admin", "super_admin"];
  if (!user || !user.roles.some((role) => allowedRoles.includes(role))) {
    throw new Error("You do not have permission to perform this action.");
  }
  return { id: user.id, name: user.name };
}

// ---------------------------------------------------------------------------
// Ungated — used by the enquiry flow, which has no web session.
// ---------------------------------------------------------------------------

export async function generateEnquiryReference(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.execute<{ seq: string }>(
    sql`SELECT nextval('enquiry_reference_seq') AS seq`
  );
  const seq = Number(result.rows[0]?.seq ?? 0);
  return `ENQ-${year}-${String(seq).padStart(4, "0")}`;
}

export async function createEnquiry(input: {
  whatsappNumber: string;
  userId: string | null;
  category: EnquiryCategory;
  message: string;
}): Promise<ActionResult<{ id: string }>> {
  try {
    const [enquiry] = await db
      .insert(whatsappEnquiries)
      .values({
        whatsappNumber: input.whatsappNumber,
        userId: input.userId,
        category: input.category,
        message: input.message,
      })
      .returning({ id: whatsappEnquiries.id });

    revalidatePath("/admin/whatsapp");
    return { success: true, data: { id: enquiry.id } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Admin-facing
// ---------------------------------------------------------------------------

export interface WhatsAppStats {
  totalUsers: number;
  activeToday: number;
  pendingEnquiries: number;
  documentsToday: number;
}

export async function getWhatsAppStats(): Promise<WhatsAppStats> {
  await requireWhatsAppAdmin();

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalUsers] = await db.select({ count: sql<number>`count(*)::int` }).from(whatsappSessions);
  const [activeToday] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(whatsappSessions)
    .where(gte(whatsappSessions.lastMessageAt, oneDayAgo));
  const [pendingEnquiries] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(whatsappEnquiries)
    .where(eq(whatsappEnquiries.status, "open"));
  const [documentsToday] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(whatsappDocumentUploads)
    .where(gte(whatsappDocumentUploads.createdAt, startOfToday));

  return {
    totalUsers: totalUsers.count,
    activeToday: activeToday.count,
    pendingEnquiries: pendingEnquiries.count,
    documentsToday: documentsToday.count,
  };
}

export interface ConversationListItem {
  id: string;
  whatsappNumber: string;
  linkedName: string | null;
  linkedEmail: string | null;
  currentFlow: string | null;
  currentStep: string | null;
  lastMessageAt: Date;
  isAuthenticated: boolean;
}

export async function getOpenEnquiriesCount(): Promise<number> {
  await requireWhatsAppAdmin();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(whatsappEnquiries)
    .where(eq(whatsappEnquiries.status, "open"));
  return row.count;
}

export async function getPendingMembershipsCount(): Promise<number> {
  await requireWhatsAppAdmin();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(memberships)
    .where(eq(memberships.status, "submitted"));
  return row.count;
}

export async function getConversations(): Promise<ConversationListItem[]> {
  await requireWhatsAppAdmin();

  const rows = await db
    .select({
      id: whatsappSessions.id,
      whatsappNumber: whatsappSessions.whatsappNumber,
      linkedName: users.name,
      linkedEmail: users.email,
      currentFlow: whatsappSessions.currentFlow,
      currentStep: whatsappSessions.currentStep,
      lastMessageAt: whatsappSessions.lastMessageAt,
      isAuthenticated: whatsappSessions.isAuthenticated,
    })
    .from(whatsappSessions)
    .leftJoin(users, eq(whatsappSessions.userId, users.id))
    .orderBy(desc(whatsappSessions.lastMessageAt))
    .limit(100);

  return rows;
}

export interface EnquiryListItem {
  id: string;
  whatsappNumber: string;
  linkedName: string | null;
  category: EnquiryCategory;
  message: string;
  status: string;
  createdAt: Date;
}

export async function getOpenEnquiries(): Promise<EnquiryListItem[]> {
  await requireWhatsAppAdmin();

  const rows = await db
    .select({
      id: whatsappEnquiries.id,
      whatsappNumber: whatsappEnquiries.whatsappNumber,
      linkedName: users.name,
      category: whatsappEnquiries.category,
      message: whatsappEnquiries.message,
      status: whatsappEnquiries.status,
      createdAt: whatsappEnquiries.createdAt,
    })
    .from(whatsappEnquiries)
    .leftJoin(users, eq(whatsappEnquiries.userId, users.id))
    .where(eq(whatsappEnquiries.status, "open"))
    .orderBy(desc(whatsappEnquiries.createdAt));

  return rows;
}

export async function resolveEnquiry(id: string): Promise<ActionResult> {
  try {
    const admin = await requireWhatsAppAdmin();
    await db
      .update(whatsappEnquiries)
      .set({ status: "resolved", resolvedBy: admin.id, resolvedAt: new Date(), updatedAt: new Date() })
      .where(eq(whatsappEnquiries.id, id));

    revalidatePath("/admin/whatsapp");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export interface DocumentUploadLogItem {
  id: string;
  whatsappNumber: string;
  documentType: string;
  filename: string;
  membershipReference: string | null;
  membershipId: string | null;
  status: string;
  createdAt: Date;
}

export async function getDocumentUploadLog(): Promise<DocumentUploadLogItem[]> {
  await requireWhatsAppAdmin();

  const rows = await db
    .select({
      id: whatsappDocumentUploads.id,
      whatsappNumber: whatsappDocumentUploads.whatsappNumber,
      documentType: whatsappDocumentUploads.documentType,
      filename: whatsappDocumentUploads.filename,
      membershipReference: memberships.applicationReference,
      membershipId: whatsappDocumentUploads.membershipId,
      status: whatsappDocumentUploads.status,
      createdAt: whatsappDocumentUploads.createdAt,
    })
    .from(whatsappDocumentUploads)
    .leftJoin(memberships, eq(whatsappDocumentUploads.membershipId, memberships.id))
    .orderBy(desc(whatsappDocumentUploads.createdAt))
    .limit(100);

  return rows;
}

export async function getMessageLog(): Promise<WhatsAppMessageLogEntry[]> {
  await requireWhatsAppAdmin();

  const rows = await db
    .select()
    .from(whatsappMessages)
    .orderBy(desc(whatsappMessages.createdAt))
    .limit(200);

  return rows as WhatsAppMessageLogEntry[];
}
