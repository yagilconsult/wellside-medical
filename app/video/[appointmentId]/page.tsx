"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function VideoVisitPage() {
  const params = useParams();
  const { data: session } = useSession();
  const appointmentId = params.appointmentId as string;

  const [callUrl, setCallUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function join() {
      try {
        const res = await fetch("/api/video/join", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setError(data.error ?? "Couldn't join the video visit.");
          return;
        }
        setCallUrl(data.url);
      } catch {
        if (!cancelled) setError("Couldn't connect. Check your internet connection and try again.");
      }
    }

    if (appointmentId) join();
    return () => {
      cancelled = true;
    };
  }, [appointmentId]);

  const backHref = session?.user?.role === "PROVIDER" ? "/admin" : "/portal";

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 bg-neutral-950">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm text-center"
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertCircle size={20} />
          </div>
          <p className="text-white font-medium mb-2">Couldn&apos;t join the video visit</p>
          <p className="text-neutral-400 text-sm mb-6">{error}</p>
          <Link href={backHref}>
            <Button variant="secondary" className="!bg-white/10 !text-white hover:!bg-white/15">
              <ArrowLeft size={14} />
              Back to portal
            </Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  if (!callUrl) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-3 text-white">
          <Loader2 size={22} className="animate-spin" />
          <p className="text-sm text-neutral-400">Connecting to your video visit…</p>
        </div>
      </main>
    );
  }

  return (
    <div className="h-screen w-screen bg-neutral-950">
      <iframe
        src={callUrl}
        allow="camera; microphone; fullscreen; display-capture; autoplay"
        className="h-full w-full border-0"
        title="Video visit"
      />
    </div>
  );
}
