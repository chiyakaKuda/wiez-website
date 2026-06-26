import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { EventForm } from "@/components/admin/events/event-form";
import { getEventById } from "@/actions/events";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) notFound();

  return (
    <div className="space-y-5">
      <PageHeader title="Edit Event" description={event.title} />
      <EventForm event={event} />
    </div>
  );
}
