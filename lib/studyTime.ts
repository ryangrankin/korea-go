/*
  STUDY TIME
  Counts the minutes spent in lessons each day, for the Daily Study Goal
  in Settings. Saved under "koreaGoStudyTime" (so it follows the learner's
  account like the rest of their progress), as { "2026-11-02": seconds }.
  Only the last 30 days are kept.
*/

import { useEffect, useSyncExternalStore } from "react";
import { saveProgressSoon } from "./accountSync";

const KEY = "koreaGoStudyTime";
const CHANGE_EVENT = "koreaGoStudyTime";
const TICK_SECONDS = 15;
const KEEP_DAYS = 30;

// Today's date in the learner's own time zone, like "2026-11-02".
const todayKey = () => new Date().toLocaleDateString("en-CA");

function readAll(): Record<string, number> {
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function addSeconds(seconds: number) {
  try {
    const all = readAll();
    const today = todayKey();
    all[today] = (all[today] ?? 0) + seconds;
    // Keep only the most recent days.
    const recent = Object.keys(all).sort().slice(-KEEP_DAYS);
    const trimmed = Object.fromEntries(recent.map((day) => [day, all[day]]));
    localStorage.setItem(KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    saveProgressSoon();
  } catch {
    // Tracking time is a nice extra; lessons work without it.
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

const todaySeconds = () => readAll()[todayKey()] ?? 0;

// Seconds studied today. (0 during the server render.)
export function useStudySecondsToday(): number {
  return useSyncExternalStore(subscribe, todaySeconds, () => 0);
}

// While a lesson is open and on screen, count the time spent in it.
export function useStudyTimer(active = true) {
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") addSeconds(TICK_SECONDS);
    }, TICK_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [active]);
}
