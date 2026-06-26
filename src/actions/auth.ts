"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { roles, userRoles } from "@/db/schema";
import { getUserWithRoles } from "@/lib/auth-utils";
import { isAdminRole, getRoleLabel } from "@/lib/rbac";
import { type ActionResult, errorMessage } from "@/lib/action-result";
import type { UserRole, ZimbabweProvince, EngineeringDiscipline } from "@/types/auth";

type SignInData = {
  redirectTo: string;
  roles: UserRole[];
  roleLabel: string;
};

export async function signInAction(
  email: string,
  password: string,
  rememberMe = true
): Promise<ActionResult<SignInData>> {
  try {
    const result = await auth.api.signInEmail({
      body: { email, password, rememberMe },
      headers: await headers(),
    });

    const userWithRoles = result.user?.id
      ? await getUserWithRoles(result.user.id)
      : null;
    const userRoles = userWithRoles?.roles ?? [];
    const isAdmin = userRoles.some((role) => isAdminRole(role));

    return {
      success: true,
      data: {
        redirectTo: isAdmin ? "/admin" : "/dashboard",
        roles: userRoles,
        roleLabel: userRoles.length
          ? userRoles.map(getRoleLabel).join(", ")
          : "Member",
      },
    };
  } catch (error) {
    return { success: false, error: errorMessage(error) || "Invalid email or password" };
  }
}

export type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  province?: ZimbabweProvince;
  engineeringDiscipline?: EngineeringDiscipline;
};

export async function signUpAction(
  formData: SignUpFormData
): Promise<ActionResult<{ redirectTo: string }>> {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        province: formData.province,
        engineeringDiscipline: formData.engineeringDiscipline,
      },
      headers: await headers(),
    });

    const memberRole = await db.query.roles.findFirst({
      where: eq(roles.name, "member"),
    });

    if (memberRole && result.user?.id) {
      await db.insert(userRoles).values({
        userId: result.user.id,
        roleId: memberRole.id,
      });
    }

    // New sign-ups always get the "member" role, so the dashboard (not
    // /admin) is always the right landing page now that autoSignIn is on.
    return { success: true, data: { redirectTo: "/dashboard" } };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function signOutAction(): Promise<ActionResult> {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function forgotPasswordAction(
  email: string
): Promise<ActionResult> {
  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "/reset-password" },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function resetPasswordAction(
  token: string,
  newPassword: string
): Promise<ActionResult> {
  try {
    await auth.api.resetPassword({
      body: { token, newPassword },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function verifyEmailAction(
  token: string
): Promise<ActionResult> {
  try {
    await auth.api.verifyEmail({
      query: { token },
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
