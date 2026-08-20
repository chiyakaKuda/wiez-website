import type { Metadata } from "next";
import Contact from "@/components/Contact";
import Partners from "@/components/Partners";

export const metadata: Metadata = {
  title: "Contact | Women in Engineering Zimbabwe",
  description:
    "Get in touch with Women in Engineering Zimbabwe — membership, partnership, event and mentorship enquiries, plus our partners and sponsors.",
};

export default function ContactPage() {
  return (
    <main>
      <Contact />
      <Partners />
    </main>
  );
}
