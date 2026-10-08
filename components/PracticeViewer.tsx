
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
