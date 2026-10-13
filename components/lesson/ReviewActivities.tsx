"use client";

/*
  ReviewActivities: the review at the end of a unit.
  Part A: flashcards (tap to flip, 🔊 to hear).
  Part B: listening questions (hear Korean, pick the English).
  Then a final score and a button to finish the lesson.
*/

import { useState } from "react";
import type { LessonSections } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";
import { PracticeQuestionCard } from "../PracticeViewer";

type Review = NonNullable<LessonSections["review"]>;

// ---------- Part A: Flashcards ----------
function Flashcards({ cards, showRomanization, onDone }: { cards: Review["flashcards"]; showRomanization: boolean; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  function goTo(newIndex: number) {
    setIndex(newIndex);
    setFlipped(false);
  }

  return (
    <div>
      <p className="practice-count">
        Card {index + 1} of {cards.length}. Tap the card to flip it.
      </p>

      <button
        type="button"
        className={`flashcard ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped(!flipped)}
        aria-label={flipped ? "Flip back to Korean" : "Flip to see the meaning"}
      >
        {flipped ? (
          <>
            <span className="flashcard-emoji" aria-hidden="true">{card.emoji}</span>
            <span className="flashcard-english">{card.english}</span>
            {showRomanization && <span className="romanization">{card.romanization}</span>}
          </>
        ) : (
          <>
            <span className="flashcard-korean" lang="ko">{card.korean}</span>
            <span className="flashcard-hint">Tap to flip ↻</span>
          </>
        )}
      </button>

      <button
        type="button"
        className="secondary-button flashcard-audio"
        onClick={() => speakKorean(card.say ?? card.example?.korean ?? card.korean)}
      >
        🔊 Hear it
      </button>

      <div className="lesson-navigation">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0}>
          ← Back
        </button>
        <button type="button" onClick={() => goTo(index + 1)} disabled={index === cards.length - 1}>
          Next →
        </button>
      </div>

      <button type="button" className="practice-next-button" onClick={onDone}>
        Start the listening questions →
      </button>
    </div>
  );
}

// ---------- Part B: Listening ----------
function Listening({ questions, onFinish }: { questions: Review["listening"]; onFinish: (score: number) => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showText, setShowText] = useState(false);
  const question = questions[index];

  return (
    <div className="practice-question-card">
      <p className="practice-count">
        Question {index + 1} of {questions.length}
      </p>
      <h2>Listen, then pick the meaning.</h2>

      <button type="button" className="listen-button" onClick={() => speakKorean(question.prompt)}>
        🔊 Play
      </button>

      {/* Backup in case the device has no Korean voice */}
      {showText ? (
        <p className="listen-text" lang="ko">{question.prompt}</p>
      ) : (
        <button type="button" className="link-button" onClick={() => setShowText(true)}>
          Can&apos;t hear it? Show the Korean
        </button>
      )}

      <PracticeQuestionCard
        key={index}
        options={question.options}
        answer={question.answer}
        hints={question.hints}
        explanation={question.explanation ?? `It was ${question.prompt}`}
        nextLabel={index === questions.length - 1 ? "See my score →" : "Next →"}
        onDone={(firstTry) => {
          const newScore = firstTry ? score + 1 : score;
          setScore(newScore);
          setShowText(false);
          if (index === questions.length - 1) onFinish(newScore);
          else setIndex(index + 1);
        }}
      />
    </div>
  );
}

// ---------- The whole review ----------
type ReviewActivitiesProps = {
  review: Review;
  showRomanization: boolean;
  finishLabel: string;
  onComplete: () => void;
};

export default function ReviewActivities({ review, showRomanization, finishLabel, onComplete }: ReviewActivitiesProps) {
  const [part, setPart] = useState<"cards" | "listening" | "score">("cards");
  const [score, setScore] = useState(0);
  const total = review.listening.length;

  if (part === "cards") {
    return (
      <>
        <h2 className="section-heading">Part A: Flashcards</h2>
        <Flashcards cards={review.flashcards} showRomanization={showRomanization} onDone={() => setPart("listening")} />
      </>
    );
  }

  if (part === "listening") {
    return (
      <>
        <h2 className="section-heading">Part B: Listening</h2>
        <Listening
          questions={review.listening}
          onFinish={(finalScore) => {
            setScore(finalScore);
            setPart("score");
          }}
        />
      </>
    );
  }

  return (
    <div className="lesson-content-card">
      <h2>Your score</h2>
      <p className="score-big">
        {score} / {total}
      </p>
      <p className="practice-count">Counts answers that were right on the first try.</p>
      <button type="button" className="practice-next-button" onClick={onComplete}>
        {finishLabel}
      </button>
      <button
        type="button"
        className="secondary-button"
        onClick={() => {
          setScore(0);
          setPart("cards");
        }}
      >
        Review again
      </button>
    </div>
  );
}
