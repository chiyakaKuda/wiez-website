"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Calendar, Check, Download, FileText, MapPin, Phone } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MembershipStatusBadge } from "@/components/membership/status-badge";
import { verifyDocument } from "@/actions/memberships";
import type { MembershipDetail } from "@/actions/memberships";
import type { MembershipApplicationData } from "@/types/memberships";
import { ReviewPanel } from "@/components/admin/membership-detail/review-panel";

function formatDateTime(value: Date | string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

const PERSONAL_FIELDS: [string, keyof MembershipApplicationData][] = [
  ["Full Legal Name", "fullLegalName"],
  ["Date of Birth", "dateOfBirth"],
  ["Gender", "gender"],
  ["National ID", "nationalId"],
  ["Phone", "phone"],
  ["WhatsApp", "whatsapp"],
  ["Province", "province"],
  ["City/Town", "city"],
  ["Physical Address", "physicalAddress"],
  ["LinkedIn", "linkedinUrl"],
  ["Company Name", "companyName"],
  ["Company Registration Number", "companyRegistrationNumber"],
  ["Industry", "industry"],
  ["Female Engineers Employed", "femaleEngineersCount"],
  ["Contact Person", "contactPersonName"],
  ["Contact Title", "contactPersonTitle"],
  ["Contact Email", "contactPersonEmail"],
  ["Contact Phone", "contactPersonPhone"],
  ["Company Address", "companyAddress"],
  ["Company Website", "companyWebsite"],
];

const PROFESSIONAL_FIELDS: [string, keyof MembershipApplicationData][] = [
  ["Institution", "institution"],
  ["Faculty", "faculty"],
  ["Program", "program"],
  ["Year of Study", "yearOfStudy"],
  ["Student ID", "studentIdNumber"],
  ["Expected Graduation", "expectedGraduationYear"],
  ["Degree Obtained", "degreeObtained"],
  ["Engineering Discipline", "engineeringDiscipline"],
  ["Year of Graduation", "yearOfGraduation"],
  ["Employment Status", "employmentStatus"],
  ["Current Employer", "currentEmployer"],
  ["Job Title", "jobTitle"],
  ["Years of Experience", "yearsOfExperience"],
  ["Highest Qualification", "highestQualification"],
  ["ECZ Registration Number", "ezRegistrationNumber"],
  ["Areas of Expertise", "areasOfExpertise"],
  ["Nature of Business", "natureOfBusiness"],
  ["Years in Operation", "yearsInOperation"],
  ["ZIMRA Registered", "zimraRegistered"],
];

const STATEMENT_FIELDS: (keyof MembershipApplicationData)[] = [
  "personalStatement",
  "professionalBio",
  "whatToGain",
  "whyJoinWiez",
  "professionalAchievements",
  "missionStatement",
  "howSupportWomen",
];

function InfoGrid({
  data,
  fields,
}: {
  data: MembershipApplicationData;
  fields: [string, keyof MembershipApplicationData][];
}) {
  const filled = fields.filter(([, key]) => {
    const value = data[key];
    return value !== undefined && value !== null && value !== "";
  });

  if (filled.length === 0) {
    return <p className="font-sans text-sm text-slate-400">No information provided.</p>;
  }

  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {filled.map(([label, key]) => {
        const value = data[key];
        return (
          <div key={key}>
            <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">{label}</dt>
            <dd className="mt-0.5 font-sans text-sm text-navy">
              {Array.isArray(value) ? value.join(", ") : String(value)}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

function DocumentCard({
  membershipId,
  type,
  name,
  url,
  uploadedAt,
  verified,
}: {
  membershipId: string;
  type: string;
  name: string;
  url: string;
  uploadedAt: string;
  verified: boolean;
}) {
  const [isVerified, setIsVerified] = useState(verified);
  const [isSaving, setIsSaving] = useState(false);

  async function handleVerifyChange(checked: boolean) {
    setIsSaving(true);
    const result = await verifyDocument(membershipId, type);
    setIsSaving(false);
    if (result.success) {
      setIsVerified(checked);
      toast.success(`"${type}" marked as verified`);
    } else {
      toast.error(result.error ?? "Failed to update document.");
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-center gap-3">
        <FileText className="size-5 shrink-0 text-slate-400" />
        <div>
          <p className="font-sans text-sm font-medium text-navy">{type}</p>
          <p className="font-sans text-xs text-slate-400">
            {name} · Uploaded {formatDateTime(uploadedAt)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-1.5">
          <Checkbox
            checked={isVerified}
            disabled={isSaving}
            onCheckedChange={(checked) => void handleVerifyChange(checked === true)}
          />
          <span className="font-nav text-xs font-medium text-slate-500">Verified</span>
        </label>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-nav text-xs font-semibold text-navy underline hover:text-lime"
        >
          View
        </a>
        <a
          href={url}
          download
          className="flex items-center gap-1 font-nav text-xs font-semibold text-navy underline hover:text-lime"
        >
          <Download className="size-3" />
          Download
        </a>
      </div>
    </div>
  );
}

export function MembershipDetailView({
  membership,
  currentAdminId,
}: {
  membership: MembershipDetail;
  currentAdminId: string;
}) {
  const data = membership.applicationData ?? {};
  const latestPayment = membership.payments[0] ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-lg font-semibold text-white">
                {initials(membership.applicant.name)}
              </span>
              <div>
                <h1 className="font-heading text-xl font-bold text-navy">
                  {membership.applicant.name}
                </h1>
                <p className="font-sans text-sm text-slate-500">{membership.applicant.email}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 font-sans text-xs text-slate-400">
                  {membership.applicant.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3" />
                      {membership.applicant.phone}
                    </span>
                  )}
                  {data.province && (
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {data.province}
                      {data.city ? `, ${data.city}` : ""}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <MembershipStatusBadge status={membership.status} className="text-sm" />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Applied For
              </dt>
              <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                {membership.membershipType.name} — ${membership.membershipType.fee}
              </dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Reference
              </dt>
              <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                {membership.applicationReference ?? "—"}
              </dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Submitted
              </dt>
              <dd className="mt-0.5 flex items-center gap-1 font-sans text-sm font-medium text-navy">
                <Calendar className="size-3.5 text-slate-400" />
                {formatDateTime(membership.submittedAt)}
              </dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Assigned To
              </dt>
              <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                {membership.reviewedBy ? "Assigned" : "Unassigned"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-sm font-bold text-navy">Personal Information</h2>
          <div className="mt-4">
            <InfoGrid data={data} fields={PERSONAL_FIELDS} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-sm font-bold text-navy">
            Professional / Academic Information
          </h2>
          <div className="mt-4">
            <InfoGrid data={data} fields={PROFESSIONAL_FIELDS} />
          </div>
          {STATEMENT_FIELDS.map((key) => {
            const value = data[key];
            if (!value || typeof value !== "string") return null;
            return (
              <blockquote
                key={key}
                className="mt-4 border-l-2 border-lime pl-4 font-sans text-sm leading-relaxed text-slate-600 italic"
              >
                {value}
              </blockquote>
            );
          })}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-sm font-bold text-navy">Documents</h2>
          <div className="mt-4 space-y-3">
            {(membership.documents ?? []).length > 0 ? (
              (membership.documents ?? []).map((document) => (
                <DocumentCard
                  key={document.type}
                  membershipId={membership.id}
                  type={document.type}
                  name={document.name}
                  url={document.url}
                  uploadedAt={document.uploadedAt}
                  verified={document.verified}
                />
              ))
            ) : (
              <p className="font-sans text-sm text-slate-400">No documents uploaded.</p>
            )}
          </div>
        </div>

        {latestPayment && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-heading text-sm font-bold text-navy">Payment Information</h2>
            <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                  Method
                </dt>
                <dd className="mt-0.5 font-sans text-sm font-medium text-navy capitalize">
                  {latestPayment.paymentMethod.replace("_", " ")}
                </dd>
              </div>
              <div>
                <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                  Reference
                </dt>
                <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                  {latestPayment.paymentReference}
                </dd>
              </div>
              <div>
                <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                  Amount
                </dt>
                <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                  ${latestPayment.amount}
                </dd>
              </div>
              <div>
                <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                  Submitted
                </dt>
                <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                  {formatDateTime(latestPayment.submittedAt)}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between">
              <a
                href={latestPayment.paymentProofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-nav text-xs font-semibold text-navy underline hover:text-lime"
              >
                View Receipt
              </a>
              <span className="flex items-center gap-1.5 font-nav text-xs font-semibold text-slate-500">
                {latestPayment.status === "verified" && (
                  <Check className="size-3.5 text-green-600" />
                )}
                Status: {latestPayment.status}
              </span>
            </div>
          </div>
        )}
      </div>

      <ReviewPanel membership={membership} currentAdminId={currentAdminId} />
    </div>
  );
}
