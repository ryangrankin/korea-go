
"use client";

import { useState } from "react";
import Link from "next/link";

export type PracticeQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: number;
};

type PracticeViewerProps = {
  title: string;
  questions: PracticeQuestion[];
};

export default function PracticeViewer({
  title,
  questions,
}: PracticeViewerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);

  const question = questions[currentQuestion];
  const selectedAnswer = question
    ? answers[question.id]
    : undefined;

  const score = questions.filter(
    (item) => answers[item.id] === item.correctAnswer
  ).length;

  function selectAnswer(index: number) {
    if (!question) return;

    setAnswers((previous) => ({
      ...previous,
      [question.id]: index,
    }));
  }

  function nextQuestion() {
    if (currentQuestion === questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentQuestion((previous) => previous + 1);
    }
  }

  function previousQuestion() {
    setCurrentQuestion((previous) => Math.max(previous - 1, 0));
  }

  function restartPractice() {
    setCurrentQuestion(0);
    setAnswers({});
    setFinished(false);
  }

  return (
    <main className="basic-page">
      <div className="basic-container">
        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>{title}</h1>

        {questions.length === 0 ? (
          <div className="lesson-content-card">
            <h2>Practice Coming Soon</h2>
            <p>Practice questions will be added here.</p>
          </div>
        ) : finished ? (
          <div className="lesson-content-card">
            <h2>Practice Complete!</h2>
            <p>
              You got {score} out of {questions.length} correct.
            </p>

            <button
              className="practice-next-button"
              onClick={restartPractice}
            >
              Try Again
            </button>

            <Link href="/dashboard" className="primary-button">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <p className="practice-count">
              Question {currentQuestion + 1} of {questions.length}
            </p>

            <div className="lesson-progress-track">
              <div
                className="lesson-progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`,
                }}
              />
            </div>

            <div className="practice-question-card">
              <h2>{question.prompt}</h2>

              <div className="practice-options">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    className={
                      selectedAnswer === index
                        ? "practice-option selected"
                        : "practice-option"
                    }
                    onClick={() => selectAnswer(index)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="lesson-navigation">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Back
              </button>

              <button
                type="button"
                onClick={nextQuestion}
                disabled={selectedAnswer === undefined}
              >
                {currentQuestion === questions.length - 1
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

/*
  PracticeQuestionCard: one multiple-choice question with instant feedback.
  Used inside sectioned lessons (missions, the airport game, listening).
  - Wrong answer: shows a hint and lets the learner try again.
  - Right answer: shows an explanation and a "Next" button.
  - onDone(firstTry) says whether it was right on the first try.
*/
type PracticeQuestionCardProps = {
  options: string[];
  answer: string;
  hints?: Record<string, string>;
  explanation?: string;
  onOptionClick?: (option: string) => void; // e.g. play the option's audio
  optionLang?: string; // "ko" when the options are Korean
  nextLabel?: string;
  onDone: (firstTry: boolean) => void;
};

export function PracticeQuestionCard({
  options,
  answer,
  hints = {},
  explanation,
  onOptionClick,
  optionLang,
  nextLabel = "Next →",
  onDone,
}: PracticeQuestionCardProps) {
  const [wrongPicks, setWrongPicks] = useState<string[]>([]);
  const [lastWrong, setLastWrong] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  function choose(option: string) {
    if (solved) return;
    onOptionClick?.(option);

    if (option === answer) {
      setSolved(true);
      setLastWrong(null);
    } else {
      setLastWrong(option);
      if (!wrongPicks.includes(option)) {
        setWrongPicks([...wrongPicks, option]);
      }
    }
  }

  return (
    <div>
      <div className="practice-options">
        {options.map((option) => {
          let state = "";
          if (solved && option === answer) state = "correct";
          else if (wrongPicks.includes(option)) state = "wrong";

          return (
            <button
              key={option}
              type="button"
              lang={optionLang}
              className={`practice-option ${state}`}
              onClick={() => choose(option)}
              disabled={solved && option !== answer}
            >
              {option}
            </button>
          );
        })}
      </div>

      {lastWrong && !solved && (
        <p className="feedback feedback-wrong" role="status">
          Not quite. {hints[lastWrong] ?? "Try again!"}
        </p>
      )}

      {solved && (
        <>
          <p className="feedback feedback-right" role="status">
            {wrongPicks.length === 0 ? "Correct! " : "You got it! "}
            {explanation}
          </p>
          <button
            type="button"
            className="practice-next-button"
            onClick={() => onDone(wrongPicks.length === 0)}
          >
            {nextLabel}
          </button>
        </>
      )}
    </div>
  );
}
