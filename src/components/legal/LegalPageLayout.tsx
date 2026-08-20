import type { ReactNode } from "react";

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
};

export default function LegalPageLayout({
  eyebrow,
  title,
  updated,
  children,
}: LegalPageLayoutProps) {
  return (
    <main className="relative bg-white pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-lime" />
          <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
            {eyebrow}
          </p>
        </div>

        <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
          {title}
        </h1>

        <p className="mt-4 font-sans text-sm text-slate-custom">
          Last updated: {updated}
        </p>

        <div className="prose-legal mt-12 space-y-10 font-sans text-[17px] leading-relaxed text-slate-custom [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-navy [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
          {children}
        </div>
      </div>
    </main>
  );
}
