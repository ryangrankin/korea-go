/*
  WORD PRACTICE LOGIC
  The rules behind components/lesson/WordPractice.tsx, as plain functions
  so they can be tested (lib/wordPractice.test.ts).

  - New words are introduced a few at a time (settings.newAtOnce).
  - Each must be answered right `correctToLearn` times. A miss puts the word
    back in the queue until it's answered right `repeatsAfterMiss` more times.
  - Progress counts ANSWERED QUESTIONS out of an estimate of how many are
    left, and never goes backwards (a miss adds questions, so the estimate
    grows, but the bar holds its place instead of dropping).
*/

import type { PracticeSettings, QuizKind } from "./learningSettings";

// Other cards shown before a word comes back.
const GAP_AFTER_RIGHT = 3;
const GAP_AFTER_MISS = 2;

export type PracticeCard =
  | { kind: "intro"; word: number }
  | { kind: "quiz"; word: number; quiz: QuizKind; options: number[] };

export type PracticeState = {
  queue: number[]; // words waiting to be quizzed, in order
  needed: number[]; // right answers each word still needs
  timesRight: number[]; // right answers so far (picks the question type)
  nextNew: number; // the next word to introduce
  answered: number; // questions answered so far
  peakPercent: number; // highest progress shown so far (so it never drops)
};

// What a word needs to pick its wrong answers (meaning, Korean, group).
export type OptionWord = { korean: string; meaning: string; group: string };

export const initialPracticeState = (wordCount: number): PracticeState => ({
  queue: [],
  needed: Array(wordCount).fill(0),
  timesRight: Array(wordCount).fill(0),
  nextNew: 0,
  answered: 0,
  peakPercent: 0,
});

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Put a word back into the queue, `gap` cards from the front.
function insertAt(queue: number[], word: number, gap: number): number[] {
  const copy = [...queue];
  copy.splice(Math.min(gap, copy.length), 0, word);
  return copy;
}

// The right answer plus wrong ones (optionCount in all), mixed up.
export function pickOptions(
  words: OptionWord[],
  index: number,
  optionCount: number,
  random: () => number = Math.random
): number[] {
  const target = words[index];
  const differs = (i: number) =>
    i !== index && words[i].meaning !== target.meaning && words[i].korean !== target.korean;
  const all = words.map((_, i) => i).filter(differs);
  const sameGroup = all.filter((i) => words[i].group === target.group);
  const pool = sameGroup.length >= 2 ? sameGroup : all;
  return shuffle([index, ...shuffle(pool, random).slice(0, optionCount - 1)], random);
}

// Decide what to show next: a new word, or the next word in the queue.
// Returns card: null when every word has been learned.
export function nextCard(
  words: OptionWord[],
  state: PracticeState,
  settings: PracticeSettings,
  random: () => number = Math.random
): { card: PracticeCard | null; state: PracticeState } {
  const learning = state.needed.slice(0, state.nextNew).filter((n) => n > 0).length;
  const hasNew = state.nextNew < words.length;

  if (hasNew && (learning < settings.newAtOnce || state.queue.length === 0)) {
    const word = state.nextNew;
    const needed = [...state.needed];
    needed[word] = settings.correctToLearn;
    return {
      card: { kind: "intro", word },
      state: { ...state, needed, nextNew: word + 1, queue: insertAt(state.queue, word, 1) },
    };
  }

  if (state.queue.length === 0) return { card: null, state };

  const [word, ...rest] = state.queue;
  const order = settings.quizOrder;
  const quiz = order[state.timesRight[word] % order.length];
  return {
    card: { kind: "quiz", word, quiz, options: pickOptions(words, word, settings.optionCount, random) },
    state: { ...state, queue: rest },
  };
}

// Record an answer to a question about `word`.
export function applyAnswer(
  state: PracticeState,
  word: number,
  right: boolean,
  settings: PracticeSettings,
  wordCount: number
): PracticeState {
  const needed = [...state.needed];
  const timesRight = [...state.timesRight];
  let queue = state.queue;

  if (right) {
    timesRight[word] += 1;
    needed[word] = Math.max(0, needed[word] - 1);
    if (needed[word] > 0) queue = insertAt(queue, word, GAP_AFTER_RIGHT);
  } else {
    timesRight[word] = 0; // start again with the first kind of question
    needed[word] = settings.repeatsAfterMiss;
    queue = insertAt(queue, word, GAP_AFTER_MISS);
  }

  const next = { ...state, needed, timesRight, queue, answered: state.answered + 1 };
  const percent = practiceProgress(next, wordCount, settings).rawPercent;
  return { ...next, peakPercent: Math.max(state.peakPercent, percent) };
}

// How far through the practice the learner is.
export function practiceProgress(state: PracticeState, wordCount: number, settings: PracticeSettings) {
  const introduced = Math.min(state.nextNew, wordCount);
  const stillNeeded = state.needed.slice(0, introduced).reduce((sum, n) => sum + n, 0);
  const notYetIntroduced = (wordCount - introduced) * settings.correctToLearn;
  const remaining = stillNeeded + notYetIntroduced;
  const total = state.answered + remaining;
  const rawPercent = total === 0 ? 0 : Math.round((state.answered / total) * 100);
  const learned = state.needed.slice(0, introduced).filter((n) => n === 0).length;
  return {
    answered: state.answered,
    remaining, // questions still to answer, if every answer from now on is right
    learned,
    rawPercent,
    percent: remaining === 0 && wordCount > 0 ? 100 : Math.max(state.peakPercent, rawPercent),
  };
}
