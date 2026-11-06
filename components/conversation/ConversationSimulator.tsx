"use client";

/*
  ConversationSimulator: one Conversation-tab scenario.
  1. Introduction — the situation and the goal
  2. Vocabulary preview — the word bank, with meanings and audio
  3. Conversation — the speaker talks; the learner builds each answer
     from word tiles, and gets specific feedback (lib/conversationEngine.ts)
  4. Completion — what they did, and a chance to try other sentences

  Scaffolding: "Translations" shows English under the tiles and speaker
  lines, and "Hints" shows what to say. Both start on for beginners and can
  be turned off. Nothing here needs typing Korean.
*/

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Scenario, Tile } from "../../data/conversations";
import { findStep, joinTiles } from "../../lib/conversationEngine";
import { recordConversation } from "../../lib/conversationProgress";
import { startConversation, submitAnswer, type ConversationState } from "../../lib/conversationState";
import { usePreferences } from "../../lib/preferences";
import { scrollToTop } from "../../lib/scroll";
import { speakKorean } from "../../lib/speak";
import AudioButtons from "../AudioButtons";
import KoreanText from "../KoreanText";
import Pup from "../Pup";
import SpeechNotice from "../SpeechNotice";
import "../lesson/lesson.css";
import "./conversation.css";

type Phase = "intro" | "vocab" | "chat" | "done";

const STATUS_LABELS = {
  valid: "✅ Nice!",
  invalid: "✏️ Let's fix one thing",
  incomplete: "🧩 Almost there",
  unrecognized: "🤔 Hmm",
  empty: "",
} as const;

