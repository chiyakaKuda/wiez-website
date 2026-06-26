import * as z from "zod";
import {
  ZIMBABWE_PROVINCES,
  ENGINEERING_DISCIPLINES,
  ZIMBABWE_UNIVERSITIES,
  MEMBERSHIP_TYPE_NAMES,
} from "@/lib/constants";

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function wordCountField(min: number, max: number, label: string) {
  return z.string().refine(
    (value) => {
      const count = wordCount(value);
      return count >= min && count <= max;
    },
    { error: `${label} must be between ${min} and ${max} words.` }
  );
}

const institutionRefinement = <T extends { institution: string; institutionOther?: string }>(
  data: T,
  ctx: z.RefinementCtx
) => {
  if (data.institution === "Other" && !data.institutionOther?.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Please specify your institution.",
      path: ["institutionOther"],
    });
  }
};

export const step1Schema = z.object({
  membershipTypeName: z.enum(MEMBERSHIP_TYPE_NAMES, {
    error: "Please select a membership type.",
  }),
  agreedToTerms: z.literal(true, {
    error: "You must confirm you understand the membership terms to continue.",
  }),
});
export type Step1Values = z.infer<typeof step1Schema>;

export const individualPersonalSchema = z.object({
  fullLegalName: z.string().min(2, "Full legal name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  gender: z.enum(["Female", "Non-binary", "Prefer not to say"], {
    error: "Please select an option.",
  }),
  nationalId: z.string().min(1, "National ID number is required."),
  phone: z.string().min(9, "Enter a valid phone number."),
  whatsapp: z.string().optional(),
  province: z.enum(ZIMBABWE_PROVINCES, { error: "Please select a province." }),
  city: z.string().min(1, "City/Town is required."),
  physicalAddress: z.string().min(1, "Physical address is required."),
  linkedinUrl: z.string().optional(),
});
export type IndividualPersonalValues = z.infer<typeof individualPersonalSchema>;

export const corporatePersonalSchema = z.object({
  companyName: z.string().min(1, "Company name is required."),
  companyRegistrationNumber: z.string().min(1, "Company registration number is required."),
  industry: z.string().min(1, "Industry/Sector is required."),
  femaleEngineersCount: z.coerce.number().min(0, "Enter a number of 0 or more."),
  contactPersonName: z.string().min(1, "Contact person name is required."),
  contactPersonTitle: z.string().min(1, "Contact person job title is required."),
  contactPersonEmail: z.email("Enter a valid email address."),
  contactPersonPhone: z.string().min(9, "Enter a valid phone number."),
  companyAddress: z.string().min(1, "Company physical address is required."),
  companyWebsite: z.string().optional(),
});
export type CorporatePersonalValues = z.infer<typeof corporatePersonalSchema>;

export const studentProfessionalSchema = z
  .object({
    institution: z.enum(ZIMBABWE_UNIVERSITIES, { error: "Please select your institution." }),
    institutionOther: z.string().optional(),
    faculty: z.string().min(1, "Faculty/School is required."),
    program: z.string().min(1, "Program/Degree is required."),
    yearOfStudy: z.enum(["1st", "2nd", "3rd", "4th", "5th", "Postgraduate"], {
      error: "Please select your year of study.",
    }),
    studentIdNumber: z.string().min(1, "Student ID number is required."),
    expectedGraduationYear: z.coerce
      .number()
      .min(new Date().getFullYear(), "Enter a valid future graduation year."),
    engineeringDiscipline: z.enum(ENGINEERING_DISCIPLINES, {
      error: "Please select an engineering discipline.",
    }),
    workingPartTime: z.boolean(),
    personalStatement: wordCountField(
      100,
      500,
      "Tell us about your engineering journey and why you want to join WiEZ"
    ),
  })
  .superRefine(institutionRefinement);
export type StudentProfessionalValues = z.infer<typeof studentProfessionalSchema>;

export const graduateProfessionalSchema = z
  .object({
    institution: z.enum(ZIMBABWE_UNIVERSITIES, { error: "Please select your institution." }),
    institutionOther: z.string().optional(),
    degreeObtained: z.string().min(1, "Degree obtained is required."),
    engineeringDiscipline: z.enum(ENGINEERING_DISCIPLINES, {
      error: "Please select an engineering discipline.",
    }),
    yearOfGraduation: z.coerce
      .number()
      .min(1980, "Enter a valid year.")
      .max(new Date().getFullYear(), "Year of graduation cannot be in the future."),
    employmentStatus: z.enum(
      ["Employed", "Self-Employed", "Job Seeking", "Further Studies"],
      { error: "Please select your employment status." }
    ),
    currentEmployer: z.string().optional(),
    jobTitle: z.string().optional(),
    yearsOfExperience: z.coerce.number().min(0, "Enter a number of 0 or more."),
    professionalBio: wordCountField(100, 500, "Your professional bio"),
    whatToGain: wordCountField(50, 1000, "This field"),
  })
  .superRefine(institutionRefinement);
export type GraduateProfessionalValues = z.infer<typeof graduateProfessionalSchema>;

export const professionalProfessionalSchema = z
  .object({
    engineeringDiscipline: z.enum(ENGINEERING_DISCIPLINES, {
      error: "Please select an engineering discipline.",
    }),
    highestQualification: z.string().min(1, "Highest qualification is required."),
    institution: z.enum(ZIMBABWE_UNIVERSITIES, { error: "Please select your institution." }),
    institutionOther: z.string().optional(),
    yearOfGraduation: z.coerce
      .number()
      .min(1980, "Enter a valid year.")
      .max(new Date().getFullYear(), "Year of graduation cannot be in the future."),
    currentEmployer: z.string().min(1, "Current employer is required."),
    jobTitle: z.string().min(1, "Job title is required."),
    yearsOfExperience: z.coerce
      .number()
      .min(5, "Professional membership requires 5 or more years of experience."),
    ezRegistrationNumber: z.string().optional(),
    memberOfOtherBody: z.boolean(),
    otherBodyName: z.string().optional(),
    areasOfExpertise: z.array(z.string()).min(1, "Select at least one area of expertise."),
    professionalAchievements: z.string().optional(),
    whyJoinWiez: wordCountField(150, 1000, "This field"),
    willingToMentor: z.boolean(),
  })
  .superRefine(institutionRefinement);
export type ProfessionalProfessionalValues = z.infer<typeof professionalProfessionalSchema>;

export const corporateProfessionalSchema = z.object({
  natureOfBusiness: z.string().min(1, "Nature of business is required."),
  companyDisciplines: z
    .array(z.enum(ENGINEERING_DISCIPLINES))
    .min(1, "Select at least one engineering discipline."),
  missionStatement: z.string().min(1, "Company mission statement is required."),
  howSupportWomen: wordCountField(100, 1000, "This field"),
  yearsInOperation: z.coerce.number().min(0, "Enter a number of 0 or more."),
  zimraRegistered: z.boolean(),
  annualTurnoverRange: z
    .enum(["Under $100K", "$100K–$500K", "$500K–$1M", "Over $1M"])
    .optional(),
});
export type CorporateProfessionalValues = z.infer<typeof corporateProfessionalSchema>;

export const step5Schema = z.object({
  declarationTruthful: z.literal(true, {
    error: "You must confirm this declaration to submit your application.",
  }),
  declarationTerms: z.literal(true, {
    error: "You must agree to the WiEZ Membership Terms and Conditions.",
  }),
});
export type Step5Values = z.infer<typeof step5Schema>;
