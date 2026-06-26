import { ApplicationSubmittedContent } from "@/components/membership/application-submitted-content";

export default async function ApplicationSubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const params = await searchParams;
  return <ApplicationSubmittedContent reference={params.ref ?? null} />;
}
