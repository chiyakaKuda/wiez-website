import {
  Calendar,
  Handshake,
  Mail,
  MapPin,
  Phone,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

export type ContactCardData = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
};

export const CONTACT_CARDS: ContactCardData[] = [
  {
    id: "email",
    label: "Email",
    value: "info@wiez.org.zw",
    icon: Mail,
    href: "mailto:info@wiez.org.zw",
  },
  {
    id: "membership",
    label: "Membership",
    value: "membership@wiez.org.zw",
    icon: Users,
    href: "mailto:membership@wiez.org.zw",
  },
  {
    id: "partnerships",
    label: "Partnerships",
    value: "partnerships@wiez.org.zw",
    icon: Handshake,
    href: "mailto:partnerships@wiez.org.zw",
  },
  {
    id: "phone",
    label: "Phone",
    value: "+263 XX XXX XXXX",
    icon: Phone,
  },
  {
    id: "location",
    label: "Location",
    value: "Harare, Zimbabwe",
    icon: MapPin,
  },
];

export const QUICK_ACTIONS = [
  {
    id: "become-a-member",
    icon: UserPlus,
    title: "Become a Member",
    description:
      "Join Zimbabwe's largest community of women engineers and access mentorship, events and opportunities.",
    buttonLabel: "Join Now",
    href: "/membership",
  },
  {
    id: "partner-with-us",
    icon: Handshake,
    title: "Partner With Us",
    description:
      "Collaborate with WiEZ on programs that create real opportunities for women in engineering.",
    buttonLabel: "Become a Partner",
    href: "/partners/become-a-partner",
  },
  {
    id: "sponsor-an-event",
    icon: Calendar,
    title: "Sponsor an Event",
    description:
      "Support our conferences, workshops and outreach programs across Zimbabwe.",
    buttonLabel: "Sponsor an Event",
    href: "/partners/sponsor-an-event",
  },
];
