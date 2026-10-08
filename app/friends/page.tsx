
"use client";

import { useState } from "react";
import Link from "next/link";

type Friend = {
  id: string;
  username: string;
  level: string;
  streak: number;
};

const sampleFriends: Friend[] = [
  {
    id: "1",
    username: "friend_one",
    level: "Beginner",
    streak: 5,
  },
  {
    id: "2",
    username: "friend_two",
    level: "Intermediate",
    streak: 12,
  },
];

export default function FriendsPage() {
  const [search, setSearch] = useState("");

  const filteredFriends = sampleFriends.filter((friend) =>
    friend.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="basic-page">
      <div className="basic-container">
        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>Friends</h1>
        <p>Learn Korean together!</p>

        <div className="friends-section">
          <h2>My Friends</h2>

          {sampleFriends.map((friend) => (
            <div className="friend-card" key={friend.id}>
              <div className="friend-avatar">👤</div>

              <div className="friend-info">
                <h3>{friend.username}</h3>
                <p>{friend.level}</p>
                <span>🔥 {friend.streak} day streak</span>
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
      </div>
    </main>
  );
}
