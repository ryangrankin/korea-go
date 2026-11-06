"use client";

/*
  AudioButtons: "Play" and "Slow" buttons for one Korean word or sentence.
  Used where hearing it clearly matters (new words, listening questions,
  flashcards). Pressing either stops anything else that's playing first.
  - compact: icon-only buttons (with labels for screen readers)
*/

import { speakKorean } from "../lib/speak";

type AudioButtonsProps = {
  text: string; // the Korean to say
  compact?: boolean;
  className?: string;
};

export default function AudioButtons({ text, compact = false, className = "" }: AudioButtonsProps) {
  return (
    <span className={`audio-buttons ${compact ? "compact" : ""} ${className}`}>
      <button type="button" onClick={() => speakKorean(text)} aria-label={`Play: ${text}`}>
        <span aria-hidden="true">🔊</span>
        {!compact && " Play"}
      </button>
      <button type="button" onClick={() => speakKorean(text, { slow: true })} aria-label={`Play slowly: ${text}`}>
        <span aria-hidden="true">🐢</span>
        {!compact && " Slow"}
      </button>
    </span>
  );
}
