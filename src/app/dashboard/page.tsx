import { getCurrentUser } from "@/lib/auth-utils";
import { getRoleLabel } from "@/lib/rbac";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const roleLabel = user.roles.length
    ? user.roles.map(getRoleLabel).join(", ")
    : "Member";

  return (
    <main className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
      <div className="rounded-[20px] border border-navy/10 bg-white p-8 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)]">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
          Member Dashboard
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-navy">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 font-sans text-slate-custom">
          You have signed in as: <span className="font-semibold text-navy">{roleLabel}</span>
        </p>

        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-custom">
              Email
            </dt>
            <dd className="mt-1 font-sans font-semibold text-navy">{user.email}</dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-custom">
              Email Verified
            </dt>
            <dd className="mt-1 font-sans font-semibold text-navy">
              {user.emailVerified ? "Yes" : "No"}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-custom">
              Province
            </dt>
            <dd className="mt-1 font-sans font-semibold text-navy">
              {user.province ?? "Not set"}
            </dd>
          </div>
          <div>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-custom">
              Engineering Discipline
            </dt>
            <dd className="mt-1 font-sans font-semibold text-navy">
              {user.engineeringDiscipline ?? "Not set"}
            </dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
