"use client";

/*
  ChallengeRunner: runs a skill check (a whole topic) or a test-out (one
  lesson), from the intro screen, through the questions, to the results.
  - Questions and options are mixed up when the learner taps Start.
  - Each answer is checked right away, with an explanation.
  - At the end the score is saved (lib/skillProgress.ts) and
    ChallengeResults shows what to do next.
  - "Practice missed questions" replays only the misses. Practice rounds
    aren't saved and can't unlock anything.
*/

import { useState } from "react";
import Link from "next/link";
import { lessons, units } from "../../data/lessons";
import {
  CHALLENGE_CONFIG,
  findTopic,
  lessonChallenge,
  type ChallengeQuestion,
} from "../../data/skillChecks";
import { pickTopicQuestions, scoreChallenge, shuffle, type Answer, type ChallengeResult } from "../../lib/skillChecks";
import { recordTestOut, recordTopicCheck, useSkillProgress } from "../../lib/skillProgress";
import Pup from "../Pup";
import SpeechNotice from "../SpeechNotice";
import ChallengeResults from "./ChallengeResults";
import QuestionCard, { type PreparedQuestion } from "./QuestionCard";
import "../lesson/lesson.css";
import "../games/games.css";
import "./challenge.css";

type ChallengeRunnerProps = { mode: "topic"; topicId: string } | { mode: "lesson"; lessonId: string };

type Stage = "intro" | "questions" | "results";

// Mix up the options, meanings, or tiles for each question.
function prepare(questions: ChallengeQuestion[]): PreparedQuestion[] {
  return questions.map((question) => {
    if (question.type === "match") return { question, order: shuffle(question.pairs.map((pair) => pair.english)) };
    if (question.type === "order") return { question, order: shuffle([...question.words, ...(question.extra ?? [])]) };
    return { question, order: shuffle(question.options) };
  });
}

export default function ChallengeRunner(props: ChallengeRunnerProps) {
  const progress = useSkillProgress();
  const [stage, setStage] = useState<Stage>("intro");
  const [practice, setPractice] = useState(false); // replaying missed questions only
  const [prepared, setPrepared] = useState<PreparedQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [result, setResult] = useState<ChallengeResult | null>(null);

  // What this challenge covers.
  const lessonInfo = props.mode === "lesson" ? lessonChallenge(props.lessonId) : undefined;
  const topic = props.mode === "topic" ? findTopic(props.topicId) : lessonInfo?.topic;
  const lesson = props.mode === "lesson" ? lessons.find((l) => l.id === props.lessonId) : undefined;
  if (!topic) return null;

  const unitIndex = units.findIndex((unit) => unit.id === topic.unitId);
  const title = lesson ? lesson.title : topic.title;
  const eyebrow = lesson
    ? `Test out · Unit ${unitIndex} · Lesson ${units[unitIndex].lessons.indexOf(lesson) + 1}`
    : `Skill check · Unit ${unitIndex}`;
  const backHref = lesson ? `/lessons/${lesson.id}` : "/skill-checks";
  const record = lesson ? progress.lessons[lesson.id] : progress.topics[topic.id];

  const questionCount =
    props.mode === "lesson"
      ? lessonInfo?.questions.length ?? 0
      : pickTopicQuestions(topic, CHALLENGE_CONFIG.topicQuestionsPerLesson, () => 0).length;

  function begin(questions: ChallengeQuestion[], isPractice: boolean) {
    setPrepared(prepare(questions));
    setPractice(isPractice);
    setAnswers({});
    setIndex(0);
    setResult(null);
    setStage("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function start() {
    begin(props.mode === "lesson" ? lessonInfo?.questions ?? [] : pickTopicQuestions(topic!), false);
  }

  function next() {
    if (index < prepared.length - 1) {
      setIndex(index + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const scored = scoreChallenge(
      prepared.map((p) => p.question),
      answers
    );
    if (!practice) {
      if (props.mode === "lesson") recordTestOut(props.lessonId, scored);
      else recordTopicCheck(topic!.id, scored);
    }
    setResult(scored);
    setStage("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const current = prepared[index];

  return (
    <main className="basic-page">
      <div className="basic-container challenge-container">
        <Link href={backHref} className="back-button">
          ← {lesson ? "Back to the lesson" : "All skill checks"}
        </Link>

        <p className="lesson-eyebrow">{practice ? "Practice round" : eyebrow}</p>
        <h1>
          {title} {!lesson && <span aria-hidden="true">{topic.icon}</span>}
        </h1>

        {/* ---------- Intro ---------- */}
        {stage === "intro" && (
          <section className="challenge-intro">
            <div className="pup-guide">
              <Pup size={72} />
              <p className="pup-bubble">
                {lesson
                  ? "Already know this lesson? Show me, and you can skip ahead!"
                  : "Let's see what you already know. You can skip the lessons you ace."}
              </p>
            </div>

            <ul className="challenge-facts">
              <li>
                <span aria-hidden="true">📝</span> {questionCount} quick questions
              </li>
              <li>
                <span aria-hidden="true">🎯</span> Get {CHALLENGE_CONFIG.passPercent}% or more to pass
              </li>
              <li>
                <span aria-hidden="true">🔁</span> No penalty: try again as often as you like
              </li>
            </ul>

            {record && (
              <p className="challenge-past">
                Your best so far: <strong>{record.bestPercent}%</strong> ({record.attempts}{" "}
                {record.attempts === 1 ? "try" : "tries"})
              </p>
            )}

            <button type="button" className="practice-next-button" onClick={start}>
              {record ? "Try again" : "Start"} →
            </button>
            {lesson && (
              <Link href={`/lessons/${lesson.id}`} className="secondary-button">
                Take the lesson instead
              </Link>
            )}
          </section>
        )}

        {/* ---------- Questions ---------- */}
        {stage === "questions" && current && (
          <section aria-label="Challenge questions">
            <div className="challenge-progress">
              <span>
                Question {index + 1} of {prepared.length}
              </span>
              <div
                className="lesson-progress-track"
                role="progressbar"
                aria-label="Challenge progress"
                aria-valuemin={0}
                aria-valuemax={prepared.length}
                aria-valuenow={index}
              >
                <div className="lesson-progress-fill" style={{ width: `${(index / prepared.length) * 100}%` }} />
              </div>
            </div>

            <QuestionCard
              key={current.question.id}
              prepared={current}
              answer={answers[current.question.id]}
              onAnswer={(answer) =>
                // First answer counts; it can't be changed.
                setAnswers((given) => (current.question.id in given ? given : { ...given, [current.question.id]: answer }))
              }
            />

            {current.question.id in answers && (
              <button type="button" className="practice-next-button" onClick={next}>
                {index < prepared.length - 1 ? "Next question →" : "See my results →"}
              </button>
            )}
          </section>
        )}

        {/* ---------- Results ---------- */}
        {stage === "results" && result && (
          <ChallengeResults
            topic={topic}
            lessonId={lesson?.id}
            result={result}
            practice={practice}
            onRetry={start}
            onPracticeMissed={() => begin(result.missed, true)}
          />
        )}
      </div>

      <SpeechNotice />
    </main>
  );
}
