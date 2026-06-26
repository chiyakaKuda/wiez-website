import type { Engineer } from "./types";

// All names, bios and affiliations below are placeholders for demonstration
// purposes only and should be replaced with real, consented member profiles
// before this section goes live.

export const SPOTLIGHT_ENGINEER: Engineer = {
  id: "spotlight-irene-kamutero",
  name: "Irene Kamutero",
  discipline: "General Manager – Subsidiaries",
  organization: "Masimba Holdings Limited",
  province: "Harare",
  photo: "/profile/kamutero.png",
  shortBio:
    "General Manager – Subsidiaries at Masimba Holdings Limited, leading infrastructure development and engineering operations.",
  fullBio:
    "Irene Kamutero is General Manager – Subsidiaries at Masimba Holdings Limited, where she leads infrastructure development and engineering operations across the group's subsidiary businesses, with a focus on strategic asset management and corporate governance.",
  career: [],
  achievements: [
    "General Manager – Subsidiaries at Masimba Holdings Limited",
    "Leads infrastructure development and engineering operations across group subsidiaries",
    "Oversees strategic asset management and corporate governance",
  ],
  projects: [],
  awards: [],
  badges: [
    "Infrastructure Development",
    "Engineering Operations",
    "Strategic Asset Management",
    "Corporate Governance",
  ],
  linkedin: "#",
};

