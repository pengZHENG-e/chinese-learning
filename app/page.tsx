"use client";
import { LESSONS, isLessonUnlocked } from "@/lib/data/lessons";
import { useProgress } from "@/lib/storage";
import LessonNode from "@/components/LessonNode";
import XPBar from "@/components/XPBar";
import { isDue } from "@/lib/srs";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { progress, hydrated } = useProgress();

  const dueCount = Object.entries(progress.reviews).filter(([, r]) => isDue(r)).length;
  const totalSeen = Object.keys(progress.reviews).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="hanzi text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            欢迎回来！
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Welcome back. Pick up where you left off.
          </p>
        </div>
        {hydrated && <XPBar xp={progress.xp} streak={progress.streak} />}
      </section>

      {/* Quick actions */}
      {hydrated && totalSeen > 0 && (
        <Link
          href="/flashcards"
          className="card flex items-center justify-between gap-4 border-brand-300 bg-gradient-to-r from-brand-50 to-amber-50 p-5 transition-all hover:scale-[1.01] dark:border-brand-800 dark:from-brand-950/40 dark:to-amber-950/40"
        >
          <div className="flex items-center gap-4">
            <div className="text-3xl">🔥</div>
            <div>
              <div className="font-bold text-zinc-900 dark:text-zinc-50">
                {dueCount > 0 ? `${dueCount} word${dueCount > 1 ? "s" : ""} due for review` : "All caught up!"}
              </div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {dueCount > 0 ? "Keep your streak alive" : "Try a new lesson below"}
              </div>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-brand-600" />
        </Link>
      )}

      {/* Lesson tree */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-zinc-700 dark:text-zinc-300">
          Your learning path
        </h2>
        <div className="flex flex-col gap-6">
          {LESSONS.map((lesson, i) => {
            const unlocked = isLessonUnlocked(lesson, progress.lessonsDone);
            const done = !!progress.lessonsDone[lesson.id];
            const status = !unlocked ? "locked" : done ? "done" : "available";
            const offset = (i % 3 === 0 ? 0 : i % 3 === 1 ? -1 : 1) as -1 | 0 | 1;
            return (
              <div key={lesson.id} className="relative w-full max-w-md self-center px-4">
                <LessonNode lesson={lesson} status={status} offset={offset} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
