/*
  UNIT 3 CONTENT — Food and Dining
  ================================
  This file holds ALL the Korean words, phrases, conversations, and
  questions for the Food and Dining unit. It builds on the Greetings
  and Airport units (data/greetings.ts, data/airport.ts). The unit is
  split into short lessons (about 5–10 minutes each), and each lesson
  has its own block below. The app reads from here, so you can change
  the lessons without touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each word looks like this:
      { korean: "식당", romanization: "sikdang", english: "restaurant", emoji: "🍽️" },
  - To add a word, copy one whole line (from { to },) and paste it below.
    Aim for about 6–12 words per lesson so it stays short.
  - In a question, "answer" must match one of the "options" EXACTLY
    (same spaces, same punctuation).
  - Optional fields:
      say:     what the computer voice says instead of the Korean text
      example: a filled-in example for phrases with a blank ___
      hints:   a helpful hint shown when someone picks a wrong option

  This unit is listed in data/lessons.ts, which also describes the
  shape of this data for the computer. You don't need to edit that.
*/

import type {
  Unit,
  VocabularyItem,
  Speaker,
  ConversationLine,
  GrammarNote,
  ChoiceQuestion,
  GameStep,
} from "./lessons";

// ---------------------------------------------------------------
// WHO IS TALKING in the conversations and game
// ---------------------------------------------------------------
const speakers: Record<string, Speaker> = {
  traveler: { name: "Emma (traveler)", emoji: "🧳" },
  server: { name: "Server", emoji: "🧑‍🍳" },
  barista: { name: "Barista", emoji: "☕" },
};

// ===============================================================
// LESSON 1 — Getting a table
// ===============================================================
const lesson1Words: VocabularyItem[] = [
  { korean: "식당", romanization: "sikdang", english: "restaurant", emoji: "🍽️" },
  { korean: "예약(하다)", romanization: "yeyak(hada)", english: "reservation (to reserve)", emoji: "📅", say: "예약" },
  { korean: "앉다", romanization: "anda", english: "to sit", emoji: "🪑" },
  { korean: "식탁", romanization: "siktak", english: "table", emoji: "🟫" },
  { korean: "의자", romanization: "uija", english: "chair", emoji: "🪑" },
  { korean: "메뉴판", romanization: "menyupan", english: "menu", emoji: "📋" },
  { korean: "젓가락", romanization: "jeotgarak", english: "chopsticks", emoji: "🥢" },
  { korean: "숟가락", romanization: "sutgarak", english: "spoon", emoji: "🥄" },
  { korean: "포크", romanization: "pokeu", english: "fork", emoji: "🍴" },
  { korean: "칼", romanization: "kal", english: "knife", emoji: "🔪" },
  { korean: "그릇", romanization: "geureut", english: "bowl / dish", emoji: "🥣" },
  { korean: "냅킨", romanization: "naepkin", english: "napkin", emoji: "🧻" },
];

const lesson1Phrases: VocabularyItem[] = [
  { korean: "저기요!", romanization: "jeogiyo!", english: "Excuse me! (to get a server's attention)", emoji: "🙋" },
];

const lesson1Grammar: GrammarNote[] = [
  {
    title: "있어요 / 없어요 = \"there is\" / \"there isn't\"",
    explanation:
      "있어요 means \"there is\" or \"I have.\" 없어요 means \"there isn't\" or \"I don't have.\" " +
      "Put the thing first. To ask a question, just raise your voice at the end: \"___ 있어요?\" = \"Do you have ___?\"",
    examples: [
      { korean: "포크 있어요?", romanization: "pokeu isseoyo?", english: "Do you have a fork?" },
      { korean: "네, 있어요.", romanization: "ne, isseoyo.", english: "Yes, we do." },
      { korean: "예약 없어요.", romanization: "yeyak eopseoyo.", english: "I don't have a reservation." },
    ],
  },
];

const lesson1Conversation: ConversationLine[] = [
  { speaker: "server", korean: "어서 오세요!", romanization: "eoseo oseyo!", english: "Welcome!", emoji: "🙇" },
  { speaker: "server", korean: "몇 분이세요?", romanization: "myeot buniseyo?", english: "How many people?", emoji: "❓" },
  { speaker: "traveler", korean: "두 명이요.", romanization: "du myeongiyo.", english: "Two people. (You'll learn to count in Lesson 3.)", emoji: "✌️" },
  { speaker: "server", korean: "예약하셨어요?", romanization: "yeyakhasyeosseoyo?", english: "Did you make a reservation?", emoji: "📅" },
  { speaker: "traveler", korean: "아니요, 예약 없어요.", romanization: "aniyo, yeyak eopseoyo.", english: "No, I don't have a reservation.", emoji: "🙅" },
  { speaker: "server", korean: "괜찮아요. 여기 앉으세요.", romanization: "gwaenchanayo. yeogi anjeuseyo.", english: "That's okay. Please sit here.", emoji: "🪑" },
  { speaker: "traveler", korean: "저기요! 포크 있어요?", romanization: "jeogiyo! pokeu isseoyo?", english: "Excuse me! Do you have a fork?", emoji: "🍴" },
  { speaker: "server", korean: "네, 있어요.", romanization: "ne, isseoyo.", english: "Yes, we do.", emoji: "👍" },
];

const lesson1Missions: ChoiceQuestion[] = [
  {
    prompt: "🙋 You need the server's attention. What do you call out?",
    options: ["저기요!", "안녕히 계세요.", "죄송합니다."],
    answer: "저기요!",
    explanation: "저기요! is the polite way to call a server over. In Korea it's normal to call out — servers won't come by unless you do.",
    hints: {
      "안녕히 계세요.": "That's goodbye. You're not leaving yet!",
      "죄송합니다.": "That's \"I'm sorry.\" You just need their attention.",
    },
  },
  {
    prompt: "🍴 Chopsticks are hard! Ask if they have a fork.",
    options: ["포크 없어요.", "포크 있어요?", "칼 있어요?"],
    answer: "포크 있어요?",
    explanation: "포크 있어요? = Do you have a fork?",
    hints: {
      "포크 없어요.": "없어요 means \"there isn't one.\" You want to ask if there IS one.",
      "칼 있어요?": "칼 is a knife. Look for 포크.",
    },
  },
  {
    prompt: "📅 The server asks 예약하셨어요? You didn't book ahead. What do you say?",
    options: ["네, 있어요.", "아니요, 예약 없어요.", "저기요!"],
    answer: "아니요, 예약 없어요.",
    explanation: "아니요, 예약 없어요 = No, I don't have a reservation.",
    hints: {
      "네, 있어요.": "That says \"Yes, I have one.\" You didn't book!",
      "저기요!": "That calls the server over — but she's already here.",
    },
  },
  {
    prompt: "🥢 What do you use to pick up side dishes?",
    options: ["숟가락", "젓가락", "냅킨"],
    answer: "젓가락",
    explanation: "젓가락 = chopsticks. Koreans use a 숟가락 (spoon) for rice and soup.",
    hints: {
      "숟가락": "숟가락 is a spoon — for rice and soup.",
      "냅킨": "냅킨 is a napkin.",
    },
  },
  {
    prompt: "🪑 Which word is \"chair\"?",
    options: ["식탁", "그릇", "의자"],
    answer: "의자",
    explanation: "의자 = chair.",
    hints: {
      "식탁": "식탁 is the table.",
      "그릇": "그릇 is a bowl or dish.",
    },
  },
];

