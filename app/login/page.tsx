"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    const session = await getSession();
    const role = (session?.user as any)?.role;
    router.push(role === "PROVIDER" ? "/admin" : "/portal");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        <Link href="/" className="block text-center mb-6">
          <span className="font-display font-semibold text-primary">
            WellSide Behavioral Health
          </span>
        </Link>

        <Card className="p-6">
          <p className="font-medium mb-1">Sign in</p>
          <p className="text-sm text-muted-foreground mb-6">
            Access your patient or provider portal.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full justify-center" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-5">
            New patient?{" "}
            <Link href="/register" className="text-primary underline">
              Create an account
            </Link>
          </p>
        </Card>

        <div className="mt-5 flex items-start gap-2 rounded-lg bg-accent p-4">
          <Info size={15} className="text-primary mt-0.5 shrink-0" />
          <div className="text-xs text-accent-foreground leading-relaxed">
            <p className="font-medium mb-1">Demo accounts (local dev only)</p>
            <p>Patient: jordan@example.com / password123</p>
            <p>Provider: provider@wellsidebh.com / password123</p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
