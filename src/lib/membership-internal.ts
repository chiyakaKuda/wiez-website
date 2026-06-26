import "server-only";

import { db } from "@/db";
import { membershipStatusHistory } from "@/db/schema";

/**
 * Shared by both the web membership actions and the WhatsApp registration
 * flow. Deliberately NOT exported from a "use server" action file — it does
 * no authorization checks of its own, so it must never be directly
 * callable as a public server action.
 */
export async function logStatusChange(
  membershipId: string,
  fromStatus: string | null,
  toStatus: string,
  changedBy: string,
  reason?: string
): Promise<void> {
  await db.insert(membershipStatusHistory).values({
    membershipId,
    fromStatus,
    toStatus,
    changedBy,
    reason: reason ?? null,
  });
}
