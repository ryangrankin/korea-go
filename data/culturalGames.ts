/*
  KOREAN CULTURE ARCADE — GAME CONTENT
  ====================================
  This file holds ALL the questions, choices, and explanations for the
  culture mini games on the Mini Games page. The app reads from here, so
  you can change the games without touching any other code.

  HOW TO EDIT (no coding needed):
  - Change text between the "quotes". Keep the quotes and the commas.
  - Each round has:
      picture:  what's shown at the top: `image` (a drawing in
                public/culture/), `emoji` (shown if there's no image),
                `alt` (a short description of the picture for screen
                readers), and an optional `caption`. The drawings were made
                for this app; keep the bottom-left corner of a new drawing
                empty, because the mascot pup stands there. Add `credit` if
                a photo's license asks for one.
      prompt:   the question or situation
      choices:  2–4 options. Each choice has:
                  text:          what's on the button (Korean or English)
                  romanization:  (optional) shown under Korean text, if the
                                 learner has romanization turned on
                  english:       (optional) meaning, shown after answering
                  feedback:      why this choice is right or not — shown
                                 when someone picks it
      answer:   must match one choice's `text` EXACTLY
      fact:     a short cultural note, shown after the right answer
  - A Day in Seoul rounds also have `place` and an optional `line`
    (what someone says to you). Instead of choices, they have `build`:
      words:   the right sentence, split into word bank tiles, in order
               e.g. words: ["이거", "하나", "주세요."]
      extra:   1–2 tiles that don't belong (to make it a real choice)
      romanization, english:  the whole sentence
      hint:    shown when someone submits a wrong sentence
    Make sure only ONE order of the words is correct.
  - Write cultural notes with "often", "many people", etc. Practices
    vary by person, place, and generation.

  Each game also has a difficulty: "easy", "medium", or "hard" (shown as
  Easy / Medium / Challenge). To rename the levels or change what they
  mean, edit DIFFICULTIES below.

  The three kinds of game:
    "quiz":     pick the right answer; try again as many times as you like.
    "scenario": pick what you'd do; see the reasoning behind every option.
    "story":    a short adventure in order, building sentences from a
                word bank; wrong tries give a hint.
*/

export type Picture = {
  emoji: string;
  alt: string;
  caption?: string;
  image?: string; // optional photo path, e.g. "/culture/bibimbap.jpg"
  credit?: string; // photo credit, if the license asks for one
};

export type Choice = {
  text: string;
  romanization?: string;
  english?: string;
  feedback: string;
};

export type Line = {
  speaker: string; // e.g. "☕ Barista"
  korean: string;
  romanization: string;
  english: string;
};

// A sentence to build from a word bank (A Day in Seoul).
export type Build = {
  words: string[]; // the right sentence, one word bank tile per item, in order
  extra: string[]; // extra tiles that don't belong
  romanization: string; // the whole sentence
  english: string;
  hint: string; // shown after a wrong try
};

export type Round = {
  picture: Picture;
  place?: string; // A Day in Seoul only
  line?: Line; // A Day in Seoul only
  prompt: string;
  // Each round has EITHER choices + answer (pick one) OR build (word bank).
  choices?: Choice[];
  answer?: string;
  build?: Build;
  fact: string;
};

export type Difficulty = "easy" | "medium" | "hard";

export const DIFFICULTIES: Record<Difficulty, { label: string; dots: number; description: string }> = {
  easy: { label: "Easy", dots: 1, description: "Match words to pictures. Great for your first week." },
  medium: { label: "Medium", dots: 2, description: "Words plus short descriptions and everyday situations." },
  hard: { label: "Challenge", dots: 3, description: "Build whole Korean sentences from a word bank in real conversations." },
};

export type CultureGame = {
  id: string;
  title: string;
  emoji: string;
  cover?: string; // drawing shown on the game's card, e.g. "/culture/bibimbap.svg"
  description: string;
  difficulty: Difficulty;
  kind: "quiz" | "scenario" | "story";
  intro: string;
  outro: string;
  rounds: Round[];
};

