/*
  MERGE PROGRESS
  When this browser's saved data and the account's saved data differ,
  combine them instead of letting one replace the other. That way:
  - a lesson finished on another device (or as a guest before logging in)
    is never lost,
  - an older device that's still open can't wipe newer progress.

  Progress only ever grows when merged: finished lessons are combined,
  scores are combined, study time keeps the higher number for each day.
  For simple choices (settings, the pup's outfit), `prefer` decides which
  side wins when both have a value.

  Plain functions (no browser or Supabase), tested in lib/mergeProgress.test.ts.
*/

export type SavedData = Record<string, string>;

function parse<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

// Finished lessons: finished on either side counts.
function mergeLessons(a?: string, b?: string): string {
  const left = parse<Record<string, boolean>>(a, {});
  const right = parse<Record<string, boolean>>(b, {});
  const merged: Record<string, boolean> = {};
  for (const id of new Set([...Object.keys(left), ...Object.keys(right)])) {
    if (left[id] === true || right[id] === true) merged[id] = true;
  }
  return JSON.stringify(merged);
}

// Study time: the higher number of seconds for each day.
function mergeStudyTime(a?: string, b?: string): string {
  const left = parse<Record<string, number>>(a, {});
  const right = parse<Record<string, number>>(b, {});
  const merged: Record<string, number> = {};
  for (const day of new Set([...Object.keys(left), ...Object.keys(right)])) {
    merged[day] = Math.max(Number(left[day]) || 0, Number(right[day]) || 0);
  }
  const recent = Object.keys(merged).sort().slice(-30);
  return JSON.stringify(Object.fromEntries(recent.map((day) => [day, merged[day]])));
}

// Mini game results: every finished game, once each, oldest first.
type GameResult = { game?: string; setId?: string; playedAt?: string };
function mergeGameResults(a?: string, b?: string): string {
  const all = [...parse<GameResult[]>(a, []), ...parse<GameResult[]>(b, [])];
  const seen = new Set<string>();
  const unique = all.filter((result) => {
    const key = `${result.game}|${result.setId}|${result.playedAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  unique.sort((x, y) => String(x.playedAt).localeCompare(String(y.playedAt)));
  return JSON.stringify(unique.slice(-300));
}

// Best times: the faster one for each set.
function mergeBestTimes(a?: string, b?: string): string {
  const left = parse<Record<string, number>>(a, {});
  const right = parse<Record<string, number>>(b, {});
  const merged: Record<string, number> = { ...left };
  for (const [set, seconds] of Object.entries(right)) {
    merged[set] = set in merged ? Math.min(merged[set], seconds) : seconds;
  }
  return JSON.stringify(merged);
}

// Skill checks and test-outs: for each check, keep the most recent record
// (best scores kept from both); skip permissions and skips are combined.
type CheckRecord = { lastAt?: string; bestPercent?: number; everPassed?: boolean; attempts?: number };
type SkillProgress = {
  topics?: Record<string, CheckRecord>;
  lessons?: Record<string, CheckRecord>;
  canSkip?: Record<string, string>;
  skipped?: Record<string, string>;
};
function mergeRecords(left: Record<string, CheckRecord> = {}, right: Record<string, CheckRecord> = {}) {
  const merged: Record<string, CheckRecord> = { ...left };
  for (const [id, record] of Object.entries(right)) {
    const mine = merged[id];
    if (!mine) {
      merged[id] = record;
      continue;
    }
    const newer = String(record.lastAt ?? "") > String(mine.lastAt ?? "") ? record : mine;
    merged[id] = {
      ...newer,
      bestPercent: Math.max(mine.bestPercent ?? 0, record.bestPercent ?? 0),
      everPassed: Boolean(mine.everPassed || record.everPassed),
      attempts: Math.max(mine.attempts ?? 0, record.attempts ?? 0),
    };
  }
  return merged;
}
function mergeSkillProgress(a?: string, b?: string): string {
  const left = parse<SkillProgress>(a, {});
  const right = parse<SkillProgress>(b, {});
  return JSON.stringify({
    topics: mergeRecords(left.topics, right.topics),
    lessons: mergeRecords(left.lessons, right.lessons),
    canSkip: { ...right.canSkip, ...left.canSkip },
    skipped: { ...right.skipped, ...left.skipped },
  });
}

// Conversation tab: the higher counts for each scenario.
function mergeConversations(a?: string, b?: string): string {
  type Counts = Record<string, { completions?: number; sentences?: number }>;
  const left = parse<Counts>(a, {});
  const right = parse<Counts>(b, {});
  const merged: Counts = {};
  for (const id of new Set([...Object.keys(left), ...Object.keys(right)])) {
    merged[id] = {
      completions: Math.max(left[id]?.completions ?? 0, right[id]?.completions ?? 0),
      sentences: Math.max(left[id]?.sentences ?? 0, right[id]?.sentences ?? 0),
    };
  }
  return JSON.stringify(merged);
}

const MERGERS: Record<string, (a?: string, b?: string) => string> = {
  koreaGoConversations: mergeConversations,
  koreaGoLessonProgress: mergeLessons,
  koreaGoStudyTime: mergeStudyTime,
  koreaGoGameResults: mergeGameResults,
  koreaGoMatchBest: mergeBestTimes,
  koreaGoSkillProgress: mergeSkillProgress,
};

// Combine this browser's data with the account's data.
// prefer: which side's simple choices (settings, outfit) win when both have one.
export function mergeSavedData(local: SavedData, remote: SavedData, prefer: "local" | "remote"): SavedData {
  const merged: SavedData = {};
  for (const key of new Set([...Object.keys(local), ...Object.keys(remote)])) {
    const mine = local[key];
    const theirs = remote[key];
    if (mine === undefined) merged[key] = theirs;
    else if (theirs === undefined) merged[key] = mine;
    else if (MERGERS[key]) merged[key] = MERGERS[key](mine, theirs);
    else merged[key] = prefer === "local" ? mine : theirs;
  }
  return merged;
}

export const sameData = (a: SavedData, b: SavedData) =>
  Object.keys(a).length === Object.keys(b).length && Object.entries(a).every(([key, value]) => b[key] === value);
