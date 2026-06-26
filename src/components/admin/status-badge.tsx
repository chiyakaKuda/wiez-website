import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 text-green-700 border-green-200",
  Published: "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Paid: "bg-green-100 text-green-700 border-green-200",

  Open: "bg-blue-100 text-blue-700 border-blue-200",
  Upcoming: "bg-blue-100 text-blue-700 border-blue-200",
  Free: "bg-blue-100 text-blue-700 border-blue-200",
  Confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  Attended: "bg-green-100 text-green-700 border-green-200",

  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Unpaid: "bg-amber-100 text-amber-700 border-amber-200",
  "Pending Review": "bg-amber-100 text-amber-700 border-amber-200",
  Submitted: "bg-amber-100 text-amber-700 border-amber-200",
  Verified: "bg-green-100 text-green-700 border-green-200",

  "Sold Out": "bg-purple-100 text-purple-700 border-purple-200",

  Expired: "bg-red-100 text-red-700 border-red-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  Failed: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",

  Suspended: "bg-orange-100 text-orange-700 border-orange-200",

  Draft: "bg-slate-100 text-slate-600 border-slate-200",
  Waived: "bg-slate-100 text-slate-600 border-slate-200",
  Refunded: "bg-slate-100 text-slate-600 border-slate-200",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const styles = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-nav text-xs font-medium whitespace-nowrap",
        styles,
        className
      )}
    >
      {status}
    </span>
  );
}
