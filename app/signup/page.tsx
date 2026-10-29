"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, friendlyAuthError } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // Creates the account. The name rides along as display_name, and a database
  // trigger copies it into the profiles table, so we don't write profiles here.
  async function handleSignup(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const { error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: name.trim() } },
    });
    setSaving(false);
    if (signupError) {
      setError(friendlyAuthError(signupError));
      return;
    }
    router.push("/onboarding");
  }

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

        <form className="signup-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Name"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password (at least 6 characters)"
            autoComplete="new-password"
            minLength={6}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Creating your account..." : "Let’s learn!"}
          </button>
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