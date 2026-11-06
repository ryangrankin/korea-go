/*
  CONVERSATION PROGRESS
  For each Conversation-tab scenario: how many times it was finished, and
  how many correct sentences the learner has built in it. Saved under
  "koreaGoConversations" (so it follows the learner's account, merged
  like the rest of their progress — see lib/mergeProgress.ts).
*/

import { useMemo, useSyncExternalStore } from "react";
import { saveProgressSoon } from "./accountSync";

export type ScenarioProgress = { completions: number; sentences: number };
export type ConversationProgress = Record<string, ScenarioProgress>;

export const CONVERSATION_KEY = "koreaGoConversations";

function readRaw(): string {
  try {
    return localStorage.getItem(CONVERSATION_KEY) ?? "";
  } catch {
    return "";
  }
}

function parse(raw: string): ConversationProgress {
  try {
    return raw ? (JSON.parse(raw) as ConversationProgress) : {};
  } catch {
    return {};
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CONVERSATION_KEY, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CONVERSATION_KEY, onChange);
  };
}

export function useConversationProgress(): ConversationProgress {
  const raw = useSyncExternalStore(subscribe, readRaw, () => "");
  return useMemo(() => parse(raw), [raw]);
}

// Record a finished scenario and the correct sentences built in it.
export function recordConversation(scenarioId: string, sentencesBuilt: number) {
  try {
    const all = parse(readRaw());
    const previous = all[scenarioId] ?? { completions: 0, sentences: 0 };
    all[scenarioId] = { completions: previous.completions + 1, sentences: previous.sentences + sentencesBuilt };
    localStorage.setItem(CONVERSATION_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event(CONVERSATION_KEY));
    saveProgressSoon();
  } catch {
    // Progress is a nice extra; the conversation still works.
  }
}
