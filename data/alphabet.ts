/*
  UNIT 0 CONTENT — The Hangeul Alphabet
  =====================================
  This file holds ALL the letters, words, notes, and questions for
  the Hangeul unit. The unit is split into short lessons (about
  5–10 minutes each), and each lesson has its own block below.
  The app reads from here, so you can change the lessons without
  touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each letter looks like this:
      { korean: "ㄱ", romanization: "g / k", english: "g as in go · looks like a gun", emoji: "🔫", say: "가" },
  - "say" is what the computer voice says. A letter can't be said
    alone, so consonants play with ㅏ (ㄱ → 가) and vowels play with
    the silent ㅇ in front (ㅏ → 아).
  - In the letter practice, learners match each letter to its
    romanization ("g / k"), so keep those short.
  - To add a word, copy one whole line (from { to },) and paste it below.
  - In a question, "answer" must match one of the "options" EXACTLY.
  - hints: a helpful hint shown when someone picks a wrong option
  - In the game, every option is Korean (the app reads it aloud when
    tapped), so write the options in Hangeul, not English.

  This unit is listed in data/lessons.ts, which also describes the
  shape of this data for the computer. You don't need to edit that.
*/

import type { Unit, VocabularyItem, GrammarNote, ChoiceQuestion, GameStep } from "./lessons";

// ===============================================================
// LESSON 1 — Simple vowels
// ===============================================================
const lesson1Letters: VocabularyItem[] = [
  { korean: "ㅏ", romanization: "a", english: "a as in father · short stroke points right", emoji: "➡️", say: "아" },
  { korean: "ㅓ", romanization: "eo", english: "eo, like the u in up · short stroke points left", emoji: "⬅️", say: "어" },
  { korean: "ㅗ", romanization: "o", english: "o as in go (round your lips) · stroke points up", emoji: "⬆️", say: "오" },
  { korean: "ㅜ", romanization: "u", english: "u as in moon · stroke points down", emoji: "⬇️", say: "우" },
  { korean: "ㅡ", romanization: "eu", english: "eu — say \"oo\" with a flat smile, lips not rounded", emoji: "😬", say: "으" },
  { korean: "ㅣ", romanization: "i", english: "i, like the ee in see · one tall line", emoji: "📏", say: "이" },
];

// Real words made only from these vowels (with the silent ㅇ)
const lesson1Words: VocabularyItem[] = [
  { korean: "아이", romanization: "ai", english: "child", emoji: "👶" },
  { korean: "오이", romanization: "oi", english: "cucumber", emoji: "🥒" },
  { korean: "오", romanization: "o", english: "five", emoji: "5️⃣" },
  { korean: "이", romanization: "i", english: "two", emoji: "2️⃣" },
];

const lesson1Notes: GrammarNote[] = [
  {
    title: "Meet Hangeul (한글)",
    explanation:
      "Hangeul is the Korean alphabet. King Sejong created it in 1443 so that everyone could learn to read. " +
      "It has 14 basic consonants and 10 basic vowels. Letters are grouped into blocks, and each block is one syllable. " +
      "Every block starts with a consonant. When a syllable starts with a vowel sound, the silent ㅇ fills that spot — " +
      "so you'll see vowels written like 아, 오, and 이.",
    examples: [
      { korean: "아", romanization: "a", english: "ㅇ (silent) + ㅏ" },
      { korean: "오", romanization: "o", english: "ㅇ (silent) + ㅗ" },
      { korean: "이", romanization: "i", english: "ㅇ (silent) + ㅣ" },
    ],
  },
  {
    title: "Follow the short stroke",
    explanation:
      "Four vowels are a long line plus a short stroke. Look where the short stroke points: " +
      "right ㅏ (a), left ㅓ (eo), up ㅗ (o), down ㅜ (u). " +
      "Two vowels have no short stroke at all: the flat line ㅡ (eu) and the tall line ㅣ (i).",
    examples: [
      { korean: "아", romanization: "a", english: "stroke points right" },
      { korean: "어", romanization: "eo", english: "stroke points left" },
      { korean: "오", romanization: "o", english: "stroke points up" },
      { korean: "우", romanization: "u", english: "stroke points down" },
    ],
  },
];

const lesson1Missions: ChoiceQuestion[] = [
  {
    prompt: "Which one says \"a\" (as in father)?",
    options: ["아", "어", "오"],
    answer: "아",
    explanation: "ㅏ — the short stroke points right.",
    hints: {
      "어": "The stroke on ㅓ points left. That's \"eo.\"",
      "오": "The stroke on ㅗ points up. That's \"o.\"",
    },
  },
  {
    prompt: "Which one says \"u\" (as in moon)? Hint: the short stroke points DOWN.",
    options: ["오", "우", "으"],
    answer: "우",
    explanation: "ㅜ — the short stroke points down.",
    hints: {
      "오": "The stroke on ㅗ points up. That's \"o.\"",
      "으": "ㅡ has no short stroke. That's \"eu.\"",
    },
  },
  {
    prompt: "Which one says \"eo\" (like the u in up)? Hint: the short stroke points LEFT.",
    options: ["아", "어", "여"],
    answer: "어",
    explanation: "ㅓ — the short stroke points left.",
    hints: {
      "아": "The stroke on ㅏ points right. That's \"a.\"",
      "여": "Two strokes add a y — that's \"yeo.\" You want just one stroke.",
    },
  },
  {
    prompt: "Which one says \"eu\" — \"oo\" with a flat smile?",
    options: ["으", "우", "이"],
    answer: "으",
    explanation: "ㅡ is a flat line, like a flat smile.",
    hints: {
      "우": "ㅜ is \"u\" — your lips are round. For \"eu,\" keep them flat.",
      "이": "ㅣ is \"i\" (ee). Look for the flat line.",
    },
  },
  {
    prompt: "🥒 Cucumber is \"o-i.\" Which word is it?",
    options: ["아이", "오이", "우이"],
    answer: "오이",
    explanation: "오 (o) + 이 (i) = 오이, cucumber.",
    hints: {
      "아이": "That's \"a-i\" — child! The first stroke should point up.",
      "우이": "The first stroke points down — that's \"u.\" You want \"o.\"",
    },
  },
];

