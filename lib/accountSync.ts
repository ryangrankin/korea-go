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
  - saveWhenLeaving():         save when the tab is hidden or closed

  Saving and loading MERGE the browser's data with the account's
  (lib/mergeProgress.ts) instead of one replacing the other, so progress
  from another device, or from playing as a guest, is never wiped.
*/

import { mergeSavedData, sameData, type SavedData } from "./mergeProgress";
import { supabase } from "./supabase";

const TABLE = "korea_go_user_data";
const KEY_PREFIX = "koreaGo";
const SAVE_DELAY_MS = 1000; // group quick changes into one save

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

// Put merged data into this browser (only if it changed), and tell open pages.
function writeLocal(data: SavedData) {
  if (sameData(readLocal(), data)) return;
  Object.entries(data).forEach(([key, value]) => localStorage.setItem(key, value));
  window.dispatchEvent(new StorageEvent("storage"));
}

async function readAccount(userId: string): Promise<SavedData | null> {
  if (!supabase) return null;
  const { data: row, error } = await supabase
    .from(TABLE)
    .select("data")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return row ? (row.data as SavedData) : null;
}

async function saveNow() {
  const userId = await currentUserId();
  if (!supabase || !userId) return;
  try {
    // Merge with what the account already has, so an older device can't
    // overwrite progress made somewhere else.
    const remote = (await readAccount(userId)) ?? {};
    const merged = mergeSavedData(readLocal(), remote, "local");
    writeLocal(merged);
    const { error } = await supabase
      .from(TABLE)
      .upsert({ user_id: userId, data: merged, updated_at: new Date().toISOString() });
    if (error) throw error;
  } catch (error) {
    console.error("Couldn't save progress to your account:", error);
  }
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
// The account's data is merged with this browser's: progress from both is
// kept (e.g. lessons finished as a guest), and the account's settings win.
// A problem here never blocks logging in; the app just keeps this browser's data.
export async function loadProgressFromAccount() {
  try {
    const userId = await currentUserId();
    if (!supabase || !userId) return;

    const remote = await readAccount(userId);
    if (!remote) {
      await saveNow();
      return;
    }

    const merged = mergeSavedData(readLocal(), remote, "remote");
    writeLocal(merged);
    // If this browser added anything, save the combined data back.
    if (!sameData(merged, remote)) await saveNow();
  } catch (error) {
    console.error("Couldn't load progress from your account:", error);
  }
}

// Save right away when the learner switches tabs or closes the page, so a
// lesson finished in the last second isn't lost. Returns a clean-up function.
export function saveWhenLeaving(): () => void {
  const onHide = () => {
    if (document.visibilityState === "hidden") {
      clearTimeout(saveTimer);
      void saveNow();
    }
  };
  document.addEventListener("visibilitychange", onHide);
  return () => document.removeEventListener("visibilitychange", onHide);
}
