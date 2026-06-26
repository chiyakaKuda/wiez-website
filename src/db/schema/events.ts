import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  pgSequence,
  text,
  boolean,
  integer,
  timestamp,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";
import {
  EVENT_TYPES,
  EVENT_STATUSES,
  EVENT_REGISTRATION_STATUSES,
  EVENT_REGISTRATION_PAYMENT_STATUSES,
  EVENT_REGISTRATION_SOURCES,
  ZIMBABWE_PROVINCES,
} from "@/lib/constants";
import { users } from "./auth";
import { paymentMethodEnum, paymentStatusEnum } from "./memberships";

export const eventTypeEnum = pgEnum("event_type", EVENT_TYPES);
export const eventStatusEnum = pgEnum("event_status", EVENT_STATUSES);
export const eventRegistrationStatusEnum = pgEnum(
  "event_registration_status",
  EVENT_REGISTRATION_STATUSES
);
export const eventRegistrationPaymentStatusEnum = pgEnum(
  "event_registration_payment_status",
  EVENT_REGISTRATION_PAYMENT_STATUSES
);
export const eventRegistrationSourceEnum = pgEnum(
  "event_registration_source",
  EVENT_REGISTRATION_SOURCES
);
export const eventProvinceEnum = pgEnum("event_province", ZIMBABWE_PROVINCES);

export const ticketNumberSeq = pgSequence("ticket_number_seq", { startWith: 1, increment: 1 });
export const registrationReferenceSeq = pgSequence("registration_reference_seq", {
  startWith: 1,
  increment: 1,
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: timestamp("date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }),
  venue: text("venue").notNull(),
  province: eventProvinceEnum("province").notNull(),
  type: eventTypeEnum("type").notNull(),
  fee: numeric("fee", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
  capacity: integer("capacity").notNull(),
  registeredCount: integer("registered_count").notNull().default(0),
  status: eventStatusEnum("status").notNull().default("draft"),
  requiresApproval: boolean("requires_approval").notNull().default(false),
  imageUrl: text("image_url"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventRegistrations = pgTable("event_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  ticketNumber: text("ticket_number").unique(),
  registrationReference: text("registration_reference").notNull().unique(),
  status: eventRegistrationStatusEnum("status").notNull().default("pending_review"),
  // Distinct from `status`: a fee-required registration stays "pending_review"
  // through admin approval AND the WhatsApp payment-simulation step — this
  // flag is what actually unlocks the payment prompt.
  adminApproved: boolean("admin_approved").notNull().default(false),
  paymentStatus: eventRegistrationPaymentStatusEnum("payment_status")
    .notNull()
    .default("not_required"),
  paymentMethod: paymentMethodEnum("payment_method"),
  paymentReference: text("payment_reference"),
  paymentProofUrl: text("payment_proof_url"),
  rejectionReason: text("rejection_reason"),
  source: eventRegistrationSourceEnum("source").notNull().default("web"),
  registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventPayments = pgTable("event_payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  registrationId: uuid("registration_id")
    .notNull()
    .references(() => eventRegistrations.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  paymentReference: text("payment_reference").notNull(),
  paymentProofUrl: text("payment_proof_url").notNull(),
  status: paymentStatusEnum("status").notNull().default("submitted"),
  verifiedBy: uuid("verified_by").references(() => users.id, { onDelete: "set null" }),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const eventsRelations = relations(events, ({ one, many }) => ({
  createdByUser: one(users, { fields: [events.createdBy], references: [users.id] }),
  registrations: many(eventRegistrations),
}));

export const eventRegistrationsRelations = relations(eventRegistrations, ({ one, many }) => ({
  event: one(events, { fields: [eventRegistrations.eventId], references: [events.id] }),
  user: one(users, { fields: [eventRegistrations.userId], references: [users.id] }),
  payments: many(eventPayments),
}));

export const eventPaymentsRelations = relations(eventPayments, ({ one }) => ({
  registration: one(eventRegistrations, {
    fields: [eventPayments.registrationId],
    references: [eventRegistrations.id],
  }),
  user: one(users, { fields: [eventPayments.userId], references: [users.id] }),
  verifiedByUser: one(users, { fields: [eventPayments.verifiedBy], references: [users.id] }),
}));
