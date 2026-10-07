import Link from "next/link";

export default function ProfilePage() {
  return (
    <main className="basic-page">
      <div className="basic-container">

        <Link href="/settings" className="back-button">
          ← Settings
        </Link>

        <div className="profile-header">
          <div className="profile-avatar">
            👤
          </div>

          <h1>Your Profile</h1>
          <p>Beginner Korean Learner</p>
        </div>

        <div className="profile-card">
          <p>
            <strong>Name</strong>
            <span>Your Name</span>
          </p>

          <p>
            <strong>Username</strong>
            <span>username</span>
          </p>

          <p>
            <strong>Level</strong>
            <span>Beginner</span>
          </p>

          <p>
            <strong>Current Streak</strong>
            <span>🔥 3 days</span>
          </p>
        </div>

        <button className="secondary-button">
          Edit Profile
        </button>

      </div>
    </main>
  );
}