// ===============================================================
// LESSON 2 — Y vowels, ㅐ and ㅔ
// ===============================================================
const lesson2Letters: VocabularyItem[] = [
  { korean: "ㅑ", romanization: "ya", english: "ya as in yard · ㅏ + one more stroke", emoji: "➡️➡️", say: "야" },
  { korean: "ㅕ", romanization: "yeo", english: "yeo, like the yu in yum · ㅓ + one more stroke", emoji: "⬅️⬅️", say: "여" },
  { korean: "ㅛ", romanization: "yo", english: "yo as in yoga · ㅗ + one more stroke", emoji: "⬆️⬆️", say: "요" },
  { korean: "ㅠ", romanization: "yu", english: "yu as in you · ㅜ + one more stroke", emoji: "⬇️⬇️", say: "유" },
  { korean: "ㅐ", romanization: "ae", english: "ae, like the e in egg", emoji: "🥚", say: "애" },
  { korean: "ㅔ", romanization: "e", english: "e as in bed · sounds almost the same as ㅐ", emoji: "🛏️", say: "에" },
];

const lesson2Words: VocabularyItem[] = [
  { korean: "우유", romanization: "uyu", english: "milk", emoji: "🥛" },
  { korean: "여우", romanization: "yeou", english: "fox", emoji: "🦊" },
  { korean: "이유", romanization: "iyu", english: "reason", emoji: "🤔" },
  { korean: "아야!", romanization: "aya!", english: "Ouch!", emoji: "🤕" },
];

const lesson2Notes: GrammarNote[] = [
  {
    title: "Two strokes add a \"y\"",
    explanation:
      "Add a second short stroke to ㅏ ㅓ ㅗ ㅜ and you add a \"y\" sound in front: " +
      "ㅑ (ya), ㅕ (yeo), ㅛ (yo), ㅠ (yu).",
    examples: [
      { korean: "야", romanization: "ya", english: "ㅏ + one more stroke" },
      { korean: "여", romanization: "yeo", english: "ㅓ + one more stroke" },
      { korean: "요", romanization: "yo", english: "ㅗ + one more stroke" },
      { korean: "유", romanization: "yu", english: "ㅜ + one more stroke" },
    ],
  },
  {
    title: "ㅐ and ㅔ",
    explanation:
      "ㅐ (ae) looks like ㅏ + ㅣ, and ㅔ (e) looks like ㅓ + ㅣ. " +
      "Today most Koreans say them almost the same, like the e in \"bed.\" " +
      "You'll see ㅔ in 네 (yes) in the Greetings unit.",
    examples: [
      { korean: "애", romanization: "ae", english: "ㅏ + ㅣ" },
      { korean: "에", romanization: "e", english: "ㅓ + ㅣ" },
    ],
  },
];

const lesson2Missions: ChoiceQuestion[] = [
  {
    prompt: "A second stroke adds a \"y.\" Which one says \"ya\"?",
    options: ["아", "여", "야"],
    answer: "야",
    explanation: "ㅑ = ㅏ (a) + one more stroke → ya.",
    hints: {
      "아": "Only one stroke, so no y. That's \"a.\"",
      "여": "Those strokes point left — that's \"yeo.\"",
    },
  },
  {
    prompt: "A second stroke adds a \"y.\" Which one says \"yo\"?",
    options: ["오", "요", "유"],
    answer: "요",
    explanation: "ㅛ = ㅗ (o) + one more stroke → yo.",
    hints: {
      "오": "Only one stroke, so no y. That's \"o.\"",
      "유": "Close! But those strokes point down — that's \"yu.\"",
    },
  },
  {
    prompt: "🥛 Milk is \"u-yu.\" Which word is it?",
    options: ["우유", "오이", "여우"],
    answer: "우유",
    explanation: "우 (u) + 유 (yu) = 우유, milk.",
    hints: {
      "오이": "That's \"o-i\" — cucumber!",
      "여우": "That's \"yeo-u\" — fox!",
    },
  },
  {
    prompt: "🦊 Fox is \"yeo-u.\" Which word is it?",
    options: ["여우", "요우", "여유"],
    answer: "여우",
    explanation: "여 (yeo) + 우 (u) = 여우, fox.",
    hints: {
      "요우": "요 is \"yo.\" The first syllable should be \"yeo\" (strokes point left).",
      "여유": "The second syllable has two strokes — that's \"yu.\" You want \"u.\"",
    },
  },
  {
    prompt: "Which one is ㅐ (ae)? Hint: it looks like ㅏ + ㅣ.",
    options: ["에", "애", "아"],
    answer: "애",
    explanation: "ㅐ = ㅏ + ㅣ, so the little stroke points right, between the two lines.",
    hints: {
      "에": "That's ㅔ (e) = ㅓ + ㅣ. The little stroke points left.",
      "아": "That's just ㅏ (a). ㅐ has a second tall line.",
    },
  },
];

