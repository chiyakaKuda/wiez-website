"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Loader2, MessageCircle, MessageSquareWarning, Users, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { EmptyState } from "@/components/admin/empty-state";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { resolveEnquiry } from "@/actions/whatsapp";
import type {
  WhatsAppStats,
  ConversationListItem,
  EnquiryListItem,
  DocumentUploadLogItem,
} from "@/actions/whatsapp";
import type { WhatsAppMessageLogEntry } from "@/types/whatsapp";

function formatDateTime(value: Date | string): string {
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  membership: "Membership",
  events: "Events",
  payment: "Payment",
  technical: "Technical",
  other: "Other",
};

const DOC_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  uploaded: "Uploaded",
  failed: "Failed",
};

const conversationColumns = createColumnHelper<ConversationListItem>();
const enquiryColumns = createColumnHelper<EnquiryListItem>();
const documentColumns = createColumnHelper<DocumentUploadLogItem>();
const messageColumns = createColumnHelper<WhatsAppMessageLogEntry>();

function ResolveEnquiryButton({ id, onSuccess }: { id: string; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await resolveEnquiry(id);
    setLoading(false);
    if (result.success) {
      toast.success("Enquiry marked as resolved.");
      onSuccess();
    } else {
      toast.error(result.error ?? "Failed to resolve enquiry.");
    }
  }

  return (
    <Button
      type="button"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className="h-8 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
    >
      {loading && <Loader2 className="size-3.5 animate-spin" />}
      Mark Resolved
    </Button>
  );
}

