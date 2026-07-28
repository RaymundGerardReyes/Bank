"use client";

import { useEffect } from "react";
import { IDLE_TIMEOUT_MS } from "@/utils/constants";

export function useIdleTimeout(onTimeout: () => void, timeoutMs = IDLE_TIMEOUT_MS) {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(onTimeout, timeoutMs);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onTimeout, timeoutMs]);
}
