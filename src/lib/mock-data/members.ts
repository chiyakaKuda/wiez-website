import type { EngineeringDiscipline, ZimbabweProvince } from "@/types/auth";

export type MembershipType = "Student" | "Graduate" | "Professional" | "Corporate";
export type MemberStatus = "Active" | "Pending" | "Expired" | "Rejected" | "Suspended";

export interface Member {
  id: string;
  membershipNumber: string;
  name: string;
  email: string;
  phone: string;
  province: ZimbabweProvince;
  discipline: EngineeringDiscipline;
  membershipType: MembershipType;
  status: MemberStatus;
  joinedDate: string;
}

export const MOCK_MEMBERS: Member[] = [
  { id: "mem_001", membershipNumber: "WIEZ-2026-0001", name: "Tanaka Moyo", email: "tanaka.moyo@gmail.com", phone: "+263 77 123 4501", province: "Harare", discipline: "Civil", membershipType: "Professional", status: "Active", joinedDate: "2025-03-12" },
  { id: "mem_002", membershipNumber: "WIEZ-2026-0002", name: "Rutendo Sibanda", email: "rutendo.sibanda@gmail.com", phone: "+263 77 123 4502", province: "Bulawayo", discipline: "Electrical", membershipType: "Graduate", status: "Active", joinedDate: "2025-03-28" },
  { id: "mem_003", membershipNumber: "WIEZ-2026-0003", name: "Chiedza Mutasa", email: "chiedza.mutasa@gmail.com", phone: "+263 71 234 5603", province: "Manicaland", discipline: "Mechanical", membershipType: "Student", status: "Active", joinedDate: "2025-04-09" },
  { id: "mem_004", membershipNumber: "WIEZ-2026-0004", name: "Nyasha Ncube", email: "nyasha.ncube@gmail.com", phone: "+263 78 345 6704", province: "Mashonaland Central", discipline: "Chemical", membershipType: "Professional", status: "Pending", joinedDate: "2026-05-30" },
  { id: "mem_005", membershipNumber: "WIEZ-2026-0005", name: "Tariro Chikwava", email: "tariro.chikwava@gmail.com", phone: "+263 77 456 7805", province: "Mashonaland East", discipline: "Mining", membershipType: "Professional", status: "Active", joinedDate: "2025-05-14" },
  { id: "mem_006", membershipNumber: "WIEZ-2026-0006", name: "Vimbai Dube", email: "vimbai.dube@gmail.com", phone: "+263 71 567 8906", province: "Mashonaland West", discipline: "Environmental", membershipType: "Graduate", status: "Active", joinedDate: "2025-06-02" },
  { id: "mem_007", membershipNumber: "WIEZ-2026-0007", name: "Rumbidzai Mhlanga", email: "rumbidzai.mhlanga@gmail.com", phone: "+263 78 678 9007", province: "Masvingo", discipline: "Computer", membershipType: "Corporate", status: "Active", joinedDate: "2025-06-21" },
  { id: "mem_008", membershipNumber: "WIEZ-2026-0008", name: "Fadzai Chirwa", email: "fadzai.chirwa@gmail.com", phone: "+263 77 789 0108", province: "Matabeleland North", discipline: "Structural", membershipType: "Student", status: "Expired", joinedDate: "2024-11-18" },
  { id: "mem_009", membershipNumber: "WIEZ-2026-0009", name: "Chipo Marufu", email: "chipo.marufu@gmail.com", phone: "+263 71 890 1209", province: "Matabeleland South", discipline: "Biomedical", membershipType: "Graduate", status: "Active", joinedDate: "2025-07-30" },
  { id: "mem_010", membershipNumber: "WIEZ-2026-0010", name: "Sekai Gumbo", email: "sekai.gumbo@gmail.com", phone: "+263 78 901 2310", province: "Midlands", discipline: "Industrial", membershipType: "Professional", status: "Active", joinedDate: "2025-08-15" },
  { id: "mem_011", membershipNumber: "WIEZ-2026-0011", name: "Memory Chitemerere", email: "memory.chitemerere@gmail.com", phone: "+263 77 012 3411", province: "Harare", discipline: "Agricultural", membershipType: "Student", status: "Rejected", joinedDate: "2025-09-05" },
  { id: "mem_012", membershipNumber: "WIEZ-2026-0012", name: "Ropafadzo Mafuta", email: "ropafadzo.mafuta@gmail.com", phone: "+263 71 123 4512", province: "Bulawayo", discipline: "Electrical", membershipType: "Professional", status: "Active", joinedDate: "2025-09-22" },
  { id: "mem_013", membershipNumber: "WIEZ-2026-0013", name: "Tadiwanashe Muchenje", email: "tadiwanashe.muchenje@gmail.com", phone: "+263 78 234 5613", province: "Manicaland", discipline: "Civil", membershipType: "Graduate", status: "Active", joinedDate: "2025-10-11" },
  { id: "mem_014", membershipNumber: "WIEZ-2026-0014", name: "Privilege Chivasa", email: "privilege.chivasa@gmail.com", phone: "+263 77 345 6714", province: "Mashonaland Central", discipline: "Mechanical", membershipType: "Professional", status: "Suspended", joinedDate: "2024-08-19" },
  { id: "mem_015", membershipNumber: "WIEZ-2026-0015", name: "Anesu Mlambo", email: "anesu.mlambo@gmail.com", phone: "+263 71 456 7815", province: "Mashonaland East", discipline: "Computer", membershipType: "Student", status: "Active", joinedDate: "2025-11-08" },
  { id: "mem_016", membershipNumber: "WIEZ-2026-0016", name: "Kudzai Khumalo", email: "kudzai.khumalo@gmail.com", phone: "+263 78 567 8916", province: "Mashonaland West", discipline: "Mining", membershipType: "Graduate", status: "Active", joinedDate: "2025-12-03" },
  { id: "mem_017", membershipNumber: "WIEZ-2026-0017", name: "Yeukai Zulu", email: "yeukai.zulu@gmail.com", phone: "+263 77 678 9017", province: "Masvingo", discipline: "Chemical", membershipType: "Professional", status: "Pending", joinedDate: "2026-06-10" },
  { id: "mem_018", membershipNumber: "WIEZ-2026-0018", name: "Tsitsi Mpofu", email: "tsitsi.mpofu@gmail.com", phone: "+263 71 789 0118", province: "Matabeleland North", discipline: "Environmental", membershipType: "Corporate", status: "Active", joinedDate: "2026-01-21" },
  { id: "mem_019", membershipNumber: "WIEZ-2026-0019", name: "Shamiso Nyathi", email: "shamiso.nyathi@gmail.com", phone: "+263 78 890 1219", province: "Matabeleland South", discipline: "Structural", membershipType: "Graduate", status: "Pending", joinedDate: "2026-06-18" },
  { id: "mem_020", membershipNumber: "WIEZ-2026-0020", name: "Vongai Mukamuri", email: "vongai.mukamuri@gmail.com", phone: "+263 77 901 2320", province: "Midlands", discipline: "Other", membershipType: "Student", status: "Active", joinedDate: "2026-02-27" },
];

