"use client";
import { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getLesson } from "@/lib/data/lessons";
import { getWords, VOCABULARY } from "@/lib/data/vocabulary";
import { useProgress } from "@/lib/storage";
import Exercise, { type ExerciseKind } from "@/components/Exercise";
import { shuffle } from "@/lib/utils";
import type { Word } from "@/lib/types";
import { ArrowLeft, X } from "lucide-react";

type Step = { kind: ExerciseKind; word: Word };

function buildSteps(words: Word[]): Step[] {
  const steps: Step[] = [];
  for (const w of words) steps.push({ kind: "introduce", word: w });
  for (const w of shuffle(words)) steps.push({ kind: "zh-to-en", word: w });
  for (const w of shuffle(words)) steps.push({ kind: "en-to-zh", word: w });
  for (const w of shuffle(words)) steps.push({ kind: "listen-to-zh", word: w });
  return steps;
}

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lesson = getLesson(params.id);
  const { review, completeLesson } = useProgress();

  const words = useMemo(() => (lesson ? getWords(lesson.words) : []), [lesson]);
  const steps = useMemo(() => buildSteps(words), [words]);
  const pool = useMemo(() => (words.length >= 4 ? words : VOCABULARY), [words]);

  const [i, setI] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [done, setDone] = useState(false);

  if (!lesson) {
    return (
      <div className="py-20 text-center">
        <p>Lesson not found.</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">Back home</Link>
      </div>
    );
  }

  if (done) {
    const acc = stats.correct + stats.wrong === 0
      ? 100
      : Math.round((stats.correct / (stats.correct + stats.wrong)) * 100);
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 text-center animate-fade-in">
        <div className="text-7xl">🎉</div>
        <h1 className="text-3xl font-bold">Lesson complete!</h1>
        <p className="hanzi text-xl text-brand-600">{lesson.titleZh}</p>
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <div className="text-2xl font-bold text-emerald-600">{stats.correct}</div>
            <div className="text-xs text-zinc-500">Correct</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-rose-600">{stats.wrong}</div>
            <div className="text-xs text-zinc-500">Mistakes</div>
          </div>
          <div className="card p-4">
            <div className="text-2xl font-bold text-brand-600">{acc}%</div>
            <div className="text-xs text-zinc-500">Accuracy</div>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/" className="btn-ghost">Home</Link>
          <Link href="/flashcards" className="btn-primary">Review words</Link>
        </div>
      </div>
    );
  }

  const step = steps[i];
  const progress = (i / steps.length) * 100;

  const advance = () => {
    if (i + 1 >= steps.length) {
      completeLesson(lesson.id);
      setDone(true);
    } else {
      setI(i + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Progress header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/")} className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800" aria-label="Exit">
          <X size={20} />
        </button>
        <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="hidden text-sm font-semibold tabular-nums text-zinc-500 sm:inline">
          {i + 1} / {steps.length}
        </span>
      </div>

      <Exercise
        key={i}
        kind={step.kind}
        word={step.word}
        pool={pool}
        onCorrect={() => {
          setStats(s => ({ ...s, correct: s.correct + 1 }));
          review(step.word.id, 2);
        }}
        onWrong={() => {
          setStats(s => ({ ...s, wrong: s.wrong + 1 }));
          review(step.word.id, 0);
        }}
        onContinue={advance}
      />
    </div>
  );
}
