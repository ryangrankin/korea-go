/*
  UNIT 2 CONTENT — Airport
  ========================
  This file holds ALL the Korean words, phrases, conversations, and
  questions for the Airport unit. It builds on the Greetings unit
  (data/greetings.ts). The unit is split into short lessons (about
  5–10 minutes each), and each lesson has its own block below.
  The app reads from here, so you can change the lessons without
  touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each word looks like this:
      { korean: "공항", romanization: "gonghang", english: "airport", emoji: "🛫" },
  - To add a word, copy one whole line (from { to },) and paste it below.
    Aim for about 6–12 words per lesson so it stays short.
  - In a question, "answer" must match one of the "options" EXACTLY
    (same spaces, same punctuation).
  - Optional fields:
      hints:   a helpful hint shown when someone picks a wrong option

  This unit is listed in data/lessons.ts, which also describes the
  shape of this data for the computer. You don't need to edit that.
*/

import type {
  Unit,
  VocabularyItem,
  Speaker,
  ConversationLine,
  ChoiceQuestion,
  GameStep,
} from "./lessons";

// ---------------------------------------------------------------
// WHO IS TALKING in the conversations and game
// ---------------------------------------------------------------
const speakers: Record<string, Speaker> = {
  traveler: { name: "Emma (traveler)", emoji: "🧳" },
  staff: { name: "Airport staff", emoji: "👩‍✈️" },
  officer: { name: "Officer", emoji: "👮" },
  hotel: { name: "Hotel staff", emoji: "🛎️" },
};

// ===============================================================
// LESSON 1 — Airport signs
// ===============================================================
const lesson1Words: VocabularyItem[] = [
  { korean: "터미널", romanization: "teomineol", english: "terminal", emoji: "🏢" },
  { korean: "입국", romanization: "ipguk", english: "entry (immigration into the country)", emoji: "🛬" },
  { korean: "출국", romanization: "chulguk", english: "departure (leaving the country)", emoji: "🛫" },
  { korean: "도착", romanization: "dochak", english: "arrival / arrivals", emoji: "📥" },
  { korean: "수하물 찾는 곳", romanization: "suhamul channeun got", english: "baggage claim", emoji: "🛄" },
  { korean: "입구", romanization: "ipgu", english: "entrance", emoji: "🚪➡️" },
  { korean: "출구", romanization: "chulgu", english: "exit", emoji: "🚪⬅️" },
  { korean: "환승", romanization: "hwanseung", english: "transfer", emoji: "🔁" },
  { korean: "세관", romanization: "segwan", english: "customs", emoji: "🛃" },
  { korean: "게이트", romanization: "geiteu", english: "gate", emoji: "🚪" },
];

const lesson1Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "안녕하세요. 도와주실 수 있나요?", romanization: "annyeonghaseyo. dowajusil su innayo?", english: "Hello. Could you help me?", emoji: "🙏" },
  { speaker: "staff", korean: "네, 안녕하세요.", romanization: "ne, annyeonghaseyo.", english: "Yes, hello.", emoji: "👍" },
  { speaker: "traveler", korean: "수하물 찾는 곳은 어디예요?", romanization: "suhamul channeun goseun eodiyeyo?", english: "Where is baggage claim?", emoji: "🛄" },
  { speaker: "staff", korean: "저기예요.", romanization: "jeogiyeyo.", english: "It's over there.", emoji: "👉" },
];

