/**
 * @jest-environment node
 */

import { POST } from "@/app/api/reviews/route";
import { getSessionUser } from "@/lib/session";

jest.mock("@/lib/session", () => ({
  getSessionUser: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
  connectDB: jest.fn(),
}));

jest.mock("@/models/Review", () => ({
  __esModule: true,
  default: {},
}));

describe("/api/reviews", () => {
  it("rejects review creation when user is not logged in", async () => {
    jest.mocked(getSessionUser).mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/reviews", {
        method: "POST",
        body: JSON.stringify({ movieId: "movie-1", rating: 8, comment: "Great movie" }),
      })
    );
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.message).toBe("Login required.");
  });
});