export const PROVINCE_DISTRIBUTION: { province: ZimbabweProvince; members: number }[] = [
  { province: "Harare", members: 412 },
  { province: "Bulawayo", members: 198 },
  { province: "Manicaland", members: 121 },
  { province: "Mashonaland East", members: 94 },
  { province: "Masvingo", members: 88 },
  { province: "Mashonaland Central", members: 87 },
  { province: "Mashonaland West", members: 76 },
  { province: "Midlands", members: 72 },
  { province: "Matabeleland North", members: 52 },
  { province: "Matabeleland South", members: 48 },
];

export const DISCIPLINE_DISTRIBUTION: { discipline: EngineeringDiscipline; members: number }[] = [
  { discipline: "Electrical", members: 224 },
  { discipline: "Civil", members: 198 },
  { discipline: "Mechanical", members: 187 },
  { discipline: "Computer", members: 156 },
  { discipline: "Mining", members: 112 },
  { discipline: "Chemical", members: 94 },
  { discipline: "Structural", members: 72 },
  { discipline: "Environmental", members: 68 },
  { discipline: "Industrial", members: 58 },
  { discipline: "Biomedical", members: 41 },
  { discipline: "Agricultural", members: 28 },
  { discipline: "Other", members: 10 },
];

export const MEMBER_GROWTH_TREND = [
  { month: "Jan", members: 1042 },
  { month: "Feb", members: 1089 },
  { month: "Mar", members: 1124 },
  { month: "Apr", members: 1167 },
  { month: "May", members: 1201 },
  { month: "Jun", members: 1248 },
];

export const MEMBER_STATS = {
  totalMembers: 1248,
  activeMembers: 1086,
  upcomingEvents: 6,
};