// ===============================================================
// LESSON 3 — Basic consonants
// ===============================================================
const lesson3Letters: VocabularyItem[] = [
  { korean: "ㄱ", romanization: "g / k", english: "g as in go · looks like a gun", emoji: "🔫", say: "가" },
  { korean: "ㄴ", romanization: "n", english: "n as in no · looks like a nose from the side", emoji: "👃", say: "나" },
  { korean: "ㄷ", romanization: "d / t", english: "d as in door · looks like an open door", emoji: "🚪", say: "다" },
  { korean: "ㄹ", romanization: "r / l", english: "between r and l · looks like a winding road", emoji: "🛣️", say: "라" },
  { korean: "ㅁ", romanization: "m", english: "m as in mom · a closed mouth", emoji: "👄", say: "마" },
  { korean: "ㅂ", romanization: "b / p", english: "b as in bucket · looks like a bucket", emoji: "🪣", say: "바" },
  { korean: "ㅅ", romanization: "s", english: "s as in sun · looks like a mountain summit", emoji: "🏔️", say: "사" },
  { korean: "ㅇ", romanization: "silent / ng", english: "silent at the start, \"ng\" at the bottom · a round throat", emoji: "⭕", say: "아" },
  { korean: "ㅈ", romanization: "j", english: "j as in jam · ㅅ with a lid on top", emoji: "🍯", say: "자" },
  { korean: "ㅎ", romanization: "h", english: "h as in hat · a person wearing a hat", emoji: "🎩", say: "하" },
];

// Real words using only letters learned so far
const lesson3Words: VocabularyItem[] = [
  { korean: "나무", romanization: "namu", english: "tree", emoji: "🌳" },
  { korean: "바다", romanization: "bada", english: "sea", emoji: "🌊" },
  { korean: "나비", romanization: "nabi", english: "butterfly", emoji: "🦋" },
  { korean: "모자", romanization: "moja", english: "hat", emoji: "🧢" },
  { korean: "고기", romanization: "gogi", english: "meat", emoji: "🥩" },
  { korean: "사자", romanization: "saja", english: "lion", emoji: "🦁" },
  { korean: "하마", romanization: "hama", english: "hippo", emoji: "🦛" },
];

const lesson3Notes: GrammarNote[] = [
  {
    title: "Shapes from your mouth",
    explanation:
      "The basic consonants were drawn to look like your mouth when you say them. " +
      "ㄱ is the back of your tongue lifting up, ㄴ is the tip of your tongue touching behind your top teeth, " +
      "ㅁ is your closed lips, ㅅ is a tooth, and ㅇ is your open throat.",
    examples: [
      { korean: "가", romanization: "ga", english: "ㄱ + ㅏ" },
      { korean: "나", romanization: "na", english: "ㄴ + ㅏ" },
      { korean: "마", romanization: "ma", english: "ㅁ + ㅏ" },
      { korean: "사", romanization: "sa", english: "ㅅ + ㅏ" },
    ],
  },
];

const lesson3Missions: ChoiceQuestion[] = [
  {
    prompt: "Which one says \"na\"?",
    options: ["나", "다", "라"],
    answer: "나",
    explanation: "ㄴ = n, so 나 = na.",
    hints: {
      "다": "ㄷ is \"d.\" Look for ㄴ, the nose shape.",
      "라": "ㄹ is \"r / l.\" Look for ㄴ, the nose shape.",
    },
  },
  {
    prompt: "Which one says \"ma\"? Think: ㅁ is a closed mouth.",
    options: ["바", "마", "사"],
    answer: "마",
    explanation: "ㅁ = m, so 마 = ma.",
    hints: {
      "바": "ㅂ is \"b\" — the bucket. Look for the closed box.",
      "사": "ㅅ is \"s\" — the summit. Look for the closed box.",
    },
  },
  {
    prompt: "Which one says \"ha\"?",
    options: ["아", "하", "사"],
    answer: "하",
    explanation: "ㅎ = h, so 하 = ha.",
    hints: {
      "아": "ㅇ is silent at the start, so 아 is just \"a.\"",
      "사": "ㅅ is \"s.\" Look for the person in a hat: ㅎ.",
    },
  },
  {
    prompt: "🦁 Lion is \"sa-ja.\" Which word is it?",
    options: ["자사", "사차", "사자"],
    answer: "사자",
    explanation: "사 (sa) + 자 (ja) = 사자.",
    hints: {
      "자사": "The order is flipped! Read left to right: sa, then ja.",
      "사차": "ㅊ is \"ch.\" You want ㅈ (j).",
    },
  },
];

