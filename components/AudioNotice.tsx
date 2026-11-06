"use client";

/*
  AudioNotice: a one-time note about the audio, shown at the top of lessons
  until the learner closes it. The pronunciation is the device's
  text-to-speech voice (not a recording), so we say so honestly and explain
  how to hear it better.
*/

import { useSyncExternalStore } from "react";

const SEEN_KEY = "koreaGoAudioNoteSeen";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SEEN_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SEEN_KEY, onChange);
  };
}

function seen(): boolean {
  try {
    return localStorage.getItem(SEEN_KEY) === "true";
  } catch {
    return true;
  }
}

export default function AudioNotice() {
  // Hidden during the server render, so it never flashes for people who closed it.
  const hidden = useSyncExternalStore(subscribe, seen, () => true);
  if (hidden) return null;

  function close() {
    try {
      localStorage.setItem(SEEN_KEY, "true");
      window.dispatchEvent(new Event(SEEN_KEY));
    } catch {
      // If it can't be saved, it just shows again next time.
    }
  }

  return (
    <aside className="audio-notice" aria-label="About the audio">
      <p>
        <strong>🔊 About the audio:</strong> Korean is read aloud by your device&apos;s built-in
        computer voice (text-to-speech), not a recording of a native speaker. Turn your volume up, and
        tap <span aria-hidden="true">🐢</span> <strong>Slow</strong> to hear each sound. You can make all
        audio slower in Settings.
      </p>
      <button type="button" className="secondary-button" onClick={close}>
        Got it
      </button>
    </aside>
  );
}
