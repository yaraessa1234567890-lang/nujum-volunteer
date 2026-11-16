import { describe, it, expect } from "vitest";
import { checkPasscode } from "./site-gate";
describe("site passcode", () => {
  it("accepts 1234", () => expect(checkPasscode("1234")).toBe(true));
  it("rejects wrong code", () => expect(checkPasscode("1900")).toBe(false));
});
