"use client";

/*
  GrammarNotes: short grammar explanation cards with tappable examples.
*/

import type { GrammarNote } from "../../data/lessons";
import KoreanText from "../KoreanText";

type GrammarNotesProps = {
  notes: GrammarNote[];
  showRomanization: boolean;
};

export default function GrammarNotes({ notes, showRomanization }: GrammarNotesProps) {
  return (
    <div>
      {notes.map((note) => (
        <div key={note.title} className="grammar-card">
          <h3 lang="ko">{note.title}</h3>
          <p>{note.explanation}</p>
          <ul>
            {note.examples.map((example) => (
              <li key={example.korean}>
                <KoreanText text={example.korean} />
                {showRomanization && <span className="romanization">{example.romanization}</span>}
                <span className="english">{example.english}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