// ===============================================================
// LESSON 2 — What's on the menu?
// ===============================================================
const lesson2Words: VocabularyItem[] = [
  { korean: "음식", romanization: "eumsik", english: "food", emoji: "🍱" },
  { korean: "밥", romanization: "bap", english: "rice / a meal", emoji: "🍚" },
  { korean: "국", romanization: "guk", english: "soup", emoji: "🥣" },
  { korean: "찌개", romanization: "jjigae", english: "stew", emoji: "🍲" },
  { korean: "면", romanization: "myeon", english: "noodles", emoji: "🍜" },
  { korean: "반찬", romanization: "banchan", english: "side dishes", emoji: "🥬" },
  { korean: "불고기", romanization: "bulgogi", english: "bulgogi (marinated grilled beef)", emoji: "🥩" },
  { korean: "추천", romanization: "chucheon", english: "recommendation", emoji: "👍" },
];

const lesson2Phrases: VocabularyItem[] = [
  { korean: "이거 뭐예요?", romanization: "igeo mwoyeyo?", english: "What is this?", emoji: "👉❓" },
  { korean: "뭐가 맛있어요?", romanization: "mwoga masisseoyo?", english: "What's good here?", emoji: "🤔" },
  { korean: "추천해 주세요.", romanization: "chucheonhae juseyo.", english: "Please recommend something.", emoji: "👍" },
];

const lesson2Grammar: GrammarNote[] = [
  {
    title: "Verb + 주세요 = \"Please do ___ for me\"",
    explanation:
      "To ask someone to DO something for you, change the verb to its 아/어 form and add 주세요. " +
      "Verbs ending in 하다 change to 해: 추천하다 → 추천해 주세요.",
    examples: [
      { korean: "추천해 주세요.", romanization: "chucheonhae juseyo.", english: "Please recommend something. (추천하다 → 추천해)" },
      { korean: "도와주세요.", romanization: "dowajuseyo.", english: "Please help me. (돕다 → 도와)" },
      { korean: "여권 보여 주세요.", romanization: "yeogwon boyeo juseyo.", english: "Please show me your passport. (보다 → 보여) — from the Airport unit!" },
    ],
  },
];

const lesson2Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "저기요! 이거 뭐예요?", romanization: "jeogiyo! igeo mwoyeyo?", english: "Excuse me! What is this?", emoji: "👉📋" },
  { speaker: "server", korean: "김치찌개예요.", romanization: "gimchijjigaeyeyo.", english: "It's kimchi stew.", emoji: "🍲" },
  { speaker: "traveler", korean: "뭐가 맛있어요? 추천해 주세요.", romanization: "mwoga masisseoyo? chucheonhae juseyo.", english: "What's good here? Please recommend something.", emoji: "🤔" },
  { speaker: "server", korean: "불고기가 맛있어요.", romanization: "bulgogiga masisseoyo.", english: "The bulgogi is good.", emoji: "🥩" },
  { speaker: "traveler", korean: "좋아요!", romanization: "joayo!", english: "Sounds good!", emoji: "😄" },
];

const lesson2Missions: ChoiceQuestion[] = [
  {
    prompt: "🍲 You see a bubbling pot on the menu. Which word is \"stew\"?",
    options: ["국", "찌개", "면"],
    answer: "찌개",
    explanation: "찌개 = stew. It's thicker than 국 (soup).",
    hints: {
      "국": "국 is soup — thinner than stew.",
      "면": "면 is noodles.",
    },
  },
  {
    prompt: "🤔 You can't decide what to eat. Ask the server to recommend something.",
    options: ["이거 뭐예요?", "추천해 주세요.", "저기요!"],
    answer: "추천해 주세요.",
    explanation: "추천해 주세요 = Please recommend something.",
    hints: {
      "이거 뭐예요?": "That asks \"What is this?\" You want a recommendation.",
      "저기요!": "That gets the server's attention. Now ask for a recommendation!",
    },
  },
  {
    prompt: "👉 You point at a dish you don't recognize. Ask what it is.",
    options: ["뭐가 맛있어요?", "추천해 주세요.", "이거 뭐예요?"],
    answer: "이거 뭐예요?",
    explanation: "이거 = this, 뭐예요? = what is it?",
    hints: {
      "뭐가 맛있어요?": "That asks what's good. You want to know what THIS dish is.",
      "추천해 주세요.": "That asks for a recommendation. You want to know what THIS dish is.",
    },
  },
  {
    prompt: "🥬 Small free dishes like kimchi come with your meal. What are they called?",
    options: ["반찬", "밥", "음식"],
    answer: "반찬",
    explanation: "반찬 = side dishes. They're free, and you can usually ask for more!",
    hints: {
      "밥": "밥 is rice.",
      "음식": "음식 means food in general.",
    },
  },
  {
    prompt: "🍚 Which word is \"rice\"?",
    options: ["면", "밥", "국"],
    answer: "밥",
    explanation: "밥 = rice. It can also mean \"a meal\" in general.",
    hints: {
      "면": "면 is noodles.",
      "국": "국 is soup.",
    },
  },
];

// ===============================================================
// LESSON 3 — Ordering
// ===============================================================
const lesson3Words: VocabularyItem[] = [
  { korean: "주문(하다)", romanization: "jumun(hada)", english: "order (to order)", emoji: "📝", say: "주문" },
  { korean: "주다", romanization: "juda", english: "to give", emoji: "🤲" },
  { korean: "하나", romanization: "hana", english: "one (한 before a counter)", emoji: "1️⃣" },
  { korean: "둘", romanization: "dul", english: "two (두 before a counter)", emoji: "2️⃣" },
  { korean: "셋", romanization: "set", english: "three (세 before a counter)", emoji: "3️⃣" },
  { korean: "개", romanization: "gae", english: "counter for things (items)", emoji: "📦" },
  { korean: "잔", romanization: "jan", english: "counter for cups / glasses", emoji: "🥛" },
  { korean: "명", romanization: "myeong", english: "counter for people", emoji: "👥" },
  {
    korean: "___인분",
    romanization: "___ inbun",
    english: "portion(s) / serving(s) for ___ people",
    emoji: "🍽️",
    example: { korean: "불고기 2인분 주세요.", romanization: "bulgogi i-inbun juseyo.", english: "Bulgogi for two, please." },
  },
  { korean: "물", romanization: "mul", english: "water", emoji: "💧" },
  { korean: "와인", romanization: "wain", english: "wine", emoji: "🍷" },
  { korean: "맥주", romanization: "maekju", english: "beer", emoji: "🍺" },
  { korean: "술", romanization: "sul", english: "alcohol / a drink", emoji: "🍶" },
];

