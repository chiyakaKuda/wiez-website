import type { MembershipTypeName } from "@/types/memberships";
import type { WhatsAppDocumentType } from "@/types/whatsapp";

export interface RequiredDoc {
  key: WhatsAppDocumentType;
  /** Must exactly match membership_types.requiredDocuments labels (including "(Optional)") so web and WhatsApp data line up. */
  label: string;
}

export const REQUIRED_DOCS: Record<MembershipTypeName, RequiredDoc[]> = {
  Student: [
    { key: "student_id", label: "Student ID" },
    { key: "proof_of_enrollment", label: "Proof of Enrollment" },
    { key: "cv", label: "CV" },
    { key: "passport_photo", label: "Passport Photo" },
  ],
  Graduate: [
    { key: "degree_certificate", label: "Degree Certificate" },
    { key: "cv", label: "CV" },
    { key: "professional_headshot", label: "Professional Headshot" },
    { key: "transcript", label: "Transcript (Optional)" },
  ],
  Professional: [
    { key: "degree_certificate", label: "Degree Certificate" },
    { key: "cv", label: "CV" },
    { key: "professional_headshot", label: "Professional Headshot" },
    { key: "proof_of_employment", label: "Proof of Employment" },
    { key: "engineering_council", label: "Engineering Council Registration (Optional)" },
  ],
  Corporate: [
    { key: "certificate_of_incorporation", label: "Certificate of Incorporation" },
    { key: "company_profile", label: "Company Profile" },
    { key: "tax_clearance", label: "Tax Clearance (Optional)" },
    { key: "letter_of_intent", label: "Letter of Intent" },
  ],
};

export function isOptionalDocLabel(label: string): boolean {
  return label.includes("(Optional)");
}

export const AREAS_OF_EXPERTISE = [
  "Project Management",
  "Research",
  "Design",
  "IT & Software",
  "Environmental",
  "Manufacturing",
  "Construction",
  "Other",
];

export const MEMBERSHIP_FEES: Record<MembershipTypeName, number> = {
  Student: 10,
  Graduate: 25,
  Professional: 50,
  Corporate: 200,
};
