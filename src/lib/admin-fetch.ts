"use client";

/**
 * fetch() wrapper for admin API calls. Attaches the JWT automatically and,
 * on a 401 (expired/invalid token), clears it and hard-redirects to login
 * with a `next` param — instead of letting callers fall back to an empty
 * `data.items ?? []` and render a silently "stale" authenticated shell.
 */
export async function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") ?? "" : "";

  const res = await fetch(input, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 && typeof window !== "undefined" && !window.location.pathname.startsWith("/admin/login")) {
    localStorage.removeItem("admin_token");
    window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
  }

  return res;
}