const lesson3Phrases: VocabularyItem[] = [
  { korean: "주문할게요.", romanization: "jumunhalgeyo.", english: "I'd like to order.", emoji: "📝" },
  { korean: "이거 주세요.", romanization: "igeo juseyo.", english: "This one, please.", emoji: "👉" },
  { korean: "불고기 하나 주세요.", romanization: "bulgogi hana juseyo.", english: "One bulgogi, please.", emoji: "🥩" },
  { korean: "물 좀 주세요.", romanization: "mul jom juseyo.", english: "Some water, please.", emoji: "💧" },
];

const lesson3Grammar: GrammarNote[] = [
  {
    title: "Noun + 주세요 = \"___, please\"",
    explanation:
      "Say the thing you want, then 주세요 (\"please give me\"). " +
      "Adding 좀 (\"a little\") before 주세요 makes it sound softer and more polite.",
    examples: [
      { korean: "이거 주세요.", romanization: "igeo juseyo.", english: "This one, please." },
      { korean: "물 좀 주세요.", romanization: "mul jom juseyo.", english: "Some water, please." },
    ],
  },
  {
    title: "Noun + 하고 = \"___ and ___\"",
    explanation: "Put 하고 right after a noun to join it to the next one, like \"and.\"",
    examples: [
      { korean: "불고기하고 밥 주세요.", romanization: "bulgogihago bap juseyo.", english: "Bulgogi and rice, please." },
      { korean: "맥주하고 물 주세요.", romanization: "maekjuhago mul juseyo.", english: "Beer and water, please." },
    ],
  },
  {
    title: "Counting: thing + number + counter",
    explanation:
      "Korean counts with a counter word after the number: 개 for things, 잔 for cups, 명 for people. " +
      "Before a counter, 하나 → 한, 둘 → 두, 셋 → 세. " +
      "인분 (portions) is different: it uses the other Korean number system (the one for prices), " +
      "so learn it as set phrases: 1인분 (il-inbun), 2인분 (i-inbun), 3인분 (sam-inbun).",
    examples: [
      { korean: "커피 한 잔 주세요.", romanization: "keopi han jan juseyo.", english: "One cup of coffee, please. (하나 → 한)" },
      { korean: "두 명이요.", romanization: "du myeongiyo.", english: "Two people. (둘 → 두)" },
      { korean: "만두 세 개 주세요.", romanization: "mandu se gae juseyo.", english: "Three dumplings, please. (셋 → 세)" },
      { korean: "불고기 2인분 주세요.", romanization: "bulgogi i-inbun juseyo.", english: "Bulgogi for two, please." },
    ],
  },
];

const lesson3Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "저기요! 주문할게요.", romanization: "jeogiyo! jumunhalgeyo.", english: "Excuse me! I'd like to order.", emoji: "🙋" },
  { speaker: "server", korean: "네, 뭐 드릴까요?", romanization: "ne, mwo deurilkkayo?", english: "Yes, what can I get you?", emoji: "📝" },
  { speaker: "traveler", korean: "불고기 2인분 주세요.", romanization: "bulgogi i-inbun juseyo.", english: "Bulgogi for two, please.", emoji: "🥩" },
  { speaker: "server", korean: "음료는요?", romanization: "eumnyoneunyo?", english: "And to drink?", emoji: "🥤" },
  { speaker: "traveler", korean: "맥주 하나하고 물 두 잔 주세요.", romanization: "maekju hanahago mul du jan juseyo.", english: "One beer and two glasses of water, please.", emoji: "🍺💧" },
  { speaker: "server", korean: "네, 알겠습니다.", romanization: "ne, algetseumnida.", english: "Okay, got it.", emoji: "👍" },
];

const lesson3Missions: ChoiceQuestion[] = [
  {
    prompt: "🙋 You're ready. Tell the server you'd like to order.",
    options: ["주문할게요.", "추천해 주세요.", "이거 뭐예요?"],
    answer: "주문할게요.",
    explanation: "주문할게요 = I'd like to order.",
    hints: {
      "추천해 주세요.": "That asks for a recommendation. You already know what you want!",
      "이거 뭐예요?": "That asks what something is. You're ready to order.",
    },
  },
  {
    prompt: "👉 Point at a picture on the menu and say \"This one, please.\"",
    options: ["이거 뭐예요?", "이거 주세요.", "이거 있어요?"],
    answer: "이거 주세요.",
    explanation: "이거 (this) + 주세요 (please give me).",
    hints: {
      "이거 뭐예요?": "That asks \"What is this?\" You want to order it.",
      "이거 있어요?": "That asks \"Do you have this?\" Just ask for it with 주세요.",
    },
  },
  {
    prompt: "🍺🍺 Order two glasses of beer.",
    options: ["맥주 둘 잔 주세요.", "맥주 두 잔 주세요.", "맥주 두 명 주세요."],
    answer: "맥주 두 잔 주세요.",
    explanation: "둘 becomes 두 before a counter, and 잔 counts cups and glasses.",
    hints: {
      "맥주 둘 잔 주세요.": "Almost! Before a counter, 둘 changes to 두.",
      "맥주 두 명 주세요.": "명 counts people! Use 잔 for glasses.",
    },
  },
  {
    prompt: "👫 The server asks 몇 분이세요? You're with one friend.",
    options: ["두 잔이요.", "두 명이요.", "둘 명이요."],
    answer: "두 명이요.",
    explanation: "두 (two) + 명 (people).",
    hints: {
      "두 잔이요.": "잔 counts cups. Use 명 for people.",
      "둘 명이요.": "Almost! Before a counter, 둘 changes to 두.",
    },
  },
  {
    prompt: "🥩🍚 Order bulgogi AND rice.",
    options: ["불고기하고 밥 주세요.", "불고기는 밥 주세요.", "불고기 밥 있어요."],
    answer: "불고기하고 밥 주세요.",
    explanation: "하고 joins two nouns, like \"and.\"",
    hints: {
      "불고기는 밥 주세요.": "는 is the topic marker. To say \"and,\" use 하고.",
      "불고기 밥 있어요.": "That says \"There is bulgogi rice.\" You want to order.",
    },
  },
  {
    prompt: "💧 Ask for some water.",
    options: ["술 좀 주세요.", "물 좀 주세요.", "물 없어요."],
    answer: "물 좀 주세요.",
    explanation: "물 좀 주세요 = Some water, please.",
    hints: {
      "술 좀 주세요.": "Careful — 술 is alcohol! Water is 물.",
      "물 없어요.": "That says \"There's no water.\" Ask for some with 주세요.",
    },
  },
];

