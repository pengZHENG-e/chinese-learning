"use client";
import { useEffect, useMemo, useState } from "react";
import { VOCABULARY } from "@/lib/data/vocabulary";
import { speak, ttsAvailable } from "@/lib/tts";
import { shuffle } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Word } from "@/lib/types";
import PronounceButton from "@/components/PronounceButton";
import { Headphones } from "lucide-react";

function buildRound(): { target: Word; options: Word[] } {
  const target = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
  const distractors = shuffle(VOCABULARY.filter(w => w.id !== target.id)).slice(0, 3);
  return { target, options: shuffle([target, ...distractors]) };
}

export default function ListenPage() {
  const [round, setRound] = useState(buildRound());
  const [picked, setPicked] = useState<string | null>(null);
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [supported, setSupported] = useState(true);

  useEffect(() => { setSupported(ttsAvailable()); }, []);

  const correct = picked === round.target.id;

  const next = () => {
    setRound(buildRound());
    setPicked(null);
  };

  const choose = (id: string) => {
    if (picked) return;
    setPicked(id);
    setStats(s => ({ correct: s.correct + (id === round.target.id ? 1 : 0), total: s.total + 1 }));
  };

  const accuracy = useMemo(
    () => stats.total === 0 ? 0 : Math.round((stats.correct / stats.total) * 100),
    [stats]
  );

  if (!supported) {
    return (
      <div className="card p-6 text-center">
        <p>Your browser doesn&apos;t support speech synthesis. Try Chrome, Safari, or Edge.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listening</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Hear the word, pick the matching meaning.
          </p>
        </div>
        <div className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          {stats.correct} / {stats.total} · {accuracy}%
        </div>
      </header>

      <div className="card flex flex-col items-center gap-4 p-10">
        <Headphones className="h-8 w-8 text-zinc-400" />
        <PronounceButton text={round.target.hanzi} size="lg" />
        <p className="text-sm text-zinc-500">Tap to replay</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {round.options.map(opt => {
          const isPicked = picked === opt.id;
          const isAnswer = opt.id === round.target.id;
          const showState = !!picked;
          return (
            <button
              key={opt.id}
              onClick={() => choose(opt.id)}
              disabled={!!picked}
              className={cn(
                "card flex items-center justify-center p-5 text-center transition-all",
                !picked && "hover:border-brand-300 hover:scale-[1.02]",
                showState && isAnswer && "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40",
                showState && isPicked && !isAnswer && "border-rose-400 bg-rose-50 animate-shake dark:bg-rose-950/40"
              )}
            >
              <div>
                <div className="hanzi text-2xl font-bold">{opt.hanzi}</div>
                <div className="text-sm text-brand-600">{opt.pinyin}</div>
                <div className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{opt.english}</div>
              </div>
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
          <div className="text-sm">
            <div className="font-bold">{correct ? "Correct!" : "The answer was:"}</div>
            <div className="hanzi text-lg">{round.target.hanzi}</div>
            <div>{round.target.pinyin} — {round.target.english}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => speak(round.target.hanzi)} className="btn-ghost">Replay</button>
            <button onClick={next} className={correct ? "btn-success" : "btn-danger"}>Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
