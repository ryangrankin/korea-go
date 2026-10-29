/*
  SKILL PROGRESS
  Saves skill check and test-out results, and which lessons the learner
  chose to skip. This is kept apart from lesson completion
  (lib/lessonProgress.ts): passing a challenge never marks a lesson as
  completed, and a skipped lesson can be opened again at any time.

  TEMPORARY STORAGE: like the rest of the app, this saves to the browser
  on this device only (localStorage). Clearing the browser, or switching
  device, starts over. When accounts are added, this is the one file to
  change: save in `save` and load in `read` from the server instead. The
  update functions below (withTopicCheck, withTestOut, ...) work on plain
  data, so they can stay the same.
*/

import { useMemo, useSyncExternalStore } from "react";
import { saveProgressSoon } from "./accountSync";
import type { ChallengeResult, Tally } from "./skillChecks";
import { lessonsShown } from "./skillChecks";

export type CheckRecord = {
  attempts: number;
  bestPercent: number;
  lastPercent: number;
  lastPassed: boolean;
  everPassed: boolean;
  lastAt: string; // ISO date
  skills: Record<string, Tally>; // from the latest attempt
};

export type SkillProgress = {
  topics: Record<string, CheckRecord>; // skill checks, by topic id
  lessons: Record<string, CheckRecord>; // test-outs, by lesson id
  canSkip: Record<string, string>; // lesson id → when the learner earned the right to skip it
  skipped: Record<string, string>; // lesson id → when the learner chose to skip it
};

export const SKILL_PROGRESS_KEY = "koreaGoSkillProgress";
export const SKILL_PROGRESS_EVENT = "koreaGoSkillProgress";

export const emptyProgress = (): SkillProgress => ({ topics: {}, lessons: {}, canSkip: {}, skipped: {} });

// ---------- Updates (plain data in, new data out) ----------
function withAttempt(previous: CheckRecord | undefined, result: ChallengeResult, at: string): CheckRecord {
  return {
    attempts: (previous?.attempts ?? 0) + 1,
    bestPercent: Math.max(previous?.bestPercent ?? 0, result.percent),
    lastPercent: result.percent,
    lastPassed: result.passed,
    everPassed: (previous?.everPassed ?? false) || result.passed,
    lastAt: at,
    skills: result.skills,
  };
}

// Earning the right to skip is kept, even if a later try goes worse.
function withCanSkip(canSkip: Record<string, string>, lessonIds: string[], at: string) {
  const next = { ...canSkip };
  for (const id of lessonIds) next[id] ??= at;
  return next;
}

// A topic skill check. Lessons the learner aced become skippable.
export function withTopicCheck(
  state: SkillProgress,
  topicId: string,
  result: ChallengeResult,
  at: string = new Date().toISOString()
): SkillProgress {
  return {
    ...state,
    topics: { ...state.topics, [topicId]: withAttempt(state.topics[topicId], result, at) },
    canSkip: withCanSkip(state.canSkip, lessonsShown(result), at),
  };
}

// Testing out of one lesson.
export function withTestOut(
  state: SkillProgress,
  lessonId: string,
  result: ChallengeResult,
  at: string = new Date().toISOString()
): SkillProgress {
  return {
    ...state,
    lessons: { ...state.lessons, [lessonId]: withAttempt(state.lessons[lessonId], result, at) },
    canSkip: withCanSkip(state.canSkip, result.passed ? [lessonId] : [], at),
  };
}

// Skip lessons the learner has earned. Others are left alone.
export function withSkipped(state: SkillProgress, lessonIds: string[], at: string = new Date().toISOString()) {
  const skipped = { ...state.skipped };
  for (const id of lessonIds) {
    if (state.canSkip[id]) skipped[id] ??= at;
  }
  return { ...state, skipped };
}

// Put a skipped lesson back on the learner's path.
export function withoutSkipped(state: SkillProgress, lessonId: string): SkillProgress {
  const skipped = { ...state.skipped };
  delete skipped[lessonId];
  return { ...state, skipped };
}

// ---------- Reading and saving (this device only, for now) ----------
function readRaw(): string {
  try {
    return localStorage.getItem(SKILL_PROGRESS_KEY) ?? "";
  } catch {
    return "";
  }
}

// Bad or old saved data falls back to empty parts instead of breaking.
export function parseProgress(raw: string): SkillProgress {
  const empty = emptyProgress();
  try {
    const saved = raw ? JSON.parse(raw) : {};
    const part = (value: unknown) =>
      value && typeof value === "object" && !Array.isArray(value) ? value : {};
    return {
      topics: part(saved.topics) as SkillProgress["topics"],
      lessons: part(saved.lessons) as SkillProgress["lessons"],
      canSkip: part(saved.canSkip) as SkillProgress["canSkip"],
      skipped: part(saved.skipped) as SkillProgress["skipped"],
    };
  } catch {
    return empty;
  }
}

export function readSkillProgress(): SkillProgress {
  return parseProgress(readRaw());
}

function save(state: SkillProgress) {
  try {
    localStorage.setItem(SKILL_PROGRESS_KEY, JSON.stringify(state));
  } catch {
    // Private browsing can block saving; the results still show this visit.
  }
  window.dispatchEvent(new Event(SKILL_PROGRESS_EVENT));
  saveProgressSoon();
}

// Each of these reads the latest saved data first, so two open tabs
// can't overwrite each other's results with old data.
export const recordTopicCheck = (topicId: string, result: ChallengeResult) =>
  save(withTopicCheck(readSkillProgress(), topicId, result));

export const recordTestOut = (lessonId: string, result: ChallengeResult) =>
  save(withTestOut(readSkillProgress(), lessonId, result));

export const skipLessons = (lessonIds: string[]) => save(withSkipped(readSkillProgress(), lessonIds));

export const unskipLesson = (lessonId: string) => save(withoutSkipped(readSkillProgress(), lessonId));

function subscribe(onChange: () => void) {
  const events = ["storage", SKILL_PROGRESS_EVENT];
  events.forEach((name) => window.addEventListener(name, onChange));
  return () => events.forEach((name) => window.removeEventListener(name, onChange));
}

// The learner's skill progress. Updates by itself when it changes.
// (Empty during the server render.)
export function useSkillProgress(): SkillProgress {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return useMemo(() => parseProgress(raw), [raw]);
}
