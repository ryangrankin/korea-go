
"use client";

import { useSyncExternalStore, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import Pup from "../../components/Pup";
import { accessoryForLesson } from "../../data/accessories";
import BottomNav from "../../components/BottomNav";
import {
  estimateMinutes,
  lessons,
  units,
} from "../../data/lessons";
import { useLessonProgress } from "../../lib/lessonProgress";
import { courseProgress } from "../../lib/progress";
import { unitCanDos, unitGoals } from "../../data/objectives";
import { topicForUnit } from "../../data/skillChecks";
import { topicStatus } from "../../lib/skillChecks";
import { useSkillProgress } from "../../lib/skillProgress";
import { goalLabel, lessonsInGoalOrder } from "../../lib/learningSettings";
import { usePreferences } from "../../lib/preferences";
import { useStudySecondsToday, useStudyStreak } from "../../lib/studyTime";
import TopicStatusBadge from "../../components/challenge/TopicStatusBadge";
import "../../components/challenge/challenge.css";

// "Good morning!" etc., from the hour on the learner's own clock (0–23)
function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 18) return "Good afternoon!";
  return "Good evening!";
}

// The greeting depends on the learner's clock, so it's worked out in the
// browser ("Hello!" during the server render).
const noSubscription = () => () => {};
const greetingNow = () => greetingFor(new Date().getHours());

