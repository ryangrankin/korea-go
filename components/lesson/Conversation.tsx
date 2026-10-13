"use client";

/*
  Conversation: shows a dialogue one line at a time, like a chat.
  The learner taps "Next line" to reveal the next line (it plays
  automatically), and can tap any line to hear it again.
*/

import { useState } from "react";
import type { ConversationLine, Speaker } from "../../data/lessons";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";

type ConversationProps = {
  lines: ConversationLine[];
  speakers: Record<string, Speaker>;
  showRomanization: boolean;
  onFinish: () => void;
};

export default function Conversation({ lines, speakers, showRomanization, onFinish }: ConversationProps) {
  // How many lines are showing right now.
  const [shown, setShown] = useState(1);
  const allShown = shown >= lines.length;

  function nextLine() {
    setShown(shown + 1);
    speakKorean(lines[shown].korean);
  }

  return (
    <div>
      <div className="chat">
        {lines.slice(0, shown).map((line, index) => {
          const who = speakers[line.speaker];
          // The traveler's bubbles go on the right, everyone else's on the left.
          const side = line.speaker === "traveler" ? "chat-right" : "chat-left";
          return (
            <div key={index} className={`chat-row ${side}`}>
              <div className="chat-avatar" aria-hidden="true">{who?.emoji}</div>
              <div className="chat-bubble">
                <p className="chat-name">{who?.name}</p>
                <div className="chat-picture" aria-hidden="true">{line.emoji}</div>
                <KoreanText text={line.korean} className="chat-korean" />
                {showRomanization && <p className="romanization">{line.romanization}</p>}
                <p className="english">{line.english}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="practice-count">
        Line {Math.min(shown, lines.length)} of {lines.length}
      </p>

      {allShown ? (
        <button type="button" className="practice-next-button" onClick={onFinish}>
          Learn these words →
        </button>
      ) : (
        <button type="button" className="practice-next-button" onClick={nextLine}>
          Next line ▶
        </button>
      )}
    </div>
  );
}
