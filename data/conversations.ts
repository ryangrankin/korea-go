/*
  CONVERSATION SCENARIOS
  ======================
  The data behind the Conversation tab (/conversation): for each scenario,
  a word bank of tiles, the steps of the dialogue, and how the simulated
  speaker answers. The rules that check sentences live in
  lib/conversationEngine.ts and work for every scenario, so new scenarios
  only need data here.

  HOW TO EDIT
  - Tiles: `korean`, `english`, and a `role` that says what job the word
    does in a sentence (see TileRole below). `attach: true` means the tile
    joins the word before it with no space (particles like 을, 는, 예요?).
  - Steps: the first step's `line` opens the conversation. For each kind
    of answer (`on`), the speaker gives a `reply` (which also asks the next
    question) and the conversation moves to the `next` step (or "done"). In a reply, {item} becomes the thing the learner asked
    for, e.g. "김밥", and {item이요} adds 이요 or 요 to it the Korean way
    (김밥이요, 라떼요).
  - Intents (what an answer means) come from the patterns in
    lib/conversationEngine.ts: order, wantToEat, askPrice, buy, yes, no, thanks.
  - `hint` and `examples` are shown when the learner asks for help.
*/

export type TileRole =
  | "noun" // something you can order or buy (food, drink, item)
  | "this" // 이거 / 저거 — pointing at something
  | "adj" // a describing word before a noun (아이스, 따뜻한)
  | "obj" // object marker 을 / 를
  | "topic" // topic marker 은 / 는
  | "I" // 저
  | "num" // 하나 — a number used on its own
  | "numMod" // 한 / 두 — a number that needs a counter after it
  | "counter" // 개, 잔 — counting words
  | "please" // 주세요
  | "wantEat" // 먹고 (eat and…)
  | "want" // 싶어요 (want to)
  | "howMuch" // 얼마
  | "copulaQ" // 예요? (is it?)
  | "howMuchQ" // 얼마예요? (how much is it?)
  | "won" // 원
  | "and" // 하고
  | "yes"
  | "no"
  | "thanks";

export type Tile = {
  id: string;
  korean: string;
  english: string;
  romanization: string;
  role: TileRole;
  attach?: boolean; // joins the previous word with no space
  category?: "food" | "drink" | "item"; // for nouns: picks the right counter in hints
};

export type Intent = "order" | "wantToEat" | "askPrice" | "buy" | "yes" | "no" | "thanks";

export type Line = { korean: string; romanization: string; english: string };

export type Step = {
  id: string;
  speaker: string; // who's talking, e.g. "직원 (staff)"
  line?: Line; // what the speaker says to open the conversation (first step only;
  // after that, each reply below asks the next question)
  task: string; // what the learner should do now, in English
  hint: string;
  examples: string[]; // example answers (shown as hints, never as tiles)
  on: Partial<Record<Intent, { next: string; reply: Line; note?: string }>>;
};

export type Scenario = {
  id: string;
  title: string;
  icon: string;
  level: string;
  minutes: string;
  goal: string; // the real-world task
  grammarFocus: string;
  intro: string; // the situation
  speakerName: string;
  speakerEmoji: string;
  tiles: Tile[];
  steps: Step[]; // the first step starts the conversation
  completion: string; // what the learner accomplished
};

// ---------- Shared tiles ----------
const T = (
  id: string,
  korean: string,
  romanization: string,
  english: string,
  role: TileRole,
  extra: Partial<Tile> = {}
): Tile => ({ id, korean, romanization, english, role, ...extra });

const please = T("please", "주세요", "juseyo", "please give me", "please");
const yes = T("yes", "네", "ne", "yes", "yes");
const no = T("no", "아니요", "aniyo", "no", "no");
const thanks = T("thanks", "감사합니다", "gamsahamnida", "thank you", "thanks");
const topic = T("topic", "는", "neun", "topic marker (after a vowel)", "topic", { attach: true });
const twoMod = T("two", "두", "du", "two (before a counter)", "numMod");

