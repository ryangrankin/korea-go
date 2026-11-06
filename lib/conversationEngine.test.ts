/*
  Conversation tab: building sentences from tiles, checking them, and
  moving through each scenario. Cases come from the scenario spec.
*/

import { describe, expect, it } from "vitest";
import { findScenario, type Scenario, type Tile } from "../data/conversations";
import { endsInConsonant, evaluateSentence, fillReply, joinTiles } from "./conversationEngine";
import { startConversation, submitAnswer, type ConversationState } from "./conversationState";

const restaurant = findScenario("restaurant")!;
const shopping = findScenario("shopping")!;
const cafe = findScenario("cafe")!;

// Pick tiles by their Korean text, the way a learner would tap them.
function tap(scenario: Scenario, ...words: string[]): Tile[] {
  return words.map((word) => {
    const tile = scenario.tiles.find((t) => t.korean === word);
    if (!tile) throw new Error(`No tile "${word}" in ${scenario.id}`);
    return tile;
  });
}

const check = (scenario: Scenario, stepIndex: number, ...words: string[]) =>
  evaluateSentence(tap(scenario, ...words), scenario.steps[stepIndex], scenario.tiles);

describe("joining tiles with Korean spacing", () => {
  it("attaches particles and endings to the word before", () => {
    expect(joinTiles(tap(restaurant, "저", "는", "김밥", "을", "먹고", "싶어요"))).toBe("저는 김밥을 먹고 싶어요");
    expect(joinTiles(tap(shopping, "이거", "얼마", "예요?"))).toBe("이거 얼마예요?");
    expect(joinTiles(tap(cafe, "아메리카노", "하고", "라떼", "주세요"))).toBe("아메리카노하고 라떼 주세요");
  });

  it("knows which words end in a consonant", () => {
    expect(endsInConsonant("김밥")).toBe(true);
    expect(endsInConsonant("물")).toBe(true);
    expect(endsInConsonant("라떼")).toBe(false);
  });
});

describe("restaurant", () => {
  it.each([
    ["김밥", "주세요"],
    ["비빔밥", "하나", "주세요"],
    ["물", "주세요"],
    ["물", "을", "주세요"],
    ["저", "는", "김밥", "을", "먹고", "싶어요"],
    ["이거", "주세요"],
  ])("accepts %s … as an order", (...words) => {
    const result = check(restaurant, 0, ...words);
    expect(result.status).toBe("valid");
    expect(result.fitsStep).toBe(true);
  });

  it("explains 을 vs 를: 김밥 를 주세요", () => {
    const result = check(restaurant, 0, "김밥", "를", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.feedback).toContain("consonant");
    expect(result.feedback).toContain("을");
    expect(result.corrected).toBe("김밥을 주세요");
    expect(result.intent).toBe("order"); // understood what they meant
  });

  it("explains that 물 also takes 을", () => {
    const result = check(restaurant, 0, "물", "를", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.corrected).toBe("물을 주세요");
  });

  it("accepts separately tapped particles and shows the joined sentence", () => {
    const result = check(restaurant, 0, "저", "는", "김밥", "을", "먹고", "싶어요");
    expect(result.sentence).toBe("저는 김밥을 먹고 싶어요");
    expect(result.intent).toBe("wantToEat");
  });

  it("recognizes just the food word, and suggests adding 주세요", () => {
    const result = check(restaurant, 0, "김밥");
    expect(result.status).toBe("incomplete");
    expect(result.feedback).toContain("주세요");
    expect(result.corrected).toBe("김밥 주세요");
  });

  it("accepts 네 and 감사합니다 where they fit", () => {
    expect(check(restaurant, 1, "네").fitsStep).toBe(true);
    expect(check(restaurant, 2, "감사합니다").fitsStep).toBe(true);
  });

  it("calls good Korean that doesn't fit the moment valid, not wrong", () => {
    const result = check(restaurant, 0, "감사합니다");
    expect(result.status).toBe("valid");
    expect(result.fitsStep).toBe(false);
  });

  it("asks for 주세요 at the end", () => {
    const result = check(restaurant, 0, "주세요", "김밥");
    expect(result.status).toBe("invalid");
    expect(result.corrected).toBe("김밥 주세요");
  });

  it("doesn't call an unknown sentence wrong", () => {
    const result = check(restaurant, 0, "네", "김밥", "저");
    expect(result.status).toBe("unrecognized");
    expect(result.feedback).toContain("may not be wrong");
  });
});

