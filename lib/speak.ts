/*
  SPEAK KOREAN OUT LOUD
  Uses the browser's built-in voice (the Web Speech API, "speechSynthesis").
  This is COMPUTER-GENERATED speech (text-to-speech), not recordings of a
  native speaker — the app says so to learners (components/AudioNotice.tsx).
  Volume is set to the maximum the voice allows; the device volume does
  the rest. Only one clip plays at a time (each new one stops the last).

  - speakKorean(text):                 normal learning speed (or slower, if
                                       "Slower pronunciation" is on in Settings)
  - speakKorean(text, { slow: true }): extra slow, for the 🐢 buttons

  If the device has no Korean voice, we send a "korea-go-no-voice" message,
  and the SpeechNotice component shows a friendly note instead of failing
  silently.
*/

export const NO_VOICE_EVENT = "korea-go-no-voice";

// Speeds (1 = the voice's normal speed).
const NORMAL_RATE = 0.85; // a little slower than everyday speech, for learners
const SLOW_RATE = 0.55; // 🐢 slow replay, to hear each sound

// "Slower pronunciation" in Settings makes every clip slow.
function prefersSlowAudio(): boolean {
  try {
    return JSON.parse(localStorage.getItem("koreaGoPreferences") || "{}").slowAudio === true;
  } catch {
    return false;
  }
}

// Tell the rest of the app that Korean audio isn't available.
function reportNoVoice(reason: string) {
  window.dispatchEvent(new CustomEvent(NO_VOICE_EVENT, { detail: reason }));
}

// Find a Korean voice on this device, if there is one.
function findKoreanVoice(): SpeechSynthesisVoice | undefined {
  return window.speechSynthesis
    .getVoices()
    .find((voice) => voice.lang.toLowerCase().replace("_", "-").startsWith("ko"));
}

// Some browsers load their voice list a moment after the page opens.
// This waits (up to 1.5 seconds) for that list to arrive.
function waitForVoices(): Promise<void> {
  return new Promise((resolve) => {
    if (window.speechSynthesis.getVoices().length > 0) return resolve();

    const done = () => {
      window.speechSynthesis.removeEventListener("voiceschanged", done);
      resolve();
    };
    window.speechSynthesis.addEventListener("voiceschanged", done);
    setTimeout(done, 1500);
  });
}

// Main function: say this Korean text out loud.
export async function speakKorean(text: string, options: { slow?: boolean } = {}) {
  if (typeof window === "undefined") return;

  if (!("speechSynthesis" in window)) {
    reportNoVoice("This browser can't play speech.");
    return;
  }

  // Blanks like "___" can't be read aloud, so remove them.
  const cleanText = text.replace(/_+/g, " ").trim();
  if (!cleanText) return;

  // If the voice list is already loaded, speak right away (iPhones may
  // block speech that starts after a delay). Otherwise wait for it.
  if (window.speechSynthesis.getVoices().length === 0) {
    await waitForVoices();
  }
  const voice = findKoreanVoice();

  if (!voice) {
    reportNoVoice("No Korean voice was found on this device.");
    return;
  }

  // Stop anything that's still talking, then speak.
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = "ko-KR";
  utterance.voice = voice;
  utterance.rate = options.slow || prefersSlowAudio() ? SLOW_RATE : NORMAL_RATE;
  utterance.volume = 1; // the loudest the voice allows
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}
