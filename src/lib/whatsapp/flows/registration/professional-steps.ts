import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep } from "@/lib/whatsapp/session";
import { requireText, isSkip } from "@/lib/whatsapp/common";
import { countWords } from "@/lib/whatsapp/utils";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { ZIMBABWE_UNIVERSITIES, ENGINEERING_DISCIPLINES } from "@/lib/constants";
import { AREAS_OF_EXPERTISE } from "@/lib/whatsapp/flows/registration/shared";
import type { MembershipTypeName } from "@/types/memberships";
import { goToFirstDocumentStep } from "@/lib/whatsapp/flows/registration/document-steps";

const UNIVERSITY_BY_REPLY: Record<string, string> = Object.fromEntries(
  ZIMBABWE_UNIVERSITIES.map((university, index) => [`UNI_${index}`, university])
);

const DISCIPLINE_BY_REPLY: Record<string, string> = Object.fromEntries(
  ENGINEERING_DISCIPLINES.map((discipline) => [`DISC_${discipline.toUpperCase()}`, discipline])
);

function universityRows() {
  return ZIMBABWE_UNIVERSITIES.map((university, index) => ({ id: `UNI_${index}`, title: university }));
}

function disciplineRows() {
  return ENGINEERING_DISCIPLINES.map((discipline) => ({
    id: `DISC_${discipline.toUpperCase()}`,
    title: discipline,
  }));
}

export async function goToFirstProfessionalStep(to: string, type: MembershipTypeName): Promise<void> {
  if (type === "Student") {
    await setFlowStep(to, "registration", "uni_institution");
    await WhatsAppAPI.sendList(to, "🎓 Which institution do you attend?", "Select Institution", [
      { title: "Institutions", rows: universityRows() },
    ]);
    return;
  }
  if (type === "Graduate") {
    await setFlowStep(to, "registration", "grad_institution");
    await WhatsAppAPI.sendList(to, "🎓 Which institution did you graduate from?", "Select Institution", [
      { title: "Institutions", rows: universityRows() },
    ]);
    return;
  }
  if (type === "Professional") {
    await setFlowStep(to, "registration", "pro_discipline");
    await WhatsAppAPI.sendList(to, "⚙️ What is your engineering discipline?", "Select Discipline", [
      { title: "Disciplines", rows: disciplineRows() },
    ]);
    return;
  }
  // Corporate
  await setFlowStep(to, "registration", "corp_nature");
  await WhatsAppAPI.sendText(to, "🏭 What is the nature of your business?");
}

// ---------------------------------------------------------------------------
// Student
// ---------------------------------------------------------------------------

export async function handleUniInstitution(to: string, parsed: ParsedMessage): Promise<void> {
  const university = UNIVERSITY_BY_REPLY[parsed.replyId ?? ""];
  if (!university) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select an institution from the list above.");
    return;
  }
  await saveFlowData(to, "institution", university);

  if (university === "Other") {
    await setFlowStep(to, "registration", "uni_institution_other");
    await WhatsAppAPI.sendText(to, "Please type the name of your institution:");
    return;
  }

  await setFlowStep(to, "registration", "uni_program");
  await WhatsAppAPI.sendText(to, "📘 What is your program/degree?");
}

export async function handleUniInstitutionOther(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please type the name of your institution:");
  if (!text) return;
  await saveFlowData(to, "institutionOther", text);
  await setFlowStep(to, "registration", "uni_program");
  await WhatsAppAPI.sendText(to, "📘 What is your program/degree?");
}

export async function handleUniProgram(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What is your program/degree?");
  if (!text) return;
  await saveFlowData(to, "program", text);
  await setFlowStep(to, "registration", "uni_year");
  await WhatsAppAPI.sendList(to, "📚 What year of study are you in?", "Select Year", [
    {
      title: "Year of Study",
      rows: ["1st", "2nd", "3rd", "4th", "5th", "Postgraduate"].map((year) => ({
        id: `YEAR_${year.toUpperCase()}`,
        title: year,
      })),
    },
  ]);
}

export async function handleUniYear(to: string, parsed: ParsedMessage): Promise<void> {
  const year = ["1st", "2nd", "3rd", "4th", "5th", "Postgraduate"].find(
    (option) => parsed.replyId === `YEAR_${option.toUpperCase()}`
  );
  if (!year) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a year from the list above.");
    return;
  }
  await saveFlowData(to, "yearOfStudy", year);
  await setFlowStep(to, "registration", "uni_student_id");
  await WhatsAppAPI.sendText(to, "🪪 Student ID number?");
}

