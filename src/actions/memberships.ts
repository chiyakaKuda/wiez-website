"use server";

import { revalidatePath } from "next/cache";
import { and, desc, eq, gte, ilike, inArray, lte, ne, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  memberships,
  membershipTypes,
  membershipPayments,
  membershipStatusHistory,
  users,
} from "@/db/schema";
import { type ActionResult, errorMessage } from "@/lib/action-result";
import { getCurrentUser } from "@/lib/auth-utils";
import { logStatusChange } from "@/lib/membership-internal";
import {
  notifyMembershipApproved,
  notifyMembershipRejected,
  notifyInfoRequested,
  notifyMembershipPaymentVerified,
} from "@/lib/whatsapp/notifications";
import { SECTION_ROLES } from "@/lib/rbac";
import type {
  Membership,
  MembershipApplicationData,
  MembershipDocument,
  MembershipPayment,
  MembershipStatus,
  MembershipStatusHistoryEntry,
  MembershipType,
  MembershipTypeName,
  PaymentMethod,
  PaymentStatus,
  ReviewNote,
} from "@/types/memberships";

/** Statuses that block starting a new application — see schema notes. */
const BLOCKING_STATUSES: MembershipStatus[] = [
  "submitted",
  "under_review",
  "info_requested",
  "pending_payment",
  "payment_submitted",
  "payment_verified",
  "approved",
  "suspended",
];

/** Verifies the current session belongs to a membership-admin role and returns it. Never trusts a client-supplied admin id. */
async function requireMembershipAdmin(): Promise<{ id: string; name: string }> {
  const user = await getCurrentUser();
  const allowedRoles: readonly string[] = SECTION_ROLES.memberships;
  if (!user || !user.roles.some((role) => allowedRoles.includes(role))) {
    throw new Error("You do not have permission to perform this action.");
  }
  return { id: user.id, name: user.name };
}

// ---------------------------------------------------------------------------
// Internal utilities
// ---------------------------------------------------------------------------

/** Atomic via a Postgres sequence — nextval() never repeats, even under concurrent requests. */
export async function generateApplicationReference(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.execute<{ seq: string }>(
    sql`SELECT nextval('application_reference_seq') AS seq`
  );
  const seq = Number(result.rows[0]?.seq ?? 0);
  return `WIEZ-APP-${year}-${String(seq).padStart(4, "0")}`;
}

export async function generateMembershipNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await db.execute<{ seq: string }>(
    sql`SELECT nextval('membership_number_seq') AS seq`
  );
  const seq = Number(result.rows[0]?.seq ?? 0);
  return `WIEZ-${year}-${String(seq).padStart(4, "0")}`;
}

// ---------------------------------------------------------------------------
// Member-facing
// ---------------------------------------------------------------------------

export async function getMembershipTypes(): Promise<MembershipType[]> {
  const rows = await db.query.membershipTypes.findMany({
    where: eq(membershipTypes.isActive, true),
  });
  return rows as MembershipType[];
}

export async function getUserCurrentMembership(): Promise<Membership | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const membership = await db.query.memberships.findFirst({
    where: and(eq(memberships.userId, user.id), ne(memberships.status, "draft")),
    orderBy: desc(memberships.createdAt),
  });
  return (membership as Membership) ?? null;
}

/**
 * Same lookup as getUserCurrentMembership(), but by an explicit user id
 * rather than the web session — the WhatsApp flows have no web session to
 * read, since they authenticate via the whatsapp_sessions table instead.
 */
export async function getMembershipByUserId(userId: string): Promise<Membership | null> {
  const membership = await db.query.memberships.findFirst({
    where: and(eq(memberships.userId, userId), ne(memberships.status, "draft")),
    orderBy: desc(memberships.createdAt),
  });
  return (membership as Membership) ?? null;
}

