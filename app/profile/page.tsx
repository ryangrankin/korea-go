
"use client";

import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { isGuest } from "../../lib/guest";
import { setMyUsername, useMyUsername, USERNAME_PATTERN, USERNAME_RULES } from "../../lib/username";

type Profile = {
  level: string;
  goal: string;
};

const noSubscribe = () => () => {};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    level: "Beginner",
    goal: "Everyday conversation",
  });

  const username = useMyUsername();
  const guest = useSyncExternalStore(noSubscribe, isGuest, () => false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function saveUsername(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    const error = await setMyUsername(String(new FormData(event.currentTarget).get("username")));
    setSaving(false);
    setMessage(error);
    if (!error) setEditing(false);
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem("koreaGoPreferences");
      const preferences = saved ? JSON.parse(saved) : {};
      const level = localStorage.getItem("koreaGoLevel");

      setProfile({
        level: level || preferences.level || "Beginner",
        goal: preferences.goal || "Everyday conversation",
      });
    } catch {
      // Keep default values if preferences cannot be loaded.
    }
  }, []);

  return (
    <main className="basic-page">
      <div className="basic-container profile-container">
        <Link href="/settings" className="settings-back">
          ← Back to Settings
        </Link>

        <div className="profile-header">
          <div className="profile-avatar">👤</div>
          <h1>My Profile</h1>
          <p>{guest ? "Guest" : username ? `@${username}` : ""}</p>
        </div>

        <section className="profile-section">
          <h2>Account</h2>

          <div className="profile-card">
            {guest ? (
              <p>
                Guests don&apos;t have a username. <Link href="/signup">Sign up</Link> to get one
                and show up on the Friends leaderboard.
              </p>
            ) : username === undefined ? (
              <p>Loading…</p>
            ) : editing || username === null ? (
              <form className="username-form" onSubmit={saveUsername}>
                <label htmlFor="username">
                  {username === null ? "Choose a username for the Friends tab" : "New username"}
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={username ?? ""}
                  placeholder="e.g. tim_learns"
                  autoCapitalize="none"
                  pattern={USERNAME_PATTERN}
                  title={USERNAME_RULES}
                  required
                />
                <small>{USERNAME_RULES}</small>
                <button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save username"}
                </button>
                {message && <p className="form-error" role="alert">{message}</p>}
              </form>
            ) : (
              <div className="profile-row">
                <span>Username</span>
                <strong>
                  @{username}{" "}
                  <button type="button" className="username-change" onClick={() => setEditing(true)}>
                    Change
                  </button>
                </strong>
              </div>
            )}
          </div>
        </section>

        <section className="profile-section">
          <h2>Learning Profile</h2>

          <div className="profile-card">
            <div className="profile-row">
              <span>Korean Level</span>
              <strong>{profile.level}</strong>
            </div>

            <div className="profile-row">
              <span>Learning Goal</span>
              <strong>{profile.goal}</strong>
            </div>
          </div>
        </section>

        <section className="profile-section">
          <h2>My Activity</h2>

          <div className="profile-card">
            <p>
              Your completed lessons, learning streak,
              and friends will appear here when
              account tracking is connected.
            </p>
          </div>
        </section>

        <Link href="/friends" className="profile-friends-link">
          👥 View Friends →
        </Link>
      </div>
    </main>
  );
}
