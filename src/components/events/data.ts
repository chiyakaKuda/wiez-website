import { SUMMIT_DATE, SUMMIT_LOCATION } from "@/lib/events";
import type { Event, EventCategory } from "./types";

export const FEATURED_EVENT: Event = {
  id: "summit-2026",
  title: "Women in Engineering Summit 2026",
  date: SUMMIT_DATE,
  location: SUMMIT_LOCATION,
  category: "Conferences",
  description:
    "Zimbabwe's flagship gathering of women engineers, industry leaders and students — a full day of keynotes, panels and hands-on workshops focused on building the next generation of engineering talent.",
  image: "/profile/event3.png",
  registrationOpen: true,
};

export const EVENTS: Event[] = [
  FEATURED_EVENT,
  {
    id: "leadership-workshop",
    title: "Leadership Workshop",
    date: new Date("2026-07-15T09:00:00"),
    location: "Bulawayo",
    category: "Workshops",
    description:
      "A hands-on workshop on executive presence, negotiation and decision-making for engineers stepping into leadership roles.",
    image: "/images/carpenter-cutting-mdf-board-inside-workshop.jpg",
    registrationOpen: true,
  },
  {
    id: "stem-outreach-program",
    title: "STEM Outreach Program",
    date: new Date("2026-08-04T10:00:00"),
    location: "Mutare",
    category: "Outreach",
    description:
      "WiEZ volunteers visit local schools to run hands-on engineering activities and inspire the next generation of girls in STEM.",
    image:
      "/images/young-girl-form-construction-worker-with-hard-hat.jpg",
    registrationOpen: true,
  },
  {
    id: "industry-networking-night",
    title: "Industry Networking Night",
    date: new Date("2026-10-22T18:00:00"),
    location: "Harare",
    category: "Networking",
    description:
      "An evening of informal networking with engineering leaders from across Zimbabwe's construction, energy and technology sectors.",
    image: "/images/wie-bg-bg1.jpg",
    registrationOpen: true,
  },
  {
    id: "innovation-research-forum",
    title: "Innovation & Research Forum",
    date: new Date("2026-11-14T09:00:00"),
    location: "Gweru",
    category: "Conferences",
    description:
      "Engineers and researchers present technical papers and innovative projects shaping the future of engineering in Zimbabwe.",
    image: "/images/automation-expert-smart-industrial-factory.jpg",
    registrationOpen: false,
  },
  {
    id: "mentorship-circle",
    title: "Mentorship Circle: Speed Mentoring Session",
    date: new Date("2026-12-06T14:00:00"),
    location: "Harare",
    category: "Mentorship",
    description:
      "A fast-paced speed-mentoring session pairing students and graduates with experienced engineers for focused, one-on-one guidance.",
    image: "/images/woman-wearing-special-industrial-protective-equipment.jpg",
    registrationOpen: true,
  },
];

export const CATEGORIES: EventCategory[] = [
  "Conferences",
  "Workshops",
  "Networking",
  "Mentorship",
  "Outreach",
];

export const PAST_EVENTS_GALLERY = [
  "/images/portrait-professional-young-black-woman-civil-engineer-architecture-worker-wearing-hard-hat-safety-working-construction-site-warehouseusing-laptop-work.jpg",
  "/images/female-technician-supervising-automated-production-line.jpg",
  "/images/pensive-black-female-engineer-hardhat-standing-warehouse-talking-cellphone-shelves-with-goods-background-copy-space-labor-communication-concept.jpg",
  "/images/automation-expert-smart-industrial-factory.jpg",
  "/images/woman-wearing-special-industrial-protective-equipment.jpg",
  "/images/wie-bg-bg1.jpg",
  "/images/female-construction-engineers-working-together-discussing-project-plan.jpg",
  "/images/carpenter-cutting-mdf-board-inside-workshop.jpg",
];
