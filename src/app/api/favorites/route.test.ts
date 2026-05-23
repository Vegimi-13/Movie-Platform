/**
 * @jest-environment node
 */

import { GET } from "@/app/api/favorites/route";
import { getSessionUser } from "@/lib/session";

jest.mock("@/lib/session", () => ({
  getSessionUser: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectDB: jest.fn(),
}));

jest.mock("@/models/Favorite", () => ({
  __esModule: true,
  default: {},
}));

describe("/api/favorites", () => {
  it("rejects favorite reads when user is not logged in", async () => {
    jest.mocked(getSessionUser).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe("Login required.");
  });
});
