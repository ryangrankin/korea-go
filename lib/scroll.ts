/*
  KEEP A QUESTION ON SCREEN
  When the next question appears, we don't jump to the top of the page
  (that loses your place). We only scroll if the top of the question box
  has gone above the screen, and then just far enough to show it again.
*/

// Space to leave above the box, in pixels, so it doesn't touch the screen edge.
const MARGIN = 16;

export function keepTopInView(element: HTMLElement | null) {
  if (!element) return;
  const top = element.getBoundingClientRect().top;
  if (top >= 0) return; // already visible: leave the page where it is
  window.scrollBy({ top: top - MARGIN, behavior: "smooth" });
}
