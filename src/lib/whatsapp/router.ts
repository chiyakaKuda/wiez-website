import { normalizeText } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";

export type Intent = "MAIN_MENU" | "REGISTER" | "LOGIN" | "EVENTS" | "STATUS" | "ENQUIRY" | "UNKNOWN";

const MAIN_MENU_KEYWORDS = [
  "hi",
  "hello",
  "menu",
  "main menu",
  "home",
  "start",
  "hey",
  "hie",
  "howdy",
  "hello wiez",
];
const REGISTER_KEYWORDS = ["register", "join", "apply", "membership", "1"];
const LOGIN_KEYWORDS = ["login", "sign in", "signin", "log in", "2"];
const EVENTS_KEYWORDS = ["events", "event", "3"];
const STATUS_KEYWORDS = ["status", "track", "my status", "4"];
const ENQUIRY_KEYWORDS = ["enquiry", "question", "help", "ask", "5"];

export function routeIntent(parsed: ParsedMessage): Intent {
  const replyId = parsed.replyId;
  if (replyId === "MAIN_MENU") return "MAIN_MENU";
  if (replyId === "REGISTER") return "REGISTER";
  if (replyId === "LOGIN") return "LOGIN";
  if (replyId === "EVENTS") return "EVENTS";
  if (replyId === "STATUS") return "STATUS";
  if (replyId === "ENQUIRY") return "ENQUIRY";

  const text = normalizeText(parsed.text ?? "");
  if (!text) return "UNKNOWN";

  if (MAIN_MENU_KEYWORDS.includes(text)) return "MAIN_MENU";
  if (REGISTER_KEYWORDS.includes(text)) return "REGISTER";
  if (LOGIN_KEYWORDS.includes(text)) return "LOGIN";
  if (EVENTS_KEYWORDS.includes(text)) return "EVENTS";
  if (STATUS_KEYWORDS.includes(text)) return "STATUS";
  if (ENQUIRY_KEYWORDS.includes(text)) return "ENQUIRY";

  return "UNKNOWN";
}
