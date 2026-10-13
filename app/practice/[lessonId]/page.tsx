
import { Suspense } from "react";
export const instant = false; 


import PracticeViewer from "../../../components/PracticeViewer";

export default function PracticePage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  // Suspense lets the build finish: the lesson id is only known
  // when someone opens the page.
  return (
    <Suspense fallback={<main className="basic-page" />}>
      <PracticeContent params={params} />
    </Suspense>
  );
}

async function PracticeContent({
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
