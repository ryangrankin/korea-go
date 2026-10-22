"use client";

/*
  Mini Games: the Korean Culture Arcade.
  Culture games come from data/culturalGames.ts; Hangeul Match practices
  the Hangeul lessons. Each game shows its difficulty, and the chips at
  the top filter by level. Finished games show a ✓ and add points to the
  Friends leaderboard.
*/

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BottomNav from "../../components/BottomNav";
import DifficultyBadge from "../../components/games/DifficultyBadge";
import { culturalGames, DIFFICULTIES, type Difficulty } from "../../data/culturalGames";
import { useGameStats } from "../../lib/gameScores";
import { MATCH_SETS } from "../../lib/matchSets";
import "../../components/games/games.css";

export default function GamesPage() {
  const stats = useGameStats();
  const [level, setLevel] = useState<Difficulty | "all">("all");
  const shown = culturalGames.filter((game) => level === "all" || game.difficulty === level);
  const hangeulPlays = MATCH_SETS.reduce((sum, set) => sum + (stats.timesPlayed[set.id] ?? 0), 0);

  return (
    <main className="basic-page">
      <div className="basic-container">
        <h1>Mini Games 🎮</h1>
        <p className="page-description">
          Play mini games to learn more about Korean culture & practice your Korean language skills! Compete with friends by completing mini games!
        </p>

        <section className="arcade-section">
          <h2>Play Mini Games!</h2>

          {/* Filter by difficulty */}
          <div className="leaderboard-sets arcade-levels" role="group" aria-label="Filter by difficulty">
            {(["all", "easy", "medium", "hard"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={level === option ? "active" : ""}
                aria-pressed={level === option}
                onClick={() => setLevel(option)}
              >
                {option === "all" ? "All levels" : DIFFICULTIES[option].label}
              </button>
            ))}
          </div>
          {level !== "all" && <p className="arcade-level-note">{DIFFICULTIES[level].description}</p>}

          <div className="arcade-grid">
            {shown.map((game) => {
              const plays = stats.timesPlayed[game.id] ?? 0;
              return (
                <article key={game.id} className="arcade-card">
                  <div className="arcade-card-top">
                    {game.cover ? (
                      <Image src={game.cover} alt="" width={96} height={72} className="arcade-cover" unoptimized />
                    ) : (
                      <span className="arcade-emoji" aria-hidden="true">{game.emoji}</span>
                    )}
                    {plays > 0 && <span className="arcade-done">✓ Played {plays}×</span>}
                  </div>
                  <div className="arcade-title-row">
                    <h3>
                      {game.title} <span aria-hidden="true">{game.emoji}</span>
                    </h3>
                    <DifficultyBadge level={game.difficulty} />
                  </div>
                  <p>{game.description}</p>
                  <p className="arcade-meta">
                    {game.rounds.length} {game.kind === "story" ? "stops" : "rounds"} · ~
                    {Math.max(3, Math.ceil(game.rounds.length * 0.5))} min
                  </p>
                  <Link href={`/games/${game.id}`} className="arcade-play">
                    {plays > 0 ? "Play again" : "Play"} ▶
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* LANGUAGE GAMES */}
        <section className="arcade-section">
          <h2>Language Games</h2>

          <Link href="/games/hangeul-match" className="lesson-card">
            <div className="lesson-icon" lang="ko">가</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Hangeul Match</h3>
                <DifficultyBadge level="easy" />
              </div>
              {hangeulPlays > 0 && <p className="arcade-played-line">✓ Played {hangeulPlays}×</p>}
              <p>Match letters and words from the Hangeul lessons to their sounds. Beat your best time!</p>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
