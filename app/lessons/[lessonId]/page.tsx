export const instant = false;

import { Suspense } from "react";
import LessonViewer from "../../../components/LessonViewer";
import { lessons, units } from "../../../data/lessons";

type PageProps = {
  params: Promise<{ lessonId: string }>;
};

async function LessonContent({ params }: PageProps) {
  const { lessonId } = await params;

  const index = lessons.findIndex((item) => item.id === lessonId);
  const lesson = lessons[index];
  const next = lesson ? lessons[index + 1] : undefined;

  // "Unit 1 · Lesson 2"
  const unitIndex = units.findIndex((unit) => unit.lessons.includes(lesson));
  const eyebrow =
    unitIndex >= 0
      ? `Unit ${unitIndex} · Lesson ${units[unitIndex].lessons.indexOf(lesson) + 1}`
      : undefined;

  return (
    <LessonViewer
      // A new key resets the lesson when moving on to the next one.
      key={lessonId}
      lessonId={lessonId}
      eyebrow={eyebrow}
      photo={unitIndex >= 0 ? units[unitIndex].photo : undefined}
      nextLesson={next && { id: next.id, title: next.title }}
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