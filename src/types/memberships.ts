import type {
  MEMBERSHIP_TYPE_NAMES,
  MEMBERSHIP_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  ZIMBABWE_UNIVERSITIES,
} from "@/lib/constants";
import type { ZimbabweProvince, EngineeringDiscipline } from "@/types/auth";

export type MembershipTypeName = (typeof MEMBERSHIP_TYPE_NAMES)[number];
export type MembershipStatus = (typeof MEMBERSHIP_STATUSES)[number];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export type ZimbabweUniversity = (typeof ZIMBABWE_UNIVERSITIES)[number];

export type { ZimbabweProvince, EngineeringDiscipline };

export interface MembershipType {
  id: string;
  name: MembershipTypeName;
  description: string;
  fee: number;
  eligibilityCriteria: string;
  requiredDocuments: string[];
  benefits: string[];
  terms: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipDocument {
  /** Matches one of the labels in MembershipType.requiredDocuments. */
  type: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: string;
  verified: boolean;
}

export interface ReviewNote {
  id: string;
  adminId: string;
  adminName: string;
  note: string;
  createdAt: string;
}

/**
 * All possible application form fields across every membership type and
 * wizard step. Which subset is relevant is determined by the selected
 * membership type at runtime, not by this (necessarily permissive) type.
 */
export interface MembershipApplicationData {
  // Step 2 — Individual personal info (Student / Graduate / Professional)
  fullLegalName?: string;
  dateOfBirth?: string;
  gender?: "Female" | "Non-binary" | "Prefer not to say";
  nationalId?: string;
  phone?: string;
  whatsapp?: string;
  province?: ZimbabweProvince;
  city?: string;
  physicalAddress?: string;
  linkedinUrl?: string;

  // Step 2 — Corporate
  companyName?: string;
  companyRegistrationNumber?: string;
  industry?: string;
  femaleEngineersCount?: number;
  contactPersonName?: string;
  contactPersonTitle?: string;
  contactPersonEmail?: string;
  contactPersonPhone?: string;
  companyAddress?: string;
  companyWebsite?: string;

  // Step 3 — Student
  institution?: ZimbabweUniversity;
  institutionOther?: string;
  faculty?: string;
  program?: string;
  yearOfStudy?: "1st" | "2nd" | "3rd" | "4th" | "5th" | "Postgraduate";
  studentIdNumber?: string;
  expectedGraduationYear?: number;
  engineeringDiscipline?: EngineeringDiscipline;
  workingPartTime?: boolean;
  personalStatement?: string;

  // Step 3 — Graduate
  degreeObtained?: string;
  yearOfGraduation?: number;
  employmentStatus?: "Employed" | "Self-Employed" | "Job Seeking" | "Further Studies";
  currentEmployer?: string;
  jobTitle?: string;
  yearsOfExperience?: number;
  professionalBio?: string;
  whatToGain?: string;

  // Step 3 — Professional
  highestQualification?: string;
  ezRegistrationNumber?: string;
  memberOfOtherBody?: boolean;
  otherBodyName?: string;
  areasOfExpertise?: string[];
  professionalAchievements?: string;
  whyJoinWiez?: string;
  willingToMentor?: boolean;

  // Step 3 — Corporate
  natureOfBusiness?: string;
  companyDisciplines?: EngineeringDiscipline[];
  missionStatement?: string;
  howSupportWomen?: string;
  yearsInOperation?: number;
  zimraRegistered?: boolean;
  annualTurnoverRange?: "Under $100K" | "$100K–$500K" | "$500K–$1M" | "Over $1M";
}

export interface Membership {
  id: string;
  userId: string;
  membershipTypeId: string;
  applicationReference: string | null;
  membershipNumber: string | null;
  status: MembershipStatus;
  applicationData: MembershipApplicationData | null;
  documents: MembershipDocument[] | null;
  reviewNotes: ReviewNote[];
  infoRequestMessage: string | null;
  reviewedBy: string | null;
  reviewedAt: Date | null;
  approvedBy: string | null;
  approvedAt: Date | null;
  rejectionReason: string | null;
  startDate: string | null;
  expiryDate: string | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipPayment {
  id: string;
  membershipId: string;
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  paymentReference: string;
  paymentProofUrl: string;
  paymentProofName: string;
  submittedAt: Date;
  status: PaymentStatus;
  verifiedBy: string | null;
  verifiedAt: Date | null;
  verificationNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface MembershipStatusHistoryEntry {
  id: string;
  membershipId: string;
  fromStatus: string | null;
  toStatus: string;
  changedBy: string;
  reason: string | null;
  createdAt: Date;
}
