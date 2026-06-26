import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep } from "@/lib/whatsapp/session";
import { requireText, isSkip, isSame } from "@/lib/whatsapp/common";
import { isValidZimbabwePhone, isValidNationalId, isValidEmail, formatToE164 } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { ZIMBABWE_PROVINCES } from "@/lib/constants";
import type { MembershipTypeName } from "@/types/memberships";
import { goToFirstProfessionalStep } from "@/lib/whatsapp/flows/registration/professional-steps";

const PROVINCE_BY_REPLY: Record<string, string> = Object.fromEntries(
  ZIMBABWE_PROVINCES.map((province) => [`PROVINCE_${province.toUpperCase().replace(/\s+/g, "_")}`, province])
);

export async function startIndividualPersonalSteps(to: string): Promise<void> {
  await setFlowStep(to, "registration", "personal_name");
  await WhatsAppAPI.sendText(to, "👤 What is your full legal name?\n\n(As it appears on your National ID)");
}

export async function startCorporatePersonalSteps(to: string): Promise<void> {
  await setFlowStep(to, "registration", "corporate_company_name");
  await WhatsAppAPI.sendText(to, "🏢 What is your company name?");
}

// --- Individual ---

export async function handlePersonalName(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What is your full legal name?");
  if (!text) return;
  await saveFlowData(to, "fullLegalName", text);
  await setFlowStep(to, "registration", "personal_dob");
  await WhatsAppAPI.sendText(to, "📅 Date of birth?\n\n(Format: DD/MM/YYYY)");
}

export async function handlePersonalDob(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Date of birth? (Format: DD/MM/YYYY)");
  if (!text) return;

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    await WhatsAppAPI.sendText(to, "⚠️ Please use the format DD/MM/YYYY, e.g. 15/03/2000.\n\nDate of birth?");
    return;
  }

  await saveFlowData(to, "dateOfBirth", text);
  await setFlowStep(to, "registration", "personal_national_id");
  await WhatsAppAPI.sendText(to, "🪪 National ID number?\n\n(Format: 00-000000X00)");
}

export async function handlePersonalNationalId(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "National ID number? (Format: 00-000000X00)");
  if (!text) return;

  if (!isValidNationalId(text)) {
    await WhatsAppAPI.sendText(
      to,
      "⚠️ That doesn't look like a valid National ID. Please use the format 00-000000X00.\n\nNational ID number?"
    );
    return;
  }

  await saveFlowData(to, "nationalId", text);
  await setFlowStep(to, "registration", "personal_phone");
  await WhatsAppAPI.sendText(to, "📞 Phone number?\n\n(If same as this WhatsApp number, reply SAME)");
}

export async function handlePersonalPhone(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Phone number? (If same as this WhatsApp number, reply SAME)");
  if (!text) return;

  const phone = isSame(text) ? formatToE164(to) : text;

  if (!isSame(text) && !isValidZimbabwePhone(phone)) {
    await WhatsAppAPI.sendText(to, "⚠️ That doesn't look like a valid Zimbabwe phone number.\n\nPhone number?");
    return;
  }

  await saveFlowData(to, "phone", formatToE164(phone));
  await setFlowStep(to, "registration", "personal_province");
  await WhatsAppAPI.sendList(to, "🏙️ Which province are you in?", "Select Province", [
    {
      title: "Provinces",
      rows: ZIMBABWE_PROVINCES.map((province) => ({
        id: `PROVINCE_${province.toUpperCase().replace(/\s+/g, "_")}`,
        title: province,
      })),
    },
  ]);
}

export async function handlePersonalProvince(to: string, parsed: ParsedMessage): Promise<void> {
  const province = PROVINCE_BY_REPLY[parsed.replyId ?? ""];
  if (!province) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a province from the list above.");
    return;
  }

  await saveFlowData(to, "province", province);
  await setFlowStep(to, "registration", "personal_city");
  await WhatsAppAPI.sendText(to, "🏘️ City or town?");
}

export async function handlePersonalCity(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "City or town?");
  if (!text) return;
  await saveFlowData(to, "city", text);
  await setFlowStep(to, "registration", "personal_linkedin");
  await WhatsAppAPI.sendText(to, "🔗 LinkedIn profile URL?\n\n(Optional — reply SKIP to skip)");
}

