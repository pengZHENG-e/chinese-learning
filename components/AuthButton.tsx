"use client";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { LogIn, LogOut, Loader2 } from "lucide-react";

export default function AuthButton() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400">
        <Loader2 size={16} className="animate-spin" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <button
        onClick={() => signIn("google")}
        className="flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
      >
        <LogIn size={14} />
        Sign in
      </button>
    );
  }

  const u = session.user;
  const initial = (u.name ?? u.email ?? "?")[0]?.toUpperCase();

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-brand-500 text-sm font-bold text-white"
        aria-label="Account"
      >
        {u.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.image} alt={u.name ?? "avatar"} className="h-full w-full object-cover" />
        ) : (
          initial
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="border-b border-zinc-200 p-3 text-sm dark:border-zinc-800">
              <div className="font-semibold">{u.name}</div>
              <div className="truncate text-xs text-zinc-500">{u.email}</div>
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
