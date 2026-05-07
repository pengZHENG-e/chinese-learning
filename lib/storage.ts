"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import type { Progress, ReviewState, Quality } from "@/lib/types";
import { schedule } from "@/lib/srs";

const KEY = "cl-progress-v1";
const SYNC_DEBOUNCE_MS = 1500;

const initial = (): Progress => ({
  reviews: {},
  lessonsDone: {},
  xp: 0,
  streak: 0,
  lastStudyDay: null,
});

function loadLocal(): Progress {
  if (typeof window === "undefined") return initial();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial();
    return { ...initial(), ...(JSON.parse(raw) as Progress) };
  } catch {
    return initial();
  }
}

function saveLocal(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}

function todayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function bumpStreak(p: Progress): Progress {
  const today = todayKey();
  if (p.lastStudyDay === today) return p;
  const yesterday = todayKey(new Date(Date.now() - 24 * 60 * 60 * 1000));
  const streak = p.lastStudyDay === yesterday ? p.streak + 1 : 1;
  return { ...p, streak, lastStudyDay: today };
}

function score(p: Progress): number {
  // Higher score wins on initial sign-in merge.
  return p.xp + Object.keys(p.reviews).length + Object.keys(p.lessonsDone).length;
}

async function fetchRemote(): Promise<Progress | null> {
  try {
    const r = await fetch("/api/progress", { cache: "no-store" });
    if (!r.ok) return null;
    const j = await r.json();
    return (j.progress as Progress | null) ?? null;
  } catch {
    return null;
  }
}

async function pushRemote(p: Progress): Promise<void> {
  try {
    await fetch("/api/progress", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ progress: p }),
    });
  } catch {
    // ignore network errors — local copy is canonical when offline
  }
}

export function useProgress() {
  const { status } = useSession();
  const [progress, setProgress] = useState<Progress>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didInitialSync = useRef(false);

  // Initial local hydration
  useEffect(() => {
    setProgress(loadLocal());
    setHydrated(true);
  }, []);

  // On sign-in: pull remote and reconcile
  useEffect(() => {
    if (!hydrated) return;
    if (status !== "authenticated") {
      didInitialSync.current = false;
      return;
    }
    if (didInitialSync.current) return;
    didInitialSync.current = true;

    (async () => {
      setSyncing(true);
      const remote = await fetchRemote();
      const local = loadLocal();
      let winner: Progress;
      if (!remote) {
        winner = local;
        // Push local to seed the remote row (even if empty — harmless)
        await pushRemote(winner);
      } else if (score(local) > score(remote)) {
        winner = local;
        await pushRemote(winner);
      } else {
        winner = remote;
      }
      saveLocal(winner);
      setProgress(winner);
      setSyncing(false);
    })();
  }, [status, hydrated]);

  // Debounced push on every progress change while authenticated
  useEffect(() => {
    if (!hydrated || status !== "authenticated") return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    pushTimer.current = setTimeout(() => {
      pushRemote(progress);
    }, SYNC_DEBOUNCE_MS);
    return () => {
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [progress, status, hydrated]);

  const update = useCallback((next: Progress | ((p: Progress) => Progress)) => {
    setProgress(prev => {
      const n = typeof next === "function" ? (next as (p: Progress) => Progress)(prev) : next;
      saveLocal(n);
      return n;
    });
  }, []);

  const review = useCallback((wordId: string, q: Quality) => {
    update(p => {
      const r = schedule(p.reviews[wordId], q);
      const xpGain = q === 0 ? 0 : q === 1 ? 5 : q === 2 ? 10 : 15;
      return bumpStreak({
        ...p,
        reviews: { ...p.reviews, [wordId]: r },
        xp: p.xp + xpGain,
      });
    });
  }, [update]);

  const completeLesson = useCallback((lessonId: string) => {
    update(p => bumpStreak({
      ...p,
      lessonsDone: { ...p.lessonsDone, [lessonId]: true },
      xp: p.xp + 30,
    }));
  }, [update]);

  const reset = useCallback(() => update(initial()), [update]);

  return { progress, hydrated, syncing, update, review, completeLesson, reset };
}

export function getReview(p: Progress, wordId: string): ReviewState | undefined {
  return p.reviews[wordId];
}
