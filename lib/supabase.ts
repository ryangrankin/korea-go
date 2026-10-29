/*
  supabase: the one connection to our Supabase project, used for accounts
  (sign up, log in, log out). Environment variables can override the two
  values below; otherwise the site uses our AI-Workshop project. Both values
  are public by design (the publishable key only allows what our Supabase
  settings allow), so it's safe for them to be in the code.

  If they are missing, `supabase` is null and the login and signup pages
  say accounts are not set up, instead of the whole site crashing.
*/

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://okahkuwewpjrnwkfggir.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_zc9Hjpf4qvl3vv8nhDZbTw_wtVPP_OO";

export const supabase = url && key ? createClient(url, key) : null;

export const ACCOUNTS_OFF_MESSAGE =
  "Accounts aren't set up on this copy of the site yet (missing Supabase settings).";
