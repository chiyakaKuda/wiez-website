export type PartnerCategory =
  | "Corporate Partners"
  | "Academic Institutions"
  | "Government Agencies"
  | "Professional Bodies"
  | "Technology Partners";

export type Partner = {
  id: string;
  name: string;
  logo: string;
  category: PartnerCategory;
  description: string;
  website: string;
};