describe("shopping", () => {
  it.each([
    [0, ["이거", "얼마예요?"]],
    [0, ["저거", "얼마예요?"]],
    [0, ["이거", "는", "얼마예요?"]],
    [0, ["이거", "얼마", "예요?"]],
    [1, ["이거", "하나", "주세요"]],
    [1, ["저거", "두", "개", "주세요"]],
    [2, ["감사합니다"]],
  ] as [number, string[]][])("step %i accepts %s", (step, words) => {
    const result = check(shopping, step, ...words);
    expect(result.status).toBe("valid");
    expect(result.fitsStep).toBe(true);
  });

  it("finishes an incomplete price question: 이거 얼마", () => {
    const result = check(shopping, 0, "이거", "얼마");
    expect(result.status).toBe("incomplete");
    expect(result.corrected).toBe("이거 얼마예요?");
  });

  it("asks what you want when there's only a number: 두 주세요", () => {
    const result = check(shopping, 1, "두", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.corrected).toBe("이거 두 개 주세요");
  });

  it("explains 하나 → 한 before a counter", () => {
    const result = check(shopping, 1, "이거", "하나", "개", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.feedback).toContain("한");
  });
});

describe("café", () => {
  it.each([
    ["아이스", "아메리카노", "주세요"],
    ["따뜻한", "라떼", "주세요"],
    ["아이스", "아메리카노", "한", "잔", "주세요"],
    ["라떼", "두", "잔", "주세요"],
    ["물", "주세요"],
    ["아이스", "라떼", "주세요"], // not listed in the spec, but valid
    ["아메리카노", "하고", "라떼", "주세요"],
  ])("accepts %s … as a drink order", (...words) => {
    const result = check(cafe, 0, ...words);
    expect(result.status).toBe("valid");
    expect(result.fitsStep).toBe(true);
  });

  it("needs a counter: 아이스 아메리카노 한 주세요", () => {
    const result = check(cafe, 0, "아이스", "아메리카노", "한", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.feedback).toContain("잔");
    expect(result.corrected).toBe("아이스 아메리카노 한 잔 주세요");
  });

  it("understands 두 잔 라떼 주세요 and suggests the usual order", () => {
    const result = check(cafe, 0, "두", "잔", "라떼", "주세요");
    expect(result.status).toBe("invalid");
    expect(result.intent).toBe("order");
    expect(result.corrected).toBe("라떼 두 잔 주세요");
  });

  it("accepts 아니요 (and 네) to the negative follow-up question", () => {
    expect(check(cafe, 1, "아니요").fitsStep).toBe(true);
    expect(check(cafe, 1, "네").fitsStep).toBe(true);
  });
});

describe("replies", () => {
  it("fills in what was ordered, with 이요 or 요 the Korean way", () => {
    const step = restaurant.steps[0];
    const gimbap = fillReply(step.on.order!.reply, tap(restaurant, "김밥", "주세요"));
    expect(gimbap.korean).toContain("김밥이요");
    const latte = fillReply(cafe.steps[0].on.order!.reply, tap(cafe, "라떼", "두", "잔", "주세요"));
    expect(latte.korean).toContain("라떼 두 잔이요");
  });
});

describe("conversation flow (state machine)", () => {
  function play(scenario: Scenario, answers: string[][]): ConversationState {
    let state = startConversation(scenario);
    for (const words of answers) state = submitAnswer(state, scenario, tap(scenario, ...words));
    return state;
  }

  it("restaurant: order, answer the follow-up, thank → done", () => {
    const state = play(restaurant, [["김밥", "주세요"], ["물", "주세요"], ["감사합니다"]]);
    expect(state.done).toBe(true);
    expect(state.successes).toHaveLength(3);
  });

  it("restaurant: 네 asks what else, and the conversation waits", () => {
    const state = play(restaurant, [["김밥", "주세요"], ["네"]]);
    expect(state.stepId).toBe("more");
    expect(state.done).toBe(false);
  });

  it("a wrong answer keeps the learner on the same step to try again", () => {
    const state = play(restaurant, [["김밥", "를", "주세요"]]);
    expect(state.stepId).toBe("order");
    expect(state.successes).toHaveLength(0);
    expect(state.lastResult?.status).toBe("invalid");
  });

  it("shopping: ask the price, buy, thank → done; or say no and look again", () => {
    expect(play(shopping, [["이거", "얼마예요?"], ["이거", "하나", "주세요"], ["감사합니다"]]).done).toBe(true);
    expect(play(shopping, [["이거", "얼마예요?"], ["아니요"]]).stepId).toBe("price");
  });

  it("café: order, say that's all, thank → done", () => {
    expect(play(cafe, [["아이스", "아메리카노", "한", "잔", "주세요"], ["아니요"], ["감사합니다"]]).done).toBe(true);
  });

  it("is deterministic: the same answers give the same conversation", () => {
    const answers = [["비빔밥", "하나", "주세요"], ["감사합니다"]];
    expect(play(restaurant, answers)).toEqual(play(restaurant, answers));
  });
});
