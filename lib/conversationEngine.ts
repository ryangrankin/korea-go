/*
  CONVERSATION ENGINE (rule-based, no AI)
  Checks a sentence the learner built from word tiles, for the
  Conversation tab. Plain functions — tested in lib/conversationEngine.test.ts.

  How it works:
  1. Each tile has a ROLE (noun, obj particle, number, counter, 주세요, ...).
     The sentence becomes a string of roles, e.g. "noun obj please".
  2. ERROR CHECKS look for recognizable mistakes that apply to any
     scenario (wrong 을/를 after a consonant, a number with no counter,
     주세요 not at the end, ...) and explain them, with a corrected sentence.
  3. INTENT PATTERNS (role patterns, below) say what a correct sentence
     means: order, wantToEat, askPrice, buy, yes, no, thanks. Many different
     sentences match the same intent, so learners aren't held to one answer.
  4. INCOMPLETE PATTERNS catch the start of a good sentence (e.g. just the
     food word) and say what to add.
  5. Anything else is "unrecognized" — NOT marked wrong, because a sentence
     can be fine without being one this conversation knows.

  Results: valid | invalid (a recognizable error) | incomplete | unrecognized.
*/

import type { Intent, Line, Scenario, Step, Tile, TileRole } from "../data/conversations";

export type Status = "valid" | "invalid" | "incomplete" | "unrecognized" | "empty";

export type Evaluation = {
  status: Status;
  sentence: string; // the learner's sentence, joined with Korean spacing
  intent?: Intent; // what a valid (or understood) sentence means
  fitsStep: boolean; // valid AND an answer this step accepts
  feedback: string; // what's right, or what to change (helps learners notice)
  corrected?: string; // a corrected version, when there's a fix
};

// ---------- Korean helpers ----------

// Does the last Korean syllable end in a consonant (받침)? 김밥 → yes, 라떼 → no.
export function endsInConsonant(word: string): boolean {
  const hangul = [...word].filter((ch) => ch >= "가" && ch <= "힣");
  const last = hangul.at(-1);
  if (!last) return false;
  return (last.charCodeAt(0) - 0xac00) % 28 !== 0;
}

// Join tiles with natural Korean spacing: particles and endings like
// 을, 는, 하고, 예요? attach to the word before them.
export function joinTiles(tiles: Tile[]): string {
  return tiles.reduce((text, tile, i) => (i === 0 ? tile.korean : text + (tile.attach ? "" : " ") + tile.korean), "");
}

// Normalize typed/joined Korean for comparing: no spaces, no final punctuation.
export const normalizeKorean = (text: string) => text.replace(/\s+/g, "").replace(/[.?!]+$/, "");

// ---------- Patterns (written with roles) ----------
// NP: a noun phrase ("아이스 아메리카노", "이거"); QTY: how many ("하나", "두 잔").
const MACROS: Record<string, string> = {
  ITEM: "NP(?: obj)?(?: QTY)?",
  NP: "(?:adj )*(?:noun|this)",
  QTY: "(?:num|numMod counter)",
};

function compile(pattern: string): RegExp {
  let source = pattern;
  for (let i = 0; i < 3; i++) {
    for (const [name, value] of Object.entries(MACROS)) source = source.replaceAll(name, value);
  }
  return new RegExp(`^${source}$`);
}

// What a correct sentence means. Checked in this order.
const INTENT_PATTERNS: [Intent, RegExp][] = (
  [
    ["wantToEat", "(?:I topic )?NP obj wantEat want"], // 저는 김밥을 먹고 싶어요
    ["askPrice", "this(?: topic)? (?:howMuchQ|howMuch copulaQ)"], // 이거 얼마예요? / 이거는 얼마예요?
    ["buy", "this(?: obj)?(?: QTY)? please"], // 이거 하나 주세요 / 저거 두 개 주세요
    ["order", "ITEM(?: and ITEM)* please"], // 김밥 주세요 / 물을 주세요 / 라떼 두 잔 주세요 / A하고 B 주세요
    ["yes", "yes"],
    ["no", "no"],
    ["thanks", "thanks"],
  ] as [Intent, string][]
).map(([intent, pattern]) => [intent, compile(pattern)]);

