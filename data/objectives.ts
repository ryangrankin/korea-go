/*
  LEARNING GOALS
  ==============
  What learners will be able to do after each lesson and each unit.
  Shown before a lesson ("In this lesson you'll learn to…"), when it's
  finished ("You can now…"), and on the dashboard, where each unit's
  "can do" list is ticked off as its lessons are finished.

  HOW TO EDIT (no coding needed):
  - Lesson goals: up to 3 short "can do" statements per lesson id
    (lesson ids are in data/alphabet.ts, greetings.ts, airport.ts, food.ts).
  - Unit goals: `skill` is the practical travel skill the unit builds.
    Each `canDo` lists the lessons that teach it — it's ticked off on the
    dashboard only when ALL of those lessons are done. Only list things the
    lessons really teach.
*/

export type UnitGoal = {
  skill: string; // the practical travel skill, e.g. "Get from the plane to the city"
  canDo: { text: string; lessons: string[] }[];
};

export const unitGoals: Record<string, UnitGoal> = {
  hangeul: {
    skill: "Read Korean letters and sound out signs and menus",
    canDo: [
      { text: "Read the basic vowels", lessons: ["hangeul-1", "hangeul-2"] },
      { text: "Read the consonants, including doubled ones", lessons: ["hangeul-3", "hangeul-4"] },
      { text: "Sound out syllable blocks, including bottom consonants", lessons: ["hangeul-5"] },
      { text: "Recognize English words written in Hangul (taxi, hotel, bus…)", lessons: ["hangeul-6"] },
      { text: "Read real signs and menus around Seoul", lessons: ["hangeul-7"] },
    ],
  },
  greetings: {
    skill: "Greet people politely and introduce yourself",
    canDo: [
      { text: "Say hello, sorry, and the right goodbye", lessons: ["greetings-1"] },
      { text: "Say your name and where you're from", lessons: ["greetings-2"] },
      { text: "Ask who, what, where, and someone's name", lessons: ["greetings-3"] },
      { text: "Ask for the bathroom, for help, or if someone speaks English", lessons: ["greetings-4"] },
    ],
  },
  airport: {
    skill: "Get from the plane to the city",
    canDo: [
      { text: "Follow airport signs: arrivals, baggage claim, customs, exits", lessons: ["airport-1"] },
      { text: "Show your passport and answer an immigration or customs officer", lessons: ["airport-2"] },
      { text: "Change money and find a bus, subway, or taxi", lessons: ["airport-3"] },
      { text: "Get through Incheon Airport, start to finish", lessons: ["airport-4"] },
    ],
  },
  food: {
    skill: "Eat out and order coffee in Korean",
    canDo: [
      { text: "Get a table and call the server", lessons: ["food-1"] },
      { text: "Ask what's good and order with the right counters", lessons: ["food-2", "food-3"] },
      { text: "Mention allergies and ask to leave something out", lessons: ["food-4"] },
      { text: "Talk about taste: spicy, sweet, salty", lessons: ["food-5"] },
      { text: "Order coffee, ask the price, and pay — for here or to go", lessons: ["food-6", "food-7"] },
    ],
  },
};

export const lessonObjectives: Record<string, string[]> = {
  // Unit 0: Hangul
  "hangeul-1": ["Recognize six simple vowels by their shape", "Say how each one sounds", "Read your first words, like 아이 (child)"],
  "hangeul-2": ["Turn a vowel into its \"y\" version with one more stroke", "Tell ㅐ and ㅔ apart on sight", "Read words like 우유 (milk)"],
  "hangeul-3": ["Recognize ten basic consonants", "Remember them by the mouth shapes they come from", "Read words like 나무 (tree) and 바다 (sea)"],
  "hangeul-4": ["Hear the difference between plain, airy, and doubled consonants", "Read words like 커피 (coffee) and 기차 (train)"],
  "hangeul-5": ["Put letters together into syllable blocks", "Read a consonant at the bottom of a block (받침)", "Read words like 한국 (Korea) and 서울 (Seoul)"],
  "hangeul-6": ["Sound out English words written in Hangul", "Read taxi, hotel, bus, and camera in Korean"],
  "hangeul-7": ["Read real signs and menus around Seoul", "Review every letter you've learned"],
  // Unit 1: Greetings
  "greetings-1": ["Say hello and sorry politely", "Choose the right goodbye: 안녕히 가세요 or 안녕히 계세요", "Answer yes and no"],
  "greetings-2": ["Say your name and where you're from", "Say it's your first time in Korea", "Use 이에요/예요 and 은/는"],
  "greetings-3": ["Ask who, what, where, when, and how", "Ask someone's name and where they're from"],
  "greetings-4": ["Ask where the bathroom or your hotel is", "Ask for help politely", "Ask if someone speaks English"],
  "greetings-5": ["Use greetings and questions in a real arrival scene", "Review the whole unit"],
  // Unit 2: Airport
  "airport-1": ["Read arrivals, departures, entrance, and exit signs", "Find baggage claim and customs", "Tell 입국/출국 and 입구/출구 apart"],
  "airport-2": ["Hand over your passport or boarding pass when asked", "Answer \"anything to declare?\""],
  "airport-3": ["Find currency exchange", "Ask for a bus, the subway, or a taxi", "Buy a transportation card"],
  "airport-4": ["Get from the plane to your hotel, all in Korean", "Review the whole unit"],
  // Unit 3: Food
  "food-1": ["Get a table and say how many people", "Call the server with 저기요", "Ask for chopsticks, a spoon, or a fork"],
  "food-2": ["Name common Korean dishes", "Ask what something is and what's good"],
  "food-3": ["Order food and drinks with 주세요", "Say how many with the right counter (개, 잔, 명, 인분)"],
  "food-4": ["Name meat, fish, and vegetables", "Say you're allergic, or ask to leave something out"],
  "food-5": ["Describe taste: spicy, sweet, salty, hot, cold", "Ask for it less spicy"],
  "food-6": ["Order coffee or tea, iced or hot", "Ask for a size, ice, or a straw"],
  "food-7": ["Say for here or to go", "Ask the price and read it in won", "Ask to pay by card and get a receipt"],
  "food-8": ["Eat out and order coffee, start to finish", "Review the whole unit"],
};

// The can-do statements for a unit, each marked done if all its lessons are done.
export function unitCanDos(unitId: string, isDone: (lessonId: string) => boolean) {
  return (unitGoals[unitId]?.canDo ?? []).map((item) => ({
    text: item.text,
    done: item.lessons.length > 0 && item.lessons.every(isDone),
  }));
}