export default function DashboardPage() {
  const greeting = useSyncExternalStore(noSubscription, greetingNow, () => "Hello!");
  // Finished lessons, kept up to date (another tab, or progress loaded from the account)
  const completedLessons = useLessonProgress();
  const skillProgress = useSkillProgress();
  const streak = useStudyStreak();
  const preferences = usePreferences();
  const minutesToday = Math.floor(useStudySecondsToday() / 60);
  const goalMinutes = preferences.dailyMinutes;

  const isComplete = (lessonId: string) =>
    completedLessons[lessonId] === true;

  // Skipped after a test-out or skill check (and not completed since)
  const isSkipped = (lessonId: string) =>
    !isComplete(lessonId) && Boolean(skillProgress.skipped[lessonId]);

  const isDone = (lessonId: string) =>
    isComplete(lessonId) || isSkipped(lessonId);

  // Progress through the whole course (each lesson's own progress is
  // shown inside the lesson). Skipped lessons count, and are shown apart.
  const course = courseProgress(
    lessons.map((lesson) => lesson.id),
    completedLessons,
    skillProgress.skipped
  );

  // The first lesson not finished or skipped yet, in the order that fits
  // the learner's goal (e.g. Food before Airport for a culture goal)
  const nextUp = lessonsInGoalOrder(units, preferences.goal).find(
    (lesson) => !isDone(lesson.id)
  );

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* TOP BAR */}
        <header className="dashboard-header">
          <Link href="/settings" className="settings-button" aria-label="Settings">
            ⚙
          </Link>

          <div className="dashboard-logo">
            <Image src="/brand/wordmark.png" alt="korea GO!" width={319} height={277} priority />
          </div>

          {/* Real streak: days in a row with at least a minute of lessons */}
          <div
            className="streak"
            title="Days in a row you've studied"
            aria-label={`${streak} day study streak`}
          >
            {streak > 0 ? `🔥 ${streak}` : ""}
          </div>
        </header>

        {/* OVERVIEW: the pup off to the side, with greeting and progress next to it.
            (No single overall level here: each topic shows its own status below.) */}
        <div className="dashboard-overview">
          <Link href="/my-pup" className="dashboard-mascot" aria-label="Dress up your pup">
            <Pup size={200} />
          </Link>

          {/* GREETING */}
          <section className="dashboard-greeting">
            <h1>{greeting}</h1>
            <p>잘 지내고 계신가요?</p>
          </section>

          {/* OVERALL PROGRESS */}
          <section className="progress-section">
            <div className="progress-label">
              <span>Course progress</span>
              <span>{course.percent}%</span>
            </div>

            <div
              className="progress-track"
              role="progressbar"
              aria-label="Course progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={course.percent}
            >
              <div
                className="progress-fill"
                style={{ width: `${course.percent}%` }}
              />
            </div>

            <p>
              {course.done === 0
                ? `${course.total} lessons in the course. Finish your first one to start tracking progress!`
                : course.done === course.total
                ? `Great job! You've finished all ${course.total} lessons available so far.`
                : `${course.done} of ${course.total} lessons done${
                    course.skipped > 0
                      ? ` (${course.completed} completed, ${course.skipped} skipped after a challenge)`
                      : ""
                  }. Keep going!`}
            </p>

            {/* Today's study goal (Settings → Daily Study Goal) */}
            <div className="progress-label daily-goal-label">
              <span>Today&apos;s study goal</span>
              <span>
                {Math.min(minutesToday, goalMinutes)} / {goalMinutes} min
                {minutesToday >= goalMinutes ? " ✓" : ""}
              </span>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill daily-goal-fill"
                style={{
                  width: `${Math.min(100, (minutesToday / goalMinutes) * 100)}%`,
                }}
              />
            </div>
            <p>
              Up next follows your {goalLabel(preferences.goal).toLowerCase()}.{" "}
              <Link href="/settings">Change your settings</Link>
            </p>
          </section>
        </div>

        {/* LESSONS, grouped into units */}
        <section className="lesson-section">
          <div className="lesson-section-heading">
            <h2>Your Lessons</h2>
            <Link href="/skill-checks" className="skill-checks-link">
              💪 Skill checks
            </Link>
          </div>

          {/* The learning path, for people who haven't started yet */}
          {course.done === 0 && (
            <p className="learning-path">
              <strong>Your path:</strong>{" "}
              {units
                .filter((unit) => unit.lessons.length > 0)
                .map((unit) => `${unit.icon} ${unit.title}`)
                .join("  →  ")}
              . Each unit is a few 5–10 minute lessons and ends with a game. Start at Unit 0 to learn to read
              Korean, or jump into any unit.
            </p>
          )}

          <div className="unit-grid">
            {units.map((unit, unitIndex) => {
              // Units with no lessons yet
              if (unit.lessons.length === 0) {
                return (
                  <div key={unit.id} className="lesson-card locked">
                    <div className="lesson-icon">{unit.icon}</div>

                    <div className="lesson-info">
                      <p className="unit-label">Unit {unitIndex}</p>
                      <div className="lesson-title-row">
                        <h3>{unit.title}</h3>
                        <span>Coming soon</span>
                      </div>
                      <p>{unit.description}</p>
                    </div>

                    <span className="lesson-arrow">🔒</span>
                  </div>
                );
              }

              const unitProgress = courseProgress(
                unit.lessons.map((lesson) => lesson.id),
                completedLessons,
                skillProgress.skipped
              );

              const topic = topicForUnit(unit.id);
              const status = topicStatus({
                lessonIds: unit.lessons.map((lesson) => lesson.id),
                isCompleted: isComplete,
                isSkipped,
                lastCheckPassed: topic
                  ? skillProgress.topics[topic.id]?.lastPassed
                  : undefined,
              });

              return (
                <div
                  key={unit.id}
                  id={`unit-${unitIndex}`}
                  className="unit-card"
                  style={unit.color ? ({ "--unit-color": unit.color } as CSSProperties) : undefined}
                >
                  {/* UNIT HEADER */}
                  <div className="unit-header">
                    {!unit.image && (
                      <div className="lesson-icon" lang="ko">
                        {unit.icon}
                      </div>
                    )}

                    <div className="lesson-info">
                      <p className="unit-label">Unit {unitIndex}</p>
                      <div className="lesson-title-row">
                        <h3>{unit.title}</h3>
                        <span>
                          {unitProgress.done === unitProgress.total
                            ? unitProgress.skipped > 0
                              ? `Done ✓ (${unitProgress.skipped} skipped)`
                              : "Completed ✓"
                            : `${unitProgress.done} of ${unitProgress.total}`}
                        </span>
                      </div>

                      <p>{unit.description}</p>

                      {/* The practical skill this unit builds, and a can-do checklist from real progress */}
                      {unitGoals[unit.id] && (
                        <>
                          <p className="unit-skill">
                            {unitProgress.done === unitProgress.total ? "🏅 " : "🎯 "}
                            <strong>Travel skill:</strong> {unitGoals[unit.id].skill}
                          </p>
                          <details className="unit-cando">
                            <summary>
                              What you&apos;ll be able to do (
                              {unitCanDos(unit.id, isDone).filter((item) => item.done).length} of{" "}
                              {unitCanDos(unit.id, isDone).length})
                            </summary>
                            <ul>
                              {unitCanDos(unit.id, isDone).map((item) => (
                                <li key={item.text} className={item.done ? "done" : ""}>
                                  <span aria-hidden="true">{item.done ? "✓" : "○"}</span> {item.text}
                                  {item.done && <span className="visually-hidden"> (done)</span>}
                                </li>
                              ))}
                            </ul>
                          </details>
                        </>
                      )}

                      <div
                        className="lesson-progress-track"
                        role="progressbar"
                        aria-label={`${unit.title} progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={unitProgress.percent}
                      >
                        <div
                          className="lesson-progress-fill"
                          style={{ width: `${unitProgress.percent}%` }}
                        />
                      </div>

                      {/* Topic status, and the skill check for this unit */}
                      <div className="unit-skill-row">
                        <TopicStatusBadge status={status} />
                        {topic && (
                          <Link
                            href={`/skill-checks/${topic.id}`}
                            className="unit-challenge-link"
                          >
                            Challenge yourself →
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* A drawing of what the unit is about */}
                    {unit.image && (
                      <Image
                        src={unit.image}
                        alt=""
                        width={240}
                        height={180}
                        className="unit-picture"
                      />
                    )}
                  </div>

                  {/* SHORT LESSONS IN THIS UNIT */}
                  <ol className="unit-lessons">
                    {unit.lessons.map((lesson, index) => {
                      const complete = isComplete(lesson.id);
                      const skipped = isSkipped(lesson.id);
                      const isNext = lesson.id === nextUp?.id;
                      const reward = accessoryForLesson(lesson.id);

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className={`unit-lesson ${complete ? "complete" : ""} ${
                              skipped ? "skipped" : ""
                            } ${isNext ? "next" : ""}`}
                          >
                            <span className="unit-lesson-number">
                              {complete ? "✓" : skipped ? "⏭" : index + 1}
                            </span>

                            <span className="unit-lesson-title">
                              {lesson.title}
                            </span>

                            <span className="unit-lesson-meta">
                              {isNext && (
                                <span className="unit-lesson-badge">Up next</span>
                              )}
                              {skipped && (
                                <span className="unit-lesson-badge">Skipped</span>
                              )}
                              ~{estimateMinutes(lesson)} min
                              {reward && (
                                <span
                                  className={`unit-lesson-reward ${complete ? "earned" : ""}`}
                                  title={`${complete ? "Unlocked" : "Unlocks"}: ${reward.name}`}
                                >
                                  {reward.emoji}
                                </span>
                              )}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              );
            })}
          </div>
        </section>

        {/* BOTTOM NAVIGATION */}
        <BottomNav />
      </div>
    </main>
  );
}
