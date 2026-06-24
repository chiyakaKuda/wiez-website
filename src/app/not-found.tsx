import type { Metadata } from "next";
import NotFoundContent from "@/components/not-found/NotFoundContent";

export const metadata: Metadata = {
  title: "Blueprint Not Found | Women in Engineering Zimbabwe",
  description:
    "The page you're looking for seems to have disappeared from the design plans.",
};

export default function NotFound() {
  return <NotFoundContent />;
}
