import type { Metadata } from "next";
import { getMembershipTypes } from "@/actions/memberships";
import { MembershipHero } from "@/components/membership-page/hero";
import { WhoCanJoin } from "@/components/membership-page/who-can-join";
import { Pricing } from "@/components/membership-page/pricing";
import { Benefits } from "@/components/membership-page/benefits";
import { ApplicationProcess } from "@/components/membership-page/process";
import { MembershipTerms } from "@/components/membership-page/terms";
import { MembershipFaq } from "@/components/membership-page/faq";
import { MembershipCta } from "@/components/membership-page/cta";

export const metadata: Metadata = {
  title: "Membership | Women in Engineering Zimbabwe",
  description:
    "Join Zimbabwe's premier network of women engineers, technologists and innovators. Membership is selective — explore types, pricing, benefits and how to apply.",
};

export default async function MembershipPage() {
  const membershipTypes = await getMembershipTypes();
  const typeOrder = ["Student", "Graduate", "Professional", "Corporate"];
  const sortedTypes = [...membershipTypes].sort(
    (a, b) => typeOrder.indexOf(a.name) - typeOrder.indexOf(b.name)
  );

  return (
    <main>
      <MembershipHero />
      <WhoCanJoin membershipTypes={sortedTypes} />
      <Pricing membershipTypes={sortedTypes} />
      <Benefits />
      <ApplicationProcess />
      <MembershipTerms />
      <MembershipFaq />
      <MembershipCta />
    </main>
  );
}