// ===============================================================
// LESSON 4 — Airy and doubled consonants
// ===============================================================
const lesson4Letters: VocabularyItem[] = [
  { korean: "ㅊ", romanization: "ch", english: "ch as in church · ㅈ + a stroke = more air", emoji: "⛪", say: "차" },
  { korean: "ㅋ", romanization: "k", english: "k as in kite · ㄱ + a stroke = more air", emoji: "🪁", say: "카" },
  { korean: "ㅌ", romanization: "t", english: "t as in tea · ㄷ + a stroke = more air", emoji: "🍵", say: "타" },
  { korean: "ㅍ", romanization: "p", english: "p as in pie · a strong puff of air", emoji: "🥧", say: "파" },
  { korean: "ㄲ", romanization: "kk", english: "a tight, tense g — doubled ㄱ", emoji: "✌️", say: "까" },
  { korean: "ㄸ", romanization: "tt", english: "a tight, tense d — doubled ㄷ", emoji: "✌️", say: "따" },
  { korean: "ㅃ", romanization: "pp", english: "a tight, tense b — doubled ㅂ", emoji: "✌️", say: "빠" },
  { korean: "ㅆ", romanization: "ss", english: "a sharp, hissing s — doubled ㅅ", emoji: "✌️", say: "싸" },
  { korean: "ㅉ", romanization: "jj", english: "a tight, tense j — doubled ㅈ", emoji: "✌️", say: "짜" },
];

const lesson4Words: VocabularyItem[] = [
  { korean: "기차", romanization: "gicha", english: "train", emoji: "🚆" },
  { korean: "커피", romanization: "keopi", english: "coffee", emoji: "☕" },
  { korean: "피자", romanization: "pija", english: "pizza", emoji: "🍕" },
  { korean: "토마토", romanization: "tomato", english: "tomato", emoji: "🍅" },
  { korean: "아빠", romanization: "appa", english: "dad (ㅃ is a doubled ㅂ)", emoji: "👨" },
];

const lesson4Notes: GrammarNote[] = [
  {
    title: "Add a stroke, add some air",
    explanation:
      "Some consonants come in pairs. Add a stroke and the sound gets a strong puff of air: " +
      "ㄱ → ㅋ, ㄷ → ㅌ, ㅂ → ㅍ, ㅈ → ㅊ. Hold your hand in front of your mouth: " +
      "you should feel air on 카 (ka) but much less on 가 (ga).",
    examples: [
      { korean: "카", romanization: "ka", english: "ㄱ + a stroke → more air" },
      { korean: "타", romanization: "ta", english: "ㄷ + a stroke → more air" },
      { korean: "파", romanization: "pa", english: "ㅂ + a stroke → more air" },
      { korean: "차", romanization: "cha", english: "ㅈ + a stroke → more air" },
    ],
  },
  {
    title: "Doubled letters: ㄲ ㄸ ㅃ ㅆ ㅉ",
    explanation:
      "Five consonants can be doubled. A doubled letter is said tight and sharp, with no puff of air. " +
      "You'll see ㅆ in Lesson 1, in 왔어요 (\"I came\").",
    examples: [
      { korean: "까", romanization: "kka", english: "doubled ㄱ" },
      { korean: "따", romanization: "tta", english: "doubled ㄷ" },
      { korean: "빠", romanization: "ppa", english: "doubled ㅂ" },
      { korean: "싸", romanization: "ssa", english: "doubled ㅅ" },
      { korean: "짜", romanization: "jja", english: "doubled ㅈ" },
    ],
  },
];

const lesson4Missions: ChoiceQuestion[] = [
  {
    prompt: "ㄱ + one more stroke = a puff of air. Which one says \"ka\"?",
    options: ["가", "카", "타"],
    answer: "카",
    explanation: "ㅋ is ㄱ with an extra stroke, so 카 = ka.",
    hints: {
      "가": "No extra stroke — that's the softer \"ga.\"",
      "타": "ㅌ is ㄷ with an extra stroke. That's \"ta.\"",
    },
  },
  {
    prompt: "☕ Coffee is \"keo-pi.\" Which word is it?",
    options: ["커피", "코피", "거비"],
    answer: "커피",
    explanation: "커 (keo) + 피 (pi) = 커피.",
    hints: {
      "코피": "Careful! 코피 (ko-pi) means nosebleed. You want ㅓ (eo), not ㅗ (o).",
      "거비": "ㄱ and ㅂ are softer. Coffee uses the airy ones: ㅋ and ㅍ.",
    },
  },
  {
    prompt: "🍕 Pizza is \"pi-ja.\" Which word is it?",
    options: ["비자", "피자", "피차"],
    answer: "피자",
    explanation: "피 (pi) + 자 (ja) = 피자.",
    hints: {
      "비자": "비자 (bi-ja) means visa! Pizza starts with ㅍ (p).",
      "피차": "ㅊ is \"ch.\" You want ㅈ (j).",
    },
  },
  {
    prompt: "🚆 Train is \"gi-cha.\" Which word is it?",
    options: ["기차", "기자", "키차"],
    answer: "기차",
    explanation: "기 (gi) + 차 (cha) = 기차.",
    hints: {
      "기자": "기자 (gi-ja) means reporter! Train uses ㅊ (ch).",
      "키차": "ㅋ is the airy \"k.\" Train starts with ㄱ (g).",
    },
  },
  {
    prompt: "Which one is the doubled, tense \"ppa\"?",
    options: ["바", "파", "빠"],
    answer: "빠",
    explanation: "ㅃ is a doubled ㅂ: tight, with no puff of air.",
    hints: {
      "바": "That's the plain ㅂ — softer, \"ba.\"",
      "파": "ㅍ has a puff of air. The doubled one is tight, with no air.",
    },
  },
];

