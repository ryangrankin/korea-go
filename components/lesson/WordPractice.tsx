"use client";

/*
  WordPractice: learn a section's words a few at a time.
  1. A new word is shown with its picture, sound, and meaning.
  2. It comes back as quick questions, asked different ways:
       see the Korean → pick the meaning
       see the meaning → pick the Korean
       hear it        → pick the meaning
  3. Each new word must be answered right a few times (correctToLearn).
     A missed word is shown again right away, then keeps coming back
     until it has been answered right repeatsAfterMiss more times.
  How many words at a time, how many right answers, how many choices, and
  which questions come first all follow the learner's Settings (see
  lib/learningSettings.ts). The rules themselves live in lib/wordPractice.ts.
  The progress bar counts answered questions, and never goes backwards.
*/

import { useRef, useState } from "react";
import type { PracticeSettings } from "../../lib/learningSettings";
import {
  applyAnswer,
  initialPracticeState,
  nextCard,
  practiceProgress,
  type PracticeCard,
  type PracticeState,
} from "../../lib/wordPractice";
import { sayOf, type PracticeWord } from "../../lib/practiceItems";
import { keepTopInView } from "../../lib/scroll";
import { speakKorean } from "../../lib/speak";
import { vowelStrokes } from "../../data/strokes";
import AudioButtons from "../AudioButtons";
import VowelDiagram from "./VowelDiagram";
import KoreanText from "../KoreanText";
import Pup from "../Pup";

type WordPracticeProps = {
  words: PracticeWord[];
  showRomanization: boolean;
  settings: PracticeSettings; // from the learner's Settings
  noun?: string; // what to call them on screen, e.g. "letters and words"
  finishLabel: string;
  onFinish: () => void;
};

const PRAISE = ["Nice!", "Great job!", "That's it!", "Perfect!", "You got it!"];

