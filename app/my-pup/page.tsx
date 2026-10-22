"use client";

/*
  My Pup: dress up the mascot with accessories unlocked by finishing
  lessons. One item per spot (head, ear, eyes, neck, paw).
*/

import Link from "next/link";
import BottomNav from "../../components/BottomNav";
import Pup from "../../components/Pup";
import { accessories, SLOTS } from "../../data/accessories";
import { lessons } from "../../data/lessons";
import { usePup } from "../../lib/pup";

export default function MyPupPage() {
  const pup = usePup();
  const lessonTitle = (lessonId: string) =>
    lessons.find((lesson) => lesson.id === lessonId)?.title ?? "a lesson";

  return (
    <main className="basic-page">
      <div className="basic-container">
        <h1>My Pup 🐶</h1>
        <p className="page-description">
          Finish lessons to unlock Korean food, music, and culture accessories, then dress up
          your travel buddy.
        </p>

        <div className="pup-layout">
          {/* The pup, wearing the current outfit */}
          <section className="pup-stage">
            <Pup size={220} />
            <p className="pup-stage-count">
              {pup.unlocked.length} of {accessories.length} accessories unlocked
            </p>
            {pup.wearing.length > 0 && (
              <button type="button" className="link-button" onClick={pup.takeOffAll}>
                Take everything off
              </button>
            )}
          </section>

          {/* Every accessory: tap to put on or take off */}
          <section className="pup-closet">
            <h2>Closet</h2>
            <div className="pup-closet-grid">
              {accessories.map((item) => {
                const unlocked = pup.isUnlocked(item.id);
                const wearing = pup.isWearing(item.id);

                if (!unlocked) {
                  return (
                    <Link
                      key={item.id}
                      href={`/lessons/${item.lessonId}`}
                      className="pup-closet-item locked"
                      title={`Finish "${lessonTitle(item.lessonId)}" to unlock`}
                    >
                      <span className="pup-closet-emoji" aria-hidden="true">{item.emoji}</span>
                      <span className="pup-closet-name">🔒 {lessonTitle(item.lessonId)}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`pup-closet-item ${wearing ? "wearing" : ""}`}
                    aria-pressed={wearing}
                    title={item.fact}
                    onClick={() => (wearing ? pup.takeOff(item.id) : pup.putOn(item.id))}
                  >
                    <span className="pup-closet-emoji" aria-hidden="true">{item.emoji}</span>
                    <span className="pup-closet-name">{item.name}</span>
                    <span className="pup-closet-slot">{wearing ? "✓ Wearing" : SLOTS[item.slot].label}</span>
                  </button>
                );
              })}
            </div>

            {pup.unlocked.length === 0 && (
              <p className="friends-note">
                Finish your first lesson to unlock {accessories[0].name} {accessories[0].emoji}.{" "}
                <Link href={`/lessons/${accessories[0].lessonId}`}>Start Lesson 1 →</Link>
              </p>
            )}
          </section>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
