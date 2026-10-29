import { describe, expect, it } from "vitest";
import type { ChallengeQuestion, SkillTopic } from "../data/skillChecks";
import {
  isCorrect,
  isPassing,
  lessonsShown,
  nextLessonId,
  pickTopicQuestions,
  scoreChallenge,
  topicStatus,
  type Answer,
} from "./skillChecks";
import {
  emptyProgress,
  parseProgress,
  withoutSkipped,
  withSkipped,
  withTestOut,
  withTopicCheck,
} from "./skillProgress";

const config = { passPercent: 80, minQuestions: 5, topicQuestionsPerLesson: 2 };

// Five pick-one questions for a lesson, all with the answer "right".
function pickQuestions(lessonId: string, skill = "s", count = 5): ChallengeQuestion[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${lessonId}-${i}`,
    lessonId,
    skill,
    type: "choice" as const,
    prompt: "?",
    options: ["right", "wrong"],
    answer: "right",
    explanation: "",
  }));
}

// Answer the first `rightCount` questions correctly, the rest wrong.
function answersFor(questions: ChallengeQuestion[], rightCount: number): Record<string, Answer> {
  return Object.fromEntries(questions.map((q, i) => [q.id, i < rightCount ? "right" : "wrong"]));
}

describe("checking answers", () => {
  it("pick-one: only the exact answer is right", () => {
    const [question] = pickQuestions("l");
    expect(isCorrect(question, "right")).toBe(true);
    expect(isCorrect(question, "wrong")).toBe(false);
    expect(isCorrect(question, undefined)).toBe(false);
  });

  it("match: every pair must be right", () => {
    const question: ChallengeQuestion = {
      id: "m", lessonId: "l", skill: "s", type: "match", prompt: "", explanation: "",
      pairs: [{ korean: "네", english: "yes" }, { korean: "아니요", english: "no" }],
    };
    expect(isCorrect(question, { 네: "yes", 아니요: "no" })).toBe(true);
    expect(isCorrect(question, { 네: "no", 아니요: "yes" })).toBe(false);
    expect(isCorrect(question, { 네: "yes" })).toBe(false);
    expect(isCorrect(question, "yes")).toBe(false);
  });

  it("order: the right order, or an accepted one", () => {
    const question: ChallengeQuestion = {
      id: "o", lessonId: "l", skill: "s", type: "order", prompt: "", explanation: "", english: "",
      words: ["한국에", "처음", "왔어요."],
      extra: ["이름이"],
      accepted: [["처음", "한국에", "왔어요."]],
    };
    expect(isCorrect(question, ["한국에", "처음", "왔어요."])).toBe(true);
    expect(isCorrect(question, ["처음", "한국에", "왔어요."])).toBe(true);
    expect(isCorrect(question, ["왔어요.", "한국에", "처음"])).toBe(false);
    expect(isCorrect(question, ["이름이", "한국에", "처음", "왔어요."])).toBe(false);
  });
});

describe("scoring and the pass mark", () => {
  it("passes at exactly 80% and fails just below", () => {
    expect(isPassing(4, 5, config)).toBe(true); // 80%
    expect(isPassing(3, 4, config)).toBe(false); // 75%
    expect(isPassing(7, 9, config)).toBe(false); // 77.8%
    expect(isPassing(8, 10, config)).toBe(true);
  });

  it("can't pass with too few questions, even with every answer right", () => {
    expect(isPassing(1, 1, config)).toBe(false);
    expect(isPassing(4, 4, config)).toBe(false);
    const result = scoreChallenge(pickQuestions("l", "s", 1), { "l-0": "right" }, config);
    expect(result.passed).toBe(false);
  });

  it("follows a different pass mark from the settings", () => {
    expect(isPassing(3, 5, { ...config, passPercent: 60 })).toBe(true);
    expect(isPassing(4, 5, { ...config, passPercent: 90 })).toBe(false);
  });

  it("counts right answers, and tallies by skill and lesson", () => {
    const questions = [...pickQuestions("a", "hello", 3), ...pickQuestions("b", "intro", 3)];
    const answers = answersFor(questions, 5); // only b-2 is wrong
    const result = scoreChallenge(questions, answers, config);

    expect(result.correct).toBe(5);
    expect(result.total).toBe(6);
    expect(result.percent).toBe(83);
    expect(result.passed).toBe(true);
    expect(result.missed.map((q) => q.id)).toEqual(["b-2"]);
    expect(result.skills).toEqual({ hello: { correct: 3, total: 3 }, intro: { correct: 2, total: 3 } });
    expect(result.lessons).toEqual({ a: { correct: 3, total: 3 }, b: { correct: 2, total: 3 } });
  });

  it("unanswered questions count as wrong", () => {
    const questions = pickQuestions("l");
    expect(scoreChallenge(questions, {}, config).correct).toBe(0);
  });
});

describe("which lessons a skill check unlocks", () => {
  it("only lessons with every question right, and only when the check passed", () => {
    const questions = [...pickQuestions("a", "s", 2), ...pickQuestions("b", "s", 2), ...pickQuestions("c", "s", 2)];
    const passing = scoreChallenge(questions, answersFor(questions, 5), config); // c-1 wrong
    expect(passing.passed).toBe(true);
    expect(lessonsShown(passing).sort()).toEqual(["a", "b"]);

    const failing = scoreChallenge(questions, answersFor(questions, 4), config);
    expect(failing.passed).toBe(false);
    expect(lessonsShown(failing)).toEqual([]);
  });
});

describe("picking skill check questions", () => {
  it("takes the set number from each lesson, in lesson order", () => {
    const topic: SkillTopic = {
      id: "t", unitId: "t", title: "", icon: "", description: "", skills: {},
      questions: [...pickQuestions("a"), ...pickQuestions("b"), ...pickQuestions("c", "s", 1)],
    };
    const picked = pickTopicQuestions(topic, 2, () => 0.5);
    expect(picked.map((q) => q.lessonId)).toEqual(["a", "a", "b", "b", "c"]);
    expect(new Set(picked.map((q) => q.id)).size).toBe(5);
  });
});

describe("topic status", () => {
  const lessonIds = ["g-1", "g-2", "g-3"];
  const status = (completed: string[], skipped: string[], lastCheckPassed?: boolean) =>
    topicStatus({
      lessonIds,
      isCompleted: (id) => completed.includes(id),
      isSkipped: (id) => skipped.includes(id),
      lastCheckPassed,
    });

  it("labels each stage", () => {
    expect(status([], [])).toBe("new");
    expect(status(["g-1"], [])).toBe("learning");
    expect(status([], [], false)).toBe("practice");
    expect(status([], [], true)).toBe("ready");
    expect(status(lessonIds, [])).toBe("mastered");
  });

  it("skipping every lesson isn't mastery without a passing skill check", () => {
    expect(status(["g-3"], ["g-1", "g-2"])).toBe("learning");
    expect(status(["g-3"], ["g-1", "g-2"], true)).toBe("mastered");
  });

  it("a failed latest check shows needs practice", () => {
    expect(status(lessonIds, [], false)).toBe("practice");
  });
});

describe("saved progress", () => {
  const at = "2026-10-29T00:00:00.000Z";
  const greetings = [...pickQuestions("greetings-1", "hello", 2), ...pickQuestions("greetings-2", "intro", 2), ...pickQuestions("greetings-3", "questions", 2)];

  it("passing one topic doesn't touch another topic's lessons", () => {
    const result = scoreChallenge(greetings, answersFor(greetings, 6), config);
    let state = withTopicCheck(emptyProgress(), "greetings", result, at);
    state = withSkipped(state, ["greetings-1", "food-1"], at);

    expect(Object.keys(state.canSkip).sort()).toEqual(["greetings-1", "greetings-2", "greetings-3"]);
    expect(state.skipped).toEqual({ "greetings-1": at });
    expect(state.topics.food).toBeUndefined();
  });

  it("a failed test-out can't skip, and a retry that passes can", () => {
    const questions = pickQuestions("food-3");
    let state = withTestOut(emptyProgress(), "food-3", scoreChallenge(questions, answersFor(questions, 2), config), at);
    state = withSkipped(state, ["food-3"], at);
    expect(state.skipped["food-3"]).toBeUndefined();
    expect(state.lessons["food-3"]).toMatchObject({ attempts: 1, lastPassed: false, everPassed: false });

    state = withTestOut(state, "food-3", scoreChallenge(questions, answersFor(questions, 5), config), at);
    state = withSkipped(state, ["food-3"], at);
    expect(state.skipped["food-3"]).toBe(at);
    expect(state.lessons["food-3"]).toMatchObject({ attempts: 2, lastPassed: true, bestPercent: 100 });
  });

  it("keeps one record per lesson, and a worse retry doesn't take the skip away", () => {
    const questions = pickQuestions("food-3");
    let state = emptyProgress();
    state = withTestOut(state, "food-3", scoreChallenge(questions, answersFor(questions, 5), config), at);
    state = withTestOut(state, "food-3", scoreChallenge(questions, answersFor(questions, 1), config), "later");
    state = withSkipped(state, ["food-3"], at);
    state = withSkipped(state, ["food-3"], "later");

    expect(Object.keys(state.lessons)).toEqual(["food-3"]);
    expect(state.lessons["food-3"]).toMatchObject({ attempts: 2, bestPercent: 100, lastPercent: 20, everPassed: true });
    expect(state.canSkip["food-3"]).toBe(at);
    expect(state.skipped).toEqual({ "food-3": at });
  });

  it("a skipped lesson can be put back", () => {
    const questions = pickQuestions("food-3");
    let state = withTestOut(emptyProgress(), "food-3", scoreChallenge(questions, answersFor(questions, 5), config), at);
    state = withSkipped(state, ["food-3"], at);
    state = withoutSkipped(state, "food-3");
    expect(state.skipped).toEqual({});
    expect(state.canSkip["food-3"]).toBe(at); // can still skip again later
  });

  it("broken saved data loads as empty instead of crashing", () => {
    expect(parseProgress("not json")).toEqual(emptyProgress());
    expect(parseProgress('{"skipped": [1, 2]}').skipped).toEqual({});
  });
});

describe("next lesson", () => {
  it("is the first lesson not completed or skipped", () => {
    const done = new Set(["a", "b", "d"]);
    expect(nextLessonId(["a", "b", "c", "d"], (id) => done.has(id))).toBe("c");
    expect(nextLessonId(["a", "b"], (id) => done.has(id))).toBeUndefined();
  });
});
