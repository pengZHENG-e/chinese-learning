"use client";
import { useEffect, useRef, useState } from "react";
import { Eraser, Play, Eye } from "lucide-react";

type Mode = "watch" | "quiz";

export default function StrokeWriter({
  character,
  size = 280,
}: {
  character: string;
  size?: number;
}) {
  const targetRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<unknown>(null);
  const [mode, setMode] = useState<Mode>("watch");
  const [error, setError] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setMistakes(0);
    setCompleted(false);

    (async () => {
      try {
        const mod = await import("hanzi-writer");
        const HanziWriter = mod.default;
        if (cancelled || !targetRef.current) return;
        targetRef.current.innerHTML = "";
        const w = HanziWriter.create(targetRef.current, character, {
          width: size,
          height: size,
          padding: 8,
          showOutline: true,
          showCharacter: mode === "watch",
          strokeColor: "#ea580c",
          radicalColor: "#0284c7",
          outlineColor: "#e7e5e4",
          highlightColor: "#22c55e",
          drawingWidth: 30,
          strokeAnimationSpeed: 1.2,
          delayBetweenStrokes: 100,
        });
        writerRef.current = w;
        if (mode === "watch") {
          w.loopCharacterAnimation();
        } else {
          w.quiz({
            onMistake: () => setMistakes(m => m + 1),
            onComplete: () => setCompleted(true),
          });
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setError("Couldn't load this character. It may not be in the dictionary.");
      }
    })();

    return () => {
      cancelled = true;
      // best-effort cleanup
      if (targetRef.current) targetRef.current.innerHTML = "";
    };
  }, [character, mode, size]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="card flex items-center justify-center p-2" style={{ width: size + 16, height: size + 16 }}>
        {error ? (
          <p className="p-4 text-center text-sm text-rose-500">{error}</p>
        ) : (
          <div ref={targetRef} />
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => setMode("watch")}
          className={mode === "watch" ? "btn-primary" : "btn-ghost"}
        >
          <Play size={16} /> Watch
        </button>
        <button
          onClick={() => setMode("quiz")}
          className={mode === "quiz" ? "btn-primary" : "btn-ghost"}
        >
          <Eye size={16} /> Practice
        </button>
        {mode === "quiz" && (
          <button
            onClick={() => setMode("watch")}
            className="btn-ghost"
            title="Reset"
          >
            <Eraser size={16} /> Reset
          </button>
        )}
      </div>

      {mode === "quiz" && !error && (
        <div className="flex items-center gap-4 text-sm">
          <span className="text-zinc-500">Mistakes: <strong className="text-rose-500">{mistakes}</strong></span>
          {completed && <span className="font-semibold text-emerald-600">✅ Done!</span>}
        </div>
      )}
    </div>
  );
}
