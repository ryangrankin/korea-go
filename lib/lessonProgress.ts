
export type LessonProgress = Record<string, boolean>;

const STORAGE_KEY = "koreaGoLessonProgress";

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
}

export function isLessonComplete(lessonId: string): boolean {
  const progress = getLessonProgress();
  return progress[lessonId] === true;
}