// ===============================================================
// 🍜 KOREAN FOOD EXPLORER
// ===============================================================
const food: CultureGame = {
  id: "food",
  cover: "/culture/bibimbap.svg",
  difficulty: "easy",
  title: "Korean Food Explorer",
  emoji: "🍜",
  description: "Name the dish, hear how to say it, and learn the story behind it.",
  kind: "quiz",
  intro: "Look at each dish and pick its Korean name. Tap 🔊 to hear any name.",
  outro: "맛있게 드세요! (masitge deuseyo — Enjoy your meal!) Now you can order these by name.",
  rounds: [
    {
      picture: { image: "/culture/kimchi.svg", emoji: "🥬", alt: "Napa cabbage", caption: "Spicy fermented napa cabbage, served with almost every meal" },
      prompt: "Which dish is this?",
      choices: [
        { text: "김치", romanization: "gimchi", english: "kimchi", feedback: "Yes! 김치 is fermented vegetables — most often napa cabbage with red pepper flakes, garlic, and salt." },
        { text: "김밥", romanization: "gimbap", english: "gimbap", feedback: "Close in sound! 김밥 is rice and fillings rolled in seaweed (김)." },
        { text: "떡볶이", romanization: "tteokbokki", english: "tteokbokki", feedback: "떡볶이 is chewy rice cakes in a spicy red sauce." },
      ],
      answer: "김치",
      fact: "Many families make a big batch of kimchi together in late autumn. This is called 김장 (gimjang), and it's on UNESCO's list of cultural heritage.",
    },
    {
      picture: { image: "/culture/bibimbap.svg", emoji: "🍚", alt: "A bowl of rice", caption: "Rice topped with vegetables, an egg, and red pepper paste — mix it all together!" },
      prompt: "Which dish is this?",
      choices: [
        { text: "불고기", romanization: "bulgogi", english: "bulgogi", feedback: "불고기 is thin slices of marinated, grilled beef." },
        { text: "비빔밥", romanization: "bibimbap", english: "bibimbap", feedback: "Yes! 비빔밥 is a bowl of rice with toppings you mix together before eating." },
        { text: "냉면", romanization: "naengmyeon", english: "cold noodles", feedback: "냉면 is cold buckwheat noodles in an icy broth." },
      ],
      answer: "비빔밥",
      fact: "비빔 means \"mixed\" and 밥 means \"rice.\" The city of Jeonju is especially famous for its bibimbap.",
    },
    {
      picture: { image: "/culture/tteokbokki.svg", emoji: "🌶️", alt: "A red chili pepper", caption: "Chewy rice cakes in a sweet and spicy red sauce" },
      prompt: "Which dish is this?",
      choices: [
        { text: "호떡", romanization: "hotteok", english: "sweet filled pancake", feedback: "호떡 is a sweet pancake filled with brown sugar syrup." },
        { text: "삼겹살", romanization: "samgyeopsal", english: "grilled pork belly", feedback: "삼겹살 is pork belly grilled at your table." },
        { text: "떡볶이", romanization: "tteokbokki", english: "spicy rice cakes", feedback: "Yes! 떡볶이 is rice cakes (떡) stir-cooked in a spicy, sweet red pepper sauce." },
      ],
      answer: "떡볶이",
      fact: "떡 means rice cake. You'll find 떡볶이 at street stalls and at 분식 (bunsik) snack shops all over Korea.",
    },
    {
      picture: { image: "/culture/bulgogi.svg", emoji: "🥩", alt: "A cut of meat", caption: "Thin slices of beef marinated in soy sauce, sugar, and garlic, then grilled" },
      prompt: "Which dish is this?",
      choices: [
        { text: "불고기", romanization: "bulgogi", english: "bulgogi", feedback: "Yes! 불고기 is sweet, savory marinated beef, cooked over a flame or in a pan." },
        { text: "삼겹살", romanization: "samgyeopsal", english: "grilled pork belly", feedback: "Close — it's also grilled meat! But 삼겹살 is thick slices of pork belly, not marinated beef." },
        { text: "김치", romanization: "gimchi", english: "kimchi", feedback: "김치 is fermented vegetables, often served next to grilled meat." },
      ],
      answer: "불고기",
      fact: "불 means \"fire\" and 고기 means \"meat\" — you met 고기 in the Hangeul lessons!",
    },
    {
      picture: { image: "/culture/gimbap.svg", emoji: "🥢", alt: "Chopsticks", caption: "Rice and fillings like egg, carrot, and spinach, rolled in seaweed and sliced into rounds" },
      prompt: "Which dish is this?",
      choices: [
        { text: "비빔밥", romanization: "bibimbap", english: "bibimbap", feedback: "비빔밥 has the same ingredients in a bowl — but it isn't rolled up." },
        { text: "김치", romanization: "gimchi", english: "kimchi", feedback: "김치 is fermented vegetables, not a roll." },
        { text: "김밥", romanization: "gimbap", english: "gimbap", feedback: "Yes! 김밥 is rice and fillings rolled in seaweed, then sliced." },
      ],
      answer: "김밥",
      fact: "김 means \"seaweed\" and 밥 means \"rice.\" 김밥 is a classic picnic and road-trip food.",
    },
    {
      picture: { image: "/culture/hotteok.svg", emoji: "🥞", alt: "A stack of pancakes", caption: "A sweet pancake filled with brown sugar, cinnamon, and nuts — a winter street snack" },
      prompt: "Which snack is this?",
      choices: [
        { text: "호떡", romanization: "hotteok", english: "sweet filled pancake", feedback: "Yes! 호떡 is a chewy pancake with a melted brown sugar filling." },
        { text: "떡볶이", romanization: "tteokbokki", english: "spicy rice cakes", feedback: "떡볶이 is a street snack too, but it's spicy, not sweet." },
        { text: "냉면", romanization: "naengmyeon", english: "cold noodles", feedback: "냉면 is cold noodles — the opposite of a warm winter snack!" },
      ],
      answer: "호떡",
      fact: "Careful — the syrup inside is very hot! 호떡 stalls are especially popular on cold winter days.",
    },
    {
      picture: { image: "/culture/samgyeopsal.svg", emoji: "🥓", alt: "Strips of bacon", caption: "Thick slices of pork belly grilled at your table, then wrapped in lettuce" },
      prompt: "Which dish is this?",
      choices: [
        { text: "불고기", romanization: "bulgogi", english: "bulgogi", feedback: "불고기 is thin, marinated beef. This one is unmarinated pork belly." },
        { text: "삼겹살", romanization: "samgyeopsal", english: "grilled pork belly", feedback: "Yes! 삼겹살 is grilled at the table, often by the diners themselves." },
        { text: "비빔밥", romanization: "bibimbap", english: "bibimbap", feedback: "비빔밥 is a mixed rice bowl, not grilled meat." },
      ],
      answer: "삼겹살",
      fact: "삼 means \"three\" and 겹 means \"layer\" — the three layers of pork belly. People often wrap each bite in lettuce with garlic and 쌈장 (ssamjang, a dipping paste).",
    },
    {
      picture: { image: "/culture/naengmyeon.svg", emoji: "🍜", alt: "A bowl of noodles", caption: "Chewy buckwheat noodles in an icy cold broth — perfect for summer" },
      prompt: "Which dish is this?",
      choices: [
        { text: "라면", romanization: "ramyeon", english: "instant noodles", feedback: "라면 is noodles too, but in a hot, spicy soup." },
        { text: "떡볶이", romanization: "tteokbokki", english: "spicy rice cakes", feedback: "떡볶이 is rice cakes, not noodles." },
        { text: "냉면", romanization: "naengmyeon", english: "cold noodles", feedback: "Yes! 냉면 is served ice-cold, sometimes with ice floating in the broth." },
      ],
      answer: "냉면",
      fact: "냉 means \"cold\" and 면 means \"noodles.\" The noodles are long, so servers often offer scissors to cut them.",
    },
  ],
};

