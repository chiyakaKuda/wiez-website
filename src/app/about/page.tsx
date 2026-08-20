import type { Metadata } from "next";
import Welcome from "@/components/Welcome";
import Impact from "@/components/Impact";
import FeaturedEngineers from "@/components/FeaturedEngineers";
import SuccessStories from "@/components/SuccessStories";

export const metadata: Metadata = {
  title: "About | Women in Engineering Zimbabwe",
  description:
    "Meet the women, the milestones and the mission behind Women in Engineering Zimbabwe — our President's welcome, our impact, our engineers and our stories.",
};

export default function AboutPage() {
  return (
    <main>
      <Welcome />
      <Impact />
      <FeaturedEngineers />
      <SuccessStories />
    </main>
  );
}
