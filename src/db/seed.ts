import "./load-env";

import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { roles, users, userRoles } from "./schema";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/auth";

const ROLE_DEFINITIONS: { name: UserRole; description: string }[] = [
  {
    name: "super_admin",
    description: "Full, unrestricted access to every part of the platform.",
  },
  {
    name: "org_admin",
    description:
      "Organization-wide administrative access: members, events, payments, reports, content and settings.",
  },
  {
    name: "membership_officer",
    description:
      "Manages member records and membership applications, approvals and payments.",
  },
  {
    name: "events_manager",
    description:
      "Manages events, ticketing, attendance tracking and certificate generation.",
  },
  {
    name: "content_editor",
    description: "Manages website content, announcements and partner listings.",
  },
  {
    name: "member",
    description: "A registered WiEZ member with access to their own profile and resources.",
  },
];

type TestUser = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

const TEST_USERS: TestUser[] = [
  {
    name: "WiEZ Super Admin",
    email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@wiez.co.zw",
    password: process.env.SEED_SUPER_ADMIN_PASSWORD ?? "WiEZ@Admin2026!",
    role: "super_admin",
  },
  {
    name: "Test Org Admin",
    email: "orgadmin@wiez.co.zw",
    password: "WiEZ@OrgAdmin2026!",
    role: "org_admin",
  },
  {
    name: "Test Membership Officer",
    email: "membership@wiez.co.zw",
    password: "WiEZ@Membership2026!",
    role: "membership_officer",
  },
  {
    name: "Test Events Manager",
    email: "events@wiez.co.zw",
    password: "WiEZ@Events2026!",
    role: "events_manager",
  },
  {
    name: "Test Content Editor",
    email: "content@wiez.co.zw",
    password: "WiEZ@Content2026!",
    role: "content_editor",
  },
  {
    name: "Test Member",
    email: "member@wiez.co.zw",
    password: "WiEZ@Member2026!",
    role: "member",
  },
];

async function seedRoles() {
  console.log("Seeding roles...");
  for (const role of ROLE_DEFINITIONS) {
    const existing = await db.query.roles.findFirst({
      where: eq(roles.name, role.name),
    });
    if (existing) {
      console.log(`  - "${role.name}" already exists, skipping.`);
      continue;
    }
    await db.insert(roles).values(role);
    console.log(`  - created "${role.name}".`);
  }
}

async function seedUser({ name, email, password, role }: TestUser) {
  let userId: string | undefined;

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (existingUser) {
    console.log(`  - user "${email}" already exists, reusing.`);
    userId = existingUser.id;
  } else {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
    });
    if (!result.user?.id) {
      throw new Error(`Failed to create user "${email}" via auth.api.signUpEmail`);
    }
    userId = result.user.id;
    console.log(`  - created user "${email}".`);
  }

  // Test users must be able to sign in immediately, bypassing the normal
  // email verification requirement.
  await db.update(users).set({ emailVerified: true }).where(eq(users.id, userId));

  const dbRole = await db.query.roles.findFirst({
    where: eq(roles.name, role),
  });
  if (!dbRole) {
    throw new Error(`"${role}" role not found — did seedRoles() run first?`);
  }

  const existingAssignment = await db.query.userRoles.findFirst({
    where: and(eq(userRoles.userId, userId), eq(userRoles.roleId, dbRole.id)),
  });

  if (existingAssignment) {
    console.log(`  - "${role}" role already assigned.`);
  } else {
    await db.insert(userRoles).values({ userId, roleId: dbRole.id });
    console.log(`  - assigned "${role}" role.`);
  }
}

async function seedTestUsers() {
  console.log("Seeding test users...");
  for (const testUser of TEST_USERS) {
    console.log(`\n${testUser.role}:`);
    await seedUser(testUser);
  }
}

async function main() {
  await seedRoles();
  console.log();
  await seedTestUsers();

  console.log("\nSeed complete. Test accounts (all use the same flow, just sign in):\n");
  for (const testUser of TEST_USERS) {
    console.log(`  ${testUser.role.padEnd(20)} ${testUser.email.padEnd(28)} ${testUser.password}`);
  }
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