// ===============================================================
// 🎵 K-POP & KOREAN MUSIC
// ===============================================================
const music: CultureGame = {
  id: "music",
  cover: "/culture/samulnori.svg",
  difficulty: "medium",
  title: "K-Pop & Korean Music",
  emoji: "🎵",
  description: "Learn music words, then explore K-pop, trot, pansori, and more.",
  kind: "quiz",
  intro: "Start with some music words, then guess the kind of Korean music from each description.",
  outro: "From K-pop to pansori, Korean music has many sounds. Which one would you like to hear on your trip?",
  rounds: [
    {
      picture: { image: "/culture/music-notes.svg", emoji: "🎶", alt: "Musical notes" },
      prompt: "Which word means \"music\"?",
      choices: [
        { text: "음악", romanization: "eumak", english: "music", feedback: "Yes! 음악 means music." },
        { text: "노래", romanization: "norae", english: "song", feedback: "노래 means \"song\" — a piece of music you sing." },
        { text: "춤", romanization: "chum", english: "dance", feedback: "춤 means \"dance.\"" },
      ],
      answer: "음악",
      fact: "You'll see 음악 in words like 음악회 (eumakhoe), a concert.",
    },
    {
      picture: { image: "/culture/microphone.svg", emoji: "🎤", alt: "A microphone" },
      prompt: "Which word means \"song\"?",
      choices: [
        { text: "가수", romanization: "gasu", english: "singer", feedback: "가수 is the person who sings — a singer." },
        { text: "노래", romanization: "norae", english: "song", feedback: "Yes! 노래 means song." },
        { text: "음악", romanization: "eumak", english: "music", feedback: "음악 means music in general." },
      ],
      answer: "노래",
      fact: "Remember 노래방 (noraebang)? 노래 (song) + 방 (room) = a karaoke room you rent with friends.",
    },
    {
      picture: { image: "/culture/dancer.svg", emoji: "💃", alt: "A person dancing" },
      prompt: "Which word means \"dance\"?",
      choices: [
        { text: "춤", romanization: "chum", english: "dance", feedback: "Yes! 춤 means dance." },
        { text: "노래", romanization: "norae", english: "song", feedback: "노래 means song." },
        { text: "가수", romanization: "gasu", english: "singer", feedback: "가수 means singer." },
      ],
      answer: "춤",
      fact: "Learning K-pop choreography is a popular hobby — fans around the world post \"dance cover\" videos.",
    },
    {
      picture: { image: "/culture/singer.svg", emoji: "🧑‍🎤", alt: "A singer" },
      prompt: "Which word means \"singer\"?",
      choices: [
        { text: "음악", romanization: "eumak", english: "music", feedback: "음악 means music." },
        { text: "춤", romanization: "chum", english: "dance", feedback: "춤 means dance." },
        { text: "가수", romanization: "gasu", english: "singer", feedback: "Yes! 가수 means singer." },
      ],
      answer: "가수",
      fact: "가수 is used for every kind of singer — K-pop idols, trot stars, folk singers, and more.",
    },
    {
      picture: { image: "/culture/kpop-stage.svg", emoji: "🌟", alt: "A shining star", caption: "A group sings and dances in sharp, perfectly matched choreography while fans wave light sticks" },
      prompt: "What kind of Korean music is this?",
      choices: [
        { text: "판소리", romanization: "pansori", english: "traditional sung storytelling", feedback: "판소리 is one singer telling a long story — no big group or choreography." },
        { text: "케이팝", romanization: "keipap", english: "K-pop", feedback: "Yes! Group performances with choreography are a big part of K-pop." },
        { text: "트로트", romanization: "teuroteu", english: "trot", feedback: "트로트 singers usually perform solo, with a very different, older style." },
      ],
      answer: "케이팝",
      fact: "K-pop performers often train for years before they debut. Many fan groups have their own official light sticks and cheers.",
    },
    {
      picture: { image: "/culture/trot-radio.svg", emoji: "📻", alt: "A radio", caption: "Catchy songs with a swinging beat and a special vibrating voice, loved for about a hundred years — by grandparents and, lately, younger fans too" },
      prompt: "What kind of Korean music is this?",
      choices: [
        { text: "트로트", romanization: "teuroteu", english: "trot", feedback: "Yes! 트로트 is one of Korea's oldest pop music styles." },
        { text: "케이팝", romanization: "keipap", english: "K-pop", feedback: "K-pop is much newer — it took off in the 1990s." },
        { text: "사물놀이", romanization: "samullori", english: "traditional percussion", feedback: "사물놀이 is drums and gongs, with no singing." },
      ],
      answer: "트로트",
      fact: "트로트 had a huge comeback around 2019–2020 thanks to TV singing competitions.",
    },
    {
      picture: { image: "/culture/pansori.svg", emoji: "🥁", alt: "A drum", caption: "One singer tells a long story through song and speech, while one drummer keeps the beat and calls out encouragement" },
      prompt: "What kind of Korean music is this?",
      choices: [
        { text: "사물놀이", romanization: "samullori", english: "traditional percussion", feedback: "사물놀이 has four players and no storyteller." },
        { text: "판소리", romanization: "pansori", english: "traditional sung storytelling", feedback: "Yes! 판소리 is a singer and a drummer telling a story together." },
        { text: "케이팝", romanization: "keipap", english: "K-pop", feedback: "K-pop is modern pop music, often performed by groups." },
      ],
      answer: "판소리",
      fact: "판소리 is on UNESCO's list of cultural heritage. A complete performance of one story can last for hours!",
    },
    {
      picture: { image: "/culture/samulnori.svg", emoji: "🪘", alt: "A long drum", caption: "Four players, two drums and two gongs, playing fast and exciting rhythms" },
      prompt: "What kind of Korean music is this?",
      choices: [
        { text: "트로트", romanization: "teuroteu", english: "trot", feedback: "트로트 is sung pop music, not drums and gongs." },
        { text: "판소리", romanization: "pansori", english: "traditional sung storytelling", feedback: "판소리 uses just one drum, with a singer." },
        { text: "사물놀이", romanization: "samullori", english: "traditional percussion", feedback: "Yes! 사물놀이 is four traditional percussion instruments played together." },
      ],
      answer: "사물놀이",
      fact: "사물 means \"four objects\" and 놀이 means \"play.\" The instruments are often said to stand for thunder, rain, wind, and clouds.",
    },
    {
      picture: { image: "/culture/arirang.svg", emoji: "🏞️", alt: "A landscape with mountains and a river", caption: "A folk song with many regional versions, so well known it's sometimes called Korea's unofficial anthem" },
      prompt: "Which song is this?",
      choices: [
        { text: "아리랑", romanization: "arirang", english: "Arirang (a folk song)", feedback: "Yes! 아리랑 is Korea's best-known folk song." },
        { text: "노래방", romanization: "noraebang", english: "karaoke room", feedback: "노래방 is a place to sing, not a song." },
        { text: "판소리", romanization: "pansori", english: "traditional sung storytelling", feedback: "판소리 is a style of storytelling music, not one song." },
      ],
      answer: "아리랑",
      fact: "There are dozens of regional versions of 아리랑. It's on UNESCO's list of cultural heritage too.",
    },
  ],
};

