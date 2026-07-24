import { Resend } from "resend";

/**
 * Real transactional email via Resend (https://resend.com).
 *
 * Requires RESEND_API_KEY in .env. Until it's set, emails are logged to
 * the console instead of sent — so local development and this sandbox
 * never break, but nothing ever silently fails to notify a real user in
 * production once the key is configured.
 *
 * The "from" address must be on a domain you've verified in Resend. Until
 * you verify wellsidebehavioralhealth.com there, RESEND_FROM_EMAIL should
 * stay on Resend's shared sandbox sender for testing.
 */

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL || "WellSide Behavioral Health <onboarding@resend.dev>";

const resend = apiKey ? new Resend(apiKey) : null;

async function sendEmail(to: string, subject: string, html: string) {
  if (!resend) {
    console.log("[email:dev-mode] RESEND_API_KEY not set — email not actually sent.");
    console.log(`  To: ${to}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: ${html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()}`);
    return { sent: false as const };
  }

  const { error } = await resend.emails.send({
    from: fromEmail,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("[email] Failed to send:", error);
    return { sent: false as const, error };
  }
  return { sent: true as const };
}

const wrapper = (bodyHtml: string) => `
  <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
    <p style="color: #0f6e56; font-weight: 600; font-size: 16px; margin-bottom: 24px;">
      WellSide Behavioral Health
    </p>
    ${bodyHtml}
    <p style="color: #94a3a8; font-size: 12px; margin-top: 32px;">
      This is an automated message from WellSide Behavioral Health.
    </p>
  </div>
`;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  return sendEmail(
    to,
    "Reset your WellSide password",
    wrapper(`
      <p style="font-size: 15px; color: #1a2e2a;">We received a request to reset your password.</p>
      <p style="font-size: 15px; color: #1a2e2a;">
        This link is valid for 30 minutes. If you didn't request this, you can safely ignore this email.
      </p>
      <a href="${resetUrl}" style="display: inline-block; background: #0f6e56; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 14px; font-weight: 500; margin-top: 12px;">
        Reset password
      </a>
      <p style="font-size: 12px; color: #94a3a8; margin-top: 16px;">
        Or paste this link into your browser: ${resetUrl}
      </p>
    `)
  );
}

export async function sendAppointmentConfirmationEmail(
  to: string,
  patientName: string,
  appointmentType: string,
  date: string,
  time: string
) {
  return sendEmail(
    to,
    "Your appointment is confirmed",
    wrapper(`
      <p style="font-size: 15px; color: #1a2e2a;">Hi ${patientName},</p>
      <p style="font-size: 15px; color: #1a2e2a;">
        Your appointment has been booked:
      </p>
      <p style="font-size: 15px; color: #1a2e2a; background: #eef7f4; padding: 12px 16px; border-radius: 8px;">
        <strong>${appointmentType}</strong><br />
        ${date} at ${time}
      </p>
      <p style="font-size: 15px; color: #1a2e2a;">
        You can view or manage this appointment anytime from your patient portal.
      </p>
    `)
  );
}
