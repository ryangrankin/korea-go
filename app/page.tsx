"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loadProgressFromAccount } from "../lib/accountSync";
import { ACCOUNTS_OFF_MESSAGE, supabase } from "../lib/supabase";

const ZOOM_MS = 900; // keep in sync with .corgi-zoom in globals.css

export default function Home() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const corgiRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<CSSProperties | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const goTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Next.js keeps this page alive in the background after we leave it
  // (cacheComponents in next.config.ts). Undo the zoom and restart the walk
  // when we leave, so coming back (e.g. Log Out) shows the normal login screen.
  useEffect(() => {
    const stage = stageRef.current;
    return () => {
      clearTimeout(goTimer.current);
      setZoom(null);
      setLoggingIn(false);
      setError(null);
      stage?.getAnimations({ subtree: true }).forEach((animation) => animation.play());
    };
  }, []);

  // Go! logs in with Supabase. If that works, the corgi zooms in and the dashboard opens.
  async function handleGo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setError(ACCOUNTS_OFF_MESSAGE);
      return;
    }

    const form = new FormData(event.currentTarget);
    setLoggingIn(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });
    if (error) {
      setLoggingIn(false);
      setError(error.message === "Invalid login credentials" ? "That email and password don't match an account." : error.message);
      return;
    }

    await loadProgressFromAccount();
    zoomToDashboard();
  }

  // The walking corgi zooms to fill the screen, then the dashboard opens.
  function zoomToDashboard() {
    const stage = stageRef.current;
    const corgi = corgiRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!stage || !corgi || reduceMotion) {
      router.push("/dashboard");
      return;
    }

    // Freeze the corgi mid-step so we can measure where it is.
    stage.getAnimations({ subtree: true }).forEach((animation) => animation.pause());
    const box = corgi.getBoundingClientRect();
    const stageBox = stage.getBoundingClientRect();
    const centerX = box.left + box.width / 2;
    const centerY = box.top + box.height / 2;

    // Grow the stage around the corgi's center, and move that center to the screen's center.
    const moveX = window.innerWidth / 2 - centerX;
    const moveY = window.innerHeight / 2 - centerY;
    const scale = Math.min(window.innerWidth / box.width, window.innerHeight / box.height);
    setZoom({
      transformOrigin: `${centerX - stageBox.left}px ${centerY - stageBox.top}px`,
      transform: `translate(${moveX}px, ${moveY}px) scale(${scale})`,
    });

    router.prefetch("/dashboard");
    goTimer.current = setTimeout(() => router.push("/dashboard"), ZOOM_MS);
  }

  return (
    <main className={zoom ? "login-page zooming" : "login-page"}>
      <div className="login-card">

        <div className="logo">
          <Image src="/brand/wordmark.png" alt="korea GO!" width={319} height={277} priority />
        </div>

        <div className="welcome-text">
          <h1>배울 준비 되셨나요?</h1>
          <p>Ready to learn?</p>
        </div>

        <form className="login-form" onSubmit={handleGo}>
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
            placeholder="Password"
            autoComplete="current-password"
            required
          />

          <button type="submit" disabled={loggingIn || zoom !== null}>
            {loggingIn && !zoom ? "Logging in…" : "Go!"}
          </button>

          {error && <p className="form-error" role="alert">{error}</p>}
        </form>

        <p className="signup-text">
          New here?{" "}
          <Link href="/signup">
            Sign up!
          </Link>
        </p>

      </div>

      {/* Our corgi traveler strolling along the palace path (animations in globals.css) */}
      <div
        ref={stageRef}
        className={zoom ? "corgi-stage corgi-zoom" : "corgi-stage"}
        style={zoom ?? undefined}
      >
        <div className="corgi-walker">
          <div className="corgi-turn">
            <div ref={corgiRef} className="corgi-hop">
              <Image src="/brand/pup.png" alt="A corgi traveler exploring Seoul" width={218} height={263} priority />
              {/* Twinkle next to the corgi's winking eye */}
              <svg className="wink-sparkle" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
