import { WhatsAppAPI } from "@/lib/whatsapp/api";
import { saveFlowData, setFlowStep, clearFlow } from "@/lib/whatsapp/session";
import { handleUniversalCommands, requireText } from "@/lib/whatsapp/common";
import type { ParsedMessage } from "@/lib/whatsapp/utils";
import { createEnquiry, generateEnquiryReference } from "@/actions/whatsapp";
import type { EnquiryCategory } from "@/types/whatsapp";
import type { WhatsAppSession } from "@/types/whatsapp";

interface Faq {
  id: string;
  question: string;
  answer: string;
}

const FAQS: Record<EnquiryCategory, { label: string; items: Faq[] }> = {
  membership: {
    label: "Membership Questions",
    items: [
      {
        id: "FAQ_MEM_1",
        question: "How long does review take?",
        answer: "Our team reviews every application individually. Expect a decision within 5–7 business days.",
      },
      {
        id: "FAQ_MEM_2",
        question: "Can I upgrade my membership?",
        answer:
          "Yes — as you progress (e.g. Student to Graduate), submit a new application reflecting your new eligibility.",
      },
      {
        id: "FAQ_MEM_3",
        question: "What if I'm rejected?",
        answer: "You'll receive the reason where applicable, and may re-apply after addressing the issues noted.",
      },
      {
        id: "FAQ_MEM_4",
        question: "Is membership renewable?",
        answer: "Yes, membership runs for 1 year. You'll get reminders 60 and 30 days before it expires.",
      },
    ],
  },
  events: {
    label: "Event Information",
    items: [
      {
        id: "FAQ_EVT_1",
        question: "How do I register for an event?",
        answer: "Reply *EVENTS* from the main menu to browse and register for upcoming WiEZ events.",
      },
      {
        id: "FAQ_EVT_2",
        question: "Are events free?",
        answer: "Some are free, others are paid or member-only — each event listing shows its type and fee.",
      },
      {
        id: "FAQ_EVT_3",
        question: "How do I get my ticket?",
        answer: "Once confirmed, your ticket number is sent here on WhatsApp — show it at the venue for check-in.",
      },
    ],
  },
  payment: {
    label: "Payment Issues",
    items: [
      {
        id: "FAQ_PAY_1",
        question: "What payment methods are accepted?",
        answer: "EcoCash, InnBucks, and direct Bank Transfer. All payments are manual and verified by our team.",
      },
      {
        id: "FAQ_PAY_2",
        question: "How long does verification take?",
        answer: "Payment verification typically takes 1–2 business days after you submit your proof of payment.",
      },
      {
        id: "FAQ_PAY_3",
        question: "What if I miss the payment deadline?",
        answer: "Approved applications have 14 days to pay. Missing it cancels the application — you'd need to re-apply.",
      },
    ],
  },
  technical: {
    label: "Technical Support",
    items: [
      {
        id: "FAQ_TECH_1",
        question: "The bot isn't responding correctly",
        answer: "Try replying *MENU* to reset to the main menu, or *CANCEL* to pause your current step.",
      },
      {
        id: "FAQ_TECH_2",
        question: "I can't log in",
        answer: "Double check your registered email. After 3 failed password attempts your account is locked for 1 hour.",
      },
      {
        id: "FAQ_TECH_3",
        question: "Can I use the web dashboard instead?",
        answer: `Yes — visit ${process.env.NEXT_PUBLIC_APP_URL ?? ""}/sign-in to use the full web dashboard.`,
      },
    ],
  },
  other: {
    label: "Other",
    items: [
      {
        id: "FAQ_OTHER_1",
        question: "How do I contact WiEZ directly?",
        answer: "Email us at membership@wiez.co.zw or info@wiez.co.zw — we typically respond within 24 hours.",
      },
    ],
  },
};

