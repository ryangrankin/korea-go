import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="onboarding-page">
      <div className="onboarding-card">

        <div className="small-logo">
          <span className="logo-korea">korea</span>
          <span className="logo-go">GO!</span>
        </div>

        <div className="mascot-placeholder">
          🐶
        </div>

        <div className="intro-text">
          <h1>Nice to meet you!</h1>

          <p>
            I&apos;m <strong>두리 (Doori)</strong>, your Korea travel
            language friend!
          </p>
        </div>

        <div className="level-section">
          <h2>What&apos;s your current Korean level?</h2>

          <select defaultValue="">
            <option value="" disabled>
              Choose your level
            </option>

            <option value="beginner">
              Beginner
            </option>

            <option value="intermediate">
              Intermediate
            </option>

            <option value="advanced">
              Advanced
            </option>
          </select>
        </div>

        <Link href="/dashboard" className="primary-button">
          Continue
        </Link>

        <div className="placement-option">
          <p>Not sure what level you are?</p>

          <Link href="/placement">
            Take a placement test
          </Link>
        </div>

      </div>
    </main>
  );
}