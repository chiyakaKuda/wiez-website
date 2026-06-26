import { logMessage } from "@/lib/whatsapp/message-log";

const GRAPH_BASE = "https://graph.facebook.com/v19.0";

function baseUrl(): string {
  return `${GRAPH_BASE}/${process.env.WHATSAPP_PHONE_NUMBER_ID}`;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };
}

async function post(body: Record<string, unknown>): Promise<void> {
  try {
    const response = await fetch(`${baseUrl()}/messages`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`WhatsApp API error (${response.status}): ${text}`);
    }
  } catch (error) {
    console.error("WhatsApp API request failed:", error);
  }
}

/** Buttons: max 3, each title max 20 chars (WhatsApp's own hard limit). */
function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export interface WhatsAppButton {
  id: string;
  title: string;
}

export interface WhatsAppListRow {
  id: string;
  title: string;
  description?: string;
}

export interface WhatsAppListSection {
  title: string;
  rows: WhatsAppListRow[];
}

export const WhatsAppAPI = {
  async sendText(to: string, text: string): Promise<void> {
    await post({
      to,
      type: "text",
      text: { body: text, preview_url: false },
    });
    await logMessage({ whatsappNumber: to, direction: "outbound", messageType: "text", content: text });
  },

  async sendButtons(
    to: string,
    body: string,
    buttons: WhatsAppButton[],
    header?: string,
    footer?: string
  ): Promise<void> {
    await post({
      to,
      type: "interactive",
      interactive: {
        type: "button",
        ...(header ? { header: { type: "text", text: header } } : {}),
        body: { text: body },
        ...(footer ? { footer: { text: footer } } : {}),
        action: {
          buttons: buttons.slice(0, 3).map((button) => ({
            type: "reply",
            reply: { id: button.id, title: truncate(button.title, 20) },
          })),
        },
      },
    });
    await logMessage({ whatsappNumber: to, direction: "outbound", messageType: "button", content: body });
  },

  async sendList(
    to: string,
    body: string,
    buttonLabel: string,
    sections: WhatsAppListSection[],
    header?: string,
    footer?: string
  ): Promise<void> {
    await post({
      to,
      type: "interactive",
      interactive: {
        type: "list",
        ...(header ? { header: { type: "text", text: header } } : {}),
        body: { text: body },
        ...(footer ? { footer: { text: footer } } : {}),
        action: {
          button: truncate(buttonLabel, 20),
          sections: sections.map((section) => ({
            title: truncate(section.title, 24),
            rows: section.rows.map((row) => ({
              id: row.id,
              title: truncate(row.title, 24),
              ...(row.description ? { description: truncate(row.description, 72) } : {}),
            })),
          })),
        },
      },
    });
    await logMessage({ whatsappNumber: to, direction: "outbound", messageType: "list", content: body });
  },

  async markAsRead(messageId: string): Promise<void> {
    try {
      const response = await fetch(`${baseUrl()}/messages`, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          messaging_product: "whatsapp",
          status: "read",
          message_id: messageId,
        }),
      });
      if (!response.ok) {
        console.error(`Failed to mark message as read: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to mark message as read:", error);
    }
  },

  async getMediaUrl(mediaId: string): Promise<string | null> {
    try {
      const response = await fetch(`${GRAPH_BASE}/${mediaId}`, {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
      });
      if (!response.ok) {
        console.error(`Failed to fetch media URL: ${response.status}`);
        return null;
      }
      const data = (await response.json()) as { url?: string };
      return data.url ?? null;
    } catch (error) {
      console.error("Failed to fetch media URL:", error);
      return null;
    }
  },

  async downloadMedia(mediaUrl: string): Promise<Buffer | null> {
    try {
      const response = await fetch(mediaUrl, {
        headers: { Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}` },
      });
      if (!response.ok) {
        console.error(`Failed to download media: ${response.status}`);
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      console.error("Failed to download media:", error);
      return null;
    }
  },
};
