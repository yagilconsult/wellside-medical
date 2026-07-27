import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/scheduling";

/**
 * Public on purpose — the guest booking flow needs to check availability
 * before an account exists. Doesn't expose anything sensitive, just
 * which times are open on a given date.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const type = searchParams.get("type");

  if (!date || !type) {
    return NextResponse.json({ error: "Missing date or type" }, { status: 400 });
  }

  const slots = await getAvailableSlots(date, type);
  return NextResponse.json({ slots });
}
