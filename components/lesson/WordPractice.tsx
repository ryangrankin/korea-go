"use client";

/*
  WordPractice: learn a section's words a few at a time.
  1. A new word is shown with its picture, sound, and meaning.
  2. It comes back as quick questions, asked different ways:
       see the Korean → pick the meaning
       see the meaning → pick the Korean
       hear it        → pick the meaning
  3. Each new word must be answered right CORRECT_TO_LEARN times.
     A missed word is shown again right away, then keeps coming back
     until it has been answered right REPEATS_AFTER_MISS more times.
*/

import { useState } from "react";
import { sayOf, type PracticeWord } from "../../lib/practiceItems";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";

type WordPracticeProps = {
  words: PracticeWord[];
  showRomanization: boolean;
  noun?: string; // what to call them on screen, e.g. "letters and words"
  finishLabel: string;
  onFinish: () => void;
};

// ---------- Settings ----------
const NEW_AT_ONCE = 3; // how many new words are being learned at the same time
const CORRECT_TO_LEARN = 2; // right answers needed to learn a new word
const REPEATS_AFTER_MISS = 3; // right answers needed again after a miss
const GAP_AFTER_RIGHT = 3; // other cards shown before a word comes back
const GAP_AFTER_MISS = 2;

const PRAISE = ["Nice!", "Great job!", "That's it!", "Perfect!", "You got it!"];

type QuizKind = "meaning" | "korean" | "listen";
const QUIZ_ORDER: QuizKind[] = ["meaning", "korean", "listen"];

type Card =
  | { kind: "intro"; word: number }
  | { kind: "quiz"; word: number; quiz: QuizKind; options: number[] };

type Progress = {
  queue: number[]; // words waiting to be quizzed, in order
  needed: number[]; // right answers each word still needs
  timesRight: number[]; // right answers so far (picks the question type)
  nextNew: number; // the next word to introduce
};

// ---------- Helpers ----------
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Put a word back into the queue, `gap` cards from the front.
function insertAt(queue: number[], word: number, gap: number): number[] {
  const copy = [...queue];
  copy.splice(Math.min(gap, copy.length), 0, word);
  return copy;
}

// The right answer plus up to 3 wrong ones, mixed up.
function pickOptions(words: PracticeWord[], index: number): number[] {
  const target = words[index];
  const differs = (i: number) =>
    i !== index && words[i].meaning !== target.meaning && words[i].korean !== target.korean;
  const all = words.map((_, i) => i).filter(differs);
  const sameGroup = all.filter((i) => words[i].group === target.group);
  const pool = sameGroup.length >= 2 ? sameGroup : all;
  return shuffle([index, ...shuffle(pool).slice(0, 3)]);
}

// Decide what to show next: a new word, or the next word in the queue.
function nextCard(words: PracticeWord[], progress: Progress): { card: Card | null; progress: Progress } {
  const learning = progress.needed.slice(0, progress.nextNew).filter((n) => n > 0).length;
  const hasNew = progress.nextNew < words.length;

  if (hasNew && (learning < NEW_AT_ONCE || progress.queue.length === 0)) {
    const word = progress.nextNew;
    const needed = [...progress.needed];
    needed[word] = CORRECT_TO_LEARN;
    return {
      card: { kind: "intro", word },
      progress: { ...progress, needed, nextNew: word + 1, queue: insertAt(progress.queue, word, 1) },
    };
  }

  if (progress.queue.length === 0) return { card: null, progress };

  const [word, ...rest] = progress.queue;
  const quiz = QUIZ_ORDER[progress.timesRight[word] % QUIZ_ORDER.length];
  return {
    card: { kind: "quiz", word, quiz, options: pickOptions(words, word) },
    progress: { ...progress, queue: rest },
  };
}