// ===============================================================
// LESSON 4 — Ingredients & allergies
// ===============================================================
const lesson4Words: VocabularyItem[] = [
  { korean: "고기", romanization: "gogi", english: "meat", emoji: "🍖" },
  { korean: "닭고기", romanization: "dakgogi", english: "chicken (닭 chicken + 고기 meat)", emoji: "🍗" },
  { korean: "돼지고기", romanization: "dwaejigogi", english: "pork (돼지 pig + 고기 meat)", emoji: "🐷" },
  { korean: "소고기", romanization: "sogogi", english: "beef (소 cow + 고기 meat)", emoji: "🐮" },
  { korean: "생선", romanization: "saengseon", english: "fish (as food)", emoji: "🐟" },
  { korean: "해산물", romanization: "haesanmul", english: "seafood", emoji: "🦐" },
  { korean: "채소", romanization: "chaeso", english: "vegetables", emoji: "🥦" },
  { korean: "과일", romanization: "gwail", english: "fruit", emoji: "🍎" },
  { korean: "계란", romanization: "gyeran", english: "egg", emoji: "🥚" },
  { korean: "치즈", romanization: "chijeu", english: "cheese", emoji: "🧀" },
  { korean: "알레르기", romanization: "allereugi", english: "allergy", emoji: "🤧" },
  { korean: "빼 주다", romanization: "ppae juda", english: "to leave out (for someone)", emoji: "🚫" },
];

const lesson4Phrases: VocabularyItem[] = [
  { korean: "고기 빼 주세요.", romanization: "gogi ppae juseyo.", english: "Please leave out the meat.", emoji: "🚫🍖" },
  {
    korean: "___ 알레르기 있어요.",
    romanization: "___ allereugi isseoyo.",
    english: "I'm allergic to ___.",
    emoji: "🤧",
    example: { korean: "해산물 알레르기 있어요.", romanization: "haesanmul allereugi isseoyo.", english: "I'm allergic to seafood." },
  },
];

const lesson4Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "저기요! 이거 뭐예요?", romanization: "jeogiyo! igeo mwoyeyo?", english: "Excuse me! What is this?", emoji: "👉" },
  { speaker: "server", korean: "비빔밥이에요. 채소하고 계란하고 소고기가 있어요.", romanization: "bibimbabieyo. chaesohago gyeranhago sogogiga isseoyo.", english: "It's bibimbap. It has vegetables, egg, and beef.", emoji: "🥗" },
  { speaker: "traveler", korean: "고기 빼 주세요.", romanization: "gogi ppae juseyo.", english: "Please leave out the meat.", emoji: "🚫🍖" },
  { speaker: "server", korean: "네. 알레르기 있어요?", romanization: "ne. allereugi isseoyo?", english: "Sure. Do you have any allergies?", emoji: "🤧" },
  { speaker: "traveler", korean: "네, 해산물 알레르기 있어요.", romanization: "ne, haesanmul allereugi isseoyo.", english: "Yes, I'm allergic to seafood.", emoji: "🦐" },
  { speaker: "server", korean: "해산물 없어요. 괜찮아요.", romanization: "haesanmul eopseoyo. gwaenchanayo.", english: "There's no seafood in it. It's fine.", emoji: "👍" },
];

const lesson4Missions: ChoiceQuestion[] = [
  {
    prompt: "🐷 Your friend doesn't eat pork. Which word should they look out for on the menu?",
    options: ["소고기", "돼지고기", "닭고기"],
    answer: "돼지고기",
    explanation: "돼지 (pig) + 고기 (meat) = 돼지고기, pork.",
    hints: {
      "소고기": "소 is cow — 소고기 is beef.",
      "닭고기": "닭 is chicken — 닭고기 is chicken meat.",
    },
  },
  {
    prompt: "🥦 You don't eat meat. Ask them to leave the meat out.",
    options: ["고기 주세요.", "고기 빼 주세요.", "고기 있어요."],
    answer: "고기 빼 주세요.",
    explanation: "빼 주세요 = please leave it out.",
    hints: {
      "고기 주세요.": "That asks FOR meat! Add 빼 to leave it out.",
      "고기 있어요.": "That says \"There is meat.\" Ask them to leave it out.",
    },
  },
  {
    prompt: "🦐 You're allergic to seafood. Tell the server.",
    options: ["해산물 주세요.", "생선 있어요?", "해산물 알레르기 있어요."],
    answer: "해산물 알레르기 있어요.",
    explanation: "해산물 (seafood) + 알레르기 있어요 (I have an allergy).",
    hints: {
      "해산물 주세요.": "That orders seafood — the opposite of what you want!",
      "생선 있어요?": "That asks if they have fish. Tell them about your allergy.",
    },
  },
  {
    prompt: "🐟 Which word is \"fish\" (as food)?",
    options: ["생선", "채소", "과일"],
    answer: "생선",
    explanation: "생선 = fish (as food).",
    hints: {
      "채소": "채소 is vegetables.",
      "과일": "과일 is fruit.",
    },
  },
  {
    prompt: "🥚 Bibimbap often has a fried ___ on top. Which word is \"egg\"?",
    options: ["치즈", "계란", "과일"],
    answer: "계란",
    explanation: "계란 = egg.",
    hints: {
      "치즈": "치즈 is cheese.",
      "과일": "과일 is fruit.",
    },
  },
];

// ===============================================================
// LESSON 5 — How does it taste?
// ===============================================================
const lesson5Words: VocabularyItem[] = [
  { korean: "맛있다", romanization: "masitda", english: "to be delicious (맛있어요 = it's good)", emoji: "😋" },
  { korean: "맵다", romanization: "maepda", english: "to be spicy (매워요 = it's spicy)", emoji: "🌶️" },
  { korean: "달다", romanization: "dalda", english: "to be sweet (달아요 = it's sweet)", emoji: "🍰" },
  { korean: "짜다", romanization: "jjada", english: "to be salty (짜요 = it's salty)", emoji: "🧂" },
  { korean: "뜨겁다", romanization: "tteugeopda", english: "to be hot (뜨거워요 = it's hot)", emoji: "🔥" },
  { korean: "차갑다", romanization: "chagapda", english: "to be cold (차가워요 = it's cold)", emoji: "🧊" },
  { korean: "배고프다", romanization: "baegopeuda", english: "to be hungry (배고파요 = I'm hungry)", emoji: "🤤" },
  { korean: "배부르다", romanization: "baebureuda", english: "to be full (배불러요 = I'm full)", emoji: "😌" },
  { korean: "소스", romanization: "soseu", english: "sauce", emoji: "🥫" },
  { korean: "설탕", romanization: "seoltang", english: "sugar", emoji: "🍬" },
  { korean: "도와주다", romanization: "dowajuda", english: "to help (도와주세요 = please help me)", emoji: "🆘" },
];

const lesson5Phrases: VocabularyItem[] = [
  { korean: "덜 맵게 해 주세요.", romanization: "deol maepge hae juseyo.", english: "Please make it less spicy.", emoji: "🌶️⬇️" },
  { korean: "매운 음식을 좋아하지 않아요.", romanization: "maeun eumsigeul joahaji anayo.", english: "I don't like spicy food.", emoji: "🙅🌶️" },
];