// ---------- The component ----------
export default function WordPractice({
  words,
  showRomanization,
  settings,
  noun = "words",
  finishLabel,
  onFinish,
}: WordPracticeProps) {
  const [started, setStarted] = useState(false);
  const [card, setCard] = useState<PracticeCard | null>(null);
  const [progress, setProgress] = useState<PracticeState>(() => initialPracticeState(words.length));
  const [picked, setPicked] = useState<number | null>(null);
  const [showText, setShowText] = useState(false); // listening backup
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);

  const { answered, learned, remaining, percent } = practiceProgress(progress, words.length, settings);
  const finished = started && card === null;

  // Romanization always shows when it IS the meaning (letters).
  const romanizationOf = (word: PracticeWord) =>
    (showRomanization || word.meaning === word.romanization) && word.romanization;
  // In questions, romanization is a pronunciation hint — but never when it
  // IS the answer (letters, where the meaning is the sound).
  const hintFor = (word: PracticeWord) =>
    showRomanization && word.meaning !== word.romanization ? word.romanization : undefined;

  function advance() {
    const next = nextCard(words, progress, settings);
    setStarted(true);
    setCard(next.card);
    setProgress(next.state);
    setPicked(null);
    setShowText(false);
    // Play new words and listening questions right away.
    if (next.card && (next.card.kind === "intro" || next.card.quiz === "listen")) {
      speakKorean(sayOf(words[next.card.word]));
    }
    keepTopInView(boxRef.current);
  }

  function answer(option: number) {
    if (picked !== null || card?.kind !== "quiz") return;
    const word = card.word;
    const right = option === word;
    setPicked(option);
    speakKorean(sayOf(words[word]));

    if (right) {
      setRightCount(rightCount + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
    } else {
      setStreak(0);
      if (!missed.includes(word)) setMissed([...missed, word]);
    }
    setProgress(applyAnswer(progress, word, right, settings, words.length));
  }

  // ----- Start screen -----
  if (!started) {
    return (
      <div className="lesson-content-card wp-start">
        <Pup size={110} className="pup-center" />
        <h2>
          Learn {words.length} new {noun}
        </h2>
        <p>
          We&apos;ll show you a few at a time, then quiz you. Miss one and it comes back until it
          sticks.
        </p>
        <button type="button" className="practice-next-button" onClick={advance}>
          Start →
        </button>
      </div>
    );
  }

  // ----- Finish screen -----
  if (finished) {
    const accuracy = answered === 0 ? 100 : Math.round((rightCount / answered) * 100);
    return (
      <div className="lesson-content-card wp-finish">
        <Pup size={110} className="pup-center pup-celebrate" />
        <h2>
          You learned all {words.length} {noun}!
        </h2>

        <div className="wp-stats">
          <div>
            <strong>{accuracy}%</strong>
            <span>right answers</span>
          </div>
          <div>
            <strong>🔥 {bestStreak}</strong>
            <span>best streak</span>
          </div>
        </div>

        {missed.length > 0 ? (
          <>
            <h3>Keep an eye on these</h3>
            <ul className="wp-missed">
              {missed.map((index) => (
                <li key={index}>
                  <span aria-hidden="true">{words[index].emoji}</span>
                  <KoreanText text={words[index].korean} say={sayOf(words[index])} />
                  <span className="english">{words[index].meaning}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No misses — perfect! ⭐</p>
        )}

        <button type="button" className="practice-next-button" onClick={onFinish}>
          {finishLabel}
        </button>
      </div>
    );
  }

  if (!card) return null;
  const word = words[card.word];

  return (
    <div ref={boxRef}>
      {/* Progress: questions answered (never goes backwards), and words learned */}
      <div className="wp-header">
        <div
          className="lesson-progress-track"
          role="progressbar"
          aria-label="Word practice progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={percent}
        >
          <div className="lesson-progress-fill" style={{ width: `${percent}%` }} />
        </div>
        {streak >= 2 && <span className="wp-streak">🔥 {streak}</span>}
      </div>
      <p className="wp-count">
        {answered} {answered === 1 ? "question" : "questions"} answered
        {remaining > 0 && ` · about ${remaining} to go`} · {learned} of {words.length} {noun} learned
      </p>

      {/* ----- New word ----- */}
      {card.kind === "intro" && (
        <div className="wp-card">
          <span className="wp-badge">✨ New</span>
          {vowelStrokes[word.korean] ? (
            <VowelDiagram letter={word.korean} size={110} />
          ) : (
            <div className="wp-big-emoji" aria-hidden="true">{word.emoji}</div>
          )}
          <KoreanText text={word.korean} say={sayOf(word)} className="wp-korean" />
          {romanizationOf(word) && <p className="romanization">{word.romanization}</p>}
          <AudioButtons text={sayOf(word)} />
          <p className="wp-meaning">{word.english}</p>
          {word.example && (
            <p className="word-example">
              e.g. <span lang="ko">{word.example.korean}</span> — {word.example.english}
            </p>
          )}
          <button type="button" className="practice-next-button" onClick={advance}>
            Got it →
          </button>
        </div>
      )}

      {/* ----- Question ----- */}
      {card.kind === "quiz" && (
        <div className="wp-card">
          {card.quiz === "meaning" && (
            <>
              <p className="wp-prompt">What does this mean?</p>
              <KoreanText text={word.korean} say={sayOf(word)} className="wp-korean" />
              {hintFor(word) && <p className="romanization">{hintFor(word)}</p>}
            </>
          )}
          {card.quiz === "korean" && (
            <>
              <p className="wp-prompt">Which one is this?</p>
              <div className="wp-big-emoji" aria-hidden="true">{word.emoji}</div>
              <p className="wp-meaning">{word.meaning}</p>
            </>
          )}
          {card.quiz === "listen" && (
            <>
              <p className="wp-prompt">
                <span aria-hidden="true">🎧</span> Listen. What does it mean?
              </p>
              <div className="wp-listen-row">
                <button
                  type="button"
                  className="wp-listen"
                  onClick={() => speakKorean(sayOf(word))}
                  aria-label="Play the word again"
                >
                  🔊
                </button>
                <button
                  type="button"
                  className="wp-listen wp-listen-slow"
                  onClick={() => speakKorean(sayOf(word), { slow: true })}
                  aria-label="Play the word slowly"
                >
                  🐢
                </button>
              </div>
              {showText || picked !== null ? (
                <p className="listen-text" lang="ko">{word.korean}</p>
              ) : (
                <button type="button" className="link-button" onClick={() => setShowText(true)}>
                  Can&apos;t hear it? Show the word
                </button>
              )}
            </>
          )}

          <div className={`wp-options ${card.quiz === "korean" ? "wp-options-korean" : ""}`}>
            {card.options.map((option) => {
              const optionWord = words[option];
              let state = "";
              if (picked !== null && option === card.word) state = "correct";
              else if (option === picked) state = "wrong";
              // Korean choices: show how to say them, and let the learner
              // hear each one (its own 🔊) before choosing.
              if (card.quiz === "korean") {
                const romanization = hintFor(optionWord);
                return (
                  <div key={option} className="practice-option-row">
                    <button
                      type="button"
                      className={`practice-option ${state}`}
                      lang="ko"
                      disabled={picked !== null && state === ""}
                      onClick={() => answer(option)}
                    >
                      {optionWord.korean}
                      {romanization && <span className="option-romanization">{romanization}</span>}
                    </button>
                    <button
                      type="button"
                      className="option-audio"
                      onClick={() => speakKorean(sayOf(optionWord))}
                      aria-label={`Hear: ${optionWord.korean}`}
                    >
                      <span aria-hidden="true">🔊</span>
                    </button>
                  </div>
                );
              }
              return (
                <button
                  key={option}
                  type="button"
                  className={`practice-option ${state}`}
                  disabled={picked !== null && state === ""}
                  onClick={() => answer(option)}
                >
                  {optionWord.meaning}
                </button>
              );
            })}
          </div>

          {/* Right: quick praise. Wrong: show the word again to review. */}
          {picked !== null && picked === card.word && (
            <p className="feedback feedback-right" role="status">
              {PRAISE[answered % PRAISE.length]}
            </p>
          )}
          {picked !== null && picked !== card.word && (
            <div className="feedback feedback-wrong wp-review" role="status">
              <p>Not quite — let&apos;s look at this one again. You&apos;ll see it a few more times.</p>
              <div className="wp-review-word">
                <span className="wp-review-emoji" aria-hidden="true">{word.emoji}</span>
                <div>
                  <KoreanText text={word.korean} say={sayOf(word)} />
                  {romanizationOf(word) && <p className="romanization">{word.romanization}</p>}
                  <p className="english">{word.english}</p>
                </div>
              </div>
            </div>
          )}
          {picked !== null && (
            <button type="button" className="practice-next-button" onClick={advance}>
              Continue →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
