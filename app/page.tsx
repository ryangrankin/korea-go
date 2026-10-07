import Link from "next/link";

export default function Home() {
  return (
    <main className="login-page">
      <div className="login-card">

        <div className="logo">
          <span className="logo-korea">korea</span>
          <span className="logo-go">GO!</span>
        </div>

        <div className="welcome-text">
          <h1>배울 준비 되셨나요?</h1>
          <p>Ready to learn?</p>
        </div>

        <div className="mascot-placeholder">
          🐶
        </div>

        <form className="login-form">
          <input
            type="text"
            placeholder="Username"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit">
            Go!
          </button>
        </form>

        <p className="signup-text">
          New here?{" "}
          <Link href="/signup">
            Sign up!
          </Link>
        </p>

      </div>
    </main>
  );
}