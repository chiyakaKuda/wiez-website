import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { handleUniversalCommands } from "@/lib/whatsapp/common";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import type { MembershipTypeName } from "@/types/memberships";
import type { WhatsAppSession } from "@/types/whatsapp";

import {
  sendMembershipTypeSelect,
  handleMembershipTypeSelect,
  handleTermsAgreement,
  handleAccountEmail,
  handleAccountPassword,
  handleAccountConfirmPassword,
} from "@/lib/whatsapp/flows/registration/common-steps";
import {
  startIndividualPersonalSteps,
  startCorporatePersonalSteps,
  handlePersonalName,
  handlePersonalDob,
  handlePersonalNationalId,
  handlePersonalPhone,
  handlePersonalProvince,
  handlePersonalCity,
  handlePersonalLinkedin,
  handleCorporateCompanyName,
  handleCorporateRegNumber,
  handleCorporateIndustry,
  handleCorporateFemaleEngineersCount,
  handleCorporateContactName,
  handleCorporateContactTitle,
  handleCorporateContactEmail,
  handleCorporateContactPhone,
  handleCorporateAddress,
  handleCorporateWebsite,
} from "@/lib/whatsapp/flows/registration/personal-steps";
import {
  handleUniInstitution,
  handleUniInstitutionOther,
  handleUniProgram,
  handleUniYear,
  handleUniStudentId,
  handleUniGradYear,
  handleDiscipline,
  handlePersonalStatement,
  handleGradInstitution,
  handleGradInstitutionOther,
  handleGradDegree,
  handleGradDiscipline,
  handleGradYear,
  handleGradEmploymentStatus,
  handleGradEmployer,
  handleGradJobTitle,
  handleGradExperience,
  handleGradBio,
  handleGradWiezGoals,
  handleProDiscipline,
  handleProQualification,
  handleProInstitution,
  handleProGradYear,
  handleProEmployer,
  handleProJobTitle,
  handleProExperience,
  handleProEczNumber,
  handleProOtherBody,
  handleProOtherBodyName,
  handleProExpertise,
  handleProAchievements,
  handleProWhyWiez,
  handleProMentor,
  handleCorpNature,
  handleCorpDisciplines,
  handleCorpMission,
  handleCorpSupportWomen,
  handleCorpYears,
  handleCorpZimra,
} from "@/lib/whatsapp/flows/registration/professional-steps";
import {
  handleDocumentStep,
  handleReviewConfirmReady,
} from "@/lib/whatsapp/flows/registration/document-steps";
import { handleReviewConfirm } from "@/lib/whatsapp/flows/registration/review-step";

export async function startRegistrationFlow(to: string, session: WhatsAppSession): Promise<void> {
  if (session.isAuthenticated) {
    await WhatsAppAPI.sendText(
      to,
      "You're already logged in. Reply *STATUS* to check your membership, or *MENU* for other options."
    );
    return;
  }
  await sendMembershipTypeSelect(to);
}

