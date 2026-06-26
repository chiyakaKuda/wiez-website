import { WhatsAppAPI } from "@/lib/whatsapp/api";

export async function sendMainMenu(to: string, isReturning = false): Promise<void> {
  const greeting = isReturning
    ? "Welcome back to WiEZ! 👋"
    : "👋 Welcome to *WiEZ* — Women in Engineering Zimbabwe!\n\nZimbabwe's premier network for women in engineering and technology.";

  await WhatsAppAPI.sendList(
    to,
    `${greeting}\n\nWhat would you like to do?`,
    "View Options",
    [
      {
        title: "Get Started",
        rows: [
          { id: "REGISTER", title: "Apply for Membership", description: "Join the WiEZ network" },
          { id: "LOGIN", title: "Login to My Account", description: "Access your WiEZ account" },
          { id: "EVENTS", title: "View & Register Events", description: "Browse upcoming events" },
          { id: "STATUS", title: "Track My Status", description: "Check application or registration" },
          { id: "ENQUIRY", title: "Make an Enquiry", description: "Ask us anything" },
        ],
      },
    ]
  );
}