const lesson5Grammar: GrammarNote[] = [
  {
    title: "-지 않아요 = \"don't\" / \"isn't\"",
    explanation:
      "To say NOT, take the verb, drop 다, and add 지 않아요. " +
      "It works for actions (\"I don't like\") and descriptions (\"it isn't spicy\").",
    examples: [
      { korean: "좋아하지 않아요.", romanization: "joahaji anayo.", english: "I don't like it. (좋아하다 → 좋아하 + 지 않아요)" },
      { korean: "맵지 않아요.", romanization: "maepji anayo.", english: "It's not spicy. (맵다 → 맵 + 지 않아요)" },
      { korean: "달지 않아요.", romanization: "dalji anayo.", english: "It's not sweet. (달다 → 달 + 지 않아요)" },
    ],
  },
];

const lesson5Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "떡볶이 하나 주세요. 덜 맵게 해 주세요.", romanization: "tteokbokki hana juseyo. deol maepge hae juseyo.", english: "One tteokbokki, please. Please make it less spicy.", emoji: "🌶️" },
  { speaker: "server", korean: "매운 음식 좋아하지 않아요?", romanization: "maeun eumsik joahaji anayo?", english: "You don't like spicy food?", emoji: "❓" },
  { speaker: "traveler", korean: "네, 매운 음식을 좋아하지 않아요.", romanization: "ne, maeun eumsigeul joahaji anayo.", english: "Right, I don't like spicy food. (Answering a \"don't you?\" question, 네 means \"that's right.\")", emoji: "🙅" },
  { speaker: "server", korean: "맛있어요?", romanization: "masisseoyo?", english: "Is it good?", emoji: "😋" },
  { speaker: "traveler", korean: "네, 맛있어요! 그런데 좀 뜨거워요.", romanization: "ne, masisseoyo! geureonde jom tteugeowoyo.", english: "Yes, it's delicious! But it's a little hot. (그런데 = but)", emoji: "🔥" },
  { speaker: "traveler", korean: "아, 배불러요!", romanization: "a, baebulleoyo!", english: "Ah, I'm full!", emoji: "😌" },
];

const lesson5Missions: ChoiceQuestion[] = [
  {
    prompt: "🌶️ Your mouth is on fire! Which word means \"spicy\"?",
    options: ["달다", "맵다", "짜다"],
    answer: "맵다",
    explanation: "맵다 = to be spicy. (매워요 = It's spicy.)",
    hints: {
      "달다": "달다 means sweet.",
      "짜다": "짜다 means salty.",
    },
  },
  {
    prompt: "😋 The server asks 맛있어요? You love it.",
    options: ["네, 맛있어요!", "아니요, 배고파요.", "짜요."],
    answer: "네, 맛있어요!",
    explanation: "네, 맛있어요! = Yes, it's delicious!",
    hints: {
      "아니요, 배고파요.": "That's \"No, I'm hungry.\" You love the food!",
      "짜요.": "That means \"It's salty.\" Tell them it's delicious.",
    },
  },
  {
    prompt: "🥵 You can't handle much spice. Ask them to make it less spicy.",
    options: ["맵게 해 주세요.", "덜 맵게 해 주세요.", "매운 음식 주세요."],
    answer: "덜 맵게 해 주세요.",
    explanation: "덜 = less. 덜 맵게 해 주세요 = Please make it less spicy.",
    hints: {
      "맵게 해 주세요.": "Careful! Without 덜 (less), that asks them to make it spicy!",
      "매운 음식 주세요.": "That asks for spicy food. You want LESS spicy.",
    },
  },
  {
    prompt: "🍰 Your friend asks if the cake is sweet. It isn't. Say \"It's not sweet.\"",
    options: ["달아요.", "달지 않아요.", "짜지 않아요."],
    answer: "달지 않아요.",
    explanation: "달다 → 달 + 지 않아요 = It's not sweet.",
    hints: {
      "달아요.": "That says \"It's sweet.\" Add 지 않아요 to say NOT.",
      "짜지 않아요.": "That says \"It's not salty.\" Use 달다 (sweet).",
    },
  },
  {
    prompt: "🍽️ You ate everything. Which word means \"to be full\"?",
    options: ["배고프다", "배부르다", "차갑다"],
    answer: "배부르다",
    explanation: "배부르다 = to be full. (배불러요 = I'm full.)",
    hints: {
      "배고프다": "That's the opposite — 배고프다 means hungry.",
      "차갑다": "차갑다 means cold.",
    },
  },
];

// ===============================================================
// LESSON 6 — At the café
// ===============================================================
const lesson6Words: VocabularyItem[] = [
  { korean: "카페", romanization: "kape", english: "café", emoji: "🏠☕" },
  { korean: "커피", romanization: "keopi", english: "coffee", emoji: "☕" },
  { korean: "아메리카노", romanization: "amerikano", english: "americano", emoji: "☕" },
  { korean: "라떼", romanization: "latte", english: "latte", emoji: "🥛☕" },
  { korean: "주스", romanization: "juseu", english: "juice", emoji: "🧃" },
  { korean: "차", romanization: "cha", english: "tea", emoji: "🍵" },
  { korean: "아이스", romanization: "aiseu", english: "iced", emoji: "🧊" },
  { korean: "따뜻한", romanization: "ttatteutan", english: "hot / warm (drink)", emoji: "♨️" },
  { korean: "디카페인", romanization: "dikapein", english: "decaf", emoji: "🌙" },
  { korean: "얼음", romanization: "eoreum", english: "ice", emoji: "🧊" },
  { korean: "빨대", romanization: "ppaldae", english: "straw", emoji: "🥤" },
  { korean: "사이즈", romanization: "saijeu", english: "size", emoji: "📏" },
];

const lesson6Phrases: VocabularyItem[] = [
  { korean: "커피 한 잔 주세요.", romanization: "keopi han jan juseyo.", english: "One coffee, please.", emoji: "☕" },
];

const lesson6Conversation: ConversationLine[] = [
  { speaker: "barista", korean: "어서 오세요. 주문하시겠어요?", romanization: "eoseo oseyo. jumunhasigesseoyo?", english: "Welcome. Are you ready to order?", emoji: "👋" },
  { speaker: "traveler", korean: "아이스 아메리카노 한 잔 주세요.", romanization: "aiseu amerikano han jan juseyo.", english: "One iced americano, please.", emoji: "🧊☕" },
  { speaker: "barista", korean: "사이즈는요?", romanization: "saijeuneunyo?", english: "What size?", emoji: "📏" },
  { speaker: "traveler", korean: "큰 거 주세요.", romanization: "keun geo juseyo.", english: "A large one, please. (큰 거 = the big one)", emoji: "⬆️" },
  { speaker: "traveler", korean: "그리고 따뜻한 라떼 한 잔 주세요.", romanization: "geurigo ttatteutan latte han jan juseyo.", english: "And one hot latte, please. (그리고 = and also)", emoji: "♨️🥛" },
  { speaker: "traveler", korean: "빨대 있어요?", romanization: "ppaldae isseoyo?", english: "Do you have straws?", emoji: "🥤" },
  { speaker: "barista", korean: "네, 저기 있어요.", romanization: "ne, jeogi isseoyo.", english: "Yes, they're over there.", emoji: "👉" },
];

