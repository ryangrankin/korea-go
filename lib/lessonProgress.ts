import { useMemo, useSyncExternalStore } from "react";

export type LessonProgress = Record<string, boolean>;

export const STORAGE_KEY = "koreaGoLessonProgress";
export const PROGRESS_EVENT = "koreaGoLessonProgress";

export function getLessonProgress(): LessonProgress {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

export function completeLesson(lessonId: string) {
  const progress = getLessonProgress();
  progress[lessonId] = true;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(progress)
  );

  // Let open pages (like the pup) know a lesson was finished.
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getLessonProgress();
  return progress[lessonId] === true;
}

function readRaw(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

function subscribe(onChange: () => void) {
  const events = ["storage", PROGRESS_EVENT];
  events.forEach((name) => window.addEventListener(name, onChange));
  return () => events.forEach((name) => window.removeEventListener(name, onChange));
}

// Finished lessons, updating by itself when one is finished.
// (Empty during the server render.)
export function useLessonProgress(): LessonProgress {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as LessonProgress) : {};
    } catch {
      return {};
    }
  }, [raw]);
}
