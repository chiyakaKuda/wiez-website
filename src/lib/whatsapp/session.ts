import { eq } from "drizzle-orm";
import { db } from "@/db";
import { whatsappSessions } from "@/db/schema";
import { formatToE164 } from "@/lib/whatsapp/utils";
import type { WhatsAppFlow, WhatsAppSession } from "@/types/whatsapp";

function mapRow(row: typeof whatsappSessions.$inferSelect): WhatsAppSession {
  return {
    id: row.id,
    whatsappNumber: row.whatsappNumber,
    userId: row.userId,
    currentFlow: row.currentFlow,
    currentStep: row.currentStep,
    flowData: row.flowData,
    isAuthenticated: row.isAuthenticated,
    lastMessageAt: row.lastMessageAt,
    isBlocked: row.isBlocked,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getOrCreateSession(whatsappNumber: string): Promise<WhatsAppSession> {
  const number = formatToE164(whatsappNumber);

  const existing = await db.query.whatsappSessions.findFirst({
    where: eq(whatsappSessions.whatsappNumber, number),
  });

  if (existing) {
    await db
      .update(whatsappSessions)
      .set({ lastMessageAt: new Date() })
      .where(eq(whatsappSessions.id, existing.id));
    return mapRow({ ...existing, lastMessageAt: new Date() });
  }

  const [created] = await db
    .insert(whatsappSessions)
    .values({ whatsappNumber: number })
    .returning();

  return mapRow(created);
}

export async function updateSession(
  whatsappNumber: string,
  updates: Partial<WhatsAppSession>
): Promise<void> {
  const number = formatToE164(whatsappNumber);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- stripping immutable fields out of the partial update
  const { id, whatsappNumber: _ignored, createdAt, ...rest } = updates;

  await db
    .update(whatsappSessions)
    .set({ ...rest, updatedAt: new Date() })
    .where(eq(whatsappSessions.whatsappNumber, number));
}

/** Merges (not replaces) a key into the session's accumulated flowData. */
export async function saveFlowData(
  whatsappNumber: string,
  key: string,
  value: unknown
): Promise<void> {
  const number = formatToE164(whatsappNumber);

  const session = await db.query.whatsappSessions.findFirst({
    where: eq(whatsappSessions.whatsappNumber, number),
  });
  if (!session) return;

  await db
    .update(whatsappSessions)
    .set({ flowData: { ...session.flowData, [key]: value }, updatedAt: new Date() })
    .where(eq(whatsappSessions.id, session.id));
}

export async function clearFlow(whatsappNumber: string): Promise<void> {
  const number = formatToE164(whatsappNumber);
  await db
    .update(whatsappSessions)
    .set({ currentFlow: null, currentStep: null, flowData: {}, updatedAt: new Date() })
    .where(eq(whatsappSessions.whatsappNumber, number));
}

export async function setFlowStep(
  whatsappNumber: string,
  flow: WhatsAppFlow,
  step: string
): Promise<void> {
  const number = formatToE164(whatsappNumber);
  await db
    .update(whatsappSessions)
    .set({ currentFlow: flow, currentStep: step, updatedAt: new Date() })
    .where(eq(whatsappSessions.whatsappNumber, number));
}
