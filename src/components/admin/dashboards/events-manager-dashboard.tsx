"use client";

import { Calendar, MapPin, Ticket, TrendingUp, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  EVENTS_STATS,
  MOCK_EVENTS,
  MOCK_REGISTRATIONS,
  REGISTRATIONS_TREND,
} from "@/lib/mock-data";

export function EventsManagerDashboard() {
  const upcomingEvents = MOCK_EVENTS.filter(
    (event) => event.status === "Upcoming" || event.status === "Open" || event.status === "Sold Out"
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Upcoming Events"
          value={EVENTS_STATS.upcomingEvents}
          icon={Calendar}
          index={0}
        />
        <StatCard
          title="Total Registrations"
          value={EVENTS_STATS.totalRegistrations.toLocaleString()}
          change="+19% from last month"
          changeType="positive"
          icon={Users}
          index={1}
        />
        <StatCard
          title="Tickets Issued"
          value={EVENTS_STATS.ticketsIssued.toLocaleString()}
          icon={Ticket}
          index={2}
        />
        <StatCard
          title="Attendance Rate"
          value={`${EVENTS_STATS.attendanceRate}%`}
          change="+3 pts from last event"
          changeType="positive"
          icon={TrendingUp}
          index={3}
        />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-navy">Upcoming Events</h3>
        <div className="mt-4 space-y-3">
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-nav text-sm font-semibold text-navy">{event.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    {event.venue}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-sans text-xs font-medium text-slate-500">
                  {event.registrations}/{event.capacity} registered
                </span>
                <StatusBadge status={event.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">Recent Registrations</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2 pr-3 font-nav font-medium">Name</th>
                  <th className="py-2 pr-3 font-nav font-medium">Event</th>
                  <th className="py-2 pr-3 font-nav font-medium">Ticket</th>
                  <th className="py-2 font-nav font-medium">Payment</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_REGISTRATIONS.slice(0, 6).map((registration) => (
                  <tr
                    key={registration.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 pr-3 font-sans text-sm font-medium text-navy">
                      {registration.memberName}
                    </td>
                    <td className="max-w-44 truncate py-2.5 pr-3 font-sans text-sm text-slate-600">
                      {registration.eventName}
                    </td>
                    <td className="py-2.5 pr-3 font-sans text-xs text-slate-500">
                      {registration.ticketNumber}
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={registration.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-heading text-sm font-semibold text-navy">
            Monthly Registrations Trend
          </h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REGISTRATIONS_TREND} margin={{ left: -16 }}>
                <defs>
                  <linearGradient id="registrationsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F172A" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#0F172A" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#E2E8F0", fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="registrations"
                  stroke="#A3E635"
                  strokeWidth={2}
                  fill="url(#registrationsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
