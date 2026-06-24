import { describe, it, expect } from "vitest";
import { client } from "../src/client.js";

describe("Example", () => {
  it("TC-001 GET request returns 200", async () => {
    const response = await client.get("/");
    expect(response.status, "TC-001: response status should be 200").toBe(200);
  });
});
