/*
  community: every korea-go user with a username, their picture, and the
  points they've earned in mini games (from korea_go_community() in
  Supabase, highest first). Only logged-in users can load it.
*/

import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export type CommunityMember = {
  username: string;
  avatar_url: string | null;
  total_points: number;
  games_played: number;
};

// undefined while loading, null if it couldn't load (e.g. a guest).
export function useCommunity(): CommunityMember[] | null | undefined {
  const [members, setMembers] = useState<CommunityMember[] | null | undefined>(undefined);

  useEffect(() => {
    if (!supabase) return;
    supabase.rpc("korea_go_community").then(({ data, error }) => {
      setMembers(!error && Array.isArray(data) ? (data as CommunityMember[]) : null);
    });
  }, []);

  return supabase ? members : null;
}
