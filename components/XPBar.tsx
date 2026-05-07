"use client";
import { Flame, Star } from "lucide-react";

export default function XPBar({ xp, streak }: { xp: number; streak: number }) {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
        <Flame size={16} className="fill-amber-500 text-amber-500" />
        <span className="text-sm font-bold">{streak}</span>
      </div>
      <div className="flex flex-1 items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1.5 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
          <Star size={16} className="fill-brand-500 text-brand-500" />
          <span className="text-sm font-bold">Lv {level}</span>
        </div>
        <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-semibold tabular-nums text-zinc-500">{xp} XP</span>
      </div>
    </div>
  );
}
