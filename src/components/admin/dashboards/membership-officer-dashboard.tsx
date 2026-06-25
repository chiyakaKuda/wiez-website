"use client";

import { toast } from "sonner";
import { Check, Clock, UserCheck, UserPlus, X } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { RecentActivity } from "@/components/admin/recent-activity";
import { Button } from "@/components/ui/button";
import {
  MEMBERSHIP_STATS,
  MEMBERSHIP_TYPE_BREAKDOWN,
  MOCK_MEMBERSHIP_APPLICATIONS,
  RECENT_APPROVALS,
} from "@/lib/mock-data";

const PIE_COLORS = ["#0F172A", "#0D9488", "#A3E635", "#94A3B8"];

export function MembershipOfficerDashboard() {
  const pendingApplications = MOCK_MEMBERSHIP_APPLICATIONS.filter(
    (application) => application.status === "Pending"
  );

  function handleApprove(memberName: string) {
    toast.success(`${memberName}'s application approved`);
  }

  function handleReject(memberName: string) {
    toast.error(`${memberName}'s application rejected`);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Approvals"
          value={MEMBERSHIP_STATS.pendingApprovals}
          icon={Clock}
          highlight={MEMBERSHIP_STATS.pendingApprovals > 0}
          index={0}
        />
        <StatCard
          title="Active Members"
          value={MEMBERSHIP_STATS.activeMembers.toLocaleString()}
          icon={UserCheck}
          index={1}
        />
        <StatCard
          title="Expired Memberships"
          value={MEMBERSHIP_STATS.expiredMemberships}
          icon={Clock}
          iconColor="#DC2626"
          index={2}
        />
        <StatCard
          title="New This Month"
          value={MEMBERSHIP_STATS.newThisMonth}
          change="+18% from last month"
          changeType="positive"
          icon={UserPlus}
          index={3}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-navy">
          Pending Membership Applications
        </h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 font-nav font-medium">Name</th>
                <th className="py-2 pr-3 font-nav font-medium">Type</th>
                <th className="py-2 pr-3 font-nav font-medium">Submitted</th>
                <th className="py-2 pr-3 font-nav font-medium">Payment</th>
                <th className="py-2 font-nav font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                >
                  <td className="py-2.5 pr-3">
                    <p className="font-sans text-sm font-medium text-navy">
                      {application.memberName}
                    </p>
                    <p className="font-sans text-xs text-slate-400">{application.memberEmail}</p>
                  </td>
                  <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                    {application.membershipType}
                  </td>
                  <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                    {application.appliedDate}
                  </td>
                  <td className="py-2.5 pr-3">
                    <StatusBadge status={application.paymentStatus} />
                  </td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleApprove(application.memberName)}
                        className="h-8 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
                      >
                        <Check className="size-3.5" />
                        Approve
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleReject(application.memberName)}
                        className="h-8 rounded-[6px] text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <X className="size-3.5" />
                        Reject
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {pendingApplications.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center font-sans text-sm text-slate-400">
                    No pending applications right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Recent Approvals</h3>
          <div className="mt-4">
            <RecentActivity items={RECENT_APPROVALS} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">
            Membership Type Breakdown
          </h3>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MEMBERSHIP_TYPE_BREAKDOWN}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {MEMBERSHIP_TYPE_BREAKDOWN.map((entry, index) => (
                    <Cell key={entry.type} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#64748B" }} iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
