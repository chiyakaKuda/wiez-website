import "./load-env";

import { eq, and } from "drizzle-orm";
import { db } from "./index";
import { roles, users, userRoles, membershipTypes } from "./schema";
import { auth } from "@/lib/auth";
import type { UserRole } from "@/types/auth";
import type { MembershipTypeName } from "@/types/memberships";

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

type MembershipTypeDefinition = {
  name: MembershipTypeName;
  description: string;
  fee: number;
  eligibilityCriteria: string;
  requiredDocuments: string[];
  benefits: string[];
  terms: string;
};

const MEMBERSHIP_TYPE_DEFINITIONS: MembershipTypeDefinition[] = [
  {
    name: "Student",
    description: "For students currently pursuing an engineering qualification.",
    fee: 10,
    eligibilityCriteria:
      "Currently enrolled in an engineering degree program at a recognized Zimbabwean or international institution.",
    requiredDocuments: ["Student ID", "Proof of Enrollment", "CV", "Passport Photo"],
    benefits: [
      "Professional Development Workshops",
      "National Networking Events",
      "Mentorship Programme Access",
      "Digital Membership Certificate & Card",
      "Recognition in WiEZ Directory",
    ],
    terms:
      "Student membership is valid only while enrolled. Members must provide updated proof of enrollment annually upon renewal.",
  },
  {
    name: "Graduate",
    description: "For recent engineering graduates building their careers.",
    fee: 25,
    eligibilityCriteria:
      "Engineering graduate within 5 years of graduation, holding a recognized engineering qualification.",
    requiredDocuments: ["Degree Certificate", "CV", "Professional Headshot", "Transcript (Optional)"],
    benefits: [
      "Professional Development Workshops",
      "National Networking Events",
      "Mentorship Programme Access",
      "Digital Membership Certificate & Card",
      "Recognition in WiEZ Directory",
      "Access to Job Board & Career Resources",
    ],
    terms:
      "Graduate membership is available for up to 5 years from your graduation date, after which you must transition to Professional membership upon renewal.",
  },
  {
    name: "Professional",
    description: "For practicing engineers with 5+ years of experience.",
    fee: 50,
    eligibilityCriteria:
      "Practicing engineer with 5 or more years of professional experience in an engineering discipline.",
    requiredDocuments: [
      "Degree Certificate",
      "CV",
      "Professional Headshot",
      "Proof of Employment",
      "Engineering Council Registration (Optional)",
    ],
    benefits: [
      "Professional Development Workshops",
      "National Networking Events",
      "Mentorship Programme Access",
      "Digital Membership Certificate & Card",
      "Recognition in WiEZ Directory",
      "Access to Job Board & Career Resources",
      "Priority speaking opportunities at WiEZ events",
    ],
    terms:
      "Professional membership requires 5 or more years of verifiable engineering experience. WiEZ reserves the right to request updated proof of employment at renewal.",
  },
  {
    name: "Corporate",
    description: "For organizations championing women in engineering.",
    fee: 200,
    eligibilityCriteria:
      "Registered companies and organizations that actively support women in engineering within Zimbabwe.",
    requiredDocuments: [
      "Certificate of Incorporation",
      "Company Profile",
      "Tax Clearance (Optional)",
      "Letter of Intent",
    ],
    benefits: [
      "Organizational recognition in the WiEZ Directory",
      "Access to the WiEZ talent pipeline and job board postings",
      "Invitation to WiEZ corporate partner events",
      "Co-branded women-in-engineering initiatives",
      "Annual impact reporting support",
      "Logo placement on the WiEZ corporate partners page",
    ],
    terms:
      "Corporate membership covers the organization as a whole and is subject to the Corporate Membership Terms in Section 6.6 of the WiEZ Membership Terms and Conditions.",
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

async function seedMembershipTypes() {
  console.log("Seeding membership types...");
  for (const membershipType of MEMBERSHIP_TYPE_DEFINITIONS) {
    const existing = await db.query.membershipTypes.findFirst({
      where: eq(membershipTypes.name, membershipType.name),
    });
    if (existing) {
      console.log(`  - "${membershipType.name}" already exists, skipping.`);
      continue;
    }
    await db.insert(membershipTypes).values(membershipType);
    console.log(`  - created "${membershipType.name}" ($${membershipType.fee}/year).`);
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
  await seedMembershipTypes();
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
