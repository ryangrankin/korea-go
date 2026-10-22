"use client";

/*
  Pup: the korea GO! mascot, wearing the accessories you've put on.
  - size:    width in pixels
  - preview: an accessory to show on top of the outfit (e.g. one just
             unlocked), without changing what's saved
  - outfit:  show these accessories instead of the saved outfit
*/

import Image from "next/image";
import { SLOTS, type Accessory } from "../data/accessories";
import { usePup } from "../lib/pup";

type PupProps = {
  size?: number;
  preview?: Accessory;
  outfit?: Accessory[];
  className?: string;
  label?: string; // describe the pup for screen readers; leave out if decorative
};

export default function Pup({ size = 120, preview, outfit, className = "", label }: PupProps) {
  const pup = usePup();
  const worn = outfit ?? pup.wearing;

  // One item per slot; a preview replaces whatever is in its slot.
  const items: Accessory[] = preview
    ? [...worn.filter((item) => item.slot !== preview.slot), preview]
    : worn;
  const description =
    label ??
    (items.length > 0 ? `Your pup wearing ${items.map((item) => item.name.toLowerCase()).join(", ")}` : undefined);

  return (
    <div
      className={`pup ${className}`}
      style={{ width: size }}
      role={description ? "img" : undefined}
      aria-label={description}
      aria-hidden={description ? undefined : true}
    >
      <Image src="/brand/pup.png" alt="" width={218} height={263} className="pup-body" priority />
      {items.map((item) => {
        const slot = SLOTS[item.slot];
        return (
          <span
            key={item.id}
            className={`pup-item ${item === preview ? "pup-item-new" : ""}`}
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              fontSize: `${(slot.size * size) / 100}px`,
              transform: `translate(-50%, -50%) rotate(${slot.rotate}deg)`,
            }}
          >
            {item.emoji}
          </span>
        );
      })}
    </div>
  );
}
