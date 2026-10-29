"use client";

/*
  AuthGate: sends anyone who isn't logged in back to the login page.
  The login page (/) and sign up page (/signup) are open to everyone, and
  guests ("Continue as guest" on the login page) can use the whole app.
  If Supabase isn't set up (no environment variables), it lets everyone in,
  so the site still works while accounts are being configured.
*/

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isGuest } from "../lib/guest";
import { supabase } from "../lib/supabase";

const OPEN_PAGES = ["/", "/signup"];

export default function AuthGate() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!supabase || OPEN_PAGES.includes(pathname) || isGuest()) return;
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) router.replace("/");
    });
  }, [pathname, router]);

  return null;
}
