export type Word = {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  /** Optional example sentence */
  example?: { hanzi: string; pinyin: string; english: string };
  /** HSK level 1-6 */
  hsk: 1 | 2 | 3 | 4 | 5 | 6;
};

export type Lesson = {
  id: string;
  /** Display title in English */
  title: string;
  /** Display subtitle in Chinese */
  titleZh: string;
  emoji: string;
  /** Word ids belonging to this lesson */
  words: string[];
  /** Lessons that must be completed before this one */
  requires: string[];
};

export type ReviewState = {
  /** SM-2 ease factor */
  ef: number;
  /** Current interval in days */
  interval: number;
  /** Repetition count */
  reps: number;
  /** Next review timestamp (ms) */
  due: number;
  /** Last reviewed timestamp (ms) */
  last: number;
};

export type Quality = 0 | 1 | 2 | 3; // 0 again, 1 hard, 2 good, 3 easy

export type Progress = {
  /** wordId -> review state */
  reviews: Record<string, ReviewState>;
  /** lessonId -> completed */
  lessonsDone: Record<string, boolean>;
  xp: number;
  streak: number;
  lastStudyDay: string | null; // YYYY-MM-DD
};
