/*
  CONVERSATION STATE MACHINE
  Moves a Conversation-tab scenario forward, one answer at a time.
  Deterministic: the same answers always lead to the same replies.
  Plain functions — tested in lib/conversationEngine.test.ts.

  - startConversation(): the speaker's opening line, at the first step.
  - submitAnswer(): checks the learner's sentence (lib/conversationEngine.ts).
    A valid answer this step accepts → the speaker replies and the
    conversation moves to the next step (or finishes). Anything else → the
    feedback is shown and the learner tries again (nothing is lost).
*/

import type { Line, Scenario, Tile } from "../data/conversations";
import { evaluateSentence, fillReply, findStep, type Evaluation } from "./conversationEngine";

export type Message =
  | { from: "speaker"; line: Line; note?: string }
  | { from: "learner"; sentence: string; status: Evaluation["status"] };

export type ConversationState = {
  stepId: string; // the step waiting for an answer, or "done"
  messages: Message[];
  attempts: number; // answers submitted
  successes: string[]; // every valid sentence the learner built (experiments count too)
  lastResult?: Evaluation;
  done: boolean;
};

export function startConversation(scenario: Scenario): ConversationState {
  const first = scenario.steps[0];
  return {
    stepId: first.id,
    messages: first.line ? [{ from: "speaker", line: first.line }] : [],
    attempts: 0,
    successes: [],
    done: false,
  };
}

export function submitAnswer(state: ConversationState, scenario: Scenario, tiles: Tile[]): ConversationState {
  const step = findStep(scenario, state.stepId);
  if (!step || state.done || tiles.length === 0) return state;

  const result = evaluateSentence(tiles, step, scenario.tiles);
  const messages: Message[] = [...state.messages, { from: "learner", sentence: result.sentence, status: result.status }];
  // Every correct sentence counts, even one that doesn't fit this moment.
  const successes = result.status === "valid" ? [...state.successes, result.sentence] : state.successes;
  const base = { ...state, attempts: state.attempts + 1, successes, lastResult: result };

  if (result.status !== "valid" || !result.fitsStep || !result.intent) {
    return { ...base, messages };
  }

  const transition = step.on[result.intent]!;
  const reply = fillReply(transition.reply, tiles);
  const done = transition.next === "done";
  return {
    ...base,
    stepId: transition.next,
    done,
    messages: [...messages, { from: "speaker", line: reply, note: transition.note }],
  };
}