const lesson6Missions: ChoiceQuestion[] = [
  {
    prompt: "☀️ It's a hot day. Order one iced americano.",
    options: ["따뜻한 아메리카노 한 잔 주세요.", "아이스 아메리카노 한 잔 주세요.", "아이스 아메리카노 한 명 주세요."],
    answer: "아이스 아메리카노 한 잔 주세요.",
    explanation: "아이스 = iced, 한 잔 = one cup.",
    hints: {
      "따뜻한 아메리카노 한 잔 주세요.": "따뜻한 means hot. You want it iced!",
      "아이스 아메리카노 한 명 주세요.": "명 counts people! Use 잔 for cups.",
    },
  },
  {
    prompt: "🌙 It's late and you don't want caffeine. Which word do you need?",
    options: ["아이스", "디카페인", "사이즈"],
    answer: "디카페인",
    explanation: "디카페인 = decaf.",
    hints: {
      "아이스": "아이스 means iced — it still has caffeine!",
      "사이즈": "사이즈 means size.",
    },
  },
  {
    prompt: "🥤 Ask if they have straws.",
    options: ["얼음 있어요?", "빨대 있어요?", "설탕 있어요?"],
    answer: "빨대 있어요?",
    explanation: "빨대 = straw.",
    hints: {
      "얼음 있어요?": "얼음 is ice.",
      "설탕 있어요?": "설탕 is sugar.",
    },
  },
  {
    prompt: "🍵 Which word is \"tea\"?",
    options: ["주스", "차", "커피"],
    answer: "차",
    explanation: "차 = tea. (Fun fact: 차 also means car!)",
    hints: {
      "주스": "주스 is juice.",
      "커피": "커피 is coffee.",
    },
  },
  {
    prompt: "❄️ It's a cold morning. Order a hot latte.",
    options: ["아이스 라떼 주세요.", "따뜻한 라떼 주세요.", "따뜻한 차 주세요."],
    answer: "따뜻한 라떼 주세요.",
    explanation: "따뜻한 = hot / warm.",
    hints: {
      "아이스 라떼 주세요.": "아이스 means iced. Brr! You want it hot.",
      "따뜻한 차 주세요.": "차 is tea. You want a latte.",
    },
  },
];

// ===============================================================
// LESSON 7 — To go & paying
// ===============================================================
const lesson7Words: VocabularyItem[] = [
  { korean: "테이크아웃", romanization: "teikeuaut", english: "takeout / to go", emoji: "🥡" },
  { korean: "포장", romanization: "pojang", english: "to go (literally \"wrapping\")", emoji: "🛍️" },
  { korean: "매장", romanization: "maejang", english: "in the store / for here", emoji: "🪑" },
  { korean: "영수증", romanization: "yeongsujeung", english: "receipt", emoji: "🧾" },
  {
    korean: "원",
    romanization: "won",
    english: "won (Korean money) — prices look like 4,500원",
    emoji: "💰",
  },
];

const lesson7Phrases: VocabularyItem[] = [
  { korean: "이거 얼마예요?", romanization: "igeo eolmayeyo?", english: "How much is this?", emoji: "🏷️" },
  { korean: "카드 돼요?", romanization: "kadeu dwaeyo?", english: "Can I pay by card?", emoji: "💳" },
];

const lesson7Conversation: ConversationLine[] = [
  { speaker: "barista", korean: "매장에서 드세요? 포장이세요?", romanization: "maejangeseo deuseyo? pojangiseyo?", english: "For here, or to go?", emoji: "🪑🥡" },
  { speaker: "traveler", korean: "포장이요.", romanization: "pojangiyo.", english: "To go, please.", emoji: "🥡" },
  { speaker: "traveler", korean: "이거 얼마예요?", romanization: "igeo eolmayeyo?", english: "How much is this?", emoji: "🏷️" },
  { speaker: "barista", korean: "9,500원이에요.", romanization: "gucheon-obaek wonieyo.", english: "It's 9,500 won.", emoji: "💰" },
  { speaker: "traveler", korean: "카드 돼요?", romanization: "kadeu dwaeyo?", english: "Can I pay by card?", emoji: "💳" },
  { speaker: "barista", korean: "네, 돼요. 영수증 드릴까요?", romanization: "ne, dwaeyo. yeongsujeung deurilkkayo?", english: "Yes, you can. Would you like a receipt?", emoji: "🧾" },
  { speaker: "traveler", korean: "아니요, 괜찮아요.", romanization: "aniyo, gwaenchanayo.", english: "No, that's okay. (괜찮아요 = it's okay / no thanks)", emoji: "🙅" },
];

const lesson7Missions: ChoiceQuestion[] = [
  {
    prompt: "🥡 You want your coffee to go. Which word do you say?",
    options: ["포장", "매장", "영수증"],
    answer: "포장",
    explanation: "포장 = to go. (테이크아웃 works too!)",
    hints: {
      "매장": "매장 means for here — in the store.",
      "영수증": "영수증 is a receipt.",
    },
  },
  {
    prompt: "🪑 You'll drink your coffee at a table in the café. Which word means \"for here\"?",
    options: ["테이크아웃", "매장", "포장"],
    answer: "매장",
    explanation: "매장 = in the store / for here.",
    hints: {
      "테이크아웃": "테이크아웃 means to go.",
      "포장": "포장 means to go.",
    },
  },
  {
    prompt: "💳 You only have a credit card. Ask if it's accepted.",
    options: ["카드 주세요.", "카드 있어요.", "카드 돼요?"],
    answer: "카드 돼요?",
    explanation: "카드 돼요? = Can I pay by card? (literally \"Does card work?\")",
    hints: {
      "카드 주세요.": "That asks them to give YOU a card.",
      "카드 있어요.": "That says \"I have a card.\" Ask if you can pay with it.",
    },
  },
  {
    prompt: "🏷️ There's no price on the menu. Ask how much it is.",
    options: ["이거 뭐예요?", "이거 얼마예요?", "이거 주세요."],
    answer: "이거 얼마예요?",
    explanation: "얼마 = how much.",
    hints: {
      "이거 뭐예요?": "That asks \"What is this?\" You want the price.",
      "이거 주세요.": "That orders it. Ask the price first!",
    },
  },
  {
    prompt: "🧾 The barista asks 영수증 드릴까요? What is she offering you?",
    options: ["a straw", "a receipt", "a bag"],
    answer: "a receipt",
    explanation: "영수증 = receipt.",
    hints: {
      "a straw": "A straw is 빨대.",
      "a bag": "Listen for 영수증 — that's a receipt.",
    },
  },
  {
    prompt: "💰 The sign says 아메리카노 4,500원. What does 원 mean?",
    options: ["won (Korean money)", "one cup", "iced"],
    answer: "won (Korean money)",
    explanation: "원 = won, Korean money. 4,500원 = 4,500 won.",
    hints: {
      "one cup": "One cup is 한 잔.",
      "iced": "Iced is 아이스.",
    },
  },
];

