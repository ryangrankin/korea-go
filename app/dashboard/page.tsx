
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BottomNav from "../../components/BottomNav";
import {
  getLessonProgress,
  type LessonProgress,
} from "../../lib/lessonProgress";

export default function DashboardPage() {
  const [level, setLevel] = useState("Beginner");
  const [completedLessons, setCompletedLessons] =
    useState<LessonProgress>({});

  useEffect(() => {
    const savedLevel = localStorage.getItem("koreaGoLevel");

    if (savedLevel) {
      setLevel(savedLevel);
    }

    setCompletedLessons(getLessonProgress());
  }, []);

  const greetingsComplete =
    completedLessons.greetings === true;

  const airportComplete =
    completedLessons.airport === true;

  const completedCount = [
    greetingsComplete,
    airportComplete,
  ].filter(Boolean).length;

  const overallProgress = Math.round(
    (completedCount / 2) * 100
  );

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* TOP BAR */}
        <header className="dashboard-header">
          <Link href="/settings" className="settings-button">
            ⚙
          </Link>

          <div className="dashboard-logo">
            <span className="logo-korea">korea</span>
            <span className="logo-go">GO!</span>
          </div>

          {/* Placeholder until streak tracking is added */}
          <div className="streak">🔥 3</div>
        </header>

        {/* USER LEVEL */}
        <div className="dashboard-level">
          <p>Your Level</p>
          <strong>{level}</strong>
        </div>

        {/* GREETING */}
        <section className="dashboard-greeting">
          <div>
            <h1>Good afternoon!</h1>
            <p>잘 지내고 계신가요?</p>
          </div>

          <div className="dashboard-mascot">🐶</div>
        </section>

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
              : completedCount === 2
              ? "Great job! You've completed all available lessons!"
              : `${completedCount} of 2 lessons completed. Keep going!`}
          </p>
        </section>

        {/* LESSONS */}
        <section className="lesson-section">
          <h2>Your Lessons</h2>

          {/* GREETINGS */}
          <Link
            href="/lessons/greetings"
            className="lesson-card"
          >
            <div className="lesson-icon">👋</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Greetings</h3>
                <span>
                  {greetingsComplete
                    ? "Completed ✓"
                    : "Not Started"}
                </span>
              </div>

              <p>Learn basic Korean greetings</p>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{
                    width: greetingsComplete ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>

          {/* AIRPORT */}
          <Link
            href="/lessons/airport"
            className="lesson-card"
          >
            <div className="lesson-icon">✈️</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Airport</h3>
                <span>
                  {airportComplete
                    ? "Completed ✓"
                    : "Not Started"}
                </span>
              </div>

              <p>Navigate the airport in Korean</p>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{
                    width: airportComplete ? "100%" : "0%",
                  }}
                />
              </div>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>

          {/* FOOD & DINING */}
          <div className="lesson-card locked">
            <div className="lesson-icon">🍜</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Food & Dining</h3>
              </div>

              <p>Order food and understand menus</p>
            </div>

            <span className="lesson-arrow">🔒</span>
          </div>
        </section>

        {/* BOTTOM NAVIGATION */}
        <BottomNav />
      </div>
    </main>
  );
}