export async function handleUniStudentId(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Student ID number?");
  if (!text) return;
  await saveFlowData(to, "studentIdNumber", text);
  await setFlowStep(to, "registration", "uni_grad_year");
  await WhatsAppAPI.sendText(to, "📅 Expected graduation year?");
}

export async function handleUniGradYear(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Expected graduation year?");
  if (!text) return;

  const year = Number(text);
  if (!Number.isFinite(year) || year < new Date().getFullYear()) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid future year.\n\nExpected graduation year?");
    return;
  }

  await saveFlowData(to, "expectedGraduationYear", year);
  await setFlowStep(to, "registration", "discipline");
  await WhatsAppAPI.sendList(to, "⚙️ What is your engineering discipline?", "Select Discipline", [
    { title: "Disciplines", rows: disciplineRows() },
  ]);
}

export async function handleDiscipline(to: string, parsed: ParsedMessage): Promise<void> {
  const discipline = DISCIPLINE_BY_REPLY[parsed.replyId ?? ""];
  if (!discipline) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a discipline from the list above.");
    return;
  }
  await saveFlowData(to, "engineeringDiscipline", discipline);
  await setFlowStep(to, "registration", "personal_statement");
  await WhatsAppAPI.sendText(
    to,
    "✍️ *Personal Statement*\n\nTell us about your engineering journey and why you want to join WiEZ.\n\n(Minimum 100 words — type your statement now)"
  );
}

export async function handlePersonalStatement(
  to: string,
  parsed: ParsedMessage,
  membershipType: MembershipTypeName
): Promise<void> {
  const text = await requireText(to, parsed, "Please share your personal statement (minimum 100 words):");
  if (!text) return;

  const words = countWords(text);
  if (words < 100) {
    await WhatsAppAPI.sendText(to, `⚠️ Too short (${words} words). Please write at least 100 words.`);
    return;
  }

  await saveFlowData(to, "personalStatement", text);
  await WhatsAppAPI.sendText(to, `✅ Statement received — ${words} words.`);
  await goToFirstDocumentStep(to, membershipType);
}

// ---------------------------------------------------------------------------
// Graduate
// ---------------------------------------------------------------------------

export async function handleGradInstitution(to: string, parsed: ParsedMessage): Promise<void> {
  const university = UNIVERSITY_BY_REPLY[parsed.replyId ?? ""];
  if (!university) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select an institution from the list above.");
    return;
  }
  await saveFlowData(to, "institution", university);

  if (university === "Other") {
    await setFlowStep(to, "registration", "grad_institution_other");
    await WhatsAppAPI.sendText(to, "Please type the name of your institution:");
    return;
  }

  await setFlowStep(to, "registration", "grad_degree");
  await WhatsAppAPI.sendText(to, "📘 What degree did you obtain?");
}

export async function handleGradInstitutionOther(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please type the name of your institution:");
  if (!text) return;
  await saveFlowData(to, "institutionOther", text);
  await setFlowStep(to, "registration", "grad_degree");
  await WhatsAppAPI.sendText(to, "📘 What degree did you obtain?");
}

export async function handleGradDegree(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What degree did you obtain?");
  if (!text) return;
  await saveFlowData(to, "degreeObtained", text);
  await setFlowStep(to, "registration", "grad_discipline");
  await WhatsAppAPI.sendList(to, "⚙️ What is your engineering discipline?", "Select Discipline", [
    { title: "Disciplines", rows: disciplineRows() },
  ]);
}

export async function handleGradDiscipline(to: string, parsed: ParsedMessage): Promise<void> {
  const discipline = DISCIPLINE_BY_REPLY[parsed.replyId ?? ""];
  if (!discipline) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a discipline from the list above.");
    return;
  }
  await saveFlowData(to, "engineeringDiscipline", discipline);
  await setFlowStep(to, "registration", "grad_year");
  await WhatsAppAPI.sendText(to, "📅 Year of graduation?");
}

export async function handleGradYear(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Year of graduation?");
  if (!text) return;

  const year = Number(text);
  if (!Number.isFinite(year) || year < 1980 || year > new Date().getFullYear()) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid year.\n\nYear of graduation?");
    return;
  }

  await saveFlowData(to, "yearOfGraduation", year);
  await setFlowStep(to, "registration", "grad_employment_status");
  await WhatsAppAPI.sendList(to, "💼 What is your current employment status?", "Select Status", [
    {
      title: "Employment Status",
      rows: ["Employed", "Self-Employed", "Job Seeking", "Further Studies"].map((status) => ({
        id: `EMP_${status.toUpperCase().replace(/[^A-Z]/g, "_")}`,
        title: status,
      })),
    },
  ]);
}