// ---------- The component ----------
export default function WordPractice({
  words,
  showRomanization,
  noun = "words",
  finishLabel,
  onFinish,
}: WordPracticeProps) {
  const [started, setStarted] = useState(false);
  const [card, setCard] = useState<Card | null>(null);
  const [progress, setProgress] = useState<Progress>({
    queue: [],
    needed: words.map(() => 0),
    timesRight: words.map(() => 0),
    nextNew: 0,
  });
  const [picked, setPicked] = useState<number | null>(null);
  const [showText, setShowText] = useState(false); // listening backup
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);

  const learned = progress.needed.slice(0, progress.nextNew).filter((n) => n === 0).length;
  const finished = started && card === null;

  // Romanization always shows when it IS the meaning (letters).
  const romanizationOf = (word: PracticeWord) =>
    (showRomanization || word.meaning === word.romanization) && word.romanization;

  function advance() {
    const next = nextCard(words, progress);
    setStarted(true);
    setCard(next.card);
    setProgress(next.progress);
    setPicked(null);
    setShowText(false);
    // Play new words and listening questions right away.
    if (next.card && (next.card.kind === "intro" || next.card.quiz === "listen")) {
      speakKorean(sayOf(words[next.card.word]));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function answer(option: number) {
    if (picked !== null || card?.kind !== "quiz") return;
    const word = card.word;
    const right = option === word;
    setPicked(option);
    speakKorean(sayOf(words[word]));
    setAnswered(answered + 1);

    const needed = [...progress.needed];
    const timesRight = [...progress.timesRight];
    let queue = progress.queue;

    if (right) {
      setRightCount(rightCount + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
      timesRight[word] += 1;
      needed[word] -= 1;
      if (needed[word] > 0) queue = insertAt(queue, word, GAP_AFTER_RIGHT);
    } else {
      setStreak(0);
      if (!missed.includes(word)) setMissed([...missed, word]);
      timesRight[word] = 0; // start again with the easiest kind of question
      needed[word] = REPEATS_AFTER_MISS;
      queue = insertAt(queue, word, GAP_AFTER_MISS);
    }
    setProgress({ ...progress, needed, timesRight, queue });
  }

  // ----- Start screen -----
  if (!started) {
    return (
      <div className="lesson-content-card wp-start">
        <div className="wp-big-emoji" aria-hidden="true">🧠</div>
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
        <div className="wp-big-emoji" aria-hidden="true">🎉</div>
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
    <div>
      {/* Progress bar and streak */}
      <div className="wp-header">
        <div className="lesson-progress-track">
          <div className="lesson-progress-fill" style={{ width: `${(learned / words.length) * 100}%` }} />
        </div>
        <span className="wp-count">
          {learned}/{words.length}
        </span>
        {streak >= 2 && <span className="wp-streak">🔥 {streak}</span>}
      </div>

      {/* ----- New word ----- */}
      {card.kind === "intro" && (
        <div className="wp-card">
          <span className="wp-badge">✨ New</span>
          <div className="wp-big-emoji" aria-hidden="true">{word.emoji}</div>
          <KoreanText text={word.korean} say={sayOf(word)} className="wp-korean" />
          {romanizationOf(word) && <p className="romanization">{word.romanization}</p>}
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
              <p className="wp-prompt">Listen. What does it mean?</p>
              <button
                type="button"
                className="wp-listen"
                onClick={() => speakKorean(sayOf(word))}
                aria-label="Play the word again"
              >
                🔊
              </button>
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
              return (
                <button
                  key={option}
                  type="button"
                  className={`practice-option ${state}`}
                  lang={card.quiz === "korean" ? "ko" : undefined}
                  disabled={picked !== null && state === ""}
                  onClick={() => answer(option)}
                >
                  {card.quiz === "korean" ? (
                    optionWord.korean
                  ) : (
                    <>
                      <span aria-hidden="true">{optionWord.emoji} </span>
                      {optionWord.meaning}
                    </>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: quick praise. Wrong: show the word again to review. */}
          {picked !== null && picked === card.word && (
            <p className="feedback feedback-right" role="status">
              ✅ {PRAISE[answered % PRAISE.length]}
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
