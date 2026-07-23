"use client";

import Link from "next/link";
import { NavMenu } from "@/components/NavMenu";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main>
      <NavMenu />
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <p className="text-sm font-medium text-primary mb-3">Error 404</p>
        <h1 className="font-display text-2xl md:text-3xl font-semibold mb-3">
          We couldn&apos;t find that page
        </h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for may have moved or no longer
          exists. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button size="lg">Back to homepage</Button>
          </Link>
          <Link href="/book">
            <Button size="lg" variant="secondary">
              Book an appointment
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </main>
  );
}
