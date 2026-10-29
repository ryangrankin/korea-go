/*
  accountSync: keeps each person's saved data in their Supabase account, so
  lesson progress, game scores, the pup's outfit and preferences follow them
  to any device.

  The app still reads and writes the browser's localStorage like before
  (every key starts with "koreaGo"). This file copies those keys:
  - loadProgressFromAccount(): after login, account → browser
  - saveProgressSoon():        after a change, browser → account
  - saveProgressNow():         right before log out
  - clearLocalProgress():      on log out, so the next person starts fresh
*/

import { supabase } from "./supabase";

const TABLE = "korea_go_user_data";
const KEY_PREFIX = "koreaGo";
const SAVE_DELAY_MS = 1000; // group quick changes into one save

type SavedData = Record<string, string>;

function readLocal(): SavedData {
  const data: SavedData = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(KEY_PREFIX)) data[key] = localStorage.getItem(key) ?? "";
  }
  return data;
}

export function clearLocalProgress() {
  Object.keys(readLocal()).forEach((key) => localStorage.removeItem(key));
  // Tell open pages to re-read (they all listen for "storage").
  window.dispatchEvent(new StorageEvent("storage"));
}

async function currentUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

async function saveNow() {
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, data: readLocal(), updated_at: new Date().toISOString() });
  if (error) console.error("Couldn't save progress to your account:", error.message);
}

let saveTimer: ReturnType<typeof setTimeout> | undefined;

// Call after changing anything saved in localStorage.
export function saveProgressSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, SAVE_DELAY_MS);
}

// Call before logging out, so a change from the last second isn't lost.
export async function saveProgressNow() {
  clearTimeout(saveTimer);
  await saveNow();
}

// Call right after logging in or signing up.
// If the account has saved data, it replaces what's in this browser.
// If not (a new account, or progress from before accounts existed), this
// browser's data is uploaded so it isn't lost.
// A problem here never blocks logging in; the app just keeps this browser's data.
export async function loadProgressFromAccount() {
  try {
    const userId = await currentUserId();
    if (!supabase || !userId) return;

    const { data: row, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;

    if (!row) {
      await saveNow();
      return;
    }

    Object.keys(readLocal()).forEach((key) => localStorage.removeItem(key));
    Object.entries(row.data as SavedData).forEach(([key, value]) => localStorage.setItem(key, value));
    window.dispatchEvent(new StorageEvent("storage"));
  } catch (error) {
    console.error("Couldn't load progress from your account:", error);
  }
}
