"use client";

/*
  SkillCheckHub: every topic's skill check, with where the learner
  stands in each one, and a "Test out" link for each lesson.
  Used by /skill-checks (from the dashboard) and /placement (right after
  sign-up, with a Continue button instead of the main navigation).
*/

import { type CSSProperties } from "react";
import Link from "next/link";
import { units } from "../../data/lessons";
import { canTestOut, topicForUnit } from "../../data/skillChecks";
import { useLessonProgress } from "../../lib/lessonProgress";
import { topicStatus } from "../../lib/skillChecks";
import { unskipLesson, useSkillProgress } from "../../lib/skillProgress";
import BottomNav from "../BottomNav";
import Pup from "../Pup";
import TopicStatusBadge from "./TopicStatusBadge";
import "../lesson/lesson.css";
import "./challenge.css";

export default function SkillCheckHub({ fromOnboarding = false }: { fromOnboarding?: boolean }) {
  const completed = useLessonProgress();
  const progress = useSkillProgress();

  return (
    <main className="basic-page">
      <div className="basic-container challenge-container">
        <Link href={fromOnboarding ? "/onboarding" : "/dashboard"} className="back-button">
          ← {fromOnboarding ? "Back" : "Dashboard"}
        </Link>

        <h1>Skill checks</h1>
        <div className="pup-guide">
          <Pup size={72} />
          <p className="pup-bubble">
            Already know some Korean? Pick a topic and show me. You can skip the lessons you ace, and keep the
            rest. Each topic is checked on its own.
          </p>
        </div>

        {fromOnboarding && (
          <Link href="/dashboard" className="practice-next-button">
            I&apos;m new to Korean. Start from the beginning →
          </Link>
        )}

        <ul className="topic-list">
          {units.map((unit, unitIndex) => {
            const topic = topicForUnit(unit.id);
            if (unit.lessons.length === 0) return null;
            const lessonIds = unit.lessons.map((lesson) => lesson.id);
            const record = topic ? progress.topics[topic.id] : undefined;
            const status = topicStatus({
              lessonIds,
              isCompleted: (id) => completed[id] === true,
              isSkipped: (id) => Boolean(progress.skipped[id]),
              lastCheckPassed: record?.lastPassed,
            });

            return (
              <li
                key={unit.id}
                className="topic-card"
                style={unit.color ? ({ "--unit-color": unit.color } as CSSProperties) : undefined}
              >
                <div className="topic-card-header">
                  <span className="topic-icon" aria-hidden="true">
                    {topic?.icon ?? unit.icon}
                  </span>
                  <div>
                    <p className="unit-label">Unit {unitIndex}</p>
                    <h2>{topic?.title ?? unit.title}</h2>
                  </div>
                </div>

                <p>{topic?.description ?? unit.description}</p>

                <p className="topic-card-status">
                  <TopicStatusBadge status={status} />
                  {record && (
                    <span className="topic-card-score">
                      Last score {record.lastPercent}% · best {record.bestPercent}%
                    </span>
                  )}
                </p>

                {topic ? (
                  <Link href={`/skill-checks/${topic.id}`} className="practice-next-button">
                    {record ? "Try the skill check again" : "Challenge yourself"} →
                  </Link>
                ) : (
                  <p className="topic-coming-soon">Skill check coming soon</p>
                )}

                {/* Each lesson: done, skipped, or test out */}
                {topic && (
                  <details className="topic-lessons">
                    <summary>Test out of one lesson</summary>
                    <ol>
                      {unit.lessons.map((lesson) => {
                        const isComplete = completed[lesson.id] === true;
                        const isSkipped = Boolean(progress.skipped[lesson.id]);
                        return (
                          <li key={lesson.id}>
                            <Link href={`/lessons/${lesson.id}`} className="topic-lesson-title">
                              {lesson.title}
                            </Link>
                            {isComplete ? (
                              <span className="topic-lesson-state">✓ Completed</span>
                            ) : isSkipped ? (
                              <span className="topic-lesson-state">
                                ⏭ Skipped{" "}
                                <button type="button" className="link-button" onClick={() => unskipLesson(lesson.id)}>
                                  Add back
                                </button>
                              </span>
                            ) : canTestOut(lesson.id) ? (
                              <Link href={`/test-out/${lesson.id}`} className="topic-lesson-testout">
                                Test out
                              </Link>
                            ) : (
                              <span className="topic-lesson-state">Review game</span>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </details>
                )}
              </li>
            );
          })}
        </ul>

        <p className="challenge-note">
          Your results are saved on this device only for now.
        </p>

        {fromOnboarding ? (
          <Link href="/dashboard" className="secondary-button">
            Continue to my lessons →
          </Link>
        ) : (
          <BottomNav />
        )}
      </div>
    </main>
  );
}