// ===============================================================
// LESSON 5 — Building blocks
// ===============================================================
const lesson5Words: VocabularyItem[] = [
  { korean: "물", romanization: "mul", english: "water · ㅁ + ㅜ + ㄹ", emoji: "💧" },
  { korean: "밥", romanization: "bap", english: "rice / a meal · ㅂ + ㅏ + ㅂ", emoji: "🍚" },
  { korean: "산", romanization: "san", english: "mountain · ㅅ + ㅏ + ㄴ", emoji: "⛰️" },
  { korean: "강", romanization: "gang", english: "river · ㄱ + ㅏ + ㅇ", emoji: "🏞️" },
  { korean: "문", romanization: "mun", english: "door · ㅁ + ㅜ + ㄴ", emoji: "🚪" },
  { korean: "김치", romanization: "gimchi", english: "kimchi · 김 + 치", emoji: "🥬" },
  { korean: "한국", romanization: "hanguk", english: "Korea · 한 + 국", emoji: "🇰🇷" },
  { korean: "서울", romanization: "seoul", english: "Seoul · 서 + 울", emoji: "🏙️" },
  { korean: "사랑", romanization: "sarang", english: "love · 사 + 랑", emoji: "❤️" },
];

const lesson5Notes: GrammarNote[] = [
  {
    title: "Side by side, or stacked",
    explanation:
      "Each block is one syllable, read left to right, then top to bottom. " +
      "Tall vowels (ㅏ ㅓ ㅣ ㅑ ㅕ ㅐ ㅔ) go to the RIGHT of the consonant. " +
      "Flat vowels (ㅗ ㅜ ㅡ ㅛ ㅠ) go UNDER the consonant.",
    examples: [
      { korean: "가", romanization: "ga", english: "ㄱ + ㅏ, side by side" },
      { korean: "미", romanization: "mi", english: "ㅁ + ㅣ, side by side" },
      { korean: "고", romanization: "go", english: "ㄱ + ㅗ, stacked" },
      { korean: "누", romanization: "nu", english: "ㄴ + ㅜ, stacked" },
    ],
  },
  {
    title: "A consonant on the bottom: 받침 (batchim)",
    explanation:
      "A block can end with a consonant underneath. This is called 받침 (batchim), and it's read last. " +
      "ㅇ is silent at the start of a block, but at the bottom it says \"ng.\"",
    examples: [
      { korean: "간", romanization: "gan", english: "ㄱ + ㅏ + ㄴ" },
      { korean: "공", romanization: "gong", english: "ㄱ + ㅗ + ㅇ — ㅇ at the bottom says ng" },
      { korean: "물", romanization: "mul", english: "ㅁ + ㅜ + ㄹ — ㄹ at the bottom says l" },
      { korean: "밥", romanization: "bap", english: "ㅂ + ㅏ + ㅂ — ㅂ at the bottom says p" },
    ],
  },
  {
    title: "Bottom sounds are short",
    explanation:
      "At the bottom of a block, sounds are cut short, and only 7 sounds are possible: k, n, t, l, m, p, ng. " +
      "For example, ㅅ ㅈ ㅊ ㅌ ㅎ at the bottom all sound like a short \"t.\"",
    examples: [
      { korean: "옷", romanization: "ot", english: "clothes — ㅅ at the bottom sounds like t" },
      { korean: "낮", romanization: "nat", english: "daytime — ㅈ at the bottom sounds like t" },
    ],
  },
];

const lesson5Missions: ChoiceQuestion[] = [
  {
    prompt: "Put ㄴ + ㅏ + ㄴ together.",
    options: ["난", "낭", "날"],
    answer: "난",
    explanation: "ㄴ + ㅏ = 나, then ㄴ on the bottom = 난 (nan).",
    hints: {
      "낭": "The bottom letter is ㅇ (ng). You want ㄴ.",
      "날": "The bottom letter is ㄹ (l). You want ㄴ.",
    },
  },
  {
    prompt: "ㅗ is a flat vowel, so it goes UNDER the consonant. Which block is ㄱ + ㅗ?",
    options: ["거", "구", "고"],
    answer: "고",
    explanation: "ㄱ on top, ㅗ underneath = 고 (go).",
    hints: {
      "거": "That's ㄱ + ㅓ (geo). Look for the stroke pointing up.",
      "구": "That's ㄱ + ㅜ (gu). The stroke points down — you want up.",
    },
  },
  {
    prompt: "ㅇ at the bottom says \"ng.\" Which one says \"gang\" (river)?",
    options: ["간", "강", "각"],
    answer: "강",
    explanation: "ㄱ + ㅏ + ㅇ = 강 (gang).",
    hints: {
      "간": "ㄴ at the bottom says \"n\" — that's \"gan.\"",
      "각": "ㄱ at the bottom says \"k\" — that's \"gak.\"",
    },
  },
  {
    prompt: "💧 Water is \"mul.\" Which word is it?",
    options: ["물", "문", "무"],
    answer: "물",
    explanation: "ㅁ + ㅜ + ㄹ = 물 (mul).",
    hints: {
      "문": "ㄴ at the bottom — that's \"mun,\" door!",
      "무": "No bottom letter — that's \"mu,\" radish!",
    },
  },
  {
    prompt: "🍚 Rice is \"bap.\" Which word is it?",
    options: ["반", "방", "밥"],
    answer: "밥",
    explanation: "ㅂ + ㅏ + ㅂ = 밥 (bap).",
    hints: {
      "반": "ㄴ at the bottom — that's \"ban\" (half).",
      "방": "ㅇ at the bottom — that's \"bang\" (room).",
    },
  },
  {
    prompt: "🇰🇷 Korea is \"han-guk.\" Which word is it?",
    options: ["한국", "한굴", "안국"],
    answer: "한국",
    explanation: "한 (han) + 국 (guk) = 한국.",
    hints: {
      "한굴": "ㄹ at the bottom says \"l.\" You want ㄱ (k): 국.",
      "안국": "ㅇ is silent, so that starts with \"an.\" You want ㅎ (h).",
    },
  },
  {
    prompt: "🏙️ Seoul is \"seo-ul.\" Which word is it?",
    options: ["소울", "서올", "서울"],
    answer: "서울",
    explanation: "서 (seo) + 울 (ul) = 서울.",
    hints: {
      "소울": "소울 (so-ul) means soul! Seoul starts with ㅓ (eo).",
      "서올": "올 is \"ol.\" You want 울 (ul), with the stroke pointing down.",
    },
  },
];

