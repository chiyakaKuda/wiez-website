"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, type UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
  GraduationCap,
  Rocket,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DocumentUploadField,
  type UploadedDocument,
} from "@/components/membership/document-upload-field";
import { saveDraftApplication, submitMembershipApplication } from "@/actions/memberships";
import {
  ZIMBABWE_PROVINCES,
  ENGINEERING_DISCIPLINES,
  ZIMBABWE_UNIVERSITIES,
} from "@/lib/constants";
import {
  individualPersonalSchema,
  corporatePersonalSchema,
  studentProfessionalSchema,
  graduateProfessionalSchema,
  professionalProfessionalSchema,
  corporateProfessionalSchema,
} from "@/lib/membership-schemas";
import type {
  Membership,
  MembershipApplicationData,
  MembershipDocument,
  MembershipType,
  MembershipTypeName,
} from "@/types/memberships";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Membership Type" },
  { id: 2, label: "Personal Info" },
  { id: 3, label: "Professional Info" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review & Submit" },
];

const TYPE_ICONS: Record<MembershipTypeName, typeof GraduationCap> = {
  Student: GraduationCap,
  Graduate: Rocket,
  Professional: Crown,
  Corporate: Building2,
};

const AREAS_OF_EXPERTISE = [
  "Project Management",
  "Research",
  "Design",
  "Construction",
  "Manufacturing",
  "Environmental",
  "Quality Assurance",
  "Safety",
  "Operations",
  "Consulting",
];

