import { NextResponse } from "next/server";
import { findUserByEmail, createPasswordResetToken } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";
import { allow, clientIp, TOO_MANY } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const { email } = await req.json();

  const ipOk = await allow("forgot-ip", clientIp(req.headers), 5, "1 h");
  const emailOk =
    typeof email === "string" ? await allow("forgot-email", email.toLowerCase().trim(), 3, "1 h") : true;
  if (!ipOk || !emailOk) {
    return NextResponse.json({ error: TOO_MANY }, { status: 429 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // Always return the same success response whether or not the email
  // exists — this prevents leaking which emails are registered.
  const user = await findUserByEmail(email);

  if (user) {
    const resetToken = await createPasswordResetToken(user.id);
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken.token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return NextResponse.json({ ok: true });
}
