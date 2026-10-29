/*
  SKILL CHECK SCORING
  Checks answers, scores a challenge, picks questions for a skill check,
  and works out a topic's status. Nothing here touches the screen or
  saved progress, so it's easy to test (see lib/skillChecks.test.ts).
*/

import {
  CHALLENGE_CONFIG,
  type ChallengeQuestion,
  type SkillTopic,
} from "../data/skillChecks";

export type ChallengeConfig = typeof CHALLENGE_CONFIG;

// What a learner gave as an answer:
// - pick-one questions: the option they picked
// - "order": the words, in the order they put them
// - "match": Korean → the meaning they matched it to
export type Answer = string | string[] | Record<string, string>;

export type Tally = { correct: number; total: number };

export type ChallengeResult = {
  correct: number;
  total: number;
  percent: number; // rounded, for showing on screen
  passPercent: number;
  passed: boolean;
  missed: ChallengeQuestion[];
  skills: Record<string, Tally>; // skill key → how it went
  lessons: Record<string, Tally>; // lesson id → how it went
};

// ---------- Checking one answer ----------
export function isCorrect(question: ChallengeQuestion, answer: Answer | undefined): boolean {
  if (answer === undefined) return false;

  switch (question.type) {
    case "match": {
      if (typeof answer !== "object" || Array.isArray(answer)) return false;
      return question.pairs.every((pair) => answer[pair.korean] === pair.english);
    }
    case "order": {
      if (!Array.isArray(answer)) return false;
      const built = answer.join(" ");
      return [question.words, ...(question.accepted ?? [])].some((words) => words.join(" ") === built);
    }
    default:
      return answer === question.answer;
  }
}

// ---------- Passing ----------
// Needs enough questions (so one lucky guess can't pass) and a score at
// or above the pass mark. Compares whole numbers, so 79.5% never rounds up.
export function isPassing(correct: number, total: number, config: ChallengeConfig = CHALLENGE_CONFIG): boolean {
  if (total < config.minQuestions) return false;
  return correct * 100 >= config.passPercent * total;
}

// ---------- Scoring a whole challenge ----------
export function scoreChallenge(
  questions: ChallengeQuestion[],
  answers: Record<string, Answer>,
  config: ChallengeConfig = CHALLENGE_CONFIG
): ChallengeResult {
  const skills: Record<string, Tally> = {};
  const lessons: Record<string, Tally> = {};
  const missed: ChallengeQuestion[] = [];
  let correct = 0;

  for (const question of questions) {
    const right = isCorrect(question, answers[question.id]);
    if (right) correct += 1;
    else missed.push(question);

    for (const [tallies, key] of [
      [skills, question.skill],
      [lessons, question.lessonId],
    ] as const) {
      tallies[key] ??= { correct: 0, total: 0 };
      tallies[key].total += 1;
      if (right) tallies[key].correct += 1;
    }
  }

  const total = questions.length;
  return {
    correct,
    total,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    passPercent: config.passPercent,
    passed: isPassing(correct, total, config),
    missed,
    skills,
    lessons,
  };
}

// Lessons a passing skill check showed the learner already knows: every
// question from that lesson was right. A failed check shows none, and a
// strong overall score doesn't cover a lesson that had a miss.
export function lessonsShown(result: ChallengeResult): string[] {
  if (!result.passed) return [];
  return Object.entries(result.lessons)
    .filter(([, tally]) => tally.total > 0 && tally.correct === tally.total)
    .map(([lessonId]) => lessonId);
}

// ---------- Picking questions ----------
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// A skill check: a few questions from each lesson, kept in lesson order.
export function pickTopicQuestions(
  topic: SkillTopic,
  perLesson: number = CHALLENGE_CONFIG.topicQuestionsPerLesson,
  random: () => number = Math.random
): ChallengeQuestion[] {
  const lessonIds = [...new Set(topic.questions.map((question) => question.lessonId))];
  return lessonIds.flatMap((lessonId) =>
    shuffle(
      topic.questions.filter((question) => question.lessonId === lessonId),
      random
    ).slice(0, perLesson)
  );
}

// ---------- Where the learner stands ----------
export type TopicStatus = "mastered" | "ready" | "practice" | "learning" | "new";

export const STATUS_LABELS: Record<TopicStatus, { icon: string; label: string }> = {
  mastered: { icon: "🏆", label: "Mastered" },
  ready: { icon: "✅", label: "Ready to go" },
  practice: { icon: "🔁", label: "Needs practice" },
  learning: { icon: "📘", label: "In progress" },
  new: { icon: "○", label: "Not assessed" },
};

// - Needs practice: the latest skill check didn't pass (retaking it
//   clears this).
// - Mastered: every lesson is done. Lessons that were skipped only count
//   if the latest skill check for the topic passed too.
// - Ready to go: the latest skill check passed.
// - In progress: some lessons done, no skill check yet.
// - Not assessed: nothing yet.
export function topicStatus(input: {
  lessonIds: string[];
  isCompleted: (lessonId: string) => boolean;
  isSkipped: (lessonId: string) => boolean;
  lastCheckPassed?: boolean; // undefined = never took the skill check
}): TopicStatus {
  const { lessonIds, isCompleted, isSkipped, lastCheckPassed } = input;
  const allCompleted = lessonIds.length > 0 && lessonIds.every(isCompleted);
  const allDone = lessonIds.length > 0 && lessonIds.every((id) => isCompleted(id) || isSkipped(id));

  if (lastCheckPassed === false) return "practice";
  if (allCompleted || (allDone && lastCheckPassed === true)) return "mastered";
  if (lastCheckPassed === true) return "ready";
  if (lessonIds.some((id) => isCompleted(id) || isSkipped(id))) return "learning";
  return "new";
}

// The first lesson, in path order, that isn't completed or skipped.
export function nextLessonId(
  lessonIds: string[],
  isDone: (lessonId: string) => boolean
): string | undefined {
  return lessonIds.find((id) => !isDone(id));
}
