"use client";

/*
  StudySection: used for Section 1 AND Section 2.
  It walks through these steps in order:
    1. Conversation  2. Words (and phrases)  3. Grammar (if any)  4. Missions
*/

import { useState } from "react";
import type { Speaker, StudySection as StudySectionData } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";
import { PracticeQuestionCard } from "../PracticeViewer";
import Conversation from "./Conversation";
import WordCards from "./WordCards";
import GrammarNotes from "./GrammarNotes";

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
  // Skip the grammar step if this section has no grammar notes.
  const steps = ["Conversation", "Words", ...(section.grammar.length > 0 ? ["Grammar"] : []), "Missions"];
  const [step, setStep] = useState(0);
  const [missionIndex, setMissionIndex] = useState(0);

  const stepName = steps[step];
  const goNext = () => {
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mission = section.missions[missionIndex];
  const missionsDone = missionIndex >= section.missions.length;

  return (
    <div>
      {/* Step tracker: Conversation › Words › Grammar › Missions */}
      <ol className="step-tracker">
        {steps.map((name, index) => (
          <li key={name} className={index === step ? "current" : index < step ? "done" : ""}>
            {index < step ? "✓ " : ""}
            {name}
          </li>
        ))}
      </ol>

      {stepName === "Conversation" && (
        <>
          <p className="page-description">{section.intro}</p>
          <Conversation
            lines={section.conversation}
            speakers={speakers}
            showRomanization={showRomanization}
            onFinish={goNext}
          />
        </>
      )}

      {stepName === "Words" && (
        <>
          <h2 className="section-heading">Words</h2>
          <p className="page-description">Tap a card to hear it and see its picture and meaning.</p>
          <WordCards words={section.words} showRomanization={showRomanization} />

          {section.phrases.length > 0 && (
            <>
              <h2 className="section-heading">Phrases</h2>
              <WordCards words={section.phrases} showRomanization={showRomanization} />
            </>
          )}

          <button type="button" className="practice-next-button" onClick={goNext}>
            {steps[step + 1] === "Grammar" ? "Grammar →" : "Start missions →"}
          </button>
        </>
      )}

      {stepName === "Grammar" && (
        <>
          <h2 className="section-heading">Grammar</h2>
          <GrammarNotes notes={section.grammar} showRomanization={showRomanization} />
          <button type="button" className="practice-next-button" onClick={goNext}>
            Start missions →
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
        </div>
      )}
    </div>
  );
}
