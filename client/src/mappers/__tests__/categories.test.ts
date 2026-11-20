import { Category } from "@/types/categories";
import { Expense } from "@/types/expenses";
import { toCategoryRow } from "../categories";

const category: Category = {
  id: 10,
  user_id: 2,
  label: "Sorties, events",
  amount: 999,
  created_at: "2026-10-01T00:00:00Z",
};

const makeExpense = (id: number, label: string, amount: number): Expense => ({
  id,
  label,
  user_id: 2,
  category_id: 10,
  month: "2026-10-01T00:00:00Z",
  amount,
  created_at: "2026-10-02T00:00:00Z",
});

describe("toCategoryRow", () => {
  test("renames label to name and keeps the id", () => {
    const result = toCategoryRow(category, []);

    expect(result.id).toBe(10);
    expect(result.name).toBe("Sorties, events");
  });

  test("maps every expense to an expense row", () => {
    const result = toCategoryRow(category, [
      makeExpense(1, "Concert", 200),
      makeExpense(2, "Cinéma", 12.5),
    ]);

    expect(result.expenses).toEqual([
      { id: 1, label: "Concert", amount: 200 },
      { id: 2, label: "Cinéma", amount: 12.5 },
    ]);
  });

  test("returns an empty list when the category has no expenses", () => {
    expect(toCategoryRow(category, []).expenses).toEqual([]);
    expect(toCategoryRow(category).expenses).toEqual([]);
  });

  test("does not carry over the API amount, user_id or created_at", () => {
    expect(toCategoryRow(category, [])).toEqual({
      id: 10,
      name: "Sorties, events",
      expenses: [],
    });
  });

  test("does not modify its inputs", () => {
    const expenses = [makeExpense(1, "Concert", 200)];
    const categoryCopy = structuredClone(category);
    const expensesCopy = structuredClone(expenses);

    toCategoryRow(category, expenses);

    expect(category).toEqual(categoryCopy);
    expect(expenses).toEqual(expensesCopy);
  });
});
