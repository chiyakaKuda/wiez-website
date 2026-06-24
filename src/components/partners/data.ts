import type { Partner } from "./types";

// The institutions named below are real Zimbabwean organizations, but the
// partnership status and descriptions are illustrative placeholders. Confirm
// actual, current partnerships (and obtain logo usage rights) before this
// section goes live — this applies especially to the two government
// ministries and listed corporates, where displaying a logo implies an
// active, endorsed relationship.

export const MARQUEE_PARTNERS = [
  { name: "University of Zimbabwe", logo: "/logos/uz.svg" },
  { name: "NUST", logo: "/logos/nust.svg" },
  { name: "Zimbabwe Institution of Engineers", logo: "/logos/zie.svg" },
  { name: "TelOne", logo: "/logos/telone.svg" },
  { name: "NetOne", logo: "/logos/netone.svg" },
  { name: "Econet", logo: "/logos/econet.svg" },
  { name: "ZESA", logo: "/logos/zesa.svg" },
  { name: "Hwange Colliery", logo: "/logos/hwange.svg" },
  { name: "Ministry of Higher Education", logo: "/logos/ministry.svg" },
  { name: "Ministry of Transport", logo: "/logos/ministry-trans.svg" },
  {
    name: "Engineering Council of Zimbabwe",
    logo: "/logos/ecz.svg",
  },
];

export const PARTNERS: Partner[] = [
  {
    id: "university-of-zimbabwe",
    name: "University of Zimbabwe",
    logo: "/logos/uz.svg",
    category: "Academic Institutions",
    description:
      "Collaborating on engineering curriculum development and student mentorship programs.",
    website: "#",
  },
  {
    id: "nust",
    name: "NUST",
    logo: "/logos/nust.svg",
    category: "Academic Institutions",
    description:
      "Partnering to support STEM outreach and graduate engineering talent pipelines.",
    website: "#",
  },
  {
    id: "zie",
    name: "Zimbabwe Institution of Engineers",
    logo: "/logos/zie.svg",
    category: "Professional Bodies",
    description:
      "Working together to advance professional standards and engineering excellence.",
    website: "#",
  },
  {
    id: "ecz",
    name: "Engineering Council of Zimbabwe",
    logo: "/logos/ecz.svg",
    category: "Professional Bodies",
    description:
      "Supporting professional registration pathways for women in engineering.",
    website: "#",
  },
  {
    id: "telone",
    name: "TelOne",
    logo: "/logos/telone.svg",
    category: "Technology Partners",
    description:
      "Providing connectivity and infrastructure support for WiEZ digital initiatives.",
    website: "#",
  },
  {
    id: "netone",
    name: "NetOne",
    logo: "/logos/netone.svg",
    category: "Technology Partners",
    description:
      "Enabling mobile connectivity for outreach programs in underserved communities.",
    website: "#",
  },
  {
    id: "econet",
    name: "Econet",
    logo: "/logos/econet.svg",
    category: "Corporate Partners",
    description:
      "Supporting STEM scholarships and innovation challenges for young women engineers.",
    website: "#",
  },
  {
    id: "hwange-colliery",
    name: "Hwange Colliery",
    logo: "/logos/hwange.svg",
    category: "Corporate Partners",
    description:
      "Partnering on industrial safety training and mining engineering exposure programs.",
    website: "#",
  },
  {
    id: "zesa",
    name: "ZESA",
    logo: "/logos/zesa.svg",
    category: "Government Agencies",
    description:
      "Collaborating on rural electrification training and technical skills development.",
    website: "#",
  },
  {
    id: "ministry-higher-education",
    name: "Ministry of Higher Education",
    logo: "/logos/ministry.svg",
    category: "Government Agencies",
    description:
      "Supporting policy alignment and national STEM education initiatives.",
    website: "#",
  },
  {
    id: "ministry-transport",
    name: "Ministry of Transport",
    logo: "/logos/ministry-trans.svg",
    category: "Government Agencies",
    description:
      "Collaborating on infrastructure engineering training and career pathways.",
    website: "#",
  },
];

export const IMPACT_METRICS = [
  { value: 20, suffix: "+", label: "Corporate Partners" },
  { value: 10, suffix: "+", label: "Academic Institutions" },
  { value: 8, suffix: "", label: "Provinces Reached" },
  { value: 100, suffix: "+", label: "Joint Initiatives" },
];

export const PARTNERSHIP_BENEFITS = [
  "Access engineering talent",
  "Support STEM development",
  "Increase brand visibility",
  "Sponsor national events",
  "Promote diversity in engineering",
  "Collaborate on innovation initiatives",
];

// A deliberately fictional sponsor (distinct from the real institutions
// above) so this detailed, unconfirmed case-study narrative isn't attached
// to a real, identifiable company.
export const FEATURED_SPONSOR = {
  name: "Meridian Technologies",
  tagline: "Technology Partner since 2022",
  story:
    "When Meridian Technologies partnered with WiEZ, they didn't just contribute funding — they opened their offices, mentors and engineering teams to our members. What started as sponsorship for a single hackathon has grown into a multi-year commitment to advancing women in STEM.",
  impact:
    "Funded 25 scholarships, hosted 6 hands-on technical workshops, and hired 12 WiEZ members into full-time engineering roles.",
  href: "/partners/meridian-technologies",
};
