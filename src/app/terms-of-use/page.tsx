import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { CONTACT_INFO } from "@/components/footer/data";

export const metadata: Metadata = {
  title: "Terms of Use | Women in Engineering Zimbabwe",
  description:
    "The terms that govern your use of the Women in Engineering Zimbabwe website and membership network.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms of Use"
      updated="20 August 2026"
    >
      <section>
        <h2>Acceptance of Terms</h2>
        <p>
          By using this website or applying for membership with Women in
          Engineering Zimbabwe (WiEZ), you agree to these Terms of Use. If
          you do not agree, please do not use the site or our services.
        </p>
      </section>

      <section>
        <h2>Membership</h2>
        <p>
          Membership is granted at WiEZ&apos;s discretion based on the
          eligibility criteria for each membership tier. WiEZ reserves the
          right to review, approve or decline any application, and to update
          membership benefits and pricing from time to time.
        </p>
      </section>

      <section>
        <h2>Acceptable Use</h2>
        <ul>
          <li>Provide accurate information when applying or registering</li>
          <li>Use the site only for lawful, professional networking purposes</li>
          <li>Do not misuse, copy or redistribute site content without permission</li>
        </ul>
      </section>

      <section>
        <h2>Intellectual Property</h2>
        <p>
          All content on this site &mdash; including text, graphics and
          branding &mdash; belongs to WiEZ or its partners and may not be
          reproduced without written consent.
        </p>
      </section>

      <section>
        <h2>Limitation of Liability</h2>
        <p>
          WiEZ provides this website and its programs on an &quot;as
          is&quot; basis and is not liable for any indirect or consequential
          loss arising from your use of the site or participation in our
          programs.
        </p>
      </section>

      <section>
        <h2>Governing Law</h2>
        <p>
          These terms are governed by the laws of Zimbabwe. For any
          questions, contact us at{" "}
          <a
            href={`mailto:${CONTACT_INFO.email}`}
            className="font-semibold text-navy underline underline-offset-2"
          >
            {CONTACT_INFO.email}
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
