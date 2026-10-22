import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="signup-page">
      <div className="signup-card">

        <Link href="/" className="small-logo">
          <Image src="/brand/wordmark.png" alt="korea GO! home" width={319} height={277} />
        </Link>

        <div className="signup-heading">
          <h1>Welcome!</h1>
          <p>Create a new account</p>
        </div>

        <div className="mascot-placeholder">
          <Image src="/brand/pup.png" alt="" width={218} height={263} />
        </div>

        <form className="signup-form">
          <input
            type="text"
            placeholder="Name"
          />

          <input
            type="text"
            placeholder="Username"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <Link href="/onboarding" className="primary-button">
            Let&apos;s learn!
          </Link>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <Link href="/">
            Log in
          </Link>
        </p>

      </div>
    </main>
  );
}