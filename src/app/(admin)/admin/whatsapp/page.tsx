import {
  getWhatsAppStats,
  getConversations,
  getOpenEnquiries,
  getDocumentUploadLog,
  getMessageLog,
} from "@/actions/whatsapp";
import { WhatsAppMonitoringView } from "@/components/admin/whatsapp/monitoring-view";

export default async function AdminWhatsAppPage() {
  const [stats, conversations, enquiries, documents, messages] = await Promise.all([
    getWhatsAppStats(),
    getConversations(),
    getOpenEnquiries(),
    getDocumentUploadLog(),
    getMessageLog(),
  ]);

  return (
    <WhatsAppMonitoringView
      stats={stats}
      conversations={conversations}
      enquiries={enquiries}
      documents={documents}
      messages={messages}
    />
  );
}