// ===============================================================
// LESSON 6 — English words in Hangeul
// ===============================================================
const lesson6Words: VocabularyItem[] = [
  { korean: "바나나", romanization: "banana", english: "banana", emoji: "🍌" },
  { korean: "라디오", romanization: "radio", english: "radio", emoji: "📻" },
  { korean: "택시", romanization: "taeksi", english: "taxi", emoji: "🚕" },
  { korean: "호텔", romanization: "hotel", english: "hotel", emoji: "🏨" },
  { korean: "버스", romanization: "beoseu", english: "bus (ㅡ is added because every block needs a vowel)", emoji: "🚌" },
  { korean: "카메라", romanization: "kamera", english: "camera", emoji: "📷" },
  { korean: "컴퓨터", romanization: "keompyuteo", english: "computer", emoji: "💻" },
  { korean: "햄버거", romanization: "haembeogeo", english: "hamburger", emoji: "🍔" },
  { korean: "아이스크림", romanization: "aiseukeurim", english: "ice cream", emoji: "🍦" },
];

const lesson6Notes: GrammarNote[] = [
  {
    title: "English words, Korean letters",
    explanation:
      "Korean borrows lots of English words. Every block needs a vowel, so when English has two " +
      "consonants in a row, Korean often adds the flat vowel ㅡ (eu) between them. " +
      "Say these out loud and you'll recognize them!",
    examples: [
      { korean: "버스", romanization: "beoseu", english: "bus — 스 adds ㅡ after the s" },
      { korean: "아이스크림", romanization: "aiseukeurim", english: "ice cream — 스 and 크 add ㅡ" },
    ],
  },
];

const lesson6Missions: ChoiceQuestion[] = [
  {
    prompt: "🍌 Banana is \"ba-na-na.\" Which word is it?",
    options: ["마나나", "바나나", "바다나"],
    answer: "바나나",
    explanation: "바 (ba) + 나 (na) + 나 (na) = 바나나.",
    hints: {
      "마나나": "ㅁ is \"m.\" Banana starts with ㅂ (b).",
      "바다나": "The middle letter is ㄷ (d). You want ㄴ (n).",
    },
  },
  {
    prompt: "🚌 Bus is \"beo-seu.\" Which word is it?",
    options: ["보스", "버스", "버수"],
    answer: "버스",
    explanation: "버 (beo) + 스 (seu) = 버스.",
    hints: {
      "보스": "보스 (bo-seu) means boss! Bus uses ㅓ (eo).",
      "버수": "ㅜ is \"u.\" The ending is \"seu,\" with the flat ㅡ.",
    },
  },
  {
    prompt: "🏨 Hotel is \"ho-tel.\" Which word is it?",
    options: ["호텔", "고텔", "호털"],
    answer: "호텔",
    explanation: "호 (ho) + 텔 (tel) = 호텔.",
    hints: {
      "고텔": "ㄱ is \"g.\" Hotel starts with ㅎ (h).",
      "호털": "ㅓ is \"eo.\" You want ㅔ (e): 텔.",
    },
  },
  {
    prompt: "🚕 Taxi is \"taek-si.\" Which word is it?",
    options: ["탁시", "택시", "덱시"],
    answer: "택시",
    explanation: "택 (taek) + 시 (si) = 택시.",
    hints: {
      "탁시": "탁 has ㅏ (a). Taxi uses ㅐ (ae): 택.",
      "덱시": "ㄷ is \"d.\" Taxi starts with the airy ㅌ (t).",
    },
  },
  {
    prompt: "📷 Camera is \"ka-me-ra.\" Which word is it?",
    options: ["카메라", "가메라", "카메나"],
    answer: "카메라",
    explanation: "카 (ka) + 메 (me) + 라 (ra) = 카메라.",
    hints: {
      "가메라": "ㄱ is the softer \"g.\" Camera starts with the airy ㅋ (k).",
      "카메나": "ㄴ is \"n.\" The last block should be 라 (ra).",
    },
  },
];

