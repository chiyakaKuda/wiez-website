import type { MembershipType } from "./members";

export type ApplicationStatus = "Pending" | "Active" | "Expired" | "Rejected";
export type PaymentStatus = "Paid" | "Unpaid" | "Waived";

export interface MembershipApplication {
  id: string;
  memberName: string;
  memberEmail: string;
  membershipType: MembershipType;
  appliedDate: string;
  approvedDate: string | null;
  expiryDate: string | null;
  paymentStatus: PaymentStatus;
  status: ApplicationStatus;
}

export const MOCK_MEMBERSHIP_APPLICATIONS: MembershipApplication[] = [
  { id: "app_001", memberName: "Nyasha Ncube", memberEmail: "nyasha.ncube@gmail.com", membershipType: "Professional", appliedDate: "2026-05-30", approvedDate: null, expiryDate: null, paymentStatus: "Paid", status: "Pending" },
  { id: "app_002", memberName: "Yeukai Zulu", memberEmail: "yeukai.zulu@gmail.com", membershipType: "Professional", appliedDate: "2026-06-10", approvedDate: null, expiryDate: null, paymentStatus: "Unpaid", status: "Pending" },
  { id: "app_003", memberName: "Shamiso Nyathi", memberEmail: "shamiso.nyathi@gmail.com", membershipType: "Graduate", appliedDate: "2026-06-18", approvedDate: null, expiryDate: null, paymentStatus: "Paid", status: "Pending" },
  { id: "app_004", memberName: "Charity Mahachi", memberEmail: "charity.mahachi@gmail.com", membershipType: "Student", appliedDate: "2026-06-21", approvedDate: null, expiryDate: null, paymentStatus: "Waived", status: "Pending" },
  { id: "app_005", memberName: "Patience Hwata", memberEmail: "patience.hwata@gmail.com", membershipType: "Corporate", appliedDate: "2026-06-22", approvedDate: null, expiryDate: null, paymentStatus: "Unpaid", status: "Pending" },
  { id: "app_006", memberName: "Tanaka Moyo", memberEmail: "tanaka.moyo@gmail.com", membershipType: "Professional", appliedDate: "2025-03-05", approvedDate: "2025-03-12", expiryDate: "2026-03-12", paymentStatus: "Paid", status: "Active" },
  { id: "app_007", memberName: "Rutendo Sibanda", memberEmail: "rutendo.sibanda@gmail.com", membershipType: "Graduate", appliedDate: "2025-03-20", approvedDate: "2025-03-28", expiryDate: "2026-03-28", paymentStatus: "Paid", status: "Active" },
  { id: "app_008", memberName: "Vimbai Dube", memberEmail: "vimbai.dube@gmail.com", membershipType: "Graduate", appliedDate: "2025-05-26", approvedDate: "2025-06-02", expiryDate: "2026-06-02", paymentStatus: "Paid", status: "Active" },
  { id: "app_009", memberName: "Sekai Gumbo", memberEmail: "sekai.gumbo@gmail.com", membershipType: "Professional", appliedDate: "2025-08-08", approvedDate: "2025-08-15", expiryDate: "2026-08-15", paymentStatus: "Paid", status: "Active" },
  { id: "app_010", memberName: "Fadzai Chirwa", memberEmail: "fadzai.chirwa@gmail.com", membershipType: "Student", appliedDate: "2024-11-10", approvedDate: "2024-11-18", expiryDate: "2025-11-18", paymentStatus: "Paid", status: "Expired" },
  { id: "app_011", memberName: "Privilege Chivasa", memberEmail: "privilege.chivasa@gmail.com", membershipType: "Professional", appliedDate: "2024-08-12", approvedDate: "2024-08-19", expiryDate: "2025-08-19", paymentStatus: "Paid", status: "Expired" },
  { id: "app_012", memberName: "Memory Chitemerere", memberEmail: "memory.chitemerere@gmail.com", membershipType: "Student", appliedDate: "2025-08-29", approvedDate: null, expiryDate: null, paymentStatus: "Unpaid", status: "Rejected" },
  { id: "app_013", memberName: "Blessing Marozva", memberEmail: "blessing.marozva@gmail.com", membershipType: "Corporate", appliedDate: "2026-04-02", approvedDate: null, expiryDate: null, paymentStatus: "Unpaid", status: "Rejected" },
  { id: "app_014", memberName: "Tadiwanashe Muchenje", memberEmail: "tadiwanashe.muchenje@gmail.com", membershipType: "Graduate", appliedDate: "2025-10-04", approvedDate: "2025-10-11", expiryDate: "2026-10-11", paymentStatus: "Paid", status: "Active" },
  { id: "app_015", memberName: "Tsitsi Mpofu", memberEmail: "tsitsi.mpofu@gmail.com", membershipType: "Corporate", appliedDate: "2026-01-14", approvedDate: "2026-01-21", expiryDate: "2027-01-21", paymentStatus: "Paid", status: "Active" },
];

export const MEMBERSHIP_TYPE_BREAKDOWN: { type: MembershipType; count: number }[] = [
  { type: "Professional", count: 480 },
  { type: "Graduate", count: 410 },
  { type: "Student", count: 320 },
  { type: "Corporate", count: 38 },
];

export const RECENT_APPROVALS = [
  { id: "act_001", memberName: "Tsitsi Mpofu", action: "Membership approved", timestamp: "2026-06-24T09:12:00Z" },
  { id: "act_002", memberName: "Tadiwanashe Muchenje", action: "Renewal approved", timestamp: "2026-06-22T14:40:00Z" },
  { id: "act_003", memberName: "Sekai Gumbo", action: "Membership approved", timestamp: "2026-06-20T11:05:00Z" },
  { id: "act_004", memberName: "Memory Chitemerere", action: "Application rejected — incomplete documentation", timestamp: "2026-06-19T16:22:00Z" },
  { id: "act_005", memberName: "Vimbai Dube", action: "Renewal approved", timestamp: "2026-06-17T10:08:00Z" },
];

export const MEMBERSHIP_STATS = {
  pendingApprovals: MOCK_MEMBERSHIP_APPLICATIONS.filter((a) => a.status === "Pending").length,
  activeMembers: 1086,
  expiredMemberships: MOCK_MEMBERSHIP_APPLICATIONS.filter((a) => a.status === "Expired").length,
  newThisMonth: 14,
};
