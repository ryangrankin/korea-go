/*
  VOWEL STROKE ORDER
  ==================
  How to write each vowel: the strokes in order, each drawn from its first
  point to its second point (the arrow shows that direction). Checked
  against the stroke-order diagrams on Wikipedia's "Hangul" article
  (Style → Stroke order) for ㅏ ㅐ ㅓ ㅔ ㅗ ㅜ ㅡ ㅣ. The y-vowels (ㅑ ㅕ ㅛ ㅠ)
  follow the same rules: top to bottom, left to right.

  Coordinates are in a 100 × 100 box (0,0 = top left).
  `short: true` marks the short stroke(s), drawn in orange so learners can
  see which side they sit on (that's what tells the vowels apart).
*/

export type Stroke = { from: [number, number]; to: [number, number]; short?: boolean };

const V = (x: number, y1 = 12, y2 = 88): Stroke => ({ from: [x, y1], to: [x, y2] });
const H = (y: number, x1 = 12, x2 = 88): Stroke => ({ from: [x1, y], to: [x2, y] });
const short = (stroke: Stroke): Stroke => ({ ...stroke, short: true });

export const vowelStrokes: Record<string, Stroke[]> = {
  ㅣ: [V(50)],
  ㅡ: [H(50)],
  ㅏ: [V(42), short(H(50, 42, 70))],
  ㅓ: [short(H(50, 30, 58)), V(58)],
  ㅗ: [short(V(50, 30, 60)), H(60)],
  ㅜ: [H(40), short(V(50, 40, 70))],
  ㅑ: [V(42), short(H(38, 42, 70)), short(H(62, 42, 70))],
  ㅕ: [short(H(38, 30, 58)), short(H(62, 30, 58)), V(58)],
  ㅛ: [short(V(38, 30, 60)), short(V(62, 30, 60)), H(60)],
  ㅠ: [H(40), short(V(38, 40, 70)), short(V(62, 40, 70))],
  ㅐ: [V(36), short(H(50, 36, 64)), V(64)],
  ㅔ: [short(H(50, 22, 46)), V(46), V(70)],
};

// Plain-English writing steps, e.g. "1 ↓ down, then 2 → across".
export function strokeSteps(letter: string): string | undefined {
  const strokes = vowelStrokes[letter];
  if (!strokes) return undefined;
  return strokes
    .map((stroke, i) => `${i + 1} ${stroke.from[0] === stroke.to[0] ? "↓ down" : "→ across"}`)
    .join(", then ");
}
