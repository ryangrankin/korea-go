/*
  LESSON 1 CONTENT — Greetings + Airport
  ======================================
  This file holds ALL the Korean words, phrases, conversations, and
  questions for Lesson 1. The app reads from here, so you can change
  the lesson without touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each word looks like this:
      { korean: "공항", romanization: "gonghang", english: "airport", emoji: "🛫" },
  - To add a word, copy one whole line (from { to },) and paste it below.
  - In a question, "answer" must match one of the "options" EXACTLY
    (same spaces, same punctuation).
  - Optional fields:
      say:     what the computer voice says instead of the Korean text
               (used for phrases with a blank ___)
      example: a filled-in example for phrases with a blank ___
      hints:   a helpful hint shown when someone picks a wrong option

  Lesson 1 is listed in data/lessons.ts, which also describes the
  shape of this data for the computer. You don't need to edit that.
*/

import type {
  Lesson,
  VocabularyItem,
  Speaker,
  ConversationLine,
  GrammarNote,
  ChoiceQuestion,
  GameStep,
} from "./lessons";

// ---------------------------------------------------------------
// WHO IS TALKING in the conversations
// ---------------------------------------------------------------
const speakers: Record<string, Speaker> = {
  traveler: { name: "Emma (traveler)", emoji: "🧳" },
  staff: { name: "Airport staff", emoji: "👩‍✈️" },
  officer: { name: "Officer", emoji: "👮" },
  hotel: { name: "Hotel staff", emoji: "🛎️" },
};

// ---------------------------------------------------------------
// SECTION 1 WORDS — Greetings and basic vocab
// ---------------------------------------------------------------
const greetingsVocab: VocabularyItem[] = [
  { korean: "네", romanization: "ne", english: "yes", emoji: "👍" },
  { korean: "아니요", romanization: "aniyo", english: "no", emoji: "🙅" },
  { korean: "여행자", romanization: "yeohaengja", english: "traveler", emoji: "🧳" },
  { korean: "직원", romanization: "jigwon", english: "staff / worker", emoji: "👩‍✈️" },
  { korean: "친구", romanization: "chingu", english: "friend", emoji: "🤝" },
  { korean: "한국", romanization: "hanguk", english: "Korea", emoji: "🇰🇷" },
  { korean: "공항", romanization: "gonghang", english: "airport", emoji: "🛫" },
  { korean: "호텔", romanization: "hotel", english: "hotel", emoji: "🏨" },
  { korean: "식당", romanization: "sikdang", english: "restaurant", emoji: "🍜" },
  { korean: "이름", romanization: "ireum", english: "name", emoji: "📛" },
  { korean: "나라", romanization: "nara", english: "country", emoji: "🌏" },
  { korean: "영어", romanization: "yeongeo", english: "English (language)", emoji: "🔤" },
  { korean: "한국어", romanization: "hangugeo", english: "Korean (language)", emoji: "🗣️" },
  { korean: "처음", romanization: "cheoeum", english: "first time", emoji: "1️⃣" },
  { korean: "여행", romanization: "yeohaeng", english: "travel / trip", emoji: "✈️" },
  { korean: "화장실", romanization: "hwajangsil", english: "bathroom", emoji: "🚻" },
  { korean: "어디", romanization: "eodi", english: "where", emoji: "📍" },
  { korean: "뭐", romanization: "mwo", english: "what", emoji: "❓" },
  { korean: "어떻게", romanization: "eotteoke", english: "how", emoji: "🤔" },
  { korean: "언제", romanization: "eonje", english: "when", emoji: "⏰" },
  { korean: "누구", romanization: "nugu", english: "who", emoji: "🧑" },
  { korean: "저는", romanization: "jeoneun", english: "I (저 \"I\" + topic particle 는)", emoji: "🙋" },
  { korean: "가족", romanization: "gajok", english: "family", emoji: "👨‍👩‍👧" },
];

