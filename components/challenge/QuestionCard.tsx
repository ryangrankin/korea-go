"use client";

/*
  QuestionCard: shows one skill check question and collects the answer.
  - Pick-one questions ("choice", "scenario", "listening"): tap an option.
  - "match": tap a Korean word, then tap its meaning.
  - "order": tap words to build the sentence, then Check.
  Once answered, it shows right or wrong (in words and with ✓ / ✗, not
  just color), the right answer, and the explanation. The parent
  (ChallengeRunner) scores it; the answer can't be changed afterwards.
*/

import { useState } from "react";
import Image from "next/image";
import type { ChallengeQuestion, MatchQuestion, OrderQuestion, PickQuestion } from "../../data/skillChecks";
import { isCorrect, type Answer } from "../../lib/skillChecks";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";

// `order` is the mixed-up order to show things in, picked when the
// challenge starts: options (pick-one), meanings (match), or tiles (order).
export type PreparedQuestion = { question: ChallengeQuestion; order: string[] };

type QuestionCardProps = {
  prepared: PreparedQuestion;
  answer: Answer | undefined; // set once answered
  onAnswer: (answer: Answer) => void;
};

const TYPE_LABELS: Record<ChallengeQuestion["type"], string> = {
  choice: "Quick question",
  scenario: "In real life",
  listening: "Listen",
  match: "Match",
  order: "Build the sentence",
};

export default function QuestionCard({ prepared, answer, onAnswer }: QuestionCardProps) {
  const { question, order } = prepared;
  const answered = answer !== undefined;
  const right = answered && isCorrect(question, answer);

  return (
    <div className="challenge-question" data-question-id={question.id}>
      <p className="challenge-type">{TYPE_LABELS[question.type]}</p>

      {question.image && <Image src={question.image} alt="" width={120} height={90} className="challenge-image" />}
      <h2 className="challenge-prompt">
        {question.emoji && (
          <span className="challenge-emoji" aria-hidden="true">
            {question.emoji}{" "}
          </span>
        )}
        {question.prompt}
      </h2>

      {question.type === "match" ? (
        <MatchInput key={question.id} question={question} meanings={order} answer={answer} onAnswer={onAnswer} />
      ) : question.type === "order" ? (
        <OrderInput key={question.id} question={question} tiles={order} answer={answer} onAnswer={onAnswer} />
      ) : (
        <PickInput key={question.id} question={question} options={order} answer={answer} onAnswer={onAnswer} />
      )}

      {!answered && question.hint && <p className="challenge-hint">💡 {question.hint}</p>}

      {answered && (
        <div className={`feedback ${right ? "feedback-right" : "feedback-wrong"}`} role="status">
          <p>
            <strong>{right ? "✓ That's right! " : "✗ Not quite. "}</strong>
            {!right && <RightAnswer question={question} />}
          </p>
          <p>{question.explanation}</p>
        </div>
      )}
    </div>
  );
}

// "The answer is ..." for a wrong try.
function RightAnswer({ question }: { question: ChallengeQuestion }) {
  if (question.type === "match") return <>Here are the right pairs.</>;
  if (question.type === "order") {
    return (
      <>
        The sentence is <span lang="ko">{question.words.join(" ")}</span>.{" "}
      </>
    );
  }
  return (
    <>
      The answer is <strong>{question.answer}</strong>.{" "}
    </>
  );
}

