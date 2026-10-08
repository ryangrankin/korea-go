
import LessonViewer from "../../../components/LessonViewer";
import { lessons } from "../../../data/lessons";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  const lesson = lessons.find(
    (item) => item.id === lessonId
  );

  return (
    <LessonViewer
      lessonId={lessonId}
      title={lesson?.title ?? "Lesson Coming Soon"}
      description={
        lesson?.description ??
        "This lesson is currently being developed."
      }
      items={lesson?.vocabulary ?? []}
    />
  );
}
