/*
  LEARNING SETTINGS
  Turns the learner's preferences (Settings page) into how lessons work.
  Everything here is a plain function, so it's easy to test and to tweak.

  - Korean Proficiency → how word practice runs (how many new words at a
    time, how many right answers each word needs, how many answer choices,
    which kind of question comes first). Advanced also hides the English in
    conversations until tapped.
  - Learning Goal → what to practice first in a lesson, which unit comes
    next on the dashboard, and which mini game is suggested after a lesson.
  - Practice Focus → extra practice for the chosen skill.
  - Daily Study Goal → minutes per day (tracked in lib/studyTime.ts).
  - Show Romanization → romanization on or off everywhere.
*/

import type { Focus, Goal, Level, Preferences } from "./preferences";

export type QuizKind = "meaning" | "korean" | "listen";

// How word practice runs (see components/lesson/WordPractice.tsx).
export type PracticeSettings = {
  newAtOnce: number; // new words being learned at the same time
  correctToLearn: number; // right answers needed to learn a new word
  repeatsAfterMiss: number; // right answers needed again after a miss
  optionCount: number; // answer choices per question
  quizOrder: QuizKind[]; // kinds of question, in the order a word sees them
};

export type LessonSettings = {
  showRomanization: boolean;
  practice: PracticeSettings;
  notesFirst: boolean; // grammar notes before the words
  phrasesFirst: boolean; // practice phrases before single words
  hideEnglish: boolean; // conversation English hidden until tapped
  dailyMinutes: number;
};

// ---------- Proficiency ----------
const LEVEL_PRACTICE: Record<Level, PracticeSettings> = {
  Beginner: {
    newAtOnce: 3,
    correctToLearn: 2,
    repeatsAfterMiss: 3,
    optionCount: 3,
    quizOrder: ["meaning", "korean", "listen"], // recognize first, then recall
  },
  Intermediate: {
    newAtOnce: 4,
    correctToLearn: 2,
    repeatsAfterMiss: 2,
    optionCount: 4,
    quizOrder: ["korean", "listen", "meaning"], // recall first
  },
  Advanced: {
    newAtOnce: 5,
    correctToLearn: 1,
    repeatsAfterMiss: 2,
    optionCount: 4,
    quizOrder: ["listen", "korean", "meaning"], // listening first
  },
};

// ---------- Practice focus ----------
function applyFocus(practice: PracticeSettings, focus: Focus): PracticeSettings {
  if (focus === "Vocabulary") {
    return { ...practice, correctToLearn: practice.correctToLearn + 1 };
  }
  if (focus === "Listening") {
    // Every other question is a listening one.
    const others = practice.quizOrder.filter((kind) => kind !== "listen");
    return { ...practice, quizOrder: others.flatMap((kind) => ["listen", kind] as QuizKind[]) };
  }
  return practice;
}

export function lessonSettings(preferences: Preferences): LessonSettings {
  const { level, goal, practiceFocus: focus } = preferences;
  return {
    showRomanization: preferences.romanization,
    practice: applyFocus(LEVEL_PRACTICE[level], focus),
    notesFirst: focus === "Grammar" || goal === "Academic learning",
    phrasesFirst: focus === "Conversation" || goal === "Everyday conversation",
    hideEnglish: focus === "Listening" || level === "Advanced",
    dailyMinutes: preferences.dailyMinutes,
  };
}

// Short description of what's on, shown at the top of each lesson.
export function settingsSummary(preferences: Preferences): string {
  const parts: string[] = [preferences.level];
  if (preferences.practiceFocus !== "Mixed practice") parts.push(`${preferences.practiceFocus} focus`);
  parts.push(goalLabel(preferences.goal));
  return parts.join(" · ");
}

// ---------- Learning goal ----------
const GOAL_LABELS: Record<Goal, string> = {
  "Everyday conversation": "Conversation goal",
  "Travel and navigation": "Travel goal",
  "Academic learning": "Study goal",
  "Culture and media": "Culture goal",
};

export const goalLabel = (goal: Goal) => GOAL_LABELS[goal];

// After the basics (Hangeul, Greetings), which units come next for each goal.
// Units not listed keep their usual order after these.
const GOAL_UNIT_ORDER: Record<Goal, string[]> = {
  "Everyday conversation": ["hangeul", "greetings", "food", "airport"],
  "Travel and navigation": ["hangeul", "greetings", "airport", "food"],
  "Academic learning": ["hangeul", "greetings", "airport", "food"],
  "Culture and media": ["hangeul", "greetings", "food", "airport"],
};

// Lessons in the order the dashboard should suggest them ("Up next").
// Lessons inside a unit always stay in order.
export function lessonsInGoalOrder<L extends { id: string }>(
  units: { id: string; lessons: L[] }[],
  goal: Goal
): L[] {
  const preferred = GOAL_UNIT_ORDER[goal];
  const rank = (unitId: string) => {
    const i = preferred.indexOf(unitId);
    return i === -1 ? preferred.length : i;
  };
  return [...units]
    .map((unit, index) => ({ unit, index }))
    .sort((a, b) => rank(a.unit.id) - rank(b.unit.id) || a.index - b.index)
    .flatMap(({ unit }) => unit.lessons);
}

// A mini game or check that fits the goal, suggested after a lesson.
const GOAL_SUGGESTIONS: Record<Goal, { href: string; label: string; why: string }> = {
  "Everyday conversation": {
    href: "/games/etiquette",
    label: "Korean Manners & Etiquette",
    why: "Practice what to say and do in everyday situations.",
  },
  "Travel and navigation": {
    href: "/games/seoul",
    label: "A Day in Seoul",
    why: "Build the sentences you'll need on a real day out in Seoul.",
  },
  "Academic learning": {
    href: "/skill-checks",
    label: "Skill checks",
    why: "Test yourself on a whole unit and see your progress by skill.",
  },
  "Culture and media": {
    href: "/games/music",
    label: "K-Pop & Korean Music",
    why: "Learn music words and explore K-pop, trot, pansori, and more.",
  },
};

export const goalSuggestion = (goal: Goal) => GOAL_SUGGESTIONS[goal];

// Practice phrases first if the settings ask for it (otherwise words first).
export function orderForPractice<T extends { group: string }>(items: T[], phrasesFirst: boolean): T[] {
  if (!phrasesFirst) return items;
  return [...items.filter((item) => item.group === "phrases"), ...items.filter((item) => item.group !== "phrases")];
}