export function WhatsAppMonitoringView({
  stats,
  conversations,
  enquiries,
  documents,
  messages,
}: {
  stats: WhatsAppStats;
  conversations: ConversationListItem[];
  enquiries: EnquiryListItem[];
  documents: DocumentUploadLogItem[];
  messages: WhatsAppMessageLogEntry[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState("conversations");

  function refresh() {
    router.refresh();
  }

  const conversationCols = useMemo(
    () => [
      conversationColumns.accessor("whatsappNumber", {
        header: "WhatsApp Number",
        cell: (info) => (
          <div>
            <p className="font-medium text-navy">{info.getValue()}</p>
            {info.row.original.linkedName && (
              <p className="text-xs text-slate-400">
                {info.row.original.linkedName} · {info.row.original.linkedEmail}
              </p>
            )}
          </div>
        ),
      }),
      conversationColumns.accessor("currentFlow", {
        header: "Current Flow",
        cell: (info) => (info.getValue() ? <span className="capitalize">{info.getValue()}</span> : "—"),
      }),
      conversationColumns.accessor("currentStep", {
        header: "Step",
        cell: (info) => info.getValue() ?? "—",
      }),
      conversationColumns.accessor("isAuthenticated", {
        header: "Authenticated",
        cell: (info) => (info.getValue() ? <StatusBadge status="Active" /> : "—"),
      }),
      conversationColumns.accessor("lastMessageAt", {
        header: "Last Message",
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    []
  );

  const enquiryCols = useMemo(
    () => [
      enquiryColumns.accessor("whatsappNumber", {
        header: "WhatsApp Number",
        cell: (info) => (
          <div>
            <p className="font-medium text-navy">{info.getValue()}</p>
            {info.row.original.linkedName && (
              <p className="text-xs text-slate-400">{info.row.original.linkedName}</p>
            )}
          </div>
        ),
      }),
      enquiryColumns.accessor("category", {
        header: "Category",
        cell: (info) => CATEGORY_LABELS[info.getValue()] ?? info.getValue(),
      }),
      enquiryColumns.accessor("message", {
        header: "Message",
        cell: (info) => <p className="max-w-md truncate">{info.getValue()}</p>,
      }),
      enquiryColumns.accessor("createdAt", {
        header: "Received",
        cell: (info) => formatDateTime(info.getValue()),
      }),
      enquiryColumns.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <ResolveEnquiryButton id={row.original.id} onSuccess={refresh} />,
      }),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh is stable across renders
    []
  );

  const documentCols = useMemo(
    () => [
      documentColumns.accessor("whatsappNumber", { header: "WhatsApp Number" }),
      documentColumns.accessor("documentType", {
        header: "Document Type",
        cell: (info) => <span className="capitalize">{info.getValue().replace(/_/g, " ")}</span>,
      }),
      documentColumns.accessor("filename", { header: "Filename" }),
      documentColumns.accessor("membershipReference", {
        header: "Membership",
        cell: (info) => info.getValue() ?? "—",
      }),
      documentColumns.accessor("status", {
        header: "Status",
        cell: (info) => <StatusBadge status={DOC_STATUS_LABELS[info.getValue()] ?? info.getValue()} />,
      }),
      documentColumns.accessor("createdAt", {
        header: "Uploaded",
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    []
  );

  const messageCols = useMemo(
    () => [
      messageColumns.accessor("whatsappNumber", { header: "WhatsApp Number" }),
      messageColumns.accessor("direction", {
        header: "Direction",
        cell: (info) => (
          <StatusBadge
            status={info.getValue() === "inbound" ? "Inbound" : "Outbound"}
            className={
              info.getValue() === "inbound"
                ? "bg-blue-100 text-blue-700 border-blue-200"
                : "bg-slate-100 text-slate-600 border-slate-200"
            }
          />
        ),
      }),
      messageColumns.accessor("messageType", {
        header: "Type",
        cell: (info) => <span className="capitalize">{info.getValue()}</span>,
      }),
      messageColumns.accessor("flow", {
        header: "Flow",
        cell: (info) => (info.getValue() ? <span className="capitalize">{info.getValue()}</span> : "—"),
      }),
      messageColumns.accessor("step", {
        header: "Step",
        cell: (info) => info.getValue() ?? "—",
      }),
      messageColumns.accessor("content", {
        header: "Content",
        cell: (info) => <p className="max-w-md truncate">{info.getValue()}</p>,
      }),
      messageColumns.accessor("createdAt", {
        header: "Time",
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    []
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="WhatsApp Bot Monitoring"
        description="Monitor conversations, enquiries, document uploads and message activity."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total WhatsApp Users" value={stats.totalUsers} icon={Users} index={0} />
        <StatCard title="Active Today" value={stats.activeToday} icon={MessageCircle} index={1} />
        <StatCard
          title="Pending Enquiries"
          value={stats.pendingEnquiries}
          icon={MessageSquareWarning}
          highlight={stats.pendingEnquiries > 0}
          index={2}
        />
        <StatCard title="Documents Today" value={stats.documentsToday} icon={FileCheck2} index={3} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="flex-wrap">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="enquiries">
            Pending Enquiries{enquiries.length > 0 ? ` (${enquiries.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="documents">Document Upload Log</TabsTrigger>
          <TabsTrigger value="messages">Message Log</TabsTrigger>
        </TabsList>

        <TabsContent value="conversations">
          {conversations.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={conversationCols} data={conversations} />
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No conversations yet"
              description="WhatsApp conversations will appear here once users start messaging the bot."
            />
          )}
        </TabsContent>

        <TabsContent value="enquiries">
          {enquiries.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={enquiryCols} data={enquiries} />
            </div>
          ) : (
            <EmptyState
              icon={MessageSquareWarning}
              title="No pending enquiries"
              description="Enquiries that need a human follow-up will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="documents">
          {documents.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={documentCols} data={documents} />
            </div>
          ) : (
            <EmptyState
              icon={FileCheck2}
              title="No documents uploaded yet"
              description="Documents uploaded via WhatsApp during registration will appear here."
            />
          )}
        </TabsContent>

        <TabsContent value="messages">
          {messages.length > 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white">
              <DataTable columns={messageCols} data={messages} />
            </div>
          ) : (
            <EmptyState
              icon={MessageCircle}
              title="No messages yet"
              description="Inbound and outbound WhatsApp messages will be logged here."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