// ===============================================================
// 👗 KOREAN FASHION & STYLE
// ===============================================================
const fashion: CultureGame = {
  id: "fashion",
  cover: "/culture/hanbok.svg",
  difficulty: "easy",
  title: "Korean Fashion & Style",
  emoji: "👗",
  description: "From 한복 to street style: clothing words and what to wear where.",
  kind: "quiz",
  intro: "Learn clothing words, then choose what to wear in different places in Korea.",
  outro: "Korean style is as varied as the people who wear it — from 한복 on holidays to streetwear in Hongdae.",
  rounds: [
    {
      picture: { image: "/culture/hanbok.svg", emoji: "👗", alt: "A dress", caption: "Traditional Korean clothing: a short jacket (저고리) with a long, full skirt (치마) or roomy pants (바지)" },
      prompt: "What is this traditional clothing called?",
      choices: [
        { text: "한복", romanization: "hanbok", english: "traditional Korean clothing", feedback: "Yes! 한복 is traditional Korean clothing." },
        { text: "치마", romanization: "chima", english: "skirt", feedback: "치마 is the skirt — just one part of a hanbok." },
        { text: "모자", romanization: "moja", english: "hat", feedback: "모자 means hat." },
      ],
      answer: "한복",
      fact: "Many people wear 한복 for special days: holidays like 설날 (Lunar New Year) and 추석 (Chuseok), weddings, and a baby's first birthday (돌잔치).",
    },
    {
      picture: { image: "/culture/pants.svg", emoji: "👖", alt: "A pair of jeans" },
      prompt: "Which word means \"pants\"?",
      choices: [
        { text: "치마", romanization: "chima", english: "skirt", feedback: "치마 means skirt." },
        { text: "바지", romanization: "baji", english: "pants", feedback: "Yes! 바지 means pants." },
        { text: "신발", romanization: "sinbal", english: "shoes", feedback: "신발 means shoes." },
      ],
      answer: "바지",
      fact: "A traditional men's 한복 has roomy 바지 tied at the ankles, worn with a jacket called 저고리 (jeogori).",
    },
    {
      picture: { image: "/culture/shoes.svg", emoji: "👟", alt: "A sneaker" },
      prompt: "Which word means \"shoes\"?",
      choices: [
        { text: "신발", romanization: "sinbal", english: "shoes", feedback: "Yes! 신발 means shoes." },
        { text: "모자", romanization: "moja", english: "hat", feedback: "모자 means hat." },
        { text: "바지", romanization: "baji", english: "pants", feedback: "바지 means pants." },
      ],
      answer: "신발",
      fact: "You'll often take off your 신발 when you enter a home, a temple hall, or a restaurant with floor seating.",
    },
    {
      picture: { image: "/culture/palace.svg", emoji: "📸", alt: "A camera with a flash", caption: "You're visiting Gyeongbokgung Palace in Seoul and want to dress up for photos" },
      prompt: "What do many visitors rent from shops near the palace?",
      choices: [
        { text: "한복", romanization: "hanbok", english: "traditional Korean clothing", feedback: "Yes! Hanbok rental shops line the streets near Seoul's palaces." },
        { text: "등산복", romanization: "deungsanbok", english: "hiking clothes", feedback: "Hiking clothes are for the mountains, not palace photos." },
        { text: "수영복", romanization: "suyeongbok", english: "swimsuit", feedback: "A swimsuit isn't the look for a royal palace!" },
      ],
      answer: "한복",
      fact: "Visitors wearing 한복 can enter Seoul's main royal palaces for free — and everyone is welcome to join in, including tourists.",
    },
    {
      picture: { image: "/culture/temple.svg", emoji: "🙏", alt: "Hands pressed together", caption: "You're visiting a Buddhist temple" },
      prompt: "What's a good choice of clothing and shoes?",
      choices: [
        { text: "Comfortable clothes that cover your shoulders and knees, with shoes that slip off easily", feedback: "Great choice! Modest, comfortable clothes show respect, and you'll take your shoes off before entering a hall." },
        { text: "Your shortest shorts and a tank top — it's a hot day", feedback: "Temples are places of worship. Many visitors choose clothes that cover a bit more, even in summer." },
        { text: "Anything you like, and keep your shoes on inside the halls", feedback: "Shoes usually come off before you step into a temple hall — look for the shoes lined up outside the door." },
      ],
      answer: "Comfortable clothes that cover your shoulders and knees, with shoes that slip off easily",
      fact: "Temples are places of worship as well as sights. Some even offer 템플스테이 (templestay) programs where visitors can stay overnight.",
    },
    {
      picture: { image: "/culture/hiking.svg", emoji: "⛰️", alt: "A mountain", caption: "On the weekend, you join the crowds hiking a mountain trail near Seoul" },
      prompt: "What do many Korean hikers wear?",
      choices: [
        { text: "한복", romanization: "hanbok", english: "traditional Korean clothing", feedback: "Hanbok is lovely, but it's not made for steep trails!" },
        { text: "Colorful outdoor gear: jackets, hiking boots, and hats", feedback: "Yes! Many hikers wear full outdoor gear — sometimes very stylish." },
        { text: "A formal suit", feedback: "A suit would be very uncomfortable on a mountain trail." },
      ],
      answer: "Colorful outdoor gear: jackets, hiking boots, and hats",
      fact: "Hiking (등산, deungsan) is a hugely popular hobby, especially for middle-aged and older Koreans. Plenty of people just wear comfy clothes, too.",
    },
    {
      picture: { image: "/culture/city.svg", emoji: "🏙️", alt: "A city skyline", caption: "Walking around Seoul on an ordinary weekday" },
      prompt: "Which statement about everyday fashion in Korea is most accurate?",
      choices: [
        { text: "Most people wear 한복 every day", feedback: "Today, 한복 is mostly worn for special days, events, and fun — not daily life." },
        { text: "Everyone dresses the same way", feedback: "Not at all! Style depends on the person, their job, their age, and where they are." },
        { text: "People wear many different styles, from casual streetwear to office suits, and trends change fast", feedback: "Yes! Like anywhere, people dress in many ways — and Korean fashion trends move quickly." },
      ],
      answer: "People wear many different styles, from casual streetwear to office suits, and trends change fast",
      fact: "Neighborhoods like Hongdae and Seongsu are known for creative street style, while modern designers also reinvent 한복 with everyday fabrics and cuts.",
    },
  ],
};

