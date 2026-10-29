"use client";

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, friendlyAuthError } from "../lib/supabase";

const ZOOM_MS = 900; // keep in sync with .corgi-zoom in globals.css

export default function Home() {
  const router = useRouter();
  const stageRef = useRef<HTMLDivElement>(null);
  const corgiRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<CSSProperties | null>(null);
  const goTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  // Next.js keeps this page alive in the background after we leave it
  // (cacheComponents in next.config.ts). Undo the zoom and restart the walk
  // when we leave, so coming back (e.g. Log Out) shows the normal login screen.
  useEffect(() => {
    const stage = stageRef.current;
    return () => {
      clearTimeout(goTimer.current);
      setZoom(null);
      stage?.getAnimations({ subtree: true }).forEach((animation) => animation.play());
    };
  }, []);

  // Go! checks the email and password with Supabase. Only if they're right does
  // the walking corgi zoom to fill the screen and open the dashboard.
  async function handleGo(event: FormEvent) {
    event.preventDefault();
    setError("");
    setChecking(true);
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    setChecking(false);
    if (loginError) {
      setError(friendlyAuthError(loginError));
      return;
    }

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
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" disabled={checking || zoom !== null}>
            {checking ? "Checking..." : "Go!"}
          </button>
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
