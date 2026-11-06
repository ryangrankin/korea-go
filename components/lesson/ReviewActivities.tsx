"use client";

/*
  ReviewActivities: the review at the end of a unit.
  Part A: flashcards (tap to flip, 🔊 to hear).
  Part B: listening questions (hear Korean, pick the English).
  Then a final score and a button to finish the lesson.
*/

import { useEffect, useState } from "react";
import { progressPercent } from "../../lib/progress";
import { vowelStrokes } from "../../data/strokes";
import AudioButtons from "../AudioButtons";
import VowelDiagram from "./VowelDiagram";
import ProgressBar from "../ProgressBar";
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
            {vowelStrokes[card.korean] ? (
              <VowelDiagram letter={card.korean} size={96} />
            ) : (
              <span className="flashcard-emoji" aria-hidden="true">{card.emoji}</span>
            )}
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

      <AudioButtons text={card.say ?? card.example?.korean ?? card.korean} className="flashcard-audio" />

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
function Listening({
  questions,
  onFinish,
  onAnswered,
}: {
  questions: Review["listening"];
  onFinish: (score: number) => void;
  onAnswered: (count: number) => void; // questions finished so far
}) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showText, setShowText] = useState(false);
  const question = questions[index];

  return (
    <div className="practice-question-card">
      <p className="practice-count">
        Question {index + 1} of {questions.length}
      </p>
      <h2>
        <span aria-hidden="true">🎧</span> Listen, then pick the meaning.
      </h2>

      <div className="listen-buttons">
        <button type="button" className="listen-button" onClick={() => speakKorean(question.prompt)}>
          <span aria-hidden="true">🔊</span> Play
        </button>
        <button
          type="button"
          className="listen-button listen-button-slow"
          onClick={() => speakKorean(question.prompt, { slow: true })}
        >
          <span aria-hidden="true">🐢</span> Slow
        </button>
      </div>

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
          onAnswered(index + 1);
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
  onProgress?: (share: number) => void; // 0–1, for the lesson's progress bar
};

export default function ReviewActivities({
  review,
  showRomanization,
  finishLabel,
  onComplete,
  onProgress,
}: ReviewActivitiesProps) {
  const [part, setPart] = useState<"cards" | "listening" | "score">("cards");
  const [score, setScore] = useState(0);
  const [listened, setListened] = useState(0); // listening questions finished
  const total = review.listening.length;

  // Flashcards are the first quarter; the listening questions are the rest.
  const share = part === "cards" ? 0 : part === "score" ? 1 : 0.25 + 0.75 * (listened / Math.max(1, total));
  useEffect(() => {
    onProgress?.(share);
  }, [share, onProgress]);

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
        <ProgressBar
          label="Listening progress"
          percent={progressPercent(listened, total)}
          detail={`${listened} of ${total} answered`}
        />
        <Listening
          questions={review.listening}
          onAnswered={setListened}
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
          setListened(0);
          setPart("cards");
        }}
      >
        Review again
      </button>
    </div>
  );
}
