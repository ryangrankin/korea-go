/*
  MATCH SETS
  The sets for the Hangeul Match game, built straight from the Hangeul
  lessons: one set per lesson, plus every letter mixed together.
  Used by the game and by the best-times leaderboard on the Friends tab.
*/

import { units } from "../data/lessons";
import { practiceItems, type PracticeWord } from "./practiceItems";

export type MatchSet = { id: string; title: string; items: PracticeWord[] };

// Keep one of each Korean and each meaning, so every pair has one answer.
function unique(items: PracticeWord[]): PracticeWord[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.korean) || seen.has(item.meaning)) return false;
    seen.add(item.korean);
    seen.add(item.meaning);
    return true;
  });
}

const hangeulLessons = units.find((unit) => unit.id === "hangeul")?.lessons ?? [];

export const lessonSets: MatchSet[] = hangeulLessons
  .map((lesson) => ({
    id: lesson.id,
    title: lesson.title,
    items: unique((lesson.sections?.study ?? []).flatMap(practiceItems)),
  }))
  .filter((set) => set.items.length >= 3);

const allLetters: MatchSet = {
  id: "all-letters",
  title: "All letters",
  items: unique(
    hangeulLessons.flatMap((lesson) =>
      (lesson.sections?.study ?? [])
        .filter((section) => section.wordsQuizBy === "romanization")
        .flatMap((section) => practiceItems(section).filter((item) => item.group === "words"))
    )
  ),
};

export const MATCH_SETS: MatchSet[] = [...lessonSets, allLetters];
