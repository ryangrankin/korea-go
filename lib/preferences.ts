/*
  PREFERENCES
  Reads the learner's settings (saved by the Settings page under
  "koreaGoPreferences"), so any page can follow them.
*/

import { useSyncExternalStore } from "react";

const PREFERENCES_KEY = "koreaGoPreferences";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function readRaw(): string {
  try {
    return localStorage.getItem(PREFERENCES_KEY) ?? "";
  } catch {
    return "";
  }
}

// true unless the learner turned romanization off in Settings.
export function useShowRomanization(): boolean {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  try {
    return raw ? JSON.parse(raw).romanization !== false : true;
  } catch {
    return true;
  }
}
