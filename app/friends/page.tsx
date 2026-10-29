
"use client";

import { useState } from "react";
import Link from "next/link";
import Avatar from "../../components/Avatar";
import BottomNav from "../../components/BottomNav";
import { sampleFriends } from "../../data/sampleFriends";
import { formatTime, useGameStats } from "../../lib/gameScores";
import { MATCH_SETS } from "../../lib/matchSets";
import { useCommunity } from "../../lib/community";
import { useMyProfile } from "../../lib/username";

type Board = "points" | "times";

type Row = {
  id: string;
  name: string;
  isYou: boolean;
  value: number | undefined; // points, or seconds for best times
};

const MEDALS = ["🥇", "🥈", "🥉"];

export default function FriendsPage() {
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState<Board>("points");
  const [setId, setSetId] = useState(MATCH_SETS[0]?.id ?? "");
  const stats = useGameStats();
  const myProfile = useMyProfile();
  const myUsername = myProfile?.username;
  const community = useCommunity();

  // Leaderboard rows: you plus your friends.
  // Points: highest first. Times: fastest first, no time yet at the bottom.
  const rows: Row[] = [
    {
      id: "you",
      name: myUsername ? `${myUsername} (you)` : "You",
      isYou: true,
      value: board === "points" ? stats.weeklyPoints : stats.bestTimes[setId],
    },
    ...sampleFriends.map((friend) => ({
      id: friend.id,
      name: friend.username,
      isYou: false,
      value: board === "points" ? friend.weeklyPoints : friend.bestTimes[setId],
    })),
  ].sort((a, b) => {
    if (board === "points") return (b.value ?? 0) - (a.value ?? 0);
    return (a.value ?? Infinity) - (b.value ?? Infinity);
  });

  const filteredFriends = sampleFriends.filter((friend) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="basic-page">
      <div className="basic-container">
        <h1>Friends</h1>
        <p>Learn Korean together!</p>

        {/* LEADERBOARD beside your friends (side by side on laptops) */}
        <div className="friends-layout">
          <div className="friends-section">
            <h2>Leaderboard</h2>

            <div className="leaderboard-toggle" role="group" aria-label="Leaderboard type">
              <button
                type="button"
                className={board === "points" ? "active" : ""}
                aria-pressed={board === "points"}
                onClick={() => setBoard("points")}
              >
                🏅 This week&apos;s points
              </button>
              <button
                type="button"
                className={board === "times" ? "active" : ""}
                aria-pressed={board === "times"}
                onClick={() => setBoard("times")}
              >
                ⏱ Best times
              </button>
            </div>

            {/* Which Hangeul Match set to compare times for */}
            {board === "times" && (
              <div className="leaderboard-sets">
                {MATCH_SETS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    className={option.id === setId ? "active" : ""}
                    aria-pressed={option.id === setId}
                    onClick={() => setSetId(option.id)}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            )}

            <ol className="leaderboard">
              {rows.map((row, index) => (
                <li key={row.id} className={row.isYou ? "you" : ""}>
                  <span className="leaderboard-rank">
                    {row.value === undefined ? "–" : MEDALS[index] ?? index + 1}
                  </span>
                  <Avatar
                    url={row.isYou ? myProfile?.avatarUrl : null}
                    className="leaderboard-avatar"
                    fallback={row.isYou ? "⭐" : "👤"}
                  />
                  <span className="leaderboard-name">{row.name}</span>
                  <span className="leaderboard-value">
                    {row.value === undefined
                      ? "No time yet"
                      : board === "points"
                      ? `${row.value.toLocaleString()} pts`
                      : formatTime(row.value)}
                  </span>
                </li>
              ))}
            </ol>

            <p className="friends-note">
              {stats.gamesPlayed === 0 ? "Play a mini game to get on the board. " : ""}
              <Link href="/games/hangeul-match">Play Hangeul Match →</Link>
            </p>
          </div>

          <div className="friends-side">
            <div className="friends-section">
              <h2>My Friends</h2>

              {sampleFriends.map((friend) => (
                <div className="friend-card" key={friend.id}>
                  <div className="friend-avatar">👤</div>

                  <div className="friend-info">
                    <h3>{friend.username}</h3>
                    <p>{friend.level}</p>
                    <span>
                      🔥 {friend.streak} day streak · 🎮{" "}
                      {friend.weeklyPoints.toLocaleString()} pts this week
                    </span>
                  </div>

                  <span className="friend-arrow">›</span>
                </div>
              ))}
            </div>

            <div className="friends-section">
              <h2>Find Friends</h2>

              <input
                type="text"
                placeholder="Search by username..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="friends-search"
              />

              {search.trim() !== "" && (
                <div className="friends-search-results">
                  {filteredFriends.length > 0 ? (
                    filteredFriends.map((friend) => (
                      <div className="friend-card" key={friend.id}>
                        <div className="friend-avatar">👤</div>

                        <div className="friend-info">
                          <h3>{friend.username}</h3>
                          <p>{friend.level}</p>
                        </div>

                        <button
                          type="button"
                          className="friend-add-button"
                          disabled
                        >
                          Added
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No users found.</p>
                  )}
                </div>
              )}

              <p className="friends-note">
                Friend requests will be available when accounts
                are connected.
              </p>
            </div>

            {/* COMMUNITY: every korea-go user and their total points */}
            <div className="friends-section">
              <h2>Community</h2>

              {community === undefined ? (
                <p className="friends-note">Loading…</p>
              ) : community === null ? (
                <p className="friends-note">
                  <Link href="/signup">Sign up</Link> or log in to see everyone learning on korea GO!
                </p>
              ) : community.length === 0 ? (
                <p className="friends-note">No one here yet. Choose a username on your Profile to be first!</p>
              ) : (
                <ol className="community-list">
                  {community.map((member, index) => (
                    <li key={member.username} className={member.username === myUsername ? "you" : ""}>
                      <span className="community-rank">{MEDALS[index] ?? index + 1}</span>
                      <Avatar url={member.avatar_url} className="friend-avatar" />
                      <span className="community-name">
                        <strong>
                          {member.username}
                          {member.username === myUsername ? " (you)" : ""}
                        </strong>
                        <small>
                          {member.games_played} {member.games_played === 1 ? "game" : "games"} played
                        </small>
                      </span>
                      <span className="community-points">{member.total_points.toLocaleString()} pts</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
