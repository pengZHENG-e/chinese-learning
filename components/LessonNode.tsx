"use client";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LessonNode({
  lesson,
  status,
  offset = 0,
}: {
  lesson: Lesson;
  status: "locked" | "available" | "done";
  /** -1 left, 0 center, 1 right */
  offset?: -1 | 0 | 1;
}) {
  const locked = status === "locked";
  const done = status === "done";

  const node = (
    <div
      className={cn(
        "group flex flex-col items-center gap-2",
        offset === -1 && "ml-0 mr-auto",
        offset === 0 && "mx-auto",
        offset === 1 && "ml-auto mr-0"
      )}
    >
      <div
        className={cn(
          "relative flex h-24 w-24 items-center justify-center rounded-full text-4xl shadow-[0_6px_0_0] transition-all",
          locked && "bg-zinc-200 text-zinc-400 shadow-zinc-300 dark:bg-zinc-800 dark:shadow-zinc-700",
          status === "available" && "bg-brand-500 text-white shadow-brand-700 group-hover:bg-brand-600 group-active:translate-y-1 group-active:shadow-[0_0_0_0]",
          done && "bg-emerald-500 text-white shadow-emerald-700 group-hover:bg-emerald-600"
        )}
      >
        {locked ? <Lock className="h-8 w-8" /> : lesson.emoji}
        {done && (
          <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-emerald-500 dark:border-zinc-950">
            <Check className="h-4 w-4 text-white" strokeWidth={3} />
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{lesson.title}</div>
        <div className="hanzi text-xs text-zinc-500">{lesson.titleZh}</div>
      </div>
    </div>
  );

  if (locked) return <div className="opacity-60">{node}</div>;
  return (
    <Link href={`/learn/${lesson.id}`} className="block">
      {node}
    </Link>
  );
}
