import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface TermsSection {
  id: string;
  title: string;
  items: string[];
}

const TERMS_SECTIONS: TermsSection[] = [
  {
    id: "6.1",
    title: "6.1 — General Membership Terms",
    items: [
      "WiEZ membership is open to women and gender-diverse individuals working or studying in engineering and related fields in Zimbabwe.",
      "WiEZ reserves the right to accept or reject any application without being required to provide reasons.",
      "Membership is personal and non-transferable.",
      "Members must conduct themselves in accordance with the WiEZ Code of Conduct at all times.",
      "WiEZ membership does not replace or substitute registration with any statutory engineering regulatory body (e.g., Zimbabwe Institution of Engineers).",
    ],
  },
  {
    id: "6.2",
    title: "6.2 — Eligibility & Verification",
    items: [
      "All information provided in the application must be true, accurate, and verifiable.",
      "WiEZ reserves the right to request additional documentation or verification at any time.",
      "Providing false or misleading information will result in immediate rejection or cancellation of membership.",
      "WiEZ may contact your institution or employer to verify information provided.",
    ],
  },
  {
    id: "6.3",
    title: "6.3 — Membership Fees & Payment",
    items: [
      "All membership fees are quoted and payable in United States Dollars (USD).",
      "Membership fees are non-refundable once payment has been submitted and verified.",
      "Payment must be made within 14 days of receiving approval notification.",
      "Failure to pay within 14 days will result in the application being cancelled.",
      "Membership fees are subject to annual review and may change.",
      "Proof of payment must be uploaded through the membership portal.",
    ],
  },
  {
    id: "6.4",
    title: "6.4 — Membership Duration & Renewal",
    items: [
      "Membership is valid for one (1) year from the date of activation.",
      "Members will receive renewal reminders 60 days and 30 days before expiry.",
      "Failure to renew before the expiry date will result in membership lapsing.",
      "Lapsed members must re-apply if more than 6 months have passed since expiry.",
      "WiEZ reserves the right to change membership fees upon renewal.",
    ],
  },
  {
    id: "6.5",
    title: "6.5 — Membership Suspension & Revocation",
    items: [
      "WiEZ may suspend or revoke membership for: violation of the Code of Conduct, providing false information, conduct unbecoming of a WiEZ member, non-payment of fees, or bringing the organization into disrepute.",
      "Suspended members may not use WiEZ membership benefits or represent themselves as WiEZ members.",
      "Revoked members forfeit all membership benefits with no refund of fees paid.",
    ],
  },
  {
    id: "6.6",
    title: "6.6 — Corporate Membership Terms",
    items: [
      "Corporate membership covers the organization as a whole, not individual employees.",
      "Corporate members may not use WiEZ membership to represent individual employees as WiEZ members.",
      "Corporate members must actively support women in engineering within their organization.",
      "WiEZ may request annual reports on corporate members' progress supporting women in engineering.",
    ],
  },
  {
    id: "6.7",
    title: "6.7 — Privacy & Data",
    items: [
      "WiEZ collects and processes personal data in accordance with the Zimbabwe Cyber and Data Protection Act (Chapter 12:07).",
      "Member data will not be shared with third parties without consent except where required by law.",
      "Members may request access to or deletion of their personal data at any time.",
      "Profile information may be displayed in the WiEZ member directory (opt-in).",
    ],
  },
  {
    id: "6.8",
    title: "6.8 — Code of Conduct (Summary)",
    items: [
      "Uphold professional integrity and ethical standards.",
      "Treat fellow members and WiEZ staff with respect.",
      "Not discriminate on any basis.",
      "Represent WiEZ accurately and positively.",
      "Report violations of the Code of Conduct to WiEZ administration.",
    ],
  },
  {
    id: "6.9",
    title: "6.9 — Amendments",
    items: [
      "WiEZ reserves the right to amend these terms at any time.",
      "Members will be notified of significant changes via email.",
      "Continued use of membership benefits following notification constitutes acceptance of amended terms.",
    ],
  },
];

export function MembershipTerms() {
  return (
    <section id="terms" className="bg-white py-24 lg:py-28">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Membership Terms & Conditions
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            Please read carefully before applying
          </h2>
          <p className="mt-5 font-sans text-base leading-relaxed text-slate-custom">
            These terms govern your WiEZ membership application and, if accepted, your
            ongoing membership. By applying, you agree to the terms below.
          </p>
        </div>

        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm sm:p-6">
          <Accordion>
            {TERMS_SECTIONS.map((section) => (
              <AccordionItem key={section.id} value={section.id}>
                <AccordionTrigger className="px-4 py-4 font-nav text-base font-semibold text-navy sm:px-2">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 sm:px-2">
                  <ul className="space-y-2.5">
                    {section.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex gap-2.5 font-sans text-sm leading-relaxed text-slate-600"
                      >
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-slate-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
