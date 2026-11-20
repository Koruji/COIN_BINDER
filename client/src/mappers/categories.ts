import { Category, CategoryRow } from "@/types/categories";
import { Expense } from "@/types/expenses";
import { toExpenseRow } from "./expenses";

export function toCategoryRow(category: Category, expenses: Expense[] = []): CategoryRow {
    return {
        id: category.id,
        name: category.label,
        expenses: expenses.map(toExpenseRow),
    };
}
