/**
 * Smooth scrolling navigation utilities for the banking platform.
 *
 * Implements accessible, native scroll handling that strictly respects
 * user preference for reduced motion (prefers-reduced-motion).
 */

export interface SmoothScrollOptions {
  behavior?: ScrollBehavior;
  block?: ScrollLogicalPosition;
  inline?: ScrollLogicalPosition;
}

/**
 * Checks whether the user has requested reduced motion at the OS/browser level.
 */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)")?.matches ?? false;
  } catch {
    return false;
  }
}

/**
 * Smoothly scrolls an element or an element with the given ID (with or without #) into view.
 * If the user prefers reduced motion, it immediately scrolls without animation.
 *
 * @param target HTMLElement or string element ID (e.g. 'features' or '#features')
 * @param options Optional scrollIntoView settings
 */
export function smoothScrollTo(
  target: HTMLElement | string | null | undefined,
  options?: SmoothScrollOptions
): void {
  if (typeof window === "undefined" || !target) {
    return;
  }

  const element =
    typeof target === "string"
      ? document.getElementById(target.replace(/^#/, ""))
      : target;

  if (!element || typeof element.scrollIntoView !== "function") {
    return;
  }

  const reducedMotion = isReducedMotionPreferred();

  try {
    element.scrollIntoView({
      behavior: reducedMotion ? "auto" : (options?.behavior ?? "smooth"),
      block: options?.block ?? "start",
      inline: options?.inline ?? "nearest",
    });
  } catch {
    // Fallback for older browsers or environments that do not support scrollIntoView options
    element.scrollIntoView();
  }
}

/**
 * Smoothly scrolls the window to the top of the page.
 * Respects reduced-motion preferences.
 */
export function smoothScrollToTop(options?: { behavior?: ScrollBehavior }): void {
  if (typeof window === "undefined") {
    return;
  }
  const reducedMotion = isReducedMotionPreferred();
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reducedMotion ? "auto" : (options?.behavior ?? "smooth"),
    });
  } catch {
    window.scrollTo(0, 0);
  }
}

