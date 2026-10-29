import { alphabetUnit } from "./alphabet";
import { greetingsUnit } from "./greetings";
import { airportUnit } from "./airport";
import { foodUnit } from "./food";

export type VocabularyItem = {
  korean: string;
  english: string;
  romanization?: string;
  audioUrl?: string;
  // Optional extras used by sectioned lessons:
  emoji?: string; // picture shown with the word
  say?: string; // what the voice says, if different from `korean`
  example?: Example; // filled-in example for phrases with a blank ___
};

// A short lesson (about 5–10 minutes).
export type Lesson = {
  id: string;
  title: string;
  description: string;
  // Lessons without sections use the simple word-by-word viewer.
  vocabulary?: VocabularyItem[];
  // Lessons with sections (conversation, word practice, missions, game, review).
  sections?: LessonSections;
};

// A group of short lessons on one topic, shown together on the dashboard.
export type Unit = {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[]; // an empty list shows the unit as "Coming soon"
};

// ---------- Types for sectioned lessons ----------

export type Example = {
  korean: string;
  romanization: string;
  english: string;
};

export type Speaker = { name: string; emoji: string };

export type ConversationLine = Example & {
  speaker: string; // a key from `speakers`
  emoji: string;
};

export type GrammarNote = {
  title: string;
  explanation: string;
  examples: Example[];
};

// A multiple-choice question. `answer` must match one option exactly.
// `hints` are shown when a learner picks that wrong option.
export type ChoiceQuestion = {
  prompt: string;
  options: string[];
  answer: string;
  explanation?: string;
  hints?: Record<string, string>;
};

export type StudySection = {
  title: string;
  tabLabel?: string; // short name for the section tab (if the lesson has several)
  intro: string;
  conversation: ConversationLine[]; // can be empty [] to skip the conversation
  words: VocabularyItem[];
  phrases: VocabularyItem[];
  grammar: GrammarNote[];
  missions: ChoiceQuestion[];
  // Optional: rename steps on screen, e.g. "Letters" instead of "Words".
  wordsTitle?: string;
  phrasesTitle?: string;
  grammarTitle?: string;
  notesFirst?: boolean; // show the grammar notes before the words
  // What learners match `words` to in the word practice. Default is
  // "english"; letters use "romanization" (ㄱ → "g / k").
  wordsQuizBy?: "english" | "romanization";
};

export type GameStep = ChoiceQuestion & {
  place: string;
  speaker?: string; // a key from `speakers`
  line?: Example; // what that person says to you
};

export type LessonSections = {
  speakers: Record<string, Speaker>;
  study: StudySection[];
  game?: { title: string; intro: string; steps: GameStep[]; finish: string };
  review?: {
    title: string;
    flashcards: VocabularyItem[];
    listening: ChoiceQuestion[]; // prompt = the Korean that is played
  };
};

export const units: Unit[] = [
  alphabetUnit,
  greetingsUnit,
  airportUnit,
  foodUnit,
];

// Every lesson, in order (used to find a lesson and the one after it).
export const lessons: Lesson[] = units.flatMap((unit) => unit.lessons);

// Rough time for a lesson in minutes, from how much is in it.
export function estimateMinutes(lesson: Lesson): number {
  const sections = lesson.sections;
  if (!sections) return Math.max(3, Math.ceil(((lesson.vocabulary?.length ?? 0) * 10) / 60));

  let seconds = 0;
  for (const section of sections.study) {
    seconds += (section.words.length + section.phrases.length) * 25; // word practice
    seconds += section.missions.length * 20;
    seconds += section.conversation.length * 6;
    seconds += section.grammar.length * 50;
  }
  seconds += (sections.game?.steps.length ?? 0) * 25;
  seconds += (sections.review?.flashcards.length ?? 0) * 4;
  seconds += (sections.review?.listening.length ?? 0) * 12;
  return Math.max(3, Math.ceil(seconds / 60));
}