export async function startEnquiryFlow(to: string): Promise<void> {
  await setFlowStep(to, "enquiry", "enquiry_category");
  await WhatsAppAPI.sendList(to, "💬 *General Enquiries*\n\nWhat is your enquiry about?", "Select Category", [
    {
      title: "Categories",
      rows: (Object.keys(FAQS) as EnquiryCategory[]).map((category) => ({
        id: `CATEGORY_${category}`,
        title: FAQS[category].label,
      })),
    },
  ]);
}

export async function handleEnquiryFlow(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  if (await handleUniversalCommands(to, parsed)) return;

  switch (session.currentStep) {
    case "enquiry_category":
      await handleCategory(to, parsed);
      return;
    case "enquiry_faq":
      await handleFaqSelection(to, session, parsed);
      return;
    case "enquiry_helpful":
      await handleHelpful(to, parsed);
      return;
    case "enquiry_message":
      await handleMessage(to, session, parsed);
      return;
  }
}

async function handleCategory(to: string, parsed: ParsedMessage): Promise<void> {
  const replyId = parsed.replyId ?? "";
  const category = (Object.keys(FAQS) as EnquiryCategory[]).find(
    (key) => replyId === `CATEGORY_${key}`
  );

  if (!category) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a category from the list above.");
    return;
  }

  await saveFlowData(to, "enquiryCategory", category);
  await setFlowStep(to, "enquiry", "enquiry_faq");

  const { items } = FAQS[category];
  await WhatsAppAPI.sendList(
    to,
    "Here are some common questions in this category. Select one to see the answer:",
    "View Questions",
    [{ title: "FAQs", rows: items.map((item) => ({ id: item.id, title: item.question })) }]
  );
}

async function handleFaqSelection(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const category = session.flowData.enquiryCategory as EnquiryCategory | undefined;
  if (!category) {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Something went wrong. Please start again. Reply *MENU* for options.");
    return;
  }

  const faq = FAQS[category].items.find((item) => item.id === parsed.replyId);
  if (!faq) {
    await WhatsAppAPI.sendText(to, "⚠️ Please select a question from the list above.");
    return;
  }

  await setFlowStep(to, "enquiry", "enquiry_helpful");
  await WhatsAppAPI.sendButtons(to, `*${faq.question}*\n\n${faq.answer}\n\nWas this helpful?`, [
    { id: "HELPFUL_YES", title: "Yes, Thanks ✅" },
    { id: "HELPFUL_NO", title: "I Need More Help" },
  ]);
}

async function handleHelpful(to: string, parsed: ParsedMessage): Promise<void> {
  if (parsed.replyId === "HELPFUL_YES") {
    await clearFlow(to);
    await WhatsAppAPI.sendText(to, "Glad we could help! 💚 Reply *MENU* anytime to return to the main menu.");
    return;
  }

  if (parsed.replyId === "HELPFUL_NO") {
    await setFlowStep(to, "enquiry", "enquiry_message");
    await WhatsAppAPI.sendText(
      to,
      "Please type your question and our team will get back to you within 24 hours:"
    );
    return;
  }

  await WhatsAppAPI.sendText(to, "⚠️ Please choose one of the options above.");
}

async function handleMessage(
  to: string,
  session: WhatsAppSession,
  parsed: ParsedMessage
): Promise<void> {
  const text = await requireText(
    to,
    parsed,
    "Please type your question and our team will get back to you within 24 hours:"
  );
  if (!text) return;

  const category = (session.flowData.enquiryCategory as EnquiryCategory | undefined) ?? "other";

  const result = await createEnquiry({
    whatsappNumber: to,
    userId: session.userId,
    category,
    message: text,
  });

  await clearFlow(to);

  if (!result.success) {
    await WhatsAppAPI.sendText(to, "Sorry, something went wrong saving your enquiry. Please try again.");
    return;
  }

  const reference = await generateEnquiryReference();
  await WhatsAppAPI.sendText(
    to,
    `✅ Your enquiry has been received!\n\nOur team will respond within 24 hours.\nReference: ${reference}\n\nYou can also reach us at:\n📧 info@wiez.co.zw\n🌐 ${process.env.NEXT_PUBLIC_APP_URL ?? ""}\n\nReply *MENU* to return to main menu.`
  );
}
