import { ENGINEERS, SPOTLIGHT_ENGINEER } from "@/components/engineers/data";

const engineerById = (id: string) =>
  ENGINEERS.find((engineer) => engineer.id === id)!;

export const FEATURED_STORY = {
  engineer: engineerById("rutendo-chikafu"),
  position: "Senior Civil Engineer, City Infrastructure Authority",
  story:
    "Through WiEZ mentorship and networking opportunities, I was able to connect with industry leaders, gain confidence and secure a leadership role within my organization.",
  achievements: [
    "Promoted to Senior Civil Engineer",
    "City Infrastructure Authority — Engineer of the Year",
    "WiEZ Mentor",
  ],
};

export type FeaturedStory = typeof FEATURED_STORY;

export type Testimonial = {
  engineer: (typeof ENGINEERS)[number];
  quote: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    engineer: SPOTLIGHT_ENGINEER,
    quote: "WiEZ gave me access to mentors who transformed my career.",
  },
  {
    engineer: engineerById("nyasha-mutasa"),
    quote: "The networking opportunities opened doors I never imagined.",
  },
  {
    engineer: engineerById("farai-ndlovu"),
    quote:
      "Being part of WiEZ helped me develop leadership skills and confidence.",
  },
  {
    engineer: engineerById("privilege-gumbo"),
    quote:
      "The mentorship circle pushed me to apply for projects I once thought were out of reach.",
  },
];

export const ACHIEVEMENT_METRICS = [
  { value: 50, suffix: "+", label: "Mentorship Success Stories" },
  { value: 100, suffix: "+", label: "Career Development Workshops" },
  { value: 500, suffix: "+", label: "Members Impacted" },
  { value: 20, suffix: "+", label: "Industry Partnerships" },
];

export const JOURNEY_STAGES = [
  {
    title: "Student",
    description:
      "Access mentorship, STEM programs and scholarship support from day one.",
  },
  {
    title: "Graduate Engineer",
    description:
      "Gain career guidance, industry exposure and your first mentor match.",
  },
  {
    title: "Professional Engineer",
    description:
      "Build leadership skills through workshops, networking and recognition.",
  },
  {
    title: "Industry Leader",
    description:
      "Take on speaking, board and industry representation opportunities.",
  },
  {
    title: "Mentor",
    description:
      "Give back by mentoring the next generation of women engineers.",
  },
];

export const GALLERY_PHOTOS = [
  {
    src: "/images/female-construction-engineers-working-together-discussing-project-plan.jpg",
    caption: "Mentorship Session",
  },
  {
    src: "/images/wie-bg-bg1.jpg",
    caption: "Networking Event",
  },
  {
    src: "/images/woman-wearing-special-industrial-protective-equipment.jpg",
    caption: "Awards Ceremony",
  },
  {
    src: "/images/automation-expert-smart-industrial-factory.jpg",
    caption: "STEM Outreach Visit",
  },
  {
    src: "/images/carpenter-cutting-mdf-board-inside-workshop.jpg",
    caption: "Leadership Workshop",
  },
  {
    src: "/images/female-technician-supervising-automated-production-line.jpg",
    caption: "Mentorship Session",
  },
];
