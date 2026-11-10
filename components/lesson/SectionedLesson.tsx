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

import { scrollToTop } from "../../lib/scroll";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { accessoryForLesson } from "../../data/accessories";
import type { LessonSections } from "../../data/lessons";
import { goalSuggestion, lessonSettings, settingsSummary } from "../../lib/learningSettings";
import { unitGoals } from "../../data/objectives";
import { completeLesson, useLessonProgress } from "../../lib/lessonProgress";
import { useSkillProgress } from "../../lib/skillProgress";
import { lessonPercent } from "../../lib/progress";
import AudioNotice from "../AudioNotice";
import HangulIntro from "./HangulIntro";
import ProgressBar from "../ProgressBar";
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
  previousLesson?: { id: string; title: string };
  unit?: { id: string; number: number; title: string; lessonNumber: number; lessonCount: number; lessonIds: string[] };
  optionRomanization: Record<string, string>; // how to say each Korean answer choice
  objectives: string[]; // what the learner will be able to do (data/objectives.ts)
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
  previousLesson,
  unit,
  optionRomanization,
  objectives,
}: SectionedLessonProps) {
  // Has the learner finished any Hangul lesson? (If not, explain Hangul first.)
  const completed = useLessonProgress();
  const skipped = useSkillProgress().skipped;
  // Unit milestone: every lesson in this unit is finished (or skipped after a challenge).
  const unitComplete = Boolean(unit?.lessonIds.every((id) => completed[id] || skipped[id]));
  const unitGoal = unit ? unitGoals[unit.id] : undefined;
  const knowsHangul = Object.keys(completed).some((id) => id.startsWith("hangeul-") && completed[id]);

  // Romanization under Korean answer choices, when it's turned on in Settings.
  const romanize = useCallback(
    (option: string) => (showRomanization ? optionRomanization[option] : undefined),
    [showRomanization, optionRomanization]
  );
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

  // ----- Lesson progress -----
  // Each part (tab) reports how much of it is done (0–1); finished parts
  // count as 1. The bar is the average, so it matches what's really done.
  const [shares, setShares] = useState<Record<number, number>>({});
  const [doneParts, setDoneParts] = useState<number[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const reportShare = useCallback(
    (tab: number, share: number) =>
      setShares((previous) => (previous[tab] === share ? previous : { ...previous, [tab]: share })),
    []
  );
  const reporters = useMemo(
    () => tabs.map((_, tab) => (share: number) => reportShare(tab, share)),
    [tabs.length, reportShare] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const partShares = tabs.map((_, tab) => (doneParts.includes(tab) ? 1 : shares[tab] ?? 0));
  const percent = lessonPercent(partShares);

  function goTo(tab: number) {
    setCurrent(tab);
    scrollToTop();
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
    scrollToTop();
  }

  // What the button at the end of a part says, and where it goes.
  const nextLabel = (tab: number) =>
    tab === lastTab ? "Finish lesson ✓" : `On to ${tabs[tab + 1]} →`;

  // Finishing a part marks it done. The lesson only counts as complete
  // once every part is done, so jumping to the last tab can't skip ahead.
  function goOnFrom(tab: number) {
    const done = doneParts.includes(tab) ? doneParts : [...doneParts, tab];
    setDoneParts(done);
    setNotice(null);
    if (tab !== lastTab) {
      goTo(tab + 1);
      return;
    }
    const unfinished = tabs.findIndex((_, index) => !done.includes(index));
    if (unfinished === -1) {
      finish();
    } else {
      setNotice(`Almost there! Finish "${tabs[unfinished]}" to complete this lesson.`);
      goTo(unfinished);
    }
  }

  // Section titles only matter when there are several parts.
  const partTitle = (tab: number, name: string) =>
    showTabs && (
      <h2 className="section-title">
        Part {tab + 1}: {name}
      </h2>
    );

  return (
    <main className="basic-page lesson-page">
      <div className="basic-container lesson-sections-container">
        {/* Where am I? Dashboard › Unit › Lesson (each part links back) */}
        <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
          <Link href="/dashboard">← Dashboard</Link>
          {unit && (
            <>
              <span aria-hidden="true">›</span>
              <Link href={`/dashboard#unit-${unit.number}`}>
                Unit {unit.number}: {unit.title}
              </Link>
              <span aria-hidden="true">›</span>
              <span aria-current="page">
                Lesson {unit.lessonNumber} of {unit.lessonCount}
              </span>
            </>
          )}
        </nav>

        {photo && <LessonPhoto {...photo} />}

        {!unit && eyebrow && <p className="lesson-eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>

        {/* What the learner's Settings are doing in this lesson */}
        <p className="lesson-settings">
          <span>{settingsSummary(preferences)}</span>
          <span className={goalMet ? "lesson-settings-met" : ""}>
            Today: {Math.min(minutesToday, goalMinutes)} of {goalMinutes} min{goalMet ? " ✓" : ""}
          </span>
          <Link href="/settings">Change</Link>
        </p>

        {/* The pup introduces the lesson, and what you'll be able to do after it */}
        <div className="pup-guide">
          <Pup size={72} />
          <div className="pup-bubble">
            <p>{description}</p>
            {objectives.length > 0 && (
              <>
                <p className="lesson-objectives-title">In this lesson, you&apos;ll learn to:</p>
                <ul className="lesson-objectives">
                  {objectives.map((objective) => (
                    <li key={objective}>{objective}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {!finished && <LessonTestOutBar lessonId={lessonId} canTestOut={canTestOut} />}

        {/* Lesson complete */}
        {finished && (
          <div className="lesson-content-card lesson-complete">
            <Pup size={150} preview={reward} className="pup-celebrate" />
            <h2>Lesson complete! 🎉</h2>
            <p>Your progress has been saved.</p>

            {/* What the learner can do now */}
            {objectives.length > 0 && (
              <div className="lesson-can-now">
                <p>You can now:</p>
                <ul>
                  {objectives.map((objective) => (
                    <li key={objective}>✓ {objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Milestone: the whole unit is done */}
            {unitComplete && unit && unitGoal && (
              <div className="unit-milestone" role="status">
                <p className="unit-milestone-title">
                  🏅 Unit {unit.number} complete: {unit.title}
                </p>
                <p>
                  Travel skill unlocked: <strong>{unitGoal.skill}</strong>
                </p>
                <ul>
                  {unitGoal.canDo.map((item) => (
                    <li key={item.text}>✓ {item.text}</li>
                  ))}
                </ul>
              </div>
            )}

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
          {/* One-time note: the audio is a computer voice, and how to hear it better */}
          <AudioNotice />

          {/* Before Hangul shows up outside the Hangul unit: what it is, and how to manage without reading it yet */}
          {!lessonId.startsWith("hangeul-") && (
            <HangulIntro knowsHangul={knowsHangul} showRomanization={showRomanization} />
          )}

          {/* Progress through this whole lesson (not the course) */}
          <ProgressBar
            className="lesson-progress"
            label="This lesson"
            percent={percent}
            detail={showTabs ? `${doneParts.length} of ${tabs.length} parts done` : undefined}
          />
          {notice && (
            <p className="lesson-notice" role="status">
              {notice}
            </p>
          )}

          {/* Tabs (only when the lesson has more than one part) */}
          {showTabs && (
            <nav className="section-tabs" aria-label="Lesson parts">
              {tabs.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className={`${current === index ? "active" : ""} ${doneParts.includes(index) ? "done" : ""}`}
                  aria-current={current === index ? "step" : undefined}
                  onClick={() => goTo(index)}
                >
                  <span>{doneParts.includes(index) ? "✓" : index + 1}</span>
                  {label}
                  {doneParts.includes(index) && <span className="visually-hidden"> (done)</span>}
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
                romanize={romanize}
                nextSectionLabel={nextLabel(index)}
                onComplete={() => goOnFrom(index)}
                onProgress={reporters[index]}
              />
            </div>
          ))}

          {game && (
            <div hidden={current !== gameTab}>
              {partTitle(gameTab, game.title)}
              <NavigationGame
                romanize={romanize}
                game={game}
                speakers={sections.speakers}
                showRomanization={showRomanization}
                finishLabel={nextLabel(gameTab)}
                onComplete={() => goOnFrom(gameTab)}
                onProgress={reporters[gameTab]}
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
                onProgress={reporters[reviewTab]}
              />
            </div>
          )}
        </div>

        {/* Move between lessons without going back to the dashboard */}
        <nav className="lesson-footer-nav" aria-label="Lessons">
          {previousLesson ? (
            <Link href={`/lessons/${previousLesson.id}`} className="lesson-footer-link">
              <span>← Previous</span>
              <strong>{previousLesson.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          <Link href="/dashboard" className="lesson-footer-link lesson-footer-home">
            <span>All lessons</span>
            <strong>Dashboard</strong>
          </Link>
          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.id}`} className="lesson-footer-link lesson-footer-next">
              <span>Next →</span>
              <strong>{nextLesson.title}</strong>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>

      <HangeulChart />
      <SpeechNotice />
    </main>
  );
}