export async function getUserDraftApplication(): Promise<Membership | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const draft = await db.query.memberships.findFirst({
    where: and(eq(memberships.userId, user.id), eq(memberships.status, "draft")),
    orderBy: desc(memberships.createdAt),
  });
  return (draft as Membership) ?? null;
}

/** A user may only have one active or pending application at a time. */
export async function getUserActiveOrPendingMembership(): Promise<Membership | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const existing = await db.query.memberships.findFirst({
    where: and(eq(memberships.userId, user.id), inArray(memberships.status, BLOCKING_STATUSES)),
  });
  return (existing as Membership) ?? null;
}

export async function saveDraftApplication(
  membershipTypeId: string,
  data: Partial<MembershipApplicationData>,
  documents?: MembershipDocument[]
): Promise<ActionResult<{ membershipId: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be signed in to apply." };

    const draft = await db.query.memberships.findFirst({
      where: and(eq(memberships.userId, user.id), eq(memberships.status, "draft")),
    });

    if (draft) {
      await db
        .update(memberships)
        .set({
          membershipTypeId,
          applicationData: { ...(draft.applicationData as MembershipApplicationData | null), ...data },
          documents: documents ?? draft.documents,
          updatedAt: new Date(),
        })
        .where(eq(memberships.id, draft.id));
      return { success: true, data: { membershipId: draft.id } };
    }

    const blocking = await db.query.memberships.findFirst({
      where: and(eq(memberships.userId, user.id), inArray(memberships.status, BLOCKING_STATUSES)),
    });
    if (blocking) {
      return {
        success: false,
        error: "You already have an active or pending membership application.",
      };
    }

    const [created] = await db
      .insert(memberships)
      .values({
        userId: user.id,
        membershipTypeId,
        status: "draft",
        applicationData: data,
        documents: documents ?? [],
      })
      .returning({ id: memberships.id });

    return { success: true, data: { membershipId: created.id } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function submitMembershipApplication(
  data: MembershipApplicationData
): Promise<ActionResult<{ membershipId: string; applicationReference: string }>> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be signed in to apply." };

    const draft = await db.query.memberships.findFirst({
      where: and(eq(memberships.userId, user.id), eq(memberships.status, "draft")),
    });
    if (!draft) {
      return {
        success: false,
        error: "No draft application found. Please start your application again.",
      };
    }

    const membershipType = await db.query.membershipTypes.findFirst({
      where: eq(membershipTypes.id, draft.membershipTypeId),
    });
    if (!membershipType) {
      return { success: false, error: "Selected membership type could not be found." };
    }

    const requiredLabels = membershipType.requiredDocuments.filter(
      (label) => !label.includes("(Optional)")
    );
    const uploadedTypes = new Set((draft.documents ?? []).map((doc) => doc.type));
    const missing = requiredLabels.filter((label) => !uploadedTypes.has(label));
    if (missing.length > 0) {
      return {
        success: false,
        error: `Please upload all required documents before submitting: ${missing.join(", ")}.`,
      };
    }

    const applicationReference = await generateApplicationReference();

    await db
      .update(memberships)
      .set({
        applicationData: { ...(draft.applicationData as MembershipApplicationData | null), ...data },
        applicationReference,
        status: "submitted",
        submittedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, draft.id));

    await logStatusChange(draft.id, "draft", "submitted", user.id);
    revalidatePath("/dashboard/membership");

    return { success: true, data: { membershipId: draft.id, applicationReference } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function submitPaymentProof(
  membershipId: string,
  data: {
    paymentMethod: PaymentMethod;
    paymentReference: string;
    paymentProofUrl: string;
    paymentProofName: string;
  }
): Promise<ActionResult> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "You must be signed in." };

    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
      with: { membershipType: true },
    });
    if (!membership) return { success: false, error: "Membership application not found." };
    if (membership.userId !== user.id) {
      return { success: false, error: "You do not have access to this application." };
    }
    if (membership.status !== "pending_payment") {
      return { success: false, error: "This application is not awaiting payment." };
    }

    await db.insert(membershipPayments).values({
      membershipId,
      userId: user.id,
      amount: membership.membershipType.fee,
      paymentMethod: data.paymentMethod,
      paymentReference: data.paymentReference,
      paymentProofUrl: data.paymentProofUrl,
      paymentProofName: data.paymentProofName,
    });

    await db
      .update(memberships)
      .set({ status: "payment_submitted", updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, "pending_payment", "payment_submitted", user.id);

    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

// ---------------------------------------------------------------------------
// Admin-facing
// ---------------------------------------------------------------------------

export interface MembershipFilters {
  status?: MembershipStatus | "all";
  search?: string;
  type?: MembershipTypeName | "all";
  province?: string | "all";
  dateFrom?: string;
  dateTo?: string;
}

export interface MembershipListItem {
  id: string;
  applicationReference: string | null;
  membershipNumber: string | null;
  status: MembershipStatus;
  submittedAt: Date | null;
  createdAt: Date;
  applicantName: string;
  applicantEmail: string;
  membershipTypeName: MembershipTypeName;
  province: string | null;
  latestPaymentStatus: PaymentStatus | null;
}

export async function getAllMemberships(
  filters: MembershipFilters = {}
): Promise<MembershipListItem[]> {
  const conditions = [];

  if (filters.status && filters.status !== "all") {
    conditions.push(eq(memberships.status, filters.status));
  }
  if (filters.type && filters.type !== "all") {
    conditions.push(eq(membershipTypes.name, filters.type));
  }
  if (filters.province && filters.province !== "all") {
    conditions.push(sql`${memberships.applicationData}->>'province' = ${filters.province}`);
  }
  if (filters.search) {
    const term = `%${filters.search}%`;
    conditions.push(
      or(
        ilike(users.name, term),
        ilike(users.email, term),
        ilike(memberships.applicationReference, term)
      )
    );
  }
  if (filters.dateFrom) {
    conditions.push(gte(memberships.submittedAt, new Date(filters.dateFrom)));
  }
  if (filters.dateTo) {
    conditions.push(lte(memberships.submittedAt, new Date(filters.dateTo)));
  }

  const rows = await db
    .select({
      id: memberships.id,
      applicationReference: memberships.applicationReference,
      membershipNumber: memberships.membershipNumber,
      status: memberships.status,
      submittedAt: memberships.submittedAt,
      createdAt: memberships.createdAt,
      applicationData: memberships.applicationData,
      applicantName: users.name,
      applicantEmail: users.email,
      membershipTypeName: membershipTypes.name,
    })
    .from(memberships)
    .innerJoin(users, eq(memberships.userId, users.id))
    .innerJoin(membershipTypes, eq(memberships.membershipTypeId, membershipTypes.id))
    .where(and(ne(memberships.status, "draft"), ...conditions))
    .orderBy(desc(memberships.createdAt));

  if (rows.length === 0) return [];

  const membershipIds = rows.map((row) => row.id);
  const payments = await db
    .select()
    .from(membershipPayments)
    .where(inArray(membershipPayments.membershipId, membershipIds))
    .orderBy(desc(membershipPayments.createdAt));

  const latestPaymentByMembership = new Map<string, PaymentStatus>();
  for (const payment of payments) {
    if (!latestPaymentByMembership.has(payment.membershipId)) {
      latestPaymentByMembership.set(payment.membershipId, payment.status);
    }
  }

  return rows.map((row) => ({
    ...row,
    province: (row.applicationData as MembershipApplicationData | null)?.province ?? null,
    latestPaymentStatus: latestPaymentByMembership.get(row.id) ?? null,
  }));
}

export async function getPendingMembershipsCount(): Promise<number> {
  await requireMembershipAdmin();
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(memberships)
    .where(or(eq(memberships.status, "submitted"), eq(memberships.status, "under_review")));
  return row.count;
}

export interface MembershipDetail extends Membership {
  applicant: { id: string; name: string; email: string; phone: string | null; image: string | null };
  membershipType: MembershipType;
  payments: MembershipPayment[];
  statusHistory: (MembershipStatusHistoryEntry & { changedByName: string })[];
}

export async function getMembershipById(id: string): Promise<MembershipDetail | null> {
  const membership = await db.query.memberships.findFirst({
    where: eq(memberships.id, id),
    with: {
      user: true,
      membershipType: true,
      payments: { orderBy: desc(membershipPayments.createdAt) },
      statusHistory: {
        orderBy: desc(membershipStatusHistory.createdAt),
        with: { changedByUser: true },
      },
    },
  });
  if (!membership) return null;

  const { user, statusHistory, ...rest } = membership;

  return {
    ...rest,
    applicant: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      image: user.image,
    },
    statusHistory: statusHistory.map(({ changedByUser, ...entry }) => ({
      ...entry,
      changedByName: changedByUser?.name ?? "System",
    })),
  } as MembershipDetail;
}

