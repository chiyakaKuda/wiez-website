import type { UserRole } from "@/types/auth";

export type SystemUserStatus = "Active" | "Suspended";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: SystemUserStatus;
  lastLogin: string | null;
  createdAt: string;
}

export const MOCK_SYSTEM_USERS: SystemUser[] = [
  { id: "usr_001", name: "WiEZ Super Admin", email: "admin@wiez.co.zw", role: "super_admin", status: "Active", lastLogin: "2026-06-25T07:10:00Z", createdAt: "2025-01-15" },
  { id: "usr_002", name: "Test Org Admin", email: "orgadmin@wiez.co.zw", role: "org_admin", status: "Active", lastLogin: "2026-06-24T15:32:00Z", createdAt: "2025-02-02" },
  { id: "usr_003", name: "Test Membership Officer", email: "membership@wiez.co.zw", role: "membership_officer", status: "Active", lastLogin: "2026-06-25T06:45:00Z", createdAt: "2025-02-10" },
  { id: "usr_004", name: "Test Events Manager", email: "events@wiez.co.zw", role: "events_manager", status: "Active", lastLogin: "2026-06-23T11:20:00Z", createdAt: "2025-02-18" },
  { id: "usr_005", name: "Test Content Editor", email: "content@wiez.co.zw", role: "content_editor", status: "Active", lastLogin: "2026-06-22T09:05:00Z", createdAt: "2025-03-01" },
  { id: "usr_006", name: "Tatenda Mawere", email: "tatenda.mawere@wiez.co.zw", role: "org_admin", status: "Suspended", lastLogin: "2026-04-11T08:50:00Z", createdAt: "2025-04-22" },
  { id: "usr_007", name: "Linda Chigodora", email: "linda.chigodora@wiez.co.zw", role: "events_manager", status: "Active", lastLogin: "2026-06-19T13:14:00Z", createdAt: "2025-05-30" },
  { id: "usr_008", name: "Test Member", email: "member@wiez.co.zw", role: "member", status: "Active", lastLogin: "2026-06-21T18:02:00Z", createdAt: "2025-06-12" },
];
