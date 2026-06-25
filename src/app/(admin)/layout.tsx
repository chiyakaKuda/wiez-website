import { requireAuth } from "@/lib/auth-utils";
import { Sidebar } from "@/components/admin/sidebar";
import { Topbar } from "@/components/admin/topbar";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar name={user.name} email={user.email} roles={user.roles} />
      <div className="lg:pl-60">
        <Topbar name={user.name} email={user.email} roles={user.roles} />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
