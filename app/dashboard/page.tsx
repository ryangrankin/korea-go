import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="dashboard-page">
      <div className="dashboard-container">

        {/* TOP BAR */}
        <header className="dashboard-header">
          <Link href="/settings" className="settings-button">
            ⚙
          </Link>

          <div className="dashboard-logo">
            <span className="logo-korea">korea</span>
            <span className="logo-go">GO!</span>
          </div>

          <div className="streak">
            🔥 3
          </div>
        </header>

        {/* GREETING */}
        <section className="dashboard-greeting">
          <div>
            <h1>Good afternoon!</h1>
            <p>잘 지내고 계신가요?</p>
          </div>

          <div className="dashboard-mascot">
            🐶
          </div>
        </section>

        {/* OVERALL PROGRESS */}
        <section className="progress-section">
          <div className="progress-label">
            <span>Greetings</span>
            <span>80%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: "80%" }}
            />
          </div>

          <p>
            You&apos;re almost done with Greetings!
            <br />
            Keep going!
          </p>
        </section>

        {/* LESSONS */}
        <section className="lesson-section">
          <h2>Your Lessons</h2>

          <Link href="/lessons/greetings" className="lesson-card">
            <div className="lesson-icon">👋</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Greetings</h3>
                <span>80%</span>
              </div>

              <p>Learn basic Korean greetings</p>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>

          <Link href="/lessons/airport" className="lesson-card">
            <div className="lesson-icon">✈️</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Airport</h3>
                <span>25%</span>
              </div>

              <p>Navigate the airport in Korean</p>

              <div className="lesson-progress-track">
                <div
                  className="lesson-progress-fill"
                  style={{ width: "25%" }}
                />
              </div>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>

          <div className="lesson-card locked">
            <div className="lesson-icon">🍜</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Food & Dining</h3>
              </div>

              <p>Order food and understand menus</p>
            </div>

            <span className="lesson-arrow">🔒</span>
          </div>

        </section>

      </div>
    </main>
  );
}