// The start of a good sentence, and what to add.
type Incomplete = { pattern: RegExp; feedback: (tiles: Tile[], sentence: string) => string; corrected?: (tiles: Tile[], sentence: string) => string };
const INCOMPLETE_PATTERNS: Incomplete[] = [
  {
    pattern: compile("ITEM"),
    feedback: (tiles) =>
      `I can tell you want ${nounText(tiles) || "that"}! To ask for it politely, add 주세요 (please give me) at the end.`,
    corrected: (_, sentence) => `${sentence} 주세요`,
  },
  {
    pattern: compile("this(?: topic)? howMuch"),
    feedback: () => "Almost a question! Add 예요? to finish it: 얼마예요? (how much is it?)",
    corrected: (_, sentence) => `${sentence}예요?`,
  },
  {
    pattern: compile("(?:I topic )?NP obj wantEat"),
    feedback: () => "Nearly there — finish with 싶어요: 먹고 싶어요 means \"want to eat.\"",
    corrected: (_, sentence) => `${sentence} 싶어요`,
  },
  {
    pattern: compile("(?:I topic )?NP obj"),
    feedback: () => "Good — 을/를 marks what you want. Now say what to do with it: 주세요 (please give me) or 먹고 싶어요 (want to eat).",
  },
  {
    pattern: compile("QTY please"),
    feedback: () => "Say WHAT you want before the number, e.g. 이거 두 개 주세요 (two of these, please).",
  },
  { pattern: compile("I(?: topic)?"), feedback: () => "Good start! Now say what you want." },
  { pattern: compile("please"), feedback: () => "주세요 needs something before it — what would you like? e.g. 물 주세요." },
  { pattern: compile("(?:adj )+"), feedback: () => "Now add the drink, e.g. 아이스 아메리카노." },
  {
    pattern: compile("ITEM(?: and ITEM)* and"),
    feedback: () => "하고 means \"and\" — add another item after it, then 주세요.",
  },
];

// ---------- Error checks (work for any scenario) ----------
type Fix = { feedback: string; tiles?: Tile[] };
type Check = (tiles: Tile[], bank: Tile[]) => Fix | null;

const isNounLike = (role?: TileRole) => role === "noun" || role === "this" || role === "I";

// 을/를 and 은/는 go right after the thing they mark.
const particleAfterNoun: Check = (tiles) => {
  const i = tiles.findIndex((tile, j) => (tile.role === "obj" || tile.role === "topic") && !isNounLike(tiles[j - 1]?.role));
  if (i === -1) return null;
  return { feedback: `${tiles[i].korean} goes right after the word it marks, like 김밥을 or 저는.` };
};

// 을 after a consonant, 를 after a vowel (and 은/는 the same way).
const particleAgreement: Check = (tiles, bank) => {
  for (let i = 1; i < tiles.length; i++) {
    const tile = tiles[i];
    if (tile.role !== "obj" && tile.role !== "topic") continue;
    const word = tiles[i - 1].korean;
    const consonant = endsInConsonant(word);
    const right = tile.role === "obj" ? (consonant ? "을" : "를") : consonant ? "은" : "는";
    if (tile.korean === right) continue;
    const fixed = bank.find((t) => t.korean === right) ?? { ...tile, id: right, korean: right };
    const fixedTiles = tiles.map((t, j) => (j === i ? fixed : t));
    return {
      feedback: consonant
        ? `${word} ends in a consonant, so use ${right} instead of ${tile.korean}.`
        : `${word} ends in a vowel, so use ${right} instead of ${tile.korean}.`,
      tiles: fixedTiles,
    };
  }
  return null;
};

