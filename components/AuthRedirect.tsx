"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

// Pages anyone can see. Every other page needs a logged-in user.
const PUBLIC_PATHS = ["/", "/signup"];

// Runs on every page change: logged-out visitors go to the login screen,
// logged-in visitors skip the login and signup screens.
export default function AuthRedirect() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let stale = false;
    const isPublic = PUBLIC_PATHS.includes(pathname);

    supabase.auth.getSession().then(({ data }) => {
      if (stale) return;
      const loggedIn = data.session !== null;
      if (!loggedIn && !isPublic) router.replace("/");
      if (loggedIn && isPublic) router.replace("/dashboard");
    });

    return () => {
      stale = true;
    };
  }, [pathname, router]);

  return null;
}