export async function markAsUnderReview(membershipId: string): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    const allowedFrom: MembershipStatus[] = ["submitted", "info_requested"];
    if (!allowedFrom.includes(membership.status)) {
      return {
        success: false,
        error: `Cannot mark as under review from status "${membership.status}".`,
      };
    }

    await db
      .update(memberships)
      .set({
        status: "under_review",
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, membership.status, "under_review", admin.id);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function requestMoreInformation(
  membershipId: string,
  message: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    await db
      .update(memberships)
      .set({
        status: "info_requested",
        infoRequestMessage: message,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, membership.status, "info_requested", admin.id, message);
    await notifyInfoRequested(membershipId);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function approveMembership(
  membershipId: string,
  note?: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };
    if (membership.userId === admin.id) {
      return { success: false, error: "You cannot approve your own membership application." };
    }

    const allowedFrom: MembershipStatus[] = ["submitted", "under_review", "info_requested"];
    if (!allowedFrom.includes(membership.status)) {
      return { success: false, error: `Cannot approve from status "${membership.status}".` };
    }

    const updatedNotes: ReviewNote[] = note
      ? [
          ...membership.reviewNotes,
          { id: crypto.randomUUID(), adminId: admin.id, adminName: admin.name, note, createdAt: new Date().toISOString() },
        ]
      : membership.reviewNotes;

    await db
      .update(memberships)
      .set({
        status: "pending_payment",
        approvedBy: admin.id,
        approvedAt: new Date(),
        reviewNotes: updatedNotes,
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, membership.status, "pending_payment", admin.id, note);
    await notifyMembershipApproved(membershipId);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function rejectMembership(
  membershipId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    await db
      .update(memberships)
      .set({
        status: "rejected",
        rejectionReason: reason,
        reviewedBy: admin.id,
        reviewedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, membership.status, "rejected", admin.id, reason);
    await notifyMembershipRejected(membershipId);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function verifyPayment(
  membershipId: string,
  note?: string
): Promise<ActionResult<{ membershipNumber: string }>> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };
    if (membership.status !== "payment_submitted") {
      return { success: false, error: "This membership is not awaiting payment verification." };
    }

    const latestPayment = await db.query.membershipPayments.findFirst({
      where: eq(membershipPayments.membershipId, membershipId),
      orderBy: desc(membershipPayments.createdAt),
    });
    if (!latestPayment) return { success: false, error: "No payment record found for this membership." };

    await db
      .update(membershipPayments)
      .set({
        status: "verified",
        verifiedBy: admin.id,
        verifiedAt: new Date(),
        verificationNotes: note,
        updatedAt: new Date(),
      })
      .where(eq(membershipPayments.id, latestPayment.id));

    await logStatusChange(membershipId, "payment_submitted", "payment_verified", admin.id, note);

    const membershipNumber = await generateMembershipNumber();
    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    await db
      .update(memberships)
      .set({
        status: "approved",
        membershipNumber,
        startDate: startDate.toISOString().slice(0, 10),
        expiryDate: expiryDate.toISOString().slice(0, 10),
        updatedAt: new Date(),
      })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, "payment_verified", "approved", admin.id);
    await notifyMembershipPaymentVerified(membershipId);

    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true, data: { membershipNumber } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function rejectPayment(
  membershipId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    const latestPayment = await db.query.membershipPayments.findFirst({
      where: eq(membershipPayments.membershipId, membershipId),
      orderBy: desc(membershipPayments.createdAt),
    });
    if (latestPayment) {
      await db
        .update(membershipPayments)
        .set({
          status: "rejected",
          verifiedBy: admin.id,
          verifiedAt: new Date(),
          verificationNotes: reason,
          updatedAt: new Date(),
        })
        .where(eq(membershipPayments.id, latestPayment.id));
    }

    await db
      .update(memberships)
      .set({ status: "pending_payment", updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, "payment_submitted", "pending_payment", admin.id, reason);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function addReviewNote(membershipId: string, note: string): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    const newNote: ReviewNote = {
      id: crypto.randomUUID(),
      adminId: admin.id,
      adminName: admin.name,
      note,
      createdAt: new Date().toISOString(),
    };

    await db
      .update(memberships)
      .set({ reviewNotes: [...membership.reviewNotes, newNote], updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    revalidatePath(`/admin/memberships/${membershipId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function verifyDocument(
  membershipId: string,
  documentType: string
): Promise<ActionResult> {
  try {
    await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };

    const documents = (membership.documents ?? []).map((doc) =>
      doc.type === documentType ? { ...doc, verified: true } : doc
    );

    await db
      .update(memberships)
      .set({ documents, updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    revalidatePath(`/admin/memberships/${membershipId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function suspendMembership(
  membershipId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };
    if (membership.status !== "approved") {
      return { success: false, error: "Only active memberships can be suspended." };
    }

    await db
      .update(memberships)
      .set({ status: "suspended", rejectionReason: reason, updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, "approved", "suspended", admin.id, reason);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function revokeMembership(
  membershipId: string,
  reason: string
): Promise<ActionResult> {
  try {
    const admin = await requireMembershipAdmin();
    const membership = await db.query.memberships.findFirst({
      where: eq(memberships.id, membershipId),
    });
    if (!membership) return { success: false, error: "Application not found." };
    if (membership.status !== "approved" && membership.status !== "suspended") {
      return { success: false, error: "Only active or suspended memberships can be revoked." };
    }

    await db
      .update(memberships)
      .set({ status: "revoked", rejectionReason: reason, updatedAt: new Date() })
      .where(eq(memberships.id, membershipId));

    await logStatusChange(membershipId, membership.status, "revoked", admin.id, reason);
    revalidatePath("/admin/memberships");
    revalidatePath(`/admin/memberships/${membershipId}`);
    revalidatePath("/dashboard/membership");
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function exportMemberships(filters: MembershipFilters = {}): Promise<string> {
  await requireMembershipAdmin();
  const rows = await getAllMemberships(filters);

  const header = [
    "Reference",
    "Membership Number",
    "Applicant",
    "Email",
    "Type",
    "Status",
    "Submitted",
    "Payment Status",
  ];
  const lines = [header.join(",")];

  for (const row of rows) {
    lines.push(
      [
        row.applicationReference ?? "",
        row.membershipNumber ?? "",
        csvEscape(row.applicantName),
        row.applicantEmail,
        row.membershipTypeName,
        row.status,
        row.submittedAt ? row.submittedAt.toISOString().slice(0, 10) : "",
        row.latestPaymentStatus ?? "",
      ].join(",")
    );
  }

  return lines.join("\n");
}
