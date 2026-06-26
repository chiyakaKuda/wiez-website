import {
  UserPlus,
  ClipboardList,
  Upload,
  Send,
  Search,
  Mail,
  CreditCard,
  Award,
} from "lucide-react";

const STEPS = [
  { icon: UserPlus, title: "Create your WiEZ account" },
  { icon: ClipboardList, title: "Complete the online application form" },
  { icon: Upload, title: "Upload all required documents" },
  { icon: Send, title: "Submit your application" },
  { icon: Search, title: "Admin review (5–7 business days)" },
  { icon: Mail, title: "Receive outcome via email" },
  { icon: CreditCard, title: "Make membership payment (if approved)" },
  { icon: Award, title: "Receive your digital membership certificate" },
];

export function ApplicationProcess() {
  return (
    <section className="bg-slate-50 py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-nav text-xs font-semibold uppercase tracking-[0.2em] text-slate-custom">
            Application Process
          </p>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
            What to expect, step by step
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-navy">
                    <Icon className="size-4.5 text-lime" />
                  </div>
                  <span className="font-heading text-2xl font-extrabold text-slate-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-4 font-sans text-sm font-semibold leading-snug text-navy">
                  {step.title}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