export async function handleRegistrationFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (await handleUniversalCommands(to, parsed)) return;

  const step = session.currentStep ?? "";
  const membershipType = session.flowData.membershipType as MembershipTypeName | undefined;

  if (step.startsWith("doc_")) {
    await handleDocumentStep(to, session, parsed);
    return;
  }

  switch (step) {
    // Common
    case "membership_type_select":
      await handleMembershipTypeSelect(to, parsed);
      return;
    case "terms_agreement":
      await handleTermsAgreement(to, parsed);
      return;
    case "account_email":
      await handleAccountEmail(to, parsed);
      return;
    case "account_password":
      await handleAccountPassword(to, parsed);
      return;
    case "account_confirm_password":
      await handleAccountConfirmPassword(to, session, parsed, async () => {
        if (membershipType === "Corporate") {
          await startCorporatePersonalSteps(to);
        } else {
          await startIndividualPersonalSteps(to);
        }
      });
      return;

    // Individual personal info
    case "personal_name":
      await handlePersonalName(to, parsed);
      return;
    case "personal_dob":
      await handlePersonalDob(to, parsed);
      return;
    case "personal_national_id":
      await handlePersonalNationalId(to, parsed);
      return;
    case "personal_phone":
      await handlePersonalPhone(to, parsed);
      return;
    case "personal_province":
      await handlePersonalProvince(to, parsed);
      return;
    case "personal_city":
      await handlePersonalCity(to, parsed);
      return;
    case "personal_linkedin":
      await handlePersonalLinkedin(to, parsed, membershipType!);
      return;

    // Corporate personal info
    case "corporate_company_name":
      await handleCorporateCompanyName(to, parsed);
      return;
    case "corporate_reg_number":
      await handleCorporateRegNumber(to, parsed);
      return;
    case "corporate_industry":
      await handleCorporateIndustry(to, parsed);
      return;
    case "corporate_female_engineers_count":
      await handleCorporateFemaleEngineersCount(to, parsed);
      return;
    case "corporate_contact_name":
      await handleCorporateContactName(to, parsed);
      return;
    case "corporate_contact_title":
      await handleCorporateContactTitle(to, parsed);
      return;
    case "corporate_contact_email":
      await handleCorporateContactEmail(to, parsed);
      return;
    case "corporate_contact_phone":
      await handleCorporateContactPhone(to, parsed);
      return;
    case "corporate_address":
      await handleCorporateAddress(to, parsed);
      return;
    case "corporate_website":
      await handleCorporateWebsite(to, parsed);
      return;

    // Student professional info
    case "uni_institution":
      await handleUniInstitution(to, parsed);
      return;
    case "uni_institution_other":
      await handleUniInstitutionOther(to, parsed);
      return;
    case "uni_program":
      await handleUniProgram(to, parsed);
      return;
    case "uni_year":
      await handleUniYear(to, parsed);
      return;
    case "uni_student_id":
      await handleUniStudentId(to, parsed);
      return;
    case "uni_grad_year":
      await handleUniGradYear(to, parsed);
      return;
    case "discipline":
      await handleDiscipline(to, parsed);
      return;
    case "personal_statement":
      await handlePersonalStatement(to, parsed, membershipType!);
      return;

    // Graduate professional info
    case "grad_institution":
      await handleGradInstitution(to, parsed);
      return;
    case "grad_institution_other":
      await handleGradInstitutionOther(to, parsed);
      return;
    case "grad_degree":
      await handleGradDegree(to, parsed);
      return;
    case "grad_discipline":
      await handleGradDiscipline(to, parsed);
      return;
    case "grad_year":
      await handleGradYear(to, parsed);
      return;
    case "grad_employment_status":
      await handleGradEmploymentStatus(to, parsed);
      return;
    case "grad_employer":
      await handleGradEmployer(to, parsed);
      return;
    case "grad_job_title":
      await handleGradJobTitle(to, parsed);
      return;
    case "grad_experience":
      await handleGradExperience(to, parsed);
      return;
    case "grad_bio":
      await handleGradBio(to, parsed);
      return;
    case "grad_wiez_goals":
      await handleGradWiezGoals(to, parsed, membershipType!);
      return;

    // Professional professional info
    case "pro_discipline":
      await handleProDiscipline(to, parsed);
      return;
    case "pro_qualification":
      await handleProQualification(to, parsed);
      return;
    case "pro_institution":
      await handleProInstitution(to, parsed);
      return;
    case "pro_grad_year":
      await handleProGradYear(to, parsed);
      return;
    case "pro_employer":
      await handleProEmployer(to, parsed);
      return;
    case "pro_job_title":
      await handleProJobTitle(to, parsed);
      return;
    case "pro_experience":
      await handleProExperience(to, parsed);
      return;
    case "pro_ecz_number":
      await handleProEczNumber(to, parsed);
      return;
    case "pro_other_body":
      await handleProOtherBody(to, parsed);
      return;
    case "pro_other_body_name":
      await handleProOtherBodyName(to, parsed);
      return;
    case "pro_expertise":
      await handleProExpertise(to, parsed);
      return;
    case "pro_achievements":
      await handleProAchievements(to, parsed);
      return;
    case "pro_why_wiez":
      await handleProWhyWiez(to, parsed);
      return;
    case "pro_mentor":
      await handleProMentor(to, parsed, membershipType!);
      return;

    // Corporate professional info
    case "corp_nature":
      await handleCorpNature(to, parsed);
      return;
    case "corp_disciplines":
      await handleCorpDisciplines(to, parsed);
      return;
    case "corp_mission":
      await handleCorpMission(to, parsed);
      return;
    case "corp_support_women":
      await handleCorpSupportWomen(to, parsed);
      return;
    case "corp_years":
      await handleCorpYears(to, parsed);
      return;
    case "corp_zimra":
      await handleCorpZimra(to, parsed);
      return;

    // Documents wrap-up + review
    case "review_confirm_ready":
      await handleReviewConfirmReady(to, session, parsed);
      return;
    case "review_confirm":
      await handleReviewConfirm(to, session, parsed);
      return;
  }
}
