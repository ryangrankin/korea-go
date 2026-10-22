import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import CultureGame from "../../../components/games/CultureGame";
import DifficultyBadge from "../../../components/games/DifficultyBadge";
import { culturalGames, findCulturalGame } from "../../../data/culturalGames";

type PageProps = {
  params: Promise<{ gameId: string }>;
};

// Build a page for every game in data/culturalGames.ts.
export function generateStaticParams() {
  return culturalGames.map((game) => ({ gameId: game.id }));
}

async function GameContent({ params }: PageProps) {
  const { gameId } = await params;
  const game = findCulturalGame(gameId);
  if (!game) notFound();

  return (
    <>
      <h1>
        {game.title} {game.emoji}
      </h1>
      <p className="culture-level">
        <DifficultyBadge level={game.difficulty} />
      </p>
      <CultureGame game={game} />
    </>
  );
}

export default function CultureGamePage({ params }: PageProps) {
  return (
    <main className="basic-page">
      <div className="basic-container game-container">
        <Link href="/games" className="back-button">
          ← Back to Games
        </Link>

        <Suspense fallback={<p>Loading game...</p>}>
          <GameContent params={params} />
        </Suspense>
      </div>
    </main>
  );
}
