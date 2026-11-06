
"use client";

import { useState } from "react";
import Link from "next/link";
import { completeLesson } from "../lib/lessonProgress";
import { useShowRomanization } from "../lib/preferences";
import { progressPercent } from "../lib/progress";
import type { LessonSections } from "../data/lessons";
import SectionedLesson from "./lesson/SectionedLesson";
import LessonPhoto from "./lesson/LessonPhoto";
import LessonTestOutBar from "./challenge/LessonTestOutBar";

type LessonViewerProps = {
  lessonId: string;
  canTestOut?: boolean; // the lesson has a "Test out" challenge
  title: string;
  description: string;
  items: {
    korean: string;
    english: string;
    romanization?: string;
    audioUrl?: string;
  }[];
  // Lessons with sections (conversation, missions, game, review)
  sections?: LessonSections;
  eyebrow?: string; // e.g. "Unit 1 · Lesson 2"
  photo?: { src: string; alt: string }; // the unit's photo, shown as a banner
  nextLesson?: { id: string; title: string };
  previousLesson?: { id: string; title: string };
  unit?: { id: string; number: number; title: string; lessonNumber: number; lessonCount: number; lessonIds: string[] };
  optionRomanization?: Record<string, string>; // how to say each Korean answer choice
  objectives?: string[]; // what the learner will be able to do (data/objectives.ts)
};

export default function LessonViewer({
  lessonId,
  canTestOut = false,
  title,
  description,
  items,
  sections,
  eyebrow,
  photo,
  nextLesson,
  previousLesson,
  unit,
  optionRomanization = {},
  objectives = [],
}: LessonViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);

  // Follows "Show Romanization" in Settings.
  const showRomanization = useShowRomanization();

  // Sectioned lessons use their own layout (same romanization setting).
  if (sections) {
    return (
      <SectionedLesson
        lessonId={lessonId}
        canTestOut={canTestOut}
        title={title}
        description={description}
        eyebrow={eyebrow}
        photo={photo}
        sections={sections}
        showRomanization={showRomanization}
        nextLesson={nextLesson}
        previousLesson={previousLesson}
        unit={unit}
        optionRomanization={optionRomanization}
        objectives={objectives}
      />
    );
  }

  const totalSteps = items.length;
  const isComplete = totalSteps > 0 && currentStep >= totalSteps;

  // Words viewed so far (the furthest one reached), so going back doesn't shrink it.
  const progress = progressPercent(furthestStep, totalSteps);

  function nextStep() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      setFurthestStep(Math.max(furthestStep, currentStep + 1));
    } else if (totalSteps > 0) {
      completeLesson(lessonId);
      setCurrentStep(totalSteps);
      setFurthestStep(totalSteps);
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

        {photo && <LessonPhoto {...photo} />}

        <h1>{title}</h1>
        <p>{description}</p>
        <LessonTestOutBar lessonId={lessonId} canTestOut={canTestOut} />

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
