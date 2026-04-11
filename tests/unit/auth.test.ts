// tests/unit/auth.test.ts
import { describe, it, expect } from "vitest";
import { getSession, getCurrentUser } from "@/lib/auth";

describe("auth (local workaround mode)", () => {
  it("getSession returns a session with guest user", async () => {
    const session = await getSession();
    expect(session).not.toBeNull();
    expect(session!.user.email).toBe("guest@local.dev");
    expect(session!.access_token).toBe("local-dev-token");
  });

  it("getCurrentUser returns the guest user", async () => {
    const user = await getCurrentUser();
    expect(user).not.toBeNull();
    expect(user!.role).toBe("user");
  });
});