// ===============================================================
// 🙇 KOREAN MANNERS & ETIQUETTE
// ===============================================================
const etiquette: CultureGame = {
  id: "etiquette",
  cover: "/culture/greeting-elder.svg",
  difficulty: "medium",
  title: "Korean Manners & Etiquette",
  emoji: "🙇",
  description: "What would you do? Make choices in everyday situations and see why.",
  kind: "scenario",
  intro:
    "Pick what you would do in each situation, then read why. What's polite can depend on the person, the place, and the generation — these are common expectations, not strict rules.",
  outro:
    "Remember: people know you're a visitor! Trying to be polite matters more than being perfect, and you can always watch what others do.",
  rounds: [
    {
      picture: { image: "/culture/greeting-elder.svg", emoji: "👵", alt: "An older woman", caption: "Your friend introduces you to her grandmother" },
      prompt: "What might you do?",
      choices: [
        { text: "Bow slightly and say 안녕하세요", romanization: "annyeonghaseyo", feedback: "A small bow with 안녕하세요 shows respect. With older people, many bow a little deeper." },
        { text: "Wave and say \"Hey!\"", feedback: "A casual wave can feel too informal for an older person you're just meeting — though it's fine with friends your age." },
        { text: "Give her a big hug right away", feedback: "Hugs are usually saved for close family and friends. If she hugs you, of course, hug back!" },
      ],
      answer: "Bow slightly and say 안녕하세요",
      fact: "Age matters in Korean social life, and greetings often show respect to elders. Younger generations may be more relaxed, especially among friends.",
    },
    {
      picture: { image: "/culture/home-entrance.svg", emoji: "🏠", alt: "A house", caption: "You're invited to a friend's apartment. At the door, you see shoes lined up by the entrance." },
      prompt: "What do you do?",
      choices: [
        { text: "Keep your shoes on, but wipe them on the mat", feedback: "In most Korean homes, shoes stay at the entrance — wiping them isn't enough." },
        { text: "Take off your shoes at the entrance", feedback: "Yes! The lined-up shoes are your clue. Many hosts also offer slippers." },
        { text: "Take your shoes off once you reach the living room", feedback: "Shoes come off right at the entrance area, before you step up into the home." },
      ],
      answer: "Take off your shoes at the entrance",
      fact: "Many Korean homes have heated floors (온돌, ondol), and people often sit on the floor — so floors are kept clean.",
    },
    {
      picture: { image: "/culture/two-hands.svg", emoji: "🤝", alt: "A handshake", caption: "An older coworker hands you their business card" },
      prompt: "How do you take it?",
      choices: [
        { text: "With one hand, then put it straight into your pocket", feedback: "One hand can seem casual here, and pocketing the card right away can look like you don't value it." },
        { text: "Wait for them to set it down on the table", feedback: "It's kinder to take it from their hands — they're offering it to you." },
        { text: "With both hands, then take a moment to look at it", feedback: "Yes! Using two hands shows respect, especially with someone older or senior." },
      ],
      answer: "With both hands, then take a moment to look at it",
      fact: "When giving or receiving something — a card, a gift, or a drink — many people use both hands, or the right hand with the left hand touching the wrist.",
    },
    {
      picture: { image: "/culture/subway-seat.svg", emoji: "🚇", alt: "A subway train", caption: "The subway is busy. There's an empty seat in a specially colored section near the doors." },
      prompt: "What do you do?",
      choices: [
        { text: "Leave it free — it's a priority seat", feedback: "Yes! Priority seats are for older people, pregnant passengers, and people with disabilities or injuries." },
        { text: "Sit down and stay there for the whole ride", feedback: "Those seats are kept for people who need them most, so many riders leave them empty even when the train is busy." },
        { text: "Put your bag on it", feedback: "Bags on seats take space from people who need to sit. A lap or the rack above is better." },
      ],
      answer: "Leave it free — it's a priority seat",
      fact: "Many trains also have pink seats for pregnant passengers. Subways are often quiet, too — many riders keep calls short and voices low.",
    },
    {
      picture: { image: "/culture/family-meal.svg", emoji: "🍲", alt: "A pot of stew", caption: "You're having dinner with your friend's family, and the food arrives" },
      prompt: "When do you start eating?",
      choices: [
        { text: "Right away, so the food doesn't get cold", feedback: "Starting first can seem rude. Hungry is okay — just wait a moment!" },
        { text: "After the oldest person starts, or tells you to go ahead", feedback: "Yes! Waiting for the eldest is a common sign of respect. Often they'll say \"Eat!\" (드세요, deuseyo) to welcome you." },
        { text: "Only after everyone else has finished", feedback: "No need to wait that long — you eat together!" },
      ],
      answer: "After the oldest person starts, or tells you to go ahead",
      fact: "Many people say 잘 먹겠습니다 (jal meokgetseumnida, \"I'll eat well\") before a meal, and 잘 먹었습니다 (jal meogeotseumnida) after — a thank-you to whoever cooked or paid.",
    },
    {
      picture: { image: "/culture/directions.svg", emoji: "🗺️", alt: "A map", caption: "You're lost and need to ask a stranger about your age for directions" },
      prompt: "How do you start?",
      choices: [
        { text: "야, 지하철역 어디야?", romanization: "ya, jihacheol-yeok eodiya?", english: "Hey, where's the subway station? (casual)", feedback: "This is casual speech (반말, banmal). It's for close friends and younger family — with strangers it can sound rude, even at the same age." },
        { text: "저기요, 지하철역이 어디예요?", romanization: "jeogiyo, jihacheol-yeogi eodiyeyo?", english: "Excuse me, where is the subway station? (polite)", feedback: "Yes! 저기요 gets their attention politely, and the 요 ending keeps it polite." },
        { text: "지하철역!", romanization: "jihacheol-yeok!", english: "Subway station!", feedback: "Just the word works in a pinch, but adding 저기요 and a polite 요 ending is much friendlier." },
      ],
      answer: "저기요, 지하철역이 어디예요?",
      fact: "저기요 (jeogiyo) literally means \"over there,\" and it's a polite way to get someone's attention — you can also use it to call a server in a restaurant.",
    },
  ],
};