// ===============================================================
// LESSON 7 — GAME: read your way around Seoul
// Each step: a place, what you need, then three Hangeul signs to
// choose from. Only uses letters and words from Lessons 1–6.
// ===============================================================
const gameSteps: GameStep[] = [
  {
    place: "🚆 Off the train",
    prompt: "Your train pulls into the city. A big sign says where you are: \"seo-ul.\" Which sign is it?",
    options: ["사울", "서울", "서을"],
    answer: "서울",
    explanation: "서 (seo) + 울 (ul) = 서울, Seoul! Welcome. 🏙️",
    hints: {
      "사울": "사 has ㅏ (a). Seoul starts with ㅓ (eo): 서.",
      "서을": "을 has the flat ㅡ (eu). You want ㅜ (u): 울.",
    },
  },
  {
    place: "🚕 Outside the station",
    prompt: "Your bags are heavy. You want a taxi (\"taek-si\"). Which sign do you follow?",
    options: ["버스", "기차", "택시"],
    answer: "택시",
    explanation: "택 (taek) + 시 (si) = 택시. You hop in. 🚕",
    hints: {
      "버스": "버스 is \"beo-seu\" — a bus. Look for the airy ㅌ (t).",
      "기차": "기차 is \"gi-cha\" — a train. You just got off one!",
    },
  },
  {
    place: "🏨 On the street",
    prompt: "The taxi stops between three buildings. Which one is your hotel (\"ho-tel\")?",
    options: ["호텔", "모텔", "고텔"],
    answer: "호텔",
    explanation: "호 (ho) + 텔 (tel) = 호텔. You check in and drop your bags.",
    hints: {
      "모텔": "ㅁ is \"m\" — that's a motel! Hotel starts with ㅎ (h).",
      "고텔": "ㄱ is \"g.\" Hotel starts with ㅎ (h).",
    },
  },
  {
    place: "☕ A café",
    prompt: "You need a coffee (\"keo-pi\"). Which one do you point to on the menu?",
    options: ["커피", "코피", "피자"],
    answer: "커피",
    explanation: "커 (keo) + 피 (pi) = 커피. ☕",
    hints: {
      "코피": "코 has ㅗ (o). 코피 means a nosebleed! Coffee uses ㅓ (eo): 커.",
      "피자": "피자 is \"pi-ja\" — pizza. Look for 커 at the start.",
    },
  },
  {
    place: "🥛 Still at the café",
    prompt: "Your friend doesn't drink coffee. They want milk (\"u-yu\").",
    options: ["여우", "우유", "이유"],
    answer: "우유",
    explanation: "우 (u) + 유 (yu) = 우유. 🥛",
    hints: {
      "여우": "여우 is \"yeo-u\" — a fox! 🦊 Milk starts with 우.",
      "이유": "이유 is \"i-yu\" — a reason. Milk starts with 우 (u).",
    },
  },
  {
    place: "🍚 Lunch",
    prompt: "At a small restaurant, you want a side of kimchi (\"gim-chi\"). Which word is on the menu?",
    options: ["김치", "고기", "기차"],
    answer: "김치",
    explanation: "김 (gim) + 치 (chi) = 김치. Spicy! 🌶️",
    hints: {
      "고기": "고기 is \"go-gi\" — meat. Kimchi starts with 김.",
      "기차": "기차 is a train — you can't eat that! Look for the ㅁ at the bottom of 김.",
    },
  },
  {
    place: "💧 Still at lunch",
    prompt: "That kimchi was spicy. Quick, find the water (\"mul\")!",
    options: ["문", "밥", "물"],
    answer: "물",
    explanation: "ㅁ + ㅜ + ㄹ = 물. ㄹ at the bottom says \"l.\" Ahh. 💧",
    hints: {
      "문": "ㄴ at the bottom says \"n\" — 문 (mun) is a door! 🚪",
      "밥": "밥 is \"bap\" — rice. Water starts with ㅁ (m).",
    },
  },
  {
    place: "🍦 Dessert",
    prompt: "Time for something sweet. You want ice cream (\"a-i-seu-keu-rim\").",
    options: ["아이", "아이스크림", "바나나"],
    answer: "아이스크림",
    explanation: "아 + 이 + 스 + 크 + 림 = 아이스크림. Korean adds ㅡ (eu) between the English consonants. 🍦",
    hints: {
      "아이": "아이 means \"child\" — it's only the start of the word you want.",
      "바나나": "바나나 is banana. Look for the longer word starting with 아이.",
    },
  },
  {
    place: "🚌 Heading to the beach",
    prompt: "You want to see the sea (\"ba-da\"). Which sign on the bus shows where it's going?",
    options: ["나비", "바나나", "바다"],
    answer: "바다",
    explanation: "바 (ba) + 다 (da) = 바다, the sea. 🌊 You read your way around Seoul!",
    hints: {
      "나비": "나비 is \"na-bi\" — a butterfly. 🦋 The sea starts with ㅂ (b).",
      "바나나": "Close! 바나나 is banana. The sea is just two blocks: 바 + 다.",
    },
  },
];

