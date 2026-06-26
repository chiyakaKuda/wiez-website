import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  pgSequence,
  text,
  boolean,
  timestamp,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";
import {
  WHATSAPP_FLOWS,
  WHATSAPP_DOCUMENT_TYPES,
  WHATSAPP_DOCUMENT_STATUSES,
  ENQUIRY_CATEGORIES,
  ENQUIRY_STATUSES,
} from "@/lib/constants";
import { users } from "./auth";
import { memberships } from "./memberships";

export const whatsappFlowEnum = pgEnum("whatsapp_flow", WHATSAPP_FLOWS);
export const whatsappDocumentTypeEnum = pgEnum("whatsapp_document_type", WHATSAPP_DOCUMENT_TYPES);
export const whatsappDocumentStatusEnum = pgEnum(
  "whatsapp_document_status",
  WHATSAPP_DOCUMENT_STATUSES
);
export const enquiryCategoryEnum = pgEnum("enquiry_category", ENQUIRY_CATEGORIES);
export const enquiryStatusEnum = pgEnum("enquiry_status", ENQUIRY_STATUSES);

export const enquiryReferenceSeq = pgSequence("enquiry_reference_seq", {
  startWith: 1,
  increment: 1,
});

export const whatsappMessageDirectionEnum = pgEnum("whatsapp_message_direction", [
  "inbound",
  "outbound",
]);

export const whatsappSessions = pgTable("whatsapp_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatsappNumber: text("whatsapp_number").notNull().unique(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  currentFlow: whatsappFlowEnum("current_flow"),
  currentStep: text("current_step"),
  flowData: jsonb("flow_data").$type<Record<string, unknown>>().notNull().default({}),
  isAuthenticated: boolean("is_authenticated").notNull().default(false),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }).notNull().defaultNow(),
  isBlocked: boolean("is_blocked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappDocumentUploads = pgTable("whatsapp_document_uploads", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatsappNumber: text("whatsapp_number").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  membershipId: uuid("membership_id").references(() => memberships.id, { onDelete: "set null" }),
  documentType: whatsappDocumentTypeEnum("document_type").notNull(),
  metaMediaId: text("meta_media_id").notNull(),
  uploadThingUrl: text("uploadthing_url"),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  status: whatsappDocumentStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappEnquiries = pgTable("whatsapp_enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatsappNumber: text("whatsapp_number").notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  category: enquiryCategoryEnum("category").notNull(),
  message: text("message").notNull(),
  status: enquiryStatusEnum("status").notNull().default("open"),
  resolvedBy: uuid("resolved_by").references(() => users.id, { onDelete: "set null" }),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// Not in the original spec's schema list, but the spec's own admin
// "Message Log" tab (direction/type/flow/step/content/timestamp) has no
// table to read from without this — added to back that UI.
export const whatsappMessages = pgTable("whatsapp_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  whatsappNumber: text("whatsapp_number").notNull(),
  direction: whatsappMessageDirectionEnum("direction").notNull(),
  messageType: text("message_type").notNull(),
  flow: text("flow"),
  step: text("step"),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const whatsappSessionsRelations = relations(whatsappSessions, ({ one }) => ({
  user: one(users, { fields: [whatsappSessions.userId], references: [users.id] }),
}));

export const whatsappDocumentUploadsRelations = relations(whatsappDocumentUploads, ({ one }) => ({
  user: one(users, { fields: [whatsappDocumentUploads.userId], references: [users.id] }),
  membership: one(memberships, {
    fields: [whatsappDocumentUploads.membershipId],
    references: [memberships.id],
  }),
}));

export const whatsappEnquiriesRelations = relations(whatsappEnquiries, ({ one }) => ({
  user: one(users, { fields: [whatsappEnquiries.userId], references: [users.id] }),
  resolvedByUser: one(users, {
    fields: [whatsappEnquiries.resolvedBy],
    references: [users.id],
  }),
}));
