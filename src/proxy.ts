import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { getUserWithRoles } from "@/lib/auth-utils";
import { isAdminRole, SECTION_ROLES } from "@/lib/rbac";

// Sub-paths under /admin that require a specific subset of roles, beyond
// the general "any admin role" check applied to /admin/* as a whole.
const ADMIN_SUB_ROUTE_ROLES = Object.entries(SECTION_ROLES).map(([section, roles]) => ({
  prefix: `/admin/${section}`,
  roles,
}));

const AUTH_PAGES = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthPage = AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  if (!isDashboardRoute && !isAdminRoute && !isAuthPage) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    if (isAuthPage) return NextResponse.next();

    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  const userWithRoles = await getUserWithRoles(session.user.id);
  const userRoles = userWithRoles?.roles ?? [];
  const isAdmin = userRoles.some((role) => isAdminRole(role));

  if (isAuthPage) {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin" : "/dashboard", request.url)
    );
  }

  if (isAdminRoute) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    const subRoute = ADMIN_SUB_ROUTE_ROLES.find((route) =>
      pathname.startsWith(route.prefix)
    );
    if (subRoute && !subRoute.roles.some((role) => userRoles.includes(role))) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/auth|favicon.ico).*)"],
};
