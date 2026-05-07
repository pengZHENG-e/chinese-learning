"use client";
import { useState } from "react";
import type { Word } from "@/lib/types";
import PronounceButton from "./PronounceButton";
import { cn } from "@/lib/utils";

export default function Flashcard({
  word,
  defaultRevealed = false,
  onRevealed,
}: {
  word: Word;
  defaultRevealed?: boolean;
  onRevealed?: () => void;
}) {
  const [revealed, setRevealed] = useState(defaultRevealed);

  const reveal = () => {
    if (!revealed) {
      setRevealed(true);
      onRevealed?.();
    }
  };

  return (
    <div
      onClick={reveal}
      className={cn(
        "card relative w-full select-none overflow-hidden p-8 transition-all",
        !revealed && "cursor-pointer hover:border-brand-300"
      )}
    >
      <div className="flex flex-col items-center gap-4 py-6">
        <div className="hanzi text-7xl font-bold leading-none text-zinc-900 dark:text-zinc-50 sm:text-8xl">
          {word.hanzi}
        </div>

        {revealed ? (
          <div className="flex animate-fade-in flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <PronounceButton text={word.hanzi} />
              <span className="text-2xl font-medium text-brand-600">{word.pinyin}</span>
            </div>
            <p className="mt-2 text-center text-xl text-zinc-700 dark:text-zinc-200">
              {word.english}
            </p>
            {word.example && (
              <div className="mt-4 w-full rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-left dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="hanzi text-lg">{word.example.hanzi}</div>
                <div className="mt-1 text-sm text-brand-600">{word.example.pinyin}</div>
                <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{word.example.english}</div>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">Tap to reveal</p>
        )}
      </div>
    </div>
  );
}
