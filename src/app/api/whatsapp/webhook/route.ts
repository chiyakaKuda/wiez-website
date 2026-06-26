import { after } from "next/server";
import { processIncomingMessage } from "@/lib/whatsapp/dispatcher";

// Meta webhook verification handshake.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(req: Request) {
  const body = await req.json();

  // Always return 200 immediately — Meta retries aggressively on non-2xx
  // responses, and a slow chatbot turn would otherwise cause duplicate
  // deliveries. `after()` keeps the serverless invocation alive (via
  // Vercel's waitUntil) until processing finishes, even though the response
  // has already been sent — a bare un-awaited promise gets killed mid-flight
  // on serverless platforms as soon as the response goes out.
  after(() =>
    processIncomingMessage(body).catch((error) => {
      console.error("Failed to process WhatsApp message:", error);
    })
  );

  return new Response("OK", { status: 200 });
}
