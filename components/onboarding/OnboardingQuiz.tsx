"use client";

/*
  OnboardingQuiz: the short quiz new learners take right after signing up.
  One question per screen, covering the same choices as the Settings page:
    1. Korean level (or "Not sure?" → 3 quick questions that suggest one)
    2. Learning goal   3. Practice focus   4. Romanization   5. Daily goal
  Then "Your plan" shows what those choices will do in lessons, and saves
  them exactly like the Settings page does (so they follow the account).
  The questions and options live in data/onboardingQuiz.ts.
*/

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  focusOptions,
  goalOptions,
  levelCheck,
  levelFromScore,
  levelOptions,
  minuteOptions,
  romanizationOptions,
  type QuizOption,
} from "../../data/onboardingQuiz";
import { saveProgressSoon } from "../../lib/accountSync";
import { goalLabel, goalSuggestion, lessonSettings, type QuizKind } from "../../lib/learningSettings";
import { DEFAULT_PREFERENCES, savePreferences, type Preferences } from "../../lib/preferences";
import { speakKorean } from "../../lib/speak";
import KoreanText from "../KoreanText";
import Pup from "../Pup";
import SpeechNotice from "../SpeechNotice";
import "./onboarding.css";

type Step = "level" | "levelCheck" | "goal" | "focus" | "romanization" | "minutes" | "plan";
const MAIN_STEPS: Step[] = ["level", "goal", "focus", "romanization", "minutes"];

const QUESTION: Record<Step, string> = {
  level: "First, how much Korean do you know?",
  levelCheck: "Let's find out! Three quick questions.",
  goal: "What do you want to use Korean for?",
  focus: "Which skill do you want to work on most?",
  romanization: "Do you want English letters under the Korean?",
  minutes: "How much time can you practice each day?",
  plan: "Here's your plan!",
};

const FIRST_QUESTION: Record<QuizKind, string> = {
  meaning: "see the Korean, pick the meaning",
  korean: "see the meaning, pick the Korean",
  listen: "listening",
};

// One page of tappable answer cards.
function OptionCards<T>({
  options,
  selected,
  onSelect,
  preview,
}: {
  options: QuizOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
  preview?: (value: T) => React.ReactNode; // extra example inside each card
}) {
  return (
    <div className="quiz-options" role="radiogroup">
      {options.map((option) => (
        <button
          key={String(option.value)}
          type="button"
          role="radio"
          aria-checked={option.value === selected}
          className={`quiz-option ${option.value === selected ? "selected" : ""}`}
          onClick={() => onSelect(option.value)}
        >
          <span className="quiz-option-icon" aria-hidden="true">{option.icon}</span>
          <span className="quiz-option-text">
            <strong>{option.title}</strong>
            <span>{option.detail}</span>
            {preview?.(option.value)}
          </span>
        </button>
      ))}
    </div>
  );
}

