"use client";
import { useProgress } from "@/lib/storage";
import { LESSONS } from "@/lib/data/lessons";
import { VOCABULARY, getWord } from "@/lib/data/vocabulary";
import { isDue } from "@/lib/srs";
import XPBar from "@/components/XPBar";
import PronounceButton from "@/components/PronounceButton";
import { Trash2 } from "lucide-react";

export default function StatsPage() {
  const { progress, hydrated, reset } = useProgress();

  if (!hydrated) return null;

  const lessonsDone = Object.values(progress.lessonsDone).filter(Boolean).length;
  const totalLessons = LESSONS.length;
  const seen = Object.keys(progress.reviews);
  const dueIds = seen.filter(id => isDue(progress.reviews[id]));
  const masteredIds = seen.filter(id => (progress.reviews[id]?.interval ?? 0) >= 7);

  const recent = seen
    .map(id => ({ id, r: progress.reviews[id] }))
    .sort((a, b) => b.r.last - a.r.last)
    .slice(0, 8);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold">Your progress</h1>
      </header>

      <XPBar xp={progress.xp} streak={progress.streak} />

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Lessons" value={`${lessonsDone}/${totalLessons}`} />
        <Stat label="Words seen" value={`${seen.length}/${VOCABULARY.length}`} />
        <Stat label="Mastered" value={masteredIds.length} />
        <Stat label="Due today" value={dueIds.length} highlight={dueIds.length > 0} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Recent words</h2>
        {recent.length === 0 ? (
          <div className="card p-6 text-center text-zinc-500">
            No reviews yet. Start a lesson to begin.
          </div>
        ) : (
          <ul className="space-y-2">
            {recent.map(({ id, r }) => {
              const w = getWord(id);
              if (!w) return null;
              return (
                <li key={id} className="card flex items-center justify-between p-3">
                  <div className="flex items-center gap-3">
                    <div className="hanzi text-2xl font-bold">{w.hanzi}</div>
                    <div>
                      <div className="text-sm font-semibold text-brand-600">{w.pinyin}</div>
                      <div className="text-sm text-zinc-600 dark:text-zinc-400">{w.english}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-zinc-500">
                      <div>Reps: <strong>{r.reps}</strong></div>
                      <div>Next: <strong>{r.interval}d</strong></div>
                    </div>
                    <PronounceButton text={w.hanzi} size="sm" />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="pt-4">
        <button
          onClick={() => {
            if (confirm("Reset all progress? This cannot be undone.")) reset();
          }}
          className="inline-flex items-center gap-2 text-sm text-rose-600 hover:underline"
        >
          <Trash2 size={14} /> Reset all progress
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`card p-4 ${highlight ? "border-brand-300 bg-brand-50 dark:bg-brand-950/30" : ""}`}>
      <div className="text-xs uppercase tracking-wide text-zinc-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
