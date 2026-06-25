"use client";

import { toast } from "sonner";
import { FileText, Pencil, Plus, Sparkles, Trash2, UserPlus, Megaphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { RowActions } from "@/components/admin/row-actions";
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_PARTNERS,
  MOCK_FEATURED_ENGINEERS,
  MOCK_PAGES,
} from "@/lib/mock-data";

export default function ContentPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Content"
        description="Manage announcements, partners, featured engineers and site pages."
      />

      <Tabs defaultValue="announcements">
        <TabsList variant="line" className="flex-wrap">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="featured">Featured Engineers</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => toast.info("New announcement form opened")}
              className="h-9 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
            >
              <Plus className="size-4" />
              New Announcement
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {MOCK_ANNOUNCEMENTS.map((announcement) => (
                <li
                  key={announcement.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <Megaphone className="size-4 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="truncate font-sans text-sm font-medium text-navy">
                        {announcement.title}
                      </p>
                      <p className="font-sans text-xs text-slate-400">
                        {announcement.publishedDate ?? "Not published yet"}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusBadge status={announcement.status} />
                    <RowActions
                      actions={[
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => toast.info(`Editing "${announcement.title}"`),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => toast.error(`"${announcement.title}" deleted`),
                        },
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => toast.info("New partner form opened")}
              className="h-9 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
            >
              <UserPlus className="size-4" />
              New Partner
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {MOCK_PARTNERS.map((partner) => (
                <li
                  key={partner.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50"
                >
                  <p className="font-sans text-sm font-medium text-navy">{partner.name}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={partner.status} />
                    <RowActions
                      actions={[
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => toast.info(`Editing "${partner.name}"`),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => toast.error(`"${partner.name}" removed`),
                        },
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="featured" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() => toast.info("Feature an engineer form opened")}
              className="h-9 rounded-[6px] bg-navy text-white hover:bg-[#1E293B]"
            >
              <Sparkles className="size-4" />
              Feature an Engineer
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {MOCK_FEATURED_ENGINEERS.map((engineer) => (
                <li
                  key={engineer.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-sans text-sm font-medium text-navy">{engineer.name}</p>
                    <p className="font-sans text-xs text-slate-400">{engineer.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={engineer.status} />
                    <RowActions
                      actions={[
                        {
                          label: "Edit",
                          icon: Pencil,
                          onClick: () => toast.info(`Editing "${engineer.name}"`),
                        },
                        {
                          label: "Delete",
                          icon: Trash2,
                          destructive: true,
                          onClick: () => toast.error(`"${engineer.name}" removed`),
                        },
                      ]}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="mt-4 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white">
            <ul className="divide-y divide-slate-100">
              {MOCK_PAGES.map((page) => (
                <li
                  key={page.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="size-4 text-slate-400" />
                    <div>
                      <p className="font-sans text-sm font-medium text-navy">{page.title}</p>
                      <p className="font-sans text-xs text-slate-400">
                        Last updated {page.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <RowActions
                    actions={[
                      {
                        label: "Edit",
                        icon: Pencil,
                        onClick: () => toast.info(`Editing "${page.title}"`),
                      },
                    ]}
                  />
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
