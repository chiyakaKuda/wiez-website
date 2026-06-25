function timeAgo(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export interface ActivityItem {
  id: string;
  memberName: string;
  action: string;
  timestamp: string;
}

export function RecentActivity({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return <p className="font-sans text-sm text-slate-500">No recent activity yet.</p>;
  }

  return (
    <ol className="space-y-5">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-3 pb-1">
          {index < items.length - 1 && (
            <span className="absolute top-8 left-3.5 h-[calc(100%-0.5rem)] w-px bg-slate-200" />
          )}
          <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full bg-navy font-nav text-[11px] font-semibold text-white">
            {initials(item.memberName)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-sans text-sm text-navy">
              <span className="font-semibold">{item.memberName}</span>{" "}
              <span className="text-slate-600">{item.action}</span>
            </p>
            <p className="mt-0.5 font-nav text-xs text-slate-400">
              {timeAgo(item.timestamp)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
