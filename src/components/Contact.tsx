"use client";

import { motion } from "framer-motion";
import { X as XIcon } from "lucide-react";
import { CONTACT_CARDS, QUICK_ACTIONS } from "@/components/contact/data";
import ContactCard from "@/components/contact/ContactCard";
import ContactForm from "@/components/contact/ContactForm";
import MapPlaceholder from "@/components/contact/MapPlaceholder";
import QuickActionCard from "@/components/contact/QuickActionCard";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";

const EASE = [0.22, 1, 0.36, 1] as const;

const SOCIAL_LINKS = [
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "X (Twitter)", icon: XIcon, href: "#" },
];

const headerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

export default function Contact() {
  return (
    <section className="relative bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            <p className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-navy">
              Contact Us
            </p>
          </div>

          <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-navy sm:text-5xl">
            Let&apos;s Build the Future Together
          </h2>

          <p className="mt-5 font-sans text-lg leading-relaxed text-slate-custom">
            Whether you&apos;re interested in membership, partnerships,
            events or mentorship opportunities, we&apos;d love to hear from
            you.
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-[42%_58%] lg:gap-16">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={gridVariants}
            className="flex flex-col gap-4"
          >
            {CONTACT_CARDS.map((card) => (
              <motion.div key={card.id} variants={cardVariants}>
                <ContactCard card={card} />
              </motion.div>
            ))}

            <motion.div
              variants={cardVariants}
              className="rounded-[20px] bg-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.10)]"
            >
              <p className="font-nav text-xs font-semibold uppercase tracking-wide text-slate-custom">
                Social Media
              </p>
              <div className="mt-3 flex items-center gap-3">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-navy/5 text-navy transition-colors duration-300 hover:bg-navy hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <ContactForm />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mt-16"
        >
          <h3 className="font-heading text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
            Visit Us
          </h3>
          <div className="mt-6">
            <MapPlaceholder />
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={gridVariants}
          className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {QUICK_ACTIONS.map((action) => (
            <motion.div key={action.id} variants={cardVariants}>
              <QuickActionCard
                icon={action.icon}
                title={action.title}
                description={action.description}
                buttonLabel={action.buttonLabel}
                href={action.href}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
