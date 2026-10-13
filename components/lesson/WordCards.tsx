"use client";

/*
  WordCards: a grid of vocab cards.
  Tap a card to hear it and reveal its emoji picture and English meaning.
*/

import { useState } from "react";
import type { VocabularyItem } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";

type WordCardsProps = {
  words: VocabularyItem[];
  showRomanization: boolean;
};

export default function WordCards({ words, showRomanization }: WordCardsProps) {
  // Which cards have been opened (by their position in the list).
  const [opened, setOpened] = useState<number[]>([]);

  function tapCard(word: VocabularyItem, index: number) {
    // Phrases with a blank (___) play their filled-in example instead.
    speakKorean(word.say ?? word.example?.korean ?? word.korean);
    if (!opened.includes(index)) setOpened([...opened, index]);
  }

  return (
    <div className="word-grid">
      {words.map((word, index) => {
        const isOpen = opened.includes(index);
        return (
          <button
            key={word.korean}
            type="button"
            className={`word-card ${isOpen ? "open" : ""}`}
            onClick={() => tapCard(word, index)}
          >
            <span className="word-emoji" aria-hidden="true">{isOpen ? word.emoji : "❔"}</span>
            <span className="word-korean" lang="ko">
              {word.korean} <span className="korean-text-icon" aria-hidden="true">🔊</span>
            </span>
            {showRomanization && <span className="romanization">{word.romanization}</span>}
            <span className="english">{isOpen ? word.english : "Tap to reveal"}</span>
            {isOpen && word.example && (
              <span className="word-example">
                e.g. <span lang="ko">{word.example.korean}</span> — {word.example.english}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
