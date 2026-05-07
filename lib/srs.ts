import type { Quality, ReviewState } from "@/lib/types";

export const DAY_MS = 24 * 60 * 60 * 1000;

export function newReviewState(): ReviewState {
  return { ef: 2.5, interval: 0, reps: 0, due: Date.now(), last: 0 };
}

/**
 * Simplified SM-2 spaced repetition.
 * quality: 0 again, 1 hard, 2 good, 3 easy.
 */
export function schedule(prev: ReviewState | undefined, q: Quality, now = Date.now()): ReviewState {
  const s = prev ? { ...prev } : newReviewState();
  if (q === 0) {
    s.reps = 0;
    s.interval = 0;
    s.ef = Math.max(1.3, s.ef - 0.2);
  } else {
    s.reps += 1;
    if (s.reps === 1) s.interval = q === 1 ? 1 : q === 2 ? 1 : 2;
    else if (s.reps === 2) s.interval = q === 1 ? 3 : q === 2 ? 4 : 6;
    else s.interval = Math.round(s.interval * s.ef * (q === 1 ? 0.8 : q === 2 ? 1 : 1.3));
    const delta = q === 1 ? -0.15 : q === 2 ? 0 : 0.15;
    s.ef = Math.max(1.3, s.ef + delta);
  }
  s.last = now;
  s.due = now + s.interval * DAY_MS;
  return s;
}

export function isDue(r: ReviewState | undefined, now = Date.now()): boolean {
  if (!r) return true;
  return r.due <= now;
}
