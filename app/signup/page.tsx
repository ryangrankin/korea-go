"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadProgressFromAccount } from "../../lib/accountSync";
import { ACCOUNTS_OFF_MESSAGE, supabase } from "../../lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Creates the account in Supabase. Name and username are saved on the account
  // (user metadata), so we don't need a database table for them yet.
  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setMessage(ACCOUNTS_OFF_MESSAGE);
      return;
    }

    const form = new FormData(event.currentTarget);
    setSaving(true);
    setMessage(null);
    const { data, error } = await supabase.auth.signUp({
      email: String(form.get("email")),
      password: String(form.get("password")),
      options: {
        data: { name: String(form.get("name")), username: String(form.get("username")) },
      },
    });
    if (data.session) await loadProgressFromAccount();
    setSaving(false);

    if (error) {
      setMessage(error.message);
    } else if (data.session) {
      router.push("/onboarding");
    } else {
      // Happens when "Confirm email" is turned on in Supabase.
      setMessage("Almost done! Check your email for a link to confirm your account, then log in.");
    }
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
            name="name"
            type="text"
            placeholder="Name"
            autoComplete="name"
            required
          />

          <input
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password (at least 6 characters)"
            autoComplete="new-password"
            minLength={6}
            required
          />

          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? "Creating your account…" : "Let's learn!"}
          </button>

          {message && <p className="form-error" role="alert">{message}</p>}
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