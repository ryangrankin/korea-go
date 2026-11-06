import { describe, expect, it } from "vitest";
import { groupFriendships, type Friendship } from "./friends";

const row = (username: string, kind: Friendship["kind"]): Friendship => ({
  username,
  avatar_url: null,
  kind,
  since: "2026-11-05T00:00:00Z",
});

describe("groupFriendships", () => {
  it("splits friends, requests to you, and requests you sent", () => {
    const grouped = groupFriendships([row("mina", "friend"), row("joe", "incoming"), row("sam", "outgoing")]);
    expect(grouped.friends.map((f) => f.username)).toEqual(["mina"]);
    expect(grouped.incoming.map((f) => f.username)).toEqual(["joe"]);
    expect(grouped.outgoing.map((f) => f.username)).toEqual(["sam"]);
  });

  it("handles no rows", () => {
    expect(groupFriendships([])).toEqual({ friends: [], incoming: [], outgoing: [] });
  });
});
