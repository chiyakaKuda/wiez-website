"use client";

import { toast } from "sonner";
import { Award, Calendar, Download, MapPin, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { MOCK_CERTIFICATES, MOCK_EVENTS, MOCK_PAYMENTS } from "@/lib/mock-data";
import type { UserWithRoles } from "@/types/auth";

const MEMBERSHIP_NUMBER = "WIEZ-2026-0247";
const MEMBERSHIP_TYPE = "Professional";
const MEMBERSHIP_STATUS = "Active";
const MEMBERSHIP_EXPIRY = "2027-03-12";

export function MemberDashboard({ user }: { user: UserWithRoles }) {
  const upcomingEvents = MOCK_EVENTS.filter(
    (event) => event.status === "Upcoming" || event.status === "Open"
  ).slice(0, 3);
  const recentPayments = MOCK_PAYMENTS.slice(0, 5);
  const memberSince = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  function handleRegister(eventName: string) {
    toast.success(`Registered for "${eventName}"`);
  }

  function handleDownload(title: string) {
    toast.info(`Downloading "${title}"...`);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Membership Status"
          value={MEMBERSHIP_STATUS}
          icon={ShieldCheck}
          index={0}
        />
        <StatCard title="Member Since" value={memberSince} icon={Calendar} index={1} />
        <StatCard title="Events Attended" value={6} icon={MapPin} index={2} />
        <StatCard title="Certificates Earned" value={MOCK_CERTIFICATES.length} icon={Award} index={3} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-navy p-6 text-white shadow-sm lg:col-span-1">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "16px 16px",
            }}
            aria-hidden="true"
          />
          <div className="absolute -top-10 -right-10 size-32 rounded-full bg-lime/20 blur-2xl" aria-hidden="true" />

          <div className="relative">
            <p className="font-heading text-lg font-extrabold tracking-tight">
              W<span className="text-lime">i</span>EZ
            </p>
            <p className="font-nav text-[10px] uppercase tracking-[0.18em] text-white/60">
              Member Card
            </p>

            <p className="mt-8 font-nav text-base font-semibold">{user.name}</p>
            <p className="mt-1 font-sans text-sm tracking-wide text-lime">{MEMBERSHIP_NUMBER}</p>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="font-nav text-[10px] uppercase tracking-wide text-white/50">Type</p>
                <p className="font-sans text-sm font-medium">{MEMBERSHIP_TYPE}</p>
              </div>
              <div className="text-right">
                <p className="font-nav text-[10px] uppercase tracking-wide text-white/50">Expires</p>
                <p className="font-sans text-sm font-medium">{MEMBERSHIP_EXPIRY}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="font-heading text-sm font-semibold text-navy">Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-3 rounded-lg border border-slate-100 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-nav text-sm font-semibold text-navy">{event.name}</p>
                  <p className="mt-0.5 font-sans text-xs text-slate-500">
                    {event.date} · {event.venue}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleRegister(event.name)}
                  className="h-8 w-fit shrink-0 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
                >
                  Register
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-navy">My Certificates</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_CERTIFICATES.map((certificate) => (
            <div
              key={certificate.id}
              className="flex flex-col justify-between rounded-lg border border-slate-100 p-4"
            >
              <div>
                <Award className="size-5 text-lime" />
                <p className="mt-2 font-nav text-sm font-semibold text-navy">
                  {certificate.title}
                </p>
                <p className="mt-0.5 font-sans text-xs text-slate-400">
                  Issued {certificate.issuedDate}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDownload(certificate.title)}
                className="mt-3 h-8 w-fit rounded-[6px]"
              >
                <Download className="size-3.5" />
                Download
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-heading text-sm font-semibold text-navy">Recent Payments</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 font-nav font-medium">Type</th>
                <th className="py-2 pr-3 font-nav font-medium">Amount</th>
                <th className="py-2 pr-3 font-nav font-medium">Method</th>
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
                  <td className="py-2.5 pr-3 font-sans text-sm text-navy">{payment.type}</td>
                  <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                    ${payment.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">
                    {payment.method}
                  </td>
                  <td className="py-2.5 pr-3 font-sans text-sm text-slate-600">{payment.date}</td>
                  <td className="py-2.5">
                    <StatusBadge status={payment.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
