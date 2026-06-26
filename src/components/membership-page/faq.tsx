import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS: { question: string; answer: string }[] = [
  {
    question: "How long does the review process take?",
    answer:
      "Our membership team reviews every application individually. You can expect a decision within 5–7 business days of submitting a complete application.",
  },
  {
    question: "Can I upgrade my membership type?",
    answer:
      "Yes. As you progress in your career — for example from Student to Graduate, or Graduate to Professional — you can submit a new application reflecting your updated eligibility. The new membership type's fee and required documents will apply.",
  },
  {
    question: "What happens if my application is rejected?",
    answer:
      "You'll receive an outcome notification by email with the reason for the decision where applicable. You may re-apply after addressing the issues noted in your rejection.",
  },
  {
    question: "Is membership renewable?",
    answer:
      "Yes. Membership is valid for one year from activation. You'll receive renewal reminders 60 and 30 days before your expiry date.",
  },
  {
    question: "Can men apply for membership?",
    answer:
      "Individual WiEZ membership is reserved for women and gender-diverse individuals working or studying in engineering and related fields. Organizations of any leadership composition may apply for Corporate membership to support women in engineering.",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept EcoCash, InnBucks, and direct Bank Transfer. All payments are made manually and verified by our membership team — there is no online payment gateway.",
  },
  {
    question: "What happens if I miss the payment deadline?",
    answer:
      "Approved applicants have 14 days to submit payment. If payment isn't submitted within that window, the application is cancelled and you will need to apply again.",
  },
  {
    question: "Can I apply if I am not yet graduated?",
    answer:
      "Yes — apply as a Student Member while you are currently enrolled in an engineering degree program. You can apply for Graduate membership once you've graduated.",
  },
  {
    question: "How do I get my membership certificate?",
    answer:
      "Your digital membership certificate is issued automatically once your payment is verified and your membership is activated. It's available to download from your member dashboard.",
  },
  {
    question: "Is WiEZ membership recognized by ZIE (Zimbabwe Institution of Engineers)?",
    answer:
      "No. WiEZ is a professional community and network for women in engineering. Membership does not replace or substitute registration with the Zimbabwe Institution of Engineers or any other statutory regulatory body.",
  },
];

export function MembershipFaq() {
  return (
    <section className="bg-slate-50 py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Frequently Asked Questions
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Common questions about membership
          </h2>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-6">
          <Accordion>
            {FAQS.map((faq, index) => (
              <AccordionItem key={faq.question} value={String(index)}>
                <AccordionTrigger className="px-4 py-4 font-nav text-base font-semibold text-navy sm:px-2">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-2">
                  <p className="font-sans text-sm leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