export default function OnboardingQuiz() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("level");
  const [choices, setChoices] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [romanizationChosen, setRomanizationChosen] = useState(false);

  // "Not sure?" level check
  const [checkIndex, setCheckIndex] = useState(0);
  const [checkScore, setCheckScore] = useState(0);
  const [checkPicked, setCheckPicked] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Preferences["level"] | null>(null);

  const choose = <K extends keyof Preferences>(key: K, value: Preferences[K]) =>
    setChoices({ ...choices, [key]: value });

  function goTo(next: Step) {
    // Suggest romanization for beginners, unless they've already picked.
    if (next === "romanization" && !romanizationChosen) {
      setChoices({ ...choices, romanization: choices.level === "Beginner" });
    }
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stepNumber = MAIN_STEPS.indexOf(step === "levelCheck" ? "level" : step);
  const nextStep = (current: Step): Step =>
    MAIN_STEPS[MAIN_STEPS.indexOf(current) + 1] ?? "plan";
  const previousStep = (current: Step): Step | null =>
    current === "plan" ? "minutes" : MAIN_STEPS[MAIN_STEPS.indexOf(current) - 1] ?? null;

  // ----- Level check -----
  function answerCheck(option: string) {
    if (checkPicked) return;
    const question = levelCheck[checkIndex];
    setCheckPicked(option);
    if (option === question.answer) setCheckScore(checkScore + 1);
  }

  function nextCheck() {
    if (checkIndex < levelCheck.length - 1) {
      setCheckIndex(checkIndex + 1);
      setCheckPicked(null);
      return;
    }
    const level = levelFromScore(checkScore);
    setSuggested(level);
    setChoices({ ...choices, level });
    setCheckIndex(0);
    setCheckScore(0);
    setCheckPicked(null);
    goTo("level");
  }

  // ----- Finish -----
  function save(destination: string) {
    savePreferences(choices);
    saveProgressSoon();
    router.push(destination);
  }

  const settings = lessonSettings(choices);
  const suggestion = goalSuggestion(choices.goal);

  return (
    <div className="onboarding-quiz">
      <div className="quiz-topbar">
        {/* Progress dots for the five questions */}
        <ol className="quiz-dots" aria-label={step === "plan" ? "All questions answered" : `Question ${stepNumber + 1} of ${MAIN_STEPS.length}`}>
          {MAIN_STEPS.map((name, index) => (
            <li
              key={name}
              className={step === "plan" || index < stepNumber ? "done" : index === stepNumber ? "current" : ""}
            />
          ))}
        </ol>
        <Link href="/dashboard" className="quiz-skip">
          Skip for now
        </Link>
      </div>

      {/* The pup asks each question */}
      <div className="pup-guide">
        <Pup size={step === "plan" ? 96 : 72} className={step === "plan" ? "pup-celebrate" : ""} />
        <h1 className="pup-bubble quiz-question">{QUESTION[step]}</h1>
      </div>

      {/* 1. Level */}
      {step === "level" && (
        <>
          {suggested && (
            <p className="quiz-note">
              Based on your answers, we suggest <strong>{suggested}</strong>. You can still pick another level.
            </p>
          )}
          <OptionCards options={levelOptions} selected={choices.level} onSelect={(value) => choose("level", value)} />
          <button type="button" className="link-button quiz-not-sure" onClick={() => setStep("levelCheck")}>
            Not sure? Try 3 quick questions
          </button>
        </>
      )}

      {/* "Not sure?" level check */}
      {step === "levelCheck" && (
        <div className="lesson-content-card quiz-check">
          <p className="practice-count">
            Question {checkIndex + 1} of {levelCheck.length}
          </p>
          <h2>{levelCheck[checkIndex].prompt}</h2>
          {levelCheck[checkIndex].korean && (
            <KoreanText text={levelCheck[checkIndex].korean!} className="quiz-check-korean" />
          )}
          <div className="practice-options">
            {levelCheck[checkIndex].options.map((option) => {
              const isAnswer = option === levelCheck[checkIndex].answer;
              let state = "";
              if (checkPicked && isAnswer) state = "correct";
              else if (checkPicked === option) state = "wrong";
              return (
                <button
                  key={option}
                  type="button"
                  className={`practice-option ${state}`}
                  disabled={!!checkPicked && state === ""}
                  onClick={() => {
                    if (/[가-힣]/.test(option)) speakKorean(option);
                    answerCheck(option);
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          {checkPicked && (
            <button type="button" className="practice-next-button" onClick={nextCheck}>
              {checkIndex < levelCheck.length - 1 ? "Next →" : "See my level →"}
            </button>
          )}
        </div>
      )}

      {/* 2–5. Goal, focus, romanization, daily minutes */}
      {step === "goal" && (
        <OptionCards options={goalOptions} selected={choices.goal} onSelect={(value) => choose("goal", value)} />
      )}
      {step === "focus" && (
        <OptionCards
          options={focusOptions}
          selected={choices.practiceFocus}
          onSelect={(value) => choose("practiceFocus", value)}
        />
      )}
      {step === "romanization" && (
        <OptionCards
          options={romanizationOptions}
          selected={choices.romanization}
          onSelect={(value) => {
            setRomanizationChosen(true);
            choose("romanization", value);
          }}
          preview={(show) => (
            <span className="quiz-roman-preview" lang="ko">
              안녕하세요
              {show && <em>annyeonghaseyo</em>}
            </span>
          )}
        />
      )}
      {step === "minutes" && (
        <OptionCards
          options={minuteOptions}
          selected={choices.dailyMinutes}
          onSelect={(value) => choose("dailyMinutes", value)}
        />
      )}

      {/* Your plan: what the choices will do */}
      {step === "plan" && (
        <div className="quiz-plan">
          <ul>
            <li>
              <span>Level</span>
              <strong>{choices.level}</strong>
              <p>
                Learn {settings.practice.newAtOnce} new words at a time, with {settings.practice.optionCount} answer
                choices and {FIRST_QUESTION[settings.practice.quizOrder[0]]} questions first.
              </p>
            </li>
            <li>
              <span>Goal</span>
              <strong>{goalLabel(choices.goal)}</strong>
              <p>
                {settings.phrasesFirst
                  ? "You'll practice phrases before single words. "
                  : settings.notesFirst
                  ? "You'll see grammar notes before the words. "
                  : ""}
                After lessons, we&apos;ll suggest {suggestion.label}.
              </p>
            </li>
            <li>
              <span>Focus</span>
              <strong>{choices.practiceFocus}</strong>
              <p>{focusOptions.find((option) => option.value === choices.practiceFocus)?.detail}</p>
            </li>
            <li>
              <span>Romanization</span>
              <strong>{choices.romanization ? "On" : "Off"}</strong>
              <p>{choices.romanization ? "English letters show under the Korean." : "Korean shows on its own."}</p>
            </li>
            <li>
              <span>Daily goal</span>
              <strong>{choices.dailyMinutes} minutes</strong>
              <p>Time in lessons counts toward it. You&apos;ll see your progress on the dashboard.</p>
            </li>
          </ul>
          <p className="quiz-note">You can change any of these later in Settings.</p>

          <button type="button" className="practice-next-button" onClick={() => save("/dashboard")}>
            Start learning →
          </button>
          <button type="button" className="link-button" onClick={() => save("/placement")}>
            Already know some Korean? Check your skills
          </button>
        </div>
      )}

      {/* Back / Next */}
      {step !== "levelCheck" && step !== "plan" && (
        <div className="quiz-nav">
          {previousStep(step) && (
            <button type="button" className="secondary-button" onClick={() => goTo(previousStep(step)!)}>
              ← Back
            </button>
          )}
          <button type="button" className="practice-next-button" onClick={() => goTo(nextStep(step))}>
            {step === "minutes" ? "See my plan →" : "Next →"}
          </button>
        </div>
      )}
      {step === "plan" && (
        <button type="button" className="link-button" onClick={() => goTo("minutes")}>
          ← Change my answers
        </button>
      )}
      {step === "levelCheck" && (
        <button type="button" className="link-button" onClick={() => goTo("level")}>
          ← Back to choosing my level
        </button>
      )}
      <SpeechNotice />
    </div>
  );
}
