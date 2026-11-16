// Client-side shared passcode gate (requested explicitly by the school).
// This is a convenience gate, not real security: the code lives in the browser bundle.
export const SITE_PASSCODE = "1234";
const KEY = "safiya-site-unlocked";

export function checkPasscode(input: string) {
  return input.trim() === SITE_PASSCODE;
}
export function isUnlockedClient() {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(KEY) === "1"; } catch { return false; }
}
export function setUnlockedClient() {
  try { window.localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
}
