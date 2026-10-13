/*
  HANGEUL CHART CONTENT
  =====================
  Letters shown in the Hangeul chart (the "가" button on every screen).

  - letter:       the Hangeul letter
  - romanization: how it's written in English letters
  - say:          what the computer voice says when you tap it.
                  A consonant can't be said alone, so we play it with
                  the vowel ㅏ (ㄱ → 가 "ga"). A vowel is played with the
                  silent ㅇ in front (ㅏ → 아 "a").
*/

export type HangeulLetter = { letter: string; romanization: string; say: string };

export const consonants: HangeulLetter[] = [
  { letter: "ㄱ", romanization: "g / k", say: "가" },
  { letter: "ㄴ", romanization: "n", say: "나" },
  { letter: "ㄷ", romanization: "d / t", say: "다" },
  { letter: "ㄹ", romanization: "r / l", say: "라" },
  { letter: "ㅁ", romanization: "m", say: "마" },
  { letter: "ㅂ", romanization: "b / p", say: "바" },
  { letter: "ㅅ", romanization: "s", say: "사" },
  { letter: "ㅇ", romanization: "silent / ng", say: "아" },
  { letter: "ㅈ", romanization: "j", say: "자" },
  { letter: "ㅊ", romanization: "ch", say: "차" },
  { letter: "ㅋ", romanization: "k", say: "카" },
  { letter: "ㅌ", romanization: "t", say: "타" },
  { letter: "ㅍ", romanization: "p", say: "파" },
  { letter: "ㅎ", romanization: "h", say: "하" },
];

export const vowels: HangeulLetter[] = [
  { letter: "ㅏ", romanization: "a", say: "아" },
  { letter: "ㅑ", romanization: "ya", say: "야" },
  { letter: "ㅓ", romanization: "eo", say: "어" },
  { letter: "ㅕ", romanization: "yeo", say: "여" },
  { letter: "ㅗ", romanization: "o", say: "오" },
  { letter: "ㅛ", romanization: "yo", say: "요" },
  { letter: "ㅜ", romanization: "u", say: "우" },
  { letter: "ㅠ", romanization: "yu", say: "유" },
  { letter: "ㅡ", romanization: "eu", say: "으" },
  { letter: "ㅣ", romanization: "i", say: "이" },
];

// A few combined vowels that show up a lot in Lesson 1
// (네, 택시, 뭐, 환전, 죄송합니다).
export const moreVowels: HangeulLetter[] = [
  { letter: "ㅐ", romanization: "ae", say: "애" },
  { letter: "ㅔ", romanization: "e", say: "에" },
  { letter: "ㅘ", romanization: "wa", say: "와" },
  { letter: "ㅝ", romanization: "wo", say: "워" },
  { letter: "ㅚ", romanization: "oe", say: "외" },
];

// Short notes shown above each group in the chart.
export const chartNotes = {
  consonants: "Consonants can't be said alone, so each one plays with ㅏ (ㄱ → 가 ga).",
  vowels: "Each vowel plays with a silent ㅇ in front (ㅏ → 아 a).",
  moreVowels: "You'll see these in 네, 택시, 뭐, 환전, 죄송합니다.",
};
