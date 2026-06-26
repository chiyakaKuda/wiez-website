import { db } from "@/db";
import { whatsappMessages } from "@/db/schema";
import type { WhatsAppMessageDirection } from "@/types/whatsapp";

/** Never throws — admin visibility logging should never break the chat itself. */
export async function logMessage(input: {
  whatsappNumber: string;
  direction: WhatsAppMessageDirection;
  messageType: string;
  content: string;
  flow?: string | null;
  step?: string | null;
}): Promise<void> {
  try {
    await db.insert(whatsappMessages).values({
      whatsappNumber: input.whatsappNumber,
      direction: input.direction,
      messageType: input.messageType,
      flow: input.flow ?? null,
      step: input.step ?? null,
      content: input.content.slice(0, 500),
    });
  } catch (error) {
    console.error("Failed to log WhatsApp message:", error);
  }
}