// 하나 + counter → 한 + counter (한 개, 한 잔).
const hanaBeforeCounter: Check = (tiles, bank) => {
  const i = tiles.findIndex((tile, j) => tile.role === "num" && tiles[j + 1]?.role === "counter");
  if (i === -1) return null;
  const han = bank.find((t) => t.korean === "한") ?? { ...tiles[i], id: "oneMod", korean: "한", role: "numMod" as TileRole };
  return {
    feedback: `Before a counter, 하나 becomes 한: 한 ${tiles[i + 1].korean}.`,
    tiles: tiles.map((t, j) => (j === i ? han : t)),
  };
};

// A drink or thing comes first, then how many: 라떼 두 잔 주세요 (not 두 잔 라떼).
const quantityBeforeNoun: Check = (tiles) => {
  const i = tiles.findIndex((tile, j) => tile.role === "numMod" && tiles[j + 1]?.role === "counter" && /^(adj|noun)$/.test(tiles[j + 2]?.role ?? ""));
  if (i === -1) return null;
  let end = i + 2;
  while (tiles[end] && (tiles[end].role === "adj" || tiles[end].role === "noun")) end++;
  const item = tiles.slice(i + 2, end);
  const quantity = tiles.slice(i, i + 2);
  return {
    feedback: `I understand! In Korean, say the thing first, then how many: ${joinTiles([...item, ...quantity])}.`,
    tiles: [...tiles.slice(0, i), ...item, ...quantity, ...tiles.slice(end)],
  };
};

// A number with nothing to count: 두 주세요 → 이거 두 개 주세요.
const quantityNeedsItem: Check = (tiles, bank) => {
  const hasItem = tiles.some((tile) => tile.role === "noun" || tile.role === "this");
  const number = tiles.findIndex((tile) => tile.role === "num" || tile.role === "numMod");
  if (hasItem || number === -1 || !tiles.some((tile) => tile.role === "please")) return null;
  const pointer = bank.find((tile) => tile.role === "this");
  const counter = bank.find((tile) => tile.role === "counter" && tile.korean === "개") ?? bank.find((tile) => tile.role === "counter");
  const quantity = tiles[number];
  const needsCounter = quantity.role === "numMod" && tiles[number + 1]?.role !== "counter" && counter;
  const please = tiles.find((tile) => tile.role === "please")!;
  const fixed = [
    ...(pointer ? [pointer] : []),
    quantity,
    ...(needsCounter ? [counter!] : tiles[number + 1]?.role === "counter" ? [tiles[number + 1]] : []),
    please,
  ];
  return {
    feedback: `${quantity.korean} says how many, but not what. Say the thing first${
      pointer ? `, e.g. ${joinTiles(fixed)}` : ""
    }.`,
    tiles: pointer ? fixed : undefined,
  };
};

// 한 / 두 need a counter after them (두 잔, 두 개).
const numberNeedsCounter: Check = (tiles, bank) => {
  const i = tiles.findIndex((tile, j) => tile.role === "numMod" && tiles[j + 1]?.role !== "counter");
  if (i === -1) return null;
  const counters = bank.filter((t) => t.role === "counter");
  const noun = [...tiles.slice(0, i)].reverse().find((t) => t.role === "noun" || t.role === "this");
  const counter =
    counters.find((t) => (noun?.category === "drink" ? t.korean === "잔" : t.korean === "개")) ?? counters[0];
  if (!counter) {
    const one = bank.find((t) => t.role === "num");
    return {
      feedback: `${tiles[i].korean} needs a counter after it (like ${tiles[i].korean} 개).${
        one ? ` With these words, ask for one: ${one.korean}.` : ""
      }`,
      tiles: one ? tiles.map((t, j) => (j === i ? one : t)) : undefined,
    };
  }
  const what = counter.korean === "잔" ? "A drink order" : "A number like this";
  return {
    feedback: `${what} needs a counter: ${tiles[i].korean} ${counter.korean} (${counter.english}).`,
    tiles: [...tiles.slice(0, i + 1), counter, ...tiles.slice(i + 1)],
  };
};

