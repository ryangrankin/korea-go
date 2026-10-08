
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [level, setLevel] = useState("Beginner");

  function continueToDashboard() {
    localStorage.setItem("koreaGoLevel", level);
    router.push("/dashboard");
  }

  return (
    <main className="basic-page">
      <div className="basic-container">
        <Link href="/signup" className="back-button">
          ← Back
        </Link>

        <h1>Let's Get Started!</h1>

        <p>
          Doori is excited to help you start learning.
        </p>

        <div className="onboarding-level">
          <label htmlFor="level">
            What's your current Korean level?
          </label>

          <select
            id="level"
            value={level}
            onChange={(event) =>
              setLevel(event.target.value)
            }
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={continueToDashboard}
        >
          Continue →
        </button>

        <Link href="/placement" className="back-button">
          Take a Placement Test
        </Link>
      </div>
    </main>
  );
}
