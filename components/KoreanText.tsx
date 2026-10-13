"use client";

/*
  KoreanText: any Korean word or phrase the learner can tap to hear.
  - text: the Korean shown on screen
  - say:  (optional) what to say out loud, if different from text
*/

import { speakKorean } from "../lib/speak";

type KoreanTextProps = {
  text: string;
  say?: string;
  className?: string;
};

export default function KoreanText({ text, say, className = "" }: KoreanTextProps) {
  return (
    <button
      type="button"
      lang="ko"
      className={`korean-text ${className}`}
      onClick={(event) => {
        // Stop the tap from also triggering a parent card's click.
        event.stopPropagation();
        speakKorean(say ?? text);
      }}
      aria-label={`Play audio: ${text}`}
    >
      {text} <span className="korean-text-icon" aria-hidden="true">🔊</span>
    </button>
  );
}