// ---------- 1. Restaurant ----------
const restaurant: Scenario = {
  id: "restaurant",
  title: "Ordering at a Korean restaurant",
  icon: "🍚",
  level: "Beginner · A0–A1",
  minutes: "5–7 minutes",
  goal: "Order food or water politely, then thank the staff.",
  grammarFocus: "Object markers 을/를 and polite requests with 주세요",
  intro:
    "You walk into a casual Korean restaurant and sit down. A staff member comes over to take your order. " +
    "Build each answer by tapping words in order — the staff member will respond to what you say.",
  speakerName: "직원 (staff)",
  speakerEmoji: "🧑‍🍳",
  tiles: [
    T("I", "저", "jeo", "I (polite)", "I"),
    topic,
    T("gimbap", "김밥", "gimbap", "gimbap (seaweed rice roll)", "noun", { category: "food" }),
    T("bibimbap", "비빔밥", "bibimbap", "bibimbap (mixed rice bowl)", "noun", { category: "food" }),
    T("water", "물", "mul", "water", "noun", { category: "drink" }),
    T("eul", "을", "eul", "object marker (after a consonant)", "obj", { attach: true }),
    T("reul", "를", "reul", "object marker (after a vowel)", "obj", { attach: true }),
    T("one", "하나", "hana", "one", "num"),
    twoMod,
    please,
    T("eat", "먹고", "meokgo", "eat and…", "wantEat"),
    T("want", "싶어요", "sipeoyo", "want to", "want"),
    T("this", "이거", "igeo", "this (pointing)", "this"),
    yes,
    thanks,
  ],
  steps: [
    {
      id: "order",
      speaker: "직원 (staff)",
      line: { korean: "안녕하세요! 뭐 드릴까요?", romanization: "annyeonghaseyo! mwo deurilkkayo?", english: "Hello! What would you like?" },
      task: "Order some food or water.",
      hint: "Say what you want, then 주세요 (please give me). You can add how many: 하나 (one).",
      examples: ["김밥 주세요", "비빔밥 하나 주세요", "저는 김밥을 먹고 싶어요"],
      on: {
        order: {
          next: "more",
          reply: {
            korean: "네, {item이요}! 더 필요한 거 있으세요?",
            romanization: "ne, {item이요}! deo piryohan geo isseuseyo?",
            english: "Sure, {item}! Do you need anything else?",
          },
        },
        wantToEat: {
          next: "more",
          reply: {
            korean: "네, {item이요}! 더 필요한 거 있으세요?",
            romanization: "ne, {item이요}! deo piryohan geo isseuseyo?",
            english: "Sure, {item}! Do you need anything else?",
          },
          note: "먹고 싶어요 (I want to eat) is a friendly way to order, too.",
        },
      },
    },
    {
      id: "more",
      speaker: "직원 (staff)",
      task: "Ask for something else, say yes, or thank them if that's all.",
      hint: "Order another item with 주세요, answer 네 (yes), or say 감사합니다 if you're all set.",
      examples: ["물 주세요", "네", "감사합니다"],
      on: {
        order: {
          next: "thank",
          reply: {
            korean: "네, 알겠습니다. {item}도 드릴게요.",
            romanization: "ne, algesseumnida. {item}do deurilgeyo.",
            english: "Of course. I'll bring {item} too.",
          },
        },
        wantToEat: {
          next: "thank",
          reply: {
            korean: "네, 알겠습니다. {item}도 드릴게요.",
            romanization: "ne, algesseumnida. {item}do deurilgeyo.",
            english: "Of course. I'll bring {item} too.",
          },
        },
        yes: {
          next: "more",
          reply: { korean: "네, 뭐 더 드릴까요?", romanization: "ne, mwo deo deurilkkayo?", english: "Sure, what else would you like?" },
          note: "네 answers \"yes, I need something.\" Now say what you'd like.",
        },
        thanks: {
          next: "done",
          reply: { korean: "맛있게 드세요!", romanization: "masitge deuseyo!", english: "Enjoy your meal!" },
        },
      },
    },
    {
      id: "thank",
      speaker: "직원 (staff)",
      task: "Thank the staff member.",
      hint: "One word does it: 감사합니다 (thank you).",
      examples: ["감사합니다"],
      on: {
        thanks: {
          next: "done",
          reply: { korean: "맛있게 드세요!", romanization: "masitge deuseyo!", english: "Enjoy your meal!" },
        },
      },
    },
  ],
  completion: "You ordered food in Korean, answered the follow-up question, and thanked the staff politely.",
};

