"use client";

/*
  CultureGame: plays any game from data/culturalGames.ts.

  Three kinds of game:
  - "quiz"     (Food, Music, Fashion): pick an answer. A wrong pick shows why
               and you can try again as many times as you like (or ask to
               see the answer).
  - "scenario" (Manners & Etiquette): pick what you'd do. Every choice gets
               an explanation, you can read about all of them, try another,
               or continue.
  - "story"    (A Day in Seoul): rounds stay in order, like a story. Each
               round is a sentence to build from a word bank (SentenceBuilder).
               Wrong tries give a hint and you try again.

  Every round ends with a cultural fact. Finishing a game adds points to
  the Friends leaderboard (lib/gameScores.ts): 100 for each round right on
  the first try, 50 for the rest. Nothing is ever taken away.
*/

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Choice, CultureGame as Game, Picture } from "../../data/culturalGames";
import { recordGameResult } from "../../lib/gameScores";
import { useShowRomanization } from "../../lib/preferences";
import { keepTopInView } from "../../lib/scroll";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";
import Pup from "../Pup";
import SentenceBuilder from "./SentenceBuilder";
import SpeechNotice from "../SpeechNotice";
import "../lesson/lesson.css";
import "./games.css";

// ---------- Helpers ----------
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// The time right now (only called from taps, never while drawing).
function clock(): number {
  return Date.now();
}

// Korean-only text can be played aloud; mixed English + Korean can't.
const isKorean = (text: string) => /[가-힣]/.test(text) && !/[A-Za-z]/.test(text);

// ---------- The picture at the top of each round ----------
// The drawing (or emoji) with the mascot pup in the bottom-left corner.
// The pup hops when the round is answered.
function RoundPicture({ picture, cheer }: { picture: Picture; cheer: boolean }) {
  return (
    <figure className="culture-picture">
      <div className={`culture-photo ${picture.image ? "" : "culture-photo-emoji"}`}>
        {picture.image ? (
          <Image
            src={picture.image}
            alt={picture.alt}
            fill
            sizes="(max-width: 430px) 100vw, 400px"
            unoptimized={picture.image.endsWith(".svg")}
          />
        ) : (
          <span className="culture-emoji" role="img" aria-label={picture.alt}>
            {picture.emoji}
          </span>
        )}
        <div className={`culture-pup ${cheer ? "pup-celebrate" : ""}`}>
          <Pup size={92} />
        </div>
      </div>
      {picture.caption && <figcaption>{picture.caption}</figcaption>}
      {picture.credit && <small className="culture-credit">Photo: {picture.credit}</small>}
    </figure>
  );
}

