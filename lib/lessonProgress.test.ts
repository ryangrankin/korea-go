/*
  Finishing a lesson is saved, survives a "refresh" (re-reading storage),
  and finishing it again doesn't change anything.
*/

import { beforeEach, describe, expect, it, vi } from "vitest";

// A tiny browser stand-in: localStorage and window events.
const store = new Map<string, string>();
vi.stubGlobal("localStorage", {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => void store.set(key, String(value)),
  removeItem: (key: string) => void store.delete(key),
  key: (i: number) => [...store.keys()][i] ?? null,
  get length() {
    return store.size;
  },
});
vi.stubGlobal("window", { dispatchEvent: () => true, addEventListener: () => {}, removeEventListener: () => {} });
vi.mock("./accountSync", () => ({ saveProgressSoon: () => {} }));

const { completeLesson, getLessonProgress, isLessonComplete } = await import("./lessonProgress");

describe("lesson completion", () => {
  beforeEach(() => store.clear());

  it("is saved and read back after a refresh", () => {
    completeLesson("greetings-1");
    expect(isLessonComplete("greetings-1")).toBe(true);
    expect(JSON.parse(store.get("koreaGoLessonProgress")!)).toEqual({ "greetings-1": true });
  });

  it("finishing the same lesson again changes nothing", () => {
    completeLesson("greetings-1");
    const before = store.get("koreaGoLessonProgress");
    completeLesson("greetings-1");
    expect(store.get("koreaGoLessonProgress")).toBe(before);
  });

  it("keeps earlier lessons when a new one is finished", () => {
    completeLesson("hangeul-1");
    completeLesson("hangeul-2");
    expect(getLessonProgress()).toEqual({ "hangeul-1": true, "hangeul-2": true });
  });
});
