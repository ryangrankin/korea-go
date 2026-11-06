/*
  Word practice: the progress bar must track answered questions, move after
  every answer, never go backwards, and reach 100% only when practice ends.
*/

import { describe, expect, it } from "vitest";
import type { PracticeSettings } from "./learningSettings";
import { applyAnswer, initialPracticeState, nextCard, practiceProgress, type PracticeState } from "./wordPractice";

const settings: PracticeSettings = {
  newAtOnce: 3,
  correctToLearn: 2,
  repeatsAfterMiss: 3,
  optionCount: 3,
  quizOrder: ["meaning", "korean", "listen"],
};

const words = ["가", "나", "다", "라", "마"].map((korean, i) => ({ korean, meaning: `word ${i}`, group: "words" }));
const fixedRandom = () => 0.42;

// Play through, answering wrong whenever `wrongOn` says so. Returns the
// progress percent after every answer and the final state.
function play(wrongOn: (answerNumber: number) => boolean) {
  let state: PracticeState = initialPracticeState(words.length);
  const percents: number[] = [];
  for (let guard = 0; guard < 500; guard++) {
    const next = nextCard(words, state, settings, fixedRandom);
    state = next.state;
    if (!next.card) break;
    if (next.card.kind === "quiz") {
      const wrong = wrongOn(state.answered + 1);
      state = applyAnswer(state, next.card.word, !wrong, settings, words.length);
      percents.push(practiceProgress(state, words.length, settings).percent);
    }
  }
  return { state, percents };
}

describe("word practice progress", () => {
  it("starts at 0 and moves after the very first answer", () => {
    const { percents } = play(() => false);
    expect(practiceProgress(initialPracticeState(words.length), words.length, settings).percent).toBe(0);
    expect(percents[0]).toBeGreaterThan(0);
  });

  it("with all answers right, needs exactly words × correctToLearn questions and ends at 100%", () => {
    const { state, percents } = play(() => false);
    expect(state.answered).toBe(words.length * settings.correctToLearn);
    expect(percents.at(-1)).toBe(100);
    expect(practiceProgress(state, words.length, settings).learned).toBe(words.length);
  });

  it("never goes backwards, even after misses re-queue a word", () => {
    const { percents } = play((n) => n % 3 === 0); // every third answer is wrong
    for (let i = 1; i < percents.length; i++) expect(percents[i]).toBeGreaterThanOrEqual(percents[i - 1]);
    expect(percents.at(-1)).toBe(100);
  });

  it("never passes 100% before the end", () => {
    const { percents } = play((n) => n % 4 === 0);
    expect(percents.slice(0, -1).every((p) => p < 100)).toBe(true);
  });

  it("a miss adds questions instead of pretending the word was learned", () => {
    let state = initialPracticeState(words.length);
    state = nextCard(words, state, settings, fixedRandom).state; // intro word 0
    state = applyAnswer(state, 0, false, settings, words.length);
    expect(state.needed[0]).toBe(settings.repeatsAfterMiss);
    expect(practiceProgress(state, words.length, settings).learned).toBe(0);
  });
});

describe("word practice options", () => {
  it("offers the right number of choices, including the answer, with no repeats", () => {
    let state = initialPracticeState(words.length);
    for (let i = 0; i < 6; i++) {
      const next = nextCard(words, state, settings, Math.random);
      state = next.state;
      if (next.card?.kind === "quiz") {
        expect(next.card.options).toHaveLength(settings.optionCount);
        expect(next.card.options).toContain(next.card.word);
        expect(new Set(next.card.options).size).toBe(settings.optionCount);
      }
    }
  });
});
