import Link from "next/link";
import BottomNav from "../../components/BottomNav";

export default function GamesPage() {
  return (
    <main className="basic-page">
      <div className="basic-container">
        <h1>Mini Games 🎮</h1>
        <p>Practice your Korean with fun activities!</p>

        <section className="lesson-section">
          {/* HANGEUL MATCH */}
          <Link href="/games/hangeul-match" className="lesson-card">
            <div className="lesson-icon" lang="ko">가</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>Hangeul Match</h3>
              </div>
              <p>Match letters and words from the Hangeul lessons to their sounds. Beat your best time!</p>
            </div>

            <span className="lesson-arrow">›</span>
          </Link>

          {/* MORE GAMES */}
          <div className="lesson-card locked">
            <div className="lesson-icon">🎲</div>

            <div className="lesson-info">
              <div className="lesson-title-row">
                <h3>More games</h3>
                <span>Coming soon</span>
              </div>
              <p>More ways to practice are on the way.</p>
            </div>

            <span className="lesson-arrow">🔒</span>
          </div>
        </section>
      </div>

      <BottomNav />
    </main>
  );
}