function wordCount(value: string): number {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

// Base UI's Select treats a field as "controlled" only once its value is
// no longer undefined — every Select-bound field needs a defined (empty
// string) default so it's controlled from the very first render, not just
// from the moment the user picks something.
const SELECT_FIELD_DEFAULTS: Partial<MembershipApplicationData> = {
  gender: "" as MembershipApplicationData["gender"],
  province: "" as MembershipApplicationData["province"],
  institution: "" as MembershipApplicationData["institution"],
  yearOfStudy: "" as MembershipApplicationData["yearOfStudy"],
  engineeringDiscipline: "" as MembershipApplicationData["engineeringDiscipline"],
  employmentStatus: "" as MembershipApplicationData["employmentStatus"],
  annualTurnoverRange: "" as MembershipApplicationData["annualTurnoverRange"],
};

function documentsArrayToMap(
  documents: MembershipDocument[] | null | undefined
): Record<string, UploadedDocument | null> {
  const map: Record<string, UploadedDocument | null> = {};
  for (const doc of documents ?? []) {
    map[doc.type] = { name: doc.name, url: doc.url, size: doc.size };
  }
  return map;
}

export function ApplyWizard({
  membershipTypes,
  initialTypeName,
  initialDraft,
}: {
  membershipTypes: MembershipType[];
  initialTypeName: MembershipTypeName | null;
  initialDraft: Membership | null;
}) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [declarationTruthful, setDeclarationTruthful] = useState(false);
  const [declarationTerms, setDeclarationTerms] = useState(false);

  const draftTypeName = initialDraft
    ? membershipTypes.find((type) => type.id === initialDraft.membershipTypeId)?.name ?? null
    : null;
  const [selectedTypeName, setSelectedTypeName] = useState<MembershipTypeName | null>(
    draftTypeName ?? initialTypeName
  );
  const [documents, setDocuments] = useState<Record<string, UploadedDocument | null>>(() =>
    documentsArrayToMap(initialDraft?.documents)
  );

  const form = useForm<MembershipApplicationData>({
    defaultValues: { ...SELECT_FIELD_DEFAULTS, ...(initialDraft?.applicationData ?? {}) },
  });
  const { register, control, watch, getValues, formState } = form;
  const { errors } = formState;

  const selectedType = membershipTypes.find((type) => type.name === selectedTypeName) ?? null;
  const isCorporate = selectedTypeName === "Corporate";

  // Auto-save draft 2 seconds after the user stops typing.
  const watchedValues = watch();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!selectedType || step === 5) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void saveDraftApplication(selectedType.id, getValues(), undefined).then((result) => {
        if (result.success) setLastSaved(new Date());
      });
    }, 2000);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- JSON.stringify gives a stable primitive dep for the object watch() returns
  }, [JSON.stringify(watchedValues), selectedType, step]);

  const persistStep = useCallback(
    async (overrideDocuments?: MembershipDocument[]) => {
      if (!selectedType) return;
      const docsArray =
        overrideDocuments ??
        Object.entries(documents)
          .filter(([, value]) => value !== null)
          .map(([type, value]) => ({
            type,
            name: value!.name,
            url: value!.url,
            size: value!.size,
            uploadedAt: new Date().toISOString(),
            verified: false,
          }));
      const result = await saveDraftApplication(selectedType.id, getValues(), docsArray);
      if (result.success) setLastSaved(new Date());
    },
    [selectedType, documents, getValues]
  );

  async function handleNext() {
    if (step === 1) {
      if (!selectedTypeName) {
        toast.error("Please select a membership type.");
        return;
      }
      if (!agreedToTerms) {
        toast.error("Please confirm you've read the membership terms to continue.");
        return;
      }
      await persistStep();
      setStep(2);
      return;
    }

    if (step === 2) {
      const schema = isCorporate ? corporatePersonalSchema : individualPersonalSchema;
      const result = schema.safeParse(getValues());
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? "Please check the form for errors.");
        for (const issue of result.error.issues) {
          form.setError(issue.path.join(".") as keyof MembershipApplicationData, {
            message: issue.message,
          });
        }
        return;
      }
      await persistStep();
      setStep(3);
      return;
    }

    if (step === 3) {
      const schema =
        selectedTypeName === "Student"
          ? studentProfessionalSchema
          : selectedTypeName === "Graduate"
            ? graduateProfessionalSchema
            : selectedTypeName === "Professional"
              ? professionalProfessionalSchema
              : corporateProfessionalSchema;
      const result = schema.safeParse(getValues());
      if (!result.success) {
        toast.error(result.error.issues[0]?.message ?? "Please check the form for errors.");
        for (const issue of result.error.issues) {
          form.setError(issue.path.join(".") as keyof MembershipApplicationData, {
            message: issue.message,
          });
        }
        return;
      }
      await persistStep();
      setStep(4);
      return;
    }

    if (step === 4) {
      if (!selectedType) return;
      const required = selectedType.requiredDocuments.filter(
        (label) => !label.includes("(Optional)")
      );
      const missing = required.filter((label) => !documents[label]);
      if (missing.length > 0) {
        toast.error(`Please upload all required documents: ${missing.join(", ")}.`);
        return;
      }
      await persistStep();
      setStep(5);
      return;
    }
  }

  function handleBack() {
    setStep((current) => Math.max(1, current - 1));
  }

  async function handleSubmit() {
    if (!declarationTruthful || !declarationTerms) {
      toast.error("Please confirm both declarations before submitting.");
      return;
    }

    setIsSubmitting(true);
    await persistStep();
    const result = await submitMembershipApplication(getValues());
    setIsSubmitting(false);

    if (!result.success || !result.data) {
      toast.error(result.error ?? "Failed to submit your application. Please try again.");
      return;
    }

    router.push(
      `/membership/application-submitted?ref=${encodeURIComponent(result.data.applicationReference)}`
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <WizardProgress currentStep={step} />
      <div className="mt-2 flex justify-end">
        <p className="font-sans text-xs text-slate-400">
          {lastSaved
            ? `Draft saved ${lastSaved.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`
            : "Not yet saved"}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <StepOne
                membershipTypes={membershipTypes}
                selectedTypeName={selectedTypeName}
                onSelect={setSelectedTypeName}
                agreedToTerms={agreedToTerms}
                onAgreeChange={setAgreedToTerms}
              />
            )}
            {step === 2 && (
              <StepTwo form={form} isCorporate={isCorporate} errors={errors} register={register} />
            )}
            {step === 3 && selectedTypeName && (
              <StepThree
                typeName={selectedTypeName}
                form={form}
                control={control}
                register={register}
                errors={errors}
                watch={watch}
              />
            )}
            {step === 4 && selectedType && (
              <StepFour
                membershipType={selectedType}
                documents={documents}
                onDocumentsChange={setDocuments}
              />
            )}
            {step === 5 && selectedType && (
              <StepFive
                membershipType={selectedType}
                values={getValues()}
                documents={documents}
                isCorporate={isCorporate}
                declarationTruthful={declarationTruthful}
                declarationTerms={declarationTerms}
                onDeclarationTruthfulChange={setDeclarationTruthful}
                onDeclarationTermsChange={setDeclarationTerms}
                onEditStep={setStep}
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={step === 1}
            className="h-10 rounded-[6px]"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>

          {step < 5 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-10 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application →"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function WizardProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center">
      {STEPS.map((stepItem, index) => (
        <div key={stepItem.id} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-full font-nav text-sm font-semibold transition-colors",
                stepItem.id < currentStep
                  ? "bg-lime text-navy"
                  : stepItem.id === currentStep
                    ? "bg-navy text-white"
                    : "bg-slate-100 text-slate-400"
              )}
            >
              {stepItem.id < currentStep ? <Check className="size-4" /> : stepItem.id}
            </div>
            <p
              className={cn(
                "mt-1.5 hidden font-nav text-[11px] font-medium sm:block",
                stepItem.id <= currentStep ? "text-navy" : "text-slate-400"
              )}
            >
              {stepItem.label}
            </p>
          </div>
          {index < STEPS.length - 1 && (
            <div
              className={cn(
                "mx-2 h-0.5 flex-1",
                stepItem.id < currentStep ? "bg-lime" : "bg-slate-100"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1 — Membership Type Selection
// ---------------------------------------------------------------------------

function StepOne({
  membershipTypes,
  selectedTypeName,
  onSelect,
  agreedToTerms,
  onAgreeChange,
}: {
  membershipTypes: MembershipType[];
  selectedTypeName: MembershipTypeName | null;
  onSelect: (name: MembershipTypeName) => void;
  agreedToTerms: boolean;
  onAgreeChange: (value: boolean) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-navy">Choose your membership type</h2>
      <p className="mt-1.5 font-sans text-sm text-slate-500">
        Select the membership type that matches your current situation.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {membershipTypes.map((type) => {
          const Icon = TYPE_ICONS[type.name];
          const isSelected = selectedTypeName === type.name;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.name)}
              className={cn(
                "relative flex flex-col rounded-xl border-2 p-5 text-left transition-colors",
                isSelected ? "border-lime bg-lime/5" : "border-slate-200 hover:border-slate-300"
              )}
            >
              {isSelected && (
                <span className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-lime">
                  <Check className="size-3 text-navy" strokeWidth={3} />
                </span>
              )}
              <Icon className="size-6 text-navy" />
              <p className="mt-3 font-heading text-base font-bold text-navy">{type.name}</p>
              <p className="mt-1 font-sans text-sm font-semibold text-navy">${type.fee}/year</p>
              <p className="mt-2 font-sans text-xs leading-relaxed text-slate-500">
                {type.eligibilityCriteria}
              </p>
              <p className="mt-3 font-nav text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                Required Documents
              </p>
              <p className="mt-1 font-sans text-xs text-slate-500">
                {type.requiredDocuments.join(", ")}
              </p>
            </button>
          );
        })}
      </div>

      <label
        htmlFor="agree-terms"
        className="mt-6 flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4"
      >
        <Checkbox
          id="agree-terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => onAgreeChange(checked === true)}
        />
        <span className="font-sans text-sm text-slate-600">
          I have read and understand the membership terms and conditions.{" "}
          <a
            href="/membership#terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy underline hover:text-lime"
          >
            Read Terms
          </a>
        </span>
      </label>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2 — Personal Information
// ---------------------------------------------------------------------------

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-500">{message}</p>;
}

function StepTwo({
  form,
  isCorporate,
  errors,
  register,
}: {
  form: UseFormReturn<MembershipApplicationData>;
  isCorporate: boolean;
  errors: UseFormReturn<MembershipApplicationData>["formState"]["errors"];
  register: UseFormReturn<MembershipApplicationData>["register"];
}) {
  const { control } = form;

  if (isCorporate) {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">Company Information</h2>
        <p className="mt-1.5 font-sans text-sm text-slate-500">
          Tell us about the organization applying for Corporate membership.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Company Name" required error={errors.companyName?.message}>
            <Input {...register("companyName")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Company Registration Number"
            required
            error={errors.companyRegistrationNumber?.message}
          >
            <Input {...register("companyRegistrationNumber")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Industry/Sector" required error={errors.industry?.message}>
            <Input {...register("industry")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Number of Female Engineers Currently Employed"
            required
            error={errors.femaleEngineersCount?.message}
          >
            <Input
              type="number"
              min={0}
              {...register("femaleEngineersCount")}
              className="h-11 rounded-[8px]"
            />
          </Field>
          <Field label="Contact Person Full Name" required error={errors.contactPersonName?.message}>
            <Input {...register("contactPersonName")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Contact Person Job Title"
            required
            error={errors.contactPersonTitle?.message}
          >
            <Input {...register("contactPersonTitle")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Contact Person Email" required error={errors.contactPersonEmail?.message}>
            <Input type="email" {...register("contactPersonEmail")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Contact Person Phone" required error={errors.contactPersonPhone?.message}>
            <Input {...register("contactPersonPhone")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Company Physical Address"
            required
            error={errors.companyAddress?.message}
            className="sm:col-span-2"
          >
            <Input {...register("companyAddress")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Company Website" className="sm:col-span-2">
            <Input {...register("companyWebsite")} className="h-11 rounded-[8px]" placeholder="https://" />
          </Field>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-navy">Personal Information</h2>
      <p className="mt-1.5 font-sans text-sm text-slate-500">Tell us a bit about yourself.</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Full Legal Name" required error={errors.fullLegalName?.message}>
          <Input {...register("fullLegalName")} className="h-11 rounded-[8px]" />
        </Field>
        <Field label="Date of Birth" required error={errors.dateOfBirth?.message}>
          <Input type="date" {...register("dateOfBirth")} className="h-11 rounded-[8px]" />
        </Field>
        <Field label="Gender" required error={errors.gender?.message}>
          <Controller
            name="gender"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full rounded-[8px]">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-binary">Non-binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="National ID Number" required error={errors.nationalId?.message}>
          <Input {...register("nationalId")} className="h-11 rounded-[8px]" />
        </Field>
        <Field label="Phone Number" required error={errors.phone?.message}>
          <Input {...register("phone")} className="h-11 rounded-[8px]" placeholder="+263 7X XXX XXXX" />
        </Field>
        <Field label="WhatsApp Number (if different)">
          <Input {...register("whatsapp")} className="h-11 rounded-[8px]" placeholder="+263 7X XXX XXXX" />
        </Field>
        <Field label="Province" required error={errors.province?.message}>
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full rounded-[8px]">
                  <SelectValue placeholder="Select province" />
                </SelectTrigger>
                <SelectContent>
                  {ZIMBABWE_PROVINCES.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="City/Town" required error={errors.city?.message}>
          <Input {...register("city")} className="h-11 rounded-[8px]" />
        </Field>
        <Field
          label="Physical Address"
          required
          error={errors.physicalAddress?.message}
          className="sm:col-span-2"
        >
          <Input {...register("physicalAddress")} className="h-11 rounded-[8px]" />
        </Field>
        <Field label="LinkedIn Profile URL" className="sm:col-span-2">
          <Input {...register("linkedinUrl")} className="h-11 rounded-[8px]" placeholder="https://linkedin.com/in/..." />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      <FieldError message={error} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 3 — Professional / Academic Information
// ---------------------------------------------------------------------------

function InstitutionFields({
  form,
  errors,
}: {
  form: UseFormReturn<MembershipApplicationData>;
  errors: UseFormReturn<MembershipApplicationData>["formState"]["errors"];
}) {
  const { control, register, watch } = form;
  const institution = watch("institution");

  return (
    <>
      <Field label="University/Institution" required error={errors.institution?.message}>
        <Controller
          name="institution"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="h-11 w-full rounded-[8px]">
                <SelectValue placeholder="Select institution" />
              </SelectTrigger>
              <SelectContent>
                {ZIMBABWE_UNIVERSITIES.map((university) => (
                  <SelectItem key={university} value={university}>
                    {university}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>
      {institution === "Other" && (
        <Field label="Institution Name" required error={errors.institutionOther?.message}>
          <Input {...register("institutionOther")} className="h-11 rounded-[8px]" />
        </Field>
      )}
    </>
  );
}

function WordCounter({ value, min, max }: { value: string | undefined; min: number; max: number }) {
  const count = wordCount(value ?? "");
  return (
    <p
      className={cn(
        "mt-1 font-sans text-xs",
        count < min || count > max ? "text-red-500" : "text-slate-400"
      )}
    >
      {count} / {max} words (minimum {min})
    </p>
  );
}

function StepThree({
  typeName,
  form,
  control,
  register,
  errors,
  watch,
}: {
  typeName: MembershipTypeName;
  form: UseFormReturn<MembershipApplicationData>;
  control: UseFormReturn<MembershipApplicationData>["control"];
  register: UseFormReturn<MembershipApplicationData>["register"];
  errors: UseFormReturn<MembershipApplicationData>["formState"]["errors"];
  watch: UseFormReturn<MembershipApplicationData>["watch"];
}) {
  if (typeName === "Student") {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">Academic Information</h2>
        <p className="mt-1.5 font-sans text-sm text-slate-500">
          Tell us about your studies and engineering journey.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InstitutionFields form={form} errors={errors} />
          <Field label="Faculty/School" required error={errors.faculty?.message}>
            <Input {...register("faculty")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Program/Degree" required error={errors.program?.message}>
            <Input {...register("program")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Year of Study" required error={errors.yearOfStudy?.message}>
            <Controller
              name="yearOfStudy"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-[8px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1st", "2nd", "3rd", "4th", "5th", "Postgraduate"].map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Student ID Number" required error={errors.studentIdNumber?.message}>
            <Input {...register("studentIdNumber")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Expected Graduation Year"
            required
            error={errors.expectedGraduationYear?.message}
          >
            <Input type="number" {...register("expectedGraduationYear")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Engineering Discipline"
            required
            error={errors.engineeringDiscipline?.message}
          >
            <Controller
              name="engineeringDiscipline"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-[8px]">
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_DISCIPLINES.map((discipline) => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2.5">
              <Controller
                name="workingPartTime"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <span className="font-sans text-sm text-navy">
                Working part-time in engineering?
              </span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <Field
              label="Personal Statement — Tell us about your engineering journey and why you want to join WiEZ"
              required
              error={errors.personalStatement?.message}
            >
              <textarea
                {...register("personalStatement")}
                rows={6}
                className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
              />
            </Field>
            <WordCounter value={watch("personalStatement")} min={100} max={500} />
          </div>
        </div>
      </div>
    );
  }

  if (typeName === "Graduate") {
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">Professional Information</h2>
        <p className="mt-1.5 font-sans text-sm text-slate-500">Tell us about your career so far.</p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <InstitutionFields form={form} errors={errors} />
          <Field label="Degree Obtained" required error={errors.degreeObtained?.message}>
            <Input {...register("degreeObtained")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Engineering Discipline"
            required
            error={errors.engineeringDiscipline?.message}
          >
            <Controller
              name="engineeringDiscipline"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-[8px]">
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_DISCIPLINES.map((discipline) => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Year of Graduation" required error={errors.yearOfGraduation?.message}>
            <Input type="number" {...register("yearOfGraduation")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Current Employment Status"
            required
            error={errors.employmentStatus?.message}
          >
            <Controller
              name="employmentStatus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-[8px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Employed", "Self-Employed", "Job Seeking", "Further Studies"].map(
                      (status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Current Employer (if applicable)">
            <Input {...register("currentEmployer")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Job Title (if applicable)">
            <Input {...register("jobTitle")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Years of Engineering Experience"
            required
            error={errors.yearsOfExperience?.message}
          >
            <Input type="number" {...register("yearsOfExperience")} className="h-11 rounded-[8px]" />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Professional Bio" required error={errors.professionalBio?.message}>
              <textarea
                {...register("professionalBio")}
                rows={5}
                className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
              />
            </Field>
            <WordCounter value={watch("professionalBio")} min={100} max={500} />
          </div>
          <div className="sm:col-span-2">
            <Field
              label="What do you hope to gain from WiEZ membership?"
              required
              error={errors.whatToGain?.message}
            >
              <textarea
                {...register("whatToGain")}
                rows={4}
                className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
              />
            </Field>
            <WordCounter value={watch("whatToGain")} min={50} max={1000} />
          </div>
        </div>
      </div>
    );
  }

  if (typeName === "Professional") {
    const areas = watch("areasOfExpertise") ?? [];
    return (
      <div>
        <h2 className="font-heading text-2xl font-bold text-navy">Professional Information</h2>
        <p className="mt-1.5 font-sans text-sm text-slate-500">
          Tell us about your professional engineering experience.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field
            label="Engineering Discipline"
            required
            error={errors.engineeringDiscipline?.message}
          >
            <Controller
              name="engineeringDiscipline"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 w-full rounded-[8px]">
                    <SelectValue placeholder="Select discipline" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENGINEERING_DISCIPLINES.map((discipline) => (
                      <SelectItem key={discipline} value={discipline}>
                        {discipline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field
            label="Highest Qualification"
            required
            error={errors.highestQualification?.message}
          >
            <Input {...register("highestQualification")} className="h-11 rounded-[8px]" />
          </Field>
          <InstitutionFields form={form} errors={errors} />
          <Field label="Year of Graduation" required error={errors.yearOfGraduation?.message}>
            <Input type="number" {...register("yearOfGraduation")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Current Employer" required error={errors.currentEmployer?.message}>
            <Input {...register("currentEmployer")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Job Title" required error={errors.jobTitle?.message}>
            <Input {...register("jobTitle")} className="h-11 rounded-[8px]" />
          </Field>
          <Field
            label="Years of Engineering Experience"
            required
            error={errors.yearsOfExperience?.message}
          >
            <Input type="number" {...register("yearsOfExperience")} className="h-11 rounded-[8px]" />
          </Field>
          <Field label="Engineering Council of Zimbabwe Registration Number">
            <Input {...register("ezRegistrationNumber")} className="h-11 rounded-[8px]" />
          </Field>
          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2.5">
              <Controller
                name="memberOfOtherBody"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <span className="font-sans text-sm text-navy">
                Member of any other professional body?
              </span>
            </label>
          </div>
          {watch("memberOfOtherBody") && (
            <Field label="Which professional body?">
              <Input {...register("otherBodyName")} className="h-11 rounded-[8px]" />
            </Field>
          )}

          <div className="sm:col-span-2">
            <Label>
              Areas of Expertise<span className="text-red-500"> *</span>
            </Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {AREAS_OF_EXPERTISE.map((area) => {
                const isSelected = areas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? areas.filter((a) => a !== area)
                        : [...areas, area];
                      form.setValue("areasOfExpertise", next);
                    }}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 font-nav text-xs font-medium transition-colors",
                      isSelected
                        ? "border-lime bg-lime/15 text-navy"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    )}
                  >
                    {area}
                  </button>
                );
              })}
            </div>
            <FieldError message={errors.areasOfExpertise?.message as string | undefined} />
          </div>

          <div className="sm:col-span-2">
            <Field label="Professional Achievements (optional)">
              <textarea
                {...register("professionalAchievements")}
                rows={3}
                className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Why do you want to join WiEZ?" required error={errors.whyJoinWiez?.message}>
              <textarea
                {...register("whyJoinWiez")}
                rows={5}
                className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
              />
            </Field>
            <WordCounter value={watch("whyJoinWiez")} min={150} max={1000} />
          </div>

          <div className="flex items-end pb-2.5">
            <label className="flex items-center gap-2.5">
              <Controller
                name="willingToMentor"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    checked={field.value === true}
                    onCheckedChange={(checked) => field.onChange(checked === true)}
                  />
                )}
              />
              <span className="font-sans text-sm text-navy">
                Willing to mentor younger engineers?
              </span>
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Corporate
  const disciplines = watch("companyDisciplines") ?? [];
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-navy">Company Profile</h2>
      <p className="mt-1.5 font-sans text-sm text-slate-500">
        Tell us more about your organization and its operations.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Nature of Business" required error={errors.natureOfBusiness?.message}>
          <Input {...register("natureOfBusiness")} className="h-11 rounded-[8px]" />
        </Field>
        <Field label="Years in Operation" required error={errors.yearsInOperation?.message}>
          <Input type="number" {...register("yearsInOperation")} className="h-11 rounded-[8px]" />
        </Field>

        <div className="sm:col-span-2">
          <Label>
            Engineering disciplines your company operates in
            <span className="text-red-500"> *</span>
          </Label>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {ENGINEERING_DISCIPLINES.map((discipline) => {
              const isSelected = disciplines.includes(discipline);
              return (
                <label
                  key={discipline}
                  className="flex items-center gap-2 rounded-lg border border-slate-100 p-2.5"
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const next = checked
                        ? [...disciplines, discipline]
                        : disciplines.filter((d) => d !== discipline);
                      form.setValue("companyDisciplines", next);
                    }}
                  />
                  <span className="font-sans text-sm text-navy">{discipline}</span>
                </label>
              );
            })}
          </div>
          <FieldError message={errors.companyDisciplines?.message as string | undefined} />
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Company Mission Statement"
            required
            error={errors.missionStatement?.message}
          >
            <textarea
              {...register("missionStatement")}
              rows={3}
              className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="How does your company support women in engineering?"
            required
            error={errors.howSupportWomen?.message}
          >
            <textarea
              {...register("howSupportWomen")}
              rows={5}
              className="w-full rounded-[8px] border border-input bg-transparent p-3 font-sans text-sm focus:border-lime focus:ring-2 focus:ring-lime/30 focus:outline-none"
            />
          </Field>
          <WordCounter value={watch("howSupportWomen")} min={100} max={1000} />
        </div>

        <div className="flex items-end pb-2.5">
          <label className="flex items-center gap-2.5">
            <Controller
              name="zimraRegistered"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value === true}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                />
              )}
            />
            <span className="font-sans text-sm text-navy">ZIMRA registered?</span>
          </label>
        </div>

        <Field label="Annual Turnover Range (optional)">
          <Controller
            name="annualTurnoverRange"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-11 w-full rounded-[8px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {["Under $100K", "$100K–$500K", "$500K–$1M", "Over $1M"].map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 4 — Document Upload
// ---------------------------------------------------------------------------

function StepFour({
  membershipType,
  documents,
  onDocumentsChange,
}: {
  membershipType: MembershipType;
  documents: Record<string, UploadedDocument | null>;
  onDocumentsChange: (next: Record<string, UploadedDocument | null>) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-navy">Upload Documents</h2>
      <p className="mt-1.5 font-sans text-sm text-slate-500">
        Upload the documents required for {membershipType.name} membership. Accepted formats:
        PDF, JPG, PNG, max 10MB.
      </p>

      <div className="mt-6 space-y-5">
        {membershipType.requiredDocuments.map((label) => {
          const isOptional = label.includes("(Optional)");
          const cleanLabel = label.replace(" (Optional)", "");
          return (
            <DocumentUploadField
              key={label}
              endpoint="membershipDocument"
              label={cleanLabel}
              required={!isOptional}
              value={documents[label] ?? null}
              onChange={(doc) => onDocumentsChange({ ...documents, [label]: doc })}
            />
          );
        })}
      </div>

      <div className="mt-8 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
        <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-500">
          Document Checklist
        </p>
        <ul className="mt-2 space-y-1.5">
          {membershipType.requiredDocuments.map((label) => {
            const isOptional = label.includes("(Optional)");
            const cleanLabel = label.replace(" (Optional)", "");
            const isUploaded = Boolean(documents[label]);
            return (
              <li key={label} className="flex items-center gap-2 font-sans text-sm">
                {isUploaded ? (
                  <Check className="size-3.5 text-green-600" strokeWidth={3} />
                ) : (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      isOptional ? "bg-slate-300" : "bg-red-400"
                    )}
                  />
                )}
                <span className={isUploaded ? "text-navy" : "text-slate-500"}>
                  {cleanLabel} {isOptional && "(optional)"}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 5 — Review & Submit
// ---------------------------------------------------------------------------

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-100 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-bold text-navy">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="font-nav text-xs font-semibold text-navy underline hover:text-lime"
        >
          Edit
        </button>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ReviewGrid({ entries }: { entries: [string, string | undefined][] }) {
  const filled = entries.filter(([, value]) => value);
  if (filled.length === 0) {
    return <p className="font-sans text-sm text-slate-400">No information provided.</p>;
  }
  return (
    <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {filled.map(([label, value]) => (
        <div key={label}>
          <dt className="font-nav text-xs uppercase tracking-wide text-slate-400">{label}</dt>
          <dd className="mt-0.5 font-sans text-sm text-navy">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function StepFive({
  membershipType,
  values,
  documents,
  isCorporate,
  declarationTruthful,
  declarationTerms,
  onDeclarationTruthfulChange,
  onDeclarationTermsChange,
  onEditStep,
}: {
  membershipType: MembershipType;
  values: MembershipApplicationData;
  documents: Record<string, UploadedDocument | null>;
  isCorporate: boolean;
  declarationTruthful: boolean;
  declarationTerms: boolean;
  onDeclarationTruthfulChange: (value: boolean) => void;
  onDeclarationTermsChange: (value: boolean) => void;
  onEditStep: (step: number) => void;
}) {
  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-navy">Review & Submit</h2>
      <p className="mt-1.5 font-sans text-sm text-slate-500">
        Please review your application carefully before submitting.
      </p>

      <div className="mt-6 space-y-4">
        <ReviewSection title="Membership Type" onEdit={() => onEditStep(1)}>
          <p className="font-sans text-sm text-navy">
            {membershipType.name} Member — ${membershipType.fee}/year
          </p>
        </ReviewSection>

        <ReviewSection
          title={isCorporate ? "Company Information" : "Personal Information"}
          onEdit={() => onEditStep(2)}
        >
          {isCorporate ? (
            <ReviewGrid
              entries={[
                ["Company Name", values.companyName],
                ["Registration Number", values.companyRegistrationNumber],
                ["Industry", values.industry],
                ["Female Engineers Employed", String(values.femaleEngineersCount ?? "")],
                ["Contact Person", values.contactPersonName],
                ["Contact Title", values.contactPersonTitle],
                ["Contact Email", values.contactPersonEmail],
                ["Contact Phone", values.contactPersonPhone],
                ["Company Address", values.companyAddress],
                ["Website", values.companyWebsite],
              ]}
            />
          ) : (
            <ReviewGrid
              entries={[
                ["Full Legal Name", values.fullLegalName],
                ["Date of Birth", values.dateOfBirth],
                ["Gender", values.gender],
                ["National ID", values.nationalId],
                ["Phone", values.phone],
                ["WhatsApp", values.whatsapp],
                ["Province", values.province],
                ["City/Town", values.city],
                ["Address", values.physicalAddress],
                ["LinkedIn", values.linkedinUrl],
              ]}
            />
          )}
        </ReviewSection>

        <ReviewSection title="Professional / Academic Information" onEdit={() => onEditStep(3)}>
          <ReviewGrid
            entries={[
              ["Institution", values.institution === "Other" ? values.institutionOther : values.institution],
              ["Faculty", values.faculty],
              ["Program", values.program],
              ["Year of Study", values.yearOfStudy],
              ["Degree Obtained", values.degreeObtained],
              ["Engineering Discipline", values.engineeringDiscipline],
              ["Year of Graduation", values.yearOfGraduation ? String(values.yearOfGraduation) : undefined],
              ["Employment Status", values.employmentStatus],
              ["Current Employer", values.currentEmployer],
              ["Job Title", values.jobTitle],
              [
                "Years of Experience",
                values.yearsOfExperience !== undefined ? String(values.yearsOfExperience) : undefined,
              ],
              ["Highest Qualification", values.highestQualification],
              ["Nature of Business", values.natureOfBusiness],
              ["Years in Operation", values.yearsInOperation ? String(values.yearsInOperation) : undefined],
            ]}
          />
          {values.personalStatement && (
            <blockquote className="mt-4 border-l-2 border-lime pl-4 font-sans text-sm leading-relaxed text-slate-600 italic">
              {values.personalStatement}
            </blockquote>
          )}
          {values.professionalBio && (
            <blockquote className="mt-4 border-l-2 border-lime pl-4 font-sans text-sm leading-relaxed text-slate-600 italic">
              {values.professionalBio}
            </blockquote>
          )}
          {values.whyJoinWiez && (
            <blockquote className="mt-4 border-l-2 border-lime pl-4 font-sans text-sm leading-relaxed text-slate-600 italic">
              {values.whyJoinWiez}
            </blockquote>
          )}
          {values.howSupportWomen && (
            <blockquote className="mt-4 border-l-2 border-lime pl-4 font-sans text-sm leading-relaxed text-slate-600 italic">
              {values.howSupportWomen}
            </blockquote>
          )}
        </ReviewSection>

        <ReviewSection title="Documents" onEdit={() => onEditStep(4)}>
          <ul className="space-y-1.5">
            {Object.entries(documents)
              .filter(([, value]) => value !== null)
              .map(([label, value]) => (
                <li key={label} className="flex items-center justify-between gap-2">
                  <span className="font-sans text-sm text-navy">{label}</span>
                  <a
                    href={value!.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-nav text-xs font-semibold text-navy underline hover:text-lime"
                  >
                    View
                  </a>
                </li>
              ))}
          </ul>
        </ReviewSection>
      </div>

      <div className="mt-6 space-y-3">
        <label className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <Checkbox
            checked={declarationTruthful}
            onCheckedChange={(checked) => onDeclarationTruthfulChange(checked === true)}
          />
          <span className="font-sans text-sm text-slate-600">
            I declare that all information provided in this application is true, accurate and
            complete. I understand that providing false or misleading information will result in
            rejection of my application or cancellation of membership.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-4">
          <Checkbox
            checked={declarationTerms}
            onCheckedChange={(checked) => onDeclarationTermsChange(checked === true)}
          />
          <span className="font-sans text-sm text-slate-600">
            I have read, understood and agree to the WiEZ Membership Terms and Conditions and
            Privacy Policy.
          </span>
        </label>
      </div>
    </div>
  );
}
