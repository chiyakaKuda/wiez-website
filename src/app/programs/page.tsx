import type { Metadata } from "next";
import Programs from "@/components/Programs";

export const metadata: Metadata = {
  title: "Programs | Women in Engineering Zimbabwe",
  description:
    "Mentorship, leadership development, STEM outreach, research and scholarships — explore the programs helping women engineers thrive across Zimbabwe.",
};

export default function ProgramsPage() {
  return (
    <main>
      <Programs />
    </main>
  );
}
