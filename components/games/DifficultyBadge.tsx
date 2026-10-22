/*
  DifficultyBadge: shows a game's level as dots and a word, e.g. "●●○ Medium".
  Levels and their wording live in data/culturalGames.ts (DIFFICULTIES).
*/

import { DIFFICULTIES, type Difficulty } from "../../data/culturalGames";

export default function DifficultyBadge({ level }: { level: Difficulty }) {
  const info = DIFFICULTIES[level];
  return (
    <span className={`difficulty difficulty-${level}`} title={info.description}>
      <span aria-hidden="true">
        {"●".repeat(info.dots)}
        {"○".repeat(3 - info.dots)}
      </span>{" "}
      {info.label}
    </span>
  );
}