// ===============================================================
// LESSON 7 — Review: listening questions
// The app speaks the Korean; the learner picks the answer.
// ===============================================================
const listeningQuestions: ChoiceQuestion[] = [
  { prompt: "아", options: ["a", "eo", "o"], answer: "a" },
  { prompt: "우", options: ["o", "u", "eu"], answer: "u" },
  { prompt: "여", options: ["ya", "yeo", "yo"], answer: "yeo" },
  { prompt: "나", options: ["na", "da", "ra"], answer: "na" },
  { prompt: "카", options: ["ga", "ka", "ta"], answer: "ka" },
  { prompt: "바다", options: ["tree", "sea", "butterfly"], answer: "sea" },
  { prompt: "커피", options: ["pizza", "banana", "coffee"], answer: "coffee" },
  { prompt: "물", options: ["water", "door", "rice"], answer: "water" },
  { prompt: "한국", options: ["Seoul", "Korea", "hotel"], answer: "Korea" },
  { prompt: "버스", options: ["taxi", "boss", "bus"], answer: "bus" },
];

// ===============================================================
// THE WHOLE UNIT (puts the lessons above together)
// ===============================================================
export const alphabetUnit: Unit = {
  id: "hangeul",
  title: "Hangeul Alphabet",
  description: "Start here: learn to read Korean letters.",
  icon: "가",
  image: "/units/hangeul.svg",
  color: "#3976b8",
  photo: {
    src: "/lesson-photos/hangeul.jpg",
    alt: "Janganmun, the north gate of Hwaseong Fortress in Suwon",
  },

  lessons: [
    {
      id: "hangeul-1",
      title: "Simple vowels",
      description: "Meet Hangeul and learn six simple vowels.",
      sections: {
        speakers: {},
        study: [
          {
            title: "Simple vowels",
            intro: "Read the notes, then learn each letter. Tap any Korean to hear it.",
            conversation: [],
            words: lesson1Letters,
            phrases: lesson1Words,
            grammar: lesson1Notes,
            missions: lesson1Missions,
            wordsTitle: "Letters",
            phrasesTitle: "Words",
            grammarTitle: "How it works",
            wordsQuizBy: "romanization",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-2",
      title: "Y vowels, ㅐ and ㅔ",
      description: "Add a stroke to add a \"y,\" plus two more vowels.",
      sections: {
        speakers: {},
        study: [
          {
            title: "Y vowels, ㅐ and ㅔ",
            intro: "Six more vowels — and they build on the ones you know.",
            conversation: [],
            words: lesson2Letters,
            phrases: lesson2Words,
            grammar: lesson2Notes,
            missions: lesson2Missions,
            wordsTitle: "Letters",
            phrasesTitle: "Words",
            grammarTitle: "How it works",
            wordsQuizBy: "romanization",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-3",
      title: "Basic consonants",
      description: "Ten consonants shaped like your mouth, and your first real words.",
      sections: {
        speakers: {},
        study: [
          {
            title: "Basic consonants",
            intro: "Each consonant plays with ㅏ so you can hear it (ㄱ → 가).",
            conversation: [],
            words: lesson3Letters,
            phrases: lesson3Words,
            grammar: lesson3Notes,
            missions: lesson3Missions,
            wordsTitle: "Letters",
            phrasesTitle: "Words",
            grammarTitle: "How it works",
            wordsQuizBy: "romanization",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-4",
      title: "Airy and doubled consonants",
      description: "Add a stroke for a puff of air, or double a letter to make it tense.",
      sections: {
        speakers: {},
        study: [
          {
            title: "Airy and doubled consonants",
            intro: "These consonants build on the ones you already know.",
            conversation: [],
            words: lesson4Letters,
            phrases: lesson4Words,
            grammar: lesson4Notes,
            missions: lesson4Missions,
            wordsTitle: "Letters",
            phrasesTitle: "Words",
            grammarTitle: "How it works",
            wordsQuizBy: "romanization",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-5",
      title: "Building blocks",
      description: "Stack letters into blocks and read real Korean words.",
      sections: {
        speakers: {},
        study: [
          {
            title: "Building blocks",
            intro: "Put consonants and vowels together into blocks.",
            conversation: [],
            words: lesson5Words,
            phrases: [],
            grammar: lesson5Notes,
            missions: lesson5Missions,
            grammarTitle: "How it works",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-6",
      title: "English words in Hangeul",
      description: "Read taxi, hotel, bus, and more — written in Korean.",
      sections: {
        speakers: {},
        study: [
          {
            title: "English words in Hangeul",
            intro: "You already know these words. Can you read them in Hangeul?",
            conversation: [],
            words: lesson6Words,
            phrases: [],
            grammar: lesson6Notes,
            missions: lesson6Missions,
            grammarTitle: "How it works",
            notesFirst: true,
          },
        ],
      },
    },
    {
      id: "hangeul-7",
      title: "Game: Read Seoul",
      description: "Read real signs and menus to get around Seoul, then review every letter.",
      sections: {
        speakers: {},
        study: [],
        game: {
          title: "Read your way around Seoul",
          intro: "You just arrived in Seoul 🇰🇷 and everything is written in Hangeul. Find a taxi, your hotel, food, and the sea by reading the signs. Pick the right sign at each step!",
          steps: gameSteps,
          finish: "You got around Seoul by reading Hangeul! 🎉 Now review every letter.",
        },
        review: {
          title: "Review",
          flashcards: [
            ...lesson1Letters, ...lesson2Letters, ...lesson3Letters, ...lesson4Letters,
            ...lesson5Words,
          ],
          listening: listeningQuestions,
        },
      },
    },
  ],
};
