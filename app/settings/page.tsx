
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Preferences = {
  level: string;
  goal: string;
  feedback: string;
  romanization: boolean;
  practiceFocus: string;
  dailyMinutes: string;
  reminders: boolean;
  reminderFrequency: string;
  reminderTime: string;
  streakReminders: boolean;
};

const defaults: Preferences = {
  level: "Beginner",
  goal: "Everyday conversation",
  feedback: "Immediate",
  romanization: true,
  practiceFocus: "Mixed practice",
  dailyMinutes: "10",
  reminders: false,
  reminderFrequency: "Daily",
  reminderTime: "18:00",
  streakReminders: false,
};

export default function SettingsPage() {
  const router = useRouter();

  const [prefs, setPrefs] = useState<Preferences>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("koreaGoPreferences");
      const savedLevel = localStorage.getItem("koreaGoLevel");
      const oldReminders = localStorage.getItem("koreaGoReminders");

      const parsed = saved ? JSON.parse(saved) : {};

      setPrefs({
        ...defaults,
        ...parsed,
        level: savedLevel || parsed.level || defaults.level,
        reminders:
          typeof parsed.reminders === "boolean"
            ? parsed.reminders
            : oldReminders === "true",
      });
    } catch {
      setPrefs(defaults);
    }

    setLoaded(true);
  }, []);

  function update<K extends keyof Preferences>(
    key: K,
    value: Preferences[K]
  ) {
    const updated = { ...prefs, [key]: value };

    setPrefs(updated);

    localStorage.setItem(
      "koreaGoPreferences",
      JSON.stringify(updated)
    );

    if (key === "level") {
      localStorage.setItem("koreaGoLevel", String(value));
    }

    if (key === "reminders") {
      localStorage.setItem("koreaGoReminders", String(value));
    }
  }

  if (!loaded) {
    return <main className="basic-page" />;
  }

  return (
    <main className="basic-page">
      <div className="basic-container settings-container">

        {/* HEADER */}
        <Link href="/dashboard" className="settings-back">
          ← Back to Dashboard
        </Link>

        <h1>Settings ⚙️</h1>

        <p className="settings-subtitle">
          Personalize your Korean learning experience.
        </p>

        {/* ACCOUNT */}
        <details className="settings-accordion">
          <summary>
            <span>👤 Account</span>
            <span className="accordion-arrow">⌄</span>
          </summary>

          <div className="accordion-content">
            <Link href="/profile" className="profile-friends-link">
                👤 View My Profile →
            </Link>
        </div>
        </details>

        {/* LEARNING PREFERENCES */}
        <details className="settings-accordion">
          <summary>
            <span>📚 Learning Preferences</span>
            <span className="accordion-arrow">⌄</span>
          </summary>

          <div className="accordion-content">

            <label htmlFor="level">
              Korean Proficiency
            </label>
            <p className="settings-note">
              Choose your current Korean language level.
            </p>

            <select
              id="level"
              className="settings-select"
              value={prefs.level}
              onChange={(e) =>
                update("level", e.target.value)
              }
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <div className="settings-divider" />

            <label htmlFor="goal">
              Learning Goal
            </label>
            <p className="settings-note">
              What do you want to use Korean for?
            </p>

            <select
              id="goal"
              className="settings-select"
              value={prefs.goal}
              onChange={(e) =>
                update("goal", e.target.value)
              }
            >
              <option>Everyday conversation</option>
              <option>Travel and navigation</option>
              <option>Academic learning</option>
              <option>Culture and media</option>
            </select>

            <div className="settings-divider" />

            <label className="settings-toggle-row">
              <span>
                <strong>Show Romanization</strong>
                <p className="settings-note">
                  Display pronunciation guides with Hangul.
                </p>
              </span>

              <input
                type="checkbox"
                checked={prefs.romanization}
                onChange={(e) =>
                  update("romanization", e.target.checked)
                }
              />
            </label>

          </div>
        </details>

        {/* PRACTICE PREFERENCES */}
        <details className="settings-accordion">
          <summary>
            <span>🎯 Practice Preferences</span>
            <span className="accordion-arrow">⌄</span>
          </summary>

          <div className="accordion-content">

            <label htmlFor="focus">
              Practice Focus
            </label>
            <p className="settings-note">
              Choose the language skills you want to develop.
            </p>

            <select
              id="focus"
              className="settings-select"
              value={prefs.practiceFocus}
              onChange={(e) =>
                update("practiceFocus", e.target.value)
              }
            >
              <option>Mixed practice</option>
              <option>Vocabulary</option>
              <option>Grammar</option>
              <option>Conversation</option>
              <option>Listening</option>
            </select>

            <div className="settings-divider" />

            <label htmlFor="dailyMinutes">
              Daily Study Goal
            </label>
            <p className="settings-note">
              Set a manageable daily learning goal.
            </p>

            <select
              id="dailyMinutes"
              className="settings-select"
              value={prefs.dailyMinutes}
              onChange={(e) =>
                update("dailyMinutes", e.target.value)
              }
            >
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
            </select>

          </div>
        </details>

        {/* NOTIFICATIONS */}
        <details className="settings-accordion">
          <summary>
            <span>🔔 Notifications</span>
            <span className="accordion-arrow">⌄</span>
          </summary>

          <div className="accordion-content">

            <label className="settings-toggle-row">
              <span>
                <strong>Study Reminders</strong>
                <p className="settings-note">
                  Receive reminders to practice Korean.
                </p>
              </span>

              <input
                type="checkbox"
                checked={prefs.reminders}
                onChange={(e) =>
                  update("reminders", e.target.checked)
                }
              />
            </label>

            {prefs.reminders && (
              <>
                <div className="settings-divider" />

                <label htmlFor="frequency">
                  Reminder Frequency
                </label>

                <select
                  id="frequency"
                  className="settings-select"
                  value={prefs.reminderFrequency}
                  onChange={(e) =>
                    update(
                      "reminderFrequency",
                      e.target.value
                    )
                  }
                >
                  <option>Daily</option>
                  <option>Weekdays</option>
                  <option>Weekly</option>
                </select>

                <div className="settings-divider" />

                <label htmlFor="reminderTime">
                  Preferred Reminder Time
                </label>

                <input
                  id="reminderTime"
                  type="time"
                  className="settings-select"
                  value={prefs.reminderTime}
                  onChange={(e) =>
                    update("reminderTime", e.target.value)
                  }
                />

                <div className="settings-divider" />

                <label className="settings-toggle-row">
                  <span>
                    <strong>Streak Reminders</strong>
                    <p className="settings-note">
                      Optional reminders about your streak.
                    </p>
                  </span>

                  <input
                    type="checkbox"
                    checked={prefs.streakReminders}
                    onChange={(e) =>
                      update(
                        "streakReminders",
                        e.target.checked
                      )
                    }
                  />
                </label>
              </>
            )}

            <p className="settings-note">
              Preferences are saved automatically.
              Actual notifications will be added later.
            </p>

          </div>
        </details>

        {/* BACK TO LOGIN */}
        <button
          type="button"
          className="settings-logout"
          onClick={() => router.push("/")}
        >
          Log Out (currently not connected!)
        </button>

      </div>
    </main>
  );
}
