/*
  PREFERENCES
  Reads the learner's settings (saved by the Settings page under
  "koreaGoPreferences", and the level under "koreaGoLevel"), so any page
  can follow them. lib/learningSettings.ts turns them into how lessons work.
*/

import { useSyncExternalStore } from "react";

export type Level = "Beginner" | "Intermediate" | "Advanced";
export type Goal =
  | "Everyday conversation"
  | "Travel and navigation"
  | "Academic learning"
  | "Culture and media";
export type Focus = "Mixed practice" | "Vocabulary" | "Grammar" | "Conversation" | "Listening";

export type Preferences = {
  level: Level;
  goal: Goal;
  romanization: boolean;
  practiceFocus: Focus;
  dailyMinutes: number;
};

export const DEFAULT_PREFERENCES: Preferences = {
  level: "Beginner",
  goal: "Everyday conversation",
  romanization: true,
  practiceFocus: "Mixed practice",
  dailyMinutes: 10,
};

const PREFERENCES_KEY = "koreaGoPreferences";
const LEVEL_KEY = "koreaGoLevel";

const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];
const GOALS: Goal[] = ["Everyday conversation", "Travel and navigation", "Academic learning", "Culture and media"];
const FOCUSES: Focus[] = ["Mixed practice", "Vocabulary", "Grammar", "Conversation", "Listening"];

// Turn what's saved into preferences, falling back to defaults for anything
// missing or unknown (so an old or edited value can't break a lesson).
export function parsePreferences(savedJson: string | null, savedLevel: string | null): Preferences {
  let saved: Record<string, unknown> = {};
  try {
    saved = savedJson ? JSON.parse(savedJson) : {};
  } catch {
    saved = {};
  }
  const pick = <T extends string>(value: unknown, options: T[], fallback: T): T =>
    options.includes(value as T) ? (value as T) : fallback;
  const minutes = Number(saved.dailyMinutes);

  return {
    level: pick(savedLevel || saved.level, LEVELS, DEFAULT_PREFERENCES.level),
    goal: pick(saved.goal, GOALS, DEFAULT_PREFERENCES.goal),
    romanization: saved.romanization !== false,
    practiceFocus: pick(saved.practiceFocus, FOCUSES, DEFAULT_PREFERENCES.practiceFocus),
    dailyMinutes: minutes > 0 ? minutes : DEFAULT_PREFERENCES.dailyMinutes,
  };
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

// One string for both keys, so React can tell when either changes.
const snapshot = () => `${read(LEVEL_KEY)}\n${read(PREFERENCES_KEY)}`;

// The learner's preferences. Defaults during the server render.
export function usePreferences(): Preferences {
  const snap = useSyncExternalStore(subscribe, snapshot, () => "");
  const newline = snap.indexOf("\n");
  if (newline < 0) return DEFAULT_PREFERENCES;
  return parsePreferences(snap.slice(newline + 1) || null, snap.slice(0, newline) || null);
}

// true unless the learner turned romanization off in Settings.
export function useShowRomanization(): boolean {
  return usePreferences().romanization;
}
