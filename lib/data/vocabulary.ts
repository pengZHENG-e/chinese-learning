import type { Word } from "@/lib/types";

export const VOCABULARY: Word[] = [
  // === Greetings ===
  { id: "ni-hao", hanzi: "你好", pinyin: "nǐ hǎo", english: "hello", hsk: 1,
    example: { hanzi: "你好，我叫小明。", pinyin: "Nǐ hǎo, wǒ jiào Xiǎo Míng.", english: "Hello, my name is Xiao Ming." } },
  { id: "zai-jian", hanzi: "再见", pinyin: "zài jiàn", english: "goodbye", hsk: 1,
    example: { hanzi: "明天见，再见！", pinyin: "Míngtiān jiàn, zàijiàn!", english: "See you tomorrow, goodbye!" } },
  { id: "xie-xie", hanzi: "谢谢", pinyin: "xiè xie", english: "thank you", hsk: 1,
    example: { hanzi: "谢谢你的帮助。", pinyin: "Xièxie nǐ de bāngzhù.", english: "Thanks for your help." } },
  { id: "bu-ke-qi", hanzi: "不客气", pinyin: "bù kè qi", english: "you're welcome", hsk: 1 },
  { id: "dui-bu-qi", hanzi: "对不起", pinyin: "duì bu qǐ", english: "sorry", hsk: 1 },
  { id: "mei-guan-xi", hanzi: "没关系", pinyin: "méi guān xi", english: "it's okay", hsk: 1 },
  { id: "qing", hanzi: "请", pinyin: "qǐng", english: "please", hsk: 1 },

  // === Pronouns ===
  { id: "wo", hanzi: "我", pinyin: "wǒ", english: "I, me", hsk: 1,
    example: { hanzi: "我是学生。", pinyin: "Wǒ shì xuéshēng.", english: "I am a student." } },
  { id: "ni", hanzi: "你", pinyin: "nǐ", english: "you", hsk: 1 },
  { id: "ta-he", hanzi: "他", pinyin: "tā", english: "he, him", hsk: 1 },
  { id: "ta-she", hanzi: "她", pinyin: "tā", english: "she, her", hsk: 1 },
  { id: "wo-men", hanzi: "我们", pinyin: "wǒ men", english: "we, us", hsk: 1 },
  { id: "ni-men", hanzi: "你们", pinyin: "nǐ men", english: "you (plural)", hsk: 1 },
  { id: "ta-men", hanzi: "他们", pinyin: "tā men", english: "they, them", hsk: 1 },

  // === Numbers ===
  { id: "yi", hanzi: "一", pinyin: "yī", english: "one", hsk: 1 },
  { id: "er", hanzi: "二", pinyin: "èr", english: "two", hsk: 1 },
  { id: "san", hanzi: "三", pinyin: "sān", english: "three", hsk: 1 },
  { id: "si", hanzi: "四", pinyin: "sì", english: "four", hsk: 1 },
  { id: "wu", hanzi: "五", pinyin: "wǔ", english: "five", hsk: 1 },
  { id: "liu", hanzi: "六", pinyin: "liù", english: "six", hsk: 1 },
  { id: "qi", hanzi: "七", pinyin: "qī", english: "seven", hsk: 1 },
  { id: "ba", hanzi: "八", pinyin: "bā", english: "eight", hsk: 1 },
  { id: "jiu", hanzi: "九", pinyin: "jiǔ", english: "nine", hsk: 1 },
  { id: "shi", hanzi: "十", pinyin: "shí", english: "ten", hsk: 1 },

  // === Family ===
  { id: "ba-ba", hanzi: "爸爸", pinyin: "bà ba", english: "father, dad", hsk: 1 },
  { id: "ma-ma", hanzi: "妈妈", pinyin: "mā ma", english: "mother, mom", hsk: 1 },
  { id: "ge-ge", hanzi: "哥哥", pinyin: "gē ge", english: "older brother", hsk: 2 },
  { id: "jie-jie", hanzi: "姐姐", pinyin: "jiě jie", english: "older sister", hsk: 2 },
  { id: "di-di", hanzi: "弟弟", pinyin: "dì di", english: "younger brother", hsk: 2 },
  { id: "mei-mei", hanzi: "妹妹", pinyin: "mèi mei", english: "younger sister", hsk: 2 },
  { id: "er-zi", hanzi: "儿子", pinyin: "ér zi", english: "son", hsk: 1 },
  { id: "nv-er", hanzi: "女儿", pinyin: "nǚ ér", english: "daughter", hsk: 1 },

  // === Common Verbs ===
  { id: "shi", hanzi: "是", pinyin: "shì", english: "to be", hsk: 1,
    example: { hanzi: "他是医生。", pinyin: "Tā shì yīshēng.", english: "He is a doctor." } },
  { id: "you", hanzi: "有", pinyin: "yǒu", english: "to have", hsk: 1 },
  { id: "yao", hanzi: "要", pinyin: "yào", english: "to want", hsk: 2 },
  { id: "xi-huan", hanzi: "喜欢", pinyin: "xǐ huan", english: "to like", hsk: 1,
    example: { hanzi: "我喜欢喝茶。", pinyin: "Wǒ xǐhuan hē chá.", english: "I like to drink tea." } },
  { id: "ai", hanzi: "爱", pinyin: "ài", english: "to love", hsk: 1 },
  { id: "chi", hanzi: "吃", pinyin: "chī", english: "to eat", hsk: 1 },
  { id: "he", hanzi: "喝", pinyin: "hē", english: "to drink", hsk: 1 },
  { id: "kan", hanzi: "看", pinyin: "kàn", english: "to look, to watch", hsk: 1 },
  { id: "ting", hanzi: "听", pinyin: "tīng", english: "to listen", hsk: 1 },
  { id: "shuo", hanzi: "说", pinyin: "shuō", english: "to speak", hsk: 2 },
  { id: "qu", hanzi: "去", pinyin: "qù", english: "to go", hsk: 1 },
  { id: "lai", hanzi: "来", pinyin: "lái", english: "to come", hsk: 1 },

  // === Food & Drink ===
  { id: "mi-fan", hanzi: "米饭", pinyin: "mǐ fàn", english: "cooked rice", hsk: 1 },
  { id: "shui", hanzi: "水", pinyin: "shuǐ", english: "water", hsk: 1 },
  { id: "cha", hanzi: "茶", pinyin: "chá", english: "tea", hsk: 1 },
  { id: "ka-fei", hanzi: "咖啡", pinyin: "kā fēi", english: "coffee", hsk: 1 },
  { id: "ping-guo", hanzi: "苹果", pinyin: "píng guǒ", english: "apple", hsk: 1 },
  { id: "cai", hanzi: "菜", pinyin: "cài", english: "dish, vegetable", hsk: 1 },
  { id: "rou", hanzi: "肉", pinyin: "ròu", english: "meat", hsk: 2 },
  { id: "ji-dan", hanzi: "鸡蛋", pinyin: "jī dàn", english: "egg", hsk: 2 },

  // === Time ===
  { id: "jin-tian", hanzi: "今天", pinyin: "jīn tiān", english: "today", hsk: 1 },
  { id: "ming-tian", hanzi: "明天", pinyin: "míng tiān", english: "tomorrow", hsk: 1 },
  { id: "zuo-tian", hanzi: "昨天", pinyin: "zuó tiān", english: "yesterday", hsk: 2 },
  { id: "xian-zai", hanzi: "现在", pinyin: "xiàn zài", english: "now", hsk: 1 },
  { id: "nian", hanzi: "年", pinyin: "nián", english: "year", hsk: 1 },
  { id: "yue", hanzi: "月", pinyin: "yuè", english: "month, moon", hsk: 1 },
  { id: "ri", hanzi: "日", pinyin: "rì", english: "day, sun", hsk: 1 },
  { id: "shi-jian", hanzi: "时间", pinyin: "shí jiān", english: "time", hsk: 2 },

  // === Colors & Adjectives ===
  { id: "hong", hanzi: "红", pinyin: "hóng", english: "red", hsk: 2 },
  { id: "lan", hanzi: "蓝", pinyin: "lán", english: "blue", hsk: 3 },
  { id: "lv", hanzi: "绿", pinyin: "lǜ", english: "green", hsk: 3 },
  { id: "huang", hanzi: "黄", pinyin: "huáng", english: "yellow", hsk: 3 },
  { id: "hei", hanzi: "黑", pinyin: "hēi", english: "black", hsk: 2 },
  { id: "bai", hanzi: "白", pinyin: "bái", english: "white", hsk: 2 },
  { id: "da", hanzi: "大", pinyin: "dà", english: "big", hsk: 1 },
  { id: "xiao", hanzi: "小", pinyin: "xiǎo", english: "small", hsk: 1 },
  { id: "hao", hanzi: "好", pinyin: "hǎo", english: "good", hsk: 1 },

  // === Places & Objects ===
  { id: "jia", hanzi: "家", pinyin: "jiā", english: "home, family", hsk: 1 },
  { id: "xue-xiao", hanzi: "学校", pinyin: "xué xiào", english: "school", hsk: 2 },
  { id: "shu", hanzi: "书", pinyin: "shū", english: "book", hsk: 1 },
  { id: "shou-ji", hanzi: "手机", pinyin: "shǒu jī", english: "mobile phone", hsk: 2 },
  { id: "dian-nao", hanzi: "电脑", pinyin: "diàn nǎo", english: "computer", hsk: 2 },
  { id: "che", hanzi: "车", pinyin: "chē", english: "vehicle, car", hsk: 1 },
  { id: "ren", hanzi: "人", pinyin: "rén", english: "person", hsk: 1 },
  { id: "peng-you", hanzi: "朋友", pinyin: "péng you", english: "friend", hsk: 1 },
];

const BY_ID = new Map(VOCABULARY.map(w => [w.id, w]));
export function getWord(id: string): Word | undefined {
  return BY_ID.get(id);
}
export function getWords(ids: string[]): Word[] {
  return ids.map(getWord).filter((w): w is Word => !!w);
}
