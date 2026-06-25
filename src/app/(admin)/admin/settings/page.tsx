"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ImagePlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PageHeader } from "@/components/admin/page-header";

function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="font-heading text-sm font-semibold text-navy">{title}</h3>
      {description && <p className="mt-1 font-sans text-xs text-slate-500">{description}</p>}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({
  id,
  label,
  ...props
}: { id: string; label: string } & React.ComponentProps<typeof Input>) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

function ToggleField({ id, label, description }: { id: string; label: string; description: string }) {
  return (
    <label
      htmlFor={id}
      className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 sm:col-span-2"
    >
      <Checkbox id={id} defaultChecked />
      <span>
        <span className="block font-sans text-sm font-medium text-navy">{label}</span>
        <span className="block font-sans text-xs text-slate-500">{description}</span>
      </span>
    </label>
  );
}

function SaveBar() {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        onClick={() => toast.success("Settings saved")}
        className="h-9 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        Save Changes
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const [logoName, setLogoName] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Configure organization details and platform behavior."
      />

      <Tabs defaultValue="general">
        <TabsList variant="line" className="flex-wrap">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-4 space-y-4">
          <FieldGroup title="Organization Details">
            <Field id="org-name" label="Organization Name" defaultValue="Women in Engineering Zimbabwe" />
            <Field id="org-email" label="Contact Email" type="email" defaultValue="info@wiez.co.zw" />
            <Field id="org-website" label="Website" defaultValue="https://wiez.co.zw" />
            <div className="space-y-1.5">
              <Label htmlFor="org-logo">Organization Logo</Label>
              <label
                htmlFor="org-logo"
                className="flex h-10 cursor-pointer items-center gap-2 rounded-[8px] border border-dashed border-slate-300 px-3 font-sans text-sm text-slate-500 hover:border-lime hover:text-navy"
              >
                <ImagePlus className="size-4" />
                {logoName ?? "Upload logo"}
                <input
                  id="org-logo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => setLogoName(event.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>
          </FieldGroup>
          <FieldGroup title="Social Links">
            <Field id="social-linkedin" label="LinkedIn" placeholder="https://linkedin.com/company/wiez" />
            <Field id="social-twitter" label="X (Twitter)" placeholder="https://x.com/wiez_zw" />
            <Field id="social-facebook" label="Facebook" placeholder="https://facebook.com/wiezimbabwe" />
            <Field id="social-instagram" label="Instagram" placeholder="https://instagram.com/wiez_zw" />
          </FieldGroup>
          <SaveBar />
        </TabsContent>

        <TabsContent value="membership" className="mt-4 space-y-4">
          <FieldGroup title="Membership Fees" description="Annual fees in USD, per membership type">
            <Field id="fee-student" label="Student" type="number" defaultValue={15} />
            <Field id="fee-graduate" label="Graduate" type="number" defaultValue={30} />
            <Field id="fee-professional" label="Professional" type="number" defaultValue={90} />
            <Field id="fee-corporate" label="Corporate" type="number" defaultValue={250} />
          </FieldGroup>
          <FieldGroup title="Renewal">
            <Field id="renewal-period" label="Renewal Period (months)" type="number" defaultValue={12} />
            <Field id="renewal-grace" label="Grace Period (days)" type="number" defaultValue={30} />
            <ToggleField
              id="auto-approve"
              label="Auto-approve renewals"
              description="Skip manual review for members renewing the same membership type."
            />
          </FieldGroup>
          <SaveBar />
        </TabsContent>

        <TabsContent value="events" className="mt-4 space-y-4">
          <FieldGroup title="Defaults">
            <Field id="event-capacity" label="Default Capacity" type="number" defaultValue={150} />
            <Field id="event-deadline" label="Registration Deadline Buffer (hours)" type="number" defaultValue={24} />
          </FieldGroup>
          <FieldGroup title="Policy">
            <ToggleField
              id="event-approval"
              label="Require approval for member-only events"
              description="An events manager must approve registrations before tickets are issued."
            />
            <ToggleField
              id="event-refunds"
              label="Allow ticket refunds"
              description="Members can request a refund up to 48 hours before an event."
            />
          </FieldGroup>
          <SaveBar />
        </TabsContent>

        <TabsContent value="payments" className="mt-4 space-y-4">
          <FieldGroup title="Payment Methods">
            <ToggleField id="pm-ecocash" label="EcoCash" description="Accept mobile money payments via EcoCash." />
            <ToggleField id="pm-innbucks" label="InnBucks" description="Accept mobile money payments via InnBucks." />
            <ToggleField id="pm-bank" label="Bank Transfer" description="Accept direct bank transfers." />
            <ToggleField id="pm-card" label="Visa / Mastercard" description="Accept card payments via the payment gateway." />
          </FieldGroup>
          <FieldGroup title="Gateway">
            <Field id="currency" label="Currency" defaultValue="USD" />
            <Field id="gateway-key" label="Payment Gateway API Key" type="password" placeholder="••••••••••••" />
          </FieldGroup>
          <SaveBar />
        </TabsContent>

        <TabsContent value="notifications" className="mt-4 space-y-4">
          <FieldGroup title="Notification Channels">
            <ToggleField
              id="notif-email"
              label="Email notifications"
              description="Send members and admins email notifications for key events."
            />
            <ToggleField
              id="notif-sms"
              label="SMS notifications"
              description="Send SMS alerts for time-sensitive updates."
            />
          </FieldGroup>
          <FieldGroup title="Admin Alerts">
            <Field
              id="alert-recipients"
              label="Alert Recipients"
              placeholder="admin@wiez.co.zw, ops@wiez.co.zw"
            />
          </FieldGroup>
          <SaveBar />
        </TabsContent>

        <TabsContent value="security" className="mt-4 space-y-4">
          <FieldGroup title="Authentication">
            <ToggleField
              id="security-2fa"
              label="Require two-factor authentication"
              description="All admin and staff accounts must enable 2FA to sign in."
            />
            <Field id="session-timeout" label="Session Timeout (minutes)" type="number" defaultValue={60} />
          </FieldGroup>
          <FieldGroup title="Password Policy">
            <Field id="password-min-length" label="Minimum Length" type="number" defaultValue={8} />
            <ToggleField
              id="password-complexity"
              label="Require upper, lower and number"
              description="Enforce strong password complexity for all accounts."
            />
          </FieldGroup>
          <SaveBar />
        </TabsContent>
      </Tabs>
    </div>
  );
}
