"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProgress } from "@/lib/storage";
import { isDue } from "@/lib/srs";
import { VOCABULARY, getWord } from "@/lib/data/vocabulary";
import Flashcard from "@/components/Flashcard";
import type { Quality, Word } from "@/lib/types";
import { Sparkles } from "lucide-react";

export default function FlashcardsPage() {
  const { progress, hydrated, review } = useProgress();
  const [revealed, setRevealed] = useState(false);
  const [queue, setQueue] = useState<Word[]>([]);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (!hydrated) return;
    const seen = Object.keys(progress.reviews);
    const dueIds = seen.filter(id => isDue(progress.reviews[id]));
    let words: Word[] = dueIds.map(getWord).filter((w): w is Word => !!w);
    if (words.length === 0) {
      // Show a few random words to start practicing
      words = VOCABULARY.slice(0, 8);
    }
    setQueue(words);
    setDone(0);
    setRevealed(false);
  }, [hydrated]); // intentionally only on first hydration

  const current = queue[0];
  const total = useMemo(() => queue.length + done, [queue, done]);

  if (!hydrated) return null;

  if (!current) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center animate-fade-in">
        <Sparkles className="h-12 w-12 text-brand-500" />
        <h1 className="text-3xl font-bold">All caught up!</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          You finished {done} review{done === 1 ? "" : "s"}. Come back tomorrow.
        </p>
        <Link href="/" className="btn-primary">Back home</Link>
      </div>
    );
  }

  const grade = (q: Quality) => {
    review(current.id, q);
    setQueue(rest => rest.slice(1));
    setDone(d => d + 1);
    setRevealed(false);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review</h1>
        <span className="text-sm font-semibold text-zinc-500">
          {done + 1} / {total}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
        <div
          className="absolute inset-y-0 left-0 bg-emerald-500 transition-all"
          style={{ width: `${(done / total) * 100}%` }}
        />
      </div>

      <Flashcard
        word={current}
        defaultRevealed={false}
        onRevealed={() => setRevealed(true)}
        key={current.id + done}
      />

      {revealed ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button onClick={() => grade(0)} className="btn-danger">Again</button>
          <button onClick={() => grade(1)} className="btn-ghost">Hard</button>
          <button onClick={() => grade(2)} className="btn-success">Good</button>
          <button onClick={() => grade(3)} className="btn-primary">Easy</button>
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500">
          Try to recall the meaning, then tap the card to reveal.
        </p>
      )}
    </div>
  );
}
