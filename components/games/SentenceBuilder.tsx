"use client";

/*
  SentenceBuilder: build a Korean sentence from a word bank.
  - Tap a word in the bank to add it to your sentence (you hear it).
  - Tap a word in your sentence to put it back.
  - "Hear my sentence" plays what you've built; Submit checks it.
  A wrong try explains what's off (an extra word, a missing word, or the
  order) plus the round's hint. Tries are unlimited, and "Show me the
  answer" is always there.
*/

import { useState } from "react";
import type { Build } from "../../data/culturalGames";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";

type SentenceBuilderProps = {
  build: Build;
  order: number[]; // mixed-up order of the tiles (words, then extras)
  showRomanization: boolean;
  onSolved: (firstTry: boolean) => void;
};

type Status = "building" | "wrong" | "right" | "revealed";

export default function SentenceBuilder({ build, order, showRomanization, onSolved }: SentenceBuilderProps) {
  const tiles = [...build.words, ...build.extra]; // tile id = position in this list
  const [chosen, setChosen] = useState<number[]>([]); // tile ids, in sentence order
  const [status, setStatus] = useState<Status>("building");
  const [problem, setProblem] = useState("");
  const [tries, setTries] = useState(0);

  const done = status === "right" || status === "revealed";
  const sentence = (ids: number[]) => ids.map((id) => tiles[id]).join(" ");
  const answer = build.words.join(" ");

  function add(id: number) {
    if (done) return;
    speakKorean(tiles[id]);
    // Use the latest sentence, and never add the same tile twice (fast taps).
    setChosen((current) => (current.includes(id) ? current : [...current, id]));
    if (status === "wrong") setStatus("building");
  }

  function remove(id: number) {
    if (done) return;
    setChosen((current) => current.filter((chosenId) => chosenId !== id));
    if (status === "wrong") setStatus("building");
  }

  // Check the sentence, and explain what's off if it isn't right.
  function submit() {
    const words = chosen.map((id) => tiles[id]);
    if (words.join(" ") === answer) {
      setStatus("right");
      speakKorean(answer);
      onSolved(tries === 0);
      return;
    }

    const extraWord = words.find((word) => !build.words.includes(word));
    const missing = build.words.filter((word) => !words.includes(word)).length;
    if (extraWord) setProblem(`"${extraWord}" doesn't belong in this sentence.`);
    else if (missing > 0) setProblem(`Something's missing — this sentence needs ${build.words.length} words.`);
    else setProblem("You have all the right words! Try a different order.");
    setTries(tries + 1);
    setStatus("wrong");
  }

  function reveal() {
    setChosen(build.words.map((_, id) => id));
    setStatus("revealed");
    speakKorean(answer);
    onSolved(false);
  }

  return (
    <div className="builder">
      {/* The sentence being built */}
      <div className={`builder-sentence ${status}`} aria-live="polite">
        <span className="visually-hidden">Your sentence:</span>
        {chosen.length === 0 ? (
          <span className="builder-placeholder">Tap words below to build your sentence</span>
        ) : (
          chosen.map((id) => (
            <button
              key={id}
              type="button"
              lang="ko"
              className="builder-tile in-sentence"
              onClick={() => remove(id)}
              disabled={done}
              aria-label={`${tiles[id]} — tap to remove`}
            >
              {tiles[id]}
            </button>
          ))
        )}
      </div>

      {/* The finished sentence, with its meaning */}
      {done && (
        <div className="builder-result">
          <KoreanText text={answer} />
          {showRomanization && <p className="romanization">{build.romanization}</p>}
          <p className="english">{build.english}</p>
        </div>
      )}

      {/* Word bank (used words leave an empty spot so nothing jumps around) */}
      {!done && (
        <>
          <p className="builder-label">Word bank</p>
          <div className="builder-bank">
            {order.map((id) =>
              chosen.includes(id) ? (
                <span key={id} className="builder-tile used" aria-hidden="true">
                  {tiles[id]}
                </span>
              ) : (
                <button key={id} type="button" lang="ko" className="builder-tile" onClick={() => add(id)}>
                  {tiles[id]}
                </button>
              )
            )}
          </div>

          <div className="builder-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => speakKorean(sentence(chosen))}
              disabled={chosen.length === 0}
            >
              🔊 Hear my sentence
            </button>
            <button type="button" className="secondary-button" onClick={() => setChosen([])} disabled={chosen.length === 0}>
              Clear
            </button>
          </div>

          <button type="button" className="practice-next-button" onClick={submit} disabled={chosen.length === 0}>
            Submit
          </button>
        </>
      )}

      {/* Feedback */}
      {status === "wrong" && (
        <div className="feedback feedback-wrong" role="status">
          <p>
            <strong>🤔 Not quite. </strong>
            {problem}
          </p>
          <p className="builder-hint">💡 {build.hint}</p>
        </div>
      )}
      {status === "right" && (
        <p className="feedback feedback-right" role="status">
          ✅ {tries === 0 ? "Perfect on the first try!" : "You got it!"} Tap the sentence to hear it again.
        </p>
      )}
      {status === "revealed" && (
        <p className="feedback feedback-think" role="status">
          Here&apos;s the sentence. Tap it to hear it, and try saying it out loud!
        </p>
      )}
      {!done && tries > 0 && (
        <button type="button" className="link-button" onClick={reveal}>
          Show me the answer
        </button>
      )}
    </div>
  );
}