export async function handlePersonalLinkedin(
  to: string,
  parsed: ParsedMessage,
  membershipType: MembershipTypeName
): Promise<void> {
  const text = await requireText(to, parsed, "LinkedIn profile URL? (Optional — reply SKIP to skip)");
  if (!text) return;

  if (!isSkip(text)) {
    await saveFlowData(to, "linkedinUrl", text);
  }

  await goToFirstProfessionalStep(to, membershipType);
}

// --- Corporate ---

export async function handleCorporateCompanyName(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What is your company name?");
  if (!text) return;
  await saveFlowData(to, "companyName", text);
  await setFlowStep(to, "registration", "corporate_reg_number");
  await WhatsAppAPI.sendText(to, "📄 Company registration number?");
}

export async function handleCorporateRegNumber(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Company registration number?");
  if (!text) return;
  await saveFlowData(to, "companyRegistrationNumber", text);
  await setFlowStep(to, "registration", "corporate_industry");
  await WhatsAppAPI.sendText(to, "🏭 Industry/Sector?");
}

export async function handleCorporateIndustry(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Industry/Sector?");
  if (!text) return;
  await saveFlowData(to, "industry", text);
  await setFlowStep(to, "registration", "corporate_female_engineers_count");
  await WhatsAppAPI.sendText(to, "👷‍♀️ Number of female engineers currently employed?");
}

export async function handleCorporateFemaleEngineersCount(
  to: string,
  parsed: ParsedMessage
): Promise<void> {
  const text = await requireText(to, parsed, "Number of female engineers currently employed?");
  if (!text) return;

  const count = Number(text);
  if (!Number.isFinite(count) || count < 0) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid number.\n\nNumber of female engineers currently employed?");
    return;
  }

  await saveFlowData(to, "femaleEngineersCount", count);
  await setFlowStep(to, "registration", "corporate_contact_name");
  await WhatsAppAPI.sendText(to, "👤 Contact person full name?");
}

export async function handleCorporateContactName(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Contact person full name?");
  if (!text) return;
  await saveFlowData(to, "contactPersonName", text);
  await setFlowStep(to, "registration", "corporate_contact_title");
  await WhatsAppAPI.sendText(to, "💼 Contact person job title?");
}

export async function handleCorporateContactTitle(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Contact person job title?");
  if (!text) return;
  await saveFlowData(to, "contactPersonTitle", text);
  await setFlowStep(to, "registration", "corporate_contact_email");
  await WhatsAppAPI.sendText(to, "📧 Contact person email?");
}

export async function handleCorporateContactEmail(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Contact person email?");
  if (!text) return;

  if (!isValidEmail(text)) {
    await WhatsAppAPI.sendText(to, "⚠️ That doesn't look like a valid email.\n\nContact person email?");
    return;
  }

  await saveFlowData(to, "contactPersonEmail", text.toLowerCase());
  await setFlowStep(to, "registration", "corporate_contact_phone");
  await WhatsAppAPI.sendText(to, "📞 Contact person phone?");
}

export async function handleCorporateContactPhone(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Contact person phone?");
  if (!text) return;

  if (!isValidZimbabwePhone(text)) {
    await WhatsAppAPI.sendText(to, "⚠️ That doesn't look like a valid phone number.\n\nContact person phone?");
    return;
  }

  await saveFlowData(to, "contactPersonPhone", formatToE164(text));
  await setFlowStep(to, "registration", "corporate_address");
  await WhatsAppAPI.sendText(to, "📍 Company physical address?");
}

export async function handleCorporateAddress(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Company physical address?");
  if (!text) return;
  await saveFlowData(to, "companyAddress", text);
  await setFlowStep(to, "registration", "corporate_website");
  await WhatsAppAPI.sendText(to, "🌐 Company website?\n\n(Optional — reply SKIP to skip)");
}

export async function handleCorporateWebsite(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Company website? (Optional — reply SKIP to skip)");
  if (!text) return;

  if (!isSkip(text)) {
    await saveFlowData(to, "companyWebsite", text);
  }

  await goToFirstProfessionalStep(to, "Corporate");
}
