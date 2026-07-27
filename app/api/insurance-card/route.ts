import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Serves private Vercel Blob files (insurance card photos) after
 * checking the requester is actually allowed to see them: either the
 * patient who uploaded it, or the provider. Private blobs have no public
 * URL, so this route is the only way to view one — see
 * app/api/upload/route.ts, which returns a URL pointing here instead of
 * the raw (inaccessible) blob URL.
 */

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const pathname = searchParams.get("path");
  if (!pathname) {
    return NextResponse.json({ error: "Missing path" }, { status: 400 });
  }

  // Uploads are namespaced as insurance-cards/{patientId}/... — only that
  // patient or a provider may view it.
  const match = pathname.match(/^insurance-cards\/([^/]+)\//);
  const ownerId = match?.[1];
  const isOwner = ownerId && ownerId === session.user.id;
  const isProvider = session.user.role === "PROVIDER";

  if (!ownerId || (!isOwner && !isProvider)) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "File storage isn't configured" }, { status: 500 });
  }

  const { get } = await import("@vercel/blob");
  const result = await get(pathname, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  if (!result || result.statusCode !== 200) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      "Content-Type": result.blob.contentType || "application/octet-stream",
      "Cache-Control": "private, max-age=300",
    },
  });
}
