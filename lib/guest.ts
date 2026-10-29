/*
  guest: "Continue as guest" lets people try the app without an account.
  A guest's progress stays in this browser only (nothing goes to Supabase).
  Logging in or signing up ends guest mode; so does Log Out.

  The key deliberately doesn't start with "koreaGo", so accountSync never
  copies it into anyone's account.
*/

const GUEST_KEY = "guestMode";

export function isGuest(): boolean {
  try {
    return localStorage.getItem(GUEST_KEY) === "true";
  } catch {
    return false;
  }
}

export function startGuest() {
  localStorage.setItem(GUEST_KEY, "true");
}

export function endGuest() {
  localStorage.removeItem(GUEST_KEY);
}
