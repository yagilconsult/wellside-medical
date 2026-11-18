import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  findValidPasswordResetToken,
  markPasswordResetTokenUsed,
  updateUserPassword,
} from "@/lib/db";
import { allow, clientIp, TOO_MANY } from "@/lib/ratelimit";

export async function POST(req: Request) {
  if (!(await allow("reset", clientIp(req.headers), 10, "1 h"))) {
    return NextResponse.json({ error: TOO_MANY }, { status: 429 });
  }
  const { token, password } = await req.json();

  if (!token || !password) {
    return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 }
    );
  }

  const resetToken = await findValidPasswordResetToken(token);
  if (!resetToken) {
    return NextResponse.json(
      { error: "This reset link is invalid or has expired. Please request a new one." },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await updateUserPassword(resetToken.userId, passwordHash);
  await markPasswordResetTokenUsed(resetToken.id);

  return NextResponse.json({ ok: true });
}
