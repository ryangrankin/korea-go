/*
  friends: friend requests and friendships, stored in Supabase
  (table korea_go_friendships — set up with supabase/friend_requests.sql).

  - sendFriendRequest(username): ask someone to be friends
  - respondToRequest(username, accept): accept or decline a request
  - removeFriend(username): unfriend, or cancel a request you sent
  - useFriendships(): your friends, requests to you, and requests you sent

  The list is shared by every component on the page (the Friends tab and
  the badge on the nav bar) and reloads when the tab comes back into view.
*/

import { useEffect, useSyncExternalStore } from "react";
import { supabase } from "./supabase";

export type FriendshipKind = "friend" | "incoming" | "outgoing";

export type Friendship = {
  username: string;
  avatar_url: string | null;
  kind: FriendshipKind;
  since: string;
};

export type FriendshipsState =
  | { status: "loading" }
  | { status: "guest" } // not logged in
  | { status: "not_set_up" } // the database part hasn't been added yet
  | { status: "error" }
  | { status: "ready"; friends: Friendship[]; incoming: Friendship[]; outgoing: Friendship[] };

const LOADING: FriendshipsState = { status: "loading" };
const REFRESH_AFTER_MS = 30_000;

let state: FriendshipsState = LOADING;
let loadedAt = 0;
let inFlight: Promise<void> | null = null;
const listeners = new Set<() => void>();

function setState(next: FriendshipsState) {
  state = next;
  listeners.forEach((listener) => listener());
}

// Split the rows from korea_go_my_friendships() into the three lists.
export function groupFriendships(rows: Friendship[]) {
  return {
    friends: rows.filter((row) => row.kind === "friend"),
    incoming: rows.filter((row) => row.kind === "incoming"),
    outgoing: rows.filter((row) => row.kind === "outgoing"),
  };
}

// Supabase's "function doesn't exist" error codes (PostgREST / Postgres).
const isMissingFunction = (code?: string) => code === "PGRST202" || code === "42883" || code === "42P01";

export function refreshFriendships(): Promise<void> {
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      if (!supabase) return setState({ status: "guest" });
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) return setState({ status: "guest" });

      const { data, error } = await supabase.rpc("korea_go_my_friendships");
      if (error) return setState({ status: isMissingFunction(error.code) ? "not_set_up" : "error" });
      setState({ status: "ready", ...groupFriendships((data ?? []) as Friendship[]) });
    } catch {
      setState({ status: "error" });
    } finally {
      loadedAt = Date.now();
      inFlight = null;
    }
  })();
  return inFlight;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useFriendships(): FriendshipsState {
  const current = useSyncExternalStore(subscribe, () => state, () => LOADING);

  useEffect(() => {
    const refreshIfStale = () => {
      if (document.visibilityState === "visible" && Date.now() - loadedAt > REFRESH_AFTER_MS) {
        void refreshFriendships();
      }
    };
    if (loadedAt === 0 || Date.now() - loadedAt > REFRESH_AFTER_MS) void refreshFriendships();
    document.addEventListener("visibilitychange", refreshIfStale);
    return () => document.removeEventListener("visibilitychange", refreshIfStale);
  }, []);

  return current;
}

// How many requests are waiting for you (for the nav badge).
export function useIncomingRequestCount(): number {
  const current = useFriendships();
  return current.status === "ready" ? current.incoming.length : 0;
}

const SEND_MESSAGES: Record<string, string> = {
  sent: "Friend request sent!",
  accepted: "They had already asked you — you're now friends! 🎉",
  already: "You're already friends, or a request is waiting.",
  not_found: "No one has that username.",
  self: "That's you!",
  not_logged_in: "Log in to add friends.",
};

// Returns a message to show.
export async function sendFriendRequest(username: string): Promise<string> {
  if (!supabase) return SEND_MESSAGES.not_logged_in;
  const { data, error } = await supabase.rpc("korea_go_send_friend_request", { to_username: username });
  await refreshFriendships();
  if (error) {
    return isMissingFunction(error.code) ? "Friend requests aren't set up yet." : "Couldn't send the request. Try again.";
  }
  return SEND_MESSAGES[String(data)] ?? "Friend request sent!";
}

export async function respondToRequest(username: string, accept: boolean): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc("korea_go_respond_friend_request", { from_username: username, accept });
  await refreshFriendships();
  return !error;
}

export async function removeFriend(username: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.rpc("korea_go_remove_friend", { other_username: username });
  await refreshFriendships();
  return !error;
}

// Logging in or out: forget the old list so the next person never sees it.
// (Reload outside the callback; Supabase advises not awaiting inside it.)
if (typeof window !== "undefined" && supabase) {
  let userId: string | null | undefined;
  supabase.auth.onAuthStateChange((_event, session) => {
    const next = session?.user.id ?? null;
    if (next === userId) return; // same person (e.g. a token refresh)
    const firstCheck = userId === undefined;
    userId = next;
    if (firstCheck) return;
    loadedAt = 0;
    setState(LOADING);
    if (listeners.size > 0) setTimeout(() => void refreshFriendships(), 0);
  });
}
