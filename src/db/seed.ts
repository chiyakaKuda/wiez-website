import "./load-env";

import { eq } from "drizzle-orm";
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

async function seedSuperAdmin() {
  const name = "WiEZ Super Admin";
  const email = process.env.SEED_SUPER_ADMIN_EMAIL ?? "admin@wiez.co.zw";
  const password = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "WiEZ@Admin2026!";

  console.log("Seeding super admin user...");

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
      throw new Error("Failed to create super admin user via auth.api.signUpEmail");
    }
    userId = result.user.id;
    console.log(`  - created user "${email}".`);
  }

  // The super admin must be able to sign in immediately, bypassing the
  // normal email verification requirement.
  await db
    .update(users)
    .set({ emailVerified: true })
    .where(eq(users.id, userId));

  const superAdminRole = await db.query.roles.findFirst({
    where: eq(roles.name, "super_admin"),
  });
  if (!superAdminRole) {
    throw new Error('"super_admin" role not found — did seedRoles() run first?');
  }

  const existingAssignment = await db.query.userRoles.findFirst({
    where: (table, { and, eq: equals }) =>
      and(equals(table.userId, userId!), equals(table.roleId, superAdminRole.id)),
  });

  if (existingAssignment) {
    console.log("  - super_admin role already assigned.");
  } else {
    await db.insert(userRoles).values({
      userId,
      roleId: superAdminRole.id,
    });
    console.log("  - assigned super_admin role.");
  }

  console.log(`\nSuper admin ready:\n  email: ${email}\n  password: ${password}`);
}

async function main() {
  await seedRoles();
  await seedSuperAdmin();
  console.log("\nSeed complete.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));
