"use client";

import Image from "next/image";
import Link from "next/link";

export function PortalTopBar({
  name,
  roleLabel,
  initials,
}: {
  name: string;
  roleLabel: string;
  initials: string;
}) {
  return (
    <div className="flex items-center justify-between pb-5 mb-6 border-b border-border">
      <Link href="/" className="flex items-center gap-2.5">
        <Image
          src="/images/logo.png"
          alt="WellSide Behavioral Health"
          width={32}
          height={36}
          className="h-8 w-auto"
        />
        <span className="font-display font-semibold text-primary hidden sm:inline">
          WellSide Behavioral Health
        </span>
      </Link>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium leading-tight">{name}</p>
          <p className="text-xs text-muted-foreground leading-tight">{roleLabel}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium shrink-0">
          {initials}
        </div>
      </div>
    </div>
  );
}
