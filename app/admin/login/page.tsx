"use client";

import { Lock } from "lucide-react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(searchParams.get("error") ? "Invalid credentials." : "");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      redirect: false,
      callbackUrl: "/admin"
    });
    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <main className="grid min-h-screen place-items-center bg-bg p-4 text-text">
      <Card className="w-full max-w-md p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-[8px] bg-primary/10 p-3 text-primary"><Lock size={22} /></div>
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted">Credentials-only access for the portfolio owner.</p>
          </div>
        </div>
        <form onSubmit={submit} className="grid gap-4">
          <Input name="email" type="email" placeholder="admin@example.com" required />
          <Input name="password" type="password" placeholder="Password" required />
          {error ? <p className="rounded-[6px] bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>
      </Card>
    </main>
  );
}
