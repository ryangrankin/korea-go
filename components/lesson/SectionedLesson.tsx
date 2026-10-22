"use client";

/*
  SectionedLesson: a short lesson made of parts (study sections, a game,
  a review). LessonViewer shows this when a lesson in data/lessons.ts
  has `sections`.
  If a lesson has more than one part, tabs at the top let the learner
  jump between them; each part's last button moves on to the next one.
  Parts stay mounted (just hidden) so switching tabs keeps your place.
  Finishing the last part marks the lesson complete, shows the pup
  wearing the accessory it unlocks, and offers the next lesson.
  The pup introduces each lesson in a speech bubble.
  The Hangeul chart floats on top, so opening it never loses your place.
*/

import { useState } from "react";
import Link from "next/link";
import { accessoryForLesson } from "../../data/accessories";
import type { LessonSections } from "../../data/lessons";
import { completeLesson } from "../../lib/lessonProgress";
import { usePup } from "../../lib/pup";
import HangeulChart from "../HangeulChart";
import Pup from "../Pup";
import SpeechNotice from "../SpeechNotice";
import StudySection from "./StudySection";
import NavigationGame from "./NavigationGame";
import ReviewActivities from "./ReviewActivities";
import "./lesson.css";

type SectionedLessonProps = {
  lessonId: string;
  title: string;
  description: string;
  eyebrow?: string; // e.g. "Unit 1 · Lesson 2"
  sections: LessonSections;
  showRomanization: boolean;
  nextLesson?: { id: string; title: string };
};

export default function SectionedLesson({
  lessonId,
  title,
  description,
  eyebrow,
  sections,
  showRomanization,
  nextLesson,
}: SectionedLessonProps) {
  // Which tab is open: 0, 1, ... for study sections, then the game, then the review.
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const pup = usePup();
  const reward = accessoryForLesson(lessonId);

  const { game, review } = sections;
  const gameTab = game ? sections.study.length : -1;
  const reviewTab = review ? sections.study.length + (game ? 1 : 0) : -1;
  const tabs = [
    ...sections.study.map((section) => section.tabLabel ?? section.title),
    ...(game ? ["Game"] : []),
    ...(review ? ["Review"] : []),
  ];
  const lastTab = tabs.length - 1;
  const showTabs = tabs.length > 1;

  function goTo(tab: number) {
    setCurrent(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function finish() {
    completeLesson(lessonId);
    setFinished(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // What the button at the end of a part says, and where it goes.
  const nextLabel = (tab: number) =>
    tab === lastTab ? "Finish lesson ✓" : `On to ${tabs[tab + 1]} →`;
  const goOnFrom = (tab: number) => (tab === lastTab ? finish() : goTo(tab + 1));

  // Section titles only matter when there are several parts.
  const partTitle = (tab: number, name: string) =>
    showTabs && (
      <h2 className="section-title">
        Part {tab + 1}: {name}
      </h2>
    );

  return (
    <main className="basic-page">
      <div className="basic-container lesson-sections-container">
        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        {eyebrow && <p className="lesson-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>

        {/* The pup introduces the lesson */}
        <div className="pup-guide">
          <Pup size={72} />
          <p className="pup-bubble">{description}</p>
        </div>

        {/* Lesson complete */}
        {finished && (
          <div className="lesson-content-card lesson-complete">
            <Pup size={150} preview={reward} className="pup-celebrate" />
            <h2>Lesson complete! 🎉</h2>
            <p>Your progress has been saved.</p>

            {/* The accessory this lesson unlocks */}
            {reward && (
              <div className="pup-unlock">
                <p>
                  New accessory: <strong>{reward.emoji} {reward.name}</strong>
                </p>
                <p className="pup-unlock-fact">{reward.fact}</p>
                {pup.isWearing(reward.id) ? (
                  <p className="pup-unlock-wearing">✓ Your pup is wearing it</p>
                ) : (
                  <button type="button" className="secondary-button" onClick={() => pup.putOn(reward.id)}>
                    Put it on
                  </button>
                )}
                <Link href="/my-pup" className="link-button">
                  Dress up your pup →
                </Link>
              </div>
            )}
            {nextLesson ? (
              <Link href={`/lessons/${nextLesson.id}`} className="practice-next-button">
                Next: {nextLesson.title} →
              </Link>
            ) : (
              <p>You&apos;ve finished every lesson so far. More are coming soon!</p>
            )}
            <Link href="/dashboard" className="secondary-button">
              Back to dashboard
            </Link>
            <button type="button" className="link-button" onClick={() => setFinished(false)}>
              Look back through this lesson
            </button>
          </div>
        )}

        <div hidden={finished}>
          {/* Tabs (only when the lesson has more than one part) */}
          {showTabs && (
            <nav className="section-tabs" aria-label="Lesson parts">
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
          )}

          {/* Study sections: conversation, words, grammar, missions */}
          {sections.study.map((section, index) => (
            <div key={index} hidden={current !== index}>
              {partTitle(index, section.title)}
              <StudySection
                section={section}
                speakers={sections.speakers}
                showRomanization={showRomanization}
                nextSectionLabel={nextLabel(index)}
                onComplete={() => goOnFrom(index)}
              />
            </div>
          ))}

          {game && (
            <div hidden={current !== gameTab}>
              {partTitle(gameTab, game.title)}
              <NavigationGame
                game={game}
                speakers={sections.speakers}
                showRomanization={showRomanization}
                finishLabel={nextLabel(gameTab)}
                onComplete={() => goOnFrom(gameTab)}
              />
            </div>
          )}

          {review && (
            <div hidden={current !== reviewTab}>
              {partTitle(reviewTab, review.title)}
              <ReviewActivities
                review={review}
                showRomanization={showRomanization}
                finishLabel={nextLabel(reviewTab)}
                onComplete={() => goOnFrom(reviewTab)}
              />
            </div>
          )}
        </div>
      </div>

      <HangeulChart />
      <SpeechNotice />
    </main>
  );
}
