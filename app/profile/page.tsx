
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Profile = {
  level: string;
  goal: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    level: "Beginner",
    goal: "Everyday conversation",
  });

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
          <p>Account information coming soon</p>
        </div>

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