export async function handleGradEmploymentStatus(to: string, parsed: ParsedMessage): Promise<void> {
  const status = ["Employed", "Self-Employed", "Job Seeking", "Further Studies"].find(
    (option) => parsed.replyId === `EMP_${option.toUpperCase().replace(/[^A-Z]/g, "_")}`
  );
  if (!status) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select an option from the list above.");
    return;
  }
  await saveFlowData(to, "employmentStatus", status);

  if (status === "Employed" || status === "Self-Employed") {
    await setFlowStep(to, "registration", "grad_employer");
    await WhatsAppAPI.sendText(to, "🏢 Current employer?\n\n(Reply SKIP if not applicable)");
    return;
  }

  await setFlowStep(to, "registration", "grad_experience");
  await WhatsAppAPI.sendText(to, "📈 Years of engineering experience?");
}

export async function handleGradEmployer(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Current employer? (Reply SKIP if not applicable)");
  if (!text) return;

  if (!isSkip(text)) await saveFlowData(to, "currentEmployer", text);

  await setFlowStep(to, "registration", "grad_job_title");
  await WhatsAppAPI.sendText(to, "💼 Job title?\n\n(Reply SKIP if not applicable)");
}

export async function handleGradJobTitle(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Job title? (Reply SKIP if not applicable)");
  if (!text) return;

  if (!isSkip(text)) await saveFlowData(to, "jobTitle", text);

  await setFlowStep(to, "registration", "grad_experience");
  await WhatsAppAPI.sendText(to, "📈 Years of engineering experience?");
}

export async function handleGradExperience(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Years of engineering experience?");
  if (!text) return;

  const years = Number(text);
  if (!Number.isFinite(years) || years < 0) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid number.\n\nYears of engineering experience?");
    return;
  }

  await saveFlowData(to, "yearsOfExperience", years);
  await setFlowStep(to, "registration", "grad_bio");
  await WhatsAppAPI.sendText(to, "✍️ Please share a short professional bio.\n\n(Minimum 100 words)");
}

export async function handleGradBio(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please share a short professional bio (minimum 100 words):");
  if (!text) return;

  const words = countWords(text);
  if (words < 100) {
    await WhatsAppAPI.sendText(to, `⚠️ Too short (${words} words). Please write at least 100 words.`);
    return;
  }

  await saveFlowData(to, "professionalBio", text);
  await setFlowStep(to, "registration", "grad_wiez_goals");
  await WhatsAppAPI.sendText(to, "🎯 What do you hope to gain from WiEZ membership?\n\n(Minimum 50 words)");
}

export async function handleGradWiezGoals(
  to: string,
  parsed: ParsedMessage,
  membershipType: MembershipTypeName
): Promise<void> {
  const text = await requireText(to, parsed, "What do you hope to gain from WiEZ membership? (Minimum 50 words)");
  if (!text) return;

  const words = countWords(text);
  if (words < 50) {
    await WhatsAppAPI.sendText(to, `⚠️ Too short (${words} words). Please write at least 50 words.`);
    return;
  }

  await saveFlowData(to, "whatToGain", text);
  await goToFirstDocumentStep(to, membershipType);
}

// ---------------------------------------------------------------------------
// Professional
// ---------------------------------------------------------------------------

export async function handleProDiscipline(to: string, parsed: ParsedMessage): Promise<void> {
  const discipline = DISCIPLINE_BY_REPLY[parsed.replyId ?? ""];
  if (!discipline) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a discipline from the list above.");
    return;
  }
  await saveFlowData(to, "engineeringDiscipline", discipline);
  await setFlowStep(to, "registration", "pro_qualification");
  await WhatsAppAPI.sendText(to, "🎓 Highest qualification?");
}

export async function handleProQualification(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Highest qualification?");
  if (!text) return;
  await saveFlowData(to, "highestQualification", text);
  await setFlowStep(to, "registration", "pro_institution");
  await WhatsAppAPI.sendText(to, "🏫 Institution?");
}

export async function handleProInstitution(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Institution?");
  if (!text) return;
  await saveFlowData(to, "institution", text);
  await setFlowStep(to, "registration", "pro_grad_year");
  await WhatsAppAPI.sendText(to, "📅 Year of graduation?");
}

export async function handleProGradYear(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Year of graduation?");
  if (!text) return;

  const year = Number(text);
  if (!Number.isFinite(year) || year < 1980 || year > new Date().getFullYear()) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid year.\n\nYear of graduation?");
    return;
  }

  await saveFlowData(to, "yearOfGraduation", year);
  await setFlowStep(to, "registration", "pro_employer");
  await WhatsAppAPI.sendText(to, "🏢 Current employer?");
}

