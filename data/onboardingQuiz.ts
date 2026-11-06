/*
  SIGN-UP QUIZ CONTENT
  ====================
  The short quiz new learners take right after signing up. Each step sets
  one of the choices on the Settings page, so lessons fit them from day
  one (see lib/learningSettings.ts for what each choice changes).

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each option's `value` must stay EXACTLY as it is — it's what the
    Settings page and lessons look for. Change `title` and `detail` freely.
  - In the level check, `answer` must match one of the `options` exactly.
*/

import type { Focus, Goal, Level } from "../lib/preferences";

export type QuizOption<T> = { value: T; icon: string; title: string; detail: string };

// ---------- 1. Korean level ----------
export const levelOptions: QuizOption<Level>[] = [
  { value: "Beginner", icon: "🌱", title: "I'm brand new", detail: "I can't read Hangeul yet, or I only know a word or two." },
  { value: "Intermediate", icon: "🌿", title: "I know the basics", detail: "I can read Hangeul and know some words and phrases." },
  { value: "Advanced", icon: "🌳", title: "I can get by", detail: "I can have a simple conversation and read most signs." },
];

// "Not sure?" — three quick questions that suggest a level.
// 0–1 right → Beginner, 2 right → Intermediate, 3 right → Advanced.
export type LevelCheckQuestion = {
  prompt: string;
  korean?: string; // shown big, tap to hear
  options: string[];
  answer: string;
};

export const levelCheck: LevelCheckQuestion[] = [
  {
    prompt: "How do you read this letter?",
    korean: "아",
    options: ["a", "eo", "o", "I don't know yet"],
    answer: "a",
  },
  {
    prompt: "What does this mean?",
    korean: "감사합니다",
    options: ["Thank you", "Hello", "I'm sorry", "I don't know yet"],
    answer: "Thank you",
  },
  {
    prompt: "You need directions from a stranger your age. Which is the polite way to ask?",
    options: ["저기요, 지하철역이 어디예요?", "야, 지하철역 어디야?", "지하철역!", "I don't know yet"],
    answer: "저기요, 지하철역이 어디예요?",
  },
];

export function levelFromScore(score: number): Level {
  if (score >= 3) return "Advanced";
  if (score === 2) return "Intermediate";
  return "Beginner";
}

// ---------- 2. Learning goal ----------
export const goalOptions: QuizOption<Goal>[] = [
  { value: "Everyday conversation", icon: "💬", title: "Everyday conversation", detail: "Chat with people, make friends, and get through daily life." },
  { value: "Travel and navigation", icon: "✈️", title: "Travel", detail: "Airports, transportation, directions, and getting around." },
  { value: "Academic learning", icon: "📚", title: "Study", detail: "Understand how Korean works, including the grammar." },
  { value: "Culture and media", icon: "🎵", title: "Culture & media", detail: "Food, music, dramas, and Korean culture." },
];

// ---------- 3. Practice focus ----------
export const focusOptions: QuizOption<Focus>[] = [
  { value: "Mixed practice", icon: "🎯", title: "A bit of everything", detail: "A balanced mix of words, grammar, and listening." },
  { value: "Vocabulary", icon: "🧠", title: "Vocabulary", detail: "Extra repetition so new words really stick." },
  { value: "Grammar", icon: "🧩", title: "Grammar", detail: "See how sentences work before practicing the words." },
  { value: "Conversation", icon: "🗣️", title: "Conversation", detail: "Practice whole phrases first." },
  { value: "Listening", icon: "🎧", title: "Listening", detail: "More listening questions; English stays hidden until you need it." },
];

// ---------- 4. Romanization ----------
export const romanizationOptions: QuizOption<boolean>[] = [
  { value: true, icon: "🔤", title: "Show it", detail: "Helpful while you're still learning to read Hangeul." },
  { value: false, icon: "한", title: "Hide it", detail: "I want to read Hangeul on its own." },
];

// ---------- 5. Daily study goal ----------
export const minuteOptions: QuizOption<number>[] = [
  { value: 5, icon: "☕", title: "5 minutes", detail: "Casual — a quick practice a day." },
  { value: 10, icon: "🚶", title: "10 minutes", detail: "Regular — about one short lesson a day." },
  { value: 15, icon: "🏃", title: "15 minutes", detail: "Serious — steady progress every day." },
  { value: 20, icon: "🚀", title: "20 minutes", detail: "Intense — getting ready for a trip soon!" },
];
