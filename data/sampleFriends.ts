/*
  SAMPLE FRIENDS
  Placeholder friends for the Friends tab until accounts are connected.
  Their scores are made up so the leaderboard has someone to compare
  with. Set ids in bestTimes match the Hangeul Match sets
  ("hangeul-1" … "hangeul-6", "all-letters"); times are in seconds.
*/

export type Friend = {
  id: string;
  username: string;
  level: string;
  streak: number;
  weeklyPoints: number;
  bestTimes: Record<string, number>;
};

export const sampleFriends: Friend[] = [
  {
    id: "1",
    username: "friend_one",
    level: "Beginner",
    streak: 5,
    weeklyPoints: 1240,
    bestTimes: { "hangeul-1": 19, "hangeul-2": 24, "all-letters": 71 },
  },
  {
    id: "2",
    username: "friend_two",
    level: "Intermediate",
    streak: 12,
    weeklyPoints: 2310,
    bestTimes: { "hangeul-1": 14, "hangeul-3": 33, "hangeul-4": 41, "all-letters": 52 },
  },
];
