/*
  supabase: the one connection to our Supabase project, used for accounts
  (sign up, log in, log out). The two values come from environment
  variables: .env.local on your computer, and Settings → Environment
  Variables on Vercel. Both are safe to show in the browser.

  If they are missing, `supabase` is null and the login and signup pages
  say accounts are not set up, instead of the whole site crashing.
*/

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase = url && key ? createClient(url, key) : null;

export const ACCOUNTS_OFF_MESSAGE =
  "Accounts aren't set up on this copy of the site yet (missing Supabase settings).";