// ===============================================================
// LESSON 8 — GAME: dinner and coffee in Seoul
// Each step: a situation, (optional) what someone says to you,
// then the options to choose from.
// ===============================================================
const gameSteps: GameStep[] = [
  {
    place: "🚪 Restaurant door",
    speaker: "server",
    line: { korean: "어서 오세요! 몇 분이세요?", romanization: "eoseo oseyo! myeot buniseyo?", english: "Welcome! How many people?" },
    prompt: "You're with one friend.",
    options: ["두 잔이요.", "두 명이요.", "둘 명이요."],
    answer: "두 명이요.",
    explanation: "두 (two) + 명 (people). The server smiles.",
    hints: {
      "두 잔이요.": "잔 counts cups. Use 명 for people.",
      "둘 명이요.": "Almost! Before a counter, 둘 changes to 두.",
    },
  },
  {
    place: "🚪 Restaurant door",
    speaker: "server",
    line: { korean: "예약하셨어요?", romanization: "yeyakhasyeosseoyo?", english: "Did you make a reservation?" },
    prompt: "You didn't book ahead.",
    options: ["네, 있어요.", "아니요, 예약 없어요.", "저기요!"],
    answer: "아니요, 예약 없어요.",
    explanation: "No problem — there's a free table.",
    hints: {
      "네, 있어요.": "That says you DO have a reservation. You don't!",
      "저기요!": "The server is already talking to you. Answer her question.",
    },
  },
  {
    place: "🪑 Your table",
    speaker: "server",
    line: { korean: "여기 앉으세요.", romanization: "yeogi anjeuseyo.", english: "Please sit here." },
    prompt: "What does the server want you to do?",
    options: ["Wait outside", "Sit down here", "Pay first"],
    answer: "Sit down here",
    explanation: "앉으세요 comes from 앉다 (to sit). You sit at the 식탁.",
    hints: {
      "Wait outside": "Listen for 앉으세요 — from 앉다, to sit.",
      "Pay first": "In Korean restaurants you usually pay at the end. Listen for 앉다 (to sit).",
    },
  },
  {
    place: "📋 Reading the menu",
    prompt: "Your friend doesn't eat pork. Which word should they look out for?",
    options: ["소고기", "닭고기", "돼지고기"],
    answer: "돼지고기",
    explanation: "돼지 (pig) + 고기 (meat). Your friend avoids those dishes.",
    hints: {
      "소고기": "소고기 is beef.",
      "닭고기": "닭고기 is chicken.",
    },
  },
  {
    place: "🙋 Calling the server",
    prompt: "You're ready, but the server is across the room. Call her over.",
    options: ["안녕히 가세요.", "저기요!", "죄송합니다."],
    answer: "저기요!",
    explanation: "She comes right over.",
    hints: {
      "안녕히 가세요.": "That's goodbye!",
      "죄송합니다.": "That's an apology. Use 저기요! to get her attention.",
    },
  },
  {
    place: "🤔 Choosing",
    prompt: "You don't know what to get. Ask what's good.",
    options: ["뭐가 맛있어요?", "카드 돼요?", "이거 얼마예요?"],
    answer: "뭐가 맛있어요?",
    explanation: "\"불고기가 맛있어요!\" (The bulgogi is good!)",
    hints: {
      "카드 돼요?": "That's about paying. Ask what's good first!",
      "이거 얼마예요?": "That asks the price. Ask what's good.",
    },
  },
  {
    place: "📝 Ordering",
    prompt: "Order bulgogi for two people.",
    options: ["불고기 2인분 주세요.", "불고기 두 명 주세요.", "불고기 두 잔 주세요."],
    answer: "불고기 2인분 주세요.",
    explanation: "2인분 (i-inbun) = portions for two.",
    hints: {
      "불고기 두 명 주세요.": "That orders two PEOPLE of bulgogi! Use 인분 for portions.",
      "불고기 두 잔 주세요.": "잔 counts cups. Use 인분 for portions of food.",
    },
  },
  {
    place: "📝 Ordering",
    speaker: "server",
    line: { korean: "김치찌개는 좀 매워요.", romanization: "gimchijjigaeneun jom maewoyo.", english: "The kimchi stew is a little spicy." },
    prompt: "You want the kimchi stew too, but less spicy.",
    options: ["맵게 해 주세요.", "덜 맵게 해 주세요.", "매운 음식을 좋아해요."],
    answer: "덜 맵게 해 주세요.",
    explanation: "덜 = less. The kitchen makes it milder.",
    hints: {
      "맵게 해 주세요.": "Without 덜 (less), that asks them to make it spicy!",
      "매운 음식을 좋아해요.": "That says you LIKE spicy food.",
    },
  },
  {
    place: "💧 Waiting for food",
    prompt: "You're thirsty. Ask for some water.",
    options: ["물 좀 주세요.", "술 좀 주세요.", "물 없어요."],
    answer: "물 좀 주세요.",
    explanation: "The server brings water. 💧",
    hints: {
      "술 좀 주세요.": "Careful — 술 is alcohol! Water is 물.",
      "물 없어요.": "That says \"There's no water.\"",
    },
  },
  {
    place: "😋 Eating",
    speaker: "server",
    line: { korean: "맛있어요?", romanization: "masisseoyo?", english: "Is it good?" },
    prompt: "You love it!",
    options: ["네, 맛있어요!", "아니요, 배고파요.", "차가워요."],
    answer: "네, 맛있어요!",
    explanation: "The server is happy. You eat until you're 배불러요 (full)!",
    hints: {
      "아니요, 배고파요.": "That's \"No, I'm hungry.\"",
      "차가워요.": "That means \"It's cold.\" Tell her it's delicious!",
    },
  },
  {
    place: "💳 Paying",
    prompt: "You only have a card. Ask if you can pay by card.",
    options: ["카드 주세요.", "카드 돼요?", "이거 뭐예요?"],
    answer: "카드 돼요?",
    explanation: "\"네, 돼요.\" (Yes, you can.) Dinner is done! 🍽️",
    hints: {
      "카드 주세요.": "That asks them to give YOU a card.",
      "이거 뭐예요?": "That asks what something is. Ask about paying by card.",
    },
  },
  {
    place: "☕ Café counter",
    speaker: "barista",
    line: { korean: "어서 오세요. 주문하시겠어요?", romanization: "eoseo oseyo. jumunhasigesseoyo?", english: "Welcome. Are you ready to order?" },
    prompt: "It's a hot day. Order one iced americano.",
    options: ["아이스 아메리카노 한 잔 주세요.", "따뜻한 아메리카노 한 잔 주세요.", "아이스 아메리카노 한 명 주세요."],
    answer: "아이스 아메리카노 한 잔 주세요.",
    explanation: "아이스 = iced, 한 잔 = one cup.",
    hints: {
      "따뜻한 아메리카노 한 잔 주세요.": "따뜻한 means hot. It's a hot day!",
      "아이스 아메리카노 한 명 주세요.": "명 counts people. Use 잔 for cups.",
    },
  },
  {
    place: "☕ Café counter",
    speaker: "barista",
    line: { korean: "매장에서 드세요? 포장이세요?", romanization: "maejangeseo deuseyo? pojangiseyo?", english: "For here, or to go?" },
    prompt: "You want to drink it while you walk around the city.",
    options: ["매장이요.", "포장이요.", "영수증이요."],
    answer: "포장이요.",
    explanation: "포장 = to go. 🥡",
    hints: {
      "매장이요.": "매장 means for here. You want to walk around!",
      "영수증이요.": "영수증 is a receipt. Is it for here or to go?",
    },
  },
  {
    place: "☕ Café counter",
    speaker: "barista",
    line: { korean: "4,500원이에요. 영수증 드릴까요?", romanization: "sacheon-obaek wonieyo. yeongsujeung deurilkkayo?", english: "That's 4,500 won. Would you like a receipt?" },
    prompt: "You don't need a receipt.",
    options: ["네, 주세요.", "아니요, 괜찮아요.", "이거 얼마예요?"],
    answer: "아니요, 괜찮아요.",
    explanation: "You take your iced americano and head out. ☀️",
    hints: {
      "네, 주세요.": "That says \"Yes, please.\" You don't need one.",
      "이거 얼마예요?": "She already told you: 4,500원!",
    },
  },
];

