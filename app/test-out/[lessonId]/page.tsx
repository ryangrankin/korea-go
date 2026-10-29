import { Suspense } from "react";
import { notFound } from "next/navigation";
import ChallengeRunner from "../../../components/challenge/ChallengeRunner";
import { lessons } from "../../../data/lessons";
import { canTestOut } from "../../../data/skillChecks";

type PageProps = {
  params: Promise<{ lessonId: string }>;
};

// Build a page for every lesson with enough questions to test out of.
export function generateStaticParams() {
  return lessons.filter((lesson) => canTestOut(lesson.id)).map((lesson) => ({ lessonId: lesson.id }));
}

async function TestOutContent({ params }: PageProps) {
  const { lessonId } = await params;
  if (!canTestOut(lessonId)) notFound();
  return <ChallengeRunner mode="lesson" lessonId={lessonId} />;
}

export default function TestOutPage({ params }: PageProps) {
  return (
    <Suspense fallback={<main className="basic-page" />}>
      <TestOutContent params={params} />
    </Suspense>
  );
}
