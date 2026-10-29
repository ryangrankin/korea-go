
"use client";

import { useEffect, useState } from "react";
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
import {
  getLessonProgress,
  type LessonProgress,
} from "../../lib/lessonProgress";

// "Good morning!" etc., from the hour on the learner's own clock (0–23)
function greetingFor(hour: number): string {
  if (hour >= 5 && hour < 12) return "Good morning!";
  if (hour >= 12 && hour < 18) return "Good afternoon!";
  return "Good evening!";
}

export default function DashboardPage() {
  const [level, setLevel] = useState("Beginner");
  const [greeting, setGreeting] = useState("Hello!");
  const [completedLessons, setCompletedLessons] =
    useState<LessonProgress>({});

  useEffect(() => {
    const savedLevel = localStorage.getItem("koreaGoLevel");

    if (savedLevel) {
      setLevel(savedLevel);
    }

    setGreeting(greetingFor(new Date().getHours()));

    setCompletedLessons(getLessonProgress());
  }, []);

  const isComplete = (lessonId: string) =>
    completedLessons[lessonId] === true;

  const totalLessons = lessons.length;

  const completedCount =
    lessons.filter((lesson) => isComplete(lesson.id)).length;

  const overallProgress = Math.round(
    (completedCount / totalLessons) * 100
  );

  // The first lesson not finished yet
  const nextUp = lessons.find((lesson) => !isComplete(lesson.id));

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* TOP BAR */}
        <header className="dashboard-header">
          <Link href="/settings" className="settings-button">
            ⚙
          </Link>

          <div className="dashboard-logo">
            <Image src="/brand/wordmark.png" alt="korea GO!" width={319} height={277} priority />
          </div>

          {/* Placeholder until streak tracking is added */}
          <div className="streak">🔥 3</div>
        </header>

        {/* OVERVIEW: the pup off to the side, with greeting, level and progress next to it */}
        <div className="dashboard-overview">
          <Link href="/my-pup" className="dashboard-mascot" aria-label="Dress up your pup">
            <Pup size={200} />
          </Link>

          {/* GREETING */}
          <section className="dashboard-greeting">
            <h1>{greeting}</h1>
            <p>잘 지내고 계신가요?</p>
          </section>

          {/* USER LEVEL */}
          <div className="dashboard-level">
            <p>Your Level</p>
            <strong>{level}</strong>
          </div>

          {/* OVERALL PROGRESS */}
          <section className="progress-section">
            <div className="progress-label">
              <span>Lesson Progress</span>
              <span>{overallProgress}%</span>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${overallProgress}%` }}
              />
            </div>

            <p>
              {completedCount === 0
                ? "Complete your first lesson to start tracking progress!"
                : completedCount === totalLessons
                ? "Great job! You've completed all available lessons!"
                : `${completedCount} of ${totalLessons} lessons completed. Keep going!`}
            </p>
          </section>
        </div>

        {/* LESSONS, grouped into units */}
        <section className="lesson-section">
          <h2>Your Lessons</h2>

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

              const unitDone = unit.lessons.filter((lesson) =>
                isComplete(lesson.id)
              ).length;

              return (
                <div key={unit.id} className="unit-card">
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
                          {unitDone === unit.lessons.length
                            ? "Completed ✓"
                            : `${unitDone} of ${unit.lessons.length}`}
                        </span>
                      </div>

                      <p>{unit.description}</p>

                      <div className="lesson-progress-track">
                        <div
                          className="lesson-progress-fill"
                          style={{
                            width: `${(unitDone / unit.lessons.length) * 100}%`,
                          }}
                        />
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
                      const isNext = lesson.id === nextUp?.id;
                      const reward = accessoryForLesson(lesson.id);

                      return (
                        <li key={lesson.id}>
                          <Link
                            href={`/lessons/${lesson.id}`}
                            className={`unit-lesson ${complete ? "complete" : ""} ${
                              isNext ? "next" : ""
                            }`}
                          >
                            <span className="unit-lesson-number">
                              {complete ? "✓" : index + 1}
                            </span>

                            <span className="unit-lesson-title">
                              {lesson.title}
                            </span>

                            <span className="unit-lesson-meta">
                              {isNext && (
                                <span className="unit-lesson-badge">Up next</span>
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
