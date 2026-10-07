import Link from "next/link";

export default function LessonPage() {
  return (
    <main className="basic-page">
      <div className="basic-container">

        <Link href="/dashboard" className="back-button">
          ← Dashboard
        </Link>

        <h1>This is where Lesson 1 will go!</h1>

        <Link href="/dashboard" className="primary-button">
          Continue
        </Link>

      </div>
    </main>
  );
}