// 주세요 always ends the request.
const pleaseAtEnd: Check = (tiles) => {
  const i = tiles.findIndex((tile) => tile.role === "please");
  if (i === -1 || i === tiles.length - 1) return null;
  return {
    feedback: "In Korean the verb comes last, so 주세요 goes at the end of the request.",
    tiles: [...tiles.slice(0, i), ...tiles.slice(i + 1), tiles[i]],
  };
};

// 먹고 comes before 싶어요.
const wantOrder: Check = (tiles) => {
  const want = tiles.findIndex((tile) => tile.role === "want");
  const eat = tiles.findIndex((tile) => tile.role === "wantEat");
  if (want === -1 || eat === -1 || eat < want) return null;
  return {
    feedback: "먹고 (eat and…) comes before 싶어요 (want to): 먹고 싶어요.",
    tiles: [...tiles.filter((t, j) => j !== want && j !== eat), tiles[eat], tiles[want]],
  };
};

// The same marker twice in a row.
const doubleParticle: Check = (tiles) => {
  const i = tiles.findIndex((tile, j) => (tile.role === "obj" || tile.role === "topic") && tiles[j - 1] && tiles[j - 1].role === tile.role);
  if (i === -1) return null;
  return { feedback: "One marker is enough — remove the extra one.", tiles: tiles.filter((_, j) => j !== i) };
};

// Checked in this order; the first that finds something explains it.
const CHECKS: Check[] = [
  doubleParticle,
  particleAfterNoun,
  pleaseAtEnd,
  wantOrder,
  quantityBeforeNoun,
  hanaBeforeCounter,
  quantityNeedsItem,
  numberNeedsCounter,
  particleAgreement,
];

// ---------- What the learner asked for (for the speaker's reply) ----------
const ITEM_ROLES: TileRole[] = ["noun", "this", "adj", "num", "numMod", "counter", "and"];

// "아이스 아메리카노 한 잔", "김밥", "아메리카노하고 라떼"
export function itemText(tiles: Tile[]): string {
  return joinTiles(tiles.filter((tile) => ITEM_ROLES.includes(tile.role)));
}

// "iced Americano", "gimbap"
export function itemEnglish(tiles: Tile[]): string {
  const parts: string[] = [];
  let current: string[] = [];
  for (const tile of tiles) {
    if (tile.role === "adj" || tile.role === "noun" || tile.role === "this") {
      current.push(tile.english.replace(/\s*\(.*\)$/, ""));
      if (tile.role !== "adj") {
        parts.push(current.join(" "));
        current = [];
      }
    }
  }
  return parts.join(" and ");
}

function nounText(tiles: Tile[]) {
  return tiles.filter((tile) => tile.role === "noun" || tile.role === "this").map((tile) => tile.korean).join(", ");
}

// Fill {item} and {item이요} in a reply.
export function fillReply(line: Line, tiles: Tile[]): Line {
  const item = itemText(tiles);
  const itemRom = tiles
    .filter((tile) => ITEM_ROLES.includes(tile.role))
    .map((tile) => tile.romanization)
    .join(" ");
  const iyo = endsInConsonant(item) ? "이요" : "요";
  return {
    korean: line.korean.replaceAll("{item이요}", `${item}${iyo}`).replaceAll("{item}", item),
    romanization: line.romanization
      .replaceAll("{item이요}", `${itemRom}${iyo === "이요" ? "-iyo" : "-yo"}`)
      .replaceAll("{item}", itemRom),
    english: line.english.replaceAll("{item}", itemEnglish(tiles) || item),
  };
}

