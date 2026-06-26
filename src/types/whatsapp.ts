import type {
  WHATSAPP_FLOWS,
  WHATSAPP_DOCUMENT_TYPES,
  WHATSAPP_DOCUMENT_STATUSES,
  ENQUIRY_CATEGORIES,
  ENQUIRY_STATUSES,
} from "@/lib/constants";

export type WhatsAppFlow = (typeof WHATSAPP_FLOWS)[number];
export type WhatsAppDocumentType = (typeof WHATSAPP_DOCUMENT_TYPES)[number];
export type WhatsAppDocumentStatus = (typeof WHATSAPP_DOCUMENT_STATUSES)[number];
export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUSES)[number];
export type WhatsAppMessageDirection = "inbound" | "outbound";

export interface WhatsAppMessageLogEntry {
  id: string;
  whatsappNumber: string;
  direction: WhatsAppMessageDirection;
  messageType: string;
  flow: string | null;
  step: string | null;
  content: string;
  createdAt: Date;
}

export interface WhatsAppSession {
  id: string;
  whatsappNumber: string;
  userId: string | null;
  currentFlow: WhatsAppFlow | null;
  currentStep: string | null;
  flowData: Record<string, unknown>;
  isAuthenticated: boolean;
  lastMessageAt: Date;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppDocumentUpload {
  id: string;
  whatsappNumber: string;
  userId: string | null;
  membershipId: string | null;
  documentType: WhatsAppDocumentType;
  metaMediaId: string;
  uploadThingUrl: string | null;
  filename: string;
  mimeType: string;
  status: WhatsAppDocumentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface WhatsAppEnquiry {
  id: string;
  whatsappNumber: string;
  userId: string | null;
  category: EnquiryCategory;
  message: string;
  status: EnquiryStatus;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