const lesson1Missions: ChoiceQuestion[] = [
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

// ===============================================================
// LESSON 2 — Passports & tickets
// ===============================================================
const lesson2Words: VocabularyItem[] = [
  { korean: "항공편", romanization: "hanggongpyeon", english: "flight", emoji: "✈️" },
  { korean: "표", romanization: "pyo", english: "ticket", emoji: "🎫" },
  { korean: "탑승권", romanization: "tapseunggwon", english: "boarding pass", emoji: "🎟️" },
  { korean: "여권", romanization: "yeogwon", english: "passport", emoji: "🛂" },
  { korean: "짐", romanization: "jim", english: "luggage", emoji: "🧳" },
  { korean: "확인하다", romanization: "hwaginhada", english: "to check / verify", emoji: "✅" },
  { korean: "신고하다", romanization: "singohada", english: "to declare / report", emoji: "📝" },
  { korean: "제출하다", romanization: "jechulhada", english: "to submit", emoji: "📤" },
  { korean: "보여 주다", romanization: "boyeo juda", english: "to show", emoji: "👀" },
];

const lesson2Conversation: ConversationLine[] = [
  { speaker: "officer", korean: "안녕하세요. 여권 보여 주세요.", romanization: "annyeonghaseyo. yeogwon boyeo juseyo.", english: "Hello. Please show me your passport.", emoji: "🛂" },
  { speaker: "traveler", korean: "네.", romanization: "ne.", english: "Yes. (Emma hands over her passport.)", emoji: "📘" },
  { speaker: "officer", korean: "한국에 처음 왔어요?", romanization: "hanguge cheoeum wasseoyo?", english: "Is this your first time in Korea?", emoji: "🇰🇷" },
  { speaker: "traveler", korean: "네. 한국에 처음 왔어요.", romanization: "ne. hanguge cheoeum wasseoyo.", english: "Yes. This is my first time in Korea.", emoji: "1️⃣" },
  { speaker: "officer", korean: "신고할 물건 있어요?", romanization: "singohal mulgeon isseoyo?", english: "Do you have anything to declare?", emoji: "📝" },
  { speaker: "traveler", korean: "아니요.", romanization: "aniyo.", english: "No.", emoji: "🙅" },
];

const lesson2Missions: ChoiceQuestion[] = [
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
    prompt: "🎟️ The gate agent asks for your boarding pass. Which word is \"boarding pass\"?",
    options: ["표", "탑승권", "여권"],
    answer: "탑승권",
    explanation: "탑승권 = boarding pass.",
    hints: {
      "표": "표 is a ticket in general, like a bus ticket. A boarding pass is 탑승권.",
      "여권": "여권 is your passport.",
    },
  },
  {
    prompt: "🧳 You're waiting for your bags. Which word is \"luggage\"?",
    options: ["짐", "표", "항공편"],
    answer: "짐",
    explanation: "짐 = luggage.",
    hints: {
      "표": "표 means ticket.",
      "항공편": "항공편 means flight.",
    },
  },
  {
    prompt: "📝 A customs form asks if you have anything to declare. Which word means \"to declare\"?",
    options: ["제출하다", "확인하다", "신고하다"],
    answer: "신고하다",
    explanation: "신고하다 = to declare / report.",
    hints: {
      "제출하다": "제출하다 means \"to submit.\"",
      "확인하다": "확인하다 means \"to check.\"",
    },
  },
];

// ===============================================================
// LESSON 3 — Into the city
// ===============================================================
const lesson3Words: VocabularyItem[] = [
  { korean: "택시", romanization: "taeksi", english: "taxi", emoji: "🚕" },
  { korean: "교통카드", romanization: "gyotongkadeu", english: "transportation card", emoji: "💳" },
  { korean: "환전", romanization: "hwanjeon", english: "currency exchange", emoji: "💱" },
  { korean: "공항버스", romanization: "gonghangbeoseu", english: "airport bus", emoji: "🚌✈️" },
  { korean: "지하철", romanization: "jihacheol", english: "subway", emoji: "🚇" },
  { korean: "버스", romanization: "beoseu", english: "bus", emoji: "🚌" },
  { korean: "정류장", romanization: "jeongnyujang", english: "stop / station", emoji: "🚏" },
  { korean: "버스 정류장", romanization: "beoseu jeongnyujang", english: "bus stop", emoji: "🚏🚌" },
  { korean: "가다", romanization: "gada", english: "to go", emoji: "➡️" },
  { korean: "오다", romanization: "oda", english: "to come", emoji: "⬅️" },
];

const lesson3Conversation: ConversationLine[] = [
  { speaker: "traveler", korean: "안녕하세요. 도와주실 수 있나요?", romanization: "annyeonghaseyo. dowajusil su innayo?", english: "Hello. Could you help me?", emoji: "🙏" },
  { speaker: "staff", korean: "네, 안녕하세요.", romanization: "ne, annyeonghaseyo.", english: "Yes, hello.", emoji: "👍" },
  { speaker: "traveler", korean: "공항버스 정류장은 어디예요?", romanization: "gonghangbeoseu jeongnyujangeun eodiyeyo?", english: "Where is the airport bus stop?", emoji: "🚏" },
  { speaker: "staff", korean: "5번 출구예요.", romanization: "obeon chulguyeyo.", english: "It's exit 5. (5번 = number 5)", emoji: "🚪5️⃣" },
  { speaker: "traveler", korean: "안녕히 계세요.", romanization: "annyeonghi gyeseyo.", english: "Goodbye. (Emma is leaving; the staff member stays.)", emoji: "🧍👋" },
  { speaker: "staff", korean: "안녕히 가세요.", romanization: "annyeonghi gaseyo.", english: "Goodbye. (Emma is the one leaving.)", emoji: "🚶‍♀️👋" },
];

