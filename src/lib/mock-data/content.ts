export type AnnouncementStatus = "Published" | "Draft";

export interface Announcement {
  id: string;
  title: string;
  publishedDate: string | null;
  status: AnnouncementStatus;
}

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "ann_001", title: "Registration opens for the 2026 Annual Engineering Summit", publishedDate: "2026-06-20", status: "Published" },
  { id: "ann_002", title: "New mentorship cohort for graduate engineers launching in July", publishedDate: "2026-06-15", status: "Published" },
  { id: "ann_003", title: "WiEZ partners with NUST for a joint research bursary", publishedDate: "2026-06-08", status: "Published" },
  { id: "ann_004", title: "Call for nominations: 2026 Women in Engineering Excellence Awards", publishedDate: "2026-06-01", status: "Published" },
  { id: "ann_005", title: "Member dues structure update for 2027 — draft for board review", publishedDate: null, status: "Draft" },
  { id: "ann_006", title: "Site safety workshop recap and certificate distribution", publishedDate: null, status: "Draft" },
];

export type PartnerStatus = "Active" | "Inactive";

export interface Partner {
  id: string;
  name: string;
  status: PartnerStatus;
}

export const MOCK_PARTNERS: Partner[] = [
  { id: "ptr_001", name: "ZESA Holdings", status: "Active" },
  { id: "ptr_002", name: "National University of Science and Technology", status: "Active" },
  { id: "ptr_003", name: "Old Mutual Zimbabwe", status: "Active" },
  { id: "ptr_004", name: "Zimplats", status: "Active" },
  { id: "ptr_005", name: "Econet Wireless", status: "Active" },
  { id: "ptr_006", name: "Bulawayo City Council Engineering Services", status: "Inactive" },
];

export type FeaturedEngineerStatus = "Featured" | "Archived";

export interface FeaturedEngineer {
  id: string;
  name: string;
  discipline: string;
  title: string;
  status: FeaturedEngineerStatus;
}

export const MOCK_FEATURED_ENGINEERS: FeaturedEngineer[] = [
  { id: "feng_001", name: "Eng. Nomathemba Sithole", discipline: "Civil", title: "Lead Structural Engineer, Harare City Council", status: "Featured" },
  { id: "feng_002", name: "Eng. Buhle Khumalo", discipline: "Mining", title: "Senior Mine Planning Engineer, Zimplats", status: "Featured" },
  { id: "feng_003", name: "Eng. Farai Madziva", discipline: "Electrical", title: "Power Systems Engineer, ZESA Holdings", status: "Archived" },
];

export const MOCK_PAGES = [
  { id: "page_001", title: "About WiEZ", lastUpdated: "2026-05-12" },
  { id: "page_002", title: "Membership Benefits", lastUpdated: "2026-04-30" },
  { id: "page_003", title: "Programs & Mentorship", lastUpdated: "2026-06-02" },
];

export const CONTENT_STATS = {
  publishedAnnouncements: MOCK_ANNOUNCEMENTS.filter((a) => a.status === "Published").length,
  draftContent: MOCK_ANNOUNCEMENTS.filter((a) => a.status === "Draft").length,
  activePartners: MOCK_PARTNERS.filter((p) => p.status === "Active").length,
  featuredEngineers: MOCK_FEATURED_ENGINEERS.filter((e) => e.status === "Featured").length,
};
