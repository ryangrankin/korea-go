/*
  PUP ACCESSORIES
  ===============
  Finishing a lesson unlocks one accessory for the pup, themed around
  Korean food, music, and culture.
  - lessonId: the lesson that unlocks it (see the lesson ids in
    data/alphabet.ts, data/greetings.ts, data/airport.ts,
    data/food.ts)
  - slot:     where it's worn. The pup can wear one item per slot.
  - emoji:    the picture drawn on the pup
  - fact:     a short note about Korean food, music, or culture,
              shown when the accessory is unlocked

  To move where a slot sits on the pup, change SLOTS below. x and y are
  percentages across and down the pup picture; size is a percentage of
  the picture's width.
*/

export type Slot = "head" | "ear" | "eyes" | "neck" | "paw";

export type Accessory = {
  id: string;
  name: string;
  emoji: string;
  slot: Slot;
  lessonId: string;
  fact: string; // a short note about Korean food, music, or culture
};

export const SLOTS: Record<Slot, { label: string; x: number; y: number; size: number; rotate: number }> = {
  head: { label: "Head", x: 52, y: 5, size: 30, rotate: -6 },
  ear: { label: "Ear", x: 15, y: 20, size: 17, rotate: -20 },
  eyes: { label: "Eyes", x: 52, y: 40, size: 34, rotate: -8 },
  neck: { label: "Neck", x: 50, y: 71, size: 16, rotate: 0 },
  paw: { label: "Paw", x: 88, y: 33, size: 23, rotate: 8 },
};

export const accessories: Accessory[] = [
  // Unit 0: Hangeul
  { id: "mugunghwa", name: "Mugunghwa (무궁화)", emoji: "🌺", slot: "ear", lessonId: "hangeul-1",
    fact: "Korea's national flower, the rose of Sharon. Its name means \"never-ending flower.\"" },
  { id: "chopsticks", name: "Chopsticks (젓가락)", emoji: "🥢", slot: "paw", lessonId: "hangeul-2",
    fact: "Korean chopsticks are usually metal, and a little flat." },
  { id: "ramyeon", name: "Ramyeon (라면)", emoji: "🍜", slot: "paw", lessonId: "hangeul-3",
    fact: "A favorite quick meal. Koreans eat some of the most instant noodles per person in the world." },
  { id: "arirang", name: "Arirang note (아리랑)", emoji: "🎵", slot: "neck", lessonId: "hangeul-4",
    fact: "Arirang is Korea's best-known folk song, on UNESCO's list of world heritage." },
  { id: "kite", name: "Kite (연)", emoji: "🪁", slot: "paw", lessonId: "hangeul-5",
    fact: "Kite flying (연날리기) is a traditional game around Lunar New Year." },
  { id: "chikin", name: "Fried chicken (치킨)", emoji: "🍗", slot: "paw", lessonId: "hangeul-6",
    fact: "치킨 is an English word in Hangeul! Fried chicken with friends is a Korean favorite." },
  { id: "headphones", name: "K-pop headphones", emoji: "🎧", slot: "head", lessonId: "hangeul-7",
    fact: "You can read Hangeul now — time to sing along to some K-pop!" },
  // Unit 1: Greetings
  { id: "beotkkot", name: "Cherry blossom (벚꽃)", emoji: "🌸", slot: "ear", lessonId: "greetings-1",
    fact: "Every spring, cherry blossom festivals fill cities like Jinhae and Seoul." },
  { id: "goguma", name: "Sweet potato (고구마)", emoji: "🍠", slot: "paw", lessonId: "greetings-2",
    fact: "Roasted sweet potatoes (군고구마) are a classic winter street snack." },
  { id: "mandu", name: "Dumpling (만두)", emoji: "🥟", slot: "paw", lessonId: "greetings-3",
    fact: "Mandu are Korean dumplings — steamed, fried, or in soup." },
  { id: "bell", name: "Temple bell (종)", emoji: "🔔", slot: "neck", lessonId: "greetings-4",
    fact: "At midnight on New Year's, Seoul's Bosingak bell rings 33 times." },
  { id: "mic", name: "Noraebang mic (노래방)", emoji: "🎤", slot: "paw", lessonId: "greetings-5",
    fact: "노래방 means \"song room\" — karaoke with friends in a private room." },
  // Unit 2: Airport
  { id: "shades", name: "K-pop star shades", emoji: "🕶️", slot: "eyes", lessonId: "airport-1",
    fact: "K-pop stars' \"airport fashion\" is followed by fans around the world." },
  { id: "janggu", name: "Janggu drum (장구)", emoji: "🪘", slot: "paw", lessonId: "airport-2",
    fact: "The janggu is an hourglass-shaped drum used in traditional Korean music." },
  { id: "eomuk", name: "Fish cake skewer (어묵)", emoji: "🍢", slot: "paw", lessonId: "airport-3",
    fact: "Street stalls serve 어묵 skewers with a cup of warm broth." },
  { id: "lantern", name: "Festival lantern (연등)", emoji: "🏮", slot: "paw", lessonId: "airport-4",
    fact: "Lanterns light up Seoul's streets for the Lotus Lantern Festival (연등회)." },
  // Unit 3: Food and Dining
  { id: "sutgarak", name: "Spoon (숟가락)", emoji: "🥄", slot: "paw", lessonId: "food-1",
    fact: "Koreans eat rice and soup with a spoon, and use chopsticks for side dishes." },
  { id: "kimchi", name: "Kimchi (김치)", emoji: "🥬", slot: "paw", lessonId: "food-2",
    fact: "There are hundreds of kinds of kimchi, and it comes free as a 반찬 with almost every meal." },
  { id: "bap", name: "Rice bowl (밥)", emoji: "🍚", slot: "paw", lessonId: "food-3",
    fact: "Some stews come without rice, so you order a bowl of rice (공깃밥) on the side." },
  { id: "tteok", name: "Rice cake (떡)", emoji: "🍡", slot: "paw", lessonId: "food-4",
    fact: "On Chuseok, the autumn harvest holiday, families make half-moon rice cakes called 송편." },
  { id: "gochu", name: "Chili pepper (고추)", emoji: "🌶️", slot: "ear", lessonId: "food-5",
    fact: "Red chili flakes (고춧가루) give kimchi and many stews their heat and color." },
  { id: "aa", name: "Iced americano (아아)", emoji: "🧋", slot: "paw", lessonId: "food-6",
    fact: "Iced americano is so popular that people shorten it to 아아 (\"ah-ah\") — even in winter." },
  { id: "bingsu", name: "Bingsu (빙수)", emoji: "🍧", slot: "paw", lessonId: "food-7",
    fact: "Patbingsu is shaved ice topped with sweet red beans, a favorite summer dessert." },
  { id: "gat", name: "Gat hat (갓)", emoji: "🎩", slot: "head", lessonId: "food-8",
    fact: "The gat is a traditional wide-brimmed hat made of horsehair and bamboo, worn by men in the Joseon era." },
];

export const accessoryForLesson = (lessonId: string) =>
  accessories.find((item) => item.lessonId === lessonId);
