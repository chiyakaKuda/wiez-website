import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users, roles, userRoles } from "@/db/schema";
import { hasPermission, hasRole } from "@/lib/rbac";
import type { UserRole, UserWithRoles } from "@/types/auth";

/** Fetch a user and their assigned role names directly from the database. */
export async function getUserWithRoles(
  userId: string
): Promise<UserWithRoles | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });
  if (!user) return null;

  const assignedRoles = await db
    .select({ name: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, userId));

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    province: user.province ?? undefined,
    engineeringDiscipline: user.engineeringDiscipline ?? undefined,
    roles: assignedRoles.map((r) => r.name as UserRole),
    emailVerified: user.emailVerified,
    image: user.image ?? undefined,
    createdAt: user.createdAt,
  };
}

/** Get the current session's user with roles, memoized per request. */
export const getCurrentUser = cache(async (): Promise<UserWithRoles | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  return getUserWithRoles(session.user.id);
});

/** Redirect to /sign-in if there is no authenticated user. */
export async function requireAuth(): Promise<UserWithRoles> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

/** Redirect if the user doesn't have at least one of the given roles. */
export async function requireRole(rolesAllowed: UserRole[]): Promise<UserWithRoles> {
  const user = await requireAuth();
  const allowed = rolesAllowed.some((role) => hasRole(user.roles, role));
  if (!allowed) {
    redirect("/dashboard");
  }
  return user;
}

/** Redirect if the user lacks the given permission. */
export async function requirePermission(permission: string): Promise<UserWithRoles> {
  const user = await requireAuth();
  if (!hasPermission(user.roles, permission)) {
    redirect("/dashboard");
  }
  return user;
}
