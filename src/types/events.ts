import type {
  EVENT_TYPES,
  EVENT_STATUSES,
  EVENT_REGISTRATION_STATUSES,
  EVENT_REGISTRATION_PAYMENT_STATUSES,
  EVENT_REGISTRATION_SOURCES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} from "@/lib/constants";
import type { ZimbabweProvince } from "@/types/auth";

export type EventType = (typeof EVENT_TYPES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];
export type EventRegistrationStatus = (typeof EVENT_REGISTRATION_STATUSES)[number];
export type EventRegistrationPaymentStatus = (typeof EVENT_REGISTRATION_PAYMENT_STATUSES)[number];
export type EventRegistrationSource = (typeof EVENT_REGISTRATION_SOURCES)[number];
export type EventPaymentMethod = (typeof PAYMENT_METHODS)[number];
export type EventPaymentStatus = (typeof PAYMENT_STATUSES)[number];

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  venue: string;
  province: ZimbabweProvince;
  type: EventType;
  fee: number;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  requiresApproval: boolean;
  imageUrl: string | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string | null;
  registrationReference: string;
  status: EventRegistrationStatus;
  adminApproved: boolean;
  paymentStatus: EventRegistrationPaymentStatus;
  paymentMethod: EventPaymentMethod | null;
  paymentReference: string | null;
  paymentProofUrl: string | null;
  rejectionReason: string | null;
  source: EventRegistrationSource;
  registeredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventPayment {
  id: string;
  registrationId: string;
  userId: string;
  amount: number;
  paymentMethod: EventPaymentMethod;
  paymentReference: string;
  paymentProofUrl: string;
  status: EventPaymentStatus;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
