"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLogin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminLoginInner />
    </Suspense>
  );
}

function AdminLoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      localStorage.setItem("admin_token", data.token);
      router.push(searchParams.get("next") ?? "/admin");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-border p-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-foreground mb-8">Sign in</h1>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          {error && (
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-red-500">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
