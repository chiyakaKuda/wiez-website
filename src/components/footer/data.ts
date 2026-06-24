import { X as XIcon } from "lucide-react";
import LinkedinIcon from "@/components/icons/LinkedinIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import InstagramIcon from "@/components/icons/InstagramIcon";

export const QUICK_LINKS = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Events", href: "/events" },
  { label: "Membership", href: "/membership" },
  { label: "Contact", href: "/contact" },
];

export const RESOURCE_LINKS = [
  { label: "Mentorship", href: "/programs/mentorship" },
  { label: "Scholarships", href: "/programs/scholarships" },
  { label: "News", href: "/news" },
  { label: "Careers", href: "/careers" },
];

export const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
];

export const SOCIAL_LINKS = [
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
  { label: "Facebook", icon: FacebookIcon, href: "#" },
  { label: "Instagram", icon: InstagramIcon, href: "#" },
  { label: "X", icon: XIcon, href: "#" },
];

export const CONTACT_INFO = {
  email: "info@wiez.org.zw",
  phone: "+263 XX XXX XXXX",
  address: "Harare, Zimbabwe",
};
