export type EventType = "Free" | "Paid" | "Member Only";
export type EventStatus = "Upcoming" | "Open" | "Sold Out" | "Completed" | "Cancelled";

export interface EventItem {
  id: string;
  name: string;
  date: string;
  venue: string;
  type: EventType;
  capacity: number;
  registrations: number;
  status: EventStatus;
}

export const MOCK_EVENTS: EventItem[] = [
  { id: "evt_001", name: "WiEZ Annual Engineering Summit 2026", date: "2026-07-18", venue: "Harare International Conference Centre", type: "Paid", capacity: 400, registrations: 312, status: "Open" },
  { id: "evt_002", name: "Women in Mining Engineering Breakfast", date: "2026-07-04", venue: "Rainbow Towers Hotel, Harare", type: "Member Only", capacity: 120, registrations: 120, status: "Sold Out" },
  { id: "evt_003", name: "Graduate Engineers Mentorship Launch", date: "2026-07-11", venue: "NUST Conference Centre, Bulawayo", type: "Free", capacity: 150, registrations: 96, status: "Open" },
  { id: "evt_004", name: "Site Safety & Standards Workshop", date: "2026-08-01", venue: "Celebration Centre, Mutare", type: "Paid", capacity: 80, registrations: 41, status: "Open" },
  { id: "evt_005", name: "Women in STEM Career Fair", date: "2026-08-15", venue: "ZITF Grounds, Bulawayo", type: "Free", capacity: 500, registrations: 188, status: "Upcoming" },
  { id: "evt_006", name: "Renewable Energy Innovation Roundtable", date: "2026-08-22", venue: "Crowne Plaza Monomotapa, Harare", type: "Member Only", capacity: 100, registrations: 54, status: "Upcoming" },
  { id: "evt_007", name: "Structural Engineering Certification Bootcamp", date: "2026-05-09", venue: "Holiday Inn, Mutare", type: "Paid", capacity: 60, registrations: 58, status: "Completed" },
  { id: "evt_008", name: "International Women in Engineering Day Gala", date: "2026-06-23", venue: "Rainbow Towers Hotel, Harare", type: "Paid", capacity: 350, registrations: 340, status: "Completed" },
  { id: "evt_009", name: "Civil Engineering Site Tour — Kariba South", date: "2026-04-12", venue: "Kariba South Power Station", type: "Member Only", capacity: 40, registrations: 36, status: "Completed" },
  { id: "evt_010", name: "Young Engineers Hackathon", date: "2026-03-21", venue: "University of Zimbabwe, Harare", type: "Free", capacity: 200, registrations: 0, status: "Cancelled" },
];

export type RegistrationPaymentStatus = "Paid" | "Unpaid" | "Free";

export interface EventRegistration {
  id: string;
  memberName: string;
  eventName: string;
  ticketNumber: string;
  paymentStatus: RegistrationPaymentStatus;
  registeredDate: string;
}

export const MOCK_REGISTRATIONS: EventRegistration[] = [
  { id: "reg_001", memberName: "Tanaka Moyo", eventName: "WiEZ Annual Engineering Summit 2026", ticketNumber: "TCK-2026-0312", paymentStatus: "Paid", registeredDate: "2026-06-20" },
  { id: "reg_002", memberName: "Rutendo Sibanda", eventName: "WiEZ Annual Engineering Summit 2026", ticketNumber: "TCK-2026-0313", paymentStatus: "Paid", registeredDate: "2026-06-20" },
  { id: "reg_003", memberName: "Chiedza Mutasa", eventName: "Graduate Engineers Mentorship Launch", ticketNumber: "TCK-2026-0314", paymentStatus: "Free", registeredDate: "2026-06-19" },
  { id: "reg_004", memberName: "Vimbai Dube", eventName: "Women in Mining Engineering Breakfast", ticketNumber: "TCK-2026-0315", paymentStatus: "Paid", registeredDate: "2026-06-18" },
  { id: "reg_005", memberName: "Sekai Gumbo", eventName: "Site Safety & Standards Workshop", ticketNumber: "TCK-2026-0316", paymentStatus: "Unpaid", registeredDate: "2026-06-17" },
  { id: "reg_006", memberName: "Kudzai Khumalo", eventName: "Women in STEM Career Fair", ticketNumber: "TCK-2026-0317", paymentStatus: "Free", registeredDate: "2026-06-16" },
  { id: "reg_007", memberName: "Tsitsi Mpofu", eventName: "Renewable Energy Innovation Roundtable", ticketNumber: "TCK-2026-0318", paymentStatus: "Paid", registeredDate: "2026-06-15" },
  { id: "reg_008", memberName: "Anesu Mlambo", eventName: "WiEZ Annual Engineering Summit 2026", ticketNumber: "TCK-2026-0319", paymentStatus: "Paid", registeredDate: "2026-06-14" },
];

export const REGISTRATIONS_TREND = [
  { month: "Jan", registrations: 84 },
  { month: "Feb", registrations: 102 },
  { month: "Mar", registrations: 95 },
  { month: "Apr", registrations: 130 },
  { month: "May", registrations: 148 },
  { month: "Jun", registrations: 176 },
];

export const EVENTS_STATS = {
  upcomingEvents: MOCK_EVENTS.filter((e) => e.status === "Upcoming" || e.status === "Open").length,
  totalRegistrations: MOCK_EVENTS.reduce((sum, e) => sum + e.registrations, 0),
  ticketsIssued: MOCK_REGISTRATIONS.length * 47,
  attendanceRate: 87,
};
