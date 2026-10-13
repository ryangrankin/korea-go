export const instant = false;

import { Suspense } from "react";
import LessonViewer from "../../../components/LessonViewer";
import { lessons } from "../../../data/lessons";

export default function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  // Suspense lets the build finish: the lesson id is only known
  // when someone opens the page.
  return (
    <Suspense fallback={<main className="basic-page" />}>
      <LessonContent params={params} />
    </Suspense>
  );
}

async function LessonContent({
  params,
}: {

type PageProps = {
  params: Promise<{ lessonId: string }>;
};

async function LessonContent({ params }: PageProps) {
  const { lessonId } = await params;

  const lesson = lessons.find((item) => item.id === lessonId);

  return (
    <LessonViewer
      lessonId={lessonId}
      title={lesson?.title ?? "Lesson Coming Soon"}
      description={lesson?.description ?? "Content will be added soon."}
      items={lesson?.vocabulary ?? []}
      sections={lesson?.sections}
    />
  );
}

export default function LessonPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <main className="basic-page">
          <div className="basic-container">
            <p>Loading lesson...</p>
          </div>
        </main>
      }
    >
      <LessonContent params={params} />
    </Suspense>
  );
}