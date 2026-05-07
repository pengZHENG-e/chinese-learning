import type { Lesson } from "@/lib/types";

export const LESSONS: Lesson[] = [
  {
    id: "greetings",
    title: "Greetings",
    titleZh: "问候",
    emoji: "👋",
    words: ["ni-hao", "zai-jian", "xie-xie", "bu-ke-qi", "dui-bu-qi", "mei-guan-xi", "qing"],
    requires: [],
  },
  {
    id: "pronouns",
    title: "Pronouns",
    titleZh: "代词",
    emoji: "🧑",
    words: ["wo", "ni", "ta-he", "ta-she", "wo-men", "ni-men", "ta-men"],
    requires: ["greetings"],
  },
  {
    id: "numbers",
    title: "Numbers 1-10",
    titleZh: "数字",
    emoji: "🔢",
    words: ["yi", "er", "san", "si", "wu", "liu", "qi", "ba", "jiu", "shi"],
    requires: ["pronouns"],
  },
  {
    id: "family",
    title: "Family",
    titleZh: "家人",
    emoji: "👨‍👩‍👧",
    words: ["ba-ba", "ma-ma", "ge-ge", "jie-jie", "di-di", "mei-mei", "er-zi", "nv-er"],
    requires: ["pronouns"],
  },
  {
    id: "verbs",
    title: "Common Verbs",
    titleZh: "常用动词",
    emoji: "🏃",
    words: ["shi", "you", "yao", "xi-huan", "ai", "chi", "he", "kan", "ting", "shuo", "qu", "lai"],
    requires: ["pronouns"],
  },
  {
    id: "food",
    title: "Food & Drink",
    titleZh: "食物",
    emoji: "🍚",
    words: ["mi-fan", "shui", "cha", "ka-fei", "ping-guo", "cai", "rou", "ji-dan"],
    requires: ["verbs"],
  },
  {
    id: "time",
    title: "Time",
    titleZh: "时间",
    emoji: "⏰",
    words: ["jin-tian", "ming-tian", "zuo-tian", "xian-zai", "nian", "yue", "ri", "shi-jian"],
    requires: ["numbers"],
  },
  {
    id: "colors",
    title: "Colors & Sizes",
    titleZh: "颜色",
    emoji: "🎨",
    words: ["hong", "lan", "lv", "huang", "hei", "bai", "da", "xiao", "hao"],
    requires: ["family"],
  },
  {
    id: "objects",
    title: "Around You",
    titleZh: "身边事物",
    emoji: "🏠",
    words: ["jia", "xue-xiao", "shu", "shou-ji", "dian-nao", "che", "ren", "peng-you"],
    requires: ["food", "colors"],
  },
];

export function getLesson(id: string): Lesson | undefined {
  return LESSONS.find(l => l.id === id);
}

export function isLessonUnlocked(
  lesson: Lesson,
  done: Record<string, boolean>
): boolean {
  return lesson.requires.every(r => done[r]);
}
