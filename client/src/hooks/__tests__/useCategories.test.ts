import { act, renderHook, waitFor } from "@testing-library/react-native";

import { getCategories } from "@/api/categories";
import { getExpensesByCategory } from "@/api/expenses";
import { Category } from "@/types/categories";
import { Expense } from "@/types/expenses";
import { useCategories } from "../useCategories";

jest.mock("@/api/categories");
jest.mock("@/api/expenses");

const mockGetCategories = jest.mocked(getCategories);
const mockGetExpenses = jest.mocked(getExpensesByCategory);

const makeCategory = (id: number, label: string): Category => ({
  id,
  user_id: 1,
  label,
  amount: 0,
  created_at: "2026-10-01T00:00:00Z",
});

const makeExpense = (id: number, categoryId: number, amount: number): Expense => ({
  id,
  label: `Expense ${id}`,
  user_id: 1,
  category_id: categoryId,
  month: "2026-10-01T00:00:00Z",
  amount,
  created_at: "2026-10-02T00:00:00Z",
});

describe("useCategories", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("starts in a loading state", async () => {
    mockGetCategories.mockReturnValue(new Promise(() => {}));

    const { result } = await renderHook(() => useCategories());

    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("loads categories with their expenses", async () => {
    mockGetCategories.mockResolvedValue([
      makeCategory(1, "Courses"),
      makeCategory(2, "Abonnements"),
    ]);
    mockGetExpenses.mockImplementation(async (id) =>
      id === 1 ? [makeExpense(10, 1, 54.3)] : [],
    );

    const { result } = await renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([
      { id: 1, name: "Courses", expenses: [{ id: 10, label: "Expense 10", amount: 54.3, month: "2026-10-01T00:00:00Z" }] },
      { id: 2, name: "Abonnements", expenses: [] },
    ]);
  });

  it("exposes the error message when the API fails", async () => {
    mockGetCategories.mockRejectedValue(new Error("boom"));

    const { result } = await renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("boom");
    expect(result.current.categories).toEqual([]);
  });

  it("falls back to a generic message for non-Error rejections", async () => {
    mockGetCategories.mockRejectedValue("nope");

    const { result } = await renderHook(() => useCategories());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBe("Unknown error");
  });

  it("reloads the data and clears a previous error", async () => {
    mockGetCategories.mockRejectedValueOnce(new Error("boom"));
    const { result } = await renderHook(() => useCategories());
    await waitFor(() => expect(result.current.error).toBe("boom"));

    mockGetCategories.mockResolvedValue([makeCategory(1, "Courses")]);
    mockGetExpenses.mockResolvedValue([]);

    await act(async () => {
      result.current.reload();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([{ id: 1, name: "Courses", expenses: [] }]);
  });

  it("switches back to loading while reloading", async () => {
    mockGetCategories.mockResolvedValueOnce([]);
    const { result } = await renderHook(() => useCategories());
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockGetCategories.mockReturnValueOnce(new Promise(() => {}));
    await act(async () => {
      result.current.reload();
    });

    expect(result.current.loading).toBe(true);
  });

  it("ignores the result of an outdated request", async () => {
    let resolveFirst: (value: Category[]) => void = () => {};
    mockGetCategories.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFirst = resolve;
      }),
    );
    const { result } = await renderHook(() => useCategories());

    mockGetCategories.mockResolvedValueOnce([makeCategory(2, "Recent")]);
    mockGetExpenses.mockResolvedValue([]);
    await act(async () => {
      result.current.reload();
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      resolveFirst([makeCategory(1, "Outdated")]);
    });

    expect(result.current.categories).toEqual([{ id: 2, name: "Recent", expenses: [] }]);
    expect(result.current.loading).toBe(false);
  });
});
