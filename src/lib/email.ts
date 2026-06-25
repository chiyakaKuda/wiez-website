type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

/**
 * No email provider was specified in the original spec. This sends via
 * Resend's HTTP API directly (no SDK dependency) when RESEND_API_KEY is
 * configured. Without it, the email is logged to the console instead so
 * verification/reset links remain usable in local development.
 */
export async function sendEmail({ to, subject, html }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "WiEZ <noreply@wiez.co.zw>";

  if (!apiKey) {
    console.log(
      `\n📧 [DEV EMAIL — no RESEND_API_KEY set]\nTo: ${to}\nSubject: ${subject}\n${html}\n`
    );
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Failed to send email via Resend: ${response.status} ${body}`);
  }
}
