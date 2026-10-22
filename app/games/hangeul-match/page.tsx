import Link from "next/link";
import HangeulMatch from "../../../components/games/HangeulMatch";

export default function HangeulMatchPage() {
  return (
    <main className="basic-page">
      <div className="basic-container game-container">
        <Link href="/games" className="back-button">
          ← Mini Games
        </Link>

        <h1>Hangeul Match 가</h1>
        <HangeulMatch />
      </div>
    </main>
  );
}
