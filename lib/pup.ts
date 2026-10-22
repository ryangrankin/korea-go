/*
  PUP
  Which accessories are unlocked (from finished lessons) and which ones
  the pup is wearing. The outfit is saved on this device.
*/

import { useSyncExternalStore } from "react";
import { accessories, type Accessory, type Slot } from "../data/accessories";
import { PROGRESS_EVENT, STORAGE_KEY as PROGRESS_KEY } from "./lessonProgress";

export type Outfit = Partial<Record<Slot, string>>; // slot → accessory id

const OUTFIT_KEY = "koreaGoPupOutfit";
const OUTFIT_EVENT = "koreaGoPupOutfit";

function read(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}

function parse<T>(raw: string, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  const events = ["storage", PROGRESS_EVENT, OUTFIT_EVENT];
  events.forEach((name) => window.addEventListener(name, onChange));
  return () => events.forEach((name) => window.removeEventListener(name, onChange));
}

const snapshot = () => `${read(PROGRESS_KEY)}\n${read(OUTFIT_KEY)}`;

function saveOutfit(outfit: Outfit) {
  try {
    localStorage.setItem(OUTFIT_KEY, JSON.stringify(outfit));
    window.dispatchEvent(new Event(OUTFIT_EVENT));
  } catch {
    // Dressing up still works for this visit without saving.
  }
}

export type PupState = {
  unlocked: Accessory[];
  outfit: Outfit;
  wearing: Accessory[];
  isUnlocked: (id: string) => boolean;
  isWearing: (id: string) => boolean;
  putOn: (id: string) => void;
  takeOff: (id: string) => void;
  takeOffAll: () => void;
};

// The pup's unlocked accessories and outfit. Updates by itself when a
// lesson is finished or the outfit changes. (Empty during the server render.)
export function usePup(): PupState {
  const snap = useSyncExternalStore(subscribe, snapshot, () => "\n");
  const [progressRaw, outfitRaw] = snap.split("\n");
  const progress = parse<Record<string, boolean>>(progressRaw, {});
  const unlocked = accessories.filter((item) => progress[item.lessonId] === true);
  const unlockedIds = new Set(unlocked.map((item) => item.id));

  // Only wear things that are still unlocked.
  const saved = parse<Outfit>(outfitRaw, {});
  const outfit: Outfit = {};
  for (const [slot, id] of Object.entries(saved) as [Slot, string][]) {
    if (unlockedIds.has(id)) outfit[slot] = id;
  }
  const wearing = accessories.filter((item) => outfit[item.slot] === item.id);

  return {
    unlocked,
    outfit,
    wearing,
    isUnlocked: (id) => unlockedIds.has(id),
    isWearing: (id) => wearing.some((item) => item.id === id),
    putOn: (id) => {
      const item = accessories.find((a) => a.id === id);
      if (item && unlockedIds.has(id)) saveOutfit({ ...outfit, [item.slot]: id });
    },
    takeOff: (id) => {
      const item = accessories.find((a) => a.id === id);
      if (item && outfit[item.slot] === id) {
        const next = { ...outfit };
        delete next[item.slot];
        saveOutfit(next);
      }
    },
    takeOffAll: () => saveOutfit({}),
  };
}
