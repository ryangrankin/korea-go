"use client";

/*
  SectionedLesson: a lesson made of sections (Lesson 1 and later).
  LessonViewer shows this when a lesson in data/lessons.ts has `sections`.
  Tabs at the top let the learner jump between sections; each
  section's last button moves on to the next one.
  The Hangeul chart floats on top, so opening it never loses your place.
*/

import { useState } from "react";
import Link from "next/link";
import type { LessonSections } from "../../data/lessons";
import { completeLesson } from "../../lib/lessonProgress";
import HangeulChart from "../HangeulChart";
import SpeechNotice from "../SpeechNotice";
import StudySection from "./StudySection";
import NavigationGame from "./NavigationGame";
import ReviewActivities from "./ReviewActivities";
import "./lesson.css";

type SectionedLessonProps = {
  lessonId: string;
  title: string;
  description: string;
  sections: LessonSections;
  showRomanization: boolean;
};

export default function SectionedLesson({
  lessonId,
  title,
  description,
  sections,
  showRomanization,
}: SectionedLessonProps) {
  // Which tab is open: 0, 1, ... for study sections, then the game, then the review.
  const [current, setCurrent] = useState(0);

  const gameTab = sections.study.length;
  const reviewTab = gameTab + 1;
  const tabs = [...sections.study.map((section) => section.tabLabel), "Game", "Review"];

  function goTo(tab: number) {
    setCurrent(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="basic-page">
      <div className="basic-container lesson-sections-container">
        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>{title}</h1>
        <p className="page-description">{description}</p>

        {/* Section tabs */}
        <nav className="section-tabs" aria-label="Lesson sections">
          {tabs.map((label, index) => (
            <button
              key={label}
              type="button"
              className={current === index ? "active" : ""}
              aria-current={current === index ? "step" : undefined}
              onClick={() => goTo(index)}
            >
              <span>{index + 1}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Sections 1, 2, ...: conversation, words, grammar, missions */}
        {sections.study.map(
          (section, index) =>
            current === index && (
              <div key={index}>
                <h2 className="section-title">
                  Section {index + 1}: {section.title}
                </h2>
                <StudySection
                  section={section}
                  speakers={sections.speakers}
                  showRomanization={showRomanization}
                  nextSectionLabel={`On to Section ${index + 2} →`}
                  onComplete={() => goTo(index + 1)}
                />
              </div>
            )
        )}

        {current === gameTab && (
          <>
            <h2 className="section-title">
              Section {gameTab + 1}: {sections.game.title}
            </h2>
            <NavigationGame
              game={sections.game}
              speakers={sections.speakers}
              showRomanization={showRomanization}
              onComplete={() => goTo(reviewTab)}
            />
          </>
        )}

        {current === reviewTab && (
          <>
            <h2 className="section-title">
              Section {reviewTab + 1}: {sections.review.title}
            </h2>
            {/* Finishing the review marks the lesson complete on the dashboard */}
            <ReviewActivities
              review={sections.review}
              showRomanization={showRomanization}
              onComplete={() => completeLesson(lessonId)}
            />
          </>
        )}
      </div>

      <HangeulChart />
      <SpeechNotice />
    </main>
  );
}