// ---------------------------------------------------------------
// SECTION 1 PHRASES
// ---------------------------------------------------------------
const phrases: VocabularyItem[] = [
  { korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye (said to the person who is LEAVING).", emoji: "🚶‍♀️👋" },
  { korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye (said to the person who is STAYING).", emoji: "🧍👋" },
  { korean: "화장실이 어디예요?", romanization: "hwajangsiri eodiyeyo?", english: "Where is the bathroom?", emoji: "🚻" },
  {
    korean: "___ 호텔은 어디예요?",
    romanization: "___ hotereun eodiyeyo?",
    english: "Where is the ___ hotel?",
    emoji: "🏨",
    example: { korean: "서울 호텔은 어디예요?", romanization: "seoul hotereun eodiyeyo?", english: "Where is the Seoul Hotel?" },
  },
  { korean: "죄송합니다.", romanization: "joesonghamnida.", english: "I'm sorry.", emoji: "🙇" },
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
  { korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?", emoji: "📛" },
  { korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?", emoji: "🌏" },
  { korean: "영어 할 수 있나요?", romanization: "yeongeo hal su innayo?", english: "Can you speak English?", emoji: "🔤" },
  { korean: "도와주실 수 있나요?", romanization: "dowajusil su innayo?", english: "Could you help me?", emoji: "🙏" },
];

// ---------------------------------------------------------------
// SECTION 2 WORDS — Airport vocab
// ---------------------------------------------------------------
const airportVocab: VocabularyItem[] = [
  { korean: "터미널", romanization: "teomineol", english: "terminal", emoji: "🏢" },
  { korean: "입국", romanization: "ipguk", english: "entry (immigration into the country)", emoji: "🛬" },
  { korean: "출국", romanization: "chulguk", english: "departure (leaving the country)", emoji: "🛫" },
  { korean: "도착", romanization: "dochak", english: "arrival / arrivals", emoji: "📥" },
  { korean: "수하물 찾는 곳", romanization: "suhamul channeun got", english: "baggage claim", emoji: "🛄" },
  { korean: "입구", romanization: "ipgu", english: "entrance", emoji: "🚪➡️" },
  { korean: "출구", romanization: "chulgu", english: "exit", emoji: "🚪⬅️" },
  { korean: "환승", romanization: "hwanseung", english: "transfer", emoji: "🔁" },
  { korean: "세관", romanization: "segwan", english: "customs", emoji: "🛃" },
  { korean: "항공편", romanization: "hanggongpyeon", english: "flight", emoji: "✈️" },
  { korean: "표", romanization: "pyo", english: "ticket", emoji: "🎫" },
  { korean: "탑승권", romanization: "tapseunggwon", english: "boarding pass", emoji: "🎟️" },
  { korean: "게이트", romanization: "geiteu", english: "gate", emoji: "🚪" },
  { korean: "여권", romanization: "yeogwon", english: "passport", emoji: "🛂" },
  { korean: "짐", romanization: "jim", english: "luggage", emoji: "🧳" },
  { korean: "택시", romanization: "taeksi", english: "taxi", emoji: "🚕" },
  { korean: "교통카드", romanization: "gyotongkadeu", english: "transportation card", emoji: "💳" },
  { korean: "환전", romanization: "hwanjeon", english: "currency exchange", emoji: "💱" },
  { korean: "공항버스", romanization: "gonghangbeoseu", english: "airport bus", emoji: "🚌✈️" },
  { korean: "지하철", romanization: "jihacheol", english: "subway", emoji: "🚇" },
  { korean: "버스", romanization: "beoseu", english: "bus", emoji: "🚌" },
  { korean: "정류장", romanization: "jeongnyujang", english: "stop / station", emoji: "🚏" },
  { korean: "버스 정류장", romanization: "beoseu jeongnyujang", english: "bus stop", emoji: "🚏🚌" },
  { korean: "확인하다", romanization: "hwaginhada", english: "to check / verify", emoji: "✅" },
  { korean: "가다", romanization: "gada", english: "to go", emoji: "➡️" },
  { korean: "오다", romanization: "oda", english: "to come", emoji: "⬅️" },
  { korean: "신고하다", romanization: "singohada", english: "to declare / report", emoji: "📝" },
  { korean: "제출하다", romanization: "jechulhada", english: "to submit", emoji: "📤" },
  { korean: "보여 주다", romanization: "boyeo juda", english: "to show", emoji: "👀" },
];

// ---------------------------------------------------------------
// GRAMMAR NOTES (short, plain English)
// ---------------------------------------------------------------
const grammarNotes: GrammarNote[] = [
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

// ---------------------------------------------------------------
// SECTION 1 — CONVERSATION (traveler meets airport staff)
// ---------------------------------------------------------------
const section1Conversation: ConversationLine[] = [
  { speaker: "staff", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "traveler", korean: "안녕하세요.", romanization: "annyeonghaseyo.", english: "Hello.", emoji: "👋" },
  { speaker: "staff", korean: "이름이 뭐예요?", romanization: "ireumi mwoyeyo?", english: "What is your name?", emoji: "📛" },
  { speaker: "traveler", korean: "저는 엠마예요.", romanization: "jeoneun emmayeyo.", english: "I am Emma.", emoji: "🙋" },
  { speaker: "staff", korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?", emoji: "🌏" },
  { speaker: "traveler", korean: "저는 하와이에서 왔어요.", romanization: "jeoneun hawaieseo wasseoyo.", english: "I came from Hawaiʻi.", emoji: "🌺" },
  { speaker: "traveler", korean: "한국에 처음 왔어요.", romanization: "hanguge cheoeum wasseoyo.", english: "This is my first time in Korea.", emoji: "🇰🇷" },
  { speaker: "traveler", korean: "한국어를 배워요.", romanization: "hangugeoreul baewoyo.", english: "I'm learning Korean.", emoji: "📚" },
  { speaker: "traveler", korean: "죄송합니다. 화장실이 어디예요?", romanization: "joesonghamnida. hwajangsiri eodiyeyo?", english: "Excuse me (lit. I'm sorry). Where is the bathroom?", emoji: "🚻" },
  { speaker: "staff", korean: "저기예요.", romanization: "jeogiyeyo.", english: "It's over there. (저기 = over there)", emoji: "👉" },
  { speaker: "traveler", korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye. (Emma is leaving; the staff member stays.)", emoji: "🧍👋" },
  { speaker: "staff", korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye. (The staff member stays; Emma is leaving.)", emoji: "🚶‍♀️👋" },
];

// ---------------------------------------------------------------
// SECTION 1 — MISSIONS (situation in English, pick the Korean)
// ---------------------------------------------------------------
const section1Missions: ChoiceQuestion[] = [
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
    prompt: "💥 You accidentally bump into someone with your suitcase.",
    options: ["죄송합니다.", "안녕하세요.", "네."],
    answer: "죄송합니다.",
    explanation: "죄송합니다 = I'm sorry (polite).",
    hints: {
      "안녕하세요.": "That's \"hello.\" You need an apology.",
      "네.": "That means \"yes.\" You need an apology.",
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

// ---------------------------------------------------------------
// SECTION 2 — CONVERSATION (traveler asks for directions)
// ---------------------------------------------------------------
const section2Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "안녕하세요. 도와주실 수 있나요?", romanization: "annyeonghaseyo. dowajusil su innayo?", english: "Hello. Could you help me?", emoji: "🙏" },
  { speaker: "staff", korean: "네, 안녕하세요.", romanization: "ne, annyeonghaseyo.", english: "Yes, hello.", emoji: "👍" },
  { speaker: "traveler", korean: "수하물 찾는 곳은 어디예요?", romanization: "suhamul channeun goseun eodiyeyo?", english: "Where is baggage claim?", emoji: "🛄" },
  { speaker: "staff", korean: "저기예요.", romanization: "jeogiyeyo.", english: "It's over there.", emoji: "👉" },
  { speaker: "traveler", korean: "공항버스 정류장은 어디예요?", romanization: "gonghangbeoseu jeongnyujangeun eodiyeyo?", english: "Where is the airport bus stop?", emoji: "🚏" },
  { speaker: "staff", korean: "5번 출구예요.", romanization: "obeon chulguyeyo.", english: "It's exit 5. (5번 = number 5)", emoji: "🚪5️⃣" },
  { speaker: "traveler", korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye. (Emma is leaving; the staff member stays.)", emoji: "🧍👋" },
  { speaker: "staff", korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye. (Emma is the one leaving.)", emoji: "🚶‍♀️👋" },
];

// ---------------------------------------------------------------
// SECTION 2 — MISSIONS
// ---------------------------------------------------------------
const section2Missions: ChoiceQuestion[] = [
  {
    prompt: "🛄 You just landed and want to pick up your suitcase. Which sign do you follow?",
    options: ["출국", "수하물 찾는 곳", "환승", "세관"],
    answer: "수하물 찾는 곳",
    explanation: "수하물 찾는 곳 = baggage claim (literally \"the place where you find baggage\").",
    hints: {
      "출국": "출국 is departure — for leaving the country.",
      "환승": "환승 is transfer — for connecting flights.",
      "세관": "세관 is customs. You'll go there after you get your bags.",
    },
  },
  {
    prompt: "🛂 The officer needs to see your passport. Which word is \"passport\"?",
    options: ["표", "탑승권", "여권", "짐"],
    answer: "여권",
    explanation: "여권 = passport.",
    hints: {
      "표": "표 is a ticket.",
      "탑승권": "탑승권 is a boarding pass.",
      "짐": "짐 is luggage.",
    },
  },
  {
    prompt: "💱 You need to change US dollars into Korean won.",
    options: ["환승", "환전", "확인하다"],
    answer: "환전",
    explanation: "환전 = currency exchange. (Careful: 환승 looks similar but means transfer!)",
    hints: {
      "환승": "Tricky! 환승 is transfer. You want 환전.",
      "확인하다": "확인하다 means to check / verify.",
    },
  },
  {
    prompt: "🚪 You want to get OUT of the building.",
    options: ["입구", "출구", "게이트"],
    answer: "출구",
    explanation: "출구 = exit. (입구 = entrance.) Tip: 출 shows up in 출국 (departure) too — both are about going out.",
    hints: {
      "입구": "입구 is the entrance — the way IN.",
      "게이트": "게이트 is the gate where you board a plane.",
    },
  },
  {
    prompt: "🔁 You're not staying in Korea — you have a connecting flight to Tokyo.",
    options: ["입국", "도착", "환승"],
    answer: "환승",
    explanation: "환승 = transfer. Follow these signs for connecting flights.",
    hints: {
      "입국": "입국 is entry into Korea. You're not entering — you're connecting.",
      "도착": "도착 is arrivals. Look for the transfer sign.",
    },
  },
  {
    prompt: "🚇 Ask: \"Where is the subway?\"",
    options: ["지하철는 어디예요?", "지하철은 어디예요?", "화장실이 어디예요?"],
    answer: "지하철은 어디예요?",
    explanation: "지하철 ends in a consonant (ㄹ), so it takes 은.",
    hints: {
      "지하철는 어디예요?": "Almost! 지하철 ends in a consonant (ㄹ). Consonant → 은.",
      "화장실이 어디예요?": "That asks for the bathroom. Look for 지하철 (subway).",
    },
  },
  {
    prompt: "💳 You want a card you can tap on buses and the subway.",
    options: ["탑승권", "교통카드", "표"],
    answer: "교통카드",
    explanation: "교통카드 = transportation card.",
    hints: {
      "탑승권": "탑승권 is a boarding pass for a plane.",
      "표": "표 is a single ticket. Look for the card.",
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
  {
    prompt: "🛫 Your trip is over and you're flying home. Which sign do you follow?",
    options: ["입국", "도착", "출국", "세관"],
    answer: "출국",
    explanation: "출국 = departure (leaving the country).",
    hints: {
      "입국": "입국 is entry — coming INTO the country.",
      "도착": "도착 is arrivals.",
      "세관": "세관 is customs, for when you arrive.",
    },
  },
];

// ---------------------------------------------------------------
// SECTION 3 — GAME: get through Incheon Airport
// Each step: a situation, (optional) what someone says to you,
// then the options to choose from.
// ---------------------------------------------------------------
const gameSteps: GameStep[] = [
  {
    place: "🛬 Off the plane",
    prompt: "You land at Incheon Airport. Signs point in different directions. You're staying in Korea, not catching another flight. Which sign do you follow?",
    options: ["환승", "입국", "출국"],
    answer: "입국",
    explanation: "Right! 입국 means entry into the country. On to immigration.",
    hints: {
      "환승": "환승 is transfer — only for people catching another flight.",
      "출국": "출국 is departure — for people leaving Korea.",
    },
  },
  {
    place: "🛂 Immigration",
    speaker: "officer",
    line: { korean: "안녕하세요. 여권 보여 주세요.", romanization: "annyeonghaseyo. yeogwon boyeo juseyo.", english: "Hello. Please show me your passport." },
    prompt: "What does the officer want to see?",
    options: ["표", "짐", "여권"],
    answer: "여권",
    explanation: "You hand over your 여권 (passport). 📘",
    hints: {
      "표": "표 is a ticket. Listen for 여권.",
      "짐": "짐 is luggage. Listen for 여권.",
    },
  },
  {
    place: "🛂 Immigration",
    speaker: "officer",
    line: { korean: "한국에 처음 왔어요?", romanization: "hanguge cheoeum wasseoyo?", english: "Is this your first time in Korea?" },
    prompt: "It IS your first time. What do you say?",
    options: ["네. 한국에 처음 왔어요.", "아니요. 안녕히 계세요.", "화장실이 어디예요?"],
    answer: "네. 한국에 처음 왔어요.",
    explanation: "네 = yes. The officer smiles.",
    hints: {
      "아니요. 안녕히 계세요.": "아니요 means \"no\" — but it IS your first time. (And it's too early for goodbye!)",
      "화장실이 어디예요?": "Good question for later! Right now, answer the officer.",
    },
  },
  {
    place: "🛂 Immigration",
    speaker: "officer",
    line: { korean: "어디에서 왔어요?", romanization: "eodieseo wasseoyo?", english: "Where are you from?" },
    prompt: "You're from Hawaiʻi.",
    options: ["저는 엠마예요.", "저는 하와이에서 왔어요.", "이름이 뭐예요?"],
    answer: "저는 하와이에서 왔어요.",
    explanation: "The officer stamps your passport. You're in Korea! 🎉",
    hints: {
      "저는 엠마예요.": "That's your name. The officer asked where you're FROM (어디에서).",
      "이름이 뭐예요?": "That asks the officer's name. Answer where you're from.",
    },
  },
  {
    place: "🧳 Find your bags",
    prompt: "Now you need to pick up your suitcase. Which sign do you follow?",
    options: ["게이트", "수하물 찾는 곳", "세관"],
    answer: "수하물 찾는 곳",
    explanation: "You find the baggage claim carousels.",
    hints: {
      "게이트": "Gates are for boarding planes — you already got off yours!",
      "세관": "세관 is customs. Get your bags first.",
    },
  },
  {
    place: "🧳 Baggage claim",
    prompt: "You can't find your carousel. Politely ask a staff member for help.",
    options: ["안녕히 가세요.", "한국어를 배워요.", "죄송합니다. 도와주실 수 있나요?"],
    answer: "죄송합니다. 도와주실 수 있나요?",
    explanation: "The staff member points you to the right carousel: \"저기예요!\" (It's over there!) You grab your 짐. 🧳",
    hints: {
      "안녕히 가세요.": "That's a goodbye. You need to ask for help.",
      "한국어를 배워요.": "True, but it doesn't ask for help! Look for 도와주실 수 있나요.",
    },
  },
  {
    place: "🛃 Almost out",
    prompt: "Before you can leave, every arriving passenger walks through one more area. Which sign is it?",
    options: ["환전", "세관", "터미널"],
    answer: "세관",
    explanation: "You head to 세관 (customs).",
    hints: {
      "환전": "환전 is currency exchange. That comes later.",
      "터미널": "You're already in the 터미널 (terminal)! Look for customs.",
    },
  },
  {
    place: "🛃 Customs",
    speaker: "officer",
    line: { korean: "신고할 물건 있어요?", romanization: "singohal mulgeon isseoyo?", english: "Do you have anything to declare?" },
    prompt: "You have nothing to declare.",
    options: ["네.", "아니요.", "죄송합니다."],
    answer: "아니요.",
    explanation: "아니요 = no. The officer waves you through. 👋",
    hints: {
      "네.": "네 means \"yes.\" You'd then have to declare something! You have nothing.",
      "죄송합니다.": "No need to apologize! Just answer yes or no.",
    },
  },
  {
    place: "📥 Arrivals hall",
    prompt: "You only have US dollars. You need Korean won for the bus. Which counter?",
    options: ["환승", "출국", "환전"],
    answer: "환전",
    explanation: "You change some money. 💱",
    hints: {
      "환승": "Careful — 환승 is transfer! You want 환전.",
      "출국": "출국 is departure. You just arrived!",
    },
  },
  {
    place: "🚏 Getting to the hotel",
    prompt: "Your hotel is downtown. Ask where the airport bus stop is.",
    options: ["공항버스 정류장는 어디예요?", "공항버스 정류장은 어디예요?", "공항버스 정류장이에요."],
    answer: "공항버스 정류장은 어디예요?",
    explanation: "\"5번 출구예요.\" (It's exit 5.) You go out the 출구 and catch the 공항버스. 🚌",
    hints: {
      "공항버스 정류장는 어디예요?": "Almost! 정류장 ends in a consonant (ㅇ). Consonant → 은.",
      "공항버스 정류장이에요.": "That says \"It's the airport bus stop.\" You need to ASK where.",
    },
  },
  {
    place: "🏨 Hotel check-in",
    speaker: "hotel",
    line: { korean: "안녕하세요. 이름이 뭐예요?", romanization: "annyeonghaseyo. ireumi mwoyeyo?", english: "Hello. What is your name?" },
    prompt: "Check in. Your name is Emma.",
    options: ["저는 엠마예요.", "저는 엠마이에요.", "어디에서 왔어요?"],
    answer: "저는 엠마예요.",
    explanation: "Here's your key! 🔑",
    hints: {
      "저는 엠마이에요.": "엠마 ends in a vowel, so use 예요.",
      "어디에서 왔어요?": "That asks where someone is from. Tell her your name.",
    },
  },
];

// ---------------------------------------------------------------
// SECTION 4 — LISTENING QUESTIONS
// The app speaks the Korean; the learner picks the English.
// ---------------------------------------------------------------
const listeningQuestions: ChoiceQuestion[] = [
  { prompt: "안녕하세요.", options: ["Goodbye.", "Hello.", "I'm sorry."], answer: "Hello." },
  { prompt: "화장실이 어디예요?", options: ["Where is the bathroom?", "What is your name?", "Where are you from?"], answer: "Where is the bathroom?" },
  { prompt: "안녕히 계세요.", options: ["Goodbye (to someone leaving).", "Hello.", "Goodbye (to someone staying)."], answer: "Goodbye (to someone staying)." },
  { prompt: "이름이 뭐예요?", options: ["Where is the hotel?", "What is your name?", "Can you speak English?"], answer: "What is your name?" },
  { prompt: "도와주실 수 있나요?", options: ["Could you help me?", "I'm learning Korean.", "Can you speak English?"], answer: "Could you help me?" },
  { prompt: "여권", options: ["ticket", "passport", "luggage"], answer: "passport" },
  { prompt: "환전", options: ["transfer", "customs", "currency exchange"], answer: "currency exchange" },
  { prompt: "출구", options: ["exit", "entrance", "gate"], answer: "exit" },
  { prompt: "한국에 처음 왔어요.", options: ["I came from Korea.", "This is my first time in Korea.", "I'm learning Korean."], answer: "This is my first time in Korea." },
  { prompt: "죄송합니다.", options: ["Thank you.", "Yes.", "I'm sorry."], answer: "I'm sorry." },
];

// ---------------------------------------------------------------
// THE WHOLE LESSON (puts the pieces above together)
// ---------------------------------------------------------------
export const lesson1: Lesson = {
  id: "lesson-1",
  title: "Lesson 1: Greetings + Airport",
  description: "Say hello, introduce yourself, and get through Incheon Airport.",

  // Every word and phrase in the lesson, in one list.
  vocabulary: [...greetingsVocab, ...phrases, ...airportVocab],

  sections: {
    speakers: speakers,

    study: [
      {
        title: "Greetings and basic vocab",
        tabLabel: "Greetings",
        intro: "Emma just landed in Korea and meets an airport staff member. Tap \"Next line\" to follow along, and tap any Korean to hear it.",
        conversation: section1Conversation,
        words: greetingsVocab,
        phrases: phrases,
        grammar: grammarNotes,
        missions: section1Missions,
      },
      {
        title: "Airport vocab and phrases",
        tabLabel: "Airport",
        intro: "Emma needs to find her bags and a bus into the city.",
        conversation: section2Conversation,
        words: airportVocab,
        phrases: [],
        grammar: [],
        missions: section2Missions,
      },
    ],

    game: {
      title: "Get through Incheon Airport",
      intro: "You've just landed at Incheon Airport 🇰🇷. Get through immigration, baggage claim, and customs, then find your way to the hotel. Pick the right Korean at each step!",
      steps: gameSteps,
      finish: "You made it to your hotel! 🏨 You got through Incheon Airport in Korean.",
    },

    review: {
      title: "Review",
      flashcards: [...greetingsVocab, ...airportVocab, ...phrases],
      listening: listeningQuestions,
    },
  },
};
