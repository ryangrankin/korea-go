"use client";

/*
  SpeechNotice: a small friendly message that pops up when the device
  has no Korean voice, so tapping Korean never fails silently.
*/

import { useEffect, useState } from "react";
import { NO_VOICE_EVENT } from "../lib/speak";

export default function SpeechNotice() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for the "no voice" message sent by lib/speak.ts.
    function showNotice(event: Event) {
      setMessage((event as CustomEvent<string>).detail);
    }
    window.addEventListener(NO_VOICE_EVENT, showNotice);
    return () => window.removeEventListener(NO_VOICE_EVENT, showNotice);
  }, []);

  // Hide the message by itself after 6 seconds.
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 6000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className="speech-notice" role="status">
      <p>
        🔇 {message} Try Chrome, Safari, or Edge, or add a Korean voice in
        your device&apos;s language/speech settings. You can keep reading the
        romanization in the meantime!
      </p>
      <button type="button" onClick={() => setMessage("")} aria-label="Close message">
        ✕
      </button>
    </div>
  );
}
