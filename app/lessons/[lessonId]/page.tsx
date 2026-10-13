import { Suspense } from "react";
import LessonViewer from "../../../components/LessonViewer";
import { lessons } from "../../../data/lessons";

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