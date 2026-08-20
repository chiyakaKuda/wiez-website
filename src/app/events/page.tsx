import type { Metadata } from "next";
import Events from "@/components/Events";

export const metadata: Metadata = {
  title: "Events | Women in Engineering Zimbabwe",
  description:
    "Join the Women in Engineering Summit, mentorship sessions and networking forums happening across Zimbabwe.",
};

export default function EventsPage() {
  return (
    <main>
      <Events />
    </main>
  );
}