export default function ConversationSimulator({ scenario }: { scenario: Scenario }) {
  const preferences = usePreferences();
  const beginner = preferences.level === "Beginner";

  const [phase, setPhaseState] = useState<Phase>("intro");
  // Each new screen starts at the top.
  function setPhase(next: Phase) {
    setPhaseState(next);
    scrollToTop();
  }
  const [state, setState] = useState<ConversationState>(() => startConversation(scenario));
  const [chosen, setChosen] = useState<Tile[]>([]); // the sentence being built
  // Scaffolding toggles (null = follow the learner's level until they choose)
  const [translationsChoice, setTranslations] = useState<boolean | null>(null);
  const [hintsChoice, setHints] = useState<boolean | null>(null);
  const translations = translationsChoice ?? beginner;
  const hints = hintsChoice ?? beginner;
  const endRef = useRef<HTMLDivElement>(null);

  const step = findStep(scenario, state.stepId);
  const result = state.lastResult;
  const romanization = preferences.romanization;

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [state.messages.length]);

  function begin() {
    setState(startConversation(scenario));
    setChosen([]);
    setPhase("chat");
    if (scenario.steps[0].line) speakKorean(scenario.steps[0].line.korean);
  }

  // Tiles stay in the bank, so a word can be used again when it makes sense.
  function addTile(tile: Tile) {
    speakKorean(tile.korean);
    setChosen((current) => [...current, tile]);
  }

  function submit() {
    if (chosen.length === 0) return;
    const next = submitAnswer(state, scenario, chosen);
    setState(next);
    const last = next.messages.at(-1);
    const answered = next.messages.length > state.messages.length + 1; // the speaker replied
    if (answered && last?.from === "speaker") {
      speakKorean(last.line.korean);
      setChosen([]);
    }
    if (next.done) {
      recordConversation(scenario.id, next.successes.length);
      setTimeout(() => setPhase("done"), 1200);
    }
  }

  // ----- 1. Introduction -----
  if (phase === "intro") {
    return (
      <section className="convo-card convo-intro">
        <div className="convo-intro-head">
          <span className="convo-icon" aria-hidden="true">{scenario.icon}</span>
          <div>
            <p className="convo-meta">
              {scenario.level} · {scenario.minutes}
            </p>
            <h2>{scenario.title}</h2>
          </div>
        </div>
        <p>{scenario.intro}</p>
        <dl className="convo-goals">
          <div>
            <dt>🎯 Your goal</dt>
            <dd>{scenario.goal}</dd>
          </div>
          <div>
            <dt>🔎 Notice</dt>
            <dd>{scenario.grammarFocus}</dd>
          </div>
        </dl>
        <ol className="convo-steps">
          {scenario.steps.map((item) => (
            <li key={item.id}>{item.task}</li>
          ))}
        </ol>
        <button type="button" className="practice-next-button" onClick={() => setPhase("vocab")}>
          Preview the words →
        </button>
      </section>
    );
  }

  // ----- 2. Vocabulary preview -----
  if (phase === "vocab") {
    return (
      <section className="convo-card">
        <h2>Your word bank</h2>
        <p className="convo-help">
          You&apos;ll build every answer from these {scenario.tiles.length} words. Tap 🔊 to hear one. Small words
          like 을 and 는 attach to the word before them.
        </p>
        <ul className="convo-vocab">
          {scenario.tiles.map((tile) => (
            <li key={tile.id}>
              <span className="convo-vocab-korean" lang="ko">{tile.korean}</span>
              {romanization && <span className="romanization">{tile.romanization}</span>}
              <span className="english">{tile.english}</span>
              <AudioButtons text={tile.korean} compact />
            </li>
          ))}
        </ul>
        <button type="button" className="practice-next-button" onClick={begin}>
          Start the conversation →
        </button>
      </section>
    );
  }

  // ----- 4. Completion -----
  if (phase === "done") {
    const unique = [...new Set(state.successes)];
    return (
      <section className="convo-card convo-done">
        <Pup size={110} className="pup-center pup-celebrate" />
        <h2>Conversation complete! 🎉</h2>
        <p>{scenario.completion}</p>
        <div className="wp-stats">
          <div>
            <strong>{unique.length}</strong>
            <span>correct sentences built</span>
          </div>
          <div>
            <strong>{state.attempts}</strong>
            <span>answers tried</span>
          </div>
        </div>
        <h3>Sentences you built</h3>
        <ul className="convo-built">
          {unique.map((sentence) => (
            <li key={sentence}>
              <KoreanText text={sentence} />
            </li>
          ))}
        </ul>
        <p className="convo-help">
          Try again with different words — there&apos;s more than one right way to say it, and every correct sentence counts.
        </p>
        <button type="button" className="practice-next-button" onClick={begin}>
          Try different sentences
        </button>
        <Link href="/conversation" className="secondary-button convo-back">
          Choose another scenario
        </Link>
      </section>
    );
  }

  // ----- 3. Conversation -----
  return (
    <section className="convo-chat-wrap">
      {/* Scaffolding toggles */}
      <div className="convo-toggles" role="group" aria-label="Help">
        <label>
          <input type="checkbox" checked={translations} onChange={(e) => setTranslations(e.target.checked)} />
          Translations
        </label>
        <label>
          <input type="checkbox" checked={hints} onChange={(e) => setHints(e.target.checked)} />
          Hints
        </label>
      </div>

      {/* The conversation so far */}
      <div className="convo-chat" aria-live="polite">
        {state.messages.map((message, i) =>
          message.from === "speaker" ? (
            <div key={i} className="convo-row convo-speaker">
              <span className="convo-avatar" aria-hidden="true">{scenario.speakerEmoji}</span>
              <div className="convo-bubble">
                <p className="convo-name">{scenario.speakerName}</p>
                <KoreanText text={message.line.korean} className="convo-korean" />
                {romanization && <p className="romanization">{message.line.romanization}</p>}
                {translations && <p className="english">{message.line.english}</p>}
                {message.note && <p className="convo-note">💡 {message.note}</p>}
              </div>
            </div>
          ) : (
            <div key={i} className={`convo-row convo-learner ${message.status}`}>
              <div className="convo-bubble">
                <p className="convo-name">You</p>
                <p className="convo-korean" lang="ko">{message.sentence}</p>
              </div>
            </div>
          )
        )}
        <div ref={endRef} />
      </div>

      {/* Feedback on the last answer */}
      {result && result.status !== "empty" && !(result.status === "valid" && result.fitsStep) && (
        <div className={`convo-feedback ${result.status}`} role="status">
          <p className="convo-feedback-title">{STATUS_LABELS[result.status]}</p>
          <p>{result.feedback}</p>
          {result.corrected && (
            <p className="convo-corrected">
              Try: <KoreanText text={result.corrected} />
            </p>
          )}
        </div>
      )}
      {result && result.status === "valid" && result.fitsStep && !state.done && (
        <div className="convo-feedback valid" role="status">
          <p className="convo-feedback-title">✅ Nice!</p>
          <p>{result.feedback}</p>
        </div>
      )}

      {/* Building the next answer */}
      {step && !state.done && (
        <div className="convo-builder">
          <p className="convo-task">
            <strong>Your turn:</strong> {step.task}
          </p>
          {hints && (
            <p className="convo-hint">
              💡 {step.hint} <span className="convo-hint-examples">e.g. {step.examples.join(" · ")}</span>
            </p>
          )}

          <div className="convo-sentence" aria-label="Your sentence">
            {chosen.length === 0 ? (
              <span className="convo-placeholder">Tap words below to build your answer</span>
            ) : (
              <>
                <span className="visually-hidden">Your sentence: {joinTiles(chosen)}</span>
                {chosen.map((tile, i) => (
                  <button
                    key={`${tile.id}-${i}`}
                    type="button"
                    lang="ko"
                    className={`convo-tile in-sentence ${tile.attach ? "attached" : ""}`}
                    onClick={() => setChosen(chosen.filter((_, j) => j !== i))}
                    aria-label={`${tile.korean} — tap to remove`}
                  >
                    {tile.korean}
                  </button>
                ))}
              </>
            )}
          </div>
          {chosen.length > 0 && (
            <p className="convo-preview" lang="ko">
              {joinTiles(chosen)}
            </p>
          )}

          <div className="convo-bank" aria-label="Word bank">
            {scenario.tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className="convo-tile"
                onClick={() => addTile(tile)}
                title={tile.english}
                aria-label={`${tile.korean} (${tile.english})`}
              >
                <span lang="ko">{tile.korean}</span>
                {translations && <small>{tile.english}</small>}
              </button>
            ))}
          </div>

          <div className="convo-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setChosen(chosen.slice(0, -1))}
              disabled={chosen.length === 0}
            >
              ↩ Undo
            </button>
            <button type="button" className="secondary-button" onClick={() => setChosen([])} disabled={chosen.length === 0}>
              Clear
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => speakKorean(joinTiles(chosen))}
              disabled={chosen.length === 0}
            >
              🔊 Hear it
            </button>
          </div>
          <button type="button" className="practice-next-button" onClick={submit} disabled={chosen.length === 0}>
            Say it ▶
          </button>
          <p className="convo-count">
            {state.successes.length} correct {state.successes.length === 1 ? "sentence" : "sentences"} so far
          </p>
        </div>
      )}

      <SpeechNotice />
    </section>
  );
}
