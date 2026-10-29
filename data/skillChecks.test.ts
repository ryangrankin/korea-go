/*
  Checks the skill check questions are set up right, so a typo in
  data/checks/*.ts shows up here instead of on a learner's screen.
*/

import { describe, expect, it } from "vitest";
import { lessons, units } from "./lessons";
import { CHALLENGE_CONFIG, canTestOut, skillTopics } from "./skillChecks";

const allQuestions = skillTopics.flatMap((topic) => topic.questions);

describe("skill check data", () => {
  it("every question id is unique", () => {
    const ids = allQuestions.map((question) => question.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every topic points at a real unit, and its questions at that unit's lessons", () => {
    for (const topic of skillTopics) {
      const unit = units.find((u) => u.id === topic.unitId);
      expect(unit, topic.id).toBeDefined();
      const lessonIds = unit!.lessons.map((lesson) => lesson.id);
      for (const question of topic.questions) {
        expect(lessonIds, question.id).toContain(question.lessonId);
        expect(Object.keys(topic.skills), question.id).toContain(question.skill);
      }
    }
  });

  it("every pick-one answer is one of its options, with no repeats", () => {
    for (const question of allQuestions) {
      if (question.type === "match" || question.type === "order") continue;
      expect(question.options, question.id).toContain(question.answer);
      expect(new Set(question.options).size, question.id).toBe(question.options.length);
      if (question.type === "listening") expect(question.audio, question.id).toBeTruthy();
    }
  });

  it("match and order questions are answerable", () => {
    for (const question of allQuestions) {
      if (question.type === "match") {
        expect(question.pairs.length, question.id).toBeGreaterThanOrEqual(2);
        expect(new Set(question.pairs.map((p) => p.english)).size, question.id).toBe(question.pairs.length);
      }
      if (question.type === "order") {
        expect(question.words.length, question.id).toBeGreaterThanOrEqual(2);
        for (const word of question.extra ?? []) expect(question.words, question.id).not.toContain(word);
      }
    }
  });

  it("the sample lessons have enough questions to test out of", () => {
    const testable = lessons.filter((lesson) => canTestOut(lesson.id)).map((lesson) => lesson.id);
    for (const id of ["hangeul-1", "greetings-1", "greetings-4", "food-1", "food-7"]) {
      expect(testable).toContain(id);
    }
    for (const topic of skillTopics) {
      for (const question of topic.questions) {
        const count = topic.questions.filter((q) => q.lessonId === question.lessonId).length;
        expect(count, question.lessonId).toBeGreaterThanOrEqual(CHALLENGE_CONFIG.minQuestions);
      }
    }
  });

  it("each topic's skill check is long enough to pass", () => {
    for (const topic of skillTopics) {
      const lessonCount = new Set(topic.questions.map((q) => q.lessonId)).size;
      expect(lessonCount * CHALLENGE_CONFIG.topicQuestionsPerLesson, topic.id).toBeGreaterThanOrEqual(
        CHALLENGE_CONFIG.minQuestions
      );
    }
  });
});
