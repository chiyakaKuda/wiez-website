export type EventCategory =
  | "Conferences"
  | "Workshops"
  | "Networking"
  | "Mentorship"
  | "Outreach";

export type Event = {
  id: string;
  title: string;
  date: Date;
  location: string;
  category: EventCategory;
  description: string;
  image: string;
  registrationOpen: boolean;
};