// ---------- 2. Shopping ----------
const shopping: Scenario = {
  id: "shopping",
  title: "Shopping and asking prices",
  icon: "🛍️",
  level: "Beginner · A0–A1",
  minutes: "5–7 minutes",
  goal: "Ask how much something costs, buy it, and thank the shopkeeper.",
  grammarFocus: "얼마예요? (how much?) and counting items with 개",
  intro:
    "You're browsing a small shop at a Seoul market. The shopkeeper greets you. Point at things with 이거 (this) " +
    "or 저거 (that over there).",
  speakerName: "사장님 (shopkeeper)",
  speakerEmoji: "🧑‍💼",
  tiles: [
    T("this", "이거", "igeo", "this (near me)", "this"),
    T("that", "저거", "jeogeo", "that (over there)", "this"),
    topic,
    T("howMuchQ", "얼마예요?", "eolmayeyo?", "how much is it?", "howMuchQ"),
    T("howMuch", "얼마", "eolma", "how much", "howMuch"),
    T("isIt", "예요?", "yeyo?", "is it?", "copulaQ", { attach: true }),
    T("won", "원", "won", "won (Korean money)", "won"),
    T("one", "하나", "hana", "one", "num"),
    twoMod,
    T("items", "개", "gae", "counter for things", "counter"),
    please,
    yes,
    no,
    thanks,
  ],
  steps: [
    {
      id: "price",
      speaker: "사장님 (shopkeeper)",
      line: { korean: "어서 오세요!", romanization: "eoseo oseyo!", english: "Welcome!" },
      task: "Point at something and ask how much it is.",
      hint: "Point with 이거 (this) or 저거 (that), then ask 얼마예요? (how much is it?).",
      examples: ["이거 얼마예요?", "저거 얼마예요?"],
      on: {
        askPrice: {
          next: "buy",
          reply: { korean: "오천 원이에요.", romanization: "ocheon wonieyo.", english: "It's 5,000 won." },
        },
      },
    },
    {
      id: "buy",
      speaker: "사장님 (shopkeeper)",
      task: "Ask to buy it (or say no and look at something else).",
      hint: "이거 (this) + how many + 주세요. For one: 하나. For two things: 두 개.",
      examples: ["이거 하나 주세요", "저거 두 개 주세요", "아니요"],
      on: {
        buy: {
          next: "thank",
          reply: { korean: "네, 여기 있습니다.", romanization: "ne, yeogi itseumnida.", english: "Here you go." },
        },
        order: {
          next: "thank",
          reply: { korean: "네, 여기 있습니다.", romanization: "ne, yeogi itseumnida.", english: "Here you go." },
        },
        no: {
          next: "price",
          reply: { korean: "괜찮아요. 천천히 보세요!", romanization: "gwaenchanayo. cheoncheonhi boseyo!", english: "No problem. Take your time looking!" },
          note: "No pressure — ask about something else.",
        },
      },
    },
    {
      id: "thank",
      speaker: "사장님 (shopkeeper)",
      task: "Thank the shopkeeper.",
      hint: "감사합니다 (thank you).",
      examples: ["감사합니다"],
      on: {
        thanks: {
          next: "done",
          reply: { korean: "감사합니다! 또 오세요!", romanization: "gamsahamnida! tto oseyo!", english: "Thank you! Come again!" },
        },
      },
    },
  ],
  completion: "You asked a price, bought something, and thanked the shopkeeper — a whole shopping trip in Korean.",
};

