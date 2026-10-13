"use client";

/*
  HangeulMatch: a matching game built from the Hangeul lessons.
  Pick a set (one lesson's letters and words, or every letter), then
  match each Korean tile on the left to its sound or meaning on the
  right, 5 pairs per round. Pairs you get wrong come back in a review
  round at the end. Each game earns points, and results are saved with
  lib/gameScores.ts, which also feeds the leaderboard on the Friends tab.
*/

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatTime, recordGameResult, useGameStats } from "../../lib/gameScores";
import { lessonSets, MATCH_SETS, type MatchSet } from "../../lib/matchSets";
import { sayOf, type PracticeWord } from "../../lib/practiceItems";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";
import SpeechNotice from "../SpeechNotice";
import "../lesson/lesson.css";
import "./games.css";

// ---------- Settings ----------
const PAIRS_PER_ROUND = 5;
const MAX_PAIRS = 15; // big sets use a random 15, so a game stays short

// ---------- Helpers ----------
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

// The time right now (only called from taps and timers, never while drawing).
function clock(): number {
  return Date.now();
}

// ---------- The game ----------
type Tile = { side: "korean" | "meaning"; item: number }; // item = index into `items`

export default function HangeulMatch() {
  const stats = useGameStats();
  const best = stats.bestTimes;

  const [set, setSet] = useState<MatchSet | null>(null);
  const [items, setItems] = useState<PracticeWord[]>([]); // this game's pairs
  const [rounds, setRounds] = useState<number[][]>([]); // item indexes per round
  const [round, setRound] = useState(0);
  const [reviewAdded, setReviewAdded] = useState(false);
  const [leftOrder, setLeftOrder] = useState<number[]>([]);
  const [rightOrder, setRightOrder] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrong, setWrong] = useState<Tile[]>([]);
  const [missed, setMissed] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [finalSeconds, setFinalSeconds] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  const playing = set !== null && finalSeconds === null;
  const seconds = Math.floor((now - startedAt) / 1000);

  // Tick the timer while playing.
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setNow(clock()), 250);
    return () => clearInterval(timer);
  }, [playing]);

  function showRound(roundItems: number[]) {
    setLeftOrder(shuffle(roundItems));
    setRightOrder(shuffle(roundItems));
    setMatched([]);
    setSelected(null);
    setWrong([]);
  }

  function start(chosen: MatchSet) {
    const picked = shuffle(chosen.items).slice(0, MAX_PAIRS);
    const indexes = picked.map((_, i) => i);
    const gameRounds = chunk(indexes, PAIRS_PER_ROUND);
    // Don't leave a tiny last round: fold 1–2 leftover pairs into the round before.
    if (gameRounds.length > 1 && gameRounds[gameRounds.length - 1].length < 3) {
      const last = gameRounds.pop()!;
      gameRounds[gameRounds.length - 1].push(...last);
    }
    setSet(chosen);
    setItems(picked);
    setRounds(gameRounds);
    setRound(0);
    setReviewAdded(false);
    setMissed([]);
    setMistakes(0);
    setFinalSeconds(null);
    setNewBest(false);
    setStartedAt(clock());
    setNow(clock());
    showRound(gameRounds[0]);
  }

  function finishRound() {
    const nextRound = round + 1;
    if (nextRound < rounds.length) {
      setRound(nextRound);
      showRound(rounds[nextRound]);
      return;
    }

    // Missed pairs come back once more in a review round (topped up to 3 pairs).
    if (!reviewAdded && missed.length > 0) {
      const others = shuffle(items.map((_, i) => i).filter((i) => !missed.includes(i)));
      const review = [...missed.slice(0, PAIRS_PER_ROUND), ...others].slice(
        0,
        Math.max(3, Math.min(missed.length, PAIRS_PER_ROUND))
      );
      setRounds([...rounds, review]);
      setRound(nextRound);
      setReviewAdded(true);
      showRound(review);
      return;
    }

    // Game over: save the result (points, time) for the leaderboard.
    const total = Math.floor((clock() - startedAt) / 1000);
    setFinalSeconds(total);
    if (set) {
      setNewBest(best[set.id] !== undefined && total < best[set.id]);
      const result = recordGameResult({
        game: "hangeul-match",
        setId: set.id,
        pairs: items.length,
        mistakes,
        seconds: total,
      });
      setPointsEarned(result.points);
    }
  }

  function tap(tile: Tile) {
    if (matched.includes(tile.item) || wrong.length > 0) return;
    if (tile.side === "korean") speakKorean(sayOf(items[tile.item]));

    // First tap, or a second tap on the same side: just select it.
    if (!selected || selected.side === tile.side) {
      setSelected(tile);
      return;
    }

    if (selected.item === tile.item) {
      // A match!
      if (tile.side === "meaning") speakKorean(sayOf(items[tile.item]));
      const nowMatched = [...matched, tile.item];
      setMatched(nowMatched);
      setSelected(null);
      if (nowMatched.length === leftOrder.length) setTimeout(finishRound, 500);
    } else {
      // Not a match: flash both, and the pair they were trying to match comes back later.
      setMistakes(mistakes + 1);
      if (!missed.includes(selected.item)) setMissed([...missed, selected.item]);
      setWrong([selected, tile]);
      setSelected(null);
      setTimeout(() => setWrong([]), 600);
    }
  }

  const tileState = (tile: Tile) => {
    if (matched.includes(tile.item)) return "matched";
    if (wrong.some((w) => w.side === tile.side && w.item === tile.item)) return "wrong";
    if (selected?.side === tile.side && selected.item === tile.item) return "selected";
    return "";
  };

  // ----- Choose a set -----
  if (!set) {
    return (
      <>
        <p className="page-description">
          Match each Korean letter or word to its sound or meaning. Pick a set from the Hangeul lessons:
        </p>
        <div className="unit-card">
          <ol className="unit-lessons">
            {MATCH_SETS.map((option, index) => (
              <li key={option.id}>
                <button type="button" className="unit-lesson match-set" onClick={() => start(option)}>
                  <span className="unit-lesson-number">{index < lessonSets.length ? index + 1 : "★"}</span>
                  <span className="unit-lesson-title">
                    {option.title}
                    <span className="match-set-sub">
                      {Math.min(option.items.length, MAX_PAIRS)} pairs
                    </span>
                  </span>
                  <span className="unit-lesson-meta">
                    {best[option.id] !== undefined ? `🏆 ${formatTime(best[option.id])}` : "Play →"}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  }

  // ----- Game over -----
  if (finalSeconds !== null) {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    return (
      <div className="lesson-content-card wp-finish">
        <div className="wp-big-emoji" aria-hidden="true">{"⭐".repeat(stars)}</div>
        <h2>{set.title}: done!</h2>
        {newBest && <p className="match-new-best">🏆 New best time!</p>}

        <p className="match-points">+{pointsEarned.toLocaleString()} points</p>

        <div className="wp-stats match-stats">
          <div>
            <strong>{formatTime(finalSeconds)}</strong>
            <span>time</span>
          </div>
          <div>
            <strong>{mistakes}</strong>
            <span>{mistakes === 1 ? "mistake" : "mistakes"}</span>
          </div>
          <div>
            <strong>{stats.weeklyPoints.toLocaleString()}</strong>
            <span>points this week</span>
          </div>
        </div>

        <Link href="/friends" className="match-leaderboard-link">
          See how you rank with friends →
        </Link>

        {missed.length > 0 ? (
          <>
            <h3>Practice these</h3>
            <ul className="wp-missed">
              {missed.map((index) => (
                <li key={index}>
                  <span aria-hidden="true">{items[index].emoji}</span>
                  <KoreanText text={items[index].korean} say={sayOf(items[index])} />
                  <span className="english">{items[index].meaning}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No mistakes — perfect! 🎉</p>
        )}

        <button type="button" className="practice-next-button" onClick={() => start(set)}>
          Play again
        </button>
        <button type="button" className="secondary-button" onClick={() => setSet(null)}>
          Choose another set
        </button>
      </div>
    );
  }

  // ----- Playing -----
  const isReview = reviewAdded && round === rounds.length - 1;
  return (
    <>
      <div className="match-hud">
        <button type="button" className="link-button" onClick={() => setSet(null)}>
          ✕ Quit
        </button>
        <span>
          {isReview ? "Review round" : `Round ${round + 1} of ${rounds.length - (reviewAdded ? 1 : 0)}`}
        </span>
        <span>⏱ {formatTime(seconds)}</span>
        <span>❌ {mistakes}</span>
      </div>

      <h2 className="match-title">{set.title}</h2>
      {isReview && <p className="page-description">These gave you trouble — try them once more.</p>}

      <div className="match-board">
        <div className="match-column">
          {leftOrder.map((item) => {
            const tile: Tile = { side: "korean", item };
            return (
              <button
                key={`k${item}`}
                type="button"
                lang="ko"
                className={`match-tile match-korean ${tileState(tile)}`}
                disabled={matched.includes(item)}
                onClick={() => tap(tile)}
              >
                {items[item].korean}
              </button>
            );
          })}
        </div>
        <div className="match-column">
          {rightOrder.map((item) => {
            const tile: Tile = { side: "meaning", item };
            return (
              <button
                key={`m${item}`}
                type="button"
                className={`match-tile ${tileState(tile)}`}
                disabled={matched.includes(item)}
                onClick={() => tap(tile)}
              >
                {items[item].meaning}
              </button>
            );
          })}
        </div>
      </div>

      <SpeechNotice />
    </>
  );
}
