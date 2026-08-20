import type { Metadata } from "next";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import { CONTACT_INFO } from "@/components/footer/data";

export const metadata: Metadata = {
  title: "Privacy Policy | Women in Engineering Zimbabwe",
  description:
    "How Women in Engineering Zimbabwe collects, uses and protects the personal information of members, applicants and website visitors.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      updated="20 August 2026"
    >
      <section>
        <h2>Information We Collect</h2>
        <p>
          When you apply for membership, subscribe to our newsletter, register
          for an event or contact us, we may collect your name, email
          address, phone number, professional details and any other
          information you choose to share with us.
        </p>
      </section>

      <section>
        <h2>How We Use Your Information</h2>
        <ul>
          <li>To process and manage your membership application</li>
          <li>To send event invitations, newsletters and opportunities</li>
          <li>To respond to enquiries submitted through our contact form</li>
          <li>To improve our programs and the experience of our website</li>
        </ul>
      </section>

      <section>
        <h2>How We Protect Your Information</h2>
        <p>
          We take reasonable technical and organizational measures to keep
          your information secure and only share it with third parties where
          necessary to operate our programs (for example, payment processing
          for membership fees), or where required by law.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your
          personal information at any time, and you can unsubscribe from our
          communications using the link in any email or by contacting us
          directly.
        </p>
      </section>

      <section>
        <h2>Contact Us</h2>
        <p>
          Questions about this policy can be sent to{" "}
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
