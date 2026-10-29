/*
  username: each account's username, stored in Supabase (korea_go_profiles).
  Shown on the Friends tab, set on sign up, changeable on the Profile page.
  Rules match the database: 3-20 lowercase letters, numbers or underscores,
  and no two accounts can share one. Guests don't have a username.
*/

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const TABLE = "korea_go_profiles";
const CHANGE_EVENT = "usernameChanged";

export const USERNAME_PATTERN = "[a-z0-9_]{3,20}";
export const USERNAME_RULES = "3–20 characters: lowercase letters, numbers or _";

export function cleanUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidUsername(name: string): boolean {
  return new RegExp(`^${USERNAME_PATTERN}$`).test(name);
}

// Works before the account exists (used on the sign-up page).
export async function isUsernameAvailable(name: string): Promise<boolean> {
  if (!supabase) return true;
  const { data, error } = await supabase.rpc("korea_go_username_available", { name });
  return error ? true : data === true; // if the check fails, let saving catch duplicates
}

async function myUserId(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session?.user.id ?? null;
}

export async function getMyUsername(): Promise<string | null> {
  const userId = await myUserId();
  if (!supabase || !userId) return null;
  const { data } = await supabase.from(TABLE).select("username").eq("user_id", userId).maybeSingle();
  return data?.username ?? null;
}

// Returns an error message to show, or null if it worked.
export async function setMyUsername(raw: string): Promise<string | null> {
  const name = cleanUsername(raw);
  if (!isValidUsername(name)) return `Usernames need ${USERNAME_RULES}.`;

  const userId = await myUserId();
  if (!supabase || !userId) return "Log in to choose a username.";

  const { error } = await supabase
    .from(TABLE)
    .upsert({ user_id: userId, username: name, updated_at: new Date().toISOString() });
  if (error) {
    return error.code === "23505" ? `"${name}" is taken. Try another one.` : error.message;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
  return null;
}

// The logged-in person's username: undefined while loading, null if none.
export function useMyUsername(): string | null | undefined {
  const [username, setUsername] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    const load = () => getMyUsername().then(setUsername);
    load();
    window.addEventListener(CHANGE_EVENT, load);
    return () => window.removeEventListener(CHANGE_EVENT, load);
  }, []);

  return username;
}
