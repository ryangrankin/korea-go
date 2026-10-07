import Link from "next/link";

export default function PlacementPage() {
  return (
    <main className="basic-page">
      <div className="basic-container">

        <Link href="/onboarding" className="back-button">
          ← Back
        </Link>

        <h1>This is where the placement test will go!</h1>

        <Link href="/dashboard" className="primary-button">
          Continue
        </Link>

      </div>
    </main>
  );
}