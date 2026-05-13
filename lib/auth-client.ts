"use client";
import { useEffect, useState, useCallback } from "react";

type Me = { configured: boolean; email: string | null };

let cache: Me | null = null;
const listeners = new Set<(m: Me) => void>();

async function refreshMe(): Promise<Me> {
  try {
    const r = await fetch("/api/auth/me", { cache: "no-store" });
    const j = (await r.json()) as Me;
    cache = j;
    for (const l of listeners) l(j);
    return j;
  } catch {
    const fallback: Me = { configured: false, email: null };
    cache = fallback;
    return fallback;
  }
}

export function useUser() {
  const [me, setMe] = useState<Me | null>(cache);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    let mounted = true;
    const l = (m: Me) => mounted && setMe(m);
    listeners.add(l);
    if (cache) setLoading(false);
    else refreshMe().finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
      listeners.delete(l);
    };
  }, []);

  const sendMagicLink = useCallback(async (email: string): Promise<{ ok: true } | { error: string }> => {
    const r = await fetch("/api/auth/send", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      return { error: (j as { error?: string }).error ?? "Failed to send." };
    }
    return { ok: true };
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    await refreshMe();
  }, []);

  return {
    user: me?.email ? { email: me.email } : null,
    configured: me?.configured ?? false,
    loading,
    sendMagicLink,
    signOut,
    refresh: refreshMe,
  };
}
