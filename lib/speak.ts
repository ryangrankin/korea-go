/*
  SPEAK KOREAN OUT LOUD
  Uses the browser's built-in voice (the Web Speech API, "speechSynthesis").
  No audio files needed. If the device has no Korean voice, we send a
  "korea-go-no-voice" message, and the SpeechNotice component shows a
  friendly note on screen instead of failing silently.
*/

export const NO_VOICE_EVENT = "korea-go-no-voice";

// Slightly slower than normal speed (1 = normal) so beginners can follow.
const SPEAKING_RATE = 0.8;

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
export async function speakKorean(text: string) {
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
  utterance.rate = SPEAKING_RATE;
  window.speechSynthesis.speak(utterance);
}
