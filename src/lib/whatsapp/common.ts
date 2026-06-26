import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { clearFlow } from "@/lib/whatsapp/session";
import { sendMainMenu } from "@/lib/whatsapp/menus";
import { isCancel, isMenu } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";

/**
 * Checked at the start of every flow step handler.
 *
 * Cancel intentionally does NOT touch session state — it only sends an
 * acknowledgement. The user's step/flowData are untouched, so literally any
 * next message (including "continue") picks up exactly where they left off.
 * Menu is the only command that actually clears the flow.
 *
 * Returns true if the message was a universal command and has already been
 * fully handled — the caller should stop processing and return immediately.
 */
export async function handleUniversalCommands(
  to: string,
  parsed: ParsedMessage
): Promise<boolean> {
  if (isCancel(parsed.text)) {
    await WhatsAppAPI.sendText(
      to,
      "❌ Cancelled. Your progress has been saved as a draft.\n\nReply *MENU* to start over or *CONTINUE* to resume."
    );
    return true;
  }

  if (isMenu(parsed.text)) {
    await clearFlow(to);
    await sendMainMenu(to, true);
    return true;
  }

  return false;
}

/** Generic "please send text, not a file" guard used by every text-input step. */
export async function requireText(to: string, parsed: ParsedMessage, prompt: string): Promise<string | null> {
  if (parsed.type !== "text" || !parsed.text?.trim()) {
    await WhatsAppAPI.sendText(to, `⚠️ Please send a text reply.\n\n${prompt}`);
    return null;
  }
  return parsed.text.trim();
}

export function isSkip(text: string | undefined): boolean {
  return (text ?? "").trim().toLowerCase() === "skip";
}

export function isSame(text: string | undefined): boolean {
  return (text ?? "").trim().toLowerCase() === "same";
}
