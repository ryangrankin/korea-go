/*
  Checks that the Settings page choices really change how lessons work.
*/

import { describe, expect, it } from "vitest";
import { goalSuggestion, lessonSettings, lessonsInGoalOrder, orderForPractice, settingsSummary } from "./learningSettings";
import { DEFAULT_PREFERENCES, parsePreferences, type Preferences } from "./preferences";

const prefs = (changes: Partial<Preferences>): Preferences => ({ ...DEFAULT_PREFERENCES, ...changes });

describe("proficiency level", () => {
  it("beginners learn fewer words at a time, with fewer choices, recognition first", () => {
    const { practice, hideEnglish } = lessonSettings(prefs({ level: "Beginner" }));
    expect(practice.newAtOnce).toBe(3);
    expect(practice.optionCount).toBe(3);
    expect(practice.quizOrder[0]).toBe("meaning");
    expect(hideEnglish).toBe(false);
  });

  it("advanced learners move faster, start with listening, and hide conversation English", () => {
    const { practice, hideEnglish } = lessonSettings(prefs({ level: "Advanced" }));
    expect(practice.newAtOnce).toBeGreaterThan(3);
    expect(practice.correctToLearn).toBe(1);
    expect(practice.optionCount).toBe(4);
    expect(practice.quizOrder[0]).toBe("listen");
    expect(hideEnglish).toBe(true);
  });

  it("intermediate sits in between", () => {
    const { practice } = lessonSettings(prefs({ level: "Intermediate" }));
    expect(practice.newAtOnce).toBe(4);
    expect(practice.quizOrder[0]).toBe("korean");
  });
});

describe("practice focus", () => {
  it("vocabulary adds a repetition per word", () => {
    const mixed = lessonSettings(prefs({ practiceFocus: "Mixed practice" })).practice.correctToLearn;
    const vocab = lessonSettings(prefs({ practiceFocus: "Vocabulary" })).practice.correctToLearn;
    expect(vocab).toBe(mixed + 1);
  });

  it("listening makes every other question a listening one and hides English", () => {
    const settings = lessonSettings(prefs({ practiceFocus: "Listening" }));
    expect(settings.practice.quizOrder.filter((_, i) => i % 2 === 0).every((k) => k === "listen")).toBe(true);
    expect(settings.hideEnglish).toBe(true);
  });

  it("grammar puts notes first; conversation puts phrases first", () => {
    expect(lessonSettings(prefs({ practiceFocus: "Grammar", goal: "Travel and navigation" })).notesFirst).toBe(true);
    expect(lessonSettings(prefs({ practiceFocus: "Conversation", goal: "Travel and navigation" })).phrasesFirst).toBe(true);
    const plain = lessonSettings(prefs({ practiceFocus: "Mixed practice", goal: "Travel and navigation" }));
    expect(plain.notesFirst).toBe(false);
    expect(plain.phrasesFirst).toBe(false);
  });
});

describe("learning goal", () => {
  const units = ["hangeul", "greetings", "airport", "food"].map((id) => ({
    id,
    lessons: [{ id: `${id}-1` }, { id: `${id}-2` }],
  }));

  it("travel puts the Airport unit before Food; culture puts Food first", () => {
    const travel = lessonsInGoalOrder(units, "Travel and navigation").map((l) => l.id);
    const culture = lessonsInGoalOrder(units, "Culture and media").map((l) => l.id);
    expect(travel.indexOf("airport-1")).toBeLessThan(travel.indexOf("food-1"));
    expect(culture.indexOf("food-1")).toBeLessThan(culture.indexOf("airport-1"));
    // Lessons inside a unit stay in order, and the basics stay first.
    expect(culture.slice(0, 4)).toEqual(["hangeul-1", "hangeul-2", "greetings-1", "greetings-2"]);
  });

  it("academic study puts grammar first; everyday conversation puts phrases first", () => {
    expect(lessonSettings(prefs({ goal: "Academic learning" })).notesFirst).toBe(true);
    expect(lessonSettings(prefs({ goal: "Everyday conversation" })).phrasesFirst).toBe(true);
  });

  it("every goal suggests something to do after a lesson", () => {
    for (const goal of ["Everyday conversation", "Travel and navigation", "Academic learning", "Culture and media"] as const) {
      expect(goalSuggestion(goal).href).toMatch(/^\//);
    }
  });
});

describe("helpers", () => {
  it("orders phrases first only when asked", () => {
    const items = [
      { group: "words", id: 1 },
      { group: "phrases", id: 2 },
    ];
    expect(orderForPractice(items, true).map((i) => i.id)).toEqual([2, 1]);
    expect(orderForPractice(items, false).map((i) => i.id)).toEqual([1, 2]);
  });

  it("reads saved preferences, falling back to defaults for bad values", () => {
    const parsed = parsePreferences(
      JSON.stringify({ goal: "Culture and media", practiceFocus: "Nonsense", dailyMinutes: "15", romanization: false }),
      "Advanced"
    );
    expect(parsed).toEqual({
      level: "Advanced",
      goal: "Culture and media",
      practiceFocus: "Mixed practice",
      dailyMinutes: 15,
      romanization: false,
    });
    expect(parsePreferences("not json", null)).toEqual(DEFAULT_PREFERENCES);
  });

  it("summarizes the settings for the lesson header", () => {
    expect(settingsSummary(prefs({ level: "Intermediate", practiceFocus: "Listening", goal: "Travel and navigation" }))).toBe(
      "Intermediate · Listening focus · Travel goal"
    );
  });
});
