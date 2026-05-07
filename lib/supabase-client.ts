"use client";
import { useEffect, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;
let _checked = false;

/** Returns a singleton Supabase browser client, or null if env not configured. */
export function getSupabase(): SupabaseClient | null {
  if (_checked) return _client;
  _checked = true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
  return _client;
}

export function supabaseEnabled(): boolean {
  return !!getSupabase();
}

export type AuthState = {
  session: Session | null;
  loading: boolean;
  enabled: boolean;
};

export function useSupabaseSession(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const enabled = supabaseEnabled();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    let mounted = true;
    sb.auth.getSession().then(({ data }) => {
      if (mounted) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => {
      if (mounted) setSession(s);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, loading, enabled };
}
