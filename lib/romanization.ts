/*
  ROMANIZATION LOOKUP
  Finds how to say a Korean answer choice, using the romanization already
  written in the lesson files (words, phrases, conversations, grammar
  examples, game lines). Nothing is guessed: if a phrase isn't written
  anywhere in the lessons, no romanization is shown for it.

  Sentences made of two known phrases ("죄송합니다. 도와주실 수 있나요?")
  are looked up piece by piece.
*/

import type { Example, Unit, VocabularyItem } from "../data/lessons";

// Compare ignoring spaces at the ends and final punctuation.
const keyFor = (korean: string) => korean.trim().replace(/[.?!,]+$/, "").trim();

export function buildRomanizationIndex(units: Unit[]): Map<string, string> {
  const index = new Map<string, string>();
  const add = (korean?: string, romanization?: string) => {
    if (!korean || !romanization || korean.includes("___")) return;
    const key = keyFor(korean);
    if (!index.has(key)) index.set(key, romanization.trim().replace(/[.?!,]+$/, ""));
  };
  const addItem = (item: VocabularyItem) => {
    add(item.korean, item.romanization);
    if (item.example) add(item.example.korean, item.example.romanization);
  };
  const addExample = (example?: Example) => example && add(example.korean, example.romanization);

  for (const unit of units) {
    for (const lesson of unit.lessons) {
      lesson.vocabulary?.forEach(addItem);
      const sections = lesson.sections;
      if (!sections) continue;
      for (const section of sections.study) {
        section.words.forEach(addItem);
        section.phrases.forEach(addItem);
        section.conversation.forEach(addExample);
        section.grammar.forEach((note) => note.examples.forEach(addExample));
      }
      sections.game?.steps.forEach((step) => addExample(step.line));
      sections.review?.flashcards.forEach(addItem);
    }
  }
  return index;
}

// How to say `korean`, or undefined if the lessons don't say.
export function romanizationFor(index: Map<string, string>, korean: string): string | undefined {
  if (!/[가-힣]/.test(korean)) return undefined; // not Korean
  const whole = index.get(keyFor(korean));
  if (whole) return whole;
  // Try each sentence on its own, e.g. "죄송합니다. 도와주실 수 있나요?"
  const pieces = korean.split(/(?<=[.?!])\s+/).filter(Boolean);
  if (pieces.length < 2) return undefined;
  const found = pieces.map((piece) => index.get(keyFor(piece)));
  return found.every(Boolean) ? found.join(". ") : undefined;
}
