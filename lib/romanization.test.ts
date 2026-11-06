import { describe, expect, it } from "vitest";
import { units } from "../data/lessons";
import { buildRomanizationIndex, romanizationFor } from "./romanization";

const index = buildRomanizationIndex(units);

describe("romanization lookup", () => {
  it("finds phrases taught in the lessons, ignoring final punctuation", () => {
    expect(romanizationFor(index, "안녕하세요.")).toBe("annyeonghaseyo");
    expect(romanizationFor(index, "안녕하세요")).toBe("annyeonghaseyo");
  });

  it("joins two known sentences", () => {
    expect(romanizationFor(index, "죄송합니다. 화장실이 어디예요?")).toBe("joesonghamnida. hwajangsiri eodiyeyo");
  });

  it("never guesses: unknown Korean and English get nothing", () => {
    expect(romanizationFor(index, "없는말입니다")).toBeUndefined();
    expect(romanizationFor(index, "Hello")).toBeUndefined();
  });

  it("covers most mission answers in the lessons", () => {
    const options = units.flatMap((unit) =>
      unit.lessons.flatMap((lesson) =>
        (lesson.sections?.study ?? []).flatMap((section) => section.missions.flatMap((mission) => mission.options))
      )
    );
    const korean = options.filter((option) => /[가-힣]/.test(option));
    const covered = korean.filter((option) => romanizationFor(index, option));
    expect(covered.length / korean.length).toBeGreaterThan(0.5);
  });
});
