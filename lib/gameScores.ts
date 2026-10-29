/*
  GAME SCORES
  Saves mini game results on this device and works out points, this
  week's total, and best times. The games and the Friends tab both read
  from here.

  When accounts are added, this is the one file to change: save results
  to the server in recordGameResult, and load them in useGameStats.
*/

import { useSyncExternalStore } from "react";
import { saveProgressSoon } from "./accountSync";

export type GameResult = {
  game: string; // e.g. "hangeul-match"
  setId: string; // which set was played, e.g. "hangeul-1"
  pairs: number;
  mistakes: number;
  seconds: number;
  points: number;
  playedAt: string; // ISO date
};

export type GameStats = {
  weeklyPoints: number; // points earned since Monday
  totalPoints: number;
  gamesPlayed: number;
  bestTimes: Record<string, number>; // setId → fastest time in seconds
  timesPlayed: Record<string, number>; // setId → how many times it was finished
};

const RESULTS_KEY = "koreaGoGameResults";
const LEGACY_BEST_KEY = "koreaGoMatchBest"; // best times saved before points existed
const CHANGE_EVENT = "koreaGoGameResults";
const MAX_SAVED = 300; // keep the most recent results only

// ---------- Points ----------
// 100 per pair, minus 25 per mistake, plus 10 for every second faster
// than 4 seconds a pair. Every finished game earns at least 10.
export function gamePoints({ pairs, mistakes, seconds }: { pairs: number; mistakes: number; seconds: number }) {
  const speedBonus = Math.max(0, pairs * 4 - seconds) * 10;
  return Math.max(10, pairs * 100 - mistakes * 25 + speedBonus);
}

// Monday 00:00 of this week, in local time.
export function startOfWeek(date: Date = new Date()): Date {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return start;
}

// ---------- Reading and saving ----------
function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

// A snapshot of what's saved, as one string, so React can tell when it changes.
function snapshot(): string {
  return `${read(RESULTS_KEY) ?? ""}\n${read(LEGACY_BEST_KEY) ?? ""}`;
}

const NO_STATS: GameStats = { weeklyPoints: 0, totalPoints: 0, gamesPlayed: 0, bestTimes: {}, timesPlayed: {} };

function statsFrom(snap: string | null): GameStats {
  // No snapshot during the server render: nothing saved to read yet.
  if (snap === null) return NO_STATS;
  const [resultsRaw, legacyRaw] = snap.split("\n");
  const results = parse<GameResult[]>(resultsRaw || null, []);
  const bestTimes = { ...parse<Record<string, number>>(legacyRaw || null, {}) };
  const weekStart = startOfWeek().getTime();

  let weeklyPoints = 0;
  let totalPoints = 0;
  const timesPlayed: Record<string, number> = {};
  for (const result of results) {
    timesPlayed[result.setId] = (timesPlayed[result.setId] ?? 0) + 1;
    totalPoints += result.points;
    if (new Date(result.playedAt).getTime() >= weekStart) weeklyPoints += result.points;
    const best = bestTimes[result.setId];
    if (best === undefined || result.seconds < best) bestTimes[result.setId] = result.seconds;
  }

  return { weeklyPoints, totalPoints, gamesPlayed: results.length, bestTimes, timesPlayed };
}

// Your game stats. Updates by itself when a new result is saved.
// (Empty during the server render, since scores live in the browser.)
export function useGameStats(): GameStats {
  return statsFrom(useSyncExternalStore(subscribe, snapshot, () => null));
}

// Save a finished game. Returns the saved result, with its points.
// Games can pass their own `points`; otherwise gamePoints() works them out.
export function recordGameResult(
  game: Omit<GameResult, "points" | "playedAt"> & { points?: number }
): GameResult {
  const result: GameResult = {
    ...game,
    points: game.points ?? gamePoints(game),
    playedAt: new Date().toISOString(),
  };
  try {
    const results = parse<GameResult[]>(read(RESULTS_KEY), []);
    localStorage.setItem(RESULTS_KEY, JSON.stringify([...results, result].slice(-MAX_SAVED)));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    saveProgressSoon();
  } catch {
    // Saving is a nice extra; the game works without it.
  }
  return result;
}

export const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
