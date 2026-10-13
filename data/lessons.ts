
import { lesson1 } from "./lesson1";

export type VocabularyItem = {
  korean: string;
  english: string;
  romanization?: string;
  audioUrl?: string;
  // Optional extras used by sectioned lessons (Lesson 1 and later):
  emoji?: string; // picture shown with the word
  say?: string; // what the voice says, if different from `korean`
  example?: Example; // filled-in example for phrases with a blank ___
};

export type Lesson = {
  id: string;
  title: string;
  description: string;
  vocabulary: VocabularyItem[];
  // Optional: lessons with sections (conversation, missions, game, review).
  // Lessons without this keep using the simple word-by-word viewer.
  sections?: LessonSections;
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
  tabLabel: string; // short name for the section tab
  intro: string;
  conversation: ConversationLine[];
  words: VocabularyItem[];
  phrases: VocabularyItem[];
  grammar: GrammarNote[];
  missions: ChoiceQuestion[];
};

export type GameStep = ChoiceQuestion & {
  place: string;
  speaker?: string; // a key from `speakers`
  line?: Example; // what that person says to you
};

export type LessonSections = {
  speakers: Record<string, Speaker>;
  study: StudySection[]; // e.g. Section 1 Greetings, Section 2 Airport
  game: { title: string; intro: string; steps: GameStep[]; finish: string };
  review: {
    title: string;
    flashcards: VocabularyItem[];
    listening: ChoiceQuestion[]; // prompt = the Korean that is played
  };
};

export const lessons: Lesson[] = [lesson1];