// ---------- Pick one ----------
function PickInput({
  question,
  options,
  answer,
  onAnswer,
}: {
  question: PickQuestion;
  options: string[];
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
}) {
  const [showText, setShowText] = useState(false);
  const answered = answer !== undefined;

  return (
    <>
      {question.korean && (
        <p className="challenge-korean">
          <KoreanText text={question.korean} />
        </p>
      )}

      {question.type === "listening" && question.audio && (
        <div className="challenge-listen">
          <button type="button" className="challenge-play" onClick={() => speakKorean(question.audio!)}>
            <span aria-hidden="true">🔊</span> Play
          </button>
          {showText || answered ? (
            <p className="challenge-korean" lang="ko">
              {question.audio}
            </p>
          ) : (
            <button type="button" className="link-button" onClick={() => setShowText(true)}>
              Can&apos;t play sound? Show the words
            </button>
          )}
        </div>
      )}

      <div className="practice-options" role="group" aria-label="Answers">
        {options.map((option) => {
          const isAnswer = option === question.answer;
          const picked = option === answer;
          const mark = answered ? (isAnswer ? "correct" : picked ? "wrong" : "") : "";
          return (
            <button
              key={option}
              type="button"
              lang={/[가-힣ㄱ-ㆎ]/.test(option) ? "ko" : undefined}
              className={`practice-option ${mark}`}
              disabled={answered}
              onClick={() => onAnswer(option)}
            >
              {answered && isAnswer && <span aria-hidden="true">✓ </span>}
              {answered && picked && !isAnswer && <span aria-hidden="true">✗ </span>}
              {option}
              {answered && picked && <span className="visually-hidden"> (your answer)</span>}
              {answered && isAnswer && <span className="visually-hidden"> (right answer)</span>}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ---------- Match ----------
function MatchInput({
  question,
  meanings,
  answer,
  onAnswer,
}: {
  question: MatchQuestion;
  meanings: string[];
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
}) {
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const answered = answer !== undefined;
  const shown = answered ? (answer as Record<string, string>) : pairs;

  // Number each Korean word so its matched meaning shows the same number.
  const numberOf = (korean: string) => question.pairs.findIndex((pair) => pair.korean === korean) + 1;
  const koreanFor = (english: string) => Object.keys(shown).find((korean) => shown[korean] === english);

  function pickKorean(korean: string) {
    speakKorean(korean);
    setSelected(selected === korean ? null : korean);
  }

  function pickMeaning(english: string) {
    if (!selected) return;
    setPairs((current) => {
      const next: Record<string, string> = {};
      // A meaning can only belong to one word.
      for (const [korean, meaning] of Object.entries(current)) {
        if (meaning !== english && korean !== selected) next[korean] = meaning;
      }
      next[selected] = english;
      return next;
    });
    setSelected(null);
  }

  const allMatched = question.pairs.every((pair) => pairs[pair.korean]);

  return (
    <>
      <p className="challenge-instructions">
        {answered ? "How you matched them:" : "Tap a Korean word, then tap its meaning."}
      </p>
      <div className="match-columns">
        <ul className="match-column" aria-label="Korean words">
          {question.pairs.map((pair) => {
            const matched = shown[pair.korean];
            const right = matched === pair.english;
            return (
              <li key={pair.korean}>
                <button
                  type="button"
                  lang="ko"
                  className={`match-tile ${selected === pair.korean ? "selected" : ""} ${
                    answered ? (right ? "correct" : "wrong") : matched ? "paired" : ""
                  }`}
                  aria-pressed={selected === pair.korean}
                  disabled={answered}
                  onClick={() => pickKorean(pair.korean)}
                >
                  <span className="match-number" aria-hidden="true">
                    {numberOf(pair.korean)}
                  </span>
                  {pair.korean}
                  {matched && <span className="match-pairing">= {matched}</span>}
                  {answered && (
                    <span className="match-result">
                      {right ? "✓" : `✗ means "${pair.english}"`}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {!answered && (
          <ul className="match-column" aria-label="Meanings">
            {meanings.map((english) => {
              const korean = koreanFor(english);
              return (
                <li key={english}>
                  <button
                    type="button"
                    className={`match-tile ${korean ? "paired" : ""}`}
                    disabled={!selected}
                    onClick={() => pickMeaning(english)}
                  >
                    {korean && (
                      <span className="match-number" aria-label={`matched to ${korean}`}>
                        {numberOf(korean)}
                      </span>
                    )}
                    {english}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {!answered && (
        <div className="challenge-actions">
          <button type="button" className="secondary-button" onClick={() => setPairs({})} disabled={Object.keys(pairs).length === 0}>
            Clear
          </button>
          <button type="button" className="practice-next-button" disabled={!allMatched} onClick={() => onAnswer(pairs)}>
            Check
          </button>
        </div>
      )}
    </>
  );
}

// ---------- Put in order ----------
function OrderInput({
  question,
  tiles,
  answer,
  onAnswer,
}: {
  question: OrderQuestion;
  tiles: string[];
  answer: Answer | undefined;
  onAnswer: (answer: Answer) => void;
}) {
  const [chosen, setChosen] = useState<number[]>([]); // positions in `tiles`, in sentence order
  const answered = answer !== undefined;
  const built = answered ? (answer as string[]) : chosen.map((id) => tiles[id]);

  function add(id: number) {
    speakKorean(tiles[id]);
    setChosen((current) => (current.includes(id) ? current : [...current, id]));
  }

  return (
    <>
      <p className="challenge-instructions">
        Make: <strong>{question.english}</strong>
      </p>

      <div className={`builder-sentence ${answered ? (isCorrect(question, answer) ? "right" : "wrong") : ""}`} aria-live="polite">
        <span className="visually-hidden">Your sentence:</span>
        {built.length === 0 ? (
          <span className="builder-placeholder">Tap the words below in order</span>
        ) : answered ? (
          <span lang="ko">{built.join(" ")}</span>
        ) : (
          chosen.map((id) => (
            <button
              key={id}
              type="button"
              lang="ko"
              className="builder-tile in-sentence"
              onClick={() => setChosen((current) => current.filter((c) => c !== id))}
              aria-label={`${tiles[id]}, tap to remove`}
            >
              {tiles[id]}
            </button>
          ))
        )}
      </div>

      {!answered && (
        <>
          <p className="builder-label">Word bank</p>
          <div className="builder-bank">
            {tiles.map((tile, id) =>
              chosen.includes(id) ? (
                <span key={id} className="builder-tile used" aria-hidden="true">
                  {tile}
                </span>
              ) : (
                <button key={id} type="button" lang="ko" className="builder-tile" onClick={() => add(id)}>
                  {tile}
                </button>
              )
            )}
          </div>

          <div className="challenge-actions">
            <button type="button" className="secondary-button" onClick={() => setChosen([])} disabled={chosen.length === 0}>
              Clear
            </button>
            <button
              type="button"
              className="practice-next-button"
              disabled={chosen.length === 0}
              onClick={() => onAnswer(chosen.map((id) => tiles[id]))}
            >
              Check
            </button>
          </div>
        </>
      )}
    </>
  );
}
