"use client";

/*
  VisitorCounter: the little paw badge in the corner of the login page.
  Each browser counts once (remembered in localStorage), so reloading
  doesn't bump the number. The total lives in Supabase and only changes
  through korea_go_count_visit(), which adds 1 at a time.
*/

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

// Doesn't start with "koreaGo", so it isn't copied into accounts or cleared on Log Out.
const COUNTED_KEY = "visitorCounted";

export default function VisitorCounter() {
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let counted = false;
    try {
      counted = localStorage.getItem(COUNTED_KEY) === "true";
      // Mark before asking, so a quick reload can't count the same browser twice.
      localStorage.setItem(COUNTED_KEY, "true");
    } catch {
      // Private browsing can block storage; just show the total without counting.
      counted = true;
    }

    supabase.rpc("korea_go_count_visit", { new_visitor: !counted }).then(({ data, error }) => {
      if (!error && typeof data === "number") setTotal(data);
    });
  }, []);

  // Nothing shows until the number arrives (or at all, if Supabase is unreachable).
  if (total === null) return null;

  return (
    <p className="visitor-counter" aria-label={`${total} visitors so far`}>
      <span aria-hidden="true">🐾</span> {total.toLocaleString()} {total === 1 ? "visitor" : "visitors"}
    </p>
  );
}
