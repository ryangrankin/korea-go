
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { completeLesson } from "../lib/lessonProgress";

type LessonViewerProps = {
  lessonId: string;
  title: string;
  description: string;
  items: {
    korean: string;
    english: string;
    romanization?: string;
    audioUrl?: string;
  }[];
};

export default function LessonViewer({
  lessonId,
  title,
  description,
  items,
}: LessonViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const [showRomanization, setShowRomanization] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("koreaGoPreferences");

      if (saved) {
        const preferences = JSON.parse(saved);
        setShowRomanization(preferences.romanization !== false);
      }
    } catch {
      setShowRomanization(true);
    }
  }, []);

  const totalSteps = items.length;
  const isComplete = totalSteps > 0 && currentStep >= totalSteps;

  const progress =
    totalSteps === 0
      ? 0
      : Math.min((currentStep / totalSteps) * 100, 100);

  function nextStep() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else if (totalSteps > 0) {
      completeLesson(lessonId);
      setCurrentStep(totalSteps);
    }
  }

  function previousStep() {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  }

  return (
    <main className="basic-page">
      <div className="basic-container">
        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>{title}</h1>
        <p>{description}</p>

        {/* LESSON PROGRESS */}
        <div className="lesson-progress-track">
          <div
            className="lesson-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* NO LESSON CONTENT YET */}
        {totalSteps === 0 ? (
          <div className="lesson-content-card">
            <h2>Lesson Coming Soon</h2>
            <p>Lesson content will be added here.</p>

            <Link
              href={`/practice/${lessonId}`}
              className="primary-button"
            >
              Preview Practice →
            </Link>
          </div>
        ) : isComplete ? (
          /* LESSON COMPLETED */
          <div className="lesson-content-card">
            <h2>Lesson Complete! 🎉</h2>
            <p>
              Great job! Your progress has been saved.
            </p>

            <Link
              href={`/practice/${lessonId}`}
              className="primary-button"
            >
              Start Practice →
            </Link>

            <Link href="/dashboard" className="back-button">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          /* LESSON CONTENT */
          <>
            <p>
              {currentStep + 1} of {totalSteps}
            </p>

            <div className="lesson-content-card">
              <h2>{items[currentStep].korean}</h2>

              {showRomanization && items[currentStep].romanization && (
                <p>{items[currentStep].romanization}</p>
              )}

              <h3>{items[currentStep].english}</h3>
            </div>

            {/* NAVIGATION */}
            <div className="lesson-navigation">
              <button
                type="button"
                onClick={previousStep}
                disabled={currentStep === 0}
              >
                Previous
              </button>

              <button type="button" onClick={nextStep}>
                {currentStep === totalSteps - 1
                  ? "Finish"
                  : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
