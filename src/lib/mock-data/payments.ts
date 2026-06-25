export type PaymentMethod = "EcoCash" | "InnBucks" | "Bank Transfer" | "Visa/Mastercard";
export type PaymentTransactionStatus = "Completed" | "Pending" | "Failed" | "Refunded";
export type PaymentType = "Membership Fee" | "Event Ticket" | "Donation" | "Certification Fee";

export interface Payment {
  id: string;
  memberName: string;
  amount: number;
  type: PaymentType;
  method: PaymentMethod;
  date: string;
  status: PaymentTransactionStatus;
  reference: string;
}

export const MOCK_PAYMENTS: Payment[] = [
  { id: "pay_001", memberName: "Tanaka Moyo", amount: 45, type: "Event Ticket", method: "EcoCash", date: "2026-06-20", status: "Completed", reference: "PAY-2026-00231" },
  { id: "pay_002", memberName: "Rutendo Sibanda", amount: 45, type: "Event Ticket", method: "Visa/Mastercard", date: "2026-06-20", status: "Completed", reference: "PAY-2026-00232" },
  { id: "pay_003", memberName: "Sekai Gumbo", amount: 25, type: "Event Ticket", method: "EcoCash", date: "2026-06-17", status: "Pending", reference: "PAY-2026-00233" },
  { id: "pay_004", memberName: "Tsitsi Mpofu", amount: 120, type: "Membership Fee", method: "Bank Transfer", date: "2026-06-15", status: "Completed", reference: "PAY-2026-00234" },
  { id: "pay_005", memberName: "Yeukai Zulu", amount: 90, type: "Membership Fee", method: "InnBucks", date: "2026-06-10", status: "Pending", reference: "PAY-2026-00235" },
  { id: "pay_006", memberName: "Vimbai Dube", amount: 35, type: "Event Ticket", method: "EcoCash", date: "2026-06-18", status: "Completed", reference: "PAY-2026-00236" },
  { id: "pay_007", memberName: "Kudzai Khumalo", amount: 15, type: "Event Ticket", method: "EcoCash", date: "2026-06-16", status: "Completed", reference: "PAY-2026-00237" },
  { id: "pay_008", memberName: "Privilege Chivasa", amount: 90, type: "Membership Fee", method: "Bank Transfer", date: "2026-06-05", status: "Failed", reference: "PAY-2026-00238" },
  { id: "pay_009", memberName: "Memory Chitemerere", amount: 30, type: "Membership Fee", method: "EcoCash", date: "2026-05-28", status: "Refunded", reference: "PAY-2026-00211" },
  { id: "pay_010", memberName: "Tadiwanashe Muchenje", amount: 90, type: "Membership Fee", method: "Visa/Mastercard", date: "2026-05-22", status: "Completed", reference: "PAY-2026-00198" },
  { id: "pay_011", memberName: "Chipo Marufu", amount: 50, type: "Certification Fee", method: "Bank Transfer", date: "2026-05-19", status: "Completed", reference: "PAY-2026-00187" },
  { id: "pay_012", memberName: "Anesu Mlambo", amount: 20, type: "Donation", method: "EcoCash", date: "2026-05-12", status: "Completed", reference: "PAY-2026-00176" },
  { id: "pay_013", memberName: "Fadzai Chirwa", amount: 60, type: "Membership Fee", method: "InnBucks", date: "2026-05-08", status: "Completed", reference: "PAY-2026-00165" },
  { id: "pay_014", memberName: "Ropafadzo Mafuta", amount: 90, type: "Membership Fee", method: "EcoCash", date: "2026-05-03", status: "Completed", reference: "PAY-2026-00154" },
  { id: "pay_015", memberName: "Chiedza Mutasa", amount: 25, type: "Event Ticket", method: "EcoCash", date: "2026-04-27", status: "Completed", reference: "PAY-2026-00143" },
];

export const REVENUE_TREND = [
  { month: "Jan", revenue: 3120 },
  { month: "Feb", revenue: 3450 },
  { month: "Mar", revenue: 3780 },
  { month: "Apr", revenue: 3990 },
  { month: "May", revenue: 4150 },
  { month: "Jun", revenue: 4320 },
];

export const PAYMENT_STATS = {
  totalRevenue: 48920,
  pending: MOCK_PAYMENTS.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0),
  thisMonth: 4320,
};
