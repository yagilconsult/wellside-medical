"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { label: "About", href: "/#meet-wulaimot" },
  { label: "Services", href: "/#services" },
  { label: "Insurance", href: "/#insurance" },
  { label: "FAQ", href: "/#faq" },
];

export function NavMenu() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const portalHref = session?.user?.role === "PROVIDER" ? "/admin" : "/portal";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="WellSide Behavioral Health"
            width={40}
            height={44}
            className="h-10 w-auto"
          />
          <span className="font-display font-semibold text-primary hidden sm:inline">
            WellSide Behavioral Health
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          {navLinks.map((l) => (
            <Link key={l.label} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/book">
            <Button size="sm">Book appointment</Button>
          </Link>
          {session ? (
            <Link
              href={portalHref}
              className="hidden md:inline text-sm text-primary font-medium"
            >
              My portal
            </Link>
          ) : (
            <Link href="/login" className="hidden md:inline text-sm text-muted-foreground">
              Sign in
            </Link>
          )}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <div className="flex flex-col px-6 py-4 gap-3 text-sm">
              {navLinks.map((l) => (
                <Link key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              ))}
              {session ? (
                <Link
                  href={portalHref}
                  onClick={() => setMobileOpen(false)}
                  className="text-primary font-medium"
                >
                  My portal
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  Sign in
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
