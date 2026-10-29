import { createBrowserClient } from "@supabase/ssr";
import type { AuthError } from "@supabase/supabase-js";

// One Supabase connection for the whole app. The URL and publishable key are
// public by design; RLS rules in the database keep each user's data private.
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Turn Supabase's error codes into messages a learner can act on.
export function friendlyAuthError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "That email and password don't match. Try again?";
    case "user_already_exists":
    case "email_exists":
      return "That email is already registered. Try logging in instead.";
    case "weak_password":
      return "Please choose a password with at least 6 characters.";
    case "email_address_invalid":
    case "validation_failed":
      return "Please enter a valid email address.";
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return "Too many tries in a row. Wait a minute and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