// ---------- The game ----------
export default function CultureGame({ game }: { game: Game }) {
  const showRomanization = useShowRomanization();

  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [order, setOrder] = useState<number[]>([]); // which round comes when
  const [position, setPosition] = useState(0);
  const [choiceOrder, setChoiceOrder] = useState<number[]>([]); // mixed-up choices
  const [tileOrder, setTileOrder] = useState<number[]>([]); // mixed-up word bank
  const [picked, setPicked] = useState<string[]>([]); // every choice tried this round
  const [current, setCurrent] = useState<string | null>(null); // the choice being explained
  const [solved, setSolved] = useState(false);
  const [showAll, setShowAll] = useState(false); // scenario: explain every choice
  const [firstTry, setFirstTry] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const roundRef = useRef<HTMLDivElement>(null);

  const round = game.rounds[order[position] ?? 0];
  const choices = round.choices ?? [];
  const answer = round.answer ?? "";
  const isLast = position === order.length - 1;
  const scenario = game.kind === "scenario";

  // Get a round ready: mix up its choices and clear the last round's picks.
  function setUpRound(roundIndex: number) {
    const next = game.rounds[roundIndex];
    setChoiceOrder(shuffle((next.choices ?? []).map((_, i) => i)));
    const tileCount = next.build ? next.build.words.length + next.build.extra.length : 0;
    setTileOrder(shuffle(Array.from({ length: tileCount }, (_, i) => i)));
    setPicked([]);
    setCurrent(null);
    setSolved(false);
    setShowAll(false);
  }

  function start() {
    // Stories stay in order; quizzes and scenarios are mixed up each time.
    const indexes = game.rounds.map((_, i) => i);
    const newOrder = game.kind === "story" ? indexes : shuffle(indexes);
    setOrder(newOrder);
    setPosition(0);
    setFirstTry(0);
    setStartedAt(clock());
    setPhase("play");
    setUpRound(newOrder[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // The learner picks a choice.
  function pick(choice: Choice) {
    if (current !== null && (scenario || solved)) return; // waiting for Continue / Try again
    if (picked.includes(choice.text)) return;
    if (isKorean(choice.text)) speakKorean(choice.text);

    const right = choice.text === answer;
    if (right && picked.length === 0) setFirstTry(firstTry + 1);
    setPicked([...picked, choice.text]);
    setCurrent(choice.text);
    if (right) setSolved(true);
  }

  // Quiz and story: reveal the answer without counting it as first try.
  function showAnswer() {
    setPicked(picked.includes(answer) ? picked : [...picked, answer]);
    setCurrent(answer);
    setSolved(true);
  }

  function next() {
    if (!isLast) {
      setPosition(position + 1);
      setUpRound(order[position + 1]);
      keepTopInView(roundRef.current);
      return;
    }
    // Game over: save points for the Friends leaderboard.
    const total = game.rounds.length;
    const points = firstTry * 100 + (total - firstTry) * 50;
    recordGameResult({
      game: "culture",
      setId: game.id,
      pairs: total,
      mistakes: total - firstTry,
      seconds: Math.floor((clock() - startedAt) / 1000),
      points,
    });
    setPointsEarned(points);
    setPhase("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ----- Start screen -----
  if (phase === "intro") {
    return (
      <div className="lesson-content-card culture-intro">
        <div className="culture-emoji" aria-hidden="true">{game.emoji}</div>
        <p>{game.intro}</p>
        <p className="practice-count">
          {game.rounds.length} {game.kind === "story" ? "stops" : "rounds"} · no penalties, try as often as you like
        </p>
        <button type="button" className="practice-next-button" onClick={start}>
          Start ▶
        </button>
      </div>
    );
  }

  // ----- Finished -----
  if (phase === "done") {
    // Korean from the right answers (and built sentences), to look back over.
    type Met = { text: string; romanization?: string; english?: string };
    const koreanMet: Met[] = game.rounds
      .map((r): Met | undefined =>
        r.build
          ? { text: r.build.words.join(" "), romanization: r.build.romanization, english: r.build.english }
          : r.choices?.find((c) => c.text === r.answer)
      )
      .filter((c): c is Met => !!c && isKorean(c.text));

    return (
      <div className="lesson-content-card culture-done">
        <Pup size={120} className="pup-celebrate" />
        <h2>{game.title}: complete! 🎉</h2>
        <p className="culture-outro">{game.outro}</p>
        <p className="match-points">+{pointsEarned.toLocaleString()} points</p>
        <p className="practice-count">
          {firstTry} of {game.rounds.length} right on the first try
        </p>

        {koreanMet.length > 0 && (
          <>
            <h3>Korean you met</h3>
            <ul className="culture-recap">
              {koreanMet.map((choice) => (
                <li key={choice.text}>
                  <KoreanText text={choice.text} />
                  {showRomanization && choice.romanization && (
                    <span className="romanization">{choice.romanization}</span>
                  )}
                  {choice.english && <span className="english">{choice.english}</span>}
                </li>
              ))}
            </ul>
          </>
        )}

        <button type="button" className="practice-next-button" onClick={start}>
          Play again
        </button>
        <Link href="/games" className="secondary-button culture-back">
          Back to Games
        </Link>
        <Link href="/friends" className="match-leaderboard-link">
          See the leaderboard →
        </Link>
      </div>
    );
  }

  // ----- Playing a round -----
  const currentChoice = choices.find((c) => c.text === current);
  const currentRight = current === answer;
  const choicesLocked = scenario ? current !== null : solved;

  return (
    <div className="culture-round" ref={roundRef}>
      {/* Progress */}
      <div className="culture-progress">
        <span>{round.place ?? `Round ${position + 1} of ${order.length}`}</span>
        <div className="lesson-progress-track">
          <div className="lesson-progress-fill" style={{ width: `${(position / order.length) * 100}%` }} />
        </div>
      </div>

      {/* Picture on the left, question on the right (laptops) */}
      <div className="culture-body">
        <div className="culture-stage">
          <RoundPicture
            // A new key per round restarts the pup's hop animation.
            key={`picture-${order[position]}`}
            picture={round.picture}
            cheer={solved}
          />

          {/* Story: what someone says to you */}
          {round.line && (
            <div className="culture-line">
              <p className="chat-name">{round.line.speaker}</p>
              <KoreanText text={round.line.korean} className="chat-korean" />
              {showRomanization && <p className="romanization">{round.line.romanization}</p>}
              <p className="english">{round.line.english}</p>
            </div>
          )}

        </div>

        <div className="culture-play">
          <h2 className="culture-prompt">{round.prompt}</h2>

          {/* Word bank: build a sentence */}
          {round.build && (
            <SentenceBuilder
              key={`build-${order[position]}`}
              build={round.build}
              order={tileOrder}
              showRomanization={showRomanization}
              onSolved={(first) => {
                if (first) setFirstTry(firstTry + 1);
                setSolved(true);
              }}
            />
          )}

          {/* Choices */}
          <div className="culture-choices">
            {choiceOrder.map((index) => {
              const choice = choices[index];
              const wasPicked = picked.includes(choice.text);
              const isAnswer = choice.text === answer;
              let state = "";
              if (wasPicked && isAnswer) state = "correct";
              else if (wasPicked) state = !scenario ? "wrong" : current === choice.text ? "selected" : "tried";

              return (
                <div key={choice.text} className="culture-choice-row">
                  <button
                    type="button"
                    className={`practice-option culture-choice ${state}`}
                    onClick={() => pick(choice)}
                    disabled={choicesLocked ? choice.text !== current : wasPicked}
                    aria-pressed={wasPicked}
                  >
                    <span lang={isKorean(choice.text) ? "ko" : undefined} className="culture-choice-text">
                      {choice.text}
                    </span>
                    {showRomanization && choice.romanization && (
                      <span className="romanization">{choice.romanization}</span>
                    )}
                    {(wasPicked || solved) && choice.english && (
                      <span className="culture-choice-english">{choice.english}</span>
                    )}
                  </button>
                  {isKorean(choice.text) && (
                    <button
                      type="button"
                      className="culture-audio"
                      onClick={() => speakKorean(choice.text)}
                      aria-label={`Hear ${choice.text}`}
                    >
                      🔊
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Feedback for the choice just picked */}
          {currentChoice && (
            <div
              className={`feedback ${currentRight ? "feedback-right" : scenario ? "feedback-think" : "feedback-wrong"}`}
              role="status"
            >
              <p>
                <strong>
                  {currentRight
                    ? scenario
                      ? "👍 A thoughtful choice. "
                      : "✅ "
                    : scenario
                    ? "🤔 Let's think about it. "
                    : "🤔 Not quite. "}
                </strong>
                {currentChoice.feedback}
                {!currentRight && !scenario && " Try another answer!"}
              </p>
            </div>
          )}

          {/* Quiz and story: ask for the answer after a wrong pick */}
          {!scenario && current !== null && !solved && (
            <button type="button" className="link-button" onClick={showAnswer}>
              Show me the answer
            </button>
          )}

          {/* Scenario: read about every choice */}
          {scenario && current !== null && (
            <>
              {showAll ? (
                <ul className="culture-all-reasons">
                  {choices.map((choice) => (
                    <li key={choice.text} className={choice.text === answer ? "best" : ""}>
                      <strong>{choice.text === answer ? "👍 " : "💭 "}{choice.text}</strong>
                      <span>{choice.feedback}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <button type="button" className="link-button" onClick={() => setShowAll(true)}>
                  See why each choice works or not
                </button>
              )}
            </>
          )}

          {/* Cultural fact, once the round is understood */}
          {(solved || (scenario && current !== null)) && (
            <div className="culture-fact">
              <strong>💡 Did you know?</strong>
              <p>{round.fact}</p>
            </div>
          )}

          {/* Moving on */}
          {scenario && current !== null && !currentRight && (
            <button type="button" className="secondary-button culture-retry" onClick={() => setCurrent(null)}>
              Try a different choice
            </button>
          )}
          {(solved || (scenario && current !== null)) && (
            <button type="button" className="practice-next-button" onClick={next}>
              {isLast ? "Finish ✓" : game.kind === "story" ? "Continue the day →" : "Next →"}
            </button>
          )}

        </div>
      </div>

      <SpeechNotice />
    </div>
  );
}
