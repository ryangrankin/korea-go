/*
  Learning goals point at real lessons, and every lesson has some.
*/

import { describe, expect, it } from "vitest";
import { lessons, units } from "./lessons";
import { lessonObjectives, unitCanDos, unitGoals } from "./objectives";

describe("learning goals", () => {
  it("every lesson has 1–3 goals", () => {
    for (const lesson of lessons) {
      const goals = lessonObjectives[lesson.id];
      expect(goals, lesson.id).toBeDefined();
      expect(goals.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(goals.length, lesson.id).toBeLessThanOrEqual(3);
    }
  });

  it("goals only name lessons that exist", () => {
    const ids = new Set(lessons.map((lesson) => lesson.id));
    for (const id of Object.keys(lessonObjectives)) expect(ids.has(id), id).toBe(true);
    for (const goal of Object.values(unitGoals)) {
      for (const item of goal.canDo) for (const id of item.lessons) expect(ids.has(id), id).toBe(true);
    }
  });

  it("every unit with lessons has a travel skill", () => {
    for (const unit of units.filter((u) => u.lessons.length > 0)) expect(unitGoals[unit.id], unit.id).toBeDefined();
  });

  it("a can-do is ticked only when all its lessons are done", () => {
    const done = new Set(["food-2"]);
    const items = unitCanDos("food", (id) => done.has(id));
    expect(items.find((item) => item.text.startsWith("Ask what's good"))?.done).toBe(false);
    done.add("food-3");
    expect(unitCanDos("food", (id) => done.has(id)).find((item) => item.text.startsWith("Ask what's good"))?.done).toBe(true);
  });
});