// ---------- 3. Café ----------
const cafe: Scenario = {
  id: "cafe",
  title: "Ordering at a café",
  icon: "☕",
  level: "Beginner · A0–A1",
  minutes: "5–7 minutes",
  goal: "Order a drink, say how many, and finish politely.",
  grammarFocus: "Drink orders with 한 잔 / 두 잔 (cup counter) and 주세요",
  intro:
    "You step up to the counter at a Seoul café. The barista is ready for your order. Remember: numbers before a counter " +
    "use their short form — 한 잔 (one cup), 두 잔 (two cups).",
  speakerName: "바리스타 (barista)",
  speakerEmoji: "🧑‍🍳",
  tiles: [
    T("iced", "아이스", "aiseu", "iced", "adj"),
    T("hot", "따뜻한", "ttatteuthan", "hot / warm", "adj"),
    T("americano", "아메리카노", "amerikano", "Americano", "noun", { category: "drink" }),
    T("latte", "라떼", "ratte", "latte", "noun", { category: "drink" }),
    T("coffee", "커피", "keopi", "coffee", "noun", { category: "drink" }),
    T("water", "물", "mul", "water", "noun", { category: "drink" }),
    T("oneMod", "한", "han", "one (before a counter)", "numMod"),
    twoMod,
    T("cups", "잔", "jan", "counter for cups", "counter"),
    please,
    T("and", "하고", "hago", "and / with", "and", { attach: true }),
    topic,
    yes,
    no,
    thanks,
  ],
  steps: [
    {
      id: "order",
      speaker: "바리스타 (barista)",
      line: { korean: "안녕하세요! 주문하시겠어요?", romanization: "annyeonghaseyo! jumunhasigesseoyo?", english: "Hello! Would you like to order?" },
      task: "Order a drink.",
      hint: "Drink (iced/hot first if you like) + how many (한 잔, 두 잔) + 주세요.",
      examples: ["아이스 아메리카노 주세요", "따뜻한 라떼 한 잔 주세요", "라떼 두 잔 주세요"],
      on: {
        order: {
          next: "more",
          reply: {
            korean: "네, {item이요}! 더 필요하신 건 없으세요?",
            romanization: "ne, {item이요}! deo piryohasin geon eopseuseyo?",
            english: "Sure, {item}! Would you like anything else?",
          },
        },
      },
    },
    {
      id: "more",
      speaker: "바리스타 (barista)",
      task: "Order another drink, or say that's all.",
      hint: "Order another drink with 주세요, or answer 아니요 or 네 to say that's all.",
      examples: ["물 주세요", "아니요", "네"],
      on: {
        order: {
          next: "thank",
          reply: { korean: "네, {item}도 준비해 드릴게요.", romanization: "ne, {item}do junbihae deurilgeyo.", english: "Okay, I'll make {item} too." },
        },
        no: {
          next: "thank",
          reply: { korean: "네, 준비해 드릴게요.", romanization: "ne, junbihae deurilgeyo.", english: "Okay, I'll prepare that for you." },
        },
        yes: {
          next: "thank",
          reply: { korean: "네, 준비해 드릴게요.", romanization: "ne, junbihae deurilgeyo.", english: "Okay, I'll prepare that for you." },
          note:
            "The question was negative (\"nothing else?\"), so 네 here means \"right, nothing else.\" " +
            "Many people also answer 아니요 (\"no, I'm fine\") — both work.",
        },
        thanks: {
          next: "done",
          reply: { korean: "감사합니다! 금방 나와요.", romanization: "gamsahamnida! geumbang nawayo.", english: "Thank you! It'll be ready soon." },
        },
      },
    },
    {
      id: "thank",
      speaker: "바리스타 (barista)",
      task: "Thank the barista.",
      hint: "감사합니다 (thank you).",
      examples: ["감사합니다"],
      on: {
        thanks: {
          next: "done",
          reply: { korean: "감사합니다! 금방 나와요.", romanization: "gamsahamnida! geumbang nawayo.", english: "Thank you! It'll be ready soon." },
        },
      },
    },
  ],
  completion: "You ordered drinks with the right counter, answered the barista, and finished politely.",
};

export const scenarios: Scenario[] = [restaurant, shopping, cafe];

export const findScenario = (id: string) => scenarios.find((scenario) => scenario.id === id);
