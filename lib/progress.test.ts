/*
  Progress numbers: lesson bars, course progress, and the study streak.
*/

import { describe, expect, it } from "vitest";
import { courseProgress, lessonPercent, progressPercent, studyPartShare, studyStreak } from "./progress";

describe("progressPercent", () => {
  it("is a whole number from 0 to 100", () => {
    expect(progressPercent(1, 3)).toBe(33);
    expect(progressPercent(3, 3)).toBe(100);
    expect(progressPercent(5, 3)).toBe(100);
    expect(progressPercent(-1, 3)).toBe(0);
  });

  it("is 0 (not NaN) when there's nothing to count", () => {
    expect(progressPercent(0, 0)).toBe(0);
    expect(progressPercent(NaN, 4)).toBe(0);
  });
});

describe("courseProgress", () => {
  const ids = ["a", "b", "c", "d"];

  it("counts completed and skipped lessons separately", () => {
    const result = courseProgress(ids, { a: true }, { b: "2026-11-01" });
    expect(result).toEqual({ completed: 1, skipped: 1, done: 2, total: 4, percent: 50 });
  });

  it("counts a lesson once even if it was skipped and then completed", () => {
    const result = courseProgress(ids, { a: true }, { a: "2026-11-01" });
    expect(result.done).toBe(1);
    expect(result.skipped).toBe(0);
  });

  it("ignores progress for lessons that aren't in the course, and duplicate ids", () => {
    const result = courseProgress([...ids, "a"], { a: true, zzz: true }, {});
    expect(result.total).toBe(4);
    expect(result.done).toBe(1);
  });

  it("only counts lessons marked true", () => {
    expect(courseProgress(ids, { a: false } as Record<string, boolean>, {}).done).toBe(0);
  });
});

describe("lesson progress", () => {
  it("averages each part, with finished parts counting fully", () => {
    expect(lessonPercent([1, 0.5, 0])).toBe(50);
    expect(lessonPercent([1, 1])).toBe(100);
    expect(lessonPercent([])).toBe(0);
  });

  it("never goes past 100% or below 0%", () => {
    expect(lessonPercent([2, 1])).toBe(100);
    expect(lessonPercent([-1, 0])).toBe(0);
  });

  it("a study part counts steps passed plus missions finished", () => {
    // 4 steps (conversation, words, grammar, missions); on missions with 2 of 4 done
    expect(studyPartShare(3, 4, 2, 4)).toBeCloseTo(0.875);
    expect(studyPartShare(0, 4)).toBe(0);
    expect(studyPartShare(3, 4, 4, 4)).toBe(1);
  });
});

describe("studyStreak", () => {
  it("counts days in a row ending today", () => {
    const days = { "2026-11-03": 120, "2026-11-04": 300, "2026-11-05": 90 };
    expect(studyStreak(days, "2026-11-05")).toBe(3);
  });

  it("keeps yesterday's streak alive until today is studied", () => {
    const days = { "2026-11-03": 120, "2026-11-04": 300 };
    expect(studyStreak(days, "2026-11-05")).toBe(2);
  });

  it("breaks on a missed day, and ignores days under a minute", () => {
    expect(studyStreak({ "2026-11-02": 600, "2026-11-04": 600, "2026-11-05": 600 }, "2026-11-05")).toBe(2);
    expect(studyStreak({ "2026-11-05": 30 }, "2026-11-05")).toBe(0);
    expect(studyStreak({}, "2026-11-05")).toBe(0);
  });

  it("works across a month boundary", () => {
    expect(studyStreak({ "2026-10-31": 100, "2026-11-01": 100 }, "2026-11-01")).toBe(2);
  });
});
