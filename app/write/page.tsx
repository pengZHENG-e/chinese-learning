"use client";
import { useState } from "react";
import { VOCABULARY } from "@/lib/data/vocabulary";
import StrokeWriter from "@/components/StrokeWriter";
import PronounceButton from "@/components/PronounceButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SINGLE_CHARS = VOCABULARY.filter(w => [...w.hanzi].length === 1);

export default function WritePage() {
  const [i, setI] = useState(0);
  const word = SINGLE_CHARS[i];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold">Stroke practice</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Watch the animation, then trace it from memory.
        </p>
      </header>

      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-brand-600">{word.pinyin}</span>
          <PronounceButton text={word.hanzi} />
        </div>
        <p className="text-zinc-600 dark:text-zinc-400">{word.english}</p>
      </div>

      <StrokeWriter character={word.hanzi} key={word.id} />

      <div className="mt-2 flex items-center justify-between">
        <button
          onClick={() => setI(x => (x - 1 + SINGLE_CHARS.length) % SINGLE_CHARS.length)}
          className="btn-ghost"
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span className="text-sm tabular-nums text-zinc-500">
          {i + 1} / {SINGLE_CHARS.length}
        </span>
        <button
          onClick={() => setI(x => (x + 1) % SINGLE_CHARS.length)}
          className="btn-ghost"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
