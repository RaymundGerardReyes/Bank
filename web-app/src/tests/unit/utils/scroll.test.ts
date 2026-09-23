import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  smoothScrollTo,
  smoothScrollToTop,
  isReducedMotionPreferred,
} from "@/utils/scroll";

describe("scroll utility", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("returns false for isReducedMotionPreferred when matchMedia matches false", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(isReducedMotionPreferred()).toBe(false);
  });

  it("returns true for isReducedMotionPreferred when matchMedia matches true", () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    expect(isReducedMotionPreferred()).toBe(true);
  });

  it("returns false when matchMedia is not a function or throws", () => {
    const originalMatchMedia = window.matchMedia;
    // @ts-expect-error testing undefined matchMedia
    window.matchMedia = undefined;
    expect(isReducedMotionPreferred()).toBe(false);

    window.matchMedia = vi.fn().mockImplementation(() => {
      throw new Error("matchMedia error");
    });
    expect(isReducedMotionPreferred()).toBe(false);

    window.matchMedia = originalMatchMedia;
  });

  it("calls scrollIntoView with smooth behavior when reduced motion is false", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    const el = document.createElement("div");
    el.id = "target-section";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    smoothScrollTo("target-section");

    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });

  it("correctly resolves target string containing leading hash (#)", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    const el = document.createElement("div");
    el.id = "features";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    smoothScrollTo("#features");

    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  });

  it("calls scrollIntoView with auto behavior when reduced motion is true", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });

    const el = document.createElement("div");
    el.id = "target-section";
    el.scrollIntoView = vi.fn();
    document.body.appendChild(el);

    smoothScrollTo(el);

    expect(el.scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
      inline: "nearest",
    });
  });

  it("gracefully falls back to parameterless scrollIntoView if options throw", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });

    const el = document.createElement("div");
    el.id = "target-section";
    el.scrollIntoView = vi.fn().mockImplementation((opts) => {
      if (typeof opts === "object") {
        throw new Error("Options not supported");
      }
    });
    document.body.appendChild(el);

    expect(() => smoothScrollTo(el)).not.toThrow();
    expect(el.scrollIntoView).toHaveBeenCalledTimes(2);
  });

  it("scrolls window to top with smooth behavior via smoothScrollToTop", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false });
    window.scrollTo = vi.fn();

    smoothScrollToTop();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  });

  it("scrolls window to top with auto behavior when reduced motion is preferred", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    window.scrollTo = vi.fn();

    smoothScrollToTop();

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  });

  it("gracefully handles non-existent elements without error", () => {
    expect(() => smoothScrollTo("non-existent-id")).not.toThrow();
    expect(() => smoothScrollTo("#non-existent-id")).not.toThrow();
    expect(() => smoothScrollTo(null)).not.toThrow();
    expect(() => smoothScrollTo(undefined)).not.toThrow();
  });
});

