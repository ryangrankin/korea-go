/*
  PRACTICE ITEMS
  Turns a lesson section's words and phrases into items to practice:
  each has a `meaning` to match it to, and a `group` so wrong options
  come from similar items. Used by the word practice in lessons and
  by the mini games, so both always use the lesson content.
*/

import type { StudySection, VocabularyItem } from "../data/lessons";

export type PracticeWord = VocabularyItem & {
  meaning: string; // what the learner matches it to (English, or romanization for letters)
  group: string; // "words" or "phrases"
};

export function practiceItems(section: StudySection): PracticeWord[] {
  return [
    ...section.words.map((word) => ({
      ...word,
      group: "words",
      meaning:
        section.wordsQuizBy === "romanization"
          ? word.romanization ?? word.english
          : word.english,
    })),
    ...section.phrases.map((word) => ({ ...word, group: "phrases", meaning: word.english })),
  ];
}

// What the computer voice should say for an item.
export function sayOf(word: VocabularyItem): string {
  return word.say ?? word.example?.korean ?? word.korean;
}
