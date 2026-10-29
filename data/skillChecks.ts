/*
  SKILL CHECKS AND TEST-OUTS
  ==========================
  Short challenges that let a learner show what they already know.
  - A "skill check" covers a whole topic (one unit), with a few questions
    from each lesson.
  - A "test-out" covers one lesson, with all of that lesson's questions.
  Both use the questions in data/checks/*.ts. No screen code lives here,
  so new questions can be added by editing those files only.

  TO ADD A TOPIC: make a file in data/checks/ like the others, then add it
  to `skillTopics` at the bottom of this file.
  TO ADD QUESTIONS: add them to a topic's `questions`. Each lesson needs at
  least CHALLENGE_CONFIG.minQuestions questions for its "Test out" button
  to appear. Lessons without questions (like review games) can't be tested
  out of.
*/

import { foodChecks } from "./checks/food";
import { greetingsChecks } from "./checks/greetings";
import { hangeulChecks } from "./checks/hangeul";

// ---------- Settings ----------
export const CHALLENGE_CONFIG = {
  passPercent: 80, // score needed to pass
  minQuestions: 5, // a challenge with fewer questions can never pass
  topicQuestionsPerLesson: 2, // how many questions a skill check takes from each lesson
};

// ---------- Question types ----------
type QuestionBase = {
  id: string; // unique across every topic, e.g. "food-3-water"
  lessonId: string; // the lesson it tests, e.g. "food-3" (see data/lessons.ts)
  skill: string; // a key from the topic's `skills`
  prompt: string; // the question, in English
  explanation: string; // shown after answering, right or wrong
  hint?: string; // optional nudge shown before answering
  emoji?: string; // optional picture shown with the question
  image?: string; // optional image in /public, e.g. "/culture/bibimbap.svg"
};

// Pick one answer.
// - "choice": a plain multiple-choice question
// - "scenario": a real-world situation; pick what to say or do
// - "listening": `audio` is played and the learner picks what they heard
export type PickQuestion = QuestionBase & {
  type: "choice" | "scenario" | "listening";
  korean?: string; // Korean shown with the prompt (tap to hear it)
  audio?: string; // Korean to play out loud (needed for "listening")
  options: string[];
  answer: string; // must match one option exactly
};

// Match each Korean word to its meaning. Every pair must be right.
export type MatchQuestion = QuestionBase & {
  type: "match";
  pairs: { korean: string; english: string }[];
};

// Put the Korean words in order to make the sentence in `english`.
export type OrderQuestion = QuestionBase & {
  type: "order";
  english: string; // the sentence to build
  words: string[]; // the words, in the right order
  extra?: string[]; // extra words that don't belong (to make it harder)
  accepted?: string[][]; // other orders that are also right
};

export type ChallengeQuestion = PickQuestion | MatchQuestion | OrderQuestion;

// One topic (one unit's worth of skills).
export type SkillTopic = {
  id: string; // e.g. "greetings"
  unitId: string; // the unit in data/lessons.ts this topic covers
  title: string;
  icon: string;
  description: string;
  skills: Record<string, string>; // skill key → name shown to learners
  questions: ChallengeQuestion[];
};

// ---------- All topics ----------
export const skillTopics: SkillTopic[] = [hangeulChecks, greetingsChecks, foodChecks];

export const findTopic = (topicId: string) => skillTopics.find((topic) => topic.id === topicId);

export const topicForUnit = (unitId: string) => skillTopics.find((topic) => topic.unitId === unitId);

// The topic and questions for one lesson.
export function lessonChallenge(lessonId: string) {
  for (const topic of skillTopics) {
    const questions = topic.questions.filter((question) => question.lessonId === lessonId);
    if (questions.length > 0) return { topic, questions };
  }
  return undefined;
}

// Lessons need enough questions so one lucky guess can't pass.
export const canTestOut = (lessonId: string) =>
  (lessonChallenge(lessonId)?.questions.length ?? 0) >= CHALLENGE_CONFIG.minQuestions;
