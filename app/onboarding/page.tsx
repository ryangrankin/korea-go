"use client";

/*
  Onboarding: shown right after signing up (see app/signup/page.tsx).
  A short quiz sets the learner's level, goal, practice focus,
  romanization, and daily goal — the same choices as the Settings page.
*/

import OnboardingQuiz from "../../components/onboarding/OnboardingQuiz";

export default function OnboardingPage() {
  return (
    <main className="basic-page">
      <div className="basic-container">
        <OnboardingQuiz />
      </div>
    </main>
  );
}
