import type { UserRole } from "@/types/auth";

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: ["*"], // all permissions
  org_admin: [
    "members:read",
    "members:write",
    "members:delete",
    "events:read",
    "events:write",
    "events:delete",
    "payments:read",
    "payments:write",
    "reports:read",
    "content:read",
    "content:write",
    "settings:read",
    "settings:write",
    "users:read",
    "users:write",
  ],
  membership_officer: [
    "members:read",
    "members:write",
    "memberships:read",
    "memberships:write",
    "memberships:approve",
    "payments:read",
    "reports:read",
  ],
  events_manager: [
    "events:read",
    "events:write",
    "events:delete",
    "tickets:read",
    "tickets:write",
    "attendance:read",
    "attendance:write",
    "certificates:generate",
  ],
  content_editor: [
    "content:read",
    "content:write",
    "announcements:read",
    "announcements:write",
    "partners:read",
    "partners:write",
  ],
  member: [
    "profile:read",
    "profile:write",
    "events:read",
    "membership:read",
    "certificates:read",
    "payments:read",
  ],
};

/** Roles that can access at least one /admin/* route. */
export const ADMIN_ROLES: UserRole[] = [
  "super_admin",
  "org_admin",
  "membership_officer",
  "events_manager",
  "content_editor",
];

/** Roles allowed into each /admin/* sub-section, shared by proxy.ts and each route's own layout. */
export const SECTION_ROLES = {
  members: ["membership_officer", "org_admin", "super_admin"],
  memberships: ["membership_officer", "org_admin", "super_admin"],
  events: ["events_manager", "org_admin", "super_admin"],
  payments: ["membership_officer", "org_admin", "super_admin"],
  content: ["content_editor", "org_admin", "super_admin"],
  reports: ["org_admin", "super_admin"],
  settings: ["org_admin", "super_admin"],
  users: ["super_admin"],
} as const satisfies Record<string, UserRole[]>;

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  org_admin: "Organization Admin",
  membership_officer: "Membership Officer",
  events_manager: "Events Manager",
  content_editor: "Content Editor",
  member: "Member",
};

export function getRoleLabel(role: string): string {
  return ROLE_LABELS[role as UserRole] ?? role;
}

export function hasPermission(
  userRoles: string[],
  permission: string
): boolean {
  return userRoles.some((role) => {
    const permissions = ROLE_PERMISSIONS[role as UserRole];
    if (!permissions) return false;
    return permissions.includes("*") || permissions.includes(permission);
  });
}

export function hasRole(userRoles: string[], role: string): boolean {
  return userRoles.includes(role);
}

export function isAdminRole(role: string): boolean {
  return ADMIN_ROLES.includes(role as UserRole);
}
