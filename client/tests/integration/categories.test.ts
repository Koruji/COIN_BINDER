import { getCategories } from "@/api/categories";

const PRISM_URL = "http://localhost:4010";

describe("GET /categories", () => {
  test("send correct categories entities", async () => {
    const categories = await getCategories(PRISM_URL);

    expect(categories.length).toBeGreaterThan(0);
    expect(categories[0]).toMatchObject({
      id: expect.any(Number),
      user_id: expect.any(Number),
      label: expect.any(String),
      amount: expect.any(Number),
      created_at: expect.any(String),
    });
  });
});