export const ENGINEERS: Engineer[] = [
  {
    id: "rutendo-chikafu",
    name: "Eng. Rutendo Chikafu",
    discipline: "Civil Engineer",
    organization: "City Infrastructure Authority",
    province: "Harare",
    photo:
      "/images/portrait-professional-young-black-woman-civil-engineer-architecture-worker-wearing-hard-hat-safety-working-construction-site-warehouseusing-laptop-work.jpg",
    shortBio:
      "Designs resilient urban infrastructure and water systems for Zimbabwe's fastest-growing city.",
    fullBio:
      "Rutendo specialises in municipal infrastructure, leading design teams on water reticulation and urban drainage projects that serve hundreds of thousands of residents across Harare's expanding suburbs.",
    career: [
      "Civil Engineer, City Infrastructure Authority (2020–Present)",
      "Site Engineer, regional roads programme (2017–2020)",
    ],
    achievements: [
      "Delivered a citywide stormwater drainage upgrade ahead of schedule",
      "Led the design review for three new residential water schemes",
    ],
    projects: ["Mabvuku water reticulation upgrade", "Harare South drainage masterplan"],
    awards: ["City Infrastructure Authority — Engineer of the Year, 2023"],
    badges: ["Mentor", "Professional Engineer"],
    linkedin: "#",
  },
  {
    id: "nyasha-mutasa",
    name: "Eng. Nyasha Mutasa",
    discipline: "Electrical Engineer",
    organization: "National Power Corporation",
    province: "Mashonaland West",
    photo: "/images/wie-bg-bg1.jpg",
    shortBio:
      "Specialises in power systems and rural electrification, bringing reliable energy to underserved communities.",
    fullBio:
      "Nyasha leads feasibility and design work for rural electrification schemes, with a focus on extending the national grid to communities that have never had reliable power.",
    career: [
      "Electrical Engineer, National Power Corporation (2018–Present)",
      "Graduate Engineer, regional substation programme (2015–2018)",
    ],
    achievements: [
      "Connected four rural districts to the national grid for the first time",
      "Trained over 30 technicians in substation safety protocols",
    ],
    projects: ["Mashonaland West rural electrification programme", "Substation modernisation initiative"],
    awards: ["STEM Advocacy Recognition, WiEZ 2022"],
    badges: ["STEM Advocate", "Industry Leader"],
    linkedin: "#",
  },
  {
    id: "chiedza-moyo",
    name: "Eng. Chiedza Moyo",
    discipline: "Mining Engineer",
    organization: "Highveld Mining Group",
    province: "Midlands",
    photo: "/images/woman-wearing-special-industrial-protective-equipment.jpg",
    shortBio:
      "Leads safety and process optimisation initiatives across underground and open-pit mining operations.",
    fullBio:
      "Chiedza focuses on operational safety and process efficiency in mining, having redesigned ventilation and extraction workflows that significantly reduced incident rates at her operations.",
    career: [
      "Mining Engineer, Highveld Mining Group (2019–Present)",
      "Junior Mining Engineer, open-pit operations (2016–2019)",
    ],
    achievements: [
      "Reduced underground incident rate by 35% through a ventilation redesign",
      "Published research on process optimisation in open-pit extraction",
    ],
    projects: ["Underground ventilation modernisation", "Open-pit extraction efficiency study"],
    awards: ["Highveld Mining Group — Safety Excellence Award, 2023"],
    badges: ["Researcher", "Professional Engineer"],
    linkedin: "#",
  },
  {
    id: "farai-ndlovu",
    name: "Eng. Farai Ndlovu",
    discipline: "Mechanical Engineer",
    organization: "Cascade Manufacturing",
    province: "Bulawayo",
    photo: "/images/automation-expert-smart-industrial-factory.jpg",
    shortBio:
      "Drives plant automation and maintenance excellence across large-scale manufacturing lines.",
    fullBio:
      "Farai leads automation upgrades on manufacturing lines, blending mechanical design expertise with a focus on predictive maintenance to keep production running at scale.",
    career: [
      "Mechanical Engineer, Cascade Manufacturing (2021–Present)",
      "Maintenance Engineer, regional bottling plant (2018–2021)",
    ],
    achievements: [
      "Implemented predictive maintenance, cutting unplanned downtime by 40%",
      "Led a plant-wide automation retrofit across two production lines",
    ],
    projects: ["Bulawayo plant automation retrofit", "Predictive maintenance rollout"],
    awards: ["Innovation in Manufacturing Award, 2024"],
    badges: ["Innovation Award", "Industry Leader"],
    linkedin: "#",
  },
  {
    id: "tariro-madziva",
    name: "Eng. Tariro Madziva",
    discipline: "Software Engineer",
    organization: "Fintech Solutions Zimbabwe",
    province: "Harare",
    photo:
      "/images/female-technician-supervising-automated-production-line.jpg",
    shortBio:
      "Builds resilient fintech platforms powering mobile money for millions of Zimbabweans.",
    fullBio:
      "Tariro leads backend engineering for a mobile money platform used by millions, with a focus on system reliability, fraud prevention and scaling for low-connectivity environments.",
    career: [
      "Senior Software Engineer, Fintech Solutions Zimbabwe (2020–Present)",
      "Software Engineer, e-commerce platform (2017–2020)",
    ],
    achievements: [
      "Scaled a mobile money platform to handle 5x transaction volume",
      "Mentors a cohort of women coding bootcamp graduates each year",
    ],
    projects: ["Mobile money platform reliability overhaul", "Low-connectivity offline-sync feature"],
    awards: ["WiEZ Innovation Award, 2023"],
    badges: ["STEM Advocate", "Mentor"],
    linkedin: "#",
  },
  {
    id: "privilege-gumbo",
    name: "Eng. Privilege Gumbo",
    discipline: "Telecommunications Engineer",
    organization: "National Telecom Network",
    province: "Manicaland",
    photo:
      "/images/pensive-black-female-engineer-hardhat-standing-warehouse-talking-cellphone-shelves-with-goods-background-copy-space-labor-communication-concept.jpg",
    shortBio:
      "Expands national fibre and mobile network coverage to connect Zimbabwe's most remote communities.",
    fullBio:
      "Privilege plans and oversees fibre and mobile network rollouts, with a particular focus on extending reliable connectivity to rural and underserved districts across the Eastern Highlands.",
    career: [
      "Telecommunications Engineer, National Telecom Network (2019–Present)",
      "Network Technician, regional fibre rollout (2016–2019)",
    ],
    achievements: [
      "Extended fibre coverage to six previously unconnected districts",
      "Co-authored a national rural connectivity research brief",
    ],
    projects: ["Eastern Highlands fibre expansion", "Rural mobile coverage research initiative"],
    awards: ["Researcher Recognition, WiEZ 2022"],
    badges: ["Researcher", "Professional Engineer"],
    linkedin: "#",
  },
];
