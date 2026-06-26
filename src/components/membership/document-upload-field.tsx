"use client";

import { useCallback, useRef, useState } from "react";
import { CheckCircle2, Loader2, UploadCloud, X } from "lucide-react";
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export interface UploadedDocument {
  name: string;
  url: string;
  size: number;
}

const ENDPOINT_MAX_SIZE: Record<"membershipDocument" | "paymentProof", string> = {
  membershipDocument: "10MB",
  paymentProof: "5MB",
};

const ENDPOINT_MAX_BYTES: Record<"membershipDocument" | "paymentProof", number> = {
  membershipDocument: 10 * 1024 * 1024,
  paymentProof: 5 * 1024 * 1024,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentUploadField({
  endpoint,
  label,
  required,
  value,
  onChange,
}: {
  endpoint: "membershipDocument" | "paymentProof";
  label: string;
  required: boolean;
  value: UploadedDocument | null;
  onChange: (doc: UploadedDocument | null) => void;
}) {
  const [progress, setProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onUploadProgress: setProgress,
    onClientUploadComplete: (res) => {
      const file = res[0];
      if (file) {
        onChange({ name: file.name, url: file.ufsUrl, size: file.size });
      }
      setProgress(0);
    },
    onUploadError: (uploadError) => {
      setError(uploadError.message || "Upload failed. Please try again.");
      setProgress(0);
    },
  });

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const file = Array.from(files)[0];
      if (!file) return;

      if (file.size > ENDPOINT_MAX_BYTES[endpoint]) {
        setError(`File is too large. Maximum size is ${ENDPOINT_MAX_SIZE[endpoint]}.`);
        return;
      }

      setError(null);
      void startUpload([file]);
    },
    [startUpload, endpoint]
  );

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (event.dataTransfer.files.length) handleFiles(event.dataTransfer.files);
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="font-nav text-sm font-medium text-navy">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 font-nav text-[11px] font-medium",
            value
              ? "bg-green-100 text-green-700"
              : required
                ? "bg-red-100 text-red-700"
                : "bg-slate-100 text-slate-500"
          )}
        >
          {value ? "Uploaded" : required ? "Required" : "Optional"}
        </span>
      </div>

      {value ? (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-green-50">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-sm font-medium text-navy">{value.name}</p>
              <p className="font-sans text-xs text-slate-400">{formatFileSize(value.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => onChange(null)}
              aria-label={`Remove ${label}`}
              className="flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              inputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
            isDragOver ? "border-lime bg-lime/5" : "border-slate-200 hover:border-lime hover:bg-lime/5"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="sr-only"
            onChange={(event) => event.target.files && handleFiles(event.target.files)}
          />
          {isUploading ? (
            <>
              <Loader2 className="size-6 animate-spin text-navy" />
              <p className="mt-2 font-sans text-xs text-slate-500">Uploading... {progress}%</p>
              <div className="mt-2 h-1.5 w-full max-w-40 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full bg-lime transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <UploadCloud className="size-6 text-slate-400" />
              <p className="mt-2 font-sans text-xs text-slate-500">
                <span className="font-semibold text-navy">Click to upload</span> or drag and drop
              </p>
              <p className="mt-0.5 font-sans text-[11px] text-slate-400">
                PDF, JPG or PNG, max {ENDPOINT_MAX_SIZE[endpoint]}
              </p>
            </>
          )}
        </div>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
