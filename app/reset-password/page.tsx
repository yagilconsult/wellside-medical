"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Field } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <Card className="p-6 text-center">
        <p className="font-medium mb-2">Invalid reset link</p>
        <p className="text-sm text-muted-foreground mb-4">
          This link is missing its reset code. Please request a new one.
        </p>
        <Link href="/forgot-password">
          <Button className="w-full justify-center">Request new link</Button>
        </Link>
      </Card>
    );
  }

  if (success) {
    return (
      <Card className="p-6 text-center py-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-primary">
          <CheckCircle2 size={20} />
        </div>
        <p className="font-medium mb-1">Password updated</p>
        <p className="text-sm text-muted-foreground">
          Taking you to sign in…
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="font-medium mb-1">Set a new password</p>
      <p className="text-sm text-muted-foreground mb-6">
        Choose a new password for your account.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="New password" htmlFor="password">
          <Input
            id="password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </Field>
        <Field label="Confirm new password" htmlFor="confirm">
          <Input
            id="confirm"
            type="password"
            required
            minLength={8}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Re-enter your new password"
          />
        </Field>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
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
        <Suspense fallback={<Card className="p-6 h-48" />}>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </main>
  );
}
