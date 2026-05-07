"use client";
import { useEffect, useState, useCallback } from "react";
import type { Progress, ReviewState, Quality } from "@/lib/types";
import { schedule } from "@/lib/srs";

const KEY = "cl-progress-v1";

const initial = (): Progress => ({
  reviews: {},
  lessonsDone: {},
  xp: 0,
  streak: 0,
  lastStudyDay: null,
});

function load(): Progress {
  if (typeof window === "undefined") return initial();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initial();
    return { ...initial(), ...(JSON.parse(raw) as Progress) };
  } catch {
    return initial();
  }
}

function save(p: Progress) {
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

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(load());
    setHydrated(true);
  }, []);

  const update = useCallback((next: Progress | ((p: Progress) => Progress)) => {
    setProgress(prev => {
      const n = typeof next === "function" ? (next as (p: Progress) => Progress)(prev) : next;
      save(n);
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

  return { progress, hydrated, update, review, completeLesson, reset };
}

export function getReview(p: Progress, wordId: string): ReviewState | undefined {
  return p.reviews[wordId];
}