// ---------- Explaining a correct sentence (so learners notice the parts) ----------
function explainValid(intent: Intent, tiles: Tile[]): string {
  const has = (role: TileRole) => tiles.some((tile) => tile.role === role);
  const obj = tiles.find((tile) => tile.role === "obj");
  switch (intent) {
    case "order":
    case "buy": {
      const parts = [`${itemText(tiles)} + 주세요 = a polite request ("${itemEnglish(tiles) || "that"}, please").`];
      if (obj) parts.push(`${obj.korean} marks what you want.`);
      if (has("num")) parts.push("하나 says you want one.");
      if (has("counter")) {
        const counter = tiles.find((tile) => tile.role === "counter")!;
        parts.push(`${counter.korean} is the counter (${counter.english}).`);
      }
      if (has("and")) parts.push("하고 joins two things: \"and.\"");
      return parts.join(" ");
    }
    case "wantToEat":
      return `${joinTiles(tiles)} — "I want to eat ${itemEnglish(tiles)}." ${obj?.korean ?? "을/를"} marks the food, and 먹고 싶어요 means "want to eat." A friendly way to order!`;
    case "askPrice":
      return "얼마예요? asks \"how much is it?\" Pointing with 이거/저거 tells them which one.";
    case "yes":
      return "네 means yes.";
    case "no":
      return "아니요 means no.";
    case "thanks":
      return "감사합니다 is the polite thank-you — perfect for staff and shopkeepers.";
  }
}

// ---------- The main check ----------
export function evaluateSentence(tiles: Tile[], step: Step, bank: Tile[]): Evaluation {
  const sentence = joinTiles(tiles);
  if (tiles.length === 0) {
    return { status: "empty", sentence, fitsStep: false, feedback: "Tap words in the word bank to build your answer." };
  }

  const roles = tiles.map((tile) => tile.role).join(" ");

  // 1. Correct sentences. (Checked first, so a correct sentence is never "fixed".)
  // A sentence can match more than one meaning (이거 주세요 is "buy" and
  // "order"), so prefer one this step accepts.
  const matches = INTENT_PATTERNS.filter(([, pattern]) => pattern.test(roles)).map(([intent]) => intent);
  if (matches.length > 0 && !particleAgreement(tiles, bank)) {
    const intent = matches.find((candidate) => step.on[candidate]) ?? matches[0];
    const fits = Boolean(step.on[intent]);
    return {
      status: "valid",
      sentence,
      intent,
      fitsStep: fits,
      feedback: fits
        ? explainValid(intent, tiles)
        : `That's good Korean (${explainValid(intent, tiles)}) — but it doesn't answer what you were just asked. ${step.task}`,
    };
  }

  // 2. Recognizable mistakes, with a corrected sentence.
  for (const check of CHECKS) {
    const fix = check(tiles, bank);
    if (!fix) continue;
    const corrected = fix.tiles ? joinTiles(fix.tiles) : undefined;
    const understood = fix.tiles ? evaluateSentence(fix.tiles, step, bank) : undefined;
    return {
      status: "invalid",
      sentence,
      intent: understood?.status === "valid" ? understood.intent : undefined,
      fitsStep: false,
      feedback: fix.feedback,
      corrected,
    };
  }

  // 3. The start of a good sentence.
  for (const item of INCOMPLETE_PATTERNS) {
    if (!item.pattern.test(roles)) continue;
    return {
      status: "incomplete",
      sentence,
      fitsStep: false,
      feedback: item.feedback(tiles, sentence),
      corrected: item.corrected?.(tiles, sentence),
    };
  }

  // 4. Not something this conversation knows — which doesn't make it wrong.
  return {
    status: "unrecognized",
    sentence,
    fitsStep: false,
    feedback: `I'm not sure how to answer that here. It may not be wrong — it just isn't a sentence this conversation knows. ${step.hint}`,
  };
}

// ---------- Step helpers ----------
export const firstStep = (scenario: Scenario) => scenario.steps[0];
export const findStep = (scenario: Scenario, id: string) => scenario.steps.find((step) => step.id === id);