export async function handleProEmployer(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Current employer?");
  if (!text) return;
  await saveFlowData(to, "currentEmployer", text);
  await setFlowStep(to, "registration", "pro_job_title");
  await WhatsAppAPI.sendText(to, "💼 Job title?");
}

export async function handleProJobTitle(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Job title?");
  if (!text) return;
  await saveFlowData(to, "jobTitle", text);
  await setFlowStep(to, "registration", "pro_experience");
  await WhatsAppAPI.sendText(to, "📈 Years of engineering experience?");
}

export async function handleProExperience(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Years of engineering experience?");
  if (!text) return;

  const years = Number(text);
  if (!Number.isFinite(years) || years < 5) {
    await WhatsAppAPI.sendText(
      to,
      "⚠️ Professional membership requires 5 or more years of experience.\n\nYears of engineering experience?"
    );
    return;
  }

  await saveFlowData(to, "yearsOfExperience", years);
  await setFlowStep(to, "registration", "pro_ecz_number");
  await WhatsAppAPI.sendText(
    to,
    "📋 Engineering Council of Zimbabwe registration number?\n\n(Optional — reply SKIP to skip)"
  );
}

export async function handleProEczNumber(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "ECZ registration number? (Optional — reply SKIP to skip)");
  if (!text) return;

  if (!isSkip(text)) await saveFlowData(to, "ezRegistrationNumber", text);

  await setFlowStep(to, "registration", "pro_other_body");
  await WhatsAppAPI.sendButtons(to, "🏛️ Are you a member of any other professional body?", [
    { id: "OTHER_BODY_YES", title: "Yes" },
    { id: "OTHER_BODY_NO", title: "No" },
  ]);
}

export async function handleProOtherBody(to: string, parsed: ParsedMessage): Promise<void> {
  if (parsed.replyId === "OTHER_BODY_YES") {
    await saveFlowData(to, "memberOfOtherBody", true);
    await setFlowStep(to, "registration", "pro_other_body_name");
    await WhatsAppAPI.sendText(to, "Which professional body?");
    return;
  }

  if (parsed.replyId === "OTHER_BODY_NO") {
    await saveFlowData(to, "memberOfOtherBody", false);
    await goToExpertiseStep(to);
    return;
  }

  await WhatsAppAPI.sendText(to, "⚠️ Please choose Yes or No.");
}

export async function handleProOtherBodyName(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Which professional body?");
  if (!text) return;
  await saveFlowData(to, "otherBodyName", text);
  await goToExpertiseStep(to);
}

async function goToExpertiseStep(to: string): Promise<void> {
  await setFlowStep(to, "registration", "pro_expertise");
  const half = Math.ceil(AREAS_OF_EXPERTISE.length / 2);
  const left = AREAS_OF_EXPERTISE.slice(0, half);
  const right = AREAS_OF_EXPERTISE.slice(half);
  const lines = left.map((label, index) => {
    const rightItem = right[index];
    const leftLine = `${index + 1}. ${label}`;
    return rightItem ? `${leftLine.padEnd(24)}${half + index + 1}. ${rightItem}` : leftLine;
  });
  await WhatsAppAPI.sendText(
    to,
    `Select your areas of expertise (reply with numbers separated by commas e.g. 1,3,5):\n\n${lines.join("\n")}`
  );
}

export async function handleProExpertise(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please reply with numbers separated by commas, e.g. 1,3,5");
  if (!text) return;

  const indices = text
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= AREAS_OF_EXPERTISE.length);

  if (indices.length === 0) {
    await WhatsAppAPI.sendText(to, "⚠️ Please reply with at least one valid number, e.g. 1,3,5");
    return;
  }

  const selected = [...new Set(indices)].map((index) => AREAS_OF_EXPERTISE[index - 1]);
  await saveFlowData(to, "areasOfExpertise", selected);
  await setFlowStep(to, "registration", "pro_achievements");
  await WhatsAppAPI.sendText(to, "🏆 Professional achievements?\n\n(Optional — reply SKIP to skip)");
}

export async function handleProAchievements(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Professional achievements? (Optional — reply SKIP to skip)");
  if (!text) return;

  if (!isSkip(text)) await saveFlowData(to, "professionalAchievements", text);

  await setFlowStep(to, "registration", "pro_why_wiez");
  await WhatsAppAPI.sendText(to, "💚 Why do you want to join WiEZ?\n\n(Minimum 150 words)");
}

