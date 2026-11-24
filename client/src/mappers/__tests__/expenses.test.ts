import { Expense } from "@/types/expenses";
import { toExpenseRow } from "../expenses";

const makeExpense = (overrides: Partial<Expense> = {}): Expense => ({
  id: 1,
  label: "Civic",
  user_id: 2,
  category_id: 3,
  month: "2026-10-01T00:00:00Z",
  amount: 350.9,
  created_at: "2026-10-02T00:00:00Z",
  ...overrides,
});

describe("toExpenseRow", () => {
  test("keeps only id, label, amount and month", () => {
    expect(toExpenseRow(makeExpense())).toEqual({
      id: 1,
      label: "Civic",
      amount: 350.9,
      month: "2026-10-01T00:00:00Z",
    });
  });

  test("works when the expense has no category", () => {
    const expense = makeExpense({ category_id: undefined });

    expect(toExpenseRow(expense)).toEqual({
      id: 1,
      label: "Civic",
      amount: 350.9,
      month: "2026-10-01T00:00:00Z",
    });
  });

  test("does not modify the input", () => {
    const expense = makeExpense();
    const copy = structuredClone(expense);

    toExpenseRow(expense);

    expect(expense).toEqual(copy);
  });
});
