"use client";

/*
  StudySection: one study section of a lesson.
  It walks through these steps in order:
    1. Conversation (if any)  2. Words (and phrases), learned with WordPractice
    3. Grammar (if any)  4. Missions
  Sections with `notesFirst` show the grammar notes before the words.
  The step tracker doubles as navigation: tap any step you've reached
  to go back to it.
*/

import { useState } from "react";
import type { Speaker, StudySection as StudySectionData } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";
import { PracticeQuestionCard } from "../PracticeViewer";
import Conversation from "./Conversation";
import WordCards from "./WordCards";
import GrammarNotes from "./GrammarNotes";
import WordPractice, { type PracticeWord } from "./WordPractice";

type StudySectionProps = {
  section: StudySectionData;
  speakers: Record<string, Speaker>;
  showRomanization: boolean;
  nextSectionLabel: string;
  onComplete: () => void;
};

export default function StudySection({
  section,
  speakers,
  showRomanization,
  nextSectionLabel,
  onComplete,
}: StudySectionProps) {
  // Skip the conversation or grammar step if this section doesn't have one.
  const learnSteps = section.notesFirst ? ["Grammar", "Words"] : ["Words", "Grammar"];
  const steps = [
    ...(section.conversation.length > 0 ? ["Conversation"] : []),
    ...learnSteps.filter(
      (name) =>
        (name !== "Grammar" || section.grammar.length > 0) &&
        (name !== "Words" || section.words.length + section.phrases.length > 0)
    ),
    "Missions",
  ];
  // What each step is called on screen (sections can rename Words and Grammar).
  const labels: Record<string, string> = {
    Conversation: "Conversation",
    Words: section.wordsTitle ?? "Words",
    Grammar: section.grammarTitle ?? "Grammar",
    Missions: "Missions",
  };
  const [step, setStep] = useState(0);
  // The furthest step reached so far. Steps up to here can be revisited.
  const [furthest, setFurthest] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);
  // Once the word practice is done, the Words step shows every word instead.
  const [wordsDone, setWordsDone] = useState(false);
  const [practiceRound, setPracticeRound] = useState(0);

  // Words and phrases for the practice. Wrong options come from the same group.
  const practiceWords: PracticeWord[] = [
    ...section.words.map((word) => ({
      ...word,
      group: "words",
      meaning: section.wordsQuizBy === "romanization" ? word.romanization ?? word.english : word.english,
    })),
    ...section.phrases.map((word) => ({ ...word, group: "phrases", meaning: word.english })),
  ];

  const stepName = steps[step];
  const nextStep = steps[step + 1];
  const nextLabel = nextStep === "Missions" ? "Start missions →" : `${labels[nextStep]} →`;
  const goTo = (index: number) => {
    setStep(index);
    setFurthest(Math.max(furthest, index));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goNext = () => goTo(step + 1);

  const mission = section.missions[missionIndex];
  const missionsDone = missionIndex >= section.missions.length;

  return (
    <div>
      {/* Step tracker: Conversation › Words › Grammar › Missions.
          Tap a step you've already reached to jump back to it. */}
      <ol className="step-tracker">
        {steps.map((name, index) => (
          <li key={name}>
            <button
              type="button"
              className={index === step ? "current" : index <= furthest ? "done" : ""}
              aria-current={index === step ? "step" : undefined}
              disabled={index > furthest}
              onClick={() => goTo(index)}
            >
              {index < furthest && index !== step ? "✓ " : ""}
              {labels[name]}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && <p className="page-description">{section.intro}</p>}

      {stepName === "Conversation" && (
        <>
          <Conversation
            lines={section.conversation}
            // Coming back to a finished conversation shows every line.
            showAll={furthest > step}
            speakers={speakers}
            showRomanization={showRomanization}
            onFinish={goNext}
          />
        </>
      )}

      {stepName === "Words" && !wordsDone && (
        <>
          <h2 className="section-heading">{labels.Words}</h2>
          <WordPractice
            // A new key starts a fresh round when practicing again.
            key={practiceRound}
            words={practiceWords}
            showRomanization={showRomanization}
            noun={
              section.wordsQuizBy === "romanization"
                ? "letters and words"
                : section.phrases.length > 0
                ? "words and phrases"
                : "words"
            }
            finishLabel={nextLabel}
            onFinish={() => {
              setWordsDone(true);
              goNext();
            }}
          />
        </>
      )}

      {/* Coming back after the practice: every word, to look over or hear again */}
      {stepName === "Words" && wordsDone && (
        <>
          <h2 className="section-heading">{labels.Words}</h2>
          <p className="page-description">Tap a card to test yourself and hear it again.</p>
          <WordCards words={section.words} showRomanization={showRomanization} />

          {section.phrases.length > 0 && (
            <>
              <h2 className="section-heading">{section.phrasesTitle ?? "Phrases"}</h2>
              <WordCards words={section.phrases} showRomanization={showRomanization} />
            </>
          )}

          <button type="button" className="practice-next-button" onClick={goNext}>
            {nextLabel}
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={() => {
              setPracticeRound(practiceRound + 1);
              setWordsDone(false);
            }}
          >
            Practice these again
          </button>
        </>
      )}

      {stepName === "Grammar" && (
        <>
          <h2 className="section-heading">{labels.Grammar}</h2>
          <GrammarNotes notes={section.grammar} showRomanization={showRomanization} />
          <button type="button" className="practice-next-button" onClick={goNext}>
            {nextLabel}
          </button>
        </>
      )}

      {stepName === "Missions" && !missionsDone && (
        <div className="practice-question-card">
          <p className="practice-count">
            Mission {missionIndex + 1} of {section.missions.length}
          </p>
          <h2>{mission.prompt}</h2>
          <PracticeQuestionCard
            // "key" makes a fresh question each time (clears old answers).
            key={missionIndex}
            options={mission.options}
            answer={mission.answer}
            hints={mission.hints}
            explanation={mission.explanation}
            onOptionClick={speakKorean}
            optionLang="ko"
            onDone={() => setMissionIndex(missionIndex + 1)}
          />
        </div>
      )}

      {stepName === "Missions" && missionsDone && (
        <div className="lesson-content-card">
          <h2>Missions complete!</h2>
          <button type="button" className="practice-next-button" onClick={onComplete}>
            {nextSectionLabel}
          </button>
          <button type="button" className="secondary-button" onClick={() => setMissionIndex(0)}>
            Try the missions again
          </button>
        </div>
      )}
    </div>
  );
}
