"use client";
import { useMemo, useState } from "react";
import type { Word } from "@/lib/types";
import PronounceButton from "./PronounceButton";
import { speak } from "@/lib/tts";
import { cn, shuffle } from "@/lib/utils";
import { Volume2 } from "lucide-react";

export type ExerciseKind = "introduce" | "zh-to-en" | "en-to-zh" | "listen-to-zh";

export type ExerciseProps = {
  kind: ExerciseKind;
  word: Word;
  /** Pool of distractors (other words from the lesson) */
  pool: Word[];
  onCorrect: () => void;
  onWrong: () => void;
  /** Called when user clicks "Continue" — always invoked exactly once */
  onContinue: () => void;
};

export default function Exercise(props: ExerciseProps) {
  if (props.kind === "introduce") return <Introduce {...props} />;
  return <ChoiceExercise {...props} />;
}

function Introduce({ word, onContinue, onCorrect }: ExerciseProps) {
  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        New word
      </p>
      <div className="card flex flex-col items-center gap-4 p-10">
        <div className="hanzi text-8xl font-bold text-zinc-900 dark:text-zinc-50">
          {word.hanzi}
        </div>
        <button
          onClick={() => speak(word.hanzi)}
          className="flex items-center gap-2 text-2xl font-medium text-brand-600"
        >
          <Volume2 className="h-5 w-5" />
          {word.pinyin}
        </button>
        <p className="text-2xl text-zinc-700 dark:text-zinc-200">{word.english}</p>
        {word.example && (
          <div className="mt-4 w-full max-w-md rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="hanzi text-lg">{word.example.hanzi}</div>
            <div className="mt-1 text-sm text-brand-600">{word.example.pinyin}</div>
            <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {word.example.english}
            </div>
          </div>
        )}
      </div>
      <button
        className="btn-primary w-full max-w-sm"
        onClick={() => {
          onCorrect();
          onContinue();
        }}
      >
        Got it
      </button>
    </div>
  );
}

function ChoiceExercise({ kind, word, pool, onCorrect, onWrong, onContinue }: ExerciseProps) {
  const options = useMemo(() => {
    const others = pool.filter(w => w.id !== word.id);
    const distractors = shuffle(others).slice(0, 3);
    return shuffle([word, ...distractors]);
  }, [word, pool]);

  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === word.id;

  const promptTop =
    kind === "zh-to-en" ? word.hanzi
    : kind === "listen-to-zh" ? null
    : word.english;

  const promptSub =
    kind === "zh-to-en" ? word.pinyin
    : kind === "listen-to-zh" ? "Tap to hear the word"
    : "Choose the Chinese word";

  const renderOption = (w: Word) => {
    if (kind === "zh-to-en") return w.english;
    return (
      <span className="flex flex-col items-center">
        <span className="hanzi text-3xl font-bold">{w.hanzi}</span>
        <span className="text-sm text-brand-600">{w.pinyin}</span>
      </span>
    );
  };

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    if (id === word.id) onCorrect();
    else onWrong();
  };

  return (
    <div className="flex flex-col gap-6 animate-slide-up">
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {kind === "zh-to-en" ? "Translate to English"
           : kind === "en-to-zh" ? "Pick the Chinese"
           : "What did you hear?"}
        </p>
        {kind === "listen-to-zh" ? (
          <PronounceButton text={word.hanzi} size="lg" />
        ) : (
          <div className="text-center">
            <div className={cn(
              "font-bold",
              kind === "zh-to-en" ? "hanzi text-7xl" : "text-3xl"
            )}>
              {promptTop}
            </div>
            {kind === "zh-to-en" && <div className="mt-2 text-brand-600">{word.pinyin}</div>}
          </div>
        )}
        {kind !== "listen-to-zh" && (
          <p className="text-sm text-zinc-500">{promptSub}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map(opt => {
          const isPicked = picked === opt.id;
          const isAnswer = opt.id === word.id;
          const showState = !!picked && (isPicked || (picked && isAnswer));
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={!!picked}
              className={cn(
                "card flex items-center justify-center p-5 text-center text-lg font-semibold transition-all",
                !picked && "hover:border-brand-300 hover:scale-[1.02]",
                showState && isAnswer && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
                showState && isPicked && !isAnswer && "border-rose-400 bg-rose-50 animate-shake dark:bg-rose-950/40"
              )}
            >
              {renderOption(opt)}
            </button>
          );
        })}
      </div>

      {picked && (
        <div className={cn(
          "flex items-center justify-between rounded-xl p-4 animate-slide-up",
          correct ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200"
        )}>
          <div>
            <div className="font-bold">{correct ? "Nice!" : "Not quite"}</div>
            <div className="text-sm">
              <span className="hanzi font-semibold">{word.hanzi}</span> · {word.pinyin} · {word.english}
            </div>
          </div>
          <button onClick={onContinue} className={correct ? "btn-success" : "btn-danger"}>
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
