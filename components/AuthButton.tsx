"use client";
import { useEffect, useState } from "react";
import { LogIn, LogOut, Loader2, Mail, Cloud, CloudOff, Check } from "lucide-react";
import { useUser } from "@/lib/auth-client";

export default function AuthButton() {
  const { user, configured, loading, sendMagicLink, signOut } = useUser();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear popover state when auth state changes
  useEffect(() => {
    setOpen(false);
    setSent(false);
    setError(null);
  }, [user?.email]);

  if (!configured && !loading) {
    return (
      <span
        title="Cloud sync not configured. Progress is saved on this device only."
        className="hidden items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-500 sm:flex dark:bg-zinc-800"
      >
        <CloudOff size={12} /> local only
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400">
        <Loader2 size={16} className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <LogIn size={14} />
          Sign in
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-40 mt-2 w-72 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  <Cloud size={16} className="text-brand-500" />
                  Sync your progress
                </div>
                {sent ? (
                  <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
                    <Check size={14} className="mt-0.5 shrink-0" />
                    <span>
                      Check <strong>{email}</strong> for a sign-in link. Open it on any device — your progress will sync.
                    </span>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSending(true);
                      setError(null);
                      const res = await sendMagicLink(email);
                      setSending(false);
                      if ("error" in res) setError(res.error);
                      else setSent(true);
                    }}
                    className="space-y-2"
                  >
                    <label className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 focus-within:border-brand-500 dark:border-zinc-700 dark:bg-zinc-950">
                      <Mail size={14} className="text-zinc-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm outline-none"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={sending || !email}
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_3px_0_0_theme(colors.brand.700)] hover:bg-brand-600 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                      Send magic link
                    </button>
                    {error && <p className="text-xs text-rose-600">{error}</p>}
                    <p className="pt-1 text-[10px] text-zinc-500">
                      No password — we email you a one-tap login link.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  const initial = (user.email ?? "?")[0]?.toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white"
        aria-label="Account"
      >
        {initial}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                <Cloud size={12} /> Synced
              </div>
              <div className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-200">
                {user.email}
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
