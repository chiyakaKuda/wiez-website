export interface Certificate {
  id: string;
  title: string;
  issuedDate: string;
  eventName: string;
}

export const MOCK_CERTIFICATES: Certificate[] = [
  { id: "cert_001", title: "Site Safety & Standards Certification", issuedDate: "2026-05-09", eventName: "Structural Engineering Certification Bootcamp" },
  { id: "cert_002", title: "Certificate of Attendance", issuedDate: "2026-04-12", eventName: "Civil Engineering Site Tour — Kariba South" },
  { id: "cert_003", title: "Mentorship Program Completion", issuedDate: "2026-01-30", eventName: "Graduate Engineers Mentorship Cohort 3" },
];
