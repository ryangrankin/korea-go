"use client";

/*
  HangeulChart: the "가 Hangeul" button that floats over lessons.
  Tapping it opens the chart on top of the page (an "overlay").
  Closing it just hides the overlay, so the lesson underneath keeps
  its place.
*/

import { useEffect, useState } from "react";
import { consonants, vowels, moreVowels, chartNotes, type HangeulLetter } from "../data/hangeul";
import { speakKorean } from "../lib/speak";

// One group of letters (for example, all the consonants).
function LetterGroup({ title, note, letters }: { title: string; note: string; letters: HangeulLetter[] }) {
  return (
    <section className="hangeul-group">
      <h3>{title}</h3>
      <p className="hangeul-note">{note}</p>
      <div className="hangeul-chart-grid">
        {letters.map((item) => (
          <button
            key={item.letter}
            type="button"
            className="hangeul-cell"
            onClick={() => speakKorean(item.say)}
            aria-label={`${item.letter}, ${item.romanization}. Play sound`}
          >
            <span className="hangeul-letter" lang="ko">{item.letter}</span>
            <span className="hangeul-roman">{item.romanization}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default function HangeulChart() {
  const [open, setOpen] = useState(false);

  // Let the Escape key close the chart.
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* The floating button */}
      <button type="button" className="hangeul-fab" onClick={() => setOpen(true)}>
        <span lang="ko">가</span> Hangeul
      </button>

      {/* The chart overlay (only shown when open) */}
      {open && (
        <div className="hangeul-overlay" onClick={() => setOpen(false)}>
          <div
            className="hangeul-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Hangeul chart"
            // Clicks inside the panel shouldn't close it.
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hangeul-panel-header">
              <h2>Hangeul Chart</h2>
              <button type="button" className="hangeul-close" onClick={() => setOpen(false)} aria-label="Close chart">
                ✕
              </button>
            </div>
            <p className="hangeul-note">Tap a letter to hear it.</p>

            <LetterGroup
              title="Consonants"
              note={chartNotes.consonants}
              letters={consonants}
            />
            <LetterGroup title="Vowels" note={chartNotes.vowels} letters={vowels} />
            <LetterGroup title="More vowels in Lesson 1" note={chartNotes.moreVowels} letters={moreVowels} />

            <button type="button" className="practice-next-button" onClick={() => setOpen(false)}>
              Back to where I was
            </button>
          </div>
        </div>
      )}
    </>
  );
}
