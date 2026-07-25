import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Handles insurance card image uploads.
 *
 * Uses Vercel Blob in production (or whenever BLOB_READ_WRITE_TOKEN is
 * set). Without that token — e.g. fresh local dev before Blob storage is
 * configured — it falls back to writing into /public/uploads so the
 * whole upload flow still works end to end for local testing. That local
 * fallback only works in dev (Vercel's production filesystem is
 * read-only), which is fine since production always has the real token.
 */

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const label = (formData.get("label") as string) || "upload";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File is too large (10MB max)" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Please upload a JPG, PNG, HEIC, WEBP, or PDF file" },
      { status: 400 }
    );
  }

  const safeExt = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const filename = `insurance-cards/${session.user.id}/${label}-${Date.now()}.${safeExt}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local-dev fallback — no Blob token configured yet.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "File storage isn't configured yet. Add BLOB_READ_WRITE_TOKEN." },
      { status: 500 }
    );
  }

  const fs = await import("fs/promises");
  const path = await import("path");
  const localDir = path.join(process.cwd(), "public", "uploads", session.user.id);
  await fs.mkdir(localDir, { recursive: true });
  const localFilename = `${label}-${Date.now()}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(localDir, localFilename), buffer);

  return NextResponse.json({ url: `/uploads/${session.user.id}/${localFilename}` });
}
