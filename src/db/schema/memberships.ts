import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  pgSequence,
  text,
  boolean,
  timestamp,
  uuid,
  numeric,
  jsonb,
  date,
} from "drizzle-orm/pg-core";
import {
  MEMBERSHIP_TYPE_NAMES,
  MEMBERSHIP_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} from "@/lib/constants";
import { users } from "./auth";
import type {
  MembershipApplicationData,
  MembershipDocument,
  ReviewNote,
} from "@/types/memberships";

export const membershipTypeNameEnum = pgEnum("membership_type_name", MEMBERSHIP_TYPE_NAMES);
export const membershipStatusEnum = pgEnum("membership_status", MEMBERSHIP_STATUSES);
export const paymentMethodEnum = pgEnum("payment_method", PAYMENT_METHODS);
export const paymentStatusEnum = pgEnum("payment_status", PAYMENT_STATUSES);

// Atomic, concurrency-safe counters backing the human-readable reference
// numbers. Postgres sequences guarantee nextval() never returns the same
// value twice, even under concurrent requests.
export const applicationReferenceSeq = pgSequence("application_reference_seq", {
  startWith: 1,
  increment: 1,
});
export const membershipNumberSeq = pgSequence("membership_number_seq", {
  startWith: 1,
  increment: 1,
});

export const membershipTypes = pgTable("membership_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: membershipTypeNameEnum("name").notNull().unique(),
  description: text("description").notNull(),
  fee: numeric("fee", { precision: 10, scale: 2, mode: "number" }).notNull(),
  eligibilityCriteria: text("eligibility_criteria").notNull(),
  requiredDocuments: jsonb("required_documents").$type<string[]>().notNull(),
  benefits: jsonb("benefits").$type<string[]>().notNull(),
  terms: text("terms").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const memberships = pgTable("memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  membershipTypeId: uuid("membership_type_id")
    .notNull()
    .references(() => membershipTypes.id),
  applicationReference: text("application_reference").unique(),
  membershipNumber: text("membership_number").unique(),
  status: membershipStatusEnum("status").notNull().default("draft"),
  applicationData: jsonb("application_data").$type<MembershipApplicationData>(),
  documents: jsonb("documents").$type<MembershipDocument[]>(),
  reviewNotes: jsonb("review_notes").$type<ReviewNote[]>().notNull().default([]),
  infoRequestMessage: text("info_request_message"),
  reviewedBy: uuid("reviewed_by").references(() => users.id, { onDelete: "set null" }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  approvedBy: uuid("approved_by").references(() => users.id, { onDelete: "set null" }),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
  rejectionReason: text("rejection_reason"),
  startDate: date("start_date"),
  expiryDate: date("expiry_date"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const membershipPayments = pgTable("membership_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  membershipId: uuid("membership_id")
    .notNull()
    .references(() => memberships.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
  currency: text("currency").notNull().default("USD"),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentReference: text("payment_reference").notNull(),
  paymentProofUrl: text("payment_proof_url").notNull(),
  paymentProofName: text("payment_proof_name").notNull(),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  status: paymentStatusEnum("status").notNull().default("submitted"),
  verifiedBy: uuid("verified_by").references(() => users.id, { onDelete: "set null" }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  verificationNotes: text("verification_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const membershipStatusHistory = pgTable("membership_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  membershipId: uuid("membership_id")
    .notNull()
    .references(() => memberships.id, { onDelete: "cascade" }),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const membershipTypesRelations = relations(membershipTypes, ({ many }) => ({
  memberships: many(memberships),
}));

export const membershipsRelations = relations(memberships, ({ one, many }) => ({
  user: one(users, { fields: [memberships.userId], references: [users.id] }),
  membershipType: one(membershipTypes, {
    fields: [memberships.membershipTypeId],
    references: [membershipTypes.id],
  }),
  reviewedByUser: one(users, {
    fields: [memberships.reviewedBy],
    references: [users.id],
    relationName: "reviewedByUser",
  }),
  approvedByUser: one(users, {
    fields: [memberships.approvedBy],
    references: [users.id],
    relationName: "approvedByUser",
  }),
  payments: many(membershipPayments),
  statusHistory: many(membershipStatusHistory),
}));

export const membershipPaymentsRelations = relations(membershipPayments, ({ one }) => ({
  membership: one(memberships, {
    fields: [membershipPayments.membershipId],
    references: [memberships.id],
  }),
  user: one(users, { fields: [membershipPayments.userId], references: [users.id] }),
  verifiedByUser: one(users, {
    fields: [membershipPayments.verifiedBy],
    references: [users.id],
  }),
}));

export const membershipStatusHistoryRelations = relations(membershipStatusHistory, ({ one }) => ({
  membership: one(memberships, {
    fields: [membershipStatusHistory.membershipId],
    references: [memberships.id],
  }),
  changedByUser: one(users, {
    fields: [membershipStatusHistory.changedBy],
    references: [users.id],
  }),
}));
