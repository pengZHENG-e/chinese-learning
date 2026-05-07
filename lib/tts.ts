"use client";

let cachedVoice: SpeechSynthesisVoice | null = null;

function pickVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const zh = voices.filter(v => v.lang.toLowerCase().startsWith("zh"));
  cachedVoice = zh.find(v => /CN|Hans|Mandarin/i.test(v.lang + v.name)) ?? zh[0] ?? null;
  return cachedVoice;
}

export function speak(text: string, opts: { rate?: number } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Warm voices on iOS/Safari
  if (!window.speechSynthesis.getVoices().length) {
    window.speechSynthesis.addEventListener("voiceschanged", () => speak(text, opts), { once: true });
    window.speechSynthesis.getVoices();
    return;
  }
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "zh-CN";
  u.rate = opts.rate ?? 0.9;
  const v = pickVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

export function ttsAvailable(): boolean {
  return typeof window !== "undefined" && !!window.speechSynthesis;
}
