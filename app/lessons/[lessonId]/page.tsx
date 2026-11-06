export const instant = false;

import { Suspense } from "react";
import LessonViewer from "../../../components/LessonViewer";
import { lessons, units } from "../../../data/lessons";
import { lessonObjectives } from "../../../data/objectives";
import { canTestOut } from "../../../data/skillChecks";
import { buildRomanizationIndex, romanizationFor } from "../../../lib/romanization";

// Built once on the server from every lesson's own romanization.
const romanizationIndex = buildRomanizationIndex(units);

type PageProps = {
  params: Promise<{ lessonId: string }>;
};

async function LessonContent({ params }: PageProps) {
  const { lessonId } = await params;

  const index = lessons.findIndex((item) => item.id === lessonId);
  const lesson = lessons[index];
  const next = lesson ? lessons[index + 1] : undefined;
  const previous = index > 0 ? lessons[index - 1] : undefined;

  // How to say each Korean answer choice in this lesson (missions and the
  // game), taken from the lessons' own romanization. Only this lesson's
  // answers are sent to the browser.
  const optionRomanization: Record<string, string> = {};
  const sections = lesson?.sections;
  const options = [
    ...(sections?.study ?? []).flatMap((section) => section.missions.flatMap((mission) => mission.options)),
    ...(sections?.game?.steps ?? []).flatMap((step) => step.options),
  ];
  for (const option of options) {
    const romanization = romanizationFor(romanizationIndex, option);
    if (romanization) optionRomanization[option] = romanization;
  }

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
      canTestOut={canTestOut(lessonId)}
      eyebrow={eyebrow}
      photo={unitIndex >= 0 ? units[unitIndex].photo : undefined}
      nextLesson={next && { id: next.id, title: next.title }}
      previousLesson={previous && { id: previous.id, title: previous.title }}
      unit={
        unitIndex >= 0
          ? {
              id: units[unitIndex].id,
              lessonIds: units[unitIndex].lessons.map((item) => item.id),
              number: unitIndex,
              title: units[unitIndex].title,
              lessonNumber: units[unitIndex].lessons.indexOf(lesson) + 1,
              lessonCount: units[unitIndex].lessons.length,
            }
          : undefined
      }
      optionRomanization={optionRomanization}
      objectives={lessonObjectives[lessonId] ?? []}
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