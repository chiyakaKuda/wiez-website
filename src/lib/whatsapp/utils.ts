export interface ParsedMessage {
  type: "text" | "image" | "document" | "button_reply" | "list_reply" | "unknown";
  text?: string;
  replyId?: string;
  mediaId?: string;
  filename?: string;
  mimeType?: string;
  caption?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- shape is whatever Meta's webhook payload sends
export function parseMessage(message: any): ParsedMessage {
  const type = message?.type;

  if (type === "text") {
    return { type: "text", text: message.text?.body ?? "" };
  }

  if (type === "interactive") {
    const interactive = message.interactive;
    if (interactive?.type === "button_reply") {
      return {
        type: "button_reply",
        replyId: interactive.button_reply?.id,
        text: interactive.button_reply?.title,
      };
    }
    if (interactive?.type === "list_reply") {
      return {
        type: "list_reply",
        replyId: interactive.list_reply?.id,
        text: interactive.list_reply?.title,
      };
    }
    return { type: "unknown" };
  }

  if (type === "image") {
    return {
      type: "image",
      mediaId: message.image?.id,
      mimeType: message.image?.mime_type,
      caption: message.image?.caption,
    };
  }

  if (type === "document") {
    return {
      type: "document",
      mediaId: message.document?.id,
      filename: message.document?.filename,
      mimeType: message.document?.mime_type,
      caption: message.document?.caption,
    };
  }

  return { type: "unknown" };
}

export function normalizeText(text: string): string {
  return text.trim().toLowerCase();
}

export function isCancel(text: string | undefined): boolean {
  if (!text) return false;
  return ["cancel", "stop", "quit", "exit"].includes(normalizeText(text));
}

export function isBack(text: string | undefined): boolean {
  if (!text) return false;
  return ["back", "go back", "return"].includes(normalizeText(text));
}

export function isMenu(text: string | undefined): boolean {
  if (!text) return false;
  return ["menu", "main menu", "home"].includes(normalizeText(text));
}

export function formatAmount(amount: number): string {
  return `$${amount.toFixed(2)} USD`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Accepts +263XXXXXXXXX, 263XXXXXXXXX, or local 0XXXXXXXXX formats. */
export function isValidZimbabwePhone(phone: string): boolean {
  const digits = phone.replace(/[\s-]/g, "");
  return /^(\+263|263|0)(7[0-9]{8}|8[0-9]{8})$/.test(digits);
}

/** Zimbabwe National ID format: 00-000000X00 (2 digits, 6-7 digits, 1 letter, 2 digits). */
export function isValidNationalId(id: string): boolean {
  return /^\d{2}-\d{6,7}[A-Za-z]\d{2}$/.test(id.trim());
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Normalizes any accepted Zimbabwe phone format to E.164 (+263XXXXXXXXX). */
export function formatToE164(number: string): string {
  const digits = number.replace(/[\s-]/g, "");
  if (digits.startsWith("+263")) return digits;
  if (digits.startsWith("263")) return `+${digits}`;
  if (digits.startsWith("0")) return `+263${digits.slice(1)}`;
  return digits.startsWith("+") ? digits : `+${digits}`;
}

function paddedSequence(sequenceNumber: number): string {
  return String(sequenceNumber).padStart(4, "0");
}

export function generateAppReference(sequenceNumber: number): string {
  return `WIEZ-APP-${new Date().getFullYear()}-${paddedSequence(sequenceNumber)}`;
}

export function generateTicketNumber(sequenceNumber: number): string {
  return `WIEZ-TKT-${new Date().getFullYear()}-${paddedSequence(sequenceNumber)}`;
}

export function generateRegReference(sequenceNumber: number): string {
  return `WIEZ-REG-${new Date().getFullYear()}-${paddedSequence(sequenceNumber)}`;
}
