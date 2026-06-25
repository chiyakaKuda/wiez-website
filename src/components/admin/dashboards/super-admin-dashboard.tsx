"use client";

import { Calendar, DollarSign, UserCheck, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  DISCIPLINE_DISTRIBUTION,
  MEMBER_GROWTH_TREND,
  MEMBER_STATS,
  MOCK_MEMBERSHIP_APPLICATIONS,
  PROVINCE_DISTRIBUTION,
  MOCK_PAYMENTS,
  REVENUE_TREND,
} from "@/lib/mock-data";

const PIE_COLORS = [
  "#0F172A",
  "#1E293B",
  "#334155",
  "#475569",
  "#0F766E",
  "#0D9488",
  "#4D7C0F",
  "#65A30D",
  "#84CC16",
  "#A3E635",
];

export function SuperAdminDashboard() {
  const recentApplications = MOCK_MEMBERSHIP_APPLICATIONS.slice(0, 5);
  const recentPayments = MOCK_PAYMENTS.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Members"
          value={MEMBER_STATS.totalMembers.toLocaleString()}
          change="+3.9% from last month"
          changeType="positive"
          icon={Users}
          index={0}
        />
        <StatCard
          title="Active Members"
          value={MEMBER_STATS.activeMembers.toLocaleString()}
          change="+2.6% from last month"
          changeType="positive"
          icon={UserCheck}
          index={1}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${REVENUE_TREND[REVENUE_TREND.length - 1].revenue.toLocaleString()}`}
          change="+4.1% from last month"
          changeType="positive"
          icon={DollarSign}
          index={2}
        />
        <StatCard
          title="Upcoming Events"
          value={MEMBER_STATS.upcomingEvents}
          icon={Calendar}
          index={3}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Member Growth</h3>
          <p className="font-sans text-xs text-slate-500">Last 6 months</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MEMBER_GROWTH_TREND} margin={{ left: -16 }}>
                <defs>
                  <linearGradient id="memberGrowthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }}
                />
                <Area
                  type="monotone"
                  dataKey="members"
                  stroke="#A3E635"
                  strokeWidth={2}
                  fill="url(#memberGrowthFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Revenue</h3>
          <p className="font-sans text-xs text-slate-500">Last 6 months, USD</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_TREND} margin={{ left: -16 }}>
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [`$${Number(value ?? 0).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }}
                />
                <Bar dataKey="revenue" fill="#A3E635" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">
            Recent Membership Applications
          </h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-nav font-medium">Name</th>
                  <th className="py-2 pr-3 font-nav font-medium">Type</th>
                  <th className="py-2 pr-3 font-nav font-medium">Date</th>
                  <th className="py-2 font-nav font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.map((application) => (
                  <tr
                    key={application.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 pr-3">
                      <p className="font-sans text-sm font-medium text-navy">
                        {application.memberName}
                      </p>
                      <p className="font-sans text-xs text-slate-400">
                        {application.memberEmail}
                      </p>
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                      {application.membershipType}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                      {application.appliedDate}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={application.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Province Distribution</h3>
          <p className="font-sans text-xs text-slate-500">All 10 Zimbabwe provinces</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROVINCE_DISTRIBUTION}
                  dataKey="members"
                  nameKey="province"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={1}
                >
                  {PROVINCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={entry.province} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _name, item) => [
                    Number(value ?? 0).toLocaleString(),
                    item?.payload?.province ?? "",
                  ]}
                  contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 11, color: "#64748B" }}
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Recent Payments</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-nav font-medium">Member</th>
                  <th className="py-2 pr-3 font-nav font-medium">Amount</th>
                  <th className="py-2 pr-3 font-nav font-medium">Type</th>
                  <th className="py-2 pr-3 font-nav font-medium">Date</th>
                  <th className="py-2 font-nav font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 pr-3 font-sans text-sm font-medium text-navy">
                      {payment.memberName}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                      ${payment.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                      {payment.type}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                      {payment.date}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={payment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">
            Engineering Discipline Distribution
          </h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DISCIPLINE_DISTRIBUTION}
                layout="vertical"
                margin={{ left: 16 }}
              >
                <CartesianGrid stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="discipline"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={90}
                />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }} />
                <Bar dataKey="members" fill="#A3E635" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
