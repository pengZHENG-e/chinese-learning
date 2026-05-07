# 学中文 · Chinese Learning App

A modern, friendly Chinese-learning web app for English speakers. Built with Next.js 15, deployable to Vercel in one click.

## Features

- **Lesson tree** — Duolingo-style path with 9 themed lessons (greetings, pronouns, numbers, family, verbs, food, time, colors, objects). Lessons unlock as you progress.
- **Multi-step exercises** — each lesson cycles through *introduce → 中→EN → EN→中 → listening* for every word.
- **Spaced repetition (SM-2)** — words you've seen go into a review queue, scheduled by ease/interval per the SuperMemo-2 algorithm.
- **Flashcards** — review due words with `Again / Hard / Good / Easy` grading.
- **Stroke practice** — animated stroke order plus quiz mode (trace from memory) using `hanzi-writer`.
- **Listening drills** — TTS-driven (Web Speech API) with multiple-choice meaning matching.
- **Gamification** — XP, levels (100 XP / level), daily streak, per-lesson stats.
- **Stats page** — lessons completed, words mastered, due today, recent activity.
- **Mobile-first UI** — bottom tab bar on mobile, sticky top nav on desktop, dark mode auto.
- **Cross-device sync** — sign in with Google to sync progress (XP, streak, reviews, lessons) across devices via Supabase. Works without sign-in too — local-only mode.

## Tech stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3 with custom Duolingo-style buttons (3D shadow / press animation)
- `hanzi-writer` for stroke animation & quizzing
- Web Speech API for TTS (works in Chrome, Safari, Edge — voice quality varies by OS)
- `lucide-react` for icons

## Getting started

```bash
# install deps (npm, pnpm, yarn, or bun all work)
bun install

# dev
bun run dev

# production build
bun run build
bun run start
```

Open http://localhost:3000.

## Cross-device sync setup

The app works fully without sign-in (progress saved locally). To enable cloud sync via email magic-link login, all you need is a free Supabase project.

1. Sign up at [supabase.com](https://supabase.com), click **New Project**, pick any region + DB password, wait ~1 min.
2. **SQL Editor** → paste contents of [`supabase-schema.sql`](./supabase-schema.sql) → **Run**.
3. **Settings → API** → copy `Project URL` and `anon` (public) key.
4. Add them to your Vercel project (**Settings → Environment Variables**) as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`, then redeploy.
5. (Optional) **Authentication → URL Configuration** in Supabase: set Site URL to your Vercel URL, and add `http://localhost:3000` to additional redirect URLs.

That's it — no Google OAuth, no service-role keys. RLS keeps each user's progress private. Local dev: copy `.env.example` → `.env.local`, fill the same 2 values, `bun run dev`.

## Project layout

```
app/
  page.tsx              # home + lesson tree
  learn/[id]/page.tsx   # lesson runner (intro → quiz → listening)
  flashcards/page.tsx   # SRS review
  write/page.tsx        # stroke-order practice
  listen/page.tsx       # listening drill
  stats/page.tsx        # progress stats
components/
  Navbar.tsx            # top + mobile bottom nav
  Exercise.tsx          # 4 exercise types in one component
  Flashcard.tsx         # tap-to-reveal card
  StrokeWriter.tsx      # hanzi-writer wrapper (watch / quiz modes)
  LessonNode.tsx        # lesson-tree node (locked / available / done)
  XPBar.tsx             # streak + level + XP bar
  PronounceButton.tsx   # 🔊 TTS button
lib/
  data/vocabulary.ts    # ~70 HSK 1-2 words with pinyin, meaning, examples
  data/lessons.ts       # 9 lessons with prerequisites
  srs.ts                # SM-2 spaced repetition
  storage.ts            # localStorage hook (useProgress)
  tts.ts                # Web Speech wrapper
```

## Extending

- **Add words**: append to `lib/data/vocabulary.ts`.
- **Add lessons**: append to `lib/data/lessons.ts` and reference word ids from the vocab list.
- **Tweak SRS**: edit `lib/srs.ts` (`schedule()` is the SM-2 implementation).
- **Add exercise types**: extend the `ExerciseKind` union in `components/Exercise.tsx` and the step builder in `app/learn/[id]/page.tsx`.

## Notes

- **TTS voice** depends on the user's OS. macOS / iOS ships with high-quality `zh-CN` voices (Tingting, Sinji); Windows uses Huihui; Linux quality varies.
- **Without sign-in**, progress is per-browser; clearing site data wipes XP / streak. With sign-in, progress is in Supabase keyed by Google email.
- **Sync strategy**: on sign-in, the larger of {local, remote} progress wins (by total XP + reviews + lessons). After that, every change debounce-pushes to the server (1.5s).
