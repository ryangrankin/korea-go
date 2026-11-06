"use client";

/*
  NavigationGame: Section 3. The learner moves through the airport
  step by step, choosing the right Korean at each stop.
  Wrong choices show a hint and the learner tries again.
*/

import { useEffect, useState } from "react";
import { progressPercent } from "../../lib/progress";
import ProgressBar from "../ProgressBar";
import type { LessonSections, Speaker } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";
import { PracticeQuestionCard } from "../PracticeViewer";
import KoreanText from "../KoreanText";

type NavigationGameProps = {
  game: NonNullable<LessonSections["game"]>;
  speakers: Record<string, Speaker>;
  showRomanization: boolean;
  finishLabel: string;
  onComplete: () => void;
  onProgress?: (share: number) => void; // 0–1, for the lesson's progress bar
  romanize?: (option: string) => string | undefined; // how to say a Korean answer choice
};

export default function NavigationGame({
  game,
  speakers,
  showRomanization,
  finishLabel,
  onComplete,
  onProgress,
  romanize,
}: NavigationGameProps) {
  const [started, setStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const step = game.steps[stepIndex];
  const finished = stepIndex >= game.steps.length;

  // Tell the lesson how far through the game the learner is.
  useEffect(() => {
    onProgress?.(stepIndex / game.steps.length);
  }, [stepIndex, game.steps.length, onProgress]);

  if (!started) {
    return (
      <div className="lesson-content-card">
        <p>{game.intro}</p>
        <button type="button" className="practice-next-button" onClick={() => setStarted(true)}>
          Start ▶
        </button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="lesson-content-card">
        <p>{game.finish}</p>
        <button type="button" className="practice-next-button" onClick={onComplete}>
          {finishLabel}
        </button>
      </div>
    );
  }

  const who = step.speaker ? speakers[step.speaker] : undefined;

  return (
    <div className="practice-question-card">
      <ProgressBar
        label="Game progress"
        percent={progressPercent(stepIndex, game.steps.length)}
        detail={`Step ${stepIndex + 1} of ${game.steps.length}`}
      />
      <p className="game-place">{step.place}</p>

      {/* What someone says to you (if anyone) */}
      {who && step.line && (
        <div className="chat-row chat-left">
          <div className="chat-avatar" aria-hidden="true">{who.emoji}</div>
          <div className="chat-bubble">
            <p className="chat-name">{who.name}</p>
            <KoreanText text={step.line.korean} className="chat-korean" />
            {showRomanization && <p className="romanization">{step.line.romanization}</p>}
            <p className="english">{step.line.english}</p>
          </div>
        </div>
      )}

      <h2>{step.prompt}</h2>

      <PracticeQuestionCard
        key={stepIndex}
        options={step.options}
        answer={step.answer}
        hints={step.hints}
        explanation={step.explanation}
        onOptionClick={speakKorean}
        optionLang="ko"
        romanize={romanize}
        nextLabel={stepIndex === game.steps.length - 1 ? "Finish ▶" : "Keep going ▶"}
        onDone={() => setStepIndex(stepIndex + 1)}
      />
    </div>
  );
}