const lesson3Missions: ChoiceQuestion[] = [
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
    prompt: "🚌 Your hotel is downtown. Which word is \"airport bus\"?",
    options: ["지하철", "공항버스", "버스 정류장"],
    answer: "공항버스",
    explanation: "공항 (airport) + 버스 (bus) = 공항버스.",
    hints: {
      "지하철": "지하철 is the subway.",
      "버스 정류장": "버스 정류장 is a bus stop — where you wait for the bus.",
    },
  },
];

// ===============================================================
// LESSON 4 — GAME: get through Incheon Airport
// Each step: a situation, (optional) what someone says to you,
// then the options to choose from.
// ===============================================================
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

// Review: the app speaks the Korean; the learner picks the English.
const listeningQuestions: ChoiceQuestion[] = [
  { prompt: "여권", options: ["ticket", "passport", "luggage"], answer: "passport" },
  { prompt: "환전", options: ["transfer", "customs", "currency exchange"], answer: "currency exchange" },
  { prompt: "출구", options: ["exit", "entrance", "gate"], answer: "exit" },
  { prompt: "세관", options: ["customs", "arrivals", "terminal"], answer: "customs" },
  { prompt: "수하물 찾는 곳", options: ["boarding pass", "baggage claim", "bus stop"], answer: "baggage claim" },
  { prompt: "입국", options: ["departure", "transfer", "entry (immigration)"], answer: "entry (immigration)" },
  { prompt: "지하철은 어디예요?", options: ["Where is the subway?", "Where is the bus stop?", "Where is the exit?"], answer: "Where is the subway?" },
];

// ===============================================================
// THE WHOLE UNIT (puts the lessons above together)
// ===============================================================
export const airportUnit: Unit = {
  id: "airport",
  title: "Airport",
  description: "Get through Incheon Airport and into the city.",
  icon: "✈️",
  image: "/units/airport.svg",
  color: "#2a9d8f",

  lessons: [
    {
      id: "airport-1",
      title: "Airport signs",
      description: "Read the signs: arrivals, baggage claim, customs, exits.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Airport signs",
            intro: "Emma needs to find her bags.",
            conversation: lesson1Conversation,
            words: lesson1Words,
            phrases: [],
            grammar: [],
            missions: lesson1Missions,
          },
        ],
      },
    },
    {
      id: "airport-2",
      title: "Passports & tickets",
      description: "Passports, boarding passes, luggage, and talking to the officer.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Passports & tickets",
            intro: "Emma reaches immigration. Listen to what the officer asks.",
            conversation: lesson2Conversation,
            words: lesson2Words,
            phrases: [],
            grammar: [],
            missions: lesson2Missions,
          },
        ],
      },
    },
    {
      id: "airport-3",
      title: "Into the city",
      description: "Change money and find a bus, subway, or taxi.",
      sections: {
        speakers: speakers,
        study: [
          {
            title: "Into the city",
            intro: "Emma needs a bus into the city.",
            conversation: lesson3Conversation,
            words: lesson3Words,
            phrases: [],
            grammar: [],
            missions: lesson3Missions,
          },
        ],
      },
    },
    {
      id: "airport-4",
      title: "Game: Incheon Airport",
      description: "Use everything you've learned to get from the plane to your hotel.",
      sections: {
        speakers: speakers,
        study: [],
        game: {
          title: "Get through Incheon Airport",
          intro: "You've just landed at Incheon Airport 🇰🇷. Get through immigration, baggage claim, and customs, then find your way to the hotel. Pick the right Korean at each step!",
          steps: gameSteps,
          finish: "You made it to your hotel! 🏨 You got through Incheon Airport in Korean.",
        },
        review: {
          title: "Review",
          flashcards: [...lesson1Words, ...lesson2Words, ...lesson3Words],
          listening: listeningQuestions,
        },
      },
    },
  ],
};
