/*
  Merging this browser's progress with the account's: nothing finished
  anywhere should ever be lost.
*/

import { describe, expect, it } from "vitest";
import { mergeSavedData } from "./mergeProgress";

const lessons = (data: Record<string, boolean>) => JSON.stringify(data);

describe("mergeSavedData", () => {
  it("keeps lessons finished on either side (two devices)", () => {
    const deviceA = { koreaGoLessonProgress: lessons({ "hangeul-1": true }) };
    const account = { koreaGoLessonProgress: lessons({ "hangeul-1": true, "hangeul-2": true }) };
    const merged = mergeSavedData(deviceA, account, "local");
    expect(JSON.parse(merged.koreaGoLessonProgress)).toEqual({ "hangeul-1": true, "hangeul-2": true });
  });

  it("keeps a guest's progress when they log into an existing account", () => {
    const guest = { koreaGoLessonProgress: lessons({ "greetings-1": true }) };
    const account = { koreaGoLessonProgress: lessons({ "hangeul-1": true }), koreaGoLevel: "Beginner" };
    const merged = mergeSavedData(guest, account, "remote");
    expect(JSON.parse(merged.koreaGoLessonProgress)).toEqual({ "greetings-1": true, "hangeul-1": true });
    expect(merged.koreaGoLevel).toBe("Beginner");
  });

  it("lets the preferred side win for settings", () => {
    const local = { koreaGoLevel: "Advanced" };
    const remote = { koreaGoLevel: "Beginner" };
    expect(mergeSavedData(local, remote, "local").koreaGoLevel).toBe("Advanced");
    expect(mergeSavedData(local, remote, "remote").koreaGoLevel).toBe("Beginner");
  });

  it("keeps the higher study time for each day", () => {
    const local = { koreaGoStudyTime: JSON.stringify({ "2026-11-04": 300, "2026-11-05": 60 }) };
    const remote = { koreaGoStudyTime: JSON.stringify({ "2026-11-05": 600 }) };
    const merged = JSON.parse(mergeSavedData(local, remote, "local").koreaGoStudyTime);
    expect(merged).toEqual({ "2026-11-04": 300, "2026-11-05": 600 });
  });

  it("combines game results without duplicates", () => {
    const one = { game: "culture", setId: "food", playedAt: "2026-11-01T10:00:00Z", points: 500 };
    const two = { game: "culture", setId: "music", playedAt: "2026-11-02T10:00:00Z", points: 400 };
    const local = { koreaGoGameResults: JSON.stringify([one]) };
    const remote = { koreaGoGameResults: JSON.stringify([one, two]) };
    expect(JSON.parse(mergeSavedData(local, remote, "local").koreaGoGameResults)).toEqual([one, two]);
  });

  it("keeps the newest skill check record but the best score from both", () => {
    const local = {
      koreaGoSkillProgress: JSON.stringify({
        topics: { food: { lastAt: "2026-11-05", bestPercent: 60, lastPercent: 60, everPassed: false, attempts: 2 } },
        lessons: {},
        canSkip: {},
        skipped: { "food-1": "2026-11-05" },
      }),
    };
    const remote = {
      koreaGoSkillProgress: JSON.stringify({
        topics: { food: { lastAt: "2026-11-01", bestPercent: 90, lastPercent: 90, everPassed: true, attempts: 1 } },
        lessons: {},
        canSkip: { "food-2": "2026-11-01" },
        skipped: {},
      }),
    };
    const merged = JSON.parse(mergeSavedData(local, remote, "local").koreaGoSkillProgress);
    expect(merged.topics.food.lastPercent).toBe(60); // newest attempt
    expect(merged.topics.food.bestPercent).toBe(90); // best of both
    expect(merged.topics.food.everPassed).toBe(true);
    expect(merged.skipped).toEqual({ "food-1": "2026-11-05" });
    expect(merged.canSkip).toEqual({ "food-2": "2026-11-01" });
  });

  it("survives broken saved data", () => {
    const merged = mergeSavedData({ koreaGoLessonProgress: "not json" }, { koreaGoLessonProgress: lessons({ a: true }) }, "local");
    expect(JSON.parse(merged.koreaGoLessonProgress)).toEqual({ a: true });
  });
});
