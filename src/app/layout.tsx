import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const montserratHeading = Montserrat({
  variable: "--font-montserrat-heading",
  subsets: ["latin"],
  weight: "800",
  display: "swap",
});

const montserratNav = Montserrat({
  variable: "--font-montserrat-nav",
  subsets: ["latin"],
  weight: "500",
  display: "swap",
});

const montserratBody = Montserrat({
  variable: "--font-montserrat-body",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Women in Engineering Zimbabwe",
  description:
    "Women in Engineering Zimbabwe connects, mentors, and champions women across the engineering profession.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserratHeading.variable} ${montserratNav.variable} ${montserratBody.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
