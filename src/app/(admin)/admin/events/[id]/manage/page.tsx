import { notFound } from "next/navigation";
import { getEventById, getEventRegistrations } from "@/actions/events";
import { ManageEventView } from "@/components/admin/events/manage-view";

export default async function ManageEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [event, registrations] = await Promise.all([getEventById(id), getEventRegistrations(id)]);

  if (!event) notFound();

  return <ManageEventView event={event} registrations={registrations} />;
}
