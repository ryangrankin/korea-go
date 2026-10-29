"use client";

/*
  LessonTestOutBar: the strip at the top of a lesson that offers
  "Test out" (if the lesson has enough questions), or says the lesson was
  skipped, with a way to put it back on the learner's path.
*/

import Link from "next/link";
import { useLessonProgress } from "../../lib/lessonProgress";
import { unskipLesson, useSkillProgress } from "../../lib/skillProgress";

export default function LessonTestOutBar({ lessonId, canTestOut }: { lessonId: string; canTestOut: boolean }) {
  const completed = useLessonProgress();
  const progress = useSkillProgress();
  const skipped = Boolean(progress.skipped[lessonId]);

  if (completed[lessonId]) return null;

  if (skipped) {
    return (
      <div className="testout-bar">
        <p>
          <span aria-hidden="true">⏭</span> You skipped this lesson after showing you know it. Welcome back for a
          refresher!
        </p>
        <button type="button" className="link-button" onClick={() => unskipLesson(lessonId)}>
          Put it back in my lesson path
        </button>
      </div>
    );
  }

  if (!canTestOut) return null;

  return (
    <div className="testout-bar">
      <p>
        <span aria-hidden="true">💪</span> Already know this?
      </p>
      <Link href={`/test-out/${lessonId}`} className="testout-link">
        Challenge yourself: test out →
      </Link>
    </div>
  );
}
