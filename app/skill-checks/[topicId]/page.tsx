import { Suspense } from "react";
import { notFound } from "next/navigation";
import ChallengeRunner from "../../../components/challenge/ChallengeRunner";
import { findTopic, skillTopics } from "../../../data/skillChecks";

type PageProps = {
  params: Promise<{ topicId: string }>;
};

// Build a page for every topic in data/skillChecks.ts.
export function generateStaticParams() {
  return skillTopics.map((topic) => ({ topicId: topic.id }));
}

async function SkillCheckContent({ params }: PageProps) {
  const { topicId } = await params;
  if (!findTopic(topicId)) notFound();
  return <ChallengeRunner mode="topic" topicId={topicId} />;
}

export default function SkillCheckPage({ params }: PageProps) {
  return (
    <Suspense fallback={<main className="basic-page" />}>
      <SkillCheckContent params={params} />
    </Suspense>
  );
}