export async function handleProWhyWiez(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Why do you want to join WiEZ? (Minimum 150 words)");
  if (!text) return;

  const words = countWords(text);
  if (words < 150) {
    await WhatsAppAPI.sendText(to, `⚠️ Too short (${words} words). Please write at least 150 words.`);
    return;
  }

  await saveFlowData(to, "whyJoinWiez", text);
  await setFlowStep(to, "registration", "pro_mentor");
  await WhatsAppAPI.sendButtons(to, "🤝 Are you willing to mentor younger engineers?", [
    { id: "MENTOR_YES", title: "Yes, I'd love to" },
    { id: "MENTOR_NO", title: "Not at this time" },
  ]);
}

export async function handleProMentor(
  to: string,
  parsed: ParsedMessage,
  membershipType: MembershipTypeName
): Promise<void> {
  if (parsed.replyId !== "MENTOR_YES" && parsed.replyId !== "MENTOR_NO") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
    return;
  }

  await saveFlowData(to, "willingToMentor", parsed.replyId === "MENTOR_YES");
  await goToFirstDocumentStep(to, membershipType);
}

// ---------------------------------------------------------------------------
// Corporate
// ---------------------------------------------------------------------------

export async function handleCorpNature(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What is the nature of your business?");
  if (!text) return;
  await saveFlowData(to, "natureOfBusiness", text);

  await setFlowStep(to, "registration", "corp_disciplines");
  const lines = ENGINEERING_DISCIPLINES.map((discipline, index) => `${index + 1}. ${discipline}`);
  await WhatsAppAPI.sendText(
    to,
    `Which engineering disciplines does your company operate in?\n\n(Reply with numbers separated by commas, e.g. 1,3,5)\n\n${lines.join("\n")}`
  );
}

export async function handleCorpDisciplines(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "Please reply with numbers separated by commas, e.g. 1,3,5");
  if (!text) return;

  const indices = text
    .split(",")
    .map((part) => Number(part.trim()))
    .filter((n) => Number.isInteger(n) && n >= 1 && n <= ENGINEERING_DISCIPLINES.length);

  if (indices.length === 0) {
    await WhatsAppAPI.sendText(to, "⚠️ Please reply with at least one valid number, e.g. 1,3,5");
    return;
  }

  const selected = [...new Set(indices)].map((index) => ENGINEERING_DISCIPLINES[index - 1]);
  await saveFlowData(to, "companyDisciplines", selected);
  await setFlowStep(to, "registration", "corp_mission");
  await WhatsAppAPI.sendText(to, "🎯 What is your company's mission statement?");
}

export async function handleCorpMission(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "What is your company's mission statement?");
  if (!text) return;
  await saveFlowData(to, "missionStatement", text);
  await setFlowStep(to, "registration", "corp_support_women");
  await WhatsAppAPI.sendText(
    to,
    "💚 How does your company support women in engineering?\n\n(Minimum 100 words)"
  );
}

export async function handleCorpSupportWomen(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(
    to,
    parsed,
    "How does your company support women in engineering? (Minimum 100 words)"
  );
  if (!text) return;

  const words = countWords(text);
  if (words < 100) {
    await WhatsAppAPI.sendText(to, `⚠️ Too short (${words} words). Please write at least 100 words.`);
    return;
  }

  await saveFlowData(to, "howSupportWomen", text);
  await setFlowStep(to, "registration", "corp_years");
  await WhatsAppAPI.sendText(to, "📅 How many years has your company been in operation?");
}

export async function handleCorpYears(to: string, parsed: ParsedMessage): Promise<void> {
  const text = await requireText(to, parsed, "How many years has your company been in operation?");
  if (!text) return;

  const years = Number(text);
  if (!Number.isFinite(years) || years < 0) {
    await WhatsAppAPI.sendText(to, "⚠️ Please enter a valid number.\n\nYears in operation?");
    return;
  }

  await saveFlowData(to, "yearsInOperation", years);
  await setFlowStep(to, "registration", "corp_zimra");
  await WhatsAppAPI.sendButtons(to, "📋 Is your company ZIMRA registered?", [
    { id: "ZIMRA_YES", title: "Yes" },
    { id: "ZIMRA_NO", title: "No" },
  ]);
}

export async function handleCorpZimra(to: string, parsed: ParsedMessage): Promise<void> {
  if (parsed.replyId !== "ZIMRA_YES" && parsed.replyId !== "ZIMRA_NO") {
    await WhatsAppAPI.sendText(to, "⚠️ Please choose Yes or No.");
    return;
  }

  await saveFlowData(to, "zimraRegistered", parsed.replyId === "ZIMRA_YES");
  await goToFirstDocumentStep(to, "Corporate");
}
