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
import { goalSuggestion, lessonSettings, settingsSummary } from "../../lib/learningSettings";
import { completeLesson } from "../../lib/lessonProgress";
import { usePreferences } from "../../lib/preferences";
import { usePup } from "../../lib/pup";
import { useStudySecondsToday, useStudyTimer } from "../../lib/studyTime";
import HangeulChart from "../HangeulChart";
import Pup from "../Pup";
import SpeechNotice from "../SpeechNotice";
import StudySection from "./StudySection";
import NavigationGame from "./NavigationGame";
import ReviewActivities from "./ReviewActivities";
import LessonPhoto from "./LessonPhoto";
import LessonTestOutBar from "../challenge/LessonTestOutBar";
import "./lesson.css";

type SectionedLessonProps = {
  lessonId: string;
  canTestOut: boolean; // the lesson has a "Test out" challenge
  title: string;
  description: string;
  eyebrow?: string; // e.g. "Unit 1 · Lesson 2"
  photo?: { src: string; alt: string }; // the unit's photo, shown as a banner
  sections: LessonSections;
  showRomanization: boolean;
  nextLesson?: { id: string; title: string };
};

export default function SectionedLesson({
  lessonId,
  canTestOut,
  title,
  description,
  eyebrow,
  photo,
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

  // The learner's Settings shape how this lesson works.
  const preferences = usePreferences();
  const settings = lessonSettings(preferences);
  const suggestion = goalSuggestion(preferences.goal);

  // Count time spent in the lesson toward today's study goal.
  useStudyTimer(!finished);
  const minutesToday = Math.floor(useStudySecondsToday() / 60);
  const goalMinutes = settings.dailyMinutes;
  const goalMet = minutesToday >= goalMinutes;

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

        {photo && <LessonPhoto {...photo} />}

        {eyebrow && <p className="lesson-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>

        {/* What the learner's Settings are doing in this lesson */}
        <p className="lesson-settings">
          <span>{settingsSummary(preferences)}</span>
          <span className={goalMet ? "lesson-settings-met" : ""}>
            Today: {Math.min(minutesToday, goalMinutes)} of {goalMinutes} min{goalMet ? " ✓" : ""}
          </span>
          <Link href="/settings">Change</Link>
        </p>

        {/* The pup introduces the lesson */}
        <div className="pup-guide">
          <Pup size={72} />
          <p className="pup-bubble">{description}</p>
        </div>

        {!finished && <LessonTestOutBar lessonId={lessonId} canTestOut={canTestOut} />}

        {/* Lesson complete */}
        {finished && (
          <div className="lesson-content-card lesson-complete">
            <Pup size={150} preview={reward} className="pup-celebrate" />
            <h2>Lesson complete! 🎉</h2>
            <p>Your progress has been saved.</p>

            {/* Daily study goal */}
            <p className={`lesson-daily-goal ${goalMet ? "met" : ""}`}>
              {goalMet
                ? `You reached today's ${goalMinutes}-minute study goal!`
                : `${goalMinutes - minutesToday} more ${goalMinutes - minutesToday === 1 ? "minute" : "minutes"} to reach today's ${goalMinutes}-minute goal.`}
            </p>

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
            {/* Something that fits the learner's goal */}
            <Link href={suggestion.href} className="lesson-goal-suggestion">
              <span className="lesson-goal-suggestion-label">For your goal</span>
              <strong>{suggestion.label} →</strong>
              <span>{suggestion.why}</span>
            </Link>

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
                settings={settings}
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
