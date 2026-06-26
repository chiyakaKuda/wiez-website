"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DocumentUploadField,
  type UploadedDocument,
} from "@/components/membership/document-upload-field";
import { submitPaymentProof } from "@/actions/memberships";
import type { MembershipTypeName, PaymentMethod } from "@/types/memberships";
import { cn } from "@/lib/utils";

const ECOCASH_NUMBER = "077 123 4567";
const INNBUCKS_NUMBER = "077 123 4567";

function daysRemaining(approvedAt: Date | null): number {
  const base = approvedAt ? new Date(approvedAt) : new Date();
  const deadline = new Date(base);
  deadline.setDate(deadline.getDate() + 14);
  return Math.max(0, Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function CopyableValue({ value }: { value: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(value);
        toast.success("Copied to clipboard");
      }}
      className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 font-mono text-sm text-navy hover:bg-slate-200"
    >
      {value}
      <Copy className="size-3" />
    </button>
  );
}

function PaymentMethodPanel({
  method,
  membershipId,
  applicationReference,
  instructions,
  onSubmitted,
}: {
  method: PaymentMethod;
  membershipId: string;
  applicationReference: string;
  instructions: React.ReactNode;
  onSubmitted: () => void;
}) {
  const [proof, setProof] = useState<UploadedDocument | null>(null);
  const [reference, setReference] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (!proof) {
      toast.error("Please upload your proof of payment.");
      return;
    }
    if (!reference.trim()) {
      toast.error("Please enter your transaction reference.");
      return;
    }

    setIsSubmitting(true);
    const result = await submitPaymentProof(membershipId, {
      paymentMethod: method,
      paymentReference: reference.trim(),
      paymentProofUrl: proof.url,
      paymentProofName: proof.name,
    });
    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.error ?? "Failed to submit payment proof.");
      return;
    }

    toast.success("Payment proof submitted.");
    onSubmitted();
  }

  return (
    <div className="space-y-5">
      <div className="rounded-lg bg-slate-50 p-4">{instructions}</div>

      <DocumentUploadField
        endpoint="paymentProof"
        label="Proof of Payment"
        required
        value={proof}
        onChange={setProof}
      />

      <div>
        <Label htmlFor={`${method}-reference`}>
          Transaction Reference <span className="text-red-500">*</span>
        </Label>
        <Input
          id={`${method}-reference`}
          value={reference}
          onChange={(event) => setReference(event.target.value)}
          className="mt-1.5 h-11 rounded-[8px]"
          placeholder={`Reference used for this ${applicationReference} payment`}
        />
      </div>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="h-11 w-full rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Payment Proof"
        )}
      </Button>
    </div>
  );
}

export function PaymentForm({
  membershipId,
  applicationReference,
  applicantName,
  membershipTypeName,
  fee,
  approvedAt,
}: {
  membershipId: string;
  applicationReference: string;
  applicantName: string;
  membershipTypeName: MembershipTypeName;
  fee: number;
  approvedAt: Date | null;
}) {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);
  const remaining = daysRemaining(approvedAt);

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-lime/15">
          <Check className="size-6 text-navy" strokeWidth={3} />
        </div>
        <h1 className="mt-5 font-heading text-2xl font-bold text-navy">
          Payment proof submitted
        </h1>
        <p className="mt-2 font-sans text-sm text-slate-500">
          Our team will verify your payment within 1–2 business days.
        </p>
        <Button
          onClick={() => router.push("/dashboard/membership")}
          className="mt-6 h-11 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-12 lg:grid-cols-[35%_1fr] lg:px-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-navy">Membership Payment</h1>
        <div className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <dl className="space-y-4">
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Applicant
              </dt>
              <dd className="mt-0.5 font-sans text-sm font-medium text-navy">{applicantName}</dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Membership Type
              </dt>
              <dd className="mt-0.5 font-sans text-sm font-medium text-navy">
                {membershipTypeName} Member
              </dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Amount Due
              </dt>
              <dd className="mt-0.5 font-heading text-2xl font-extrabold text-navy">${fee} USD</dd>
            </div>
            <div>
              <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">
                Payment Deadline
              </dt>
              <dd
                className={cn(
                  "mt-0.5 font-sans text-sm font-semibold",
                  remaining <= 3 ? "text-red-600" : "text-navy"
                )}
              >
                {remaining} {remaining === 1 ? "day" : "days"} remaining
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <Tabs defaultValue="ecocash">
          <TabsList variant="line">
            <TabsTrigger value="ecocash">EcoCash</TabsTrigger>
            <TabsTrigger value="innbucks">InnBucks</TabsTrigger>
            <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
          </TabsList>

          <TabsContent value="ecocash" className="mt-5">
            <PaymentMethodPanel
              method="ecocash"
              membershipId={membershipId}
              applicationReference={applicationReference}
              onSubmitted={() => setSubmitted(true)}
              instructions={
                <ol className="list-decimal space-y-1.5 pl-4 font-sans text-sm text-slate-600">
                  <li>Dial *151# on your phone</li>
                  <li>Select &quot;Send Money&quot;</li>
                  <li>Select &quot;Send to EcoCash Number&quot;</li>
                  <li>
                    Enter number: <CopyableValue value={ECOCASH_NUMBER} /> (WiEZ EcoCash)
                  </li>
                  <li>Enter amount: ${fee}</li>
                  <li>
                    When prompted for reference, enter:{" "}
                    <CopyableValue value={applicationReference} />
                  </li>
                  <li>Complete the transaction and save your confirmation SMS</li>
                </ol>
              }
            />
          </TabsContent>

          <TabsContent value="innbucks" className="mt-5">
            <PaymentMethodPanel
              method="innbucks"
              membershipId={membershipId}
              applicationReference={applicationReference}
              onSubmitted={() => setSubmitted(true)}
              instructions={
                <ol className="list-decimal space-y-1.5 pl-4 font-sans text-sm text-slate-600">
                  <li>Open your InnBucks app or dial *667#</li>
                  <li>Select &quot;Send Money&quot;</li>
                  <li>
                    Enter WiEZ InnBucks number: <CopyableValue value={INNBUCKS_NUMBER} />
                  </li>
                  <li>Enter amount: ${fee}</li>
                  <li>
                    Use reference: <CopyableValue value={applicationReference} />
                  </li>
                  <li>Confirm and save your receipt</li>
                </ol>
              }
            />
          </TabsContent>

          <TabsContent value="bank_transfer" className="mt-5">
            <PaymentMethodPanel
              method="bank_transfer"
              membershipId={membershipId}
              applicationReference={applicationReference}
              onSubmitted={() => setSubmitted(true)}
              instructions={
                <dl className="space-y-2.5 font-sans text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Bank</dt>
                    <dd className="font-medium text-navy">CBZ Bank</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Account Name</dt>
                    <dd className="font-medium text-navy">Women in Engineering Zimbabwe</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Account Number</dt>
                    <dd>
                      <CopyableValue value="01122334455" />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Branch</dt>
                    <dd className="font-medium text-navy">Harare Main Branch</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-slate-500">Swift Code</dt>
                    <dd>
                      <CopyableValue value="CBZWZWHA" />
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-2.5">
                    <dt className="font-semibold text-navy">Reference (mandatory)</dt>
                    <dd>
                      <CopyableValue value={applicationReference} />
                    </dd>
                  </div>
                </dl>
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
