"use client";

/*
  ChallengeResults: the screen after a skill check or test-out.
  Shows the topic, the score and pass mark, skills shown and skills to
  practice, a recommended next step, and buttons for what to do next.
  Skipping is always the learner's choice: passing only offers it.
*/

import { useState } from "react";
import Link from "next/link";
import { lessons, type Lesson } from "../../data/lessons";
import { CHALLENGE_CONFIG, type SkillTopic } from "../../data/skillChecks";
import { useLessonProgress } from "../../lib/lessonProgress";
import { lessonsShown, nextLessonId, type ChallengeResult } from "../../lib/skillChecks";
import { skipLessons, useSkillProgress } from "../../lib/skillProgress";
import Pup from "../Pup";

type ChallengeResultsProps = {
  topic: SkillTopic;
  lessonId?: string; // set for a test-out
  result: ChallengeResult;
  practice: boolean; // a practice round: nothing was saved
  onRetry: () => void;
  onPracticeMissed: () => void;
};

const lessonById = (id: string) => lessons.find((lesson) => lesson.id === id);

export default function ChallengeResults({
  topic,
  lessonId,
  result,
  practice,
  onRetry,
  onPracticeMissed,
}: ChallengeResultsProps) {
  const completed = useLessonProgress();
  const progress = useSkillProgress();
  const [justSkipped, setJustSkipped] = useState<string[]>([]);

  const isDone = (id: string) => completed[id] === true || Boolean(progress.skipped[id]);
  const upNext = lessonById(nextLessonId(lessons.map((l) => l.id), isDone) ?? "");

  const skillNames = (keys: string[]) => keys.map((key) => topic.skills[key] ?? key);
  const shownSkills = Object.keys(result.skills).filter((key) => result.skills[key].correct === result.skills[key].total);
  const practiceSkills = Object.keys(result.skills).filter((key) => !shownSkills.includes(key));

  // Lessons this result lets the learner skip, and lessons to go back to.
  const shownLessons = (lessonId ? (result.passed ? [lessonId] : []) : lessonsShown(result))
    .map(lessonById)
    .filter((lesson): lesson is Lesson => Boolean(lesson));
  const skippable = shownLessons.filter((lesson) => !isDone(lesson.id));
  const reviewLessons = Object.keys(result.lessons)
    .filter((id) => result.lessons[id].correct < result.lessons[id].total)
    .map(lessonById)
    .filter((lesson): lesson is Lesson => Boolean(lesson));

  function skip() {
    const ids = skippable.map((lesson) => lesson.id);
    skipLessons(ids);
    setJustSkipped(ids);
  }

  return (
    <section className="challenge-results" aria-labelledby="results-heading">
      <div className="lesson-content-card challenge-score-card">
        <Pup size={110} className={result.passed ? "pup-celebrate" : undefined} />
        <h2 id="results-heading">
          {practice
            ? "Practice round done!"
            : result.passed
            ? "You passed! 🎉"
            : "Good effort! Let's practice a bit more."}
        </h2>

        <p className="challenge-topic">
          Topic: <strong>{topic.title}</strong>
          {lessonId && <> · Lesson: <strong>{lessonById(lessonId)?.title}</strong></>}
        </p>

        <p className="challenge-score">
          <strong>
            {result.correct} of {result.total}
          </strong>{" "}
          right ({result.percent}%)
        </p>
        {!practice && (
          <p className="challenge-passmark">
            {result.passed ? "✓" : "✗"} Pass mark: {result.passPercent}%
            {result.total < CHALLENGE_CONFIG.minQuestions && ` (needs at least ${CHALLENGE_CONFIG.minQuestions} questions)`}
          </p>
        )}
      </div>

      {/* Skills */}
      <div className="challenge-skills">
        {shownSkills.length > 0 && (
          <div>
            <h3>
              <span aria-hidden="true">✅</span> Skills you showed
            </h3>
            <ul>
              {skillNames(shownSkills).map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
        {practiceSkills.length > 0 && (
          <div>
            <h3>
              <span aria-hidden="true">🔁</span> Skills to practice
            </h3>
            <ul>
              {skillNames(practiceSkills).map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended next step */}
      {!practice && (
        <div className="challenge-next">
          <h3>Recommended next step</h3>
          <p>
            {recommendation({ lessonId, passed: result.passed, skippable, reviewLessons })}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="challenge-result-actions">
        {/* Skip, when earned */}
        {!practice && justSkipped.length > 0 && (
          <div className="feedback feedback-right" role="status">
            <p>
              ⏭ Skipped {justSkipped.length === 1 ? "1 lesson" : `${justSkipped.length} lessons`}. You can open
              {justSkipped.length === 1 ? " it" : " them"} again any time from your dashboard.
            </p>
          </div>
        )}
        {!practice && skippable.length > 0 && justSkipped.length === 0 && (
          <>
            {!lessonId && (
              <ul className="challenge-lesson-list" aria-label="Lessons you can skip">
                {skippable.map((lesson) => (
                  <li key={lesson.id}>⏭ {lesson.title}</li>
                ))}
              </ul>
            )}
            <button type="button" className="practice-next-button" onClick={skip}>
              {lessonId ? "Skip this lesson" : `Skip ${skippable.length === 1 ? "this lesson" : `these ${skippable.length} lessons`}`}
            </button>
          </>
        )}
        {!practice && (justSkipped.length > 0 || (result.passed && skippable.length === 0)) && upNext && (
          <Link href={`/lessons/${upNext.id}`} className="practice-next-button">
            Up next: {upNext.title} →
          </Link>
        )}

        {/* Review */}
        {lessonId ? (
          <Link href={`/lessons/${lessonId}`} className={result.passed ? "secondary-button" : "practice-next-button"}>
            {result.passed ? "Take the lesson anyway" : "Review the lesson"}
          </Link>
        ) : (
          reviewLessons.length > 0 && (
            <div className="challenge-review">
              <h3>Lessons to review</h3>
              <ul className="challenge-lesson-list">
                {reviewLessons.map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={`/lessons/${lesson.id}`}>📘 {lesson.title} →</Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {result.missed.length > 0 && (
          <button type="button" className="secondary-button" onClick={onPracticeMissed}>
            Practice the {result.missed.length === 1 ? "question" : `${result.missed.length} questions`} I missed
          </button>
        )}
        <button type="button" className="secondary-button" onClick={onRetry}>
          {practice ? "Take the real challenge again" : "Try again"}
        </button>
        <Link href="/skill-checks" className="link-button">
          All skill checks
        </Link>
      </div>

      {/* What was missed */}
      {result.missed.length > 0 && (
        <details className="challenge-missed">
          <summary>See the questions you missed</summary>
          <ul>
            {result.missed.map((question) => (
              <li key={question.id}>
                <p className="challenge-missed-prompt">{question.prompt}</p>
                <p>
                  Answer:{" "}
                  <strong lang="ko">
                    {question.type === "match"
                      ? question.pairs.map((pair) => `${pair.korean} = ${pair.english}`).join(", ")
                      : question.type === "order"
                      ? question.words.join(" ")
                      : question.answer}
                  </strong>
                </p>
                <p className="challenge-missed-why">{question.explanation}</p>
              </li>
            ))}
          </ul>
        </details>
      )}

      {!practice && result.passed && lessonId && (
        <p className="challenge-note">
          Pup accessories come from finishing a lesson, so you can still take this one any time to earn its reward.
        </p>
      )}
    </section>
  );
}

function recommendation({
  lessonId,
  passed,
  skippable,
  reviewLessons,
}: {
  lessonId?: string;
  passed: boolean;
  skippable: Lesson[];
  reviewLessons: Lesson[];
}): string {
  if (lessonId) {
    if (!passed) return "Go through the lesson again, then come back and try. There's no penalty for retrying.";
    if (skippable.length > 0) return "You know this one! Skip it and move on, or take the lesson anyway to keep it fresh.";
    return "You already finished this lesson, and you still know it. Nice!";
  }
  if (passed && reviewLessons.length === 0) {
    return skippable.length > 0
      ? "You aced every lesson in this topic. Skip them and move on to the next unit."
      : "You aced every lesson in this topic. Move on to the next unit!";
  }
  if (passed) {
    return `Skip the lessons you aced, then practice “${reviewLessons[0].title}”.`;
  }
  return reviewLessons.length > 0
    ? `Start with “${reviewLessons[0].title}”, then try the skill check again. There's no penalty for retrying.`
    : "Try the skill check again. There's no penalty for retrying.";
}
