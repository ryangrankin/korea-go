"use client";

/*
  HangulIntro: a short "What's Hangul?" note for learners who start a lesson
  outside the Hangul unit before learning to read. It explains the Korean
  letters they're about to see, and that they can listen and use the
  romanization for now — then points them to Unit 0 when they're ready.
  It stops showing once they finish any Hangul lesson or close it.
*/

import { useSyncExternalStore } from "react";
import Link from "next/link";

const SEEN_KEY = "koreaGoHangulIntroSeen";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SEEN_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SEEN_KEY, onChange);
  };
}

const seen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) === "true";
  } catch {
    return true;
  }
};

type HangulIntroProps = {
  knowsHangul: boolean; // finished at least one Hangul lesson
  showRomanization: boolean;
};

export default function HangulIntro({ knowsHangul, showRomanization }: HangulIntroProps) {
  const closed = useSyncExternalStore(subscribe, seen, () => true);
  if (closed || knowsHangul) return null;

  function close() {
    try {
      localStorage.setItem(SEEN_KEY, "true");
      window.dispatchEvent(new Event(SEEN_KEY));
    } catch {
      // It just shows again next time.
    }
  }

  return (
    <aside className="hangul-intro" aria-label="About Korean letters">
      <p className="hangul-intro-title">
        <span lang="ko">한글</span> New to Korean letters?
      </p>
      <p>
        Korean is written in <strong>Hangul</strong>, its own alphabet. You don&apos;t need to read it yet:
      </p>
      <ul>
        <li>
          <span aria-hidden="true">🔊</span> Tap any Korean to hear it (🐢 plays it slowly).
        </li>
        <li>
          <span aria-hidden="true">🔤</span>{" "}
          {showRomanization
            ? "The blue English letters under the Korean (romanization) show how to say it."
            : "Turn on Show Romanization in Settings to see how to say each word in English letters."}
        </li>
        <li>
          <span aria-hidden="true">🎧</span> Many questions let you listen and choose.
        </li>
      </ul>
      <p>When you&apos;re ready, Unit 0 teaches you to read Hangul in a few short lessons.</p>
      <div className="hangul-intro-actions">
        <Link href="/lessons/hangeul-1" className="secondary-button">
          Learn Hangul first
        </Link>
        <button type="button" className="practice-next-button" onClick={close}>
          Got it, keep going
        </button>
      </div>
    </aside>
  );
}
