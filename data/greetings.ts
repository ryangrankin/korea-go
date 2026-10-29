/*
  UNIT 1 CONTENT — Greetings
  ==========================
  This file holds ALL the Korean words, phrases, conversations, and
  questions for the Greetings unit. The unit is split into short
  lessons (about 5–10 minutes each), and each lesson has its own
  block below. The app reads from here, so you can change the
  lessons without touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each word looks like this:
      { korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  - To add a word, copy one whole line (from { to },) and paste it below.
    Aim for about 6–12 words and phrases per lesson so it stays short.
  - In a question, "answer" must match one of the "options" EXACTLY
    (same spaces, same punctuation).
  - Optional fields:
      say:     what the computer voice says instead of the Korean text
               (used for phrases with a blank ___)
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
  staff: { name: "Airport staff", emoji: "👩‍✈️" },
  friend: { name: "Minjun (new friend)", emoji: "🙂" },
};

// ===============================================================
// LESSON 1 — Hello & goodbye
// ===============================================================
const lesson1Words: VocabularyItem[] = [
  { korean: "네", romanization: "ne", english: "yes", emoji: "👍" },
  { korean: "아니요", romanization: "aniyo", english: "no", emoji: "🙅" },
];

const lesson1Phrases: VocabularyItem[] = [
  { korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye (said to the person who is LEAVING).", emoji: "🚶‍♀️👋" },
  { korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye (said to the person who is STAYING).", emoji: "🧍👋" },
  { korean: "죄송합니다.", romanization: "joesonghamnida.", english: "I'm sorry.", emoji: "🙇" },
];

const lesson1Conversation: ConversationLine[] = [
  { speaker: "staff", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye. (Emma is leaving; the staff member stays.)", emoji: "🧍👋" },
  { speaker: "staff", korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye. (The staff member stays; Emma is leaving.)", emoji: "🚶‍♀️👋" },
];

const lesson1Missions: ChoiceQuestion[] = [
  {
    prompt: "👩‍✈️ You walk up to the airport information desk. Say hello.",
    options: ["안녕히 가세요.", "안녕하세요.", "죄송합니다."],
    answer: "안녕하세요.",
    explanation: "안녕하세요 is the all-purpose polite \"hello.\"",
    hints: {
      "안녕히 가세요.": "That one is a goodbye. You're just arriving!",
      "죄송합니다.": "That means \"I'm sorry.\" Try a greeting.",
    },
  },
  {
    prompt: "🧍➡️🚶‍♀️ You are LEAVING the info desk. The staff member is STAYING at the desk. Say goodbye.",
    options: ["안녕히 가세요.", "안녕히 계세요.", "안녕하세요."],
    answer: "안녕히 계세요.",
    explanation: "계세요 comes from \"to stay.\" You say 안녕히 계세요 (\"stay well\") to the person who stays behind.",
    hints: {
      "안녕히 가세요.": "가세요 means \"go.\" You'd say that to someone who is leaving — but YOU are the one leaving.",
      "안녕하세요.": "That's \"hello.\" You need a goodbye.",
    },
  },
  {
    prompt: "🚶‍♀️ The staff member's shift is over and SHE is leaving. You are STAYING in the waiting area. Say goodbye.",
    options: ["안녕히 계세요.", "죄송합니다.", "안녕히 가세요."],
    answer: "안녕히 가세요.",
    explanation: "가세요 comes from \"to go.\" You say 안녕히 가세요 (\"go well\") to the person who is leaving.",
    hints: {
      "안녕히 계세요.": "계세요 means \"stay.\" She isn't staying — she's leaving.",
      "죄송합니다.": "That means \"I'm sorry.\" You need a goodbye.",
    },
  },
  {
    prompt: "💥 You accidentally bump into someone with your suitcase.",
    options: ["죄송합니다.", "안녕하세요.", "네."],
    answer: "죄송합니다.",
    explanation: "죄송합니다 = I'm sorry (polite).",
    hints: {
      "안녕하세요.": "That's \"hello.\" You need an apology.",
      "네.": "That means \"yes.\" You need an apology.",
    },
  },
];

// ===============================================================
// LESSON 2 — About me
// ===============================================================
const lesson2Words: VocabularyItem[] = [
  { korean: "저는", romanization: "jeoneun", english: "I (저 \"I\" + topic particle 는)", emoji: "🙋" },
  { korean: "이름", romanization: "ireum", english: "name", emoji: "📛" },
  { korean: "나라", romanization: "nara", english: "country", emoji: "🌏" },
  { korean: "한국", romanization: "hanguk", english: "Korea", emoji: "🇰🇷" },
  { korean: "처음", romanization: "cheoeum", english: "first time", emoji: "1️⃣" },
  { korean: "여행", romanization: "yeohaeng", english: "travel / trip", emoji: "✈️" },
  { korean: "여행자", romanization: "yeohaengja", english: "traveler", emoji: "🧳" },
];

const lesson2Phrases: VocabularyItem[] = [
  {
    korean: "저는 ___이에요/예요.",
    romanization: "jeoneun ___ieyo/yeyo.",
    english: "I am ___ (your name).",
    emoji: "🙋",
    example: { korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "I am Emma." },
  },
  {
    korean: "저는 ___에서 왔어요.",
    romanization: "jeoneun ___eseo wasseoyo.",
    english: "I came from ___ (country/place).",
    emoji: "🌏",
    example: { korean: "저는 하와이에서 왔어요.", romanization: "jeoneun hawaieseo wasseoyo.", english: "I came from Hawaiʻi." },
  },
  { korean: "한국에 처음 왔어요.", romanization: "hanguge cheoeum wasseoyo.", english: "This is my first time in Korea.", emoji: "🇰🇷1️⃣" },
  { korean: "한국어를 배워요.", romanization: "hangugeoreul baewoyo.", english: "I'm learning Korean.", emoji: "📚" },
];

// Grammar notes (short, plain English)
const lesson2Grammar: GrammarNote[] = [
  {
    title: "-이에요 / -예요 = \"It is ___\" / \"I am ___\"",
    explanation:
      "Put this at the end of a noun to say what something or someone IS. " +
      "Look at the last letter-block of the noun: if it ends in a consonant, add 이에요. " +
      "If it ends in a vowel, add 예요.",
    examples: [
      { korean: "학생이에요.", romanization: "haksaengieyo.", english: "I am a student. (학생 ends in ㅇ, a consonant → 이에요)" },
      { korean: "친구예요.", romanization: "chinguyeyo.", english: "It's a friend. (친구 ends in ㅜ, a vowel → 예요)" },
      { korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "I am Emma. (엠마 ends in a vowel → 예요)" },
    ],
  },
  {
    title: "은 / 는 = topic marker (\"as for ___\")",
    explanation:
      "Put this right after a word to make it the topic of the sentence — like saying \"as for ___\". " +
      "Use 은 after a consonant and 는 after a vowel.",
    examples: [
      { korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "As for me, I'm Emma. (저 ends in a vowel → 는)" },
      { korean: "서울 호텔은 어디예요?", romanization: "seoul hotereun eodiyeyo?", english: "As for the Seoul Hotel, where is it? (호텔 ends in ㄹ → 은)" },
      { korean: "지하철은 어디예요?", romanization: "jihacheoreun eodiyeyo?", english: "Where is the subway? (지하철 ends in ㄹ → 은)" },
    ],
  },
];

const lesson2Conversation: ConversationLine[] = [
  { speaker: "staff", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "staff", korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?", emoji: "📛" },
  { speaker: "traveler", korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "I am Emma.", emoji: "🙋" },
  { speaker: "staff", korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?", emoji: "🌏" },
  { speaker: "traveler", korean: "저는 하와이에서 왔어요.", romanization: "jeoneun hawaieseo wasseoyo.", english: "I came from Hawaiʻi.", emoji: "🌺" },
  { speaker: "traveler", korean: "한국에 처음 왔어요.", romanization: "hanguge cheoeum wasseoyo.", english: "This is my first time in Korea.", emoji: "🇰🇷" },
  { speaker: "traveler", korean: "한국어를 배워요.", romanization: "hangugeoreul baewoyo.", english: "I'm learning Korean.", emoji: "📚" },
];

const lesson2Missions: ChoiceQuestion[] = [
  {
    prompt: "📛 Someone asks your name. Your name is Emma. Which is correct?",
    options: ["저는 엠마이에요.", "저는 엠마예요.", "이름이 뭐예요?"],
    answer: "저는 엠마예요.",
    explanation: "엠마 ends in a vowel (ㅏ), so it takes 예요.",
    hints: {
      "저는 엠마이에요.": "Almost! 엠마 ends in a vowel, so use 예요, not 이에요.",
      "이름이 뭐예요?": "That ASKS someone's name. You need to TELL yours.",
    },
  },
  {
    prompt: "🎒 Someone asks what you do. Tell them \"I am a student\" (student = 학생).",
    options: ["학생예요.", "학생이에요.", "학생은요."],
    answer: "학생이에요.",
    explanation: "학생 ends in a consonant (ㅇ), so it takes 이에요.",
    hints: {
      "학생예요.": "학생 ends in a consonant (ㅇ). Consonant → 이에요.",
      "학생은요.": "That isn't the \"I am ___\" ending. Look for 이에요 / 예요.",
    },
  },
  {
    prompt: "🇰🇷 Tell someone this is your first time in Korea.",
    options: ["어디에서 왔어요?", "저는 하와이에서 왔어요.", "한국에 처음 왔어요."],
    answer: "한국에 처음 왔어요.",
    explanation: "처음 = first time. 한국에 처음 왔어요 = I came to Korea for the first time.",
    hints: {
      "어디에서 왔어요?": "That asks where someone is from. Look for 처음 (first time).",
      "저는 하와이에서 왔어요.": "That says where you're from. Look for 처음 (first time).",
    },
  },
];

// ===============================================================
// LESSON 3 — Asking questions
// ===============================================================
const lesson3Words: VocabularyItem[] = [
  { korean: "어디", romanization: "eodi", english: "where", emoji: "📍" },
  { korean: "뭐", romanization: "mwo", english: "what", emoji: "❓" },
  { korean: "누구", romanization: "nugu", english: "who", emoji: "🧑" },
  { korean: "언제", romanization: "eonje", english: "when", emoji: "⏰" },
  { korean: "어떻게", romanization: "eotteoke", english: "how", emoji: "🤔" },
  { korean: "친구", romanization: "chingu", english: "friend", emoji: "🤝" },
  { korean: "가족", romanization: "gajok", english: "family", emoji: "👨‍👩‍👧" },
];

const lesson3Phrases: VocabularyItem[] = [
  { korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?", emoji: "📛" },
  { korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?", emoji: "🌏" },
];

const lesson3Conversation: ConversationLine[] = [
  { speaker: "staff", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "staff", korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?", emoji: "📛" },
  { speaker: "traveler", korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "I am Emma.", emoji: "🙋" },
  { speaker: "staff", korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?", emoji: "🌏" },
  { speaker: "traveler", korean: "저는 하와이에서 왔어요.", romanization: "jeoneun hawaieseo wasseoyo.", english: "I came from Hawaiʻi.", emoji: "🌺" },
];

const lesson3Missions: ChoiceQuestion[] = [
  {
    prompt: "📛 You want to know the staff member's name. Ask them.",
    options: ["저는 엠마예요.", "이름이 뭐예요?", "어디에서 왔어요?"],
    answer: "이름이 뭐예요?",
    explanation: "이름 = name, 뭐 = what. 이름이 뭐예요? = What is your name?",
    hints: {
      "저는 엠마예요.": "That TELLS your name. You want to ASK theirs.",
      "어디에서 왔어요?": "That asks where someone is from. Look for 이름 (name).",
    },
  },
  {
    prompt: "🌏 Ask someone where they are from.",
    options: ["어디에서 왔어요?", "저는 하와이에서 왔어요.", "이름이 뭐예요?"],
    answer: "어디에서 왔어요?",
    explanation: "어디 = where. 어디에서 왔어요? = Where are you from?",
    hints: {
      "저는 하와이에서 왔어요.": "That TELLS where you're from. You want to ASK.",
      "이름이 뭐예요?": "That asks someone's name. Look for 어디 (where).",
    },
  },
  {
    prompt: "🧑 Which word means \"who\"?",
    options: ["뭐", "언제", "누구"],
    answer: "누구",
    explanation: "누구 = who.",
    hints: {
      "뭐": "뭐 means \"what.\"",
      "언제": "언제 means \"when.\"",
    },
  },
  {
    prompt: "⏰ Which word means \"when\"?",
    options: ["언제", "어디", "어떻게"],
    answer: "언제",
    explanation: "언제 = when.",
    hints: {
      "어디": "어디 means \"where.\"",
      "어떻게": "어떻게 means \"how.\"",
    },
  },
  {
    prompt: "👨‍👩‍👧 You're traveling with your family. Which word is \"family\"?",
    options: ["친구", "가족", "누구"],
    answer: "가족",
    explanation: "가족 = family.",
    hints: {
      "친구": "친구 means \"friend.\"",
      "누구": "누구 means \"who.\"",
    },
  },
];

// ===============================================================
// LESSON 4 — Getting help
// ===============================================================
const lesson4Words: VocabularyItem[] = [
  { korean: "직원", romanization: "jigwon", english: "staff / worker", emoji: "👩‍✈️" },
  { korean: "화장실", romanization: "hwajangsil", english: "bathroom", emoji: "🚻" },
  { korean: "공항", romanization: "gonghang", english: "airport", emoji: "🛫" },
  { korean: "호텔", romanization: "hotel", english: "hotel", emoji: "🏨" },
  { korean: "식당", romanization: "sikdang", english: "restaurant", emoji: "🍜" },
  { korean: "영어", romanization: "yeongeo", english: "English (language)", emoji: "🔤" },
  { korean: "한국어", romanization: "hangugeo", english: "Korean (language)", emoji: "🗣️" },
];

const lesson4Phrases: VocabularyItem[] = [
  { korean: "화장실이 어디예요?", romanization: "hwajangsiri eodiyeyo?", english: "Where is the bathroom?", emoji: "🚻" },
  {
    korean: "___ 호텔은 어디예요?",
    romanization: "___ hotereun eodiyeyo?",
    english: "Where is the ___ hotel?",
    emoji: "🏨",
    example: { korean: "서울 호텔은 어디예요?", romanization: "seoul hotereun eodiyeyo?", english: "Where is the Seoul Hotel?" },
  },
  { korean: "영어 할 수 있나요?", romanization: "yeongeo hal su innayo?", english: "Can you speak English?", emoji: "🔤" },
  { korean: "도와주실 수 있나요?", romanization: "dowajusil su innayo?", english: "Could you help me?", emoji: "🙏" },
];

const lesson4Conversation: ConversationLine[] = [
  { speaker: "staff", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "죄송합니다. 화장실이 어디예요?", romanization: "joesonghamnida. hwajangsiri eodiyeyo?", english: "Excuse me (lit. I'm sorry). Where is the bathroom?", emoji: "🚻" },
  { speaker: "staff", korean: "저기예요.", romanization: "jeogiyeyo.", english: "It's over there. (저기 = over there)", emoji: "👉" },
  { speaker: "traveler", korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye. (Emma is leaving; the staff member stays.)", emoji: "🧍👋" },
  { speaker: "staff", korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye. (The staff member stays; Emma is leaving.)", emoji: "🚶‍♀️👋" },
];

const lesson4Missions: ChoiceQuestion[] = [
  {
    prompt: "🚻 You need to find the bathroom.",
    options: ["이름이 뭐예요?", "어디에서 왔어요?", "화장실이 어디예요?", "한국어를 배워요."],
    answer: "화장실이 어디예요?",
    explanation: "화장실 = bathroom, 어디 = where. 화장실이 어디예요? = Where is the bathroom?",
    hints: {
      "이름이 뭐예요?": "That asks someone's name. Look for 화장실 (bathroom).",
      "어디에서 왔어요?": "Close — it has 어디 (where), but it asks where someone is FROM.",
      "한국어를 배워요.": "That means \"I'm learning Korean.\" Look for 화장실 (bathroom).",
    },
  },
  {
    prompt: "🔤 Ask a staff member if they can speak English.",
    options: ["한국어를 배워요.", "영어 할 수 있나요?", "도와주실 수 있나요?"],
    answer: "영어 할 수 있나요?",
    explanation: "영어 = English. 영어 할 수 있나요? = Can you speak English?",
    hints: {
      "한국어를 배워요.": "That means \"I'm learning Korean.\" Look for 영어 (English).",
      "도와주실 수 있나요?": "That means \"Could you help me?\" Look for 영어 (English).",
    },
  },
  {
    prompt: "🙏 You're lost. Politely ask a staff member for help.",
    options: ["영어 할 수 있나요?", "도와주실 수 있나요?", "화장실이 어디예요?"],
    answer: "도와주실 수 있나요?",
    explanation: "도와주실 수 있나요? = Could you help me?",
    hints: {
      "영어 할 수 있나요?": "That asks if they speak English. Look for 도와주실 (help).",
      "화장실이 어디예요?": "That asks where the bathroom is. Look for 도와주실 (help).",
    },
  },
  {
    prompt: "🏨 Ask where the Seoul Hotel is.",
    options: ["서울 호텔은 어디예요?", "서울 호텔는 어디예요?", "서울 호텔이에요."],
    answer: "서울 호텔은 어디예요?",
    explanation: "호텔 ends in a consonant (ㄹ), so it takes 은. 어디예요? = where is it?",
    hints: {
      "서울 호텔는 어디예요?": "호텔 ends in a consonant (ㄹ). Consonant → 은.",
      "서울 호텔이에요.": "That says \"It's the Seoul Hotel.\" You need to ASK where.",
    },
  },
];

// ===============================================================
// LESSON 5 — GAME: your first hour in Korea
// Each step: a situation, (optional) what someone says to you,
// then the options to choose from.
// ===============================================================
const gameSteps: GameStep[] = [
  {
    place: "👩‍✈️ Information desk",
    prompt: "You just landed and walk up to the information desk. Greet the staff member.",
    options: ["안녕히 가세요.", "안녕하세요.", "네."],
    answer: "안녕하세요.",
    explanation: "안녕하세요 is the polite \"hello.\" She smiles back. 👋",
    hints: {
      "안녕히 가세요.": "That's a goodbye. You're just arriving!",
      "네.": "네 means \"yes.\" Start with a greeting.",
    },
  },
  {
    place: "👩‍✈️ Information desk",
    speaker: "staff",
    line: { korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?" },
    prompt: "Your name is Emma. Answer her.",
    options: ["저는 엠마이에요.", "이름이 뭐예요?", "저는 엠마예요."],
    answer: "저는 엠마예요.",
    explanation: "엠마 ends in a vowel, so it takes 예요.",
    hints: {
      "저는 엠마이에요.": "Almost! 엠마 ends in a vowel (ㅏ). Vowel → 예요.",
      "이름이 뭐예요?": "That asks HER name. Tell her yours.",
    },
  },
  {
    place: "👩‍✈️ Information desk",
    speaker: "staff",
    line: { korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?" },
    prompt: "You're from Hawaiʻi.",
    options: ["저는 하와이에서 왔어요.", "한국에 처음 왔어요.", "어디에서 왔어요?"],
    answer: "저는 하와이에서 왔어요.",
    explanation: "___에서 왔어요 = I came from ___. 🌺",
    hints: {
      "한국에 처음 왔어요.": "That says it's your first time in Korea. She asked where you're FROM (어디에서).",
      "어디에서 왔어요?": "That asks the same question back. Answer it first!",
    },
  },
  {
    place: "👩‍✈️ Information desk",
    prompt: "She says your Korean is good. Tell her you're learning Korean.",
    options: ["영어 할 수 있나요?", "한국어를 배워요.", "죄송합니다."],
    answer: "한국어를 배워요.",
    explanation: "한국어 = Korean (language), 배워요 = I'm learning. 📚",
    hints: {
      "영어 할 수 있나요?": "That asks if she speaks English. Look for 한국어 (Korean).",
      "죄송합니다.": "No need to apologize! Look for 배워요 (I'm learning).",
    },
  },
  {
    place: "👋 Leaving the desk",
    prompt: "You're done. YOU are leaving, and she is STAYING at the desk. Say goodbye.",
    options: ["안녕히 계세요.", "안녕히 가세요.", "안녕하세요."],
    answer: "안녕히 계세요.",
    explanation: "계세요 = stay. You say 안녕히 계세요 to the person who stays behind.",
    hints: {
      "안녕히 가세요.": "가세요 means \"go.\" She isn't going anywhere — you are.",
      "안녕하세요.": "That's \"hello.\" You need a goodbye.",
    },
  },
  {
    place: "💥 In the crowd",
    prompt: "Oops — your suitcase rolls into someone's foot.",
    options: ["네.", "안녕하세요.", "죄송합니다."],
    answer: "죄송합니다.",
    explanation: "죄송합니다 = I'm sorry (polite). They nod. It's OK!",
    hints: {
      "네.": "네 means \"yes.\" You need an apology.",
      "안녕하세요.": "That's \"hello.\" You need an apology.",
    },
  },
  {
    place: "🚻 Arrivals hall",
    prompt: "Long flight. You need the bathroom. Ask a staff member.",
    options: ["화장실이 어디예요?", "화장실이에요.", "어디에서 왔어요?"],
    answer: "화장실이 어디예요?",
    explanation: "\"저기예요.\" (It's over there.) 👉 Found it!",
    hints: {
      "화장실이에요.": "That says \"It's the bathroom.\" You need to ASK where (어디).",
      "어디에서 왔어요?": "That asks where someone is from. Look for 화장실 (bathroom).",
    },
  },
  {
    place: "🗺️ Lost in the airport",
    prompt: "You can't find the exit and the signs are confusing. Politely ask for help.",
    options: ["도와주실 수 있나요?", "한국에 처음 왔어요.", "안녕히 가세요."],
    answer: "도와주실 수 있나요?",
    explanation: "도와주실 수 있나요? = Could you help me? Someone walks you to the exit. 🙏",
    hints: {
      "한국에 처음 왔어요.": "True, but it doesn't ask for help! Look for 도와주실.",
      "안녕히 가세요.": "That's a goodbye. You need to ask for help.",
    },
  },
  {
    place: "🏨 Hotel lobby",
    prompt: "You made it to the city, but where is your hotel? Ask where the Seoul Hotel is.",
    options: ["서울 호텔는 어디예요?", "서울 호텔은 어디예요?", "서울 호텔이에요."],
    answer: "서울 호텔은 어디예요?",
    explanation: "호텔 ends in a consonant (ㄹ), so it takes 은. It's right across the street. 🏨",
    hints: {
      "서울 호텔는 어디예요?": "호텔 ends in a consonant (ㄹ). Consonant → 은.",
      "서울 호텔이에요.": "That says \"It's the Seoul Hotel.\" You need to ASK where.",
    },
  },
  {
    place: "🛋️ Hotel lobby",
    speaker: "friend",
    line: { korean: "안녕하세요. 저는 민준이에요.", romanization: "annyeonghaseyo. jeoneun minjunieyo.", english: "Hello. I'm Minjun." },
    prompt: "A friendly guest introduces himself. Ask him where he's from.",
    options: ["이름이 뭐예요?", "어디에서 왔어요?", "저는 하와이에서 왔어요."],
    answer: "어디에서 왔어요?",
    explanation: "\"저는 부산에서 왔어요.\" (I came from Busan.) You just made a friend! 🤝",
    hints: {
      "이름이 뭐예요?": "He already told you his name — 민준! Look for 어디 (where).",
      "저는 하와이에서 왔어요.": "That TELLS where you're from. ASK him first.",
    },
  },
  {
    place: "🛋️ Hotel lobby",
    prompt: "Minjun has to go. HE is leaving, and you're STAYING in the lobby. Say goodbye.",
    options: ["안녕히 계세요.", "안녕히 가세요.", "죄송합니다."],
    answer: "안녕히 가세요.",
    explanation: "가세요 = go. You say 안녕히 가세요 to the person who is leaving. 👋",
    hints: {
      "안녕히 계세요.": "계세요 means \"stay.\" Minjun isn't staying — he's leaving.",
      "죄송합니다.": "That means \"I'm sorry.\" You need a goodbye.",
    },
  },
];

// ===============================================================
// LESSON 5 — Review: listening questions
// The app speaks the Korean; the learner picks the English.
// ===============================================================
const listeningQuestions: ChoiceQuestion[] = [
  { prompt: "안녕하세요.", options: ["Goodbye.", "Hello.", "I'm sorry."], answer: "Hello." },
  { prompt: "화장실이 어디예요?", options: ["Where is the bathroom?", "What is your name?", "Where are you from?"], answer: "Where is the bathroom?" },
  { prompt: "안녕히 계세요.", options: ["Goodbye (to someone leaving).", "Hello.", "Goodbye (to someone staying)."], answer: "Goodbye (to someone staying)." },
  { prompt: "이름이 뭐예요?", options: ["Where is the hotel?", "What is your name?", "Can you speak English?"], answer: "What is your name?" },
  { prompt: "도와주실 수 있나요?", options: ["Could you help me?", "I'm learning Korean.", "Can you speak English?"], answer: "Could you help me?" },
  { prompt: "한국에 처음 왔어요.", options: ["I came from Korea.", "This is my first time in Korea.", "I'm learning Korean."], answer: "This is my first time in Korea." },
  { prompt: "죄송합니다.", options: ["Thank you.", "Yes.", "I'm sorry."], answer: "I'm sorry." },
];

// ===============================================================
// THE WHOLE UNIT (puts the lessons above together)
// ===============================================================
export const greetingsUnit: Unit = {
  id: "greetings",
  title: "Greetings",
  description: "Say hello, introduce yourself, and ask for help.",
  icon: "👋",
  image: "/units/greetings.svg",
  color: "#9b7bd4",
  photo: {
    src: "/lesson-photos/greetings.jpg",
    alt: "A brightly painted Korean pavilion above a row of palms",
  },

  lessons: [
    {
      id: "greetings-1",
      title: "Hello & goodbye",
      description: "Say hello, say sorry, and the two ways to say goodbye.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Hello & goodbye",
            intro: "Emma just landed in Korea and meets an airport staff member. Tap \"Next line\" to follow along, and tap any Korean to hear it.",
            conversation: lesson1Conversation,
            words: lesson1Words,
            phrases: lesson1Phrases,
            grammar: [],
            missions: lesson1Missions,
          },
        ],
      },
    },
    {
      id: "greetings-2",
      title: "About me",
      description: "Say your name, where you're from, and that you're new to Korea.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "About me",
            intro: "The staff member asks Emma about herself. Listen to how she answers.",
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
      id: "greetings-3",
      title: "Asking questions",
      description: "Who, what, where, when, how — and asking someone's name.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Asking questions",
            intro: "Now listen for the questions the staff member asks.",
            conversation: lesson3Conversation,
            words: lesson3Words,
            phrases: lesson3Phrases,
            grammar: [],
            missions: lesson3Missions,
          },
        ],
      },
    },
    {
      id: "greetings-4",
      title: "Getting help",
      description: "Find the bathroom, ask for help, and ask if someone speaks English.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Getting help",
            intro: "Emma needs to find the bathroom before she leaves.",
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
      id: "greetings-5",
      title: "Game: First hour in Korea",
      description: "Use everything you've learned to get from the info desk to your hotel, then review.",
      sections: {
        speakers: speakers,
        study: [],
        game: {
          title: "Your first hour in Korea",
          intro: "You've just landed in Korea 🇰🇷. Introduce yourself at the information desk, find the bathroom, get help, and make a new friend at your hotel. Pick the right Korean at each step!",
          steps: gameSteps,
          finish: "You got through your first hour in Korea — and made a friend! 🎉 Now review every word.",
        },
        review: {
          title: "Review",
          flashcards: [
            ...lesson1Words, ...lesson1Phrases,
            ...lesson2Words, ...lesson2Phrases,
            ...lesson3Words, ...lesson3Phrases,
            ...lesson4Words, ...lesson4Phrases,
          ],
          listening: listeningQuestions,
        },
      },
    },
  ],
};
