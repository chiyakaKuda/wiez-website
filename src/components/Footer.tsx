"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/Logo";
import {
  QUICK_LINKS,
  RESOURCE_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
  CONTACT_INFO,
} from "@/components/footer/data";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h3 className="font-nav text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
        {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
  }

  return (
    <footer className="bg-navy">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_0.9fr_0.9fr_1fr_1.2fr] lg:gap-8">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs font-sans text-sm leading-relaxed text-white/60">
              Empowering, connecting and inspiring women engineers to shape
              the future of engineering across Zimbabwe.
            </p>
          </div>

          <FooterColumn title="Quick Links">
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/70 transition-colors duration-300 hover:text-lime"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Resources">
            <ul className="space-y-3">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/70 transition-colors duration-300 hover:text-lime"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Connect">
            <div className="flex items-center gap-2.5">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-lime hover:text-navy"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="font-sans text-sm text-white/70 transition-colors duration-300 hover:text-lime"
                >
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <span className="font-sans text-sm text-white/70">
                  {CONTACT_INFO.phone}
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-lime" />
                <span className="font-sans text-sm text-white/70">
                  {CONTACT_INFO.address}
                </span>
              </li>
            </ul>
          </FooterColumn>

          <div>
            <h3 className="font-nav text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Stay Updated
            </h3>
            <p className="mt-4 font-sans text-sm text-white/60">
              Get event invites and opportunities in your inbox.
            </p>

            {subscribed ? (
              <p className="mt-4 font-nav text-sm font-semibold text-lime">
                You&apos;re subscribed. Thank you!
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1.5"
              >
                <label htmlFor="footer-email" className="sr-only">
                  Email Address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 font-sans text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lime text-navy transition-transform duration-300 hover:scale-105"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="font-sans text-xs text-white/50">
            &copy; {new Date().getFullYear()} Women in Engineering Zimbabwe.
            All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-xs text-white/50 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
