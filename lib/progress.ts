/*
  PROGRESS MATH
  Plain functions for every progress number the app shows, so they can be
  tested (lib/progress.test.ts) and stay consistent across screens.

  - Lesson progress: how far through ONE lesson the learner is.
  - Course progress: how many lessons in the WHOLE course are done.
  These are kept separate on purpose and labeled differently on screen.
*/

// A safe percentage: 0–100, whole number, and 0 when there's nothing to count.
export function progressPercent(done: number, total: number): number {
  if (!Number.isFinite(done) || !Number.isFinite(total) || total <= 0) return 0;
  return Math.round(Math.min(100, Math.max(0, (done / total) * 100)));
}

// ---------- Course progress (dashboard) ----------
export type CourseProgress = {
  completed: number; // finished by doing the lesson
  skipped: number; // skipped after passing a test-out or skill check
  done: number; // completed + skipped
  total: number;
  percent: number;
};

// A lesson counts once, even if it was both skipped and later completed.
export function courseProgress(
  lessonIds: string[],
  completed: Record<string, boolean>,
  skipped: Record<string, unknown>
): CourseProgress {
  const ids = [...new Set(lessonIds)];
  const isCompleted = (id: string) => completed[id] === true;
  const isSkipped = (id: string) => !isCompleted(id) && Boolean(skipped[id]);
  const completedCount = ids.filter(isCompleted).length;
  const skippedCount = ids.filter(isSkipped).length;
  const done = completedCount + skippedCount;
  return {
    completed: completedCount,
    skipped: skippedCount,
    done,
    total: ids.length,
    percent: progressPercent(done, ids.length),
  };
}

// ---------- Lesson progress (inside a lesson) ----------
// A lesson is made of parts (its tabs: study sections, game, review).
// Each part reports how much of it is done, from 0 to 1. Finished parts
// count as 1. The lesson's progress is the average.
export function lessonPercent(partShares: number[]): number {
  if (partShares.length === 0) return 0;
  const sum = partShares.reduce((total, share) => total + Math.min(1, Math.max(0, share || 0)), 0);
  return progressPercent(sum, partShares.length);
}

// How much of a study part is done: steps fully passed, plus how far
// through the missions the learner is when they're on the missions step.
export function studyPartShare(stepsReached: number, totalSteps: number, missionsDone = 0, totalMissions = 0): number {
  if (totalSteps <= 0) return 0;
  const missionShare = totalMissions > 0 ? Math.min(1, missionsDone / totalMissions) : 0;
  return Math.min(1, (Math.max(0, stepsReached) + missionShare) / totalSteps);
}

// ---------- Study streak (dashboard) ----------
// Days in a row (ending today, or yesterday if today hasn't started yet)
// with at least `minSeconds` of study. Days are "YYYY-MM-DD" keys.
export function studyStreak(secondsByDay: Record<string, number>, today: string, minSeconds = 60): number {
  const studied = (day: string) => (secondsByDay[day] ?? 0) >= minSeconds;
  const day = new Date(`${today}T12:00:00`);
  if (!studied(today)) day.setDate(day.getDate() - 1); // today can still count later
  let streak = 0;
  while (studied(day.toLocaleDateString("en-CA"))) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return streak;
}