// Review: the app speaks the Korean; the learner picks the English.
const listeningQuestions: ChoiceQuestion[] = [
  { prompt: "물", options: ["water", "alcohol", "rice"], answer: "water" },
  { prompt: "젓가락", options: ["spoon", "chopsticks", "fork"], answer: "chopsticks" },
  { prompt: "맵다", options: ["salty", "sweet", "spicy"], answer: "spicy" },
  { prompt: "돼지고기", options: ["pork", "beef", "chicken"], answer: "pork" },
  { prompt: "영수증", options: ["receipt", "straw", "menu"], answer: "receipt" },
  { prompt: "포장", options: ["for here", "to go", "size"], answer: "to go" },
  { prompt: "추천해 주세요.", options: ["What is this?", "Please recommend something.", "This one, please."], answer: "Please recommend something." },
  { prompt: "고기 빼 주세요.", options: ["Please leave out the meat.", "Meat, please.", "Is there meat?"], answer: "Please leave out the meat." },
  { prompt: "카드 돼요?", options: ["How much is this?", "Do you have a card?", "Can I pay by card?"], answer: "Can I pay by card?" },
];

// ===============================================================
// THE WHOLE UNIT (puts the lessons above together)
// ===============================================================
export const foodUnit: Unit = {
  id: "food",
  title: "Food and Dining",
  description: "Order a meal, ask about the food, and get coffee to go.",
  icon: "🍜",
  image: "/units/food.svg",
  color: "#f28c28",

  lessons: [
    {
      id: "food-1",
      title: "Getting a table",
      description: "Get a table, call the server, and ask for a fork.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Getting a table",
            intro: "Emma and a friend walk into a restaurant in Seoul. Tap \"Next line\" to follow along, and tap any Korean to hear it.",
            conversation: lesson1Conversation,
            words: lesson1Words,
            phrases: lesson1Phrases,
            grammar: lesson1Grammar,
            missions: lesson1Missions,
          },
        ],
      },
    },
    {
      id: "food-2",
      title: "What's on the menu?",
      description: "Rice, soup, stew, noodles — and asking what's good.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "What's on the menu?",
            intro: "Emma doesn't know some of the dishes. Listen to how she asks.",
            conversation: lesson2Conversation,
            words: lesson2Words,
            phrases: lesson2Phrases,
            grammar: lesson2Grammar,
            missions: lesson2Missions,
          },
        ],
      },
    },
    {
      id: "food-3",
      title: "Ordering",
      description: "Order food and drinks, and count how many you want.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Ordering",
            intro: "Emma is ready to order. Listen for the numbers.",
            conversation: lesson3Conversation,
            words: lesson3Words,
            phrases: lesson3Phrases,
            grammar: lesson3Grammar,
            missions: lesson3Missions,
          },
        ],
      },
    },
    {
      id: "food-4",
      title: "Ingredients & allergies",
      description: "Meat, fish, and vegetables — and asking to leave something out.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Ingredients & allergies",
            intro: "Emma wants bibimbap, but without meat — and she's allergic to seafood.",
            conversation: lesson4Conversation,
            words: lesson4Words,
            phrases: lesson4Phrases,
            grammar: [],
            missions: lesson4Missions,
          },
        ],
      },
    },
    {
      id: "food-5",
      title: "How does it taste?",
      description: "Spicy, sweet, salty — and saying what you don't like.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "How does it taste?",
            intro: "Emma orders tteokbokki, a spicy rice cake dish. Can she handle the heat?",
            conversation: lesson5Conversation,
            words: lesson5Words,
            phrases: lesson5Phrases,
            grammar: lesson5Grammar,
            missions: lesson5Missions,
          },
        ],
      },
    },
    {
      id: "food-6",
      title: "At the café",
      description: "Order coffee or tea, iced or hot.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "At the café",
            intro: "After lunch, Emma stops at a café.",
            conversation: lesson6Conversation,
            words: lesson6Words,
            phrases: lesson6Phrases,
            grammar: [],
            missions: lesson6Missions,
          },
        ],
      },
    },
    {
      id: "food-7",
      title: "To go & paying",
      description: "For here or to go, prices, paying by card, and receipts.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "To go & paying",
            intro: "Emma's coffee is ready. Time to pay.",
            conversation: lesson7Conversation,
            words: lesson7Words,
            phrases: lesson7Phrases,
            grammar: [],
            missions: lesson7Missions,
          },
        ],
      },
    },
    {
      id: "food-8",
      title: "Game: Dinner & coffee",
      description: "Use everything you've learned to eat out and grab a coffee.",
      sections: {
        speakers: speakers,
        study: [],
        game: {
          title: "Dinner and coffee in Seoul",
          intro: "You and a friend are hungry in Seoul 🇰🇷. Get a table, order a meal, pay, then grab a coffee to go. Pick the right Korean at each step!",
          steps: gameSteps,
          finish: "You ate a Korean meal and ordered coffee to go — all in Korean! 🍽️☕",
        },
        review: {
          title: "Review",
          flashcards: [
            ...lesson1Words, ...lesson1Phrases,
            ...lesson2Words, ...lesson2Phrases,
            ...lesson3Words, ...lesson3Phrases,
            ...lesson4Words, ...lesson4Phrases,
            ...lesson5Words, ...lesson5Phrases,
            ...lesson6Words, ...lesson6Phrases,
            ...lesson7Words, ...lesson7Phrases,
          ],
          listening: listeningQuestions,
        },
      },
    },
  ],
};
