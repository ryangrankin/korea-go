import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="basic-page">
      <div className="basic-container">

        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>Settings</h1>

        <div className="settings-list">

          <Link href="/profile" className="settings-item">
            <span>👤 Profile</span>
            <span>›</span>
          </Link>

          <div className="settings-item">
            <span>🔔 Notifications</span>
            <span>›</span>
          </div>

          <div className="settings-item">
            <span>🔊 Audio</span>
            <span>›</span>
          </div>

          <div className="settings-item">
            <span>🌐 Language</span>
            <span>English</span>
          </div>

          <Link href="/achievements" className="settings-item">
            <span>🏆 Achievements</span>
            <span>›</span>
          </Link>

        </div>

        <Link href="/" className="logout-button">
          Log Out
        </Link>

      </div>
    </main>
  );
}