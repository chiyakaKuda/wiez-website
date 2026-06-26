export const ZIMBABWE_PROVINCES = [
  "Harare",
  "Bulawayo",
  "Manicaland",
  "Mashonaland Central",
  "Mashonaland East",
  "Mashonaland West",
  "Masvingo",
  "Matabeleland North",
  "Matabeleland South",
  "Midlands",
] as const;

export const ENGINEERING_DISCIPLINES = [
  "Civil",
  "Electrical",
  "Mechanical",
  "Chemical",
  "Mining",
  "Environmental",
  "Computer",
  "Structural",
  "Biomedical",
  "Industrial",
  "Agricultural",
  "Other",
] as const;

export const USER_ROLES = [
  "super_admin",
  "org_admin",
  "membership_officer",
  "events_manager",
  "content_editor",
  "member",
] as const;

export const MEMBERSHIP_TYPE_NAMES = [
  "Student",
  "Graduate",
  "Professional",
  "Corporate",
] as const;

export const MEMBERSHIP_STATUSES = [
  "draft",
  "submitted",
  "under_review",
  "info_requested",
  "pending_payment",
  "payment_submitted",
  "payment_verified",
  "approved",
  "rejected",
  "suspended",
  // Not in the original spec list, but added because the spec's own terms
  // (6.5) and admin actions explicitly distinguish a permanent "Revoke"
  // action from a temporary "Suspend" one — they can't share one status.
  "revoked",
  "expired",
] as const;

export const PAYMENT_METHODS = ["ecocash", "innbucks", "bank_transfer"] as const;

export const PAYMENT_STATUSES = ["submitted", "verified", "rejected"] as const;

export const ZIMBABWE_UNIVERSITIES = [
  "University of Zimbabwe (UZ)",
  "Harare Institute of Technology (HIT)",
  "National University of Science and Technology (NUST)",
  "Midlands State University (MSU)",
  "Zimbabwe Open University (ZOU)",
  "Chinhoyi University of Technology (CUT)",
  "Africa University",
  "Lupane State University (LSU)",
  "Other",
] as const;

// --- WhatsApp chatbot ---

export const WHATSAPP_FLOWS = [
  "registration",
  "event_registration",
  "status_check",
  "enquiry",
  "login",
] as const;

export const WHATSAPP_DOCUMENT_TYPES = [
  "student_id",
  "proof_of_enrollment",
  "cv",
  "passport_photo",
  "degree_certificate",
  "transcript",
  "proof_of_employment",
  "engineering_council",
  "professional_headshot",
  "certificate_of_incorporation",
  "company_profile",
  "tax_clearance",
  "letter_of_intent",
  "payment_proof",
] as const;

export const WHATSAPP_DOCUMENT_STATUSES = ["pending", "uploaded", "failed"] as const;

export const ENQUIRY_CATEGORIES = [
  "membership",
  "events",
  "payment",
  "technical",
  "other",
] as const;

export const ENQUIRY_STATUSES = ["open", "resolved"] as const;

// --- Events ---

export const EVENT_TYPES = ["free", "paid", "member_only", "corporate_sponsored"] as const;

export const EVENT_STATUSES = ["draft", "published", "cancelled", "completed"] as const;

export const EVENT_REGISTRATION_STATUSES = [
  "pending_review",
  "confirmed",
  "rejected",
  "cancelled",
  "attended",
] as const;

export const EVENT_REGISTRATION_PAYMENT_STATUSES = [
  "not_required",
  "pending",
  "submitted",
  "verified",
] as const;

export const EVENT_REGISTRATION_SOURCES = ["web", "whatsapp"] as const;
