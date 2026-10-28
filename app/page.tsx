"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ZOOM_MS = 900; // keep in sync with .logo-zoom in globals.css

export default function Home() {
  const router = useRouter();
  const logoRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const goTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Next.js keeps this page alive in the background after we leave it
  // (cacheComponents in next.config.ts). Undo the zoom when we leave, so
  // coming back (e.g. Log Out) shows the normal login screen.
  useEffect(() => {
    return () => {
      clearTimeout(goTimer.current);
      setZoom(null);
    };
  }, []);

  // No real login yet: Go! zooms the mascot to fill the screen, then opens the dashboard.
  function handleGo(event: FormEvent) {
    event.preventDefault();
    const logo = logoRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!logo || reduceMotion) {
      router.push("/dashboard");
      return;
    }

    // Move the logo's center to the screen's center, and grow it until it hits the screen edge.
    const box = logo.getBoundingClientRect();
    const moveX = window.innerWidth / 2 - (box.left + box.width / 2);
    const moveY = window.innerHeight / 2 - (box.top + box.height / 2);
    const scale = Math.min(window.innerWidth / box.width, window.innerHeight / box.height);
    setZoom(`translate(${moveX}px, ${moveY}px) scale(${scale})`);

    router.prefetch("/dashboard");
    goTimer.current = setTimeout(() => router.push("/dashboard"), ZOOM_MS);
  }

  return (
    <main className={zoom ? "login-page zooming" : "login-page"}>
      <div className="login-card">

        <div
          ref={logoRef}
          className={zoom ? "logo logo-zoom" : "logo"}
          style={zoom ? { transform: zoom } : undefined}
        >
          <span className="logo-art">
            <Image src="/brand/logo-full.png" alt="korea GO! — a corgi traveler waving hello" width={513} height={371} priority />
            {/* Twinkle next to the corgi's winking eye (positioned in globals.css) */}
            <svg className="wink-sparkle" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" />
            </svg>
          </span>
        </div>

        <div className="welcome-text">
          <h1>배울 준비 되셨나요?</h1>
          <p>Ready to learn?</p>
        </div>

        <form className="login-form" onSubmit={handleGo}>
          <input
            type="text"
            placeholder="Username"
          />

          <input
            type="password"
            placeholder="Password"
          />

          <button type="submit" disabled={zoom !== null}>
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