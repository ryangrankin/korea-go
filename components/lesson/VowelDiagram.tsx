/*
  VowelDiagram: how to write a Hangul vowel — numbered strokes, each with an
  arrow showing which way it's drawn. Short strokes are orange so learners
  can see which side they sit on. Data: data/strokes.ts.
*/

import { strokeSteps, vowelStrokes } from "../../data/strokes";

type VowelDiagramProps = {
  letter: string;
  size?: number; // pixels
  showSteps?: boolean; // the "1 ↓ down, then 2 → across" line under it
};

export default function VowelDiagram({ letter, size = 96, showSteps = true }: VowelDiagramProps) {
  const strokes = vowelStrokes[letter];
  if (!strokes) return null;
  const steps = strokeSteps(letter);
  const markerId = `arrow-${letter.codePointAt(0)}`;

  return (
    <figure className="vowel-diagram">
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        role="img"
        aria-label={`How to write ${letter}: ${steps}`}
      >
        <defs>
          {/* An arrowhead at the end of each stroke shows which way it's drawn */}
          <marker
            id={markerId}
            viewBox="0 0 10 10"
            refX="4"
            refY="5"
            markerUnits="userSpaceOnUse"
            markerWidth="14"
            markerHeight="14"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#c4660f" />
          </marker>
        </defs>
        <rect x="2" y="2" width="96" height="96" rx="12" fill="#f8fafc" stroke="#e5e7eb" />
        {strokes.map((stroke, i) => (
          <line
            key={`s${i}`}
            x1={stroke.from[0]}
            y1={stroke.from[1]}
            x2={stroke.to[0]}
            y2={stroke.to[1]}
            stroke={stroke.short ? "#f28c28" : "#1f4f82"}
            strokeWidth="7"
            strokeLinecap="round"
            markerEnd={`url(#${markerId})`}
          />
        ))}
        {/* Stroke numbers, beside where each stroke starts */}
        {strokes.map((stroke, i) => {
          const vertical = stroke.from[0] === stroke.to[0];
          const cx = vertical ? stroke.from[0] - 11 : stroke.from[0] + 3;
          const cy = vertical ? stroke.from[1] + 5 : stroke.from[1] - 11;
          return (
            <g key={`n${i}`}>
              <circle cx={cx} cy={cy} r="7" fill="white" stroke="#1f4f82" strokeWidth="1.5" />
              <text x={cx} y={cy + 3.2} textAnchor="middle" fontSize="9" fontWeight="700" fill="#1f4f82" fontFamily="sans-serif">
                {i + 1}
              </text>
            </g>
          );
        })}
      </svg>
      {showSteps && <figcaption>Write it: {steps}</figcaption>}
    </figure>
  );
}
