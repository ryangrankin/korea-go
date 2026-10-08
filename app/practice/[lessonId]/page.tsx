
import PracticeViewer from "../../../components/PracticeViewer";

export default async function PracticePage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;

  return (
    <PracticeViewer
      title={`Practice: ${lessonId}`}
      questions={[]}
    />
  );
}
