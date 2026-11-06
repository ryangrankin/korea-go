import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import BottomNav from "../../../components/BottomNav";
import ConversationSimulator from "../../../components/conversation/ConversationSimulator";
import { findScenario, scenarios } from "../../../data/conversations";

type PageProps = {
  params: Promise<{ scenarioId: string }>;
};

// A page for every scenario in data/conversations.ts.
export function generateStaticParams() {
  return scenarios.map((scenario) => ({ scenarioId: scenario.id }));
}

async function ScenarioContent({ params }: PageProps) {
  const { scenarioId } = await params;
  const scenario = findScenario(scenarioId);
  if (!scenario) notFound();

  return (
    <>
      <h1>
        {scenario.title} {scenario.icon}
      </h1>
      <ConversationSimulator scenario={scenario} />
    </>
  );
}

export default function ScenarioPage({ params }: PageProps) {
  return (
    <main className="basic-page convo-page">
      <div className="basic-container convo-container">
        <Link href="/conversation" className="back-button">
          ← Conversation
        </Link>

        <Suspense fallback={<p>Loading conversation...</p>}>
          <ScenarioContent params={params} />
        </Suspense>
      </div>

      <BottomNav />
    </main>
  );
}