// ===============================================================
// 🏙️ A DAY IN SEOUL
// ===============================================================
const seoul: CultureGame = {
  id: "seoul",
  cover: "/culture/palace.svg",
  difficulty: "hard",
  title: "A Day in Seoul",
  emoji: "🏙️",
  description: "Build Korean sentences from a word bank to get through a day: café, subway, palace, market, and dinner.",
  kind: "story",
  intro:
    "It's your first full day in Seoul! At each stop, tap words from the word bank to build what you want to say — you'll hear each word as you add it. Then press Submit. Some words don't belong, and you can try as many times as you like.",
  outro: "What a day! You ordered, rode the subway, visited a palace, shopped at a market, and ate dinner — all in Korean. 수고했어요! (sugohaesseoyo — Great job!)",
  rounds: [
    {
      picture: { image: "/culture/iced-coffee.svg", emoji: "☕", alt: "A cup of iced coffee" },
      place: "☕ Morning · A café",
      line: { speaker: "🧑 Barista", korean: "어서 오세요! 주문하시겠어요?", romanization: "eoseo oseyo! jumunhasigesseoyo?", english: "Welcome! Would you like to order?" },
      prompt: "Order one iced Americano.",
      build: {
        words: ["아이스", "아메리카노", "한 잔", "주세요."],
        extra: ["두 잔", "이에요."],
        romanization: "aiseu amerikano han jan juseyo.",
        english: "One iced Americano, please.",
        hint: "Say what you want first, then how many (한 잔 = one cup), and end with 주세요 (please give me).",
      },
      fact: "Iced Americano is so popular that people joke about 얼죽아 (eoljuga) — \"iced Americano, even if I freeze to death\" — and drink it all winter.",
    },
    {
      picture: { image: "/culture/coffee-togo.svg", emoji: "🥤", alt: "A to-go coffee cup and bag" },
      place: "☕ Morning · A café",
      line: { speaker: "🧑 Barista", korean: "여기서 드시고 가세요?", romanization: "yeogiseo deusigo gaseyo?", english: "For here?" },
      prompt: "Say no — you'd like it to go.",
      build: {
        words: ["아니요,", "포장해", "주세요."],
        extra: ["네,", "여기서"],
        romanization: "aniyo, pojanghae juseyo.",
        english: "No, to go, please.",
        hint: "Start by answering the question (아니요 = no). 포장 means takeout, and 주세요 comes last.",
      },
      fact: "Cafés often serve \"for here\" drinks in reusable mugs or glasses and \"to go\" drinks in takeout cups — that's why they ask.",
    },
    {
      picture: { image: "/culture/subway-gate.svg", emoji: "🚇", alt: "A subway fare gate with a card reader" },
      place: "🚇 Late morning · The subway",
      prompt: "You need a transportation card to ride the subway. Ask the convenience store clerk for one.",
      build: {
        words: ["교통카드", "하나", "주세요."],
        extra: ["여권", "어디예요?"],
        romanization: "gyotongkadeu hana juseyo.",
        english: "One transportation card, please.",
        hint: "Thing you want → how many (하나 = one) → 주세요. 여권 is a passport.",
      },
      fact: "Cards like T-money work on subways and buses, and even in many taxis and convenience stores. You can top them up at station machines.",
    },
    {
      picture: { image: "/culture/exit-sign.svg", emoji: "🚪", alt: "A yellow exit sign with the number 5" },
      place: "🚇 Late morning · The subway",
      line: { speaker: "📢 Announcement", korean: "이번 역은 경복궁역입니다.", romanization: "ibeon yeogeun gyeongbokgungyeogimnida.", english: "This stop is Gyeongbokgung Station." },
      prompt: "That's your stop! The palace is near exit 5. Ask a station worker where exit 5 is.",
      build: {
        words: ["5번", "출구는", "어디예요?"],
        extra: ["입구는", "얼마예요?"],
        romanization: "obeon chulguneun eodiyeyo?",
        english: "Where is exit 5?",
        hint: "Start with what you're looking for (5번 출구 = exit 5), then ask 어디예요? (where is it?). 입구 is an entrance.",
      },
      fact: "Station exits are numbered, so directions in Korea often say things like \"5번 출구\" (exit 5).",
    },
    {
      picture: { image: "/culture/palace.svg", emoji: "👑", alt: "Gwanghwamun, the main gate of Gyeongbokgung Palace" },
      place: "👑 Afternoon · Gyeongbokgung Palace",
      line: { speaker: "👨‍👩‍👧 A family", korean: "사진 좀 찍어 주세요.", romanization: "sajin jom jjigeo juseyo.", english: "Could you take a photo for us?" },
      prompt: "You take the family's photo. Now ask them to take one of you! (Listen to what they said.)",
      build: {
        words: ["사진", "좀", "찍어", "주세요."],
        extra: ["먹어", "얼마예요?"],
        romanization: "sajin jom jjigeo juseyo.",
        english: "Could you take a photo (for me)?",
        hint: "You can borrow the family's exact words: 사진 (photo) 좀 (please, softly) 찍어 (take) 주세요.",
      },
      fact: "Gyeongbokgung was first built in 1395. Many visitors explore it in rented 한복 — which gets you in for free!",
    },
    {
      picture: { image: "/culture/market.svg", emoji: "🛍️", alt: "A market food stall with pancakes on a griddle" },
      place: "🛍️ Evening · Gwangjang Market",
      line: { speaker: "🧑‍🍳 Vendor", korean: "맛있어요! 드셔 보세요!", romanization: "masisseoyo! deusyeo boseyo!", english: "It's delicious! Try some!" },
      prompt: "The pancakes look great. Point and ask how much this one is.",
      build: {
        words: ["이거", "얼마예요?"],
        extra: ["뭐예요?", "어디예요?"],
        romanization: "igeo eolmayeyo?",
        english: "How much is this?",
        hint: "이거 = this. 얼마 asks \"how much\" — 뭐 is \"what\" and 어디 is \"where.\"",
      },
      fact: "\"오천 원이에요!\" (ocheon wonieyo — It's 5,000 won.) Gwangjang Market is one of Seoul's oldest markets, famous for 빈대떡 (bindaetteok) mung bean pancakes.",
    },
    {
      picture: { image: "/culture/bindaetteok.svg", emoji: "🥞", alt: "A golden mung bean pancake with dipping sauce" },
      place: "🛍️ Evening · Gwangjang Market",
      prompt: "You'd like to buy one. Ask for one of these.",
      build: {
        words: ["이거", "하나", "주세요."],
        extra: ["두", "뭐예요?"],
        romanization: "igeo hana juseyo.",
        english: "One of these, please.",
        hint: "이거 (this) → 하나 (one) → 주세요 (please give me).",
      },
      fact: "Many market stalls take cards now, but carrying some cash is still handy for small purchases.",
    },
    {
      picture: { image: "/culture/restaurant.svg", emoji: "🍽️", alt: "A restaurant table set for one" },
      place: "🍽️ Night · Dinner",
      line: { speaker: "🧑 Server", korean: "몇 분이세요?", romanization: "myeot buniseyo?", english: "How many people?" },
      prompt: "You're eating alone tonight. Tell the server it's just one person.",
      build: {
        words: ["한", "명이요."],
        extra: ["두", "세"],
        romanization: "han myeongiyo.",
        english: "One person.",
        hint: "한 = one, 두 = two, 세 = three. The counter for people (명) comes after the number.",
      },
      fact: "Eating alone, called 혼밥 (honbap), is common in Korea, and many restaurants have seats just for solo diners.",
    },
    {
      picture: { image: "/culture/jjigae.svg", emoji: "🍲", alt: "A bubbling pot of stew with rice" },
      place: "🍽️ Night · Dinner",
      prompt: "Your food arrives! Say the polite phrase before you start eating.",
      build: {
        words: ["잘", "먹겠습니다!"],
        extra: ["먹었습니다!", "안녕히"],
        romanization: "jal meokgetseumnida!",
        english: "I'll eat well! (said before a meal)",
        hint: "먹겠습니다 is for before you eat; 먹었습니다 (past tense) is for after.",
      },
      fact: "After eating, say 잘 먹었습니다 — and when you pay and leave, 감사합니다 and 안녕히 계세요 work perfectly.",
    },
  ],
};

// The order games appear on the Mini Games page (easiest first).
export const culturalGames: CultureGame[] = [food, fashion, music, etiquette, seoul];

export const findCulturalGame = (id: string) => culturalGames.find((game) => game.id === id);
