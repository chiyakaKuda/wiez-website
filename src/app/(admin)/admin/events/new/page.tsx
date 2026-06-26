import { PageHeader } from "@/components/admin/page-header";
import { EventForm } from "@/components/admin/events/event-form";

export default function NewEventPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Create Event" description="Set up a new WiEZ event." />
      <EventForm />
    </div>
  );
}
