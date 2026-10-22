import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="login-page">
      <div className="login-card">

        <div className="logo">
          <Image src="/brand/logo-full.png" alt="korea GO! — a corgi traveler waving hello" width={513} height={371} priority />
        </div>

        <div className="welcome-text">
          <h1>배울 준비 되셨나요?</h1>
          <p>Ready to learn?</p>
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