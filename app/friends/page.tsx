"use client";

/*
  Friends tab: real korea GO! users.
  - Everyone with an account and a username comes from korea_go_community()
    in Supabase (lib/community.ts): username, picture, game points.
  - Friends come from friend requests (lib/friends.ts, table
    korea_go_friendships): send a request, the other person accepts or
    declines it under "Friend requests".
  Guests see a prompt to sign up, since the user list needs an account.
*/

import { useState } from "react";
import Link from "next/link";
import Avatar from "../../components/Avatar";
import BottomNav from "../../components/BottomNav";
import { useGameStats } from "../../lib/gameScores";
import { useCommunity, type CommunityMember } from "../../lib/community";
import { removeFriend, respondToRequest, sendFriendRequest, useFriendships } from "../../lib/friends";
import { useMyProfile } from "../../lib/username";

type Board = "friends" | "everyone";

const MEDALS = ["🥇", "🥈", "🥉"];

const gamesLabel = (count: number) => `${count} ${count === 1 ? "game" : "games"} played`;

export default function FriendsPage() {
  const [search, setSearch] = useState("");
  const [board, setBoard] = useState<Board>("friends");
  const stats = useGameStats();
  const myProfile = useMyProfile();
  const myUsername = myProfile?.username;
  const community = useCommunity();
  const friendships = useFriendships();
  const [busy, setBusy] = useState<string | null>(null); // username being changed
  const [notice, setNotice] = useState<string | null>(null);

  const members = community ?? [];
  const byName = new Map(members.map((member) => [member.username, member]));
  const ready = friendships.status === "ready" ? friendships : null;
  const incoming = ready?.incoming ?? [];
  const outgoing = ready?.outgoing ?? [];
  // Friends with their points (someone with no games yet still shows, with 0).
  const friends: CommunityMember[] = (ready?.friends ?? []).map(
    (friend) =>
      byName.get(friend.username) ?? {
        username: friend.username,
        avatar_url: friend.avatar_url,
        total_points: 0,
        games_played: 0,
      }
  );
  const relation = (username: string) =>
    ready?.friends.some((f) => f.username === username)
      ? "friend"
      : incoming.some((f) => f.username === username)
      ? "incoming"
      : outgoing.some((f) => f.username === username)
      ? "outgoing"
      : null;

  async function act(username: string, action: () => Promise<string | boolean>, done?: string) {
    setBusy(username);
    const result = await action();
    setBusy(null);
    setNotice(typeof result === "string" ? result : result ? done ?? null : "Something went wrong. Try again.");
  }

  // You, as the server sees you; or from this device if you have no username yet.
  const me: CommunityMember = (myUsername && byName.get(myUsername)) || {
    username: myUsername ?? "",
    avatar_url: myProfile?.avatarUrl ?? null,
    total_points: stats.totalPoints,
    games_played: stats.gamesPlayed,
  };

  // Leaderboard: you and your friends, or everyone. Highest points first.
  const boardMembers = (board === "friends" ? [me, ...friends.filter((f) => f.username !== me.username)] : members)
    .slice()
    .sort((a, b) => b.total_points - a.total_points);

  const query = search.trim().toLowerCase();
  const searchResults = query
    ? members.filter((member) => member.username.includes(query) && member.username !== myUsername).slice(0, 20)
    : [];

  const isMe = (member: CommunityMember) => member === me || (Boolean(myUsername) && member.username === myUsername);

  return (
    <main className="basic-page">
      <div className="basic-container">
        <h1>Friends</h1>
        <p>Learn Korean together!</p>

        {community === null ? (
          <div className="friends-section">
            <h2>Learn with friends</h2>
            <p>
              Create a free account to find other korea GO! learners, add friends, and compare your mini game points.
            </p>
            <p className="friends-note">
              <Link href="/signup">Sign up</Link> or log in to see everyone learning on korea GO!
            </p>
          </div>
        ) : (
          <div className="friends-layout">
            {/* LEADERBOARD */}
            <div className="friends-section">
              <h2>Leaderboard</h2>

              <div className="leaderboard-toggle" role="group" aria-label="Leaderboard">
                <button
                  type="button"
                  className={board === "friends" ? "active" : ""}
                  aria-pressed={board === "friends"}
                  onClick={() => setBoard("friends")}
                >
                  👥 You &amp; friends
                </button>
                <button
                  type="button"
                  className={board === "everyone" ? "active" : ""}
                  aria-pressed={board === "everyone"}
                  onClick={() => setBoard("everyone")}
                >
                  🌏 Everyone
                </button>
              </div>

              {community === undefined ? (
                <p className="friends-note">Loading…</p>
              ) : boardMembers.length === 0 ? (
                <p className="friends-note">No one here yet. Choose a username on your Profile to be first!</p>
              ) : (
                <ol className="leaderboard">
                  {boardMembers.map((member, index) => (
                    <li key={member.username || "you"} className={isMe(member) ? "you" : ""}>
                      <span className="leaderboard-rank">{MEDALS[index] ?? index + 1}</span>
                      <Avatar
                        url={member.avatar_url}
                        className="leaderboard-avatar"
                        fallback={isMe(member) ? "⭐" : "👤"}
                      />
                      <span className="leaderboard-name">
                        {isMe(member) ? (member.username ? `${member.username} (you)` : "You") : member.username}
                      </span>
                      <span className="leaderboard-value">{member.total_points.toLocaleString()} pts</span>
                    </li>
                  ))}
                </ol>
              )}

              {board === "friends" && ready && friends.length === 0 && (
                <p className="friends-note">Add friends to see how you compare.</p>
              )}
              {!myUsername && myProfile !== undefined && (
                <p className="friends-note">
                  <Link href="/profile">Choose a username</Link> so friends can find you.
                </p>
              )}
              <p className="friends-note">
                Points come from mini games. <Link href="/games">Play a mini game →</Link>
              </p>
            </div>

            <div className="friends-side">
              {/* FRIEND REQUESTS sent to you */}
              {incoming.length > 0 && (
                <div className="friends-section friend-requests" id="requests">
                  <h2>Friend requests ({incoming.length})</h2>
                  {incoming.map((request) => (
                    <div className="friend-card" key={request.username}>
                      <Avatar url={request.avatar_url} className="friend-avatar" />
                      <div className="friend-info">
                        <h3>{request.username}</h3>
                        <span>wants to be friends</span>
                      </div>
                      <div className="friend-request-buttons">
                        <button
                          type="button"
                          className="friend-add-button add"
                          disabled={busy === request.username}
                          onClick={() =>
                            act(request.username, () => respondToRequest(request.username, true), `You and ${request.username} are now friends! 🎉`)
                          }
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="friend-add-button"
                          disabled={busy === request.username}
                          onClick={() => act(request.username, () => respondToRequest(request.username, false), "Request declined.")}
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* MY FRIENDS */}
              <div className="friends-section">
                <h2>My Friends{friends.length > 0 ? ` (${friends.length})` : ""}</h2>

                {notice && (
                  <p className="friends-notice" role="status">
                    {notice}
                  </p>
                )}

                {friendships.status === "loading" ? (
                  <p className="friends-note">Loading…</p>
                ) : friendships.status === "not_set_up" ? (
                  <p className="friends-note">
                    Friend requests aren&apos;t switched on yet. (Site admin: run supabase/friend_requests.sql in Supabase.)
                  </p>
                ) : friendships.status === "error" ? (
                  <p className="friends-note">Couldn&apos;t load your friends. Check your connection and try again.</p>
                ) : friends.length === 0 && outgoing.length === 0 ? (
                  <p className="friends-note">No friends yet. Search for a username below and send a request.</p>
                ) : (
                  <>
                    {friends.map((friend) => (
                      <div className="friend-card" key={friend.username}>
                        <Avatar url={friend.avatar_url} className="friend-avatar" />
                        <div className="friend-info">
                          <h3>{friend.username}</h3>
                          <span>
                            🎮 {friend.total_points.toLocaleString()} pts · {gamesLabel(friend.games_played)}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="friend-add-button"
                          disabled={busy === friend.username}
                          onClick={() => {
                            if (window.confirm(`Remove ${friend.username} from your friends?`)) {
                              void act(friend.username, () => removeFriend(friend.username), `Removed ${friend.username}.`);
                            }
                          }}
                          aria-label={`Remove ${friend.username} from friends`}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    {outgoing.length > 0 && <h3 className="friends-subheading">Waiting for them to accept</h3>}
                    {outgoing.map((request) => (
                      <div className="friend-card" key={request.username}>
                        <Avatar url={request.avatar_url} className="friend-avatar" />
                        <div className="friend-info">
                          <h3>{request.username}</h3>
                          <span>⏳ Request sent</span>
                        </div>
                        <button
                          type="button"
                          className="friend-add-button"
                          disabled={busy === request.username}
                          onClick={() => act(request.username, () => removeFriend(request.username), "Request cancelled.")}
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </>
                )}
              </div>

              {/* FIND FRIENDS */}
              <div className="friends-section">
                <h2>Find Friends</h2>

                <input
                  type="search"
                  placeholder="Search by username..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="friends-search"
                  aria-label="Search by username"
                />

                {query !== "" && (
                  <div className="friends-search-results">
                    {community === undefined ? (
                      <p className="friends-note">Loading…</p>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((member) => {
                        const status = relation(member.username);
                        return (
                          <div className="friend-card" key={member.username}>
                            <Avatar url={member.avatar_url} className="friend-avatar" />
                            <div className="friend-info">
                              <h3>{member.username}</h3>
                              <span>{gamesLabel(member.games_played)}</span>
                            </div>
                            {status === "friend" ? (
                              <span className="friend-status">Friends ✓</span>
                            ) : status === "outgoing" ? (
                              <span className="friend-status">⏳ Sent</span>
                            ) : status === "incoming" ? (
                              <button
                                type="button"
                                className="friend-add-button add"
                                disabled={busy === member.username}
                                onClick={() =>
                                  act(member.username, () => respondToRequest(member.username, true), `You and ${member.username} are now friends! 🎉`)
                                }
                              >
                                Accept
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="friend-add-button add"
                                disabled={busy === member.username || !ready}
                                onClick={() => act(member.username, () => sendFriendRequest(member.username))}
                              >
                                + Add friend
                              </button>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <p>No users found.</p>
                    )}
                  </div>
                )}

                <p className="friends-note">
                  They&apos;ll see your request next time they open Friends. Only usernames, pictures and game
                  points are shared.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
